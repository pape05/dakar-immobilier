<?php

use App\Http\Controllers\Api\AgenceController;
use App\Http\Controllers\Api\AlerteController;
use App\Http\Controllers\Api\AppartementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BatimentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LocataireController;
use App\Http\Controllers\Api\LocataireEspaceController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\ParametreController;
use App\Http\Controllers\Api\RapportController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Routes admin + agent (gestion courante)
    Route::middleware('role:administrateur,agent')->group(function () {
        // Bâtiments
        Route::apiResource('batiments', BatimentController::class);

        // Appartements
        Route::apiResource('appartements', AppartementController::class);

        // Locataires
        Route::apiResource('locataires', LocataireController::class);

        // Locations
        Route::apiResource('locations', LocationController::class);

        // Paiements
        Route::apiResource('paiements', PaiementController::class);
        Route::get('/paiements/{paiement}/quittance', [PaiementController::class, 'generateQuittance']);
    });

    // Routes admin uniquement
    Route::middleware('role:administrateur')->group(function () {
        // Inscription de nouveaux utilisateurs
        Route::post('/register', [AuthController::class, 'register']);

        // Utilisateurs
        Route::apiResource('users', UserController::class);

        // Agences
        Route::apiResource('agences', AgenceController::class);

        // Rapports
        Route::get('/rapports/revenus', [RapportController::class, 'revenus']);
        Route::get('/rapports/occupation', [RapportController::class, 'occupation']);
        Route::get('/rapports/impayes', [RapportController::class, 'impayes']);
        Route::get('/rapports/export', [RapportController::class, 'exportCsv']);
    });

    // Alertes (admin + agent)
    Route::middleware('role:administrateur,agent')->group(function () {
        Route::get('/alertes', [AlerteController::class, 'index']);
    });

    // Paramètres
    Route::get('/parametres/profil', [ParametreController::class, 'profil']);
    Route::put('/parametres/profil', [ParametreController::class, 'updateProfil']);
    Route::put('/parametres/agence', [ParametreController::class, 'updateAgence']);
    Route::put('/parametres/mot-de-passe', [ParametreController::class, 'updateMotDePasse']);

    // Espace locataire
    Route::middleware('role:locataire')->group(function () {
        Route::get('/mon-espace', [LocataireEspaceController::class, 'index']);
        Route::patch('/notifications/{notification}/read', [LocataireEspaceController::class, 'markNotificationRead']);
    });

    // Quittance locataire
    Route::middleware('role:locataire')->group(function () {
        Route::get('/mon-espace/quittance/{paiement}', [LocataireEspaceController::class, 'quittance']);
    });
});
