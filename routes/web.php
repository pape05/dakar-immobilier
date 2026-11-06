<?php

use App\Http\Controllers\AppartementController;
use App\Http\Controllers\BatimentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocataireController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware(['role:administrateur,agent'])->group(function () {
        Route::resource('batiments', BatimentController::class);
        Route::resource('appartements', AppartementController::class);
        Route::resource('locataires', LocataireController::class);
        Route::resource('locations', LocationController::class);
        Route::resource('paiements', PaiementController::class);

        Route::get('/paiements/{paiement}/quittance', [PaiementController::class, 'generateQuittance'])
            ->name('paiements.quittance');
    });
});

require __DIR__.'/auth.php';
