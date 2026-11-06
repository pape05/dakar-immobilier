<?php

namespace Database\Seeders;

use App\Models\Paiement;
use Illuminate\Database\Seeder;

class PaiementSeeder extends Seeder
{
    public function run(): void
    {
        $mois = ['Septembre 2026', 'Octobre 2026'];

        // Location 1 — Abdoulaye Diop (350 000)
        foreach ($mois as $i => $m) {
            Paiement::create([
                'location_id' => 1,
                'date_paiement' => "2026-" . str_pad(9 + $i, 2, '0', STR_PAD_LEFT) . "-05",
                'mois_concerne' => $m,
                'montant' => 350000,
                'mode_paiement' => 'mobile_money',
                'statut' => 'paye',
            ]);
        }

        // Location 2 — Aminata Ba (280 000)
        foreach ($mois as $i => $m) {
            Paiement::create([
                'location_id' => 2,
                'date_paiement' => "2026-" . str_pad(9 + $i, 2, '0', STR_PAD_LEFT) . "-03",
                'mois_concerne' => $m,
                'montant' => 280000,
                'mode_paiement' => 'especes',
                'statut' => 'paye',
            ]);
        }

        // Location 3 — Moussa Ndiaye (250 000)
        Paiement::create([
            'location_id' => 3,
            'date_paiement' => '2026-09-04',
            'mois_concerne' => 'Septembre 2026',
            'montant' => 250000,
            'mode_paiement' => 'virement',
            'statut' => 'paye',
        ]);
        Paiement::create([
            'location_id' => 3,
            'date_paiement' => '2026-10-07',
            'mois_concerne' => 'Octobre 2026',
            'montant' => 250000,
            'mode_paiement' => 'virement',
            'statut' => 'paye',
        ]);

        // Location 4 — Khady Fall (450 000)
        Paiement::create([
            'location_id' => 4,
            'date_paiement' => '2026-09-02',
            'mois_concerne' => 'Septembre 2026',
            'montant' => 450000,
            'mode_paiement' => 'cheque',
            'statut' => 'paye',
        ]);
        Paiement::create([
            'location_id' => 4,
            'date_paiement' => '2026-10-01',
            'mois_concerne' => 'Octobre 2026',
            'montant' => 450000,
            'mode_paiement' => 'cheque',
            'statut' => 'paye',
        ]);

        // Location 5 — Ibrahima Sy (150 000) — un mois impayé
        Paiement::create([
            'location_id' => 5,
            'date_paiement' => '2026-09-06',
            'mois_concerne' => 'Septembre 2026',
            'montant' => 150000,
            'mode_paiement' => 'especes',
            'statut' => 'paye',
        ]);

        // Location 6 — Aissatou Seck (130 000)
        Paiement::create([
            'location_id' => 6,
            'date_paiement' => '2026-09-05',
            'mois_concerne' => 'Septembre 2026',
            'montant' => 130000,
            'mode_paiement' => 'mobile_money',
            'statut' => 'paye',
        ]);
        Paiement::create([
            'location_id' => 6,
            'date_paiement' => '2026-10-04',
            'mois_concerne' => 'Octobre 2026',
            'montant' => 130000,
            'mode_paiement' => 'mobile_money',
            'statut' => 'paye',
        ]);

        // Paiement en attente pour novembre (locataire 1)
        Paiement::create([
            'location_id' => 1,
            'date_paiement' => '2026-11-01',
            'mois_concerne' => 'Novembre 2026',
            'montant' => 350000,
            'mode_paiement' => 'mobile_money',
            'statut' => 'en_attente',
        ]);
    }
}
