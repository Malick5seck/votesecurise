<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up()
    {
        Schema::table('sondages', function (Blueprint $table) {
            $table->string('domaine_restreint')->nullable(); 
            $table->json('emails_autorises')->nullable();
        });
    }

   
    public function down(): void
    {
        Schema::table('sondages', function (Blueprint $table) {
            //
        });
    }
};
