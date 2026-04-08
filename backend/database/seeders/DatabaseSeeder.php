<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // --- 1. LISTES DE NOMS SÉNÉGALAIS RÉALISTES ---
        $prenoms = ['Amadou', 'Fatou', 'Mamadou', 'Aminata', 'Ousmane', 'Awa', 'Cheikh', 'Ndeye', 'Ibrahima', 'Mariama', 'Moussa', 'Khady', 'Abdoulaye', 'Aïssatou', 'Alioune', 'Oumou', 'Babacar', 'Coumba', 'Modou', 'Rama', 'Saliou', 'Binta', 'Fallou', 'Sadio', 'Ismaïla', 'Khadija', 'Seydou', 'Diouldé'];
        $noms = ['Ndiaye', 'Diop', 'Fall', 'Diagne', 'Gueye', 'Sow', 'Sarr', 'Seck', 'Faye', 'Sy', 'Ba', 'Toure', 'Mbaye', 'Cisse', 'Kane', 'Thiam', 'Diallo', 'Ndour', 'Mane', 'Sané', 'Wade', 'Gomis', 'Camara', 'Gassama', 'Keita'];

        // --- 2. CRÉATION DES COMPTES CLÉS ---
        DB::table('users')->insert([
            'name' => 'Chef Administrateur',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $userIdAb = DB::table('users')->insertGetId([
            'name' => 'Utilisateur AB',
            'email' => 'ab@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'user',
            'created_at' => Carbon::now()->subMonths(2),
            'updated_at' => Carbon::now(),
        ]);

        // --- 3. CRÉATION DE 100 UTILISATEURS SÉNÉGALAIS ---
        $usersIds = [];
        for ($i = 1; $i <= 100; $i++) {
            // Génération d'un nom aléatoire
            $nomComplet = $prenoms[array_rand($prenoms)] . ' ' . $noms[array_rand($noms)];
            
            $usersIds[] = DB::table('users')->insertGetId([
                'name' => $nomComplet,
                // Email propre basé sur le nom (ex: amadou.ndiaye8@test.com)
                'email' => strtolower(str_replace(' ', '.', $nomComplet)) . $i . '@test.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'created_at' => Carbon::now()->subDays(rand(10, 300)),
                'updated_at' => Carbon::now(),
            ]);
        }

        // --- 4. CRÉATION DES SONDAGES & DE LEURS 4 QUESTIONS ---
        $sondagesData = []; // Pour mémoriser les questions de chaque sondage
        $titresSujets = ['La gestion de l\'eau', 'Les transports urbains', 'L\'éducation civique', 'Le développement agricole', 'L\'emploi des jeunes', 'La santé publique', 'L\'accès à internet', 'L\'énergie solaire', 'L\'assainissement', 'Le sport local'];

        // Fonction interne pour générer 4 questions à un sondage
        $genererQuestions = function($sondageId) {
            $questions = [];
            
            // Q1 : QCM
            $q1 = DB::table('questions')->insertGetId(['sondage_id' => $sondageId, 'titre' => 'Que pensez-vous de la situation actuelle ?', 'type' => 'qcm', 'obligatoire' => 1]);
            $opt1A = DB::table('options')->insertGetId(['question_id' => $q1, 'contenu' => 'Très satisfaisant']);
            $opt1B = DB::table('options')->insertGetId(['question_id' => $q1, 'contenu' => 'Passable']);
            $opt1C = DB::table('options')->insertGetId(['question_id' => $q1, 'contenu' => 'Inquiétant']);
            $questions[] = ['id' => $q1, 'type' => 'qcm', 'options' => [$opt1A, $opt1B, $opt1C]];

            // Q2 : Boolean (Vrai/Faux)
            $q2 = DB::table('questions')->insertGetId(['sondage_id' => $sondageId, 'titre' => 'Faut-il appliquer une réforme d\'urgence ?', 'type' => 'boolean', 'obligatoire' => 1]);
            $opt2A = DB::table('options')->insertGetId(['question_id' => $q2, 'contenu' => 'Oui']);
            $opt2B = DB::table('options')->insertGetId(['question_id' => $q2, 'contenu' => 'Non']);
            $questions[] = ['id' => $q2, 'type' => 'boolean', 'options' => [$opt2A, $opt2B]];

            // Q3 : QCM
            $q3 = DB::table('questions')->insertGetId(['sondage_id' => $sondageId, 'titre' => 'Quelle est la priorité absolue ?', 'type' => 'qcm', 'obligatoire' => 1]);
            $opt3A = DB::table('options')->insertGetId(['question_id' => $q3, 'contenu' => 'Budget']);
            $opt3B = DB::table('options')->insertGetId(['question_id' => $q3, 'contenu' => 'Organisation']);
            $opt3C = DB::table('options')->insertGetId(['question_id' => $q3, 'contenu' => 'Transparence']);
            $questions[] = ['id' => $q3, 'type' => 'qcm', 'options' => [$opt3A, $opt3B, $opt3C]];

            // Q4 : Texte libre
            $q4 = DB::table('questions')->insertGetId(['sondage_id' => $sondageId, 'titre' => 'Avez-vous des recommandations ? (Optionnel)', 'type' => 'text', 'obligatoire' => 0]);
            $questions[] = ['id' => $q4, 'type' => 'text', 'options' => []];

            return $questions;
        };

        // Génération des 25 Sondages pour AB
        for ($i = 1; $i <= 25; $i++) {
            $sujet = $titresSujets[array_rand($titresSujets)];
            $titre = "Avis sur $sujet (Sondage #$i)";
            $sId = DB::table('sondages')->insertGetId([
                'titre' => $titre,
                'description' => "Enquête communautaire sur $sujet initiée par AB.",
                'slug' => Str::slug($titre) . '-' . Str::random(5),
                'est_anonyme' => 1, 'est_prive' => 0, 'user_id' => $userIdAb,
                'date_fin' => Carbon::now()->addDays(rand(-15, 20)), 
                'created_at' => Carbon::now()->subDays(rand(1, 30)), 'updated_at' => Carbon::now(),
            ]);
            $sondagesData[$sId] = $genererQuestions($sId); // On sauvegarde les questions pour les votes
        }

        // Quelques sondages pour 30 autres utilisateurs
        $utilisateursAleatoires = array_rand(array_flip($usersIds), 30);
        foreach ($utilisateursAleatoires as $uId) {
            $nbSondages = rand(1, 3);
            for ($j = 0; $j < $nbSondages; $j++) {
                $sujet = $titresSujets[array_rand($titresSujets)];
                $titre = "Consultation : $sujet";
                $sId = DB::table('sondages')->insertGetId([
                    'titre' => $titre,
                    'description' => 'Votre avis compte pour notre région.',
                    'slug' => Str::slug($titre) . '-' . Str::random(5),
                    'est_anonyme' => 1, 'est_prive' => 0, 'user_id' => $uId,
                    'date_fin' => Carbon::now()->addDays(rand(-5, 15)),
                    'created_at' => Carbon::now()->subDays(rand(1, 20)), 'updated_at' => Carbon::now(),
                ]);
                $sondagesData[$sId] = $genererQuestions($sId);
            }
        }

        // --- 5. GÉNÉRATION DES VOTES ET DES RÉPONSES LOGIQUES ---
        $tousLesVotants = array_merge([$userIdAb], $usersIds);
        $remarquesTexte = ['Il faut agir vite.', 'Très bonne initiative.', 'Je suis sceptique.', 'Bravo pour ce sondage.', 'On attend de voir les résultats.'];

        foreach ($sondagesData as $sondageId => $questionsDuSondage) {
            $nbVotes = rand(15, 60);
            $voters = (array) array_rand(array_flip($tousLesVotants), $nbVotes); 
            
            foreach ($voters as $voterId) {
                // 1. On crée le Vote
                $voteId = DB::table('votes')->insertGetId([
                    'sondage_id' => $sondageId,
                    'user_id' => $voterId,
                    'est_anonyme' => rand(0, 1),
                    'adresse_ip' => '192.168.1.' . rand(1, 255),
                    'created_at' => Carbon::now()->subHours(rand(1, 500)),
                    'updated_at' => Carbon::now(),
                ]);

                // 2. On crée les Réponses pour chaque question de ce sondage
                $reponsesToInsert = [];
                foreach ($questionsDuSondage as $q) {
                    $rep = [
                        'vote_id' => $voteId,
                        'question_id' => $q['id'],
                        'option_id' => null,
                        'valeur_texte' => null,
                        'created_at' => now(), 'updated_at' => now()
                    ];

                    if (in_array($q['type'], ['qcm', 'boolean'])) {
                        // Pioche une option au hasard parmi celles de la question
                        $rep['option_id'] = $q['options'][array_rand($q['options'])];
                    } elseif ($q['type'] === 'text') {
                        // 30% des gens laissent un commentaire texte
                        if (rand(1, 100) > 70) {
                            $rep['valeur_texte'] = $remarquesTexte[array_rand($remarquesTexte)];
                        }
                    }
                    $reponsesToInsert[] = $rep;
                }
                
                // Insertion en masse des réponses pour ce vote (Ultra rapide)
                DB::table('reponses')->insert($reponsesToInsert);
            }
        }
    }
}