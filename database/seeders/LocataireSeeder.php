<?php

namespace Database\Seeders;

use App\Models\Locataire;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LocataireSeeder extends Seeder
{
    public function run(): void
    {
        $locataire1 = Locataire::create([
            'nom' => 'Diop',
            'prenom' => 'Abdoulaye',
            'telephone' => '77 123 45 67',
            'email' => 'abdoulaye.diop@email.sn',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-2024-001234',
            'adresse_actuelle' => 'Almadies, Dakar',
        ]);

        User::create([
            'name' => 'Abdoulaye Diop',
            'email' => 'abdoulaye.diop@email.sn',
            'password' => Hash::make('password'),
            'role' => 'locataire',
            'locataire_id' => $locataire1->id,
            'must_change_password' => true,
        ]);

        $locataire2 = Locataire::create([
            'nom' => 'Ba',
            'prenom' => 'Aminata',
            'telephone' => '78 234 56 78',
            'email' => 'aminata.ba@email.sn',
            'piece_identite' => 'Passeport',
            'numero_piece' => 'PS-SN-567890',
            'adresse_actuelle' => 'Mermoz, Dakar',
        ]);

        User::create([
            'name' => 'Aminata Ba',
            'email' => 'aminata.ba@email.sn',
            'password' => Hash::make('password'),
            'role' => 'locataire',
            'locataire_id' => $locataire2->id,
            'must_change_password' => true,
        ]);

        $locataire3 = Locataire::create([
            'nom' => 'Ndiaye',
            'prenom' => 'Moussa',
            'telephone' => '76 345 67 89',
            'email' => 'moussa.ndiaye@email.sn',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-2023-005678',
            'adresse_actuelle' => 'Mermoz, Dakar',
        ]);

        User::create([
            'name' => 'Moussa Ndiaye',
            'email' => 'moussa.ndiaye@email.sn',
            'password' => Hash::make('password'),
            'role' => 'locataire',
            'locataire_id' => $locataire3->id,
            'must_change_password' => true,
        ]);

        $locataire4 = Locataire::create([
            'nom' => 'Fall',
            'prenom' => 'Khady',
            'telephone' => '70 456 78 90',
            'email' => 'khady.fall@email.sn',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-2024-009012',
            'adresse_actuelle' => 'Almadies, Dakar',
        ]);

        User::create([
            'name' => 'Khady Fall',
            'email' => 'khady.fall@email.sn',
            'password' => Hash::make('password'),
            'role' => 'locataire',
            'locataire_id' => $locataire4->id,
            'must_change_password' => true,
        ]);

        Locataire::create([
            'nom' => 'Sy',
            'prenom' => 'Ibrahima',
            'telephone' => '77 567 89 01',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-2025-003456',
            'adresse_actuelle' => 'Thiès Centre',
        ]);

        Locataire::create([
            'nom' => 'Seck',
            'prenom' => 'Aissatou',
            'telephone' => '78 678 90 12',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-2024-007890',
            'adresse_actuelle' => 'Thiès',
        ]);
    }
}
