<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Sondage;
use App\Models\Question;
use App\Models\Option;
use App\Models\Vote;
use App\Models\Reponse;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class TestAbSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        // 1. Récupérer ou créer l'utilisateur ab@gmail.com
        $userAB = User::firstOrCreate(
            ['email' => 'ab@gmail.com'],
            [
                'name' => 'Utilisateur AB',
                'password' => bcrypt('password123'), // Mot de passe pour tester
                'role' => 'user'
            ]
        );

        // 2. Créer le sondage complexe
        $sondage = Sondage::create([
            'user_id' => $userAB->id,
            'titre' => 'Enquête de satisfaction globale et habitudes tech',
            'description' => 'Ce sondage contient plusieurs types de questions et possède plus de 100 votes générés automatiquement pour tester les performances et les graphiques.',
            'slug' => Str::slug('Enquete de satisfaction globale') . '-' . uniqid(),
            'est_anonyme' => true, // On autorise l'anonymat pour avoir un mix
            'est_prive' => false,
            'created_at' => now()->subDays(5)
        ]);

        // 3. Créer différents types de questions
        // --- Q1: QCM (Choix unique) ---
        $q1 = Question::create(['sondage_id' => $sondage->id, 'titre' => 'Quel est votre principal outil de travail ?', 'type' => 'qcm']);
        $optQ1 = collect(['Ordinateur Fixe', 'Ordinateur Portable', 'Tablette', 'Smartphone'])->map(function($choix) use ($q1) {
            return Option::create(['question_id' => $q1->id, 'contenu' => $choix]);
        });

        // --- Q2: Checkbox (Choix multiples) ---
        $q2 = Question::create(['sondage_id' => $sondage->id, 'titre' => 'Quels langages maîtrisez-vous ? (Plusieurs choix possibles)', 'type' => 'checkbox']);
        $optQ2 = collect(['PHP', 'JavaScript', 'Python', 'Java', 'C++', 'Ruby'])->map(function($choix) use ($q2) {
            return Option::create(['question_id' => $q2->id, 'contenu' => $choix]);
        });

        // --- Q3: Boolean (Oui/Non) ---
        $q3 = Question::create(['sondage_id' => $sondage->id, 'titre' => 'Aimez-vous le télétravail ?', 'type' => 'boolean']);
        $optQ3 = collect(['Oui', 'Non'])->map(function($choix) use ($q3) {
            return Option::create(['question_id' => $q3->id, 'contenu' => $choix]);
        });

        // --- Q4: Rating (Note sur 5) ---
        $q4 = Question::create(['sondage_id' => $sondage->id, 'titre' => 'Notez votre expérience globale avec ce portail', 'type' => 'rating']);

        // --- Q5: Texte libre ---
        $q5 = Question::create(['sondage_id' => $sondage->id, 'titre' => 'Avez-vous des suggestions d\'amélioration ?', 'type' => 'text', 'obligatoire' => false]);


        // 4. Préparer un pool d'utilisateurs pour voter (créer s'il n'y en a pas assez)
        $usersCount = User::count();
        if ($usersCount < 120) {
            User::factory(120 - $usersCount)->create();
        }
        $users = User::where('id', '!=', $userAB->id)->inRandomOrder()->limit(120)->get();

        // 5. Générer 120 votes avec des réponses aléatoires
        foreach ($users as $votant) {
            // Un mix de votes anonymes et non anonymes (environ 50/50)
            $estAnonyme = $faker->boolean(); 

            $vote = Vote::create([
                'user_id' => $votant->id,
                'sondage_id' => $sondage->id,
                'est_anonyme' => $estAnonyme,
                'created_at' => $faker->dateTimeBetween('-5 days', 'now') // Votes répartis sur les 5 derniers jours
            ]);

            // Réponse Q1 (QCM - 1 seule option)
            Reponse::create([
                'vote_id' => $vote->id,
                'question_id' => $q1->id,
                'option_id' => $optQ1->random()->id,
            ]);

            // Réponse Q2 (Checkbox - 1 à 3 options choisies au hasard)
            $choixQ2 = $optQ2->random(rand(1, 3));
            foreach($choixQ2 as $choix) {
                Reponse::create([
                    'vote_id' => $vote->id,
                    'question_id' => $q2->id,
                    'option_id' => $choix->id,
                ]);
            }

            // Réponse Q3 (Boolean - Oui ou Non)
            Reponse::create([
                'vote_id' => $vote->id,
                'question_id' => $q3->id,
                'option_id' => $optQ3->random()->id,
            ]);

            // Réponse Q4 (Rating - valeur entre 1 et 5 stockée en texte)
            Reponse::create([
                'vote_id' => $vote->id,
                'question_id' => $q4->id,
                'valeur_texte' => (string) rand(1, 5),
            ]);

            // Réponse Q5 (Texte - 60% de chances de laisser un commentaire)
            if ($faker->boolean(60)) {
                Reponse::create([
                    'vote_id' => $vote->id,
                    'question_id' => $q5->id,
                    'valeur_texte' => $faker->sentence(rand(6, 15)),
                ]);
            }
        }
    }
}