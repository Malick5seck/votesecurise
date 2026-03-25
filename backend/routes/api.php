<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SondageController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

//  ROUTES PUBLIQUES
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/sondages', [SondageController::class, 'index']); 
Route::get('/sondages/{id}', [SondageController::class, 'show']); 

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

//  ROUTES PROTÉGÉES avecle token Sanctum
Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);

    Route::post('/sondages', [SondageController::class, 'store']); 
    Route::get('/sondages/{id}/resultats', [SondageController::class, 'resultats']);
    Route::put('/sondages/{id}/cloturer', [SondageController::class, 'cloturer']);
    
    Route::delete('/sondages/{id}', [SondageController::class, 'destroy']); 

    Route::post('/sondages/{sondage_id}/voter', [VoteController::class, 'voter']);
    Route::get('/mes-votes', [VoteController::class, 'mesVotes']);

    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/users/{id}/historique', [UserController::class, 'historiqueUtilisateur']);
    Route::get('/admin/logs', [UserController::class, 'getAdminLogs']);
});