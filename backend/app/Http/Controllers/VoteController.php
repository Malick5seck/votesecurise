<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sondage;
use App\Models\Vote;
use App\Models\Reponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // <-- Ajout obligatoire pour journaliser les accès refusés

class VoteController extends Controller
{
    public function voter(Request $request, $sondage_id)
    {
        $user = $request->user(); // Récupère l'utilisateur connecté
        $sondage = Sondage::findOrFail($sondage_id);

        // --- SÉCURITÉ 1 : Vérification stricte de la date limite ---
        if ($sondage->date_fin && \Carbon\Carbon::parse($sondage->date_fin)->isPast()) {
            return response()->json(['message' => 'Ce sondage a expiré. Les votes sont clos.'], 403);
        }

        // --- SÉCURITÉ 1.5 : Vérification des accès (Sondage Privé) ---
        if ($sondage->est_prive) {
            if (!$user) {
                return response()->json(['message' => 'Vous devez être connecté pour participer à ce sondage privé.'], 401);
            }

            // Vérification du domaine restreint (ex: @gmail.com)
            if (!empty($sondage->domaine_restreint) && !str_ends_with($user->email, $sondage->domaine_restreint)) {
                Log::warning("Accès refusé au sondage {$sondage->id} pour l'email {$user->email} (Domaine non autorisé)");
                return response()->json(['message' => 'Vous n’êtes pas autorisé à participer à ce sondage privé.'], 403);
            }

            // Vérification de la liste blanche d'emails (emails_autorises)
            // Assure-toi que 'emails_autorises' est bien "casté" en 'array' dans ton Model Sondage.php
            if (!empty($sondage->emails_autorises) && is_array($sondage->emails_autorises)) {
                if (!in_array($user->email, $sondage->emails_autorises)) {
                    Log::warning("Accès refusé au sondage {$sondage->id} pour l'email {$user->email} (Non présent dans la liste blanche)");
                    return response()->json(['message' => 'Vous n’êtes pas autorisé à participer à ce sondage privé.'], 403);
                }
            }
        }

        // --- SÉCURITÉ 2 : Anti Double-Vote ---
        $dejaVote = false;
        if ($user) {
            $dejaVote = Vote::where('user_id', $user->id)
                            ->where('sondage_id', $sondage->id)
                            ->exists();
        }

        if ($dejaVote) {
            return response()->json(['message' => 'Vous avez déjà voté pour ce sondage.'], 403);
        }

        // --- SÉCURITÉ 3 : Validation du format (avec la nouveauté est_anonyme) ---
        $validated = $request->validate([
            'reponses' => 'required|array',
            'reponses.*.question_id' => 'required|exists:questions,id',
            'reponses.*.option_id' => 'nullable|exists:options,id',
            'reponses.*.valeur_texte' => 'nullable|string',
            'est_anonyme' => 'boolean' // <-- NOUVEAUTÉ : On autorise le champ anonyme
        ]);

        // --- ENREGISTREMENT SÉCURISÉ ---
        try {
            DB::beginTransaction();

            // 1. Création du "Ticket de vote"
            $vote = Vote::create([
                'user_id' => $user ? $user->id : null,
                'sondage_id' => $sondage->id,
                'adresse_ip' => $request->ip(),
                'est_anonyme' => $request->est_anonyme ?? false // <-- NOUVEAUTÉ : On sauvegarde le choix
            ]);

            // 2. Enregistrement du détail des réponses (QCM, Texte, Checkbox...)
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
    
    // --- RÉCUPÉRER L'HISTORIQUE DES VOTES DE L'UTILISATEUR ---
    public function mesVotes(Request $request)
    {
        $votes = Vote::with('sondage')
                    ->where('user_id', $request->user()->id)
                    ->latest() 
                    ->get();

        return response()->json($votes);
    }
}