<?php

namespace Database\Seeders;

use App\Models\Batiment;
use Illuminate\Database\Seeder;

class BatimentSeeder extends Seeder
{
    public function run(): void
    {
        Batiment::create([
            'agence_id' => 1,
            'nom' => 'Résidence Les Almadies',
            'adresse' => 'Rue A-12, Almadies, Dakar',
            'nombre_appartements' => 6,
            'proprietaire' => 'Mamadou Diallo',
            'description' => 'Résidence standing avec vue sur mer.',
        ]);

        Batiment::create([
            'agence_id' => 1,
            'nom' => 'Immeuble Mermoz',
            'adresse' => 'Avenue Cheikh Anta Diop, Mermoz, Dakar',
            'nombre_appartements' => 4,
            'proprietaire' => 'Fatou Ndiaye',
        ]);

        Batiment::create([
            'agence_id' => 2,
            'nom' => 'Résidence Thiès Centre',
            'adresse' => 'Boulevard de la République, Thiès',
            'nombre_appartements' => 3,
            'proprietaire' => 'Ousmane Sow',
        ]);
    }
}
