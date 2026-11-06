<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appartements', function (Blueprint $table) {
            $table->index('etat');
        });

        Schema::table('locations', function (Blueprint $table) {
            $table->index('statut');
        });

        Schema::table('paiements', function (Blueprint $table) {
            $table->index('date_paiement');
            $table->index('statut');
            $table->index('naboopay_order_id');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->index(['locataire_id', 'lu']);
        });

        Schema::table('locataires', function (Blueprint $table) {
            $table->unique('numero_piece');
        });
    }

    public function down(): void
    {
        Schema::table('appartements', function (Blueprint $table) {
            $table->dropIndex(['etat']);
        });

        Schema::table('locations', function (Blueprint $table) {
            $table->dropIndex(['statut']);
        });

        Schema::table('paiements', function (Blueprint $table) {
            $table->dropIndex(['date_paiement']);
            $table->dropIndex(['statut']);
            $table->dropIndex(['naboopay_order_id']);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['locataire_id', 'lu']);
        });

        Schema::table('locataires', function (Blueprint $table) {
            $table->dropUnique(['numero_piece']);
        });
    }
};
