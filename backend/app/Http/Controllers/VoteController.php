<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sondage;
use App\Models\Vote;
use App\Models\Reponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule; 

class VoteController extends Controller
{
    public function voter(Request $request, $sondage_id)
    {
        $user = $request->user();

        if ($user && $user->isCurrentlyBanned()) {
            $msg = $user->ban_until
                ? 'Votre compte est suspendu jusqu\'au ' . $user->ban_until->timezone(config('app.timezone'))->format('d/m/Y \à H:i') . '. Vous ne pouvez pas voter.'
                : 'Votre compte est suspendu. Vous ne pouvez pas voter.';

            return response()->json(['message' => $msg], 403);
        }

        $sondage = Sondage::findOrFail($sondage_id);

        if ($sondage->date_fin && \Carbon\Carbon::parse($sondage->date_fin)->isPast()) {
            return response()->json(['message' => 'Ce sondage a expiré. Les votes sont clos.'], 403);
        }

        if ($sondage->est_prive) {
            if (!$user) {
                return response()->json(['message' => 'Vous devez être connecté pour participer à ce sondage privé.'], 401);
            }

            if (!empty($sondage->domaine_restreint) && !str_ends_with($user->email, $sondage->domaine_restreint)) {
                Log::warning("Accès refusé au sondage {$sondage->id} pour l'email {$user->email} (Domaine non autorisé)");
                return response()->json(['message' => 'Vous n’êtes pas autorisé à participer à ce sondage privé.'], 403);
            }
            if (!empty($sondage->emails_autorises) && is_array($sondage->emails_autorises)) {
                if (!in_array($user->email, $sondage->emails_autorises)) {
                    Log::warning("Accès refusé au sondage {$sondage->id} pour l'email {$user->email} (Non présent dans la liste blanche)");
                    return response()->json(['message' => 'Vous n’êtes pas autorisé à participer à ce sondage privé.'], 403);
                }
            }
        }

        $dejaVote = false;
        if ($user) {
            $dejaVote = Vote::where('user_id', $user->id)
                            ->where('sondage_id', $sondage->id)
                            ->exists();
        } else {
            $dejaVote = Vote::where('adresse_ip', $request->ip())
                            ->whereNull('user_id')
                            ->where('sondage_id', $sondage->id)
                            ->exists();
        }

        if ($dejaVote) {
            return response()->json(['message' => 'Vous avez déjà voté pour ce sondage.'], 403);
        }

        $validated = $request->validate([
            'reponses' => 'required|array',
            'reponses.*.question_id' => [
                'required',
                Rule::exists('questions', 'id')->where('sondage_id', $sondage->id) 
            ],
            'reponses.*.option_id' => 'nullable|exists:options,id',
            'reponses.*.valeur_texte' => 'nullable|string',
            'est_anonyme' => 'boolean' 
        ]);

        try {
            DB::beginTransaction();

            $vote = Vote::create([
                'user_id' => $user ? $user->id : null,
                'sondage_id' => $sondage->id,
                'adresse_ip' => $request->ip(),
                'est_anonyme' => $request->est_anonyme ?? false 
            ]);

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
    
    public function mesVotes(Request $request)
    {
        $votes = Vote::with('sondage')
                    ->where('user_id', $request->user()->id)
                    ->latest() 
                    ->get();

        return response()->json($votes);
    }
}