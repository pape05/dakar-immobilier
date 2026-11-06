<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        // Abdoulaye Diop -> Apt A1, Résidence Les Almadies
        Location::create([
            'appartement_id' => 1,
            'locataire_id' => 1,
            'date_debut' => '2026-03-01',
            'date_fin' => '2027-02-28',
            'duree_mois' => 12,
            'montant_loyer' => 350000,
            'caution' => 700000,
            'statut' => 'active',
        ]);

        // Aminata Ba -> Apt A2, Résidence Les Almadies
        Location::create([
            'appartement_id' => 2,
            'locataire_id' => 2,
            'date_debut' => '2026-06-01',
            'date_fin' => '2027-05-31',
            'duree_mois' => 12,
            'montant_loyer' => 280000,
            'caution' => 560000,
            'statut' => 'active',
        ]);

        // Moussa Ndiaye -> Apt 101, Immeuble Mermoz
        Location::create([
            'appartement_id' => 7,
            'locataire_id' => 3,
            'date_debut' => '2026-01-15',
            'date_fin' => '2027-01-14',
            'duree_mois' => 12,
            'montant_loyer' => 250000,
            'caution' => 500000,
            'statut' => 'active',
        ]);

        // Khady Fall -> Apt 201, Immeuble Mermoz
        Location::create([
            'appartement_id' => 9,
            'locataire_id' => 4,
            'date_debut' => '2026-04-01',
            'date_fin' => '2027-03-31',
            'duree_mois' => 12,
            'montant_loyer' => 450000,
            'caution' => 900000,
            'statut' => 'active',
        ]);

        // Ibrahima Sy -> Apt T1, Résidence Thiès Centre
        Location::create([
            'appartement_id' => 11,
            'locataire_id' => 5,
            'date_debut' => '2026-02-01',
            'date_fin' => '2027-01-31',
            'duree_mois' => 12,
            'montant_loyer' => 150000,
            'caution' => 300000,
            'statut' => 'active',
        ]);

        // Aissatou Seck -> Apt T3, Résidence Thiès Centre
        Location::create([
            'appartement_id' => 13,
            'locataire_id' => 6,
            'date_debut' => '2026-05-01',
            'date_fin' => '2026-12-31',
            'duree_mois' => 8,
            'montant_loyer' => 130000,
            'caution' => 260000,
            'statut' => 'active',
        ]);
    }
}
