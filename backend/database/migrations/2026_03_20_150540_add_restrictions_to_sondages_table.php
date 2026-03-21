<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('sondages', function (Blueprint $table) {
            $table->string('domaine_restreint')->nullable(); // ex: @gmail.com
            $table->json('emails_autorises')->nullable(); // Liste blanche d'emails
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sondages', function (Blueprint $table) {
            //
        });
    }
};
