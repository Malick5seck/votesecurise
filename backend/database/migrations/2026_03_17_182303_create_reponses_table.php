<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reponses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vote_id')->constrained('votes')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
            
            // L'ID de l'option choisie (pour QCM, Cases à cocher, etc.)
            $table->foreignId('option_id')->nullable()->constrained('options')->cascadeOnDelete(); 
            
            // Le texte saisi (pour Texte libre, Note, etc.)
            $table->text('valeur_texte')->nullable(); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reponses');
    }
};