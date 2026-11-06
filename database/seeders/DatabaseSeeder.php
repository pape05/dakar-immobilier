<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            AgenceSeeder::class,
            UserSeeder::class,
            BatimentSeeder::class,
            AppartementSeeder::class,
            LocataireSeeder::class,
            LocationSeeder::class,
            PaiementSeeder::class,
        ]);
    }
}
