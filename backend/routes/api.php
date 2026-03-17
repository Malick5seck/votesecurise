<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SondageController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\AuthController;
// 🟢 ROUTES PUBLIQUES
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/sondages', [SondageController::class, 'index']); 
Route::get('/sondages/{slug}', [SondageController::class, 'show']); 

// 🔴 ROUTES PROTÉGÉES (Nécessite le token Sanctum)
Route::middleware(['auth:sanctum'])->group(function () {
    
    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    // Obtenir les infos de l'utilisateur connecté
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Gestion des sondages et des votes
    Route::post('/sondages', [SondageController::class, 'store']); 
    Route::post('/sondages/{sondage_id}/voter', [VoteController::class, 'voter']);
});