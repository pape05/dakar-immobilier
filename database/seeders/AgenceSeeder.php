<?php

namespace Database\Seeders;

use App\Models\Agence;
use Illuminate\Database\Seeder;

class AgenceSeeder extends Seeder
{
    public function run(): void
    {
        Agence::create([
            'nom' => 'Agence Immobilière Dakar',
            'adresse' => 'Avenue Bourguiba, Dakar',
            'telephone' => '33 123 45 67',
            'email' => 'contact@agence-dakar.sn',
        ]);

        Agence::create([
            'nom' => 'Agence Thies Immobilier',
            'adresse' => 'Route de Saint-Louis, Thiès',
            'telephone' => '33 987 65 43',
            'email' => 'info@thies-immo.sn',
        ]);
    }
}
