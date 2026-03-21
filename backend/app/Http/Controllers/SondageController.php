<?php

namespace App\Http\Controllers;

use App\Models\Sondage;
use App\Models\Question;
use App\Models\Option;
use App\Models\Reponse;
use Illuminate\Http\Request;
use App\Models\Vote;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class SondageController extends Controller
{
    // --- 1. LISTER TOUS LES SONDAGES ---
    public function index()
    {
        $sondages = Sondage::with('questions')
                           ->withCount('votes') 
                           ->latest()
                           ->get();
                           
        return response()->json($sondages);
    }

    // --- 2. CRÉER UN NOUVEAU SONDAGE ---
    public function store(Request $request)
    {
        // 1. Validation avec les nouveaux champs de restriction
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'est_anonyme' => 'boolean',
            'est_prive' => 'boolean',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'domaine_restreint' => 'nullable|string', // <-- NOUVEAU
            'emails_autorises' => 'nullable|array',   // <-- NOUVEAU
            'message_remerciement' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.titre' => 'required|string',
            'questions.*.type' => 'required|string|in:qcm,checkbox,text,rating,ranking,matrix,condition,boolean,number,date,likert,slider',
            'questions.*.obligatoire' => 'boolean',
            'questions.*.options' => 'nullable|array',
        ]);

        try {
            DB::beginTransaction();

            // 2. Création du sondage avec les restrictions
            $sondage = Sondage::create([
                'user_id' => $request->user()->id,
                'titre' => $validated['titre'],
                'description' => $validated['description'] ?? null,
                'slug' => Str::slug($validated['titre']) . '-' . Str::random(10), // Modification pour avoir un slug plus sûr
                'est_anonyme' => $request->est_anonyme ?? true,
                'est_prive' => $request->est_prive ?? false,
                'date_debut' => $validated['date_debut'] ?? null,
                'date_fin' => $validated['date_fin'] ?? null,
                'domaine_restreint' => $validated['domaine_restreint'] ?? null, // <-- NOUVEAU
                'emails_autorises' => $validated['emails_autorises'] ?? null,   // <-- NOUVEAU
                'message_remerciement' => $validated['message_remerciement'] ?? null,
            ]);

            foreach ($validated['questions'] as $qData) {
                $question = Question::create([
                    'sondage_id' => $sondage->id,
                    'titre' => $qData['titre'],
                    'type' => $qData['type'],
                    'obligatoire' => $qData['obligatoire'] ?? true,
                ]);

                if (in_array($qData['type'], ['qcm', 'checkbox', 'likert', 'boolean', 'ranking', 'matrix']) && !empty($qData['options'])) {
                    foreach ($qData['options'] as $optContenu) {
                        Option::create([
                            'question_id' => $question->id,
                            'contenu' => $optContenu,
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'Sondage créé avec succès', 'sondage' => $sondage], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création du sondage', 'error' => $e->getMessage()], 500);
        }
    }

    // --- 3. AFFICHER UN SONDAGE SPÉCIFIQUE ---
    public function show(Request $request, $id)
    {
        $sondage = Sondage::with('questions.options')
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        $a_deja_vote = false;
        
        if ($user = auth('sanctum')->user()) {
            $a_deja_vote = Vote::where('user_id', $user->id)
                            ->where('sondage_id', $sondage->id)
                            ->exists();
        }

        $sondage->setAttribute('a_deja_vote', $a_deja_vote);

        return response()->json($sondage);
    }

    // --- 4. 📊 CALCULER ET AFFICHER LES RÉSULTATS ---
    public function resultats(Request $request, $id)
    {
        $sondage = Sondage::with('questions.options')->findOrFail($id);
        $user = $request->user();

        // Le Super Admin peut aussi voir les résultats
        if ($sondage->user_id !== $user->id && $user->role !== 'super_admin') {
            return response()->json([
                'message' => 'Accès refusé (Confidentiel). Seul le créateur de ce sondage peut consulter les résultats.'
            ], 403);
        }

        $totalVotes = $sondage->votes()->count();
        $statistiques = [];

        foreach ($sondage->questions as $question) {
            $statsQuestion = [
                'id' => $question->id,
                'titre' => $question->titre,
                'type' => $question->type,
            ];

            if (in_array($question->type, ['qcm', 'checkbox', 'likert', 'boolean', 'ranking', 'matrix'])) {
                $optionsStats = [];
                foreach ($question->options as $option) {
                    $count = Reponse::where('question_id', $question->id)
                                                ->where('option_id', $option->id)
                                                ->count();
                    
                    $optionsStats[] = [
                        'id' => $option->id,
                        'contenu' => $option->contenu,
                        'votes' => $count,
                        'pourcentage' => $totalVotes > 0 ? round(($count / $totalVotes) * 100, 1) : 0
                    ];
                }
                $statsQuestion['options'] = $optionsStats;
            } 
            elseif (in_array($question->type, ['text', 'number', 'date'])) {
                $statsQuestion['reponses_textes'] = Reponse::where('question_id', $question->id)
                                                ->whereNotNull('valeur_texte')
                                                ->latest()
                                                ->take(10)
                                                ->pluck('valeur_texte');
            } 
            elseif (in_array($question->type, ['rating', 'slider'])) {
                $moyenne = Reponse::where('question_id', $question->id)->avg('valeur_texte');
                $statsQuestion['moyenne'] = $moyenne ? round($moyenne, 1) : 0;
            }

            $statistiques[] = $statsQuestion;
        }

        $votesDetail = $sondage->votes()->with(['user', 'reponses.option'])->orderBy('created_at', 'asc')->get();
        
        $participants = $votesDetail->map(function ($vote) use ($sondage) {
            $reponsesFormatees = [];
            foreach ($sondage->questions as $question) {
                $reps = $vote->reponses->where('question_id', $question->id);
                $texteReps = [];
                foreach ($reps as $r) {
                    if ($r->option) $texteReps[] = $r->option->contenu;
                    elseif ($r->valeur_texte !== null) $texteReps[] = $r->valeur_texte;
                }
                $reponsesFormatees[$question->id] = count($texteReps) > 0 ? implode(' | ', $texteReps) : '-';
            }

            return [
                'date' => $vote->created_at->format('d/m/Y H:i:s'),
                'identite' => ($sondage->est_anonyme || $vote->est_anonyme) ? 'Anonyme' : ($vote->user ? $vote->user->name : 'Visiteur'),
                'reponses' => $reponsesFormatees
            ];
        });

        return response()->json([
            'sondage' => [
                'id' => $sondage->id,
                'titre' => $sondage->titre,
                'total_votes' => $totalVotes,
                'est_anonyme' => $sondage->est_anonyme,
                'description' => $sondage->description
            ],
            'statistiques' => $statistiques,
            'participants' => $participants 
        ]);
    }

    // --- 5. SUPPRIMER UN SONDAGE ---
    public function destroy(Request $request, $id)
    {
        $sondage = Sondage::findOrFail($id);
        $user = $request->user();

        // SÉCURITÉ : Le créateur OU le super admin peuvent supprimer
        if ($sondage->user_id !== $user->id && $user->role !== 'super_admin') {
            return response()->json([
                'message' => 'Action non autorisée. Vous n\'êtes pas le propriétaire de ce sondage.'
            ], 403);
        }

        $titreSondage = $sondage->titre; // On garde le titre avant la suppression pour les logs

        try {
            // 🔥 NOUVEAU : Enregistrer l'action d'audit si c'est le Super Admin
            if ($user->role === 'super_admin') {
                DB::table('admin_logs')->insert([
                    'user_id' => $user->id,
                    'action' => 'delete',
                    'description' => "A supprimé le sondage : " . $titreSondage,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            $sondage->delete();
            return response()->json(['message' => 'Sondage supprimé avec succès.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression du sondage.', 
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // --- 6. FORCER LA CLÔTURE D'UN SONDAGE (Super Admin) ---
    public function cloturer(Request $request, $id)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $sondage = Sondage::findOrFail($id);
        $sondage->update(['date_fin' => now()]); 

        // 🔥 NOUVEAU : Enregistrer l'action d'audit
        DB::table('admin_logs')->insert([
            'user_id' => $request->user()->id,
            'action' => 'cloture',
            'description' => "A clôturé le sondage : " . $sondage->titre,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Le sondage a été clôturé avec succès.']);
    }
}