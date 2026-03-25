<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sondage;
use App\Models\Vote;
use App\Models\Reponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class VoteController extends Controller
{
    public function voter(Request $request, $sondage_id)
    {
        $user = $request->user(); 
        $sondage = Sondage::findOrFail($sondage_id);

        if ($sondage->date_fin && \Carbon\Carbon::parse($sondage->date_fin)->isPast()) {
            return response()->json(['message' => 'Ce sondage a expiré. Les votes sont clos.'], 403);
        }

        if ($sondage->est_prive) {
            if (!$user) {
                return response()->json(['message' => 'Vous devez être connecté pour participer à ce sondage privé.'], 401);
            }

            // Vérification du domaine restreint (ex: @gmail.com)
            if (!empty($sondage->domaine_restreint) && !str_ends_with($user->email, $sondage->domaine_restreint)) {
                Log::warning("Accès refusé au sondage {$sondage->id} pour l'email {$user->email} (Domaine non autorisé)");
                return response()->json(['message' => 'Vous n’êtes pas autorisé à participer à ce sondage privé.'], 403);
            }
            // Vérification de la liste blanche d'emails autorisés
            if (!empty($sondage->emails_autorises) && is_array($sondage->emails_autorises)) {
                if (!in_array($user->email, $sondage->emails_autorises)) {
                    Log::warning("Accès refusé au sondage {$sondage->id} pour l'email {$user->email} (Non présent dans la liste blanche)");
                    return response()->json(['message' => 'Vous n’êtes pas autorisé à participer à ce sondage privé.'], 403);
                }
            }
        }

        //assurer que l'utilisateur ne vote qu'une seule fois pour un sondage 
        $dejaVote = false;
        if ($user) {
            $dejaVote = Vote::where('user_id', $user->id)
                            ->where('sondage_id', $sondage->id)
                            ->exists();
        }

        if ($dejaVote) {
            return response()->json(['message' => 'Vous avez déjà voté pour ce sondage.'], 403);
        }

        $validated = $request->validate([
            'reponses' => 'required|array',
            'reponses.*.question_id' => 'required|exists:questions,id',
            'reponses.*.option_id' => 'nullable|exists:options,id',
            'reponses.*.valeur_texte' => 'nullable|string',
            'est_anonyme' => 'boolean' 
        ]);

        try {
            DB::beginTransaction();

            // Si l'utilisateur est connecté et que le vote n'est pas anonyme, on associe le vote à son ID. Sinon, user_id reste null pour garantir l'anonymat
            $vote = Vote::create([
                'user_id' => $user ? $user->id : null,
                'sondage_id' => $sondage->id,
                'adresse_ip' => $request->ip(),
                'est_anonyme' => $request->est_anonyme ?? false 
            ]);

            // Enregistrement des réponses associées
            foreach ($validated['reponses'] as $rep) {
                Reponse::create([
                    'vote_id' => $vote->id,
                    'question_id' => $rep['question_id'],
                    'option_id' => $rep['option_id'] ?? null,
                    'valeur_texte' => $rep['valeur_texte'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Votre vote a été enregistré avec succès !'], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de l\'enregistrement de votre vote.', 'error' => $e->getMessage()], 500);
        }
    }
    
    // fonction pour afficher les votes d'un utilisateur
    public function mesVotes(Request $request)
    {
        $votes = Vote::with('sondage')
                    ->where('user_id', $request->user()->id)
                    ->latest() 
                    ->get();

        return response()->json($votes);
    }
}