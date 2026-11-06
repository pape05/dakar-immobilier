<?php

namespace Tests\Feature\Api;

use App\Models\Agence;
use App\Models\Appartement;
use App\Models\Batiment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class BatimentControllerTest extends TestCase
{
    use RefreshDatabase;

    private Agence $agence1;
    private Agence $agence2;
    private User $admin;
    private User $agent1;
    private User $agent2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agence1 = Agence::create(['nom' => 'Agence Dakar', 'adresse' => 'Dakar']);
        $this->agence2 = Agence::create(['nom' => 'Agence Thiès', 'adresse' => 'Thiès']);

        $this->admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.sn',
            'password' => Hash::make('password'),
            'role' => 'administrateur',
            'agence_id' => $this->agence1->id,
        ]);

        $this->agent1 = User::create([
            'name' => 'Agent 1',
            'email' => 'agent1@test.sn',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'agence_id' => $this->agence1->id,
        ]);

        $this->agent2 = User::create([
            'name' => 'Agent 2',
            'email' => 'agent2@test.sn',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'agence_id' => $this->agence2->id,
        ]);
    }

    public function test_admin_sees_all_batiments(): void
    {
        Batiment::create(['agence_id' => $this->agence1->id, 'nom' => 'Bat 1', 'adresse' => 'Dakar', 'nombre_appartements' => 2]);
        Batiment::create(['agence_id' => $this->agence2->id, 'nom' => 'Bat 2', 'adresse' => 'Thiès', 'nombre_appartements' => 3]);

        $response = $this->actingAs($this->admin)->getJson('/api/batiments');

        $response->assertOk();
        $this->assertCount(2, $response->json());
    }

    public function test_agent_sees_only_own_agence_batiments(): void
    {
        Batiment::create(['agence_id' => $this->agence1->id, 'nom' => 'Bat 1', 'adresse' => 'Dakar', 'nombre_appartements' => 2]);
        Batiment::create(['agence_id' => $this->agence2->id, 'nom' => 'Bat 2', 'adresse' => 'Thiès', 'nombre_appartements' => 3]);

        $response = $this->actingAs($this->agent1)->getJson('/api/batiments');

        $response->assertOk();
        $this->assertCount(1, $response->json());
        $this->assertEquals('Bat 1', $response->json()[0]['nom']);
    }

    public function test_store_batiment(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/batiments', [
            'agence_id' => $this->agence1->id,
            'nom' => 'Nouvelle Résidence',
            'adresse' => 'Almadies, Dakar',
            'nombre_appartements' => 5,
            'proprietaire' => 'M. Diallo',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('nom', 'Nouvelle Résidence');

        $this->assertDatabaseHas('batiments', ['nom' => 'Nouvelle Résidence']);
    }

    public function test_agent_cannot_create_for_other_agence(): void
    {
        $response = $this->actingAs($this->agent1)->postJson('/api/batiments', [
            'agence_id' => $this->agence2->id,
            'nom' => 'Résidence Hack',
            'adresse' => 'Test',
            'nombre_appartements' => 1,
        ]);

        $response->assertStatus(403);
    }

    public function test_agent_cannot_access_other_agence_batiment(): void
    {
        $batiment = Batiment::create([
            'agence_id' => $this->agence2->id,
            'nom' => 'Bat Thiès',
            'adresse' => 'Thiès',
            'nombre_appartements' => 2,
        ]);

        $response = $this->actingAs($this->agent1)->getJson("/api/batiments/{$batiment->id}");

        $response->assertStatus(403);
    }

    public function test_update_batiment(): void
    {
        $batiment = Batiment::create([
            'agence_id' => $this->agence1->id,
            'nom' => 'Ancien Nom',
            'adresse' => 'Dakar',
            'nombre_appartements' => 3,
        ]);

        $response = $this->actingAs($this->admin)->putJson("/api/batiments/{$batiment->id}", [
            'agence_id' => $this->agence1->id,
            'nom' => 'Nouveau Nom',
            'adresse' => 'Dakar',
            'nombre_appartements' => 4,
        ]);

        $response->assertOk()
            ->assertJsonPath('nom', 'Nouveau Nom');
    }

    public function test_delete_batiment_without_appartements(): void
    {
        $batiment = Batiment::create([
            'agence_id' => $this->agence1->id,
            'nom' => 'À supprimer',
            'adresse' => 'Dakar',
            'nombre_appartements' => 0,
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/batiments/{$batiment->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('batiments', ['id' => $batiment->id]);
    }

    public function test_cannot_delete_batiment_with_appartements(): void
    {
        $batiment = Batiment::create([
            'agence_id' => $this->agence1->id,
            'nom' => 'Avec apparts',
            'adresse' => 'Dakar',
            'nombre_appartements' => 1,
        ]);

        Appartement::create([
            'batiment_id' => $batiment->id,
            'numero' => 'A1',
            'superficie' => 50,
            'loyer_mensuel' => 200000,
            'etat' => 'libre',
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/batiments/{$batiment->id}");

        $response->assertStatus(422);
        $this->assertDatabaseHas('batiments', ['id' => $batiment->id]);
    }

    public function test_locataire_cannot_access_batiments(): void
    {
        $locataire = User::create([
            'name' => 'Locataire',
            'email' => 'loc@test.sn',
            'password' => Hash::make('password'),
            'role' => 'locataire',
        ]);

        $response = $this->actingAs($locataire)->getJson('/api/batiments');

        $response->assertStatus(403);
    }
}
