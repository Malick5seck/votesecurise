<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::table('votes', function (Blueprint $table) {
        // On ajoute la colonne juste après 'adresse_ip'
        $table->boolean('est_anonyme')->default(false)->after('adresse_ip');
    });
}

public function down(): void
{
    Schema::table('votes', function (Blueprint $table) {
        $table->dropColumn('est_anonyme');
    });
}
};
