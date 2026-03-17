<?php

namespace App\Http\Controllers;

use App\Models\Sondage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SondageController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validation des données reçues de React
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'est_anonyme' => 'boolean',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'message_remerciement' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.titre' => 'required|string',
            'questions.*.type' => 'required|string',
            'questions.*.options' => 'nullable|array',
        ]);

        // 2. Sauvegarde sécurisée avec une Transaction
        try {
            DB::beginTransaction();

            // A. Création du Sondage
            $sondage = Sondage::create([
                'user_id' => $request->user()->id, // L'Admin connecté
                'titre' => $validated['titre'],
                'description' => $validated['description'],
                'slug' => Str::random(10),
                'est_anonyme' => $validated['est_anonyme'] ?? true,
                'est_prive' => false,
                'date_debut' => $validated['date_debut'],
                'date_fin' => $validated['date_fin'],
                'message_remerciement' => $validated['message_remerciement'],
            ]);

            // B. Boucle pour créer les Questions et leurs Options
            foreach ($validated['questions'] as $index => $qData) {
                $question = $sondage->questions()->create([
                    'titre' => $qData['titre'],
                    'type' => $qData['type'],
                    'obligatoire' => $qData['obligatoire'] ?? true,
                    'ordre' => $index + 1, // On sauvegarde l'ordre d'affichage
                ]);

                // Si c'est un QCM, Checkbox ou Classement, on sauvegarde les options
                if (in_array($qData['type'], ['qcm', 'checkbox', 'ranking']) && !empty($qData['options'])) {
                    $optionsToInsert = array_map(function($opt) {
                        return ['contenu' => $opt];
                    }, $qData['options']);
                    
                    $question->options()->createMany($optionsToInsert);
                }
            }

            DB::commit(); // Tout s'est bien passé, on valide l'enregistrement !

            return response()->json([
                'message' => 'Sondage créé avec succès !',
                'sondage' => $sondage->load('questions.options') // On renvoie le sondage complet
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Erreur ? On annule tout !
            return response()->json(['message' => 'Erreur lors de la création : ' . $e->getMessage()], 500);
        }
    }
    
    // On remet la méthode index pour que ton Portfolio React puisse afficher les sondages
    public function index()
    {
        // On récupère les sondages avec leurs questions et options
        $sondages = Sondage::with('questions.options')->latest()->get();
        return response()->json($sondages);
    }
}