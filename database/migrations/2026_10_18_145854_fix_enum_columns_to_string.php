<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Convertir les enums accentués en strings pour éviter les incohérences
        // PostgreSQL permet ALTER TYPE, on remplace par des colonnes string

        // 1. locations.statut : 'terminée' -> 'terminee', 'résiliée' -> 'resiliee'
        Schema::table('locations', function (Blueprint $table) {
            $table->string('statut_new')->default('active')->after('statut');
        });

        DB::table('locations')->update([
            'statut_new' => DB::raw("CASE
                WHEN statut = 'terminée' THEN 'terminee'
                WHEN statut = 'résiliée' THEN 'resiliee'
                ELSE statut
            END"),
        ]);

        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn('statut');
        });

        Schema::table('locations', function (Blueprint $table) {
            $table->renameColumn('statut_new', 'statut');
        });

        // 2. paiements.mode_paiement : 'espèces' -> 'especes', 'chèque' -> 'cheque'
        Schema::table('paiements', function (Blueprint $table) {
            $table->string('mode_paiement_new')->default('especes')->after('mode_paiement');
        });

        DB::table('paiements')->update([
            'mode_paiement_new' => DB::raw("CASE
                WHEN mode_paiement = 'espèces' THEN 'especes'
                WHEN mode_paiement = 'chèque' THEN 'cheque'
                ELSE mode_paiement
            END"),
        ]);

        Schema::table('paiements', function (Blueprint $table) {
            $table->dropColumn('mode_paiement');
        });

        Schema::table('paiements', function (Blueprint $table) {
            $table->renameColumn('mode_paiement_new', 'mode_paiement');
        });

        // 3. Corriger le default de paiements.statut ('paye' -> 'en_attente')
        Schema::table('paiements', function (Blueprint $table) {
            $table->string('statut')->default('en_attente')->change();
        });
    }

    public function down(): void
    {
        // Les valeurs en string restent compatibles, pas de rollback nécessaire sur les données
        Schema::table('paiements', function (Blueprint $table) {
            $table->string('statut')->default('paye')->change();
        });
    }
};
