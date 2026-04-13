<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
   public function up(): void
{
    Schema::table('votes', function (Blueprint $table) {
       
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
