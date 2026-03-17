<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. La table SONDAGES (Mise à jour avec tes nouveaux paramètres)
        Schema::create('sondages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // L'Admin du sondage
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('slug')->unique();
            
            // Paramètres de configuration
            $table->boolean('est_anonyme')->default(true);
            $table->boolean('est_prive')->default(false);
            $table->dateTime('date_debut')->nullable();
            $table->dateTime('date_fin')->nullable();
            $table->string('message_remerciement')->nullable();
            
            $table->timestamps();
        });

        // 2. La NOUVELLE table QUESTIONS
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sondage_id')->constrained()->onDelete('cascade');
            $table->string('titre');
            $table->string('type'); // qcm, checkbox, text, rating, ranking, matrix, conditional
            $table->boolean('obligatoire')->default(true);
            $table->integer('ordre')->default(0); // Pour pouvoir les réorganiser plus tard
            $table->timestamps();
        });

        // 3. La table OPTIONS (Désormais liée aux Questions, et plus directement au Sondage)
        Schema::create('options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->string('contenu');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('options');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('sondages');
    }
};