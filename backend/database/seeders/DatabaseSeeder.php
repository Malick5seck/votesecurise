<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Sondage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
            'role' => 'super_admin',
        ]);

        $sondage = Sondage::create([
            'user_id' => $user->id,
            'titre' => 'Enquête sur vos habitudes de développement',
            'description' => 'Test de notre nouvelle architecture de sondages avancée !',
            'slug' => Str::random(8),
            'est_anonyme' => true,
            'message_remerciement' => 'Merci beaucoup pour votre participation !',
        ]);

        // Question 1 : Type QCM
        $q1 = $sondage->questions()->create([
            'titre' => 'Quel est votre outil frontend préféré ?',
            'type' => 'qcm',
            'ordre' => 1
        ]);
        $q1->options()->createMany([
            ['contenu' => 'React'], ['contenu' => 'Vue.js'], ['contenu' => 'Angular']
        ]);

        // Question 2 : Type Checkbox
        $q2 = $sondage->questions()->create([
            'titre' => 'Quels langages backend maîtrisez-vous ?',
            'type' => 'checkbox',
            'ordre' => 2
        ]);
        $q2->options()->createMany([
            ['contenu' => 'PHP (Laravel)'], ['contenu' => 'Node.js'], ['contenu' => 'Python']
        ]);

        // Question 3 : Type Texte libre
        $sondage->questions()->create([
            'titre' => 'Avez-vous des suggestions d\'amélioration ?',
            'type' => 'text',
            'ordre' => 3
        ]);
    }
}