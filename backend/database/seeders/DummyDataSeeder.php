<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Sondage;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        // Listes de prénoms et noms de famille sénégalais
        $prenoms = [
            'Amadou', 'Fatou', 'Ousmane', 'Aïssatou', 'Mamadou', 'Aminata', 
            'Ibrahima', 'Mariama', 'Moussa', 'Ndeye', 'Abdoulaye', 'Coumba', 
            'Alioune', 'Oumou', 'Cheikh', 'Bineta', 'Malick', 'Khady', 
            'Babacar', 'Astou', 'Seydou', 'Safiétou', 'Modou', 'Rokhaya',
            'Saliou', 'Binta', 'Lamine', 'Awa', 'Pape', 'Khadija'
        ];
        
        $noms = [
            'Ndiaye', 'Diop', 'Fall', 'Sow', 'Ba', 'Diallo', 'Cissé', 
            'Touré', 'Seck', 'Sy', 'Gueye', 'Faye', 'Sarr', 'Diagne', 
            'Ndour', 'Mbaye', 'Thiam', 'Diouf', 'Niang', 'Gassama'
        ];

        // 1. Créer 100 nouveaux utilisateurs avec des noms sénégalais
        $newUsers = collect();
        for ($i = 0; $i < 100; $i++) {
            $prenom = $faker->randomElement($prenoms);
            $nom = $faker->randomElement($noms);
            
            // Création d'un email réaliste (ex: amadou.ndiaye42@example.com)
            $email = strtolower(Str::slug($prenom . '.' . $nom)) . $faker->unique()->numberBetween(1, 9999) . '@example.com';

            // On utilise la factory existante mais on force l'insertion du nom et de l'email
            $user = User::factory()->create([
                'name' => $prenom . ' ' . $nom,
                'email' => $email,
            ]);
            $newUsers->push($user);
        }
        
        // Récupérer tous les utilisateurs pour leur attribuer des sondages
        $allUsers = User::all();

        // 2. Créer 200 sondages aléatoires
        foreach (range(1, 200) as $index) {
            $sondage = Sondage::create([
                'user_id' => $allUsers->random()->id, 
                'titre' => $faker->sentence(6, true),
                'description' => $faker->paragraph(),
                'slug' => Str::random(8) . '-' . uniqid(), 
                'est_anonyme' => $faker->boolean(70),
                'est_prive' => $faker->boolean(20),
                'message_remerciement' => $faker->sentence(),
            ]);

            // 3. Ajouter entre 2 et 5 questions
            $nbQuestions = rand(2, 5);
            for ($i = 1; $i <= $nbQuestions; $i++) {
                $type = $faker->randomElement(['qcm', 'checkbox', 'text']);
                
                $question = $sondage->questions()->create([
                    'titre' => $faker->catchPhrase() . ' ?',
                    'type' => $type,
                    'ordre' => $i
                ]);

                // 4. Ajouter les options si ce n'est pas du texte
                if ($type !== 'text') {
                    $nbOptions = rand(2, 4);
                    $optionsData = [];
                    
                    for ($j = 0; $j < $nbOptions; $j++) {
                        $optionsData[] = ['contenu' => $faker->word()];
                    }
                    
                    $question->options()->createMany($optionsData);
                }
            }
        }
    }
}