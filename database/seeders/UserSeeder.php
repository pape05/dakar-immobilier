<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@immo.sn',
            'password' => Hash::make('password'),
            'role' => 'administrateur',
            'agence_id' => 1,
        ]);

        User::create([
            'name' => 'Agent Dakar',
            'email' => 'agent@immo.sn',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'agence_id' => 1,
        ]);

        User::create([
            'name' => 'Agent Thiès',
            'email' => 'agent.thies@immo.sn',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'agence_id' => 2,
        ]);
    }
}
