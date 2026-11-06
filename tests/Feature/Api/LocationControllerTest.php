<?php

namespace Tests\Feature\Api;

use App\Models\Agence;
use App\Models\Appartement;
use App\Models\Batiment;
use App\Models\Locataire;
use App\Models\Location;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LocationControllerTest extends TestCase
{
    use RefreshDatabase;

    private Agence $agence1;
    private Agence $agence2;
    private User $admin;
    private User $agent1;
    private Batiment $batiment1;
    private Batiment $batiment2;
    private Appartement $apptLibre;
    private Appartement $apptOccupe;
    private Locataire $locataire;

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

        $this->batiment1 = Batiment::create([
            'agence_id' => $this->agence1->id,
            'nom' => 'Bat Dakar',
            'adresse' => 'Dakar',
            'nombre_appartements' => 3,
        ]);

        $this->batiment2 = Batiment::create([
            'agence_id' => $this->agence2->id,
            'nom' => 'Bat Thiès',
            'adresse' => 'Thiès',
            'nombre_appartements' => 2,
        ]);

        $this->apptLibre = Appartement::create([
            'batiment_id' => $this->batiment1->id,
            'numero' => 'A1',
            'superficie' => 80,
            'loyer_mensuel' => 300000,
            'etat' => 'libre',
        ]);

        $this->apptOccupe = Appartement::create([
            'batiment_id' => $this->batiment1->id,
            'numero' => 'A2',
            'superficie' => 60,
            'loyer_mensuel' => 200000,
            'etat' => 'occupé',
        ]);

        $this->locataire = Locataire::create([
            'nom' => 'Diop',
            'prenom' => 'Abdoulaye',
            'telephone' => '77 123 45 67',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-001',
        ]);
    }

    public function test_create_location_on_free_apartment(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/locations', [
            'appartement_id' => $this->apptLibre->id,
            'locataire_id' => $this->locataire->id,
            'date_debut' => '2026-01-01',
            'date_fin' => '2026-12-31',
            'duree_mois' => 12,
            'montant_loyer' => 300000,
            'caution' => 600000,
            'statut' => 'active',
        ]);

        $response->assertStatus(201);
        $this->assertEquals('occupé', $this->apptLibre->fresh()->etat);
    }

    public function test_cannot_create_active_location_on_occupied_apartment(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/locations', [
            'appartement_id' => $this->apptOccupe->id,
            'locataire_id' => $this->locataire->id,
            'date_debut' => '2026-01-01',
            'date_fin' => '2026-12-31',
            'duree_mois' => 12,
            'montant_loyer' => 200000,
            'statut' => 'active',
        ]);

        $response->assertStatus(422)
            ->assertJsonFragment(['message' => "Cet appartement n'est pas disponible (état actuel : occupé)."]);
    }

    public function test_agent_cannot_create_location_for_other_agence(): void
    {
        $apptAutre = Appartement::create([
            'batiment_id' => $this->batiment2->id,
            'numero' => 'T1',
            'superficie' => 70,
            'loyer_mensuel' => 150000,
            'etat' => 'libre',
        ]);

        $response = $this->actingAs($this->agent1)->postJson('/api/locations', [
            'appartement_id' => $apptAutre->id,
            'locataire_id' => $this->locataire->id,
            'date_debut' => '2026-01-01',
            'date_fin' => '2026-12-31',
            'duree_mois' => 12,
            'montant_loyer' => 150000,
            'statut' => 'active',
        ]);

        $response->assertStatus(403);
    }

    public function test_terminate_location_frees_apartment(): void
    {
        $location = Location::create([
            'appartement_id' => $this->apptOccupe->id,
            'locataire_id' => $this->locataire->id,
            'date_debut' => '2026-01-01',
            'date_fin' => '2026-12-31',
            'duree_mois' => 12,
            'montant_loyer' => 200000,
            'statut' => 'active',
        ]);

        $response = $this->actingAs($this->admin)->putJson("/api/locations/{$location->id}", [
            'appartement_id' => $this->apptOccupe->id,
            'locataire_id' => $this->locataire->id,
            'date_debut' => '2026-01-01',
            'date_fin' => '2026-06-30',
            'duree_mois' => 6,
            'montant_loyer' => 200000,
            'statut' => 'terminee',
        ]);

        $response->assertOk();
        $this->assertEquals('libre', $this->apptOccupe->fresh()->etat);
    }

    public function test_delete_location_frees_apartment(): void
    {
        $location = Location::create([
            'appartement_id' => $this->apptOccupe->id,
            'locataire_id' => $this->locataire->id,
            'date_debut' => '2026-01-01',
            'date_fin' => '2026-12-31',
            'duree_mois' => 12,
            'montant_loyer' => 200000,
            'statut' => 'active',
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/locations/{$location->id}");

        $response->assertStatus(204);
        $this->assertEquals('libre', $this->apptOccupe->fresh()->etat);
    }

    public function test_agent_idor_on_show(): void
    {
        $apptAutre = Appartement::create([
            'batiment_id' => $this->batiment2->id,
            'numero' => 'T1',
            'superficie' => 70,
            'loyer_mensuel' => 150000,
            'etat' => 'occupé',
        ]);

        $location = Location::create([
            'appartement_id' => $apptAutre->id,
            'locataire_id' => $this->locataire->id,
            'date_debut' => '2026-01-01',
            'date_fin' => '2026-12-31',
            'duree_mois' => 12,
            'montant_loyer' => 150000,
            'statut' => 'active',
        ]);

        $response = $this->actingAs($this->agent1)->getJson("/api/locations/{$location->id}");

        $response->assertStatus(403);
    }
}
