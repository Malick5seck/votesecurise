<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SondageController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
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

    // Route publique pour voir le contenu d'un sondage
Route::get('/sondages/{id}', [SondageController::class, 'show']);

// Route PROTÉGÉE : Seuls les utilisateurs connectés peuvent voter (pour garantir qu'ils ne votent qu'une fois)
Route::middleware('auth:sanctum')->post('/sondages/{id}/voter', [SondageController::class, 'voter']);

// Voir les résultats d'un sondage spécifique
    Route::get('/sondages/{id}/resultats', [SondageController::class, 'resultats']);

    // GESTION DES UTILISATEURS (Super Admin)
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    // Historique des votes de l'utilisateur connecté
    Route::get('/mes-votes', [VoteController::class, 'mesVotes']);
});