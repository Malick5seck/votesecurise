<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sondage;
use App\Models\Vote;

class VoteController extends Controller
{
    public function voter(Request $request, $sondage_id)
    {
        $user = $request->user(); // Récupère l'utilisateur connecté
        $sondage = Sondage::findOrFail($sondage_id);

        // --- SÉCURITÉ 1 : Vérification de la date limite ---
        if ($sondage->date_fin && now()->greaterThan($sondage->date_fin)) {
            return response()->json(['message' => 'Ce sondage est terminé.'], 403);
        }

        // --- SÉCURITÉ 2 : Vérification du Domaine Restreint (ex: @uadb.edu.sn) ---
        if ($sondage->domaine_restreint) {
            // On extrait le domaine de l'email de l'utilisateur
            $domaineUtilisateur = substr(strrchr($user->email, "@"), 1);
            
            if ($domaineUtilisateur !== $sondage->domaine_restreint) {
                return response()->json([
                    'message' => "Accès refusé. Vous devez utiliser une adresse email se terminant par @{$sondage->domaine_restreint}."
                ], 403);
            }
        }

        // --- SÉCURITÉ 3 : Anti Double-Vote (Vérification Backend) ---
        $dejaVote = Vote::where('user_id', $user->id)
                        ->where('sondage_id', $sondage->id)
                        ->exists();

        if ($dejaVote) {
            return response()->json(['message' => 'Vous avez déjà voté pour ce sondage.'], 403);
        }

        // --- VALIDATION DU VOTE ---
        $request->validate([
            'option_sondage_id' => 'required|exists:options_sondage,id'
        ]);

        // --- ENREGISTREMENT ---
        Vote::create([
            'user_id' => $user->id,
            'sondage_id' => $sondage->id,
            'option_sondage_id' => $request->option_sondage_id,
            'adresse_ip' => $request->ip() // Optionnel, mais bien pour tracer
        ]);

        return response()->json(['message' => 'Votre vote a été enregistré avec succès !'], 201);
    }
}