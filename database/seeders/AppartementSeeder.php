<?php

namespace Database\Seeders;

use App\Models\Appartement;
use Illuminate\Database\Seeder;

class AppartementSeeder extends Seeder
{
    public function run(): void
    {
        // Résidence Les Almadies (batiment_id = 1)
        Appartement::create(['batiment_id' => 1, 'numero' => 'A1', 'superficie' => 85, 'loyer_mensuel' => 350000, 'etat' => 'occupé', 'nombre_pieces' => 3]);
        Appartement::create(['batiment_id' => 1, 'numero' => 'A2', 'superficie' => 65, 'loyer_mensuel' => 280000, 'etat' => 'occupé', 'nombre_pieces' => 2]);
        Appartement::create(['batiment_id' => 1, 'numero' => 'A3', 'superficie' => 90, 'loyer_mensuel' => 400000, 'etat' => 'libre', 'nombre_pieces' => 3]);
        Appartement::create(['batiment_id' => 1, 'numero' => 'B1', 'superficie' => 45, 'loyer_mensuel' => 180000, 'etat' => 'libre', 'nombre_pieces' => 1]);
        Appartement::create(['batiment_id' => 1, 'numero' => 'B2', 'superficie' => 70, 'loyer_mensuel' => 300000, 'etat' => 'en_travaux', 'nombre_pieces' => 2]);
        Appartement::create(['batiment_id' => 1, 'numero' => 'B3', 'superficie' => 85, 'loyer_mensuel' => 350000, 'etat' => 'libre', 'nombre_pieces' => 3]);

        // Immeuble Mermoz (batiment_id = 2)
        Appartement::create(['batiment_id' => 2, 'numero' => '101', 'superficie' => 75, 'loyer_mensuel' => 250000, 'etat' => 'occupé', 'nombre_pieces' => 2]);
        Appartement::create(['batiment_id' => 2, 'numero' => '102', 'superficie' => 60, 'loyer_mensuel' => 200000, 'etat' => 'libre', 'nombre_pieces' => 2]);
        Appartement::create(['batiment_id' => 2, 'numero' => '201', 'superficie' => 100, 'loyer_mensuel' => 450000, 'etat' => 'occupé', 'nombre_pieces' => 4]);
        Appartement::create(['batiment_id' => 2, 'numero' => '202', 'superficie' => 55, 'loyer_mensuel' => 180000, 'etat' => 'libre', 'nombre_pieces' => 1]);

        // Résidence Thiès Centre (batiment_id = 3)
        Appartement::create(['batiment_id' => 3, 'numero' => 'T1', 'superficie' => 80, 'loyer_mensuel' => 150000, 'etat' => 'occupé', 'nombre_pieces' => 3]);
        Appartement::create(['batiment_id' => 3, 'numero' => 'T2', 'superficie' => 60, 'loyer_mensuel' => 120000, 'etat' => 'libre', 'nombre_pieces' => 2]);
        Appartement::create(['batiment_id' => 3, 'numero' => 'T3', 'superficie' => 70, 'loyer_mensuel' => 130000, 'etat' => 'occupé', 'nombre_pieces' => 2]);
    }
}
