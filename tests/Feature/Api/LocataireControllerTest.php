<?php

namespace Tests\Feature\Api;

use App\Models\Agence;
use App\Models\Locataire;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LocataireControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $agence = Agence::create(['nom' => 'Agence Test', 'adresse' => 'Dakar']);

        $this->admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.sn',
            'password' => Hash::make('password'),
            'role' => 'administrateur',
            'agence_id' => $agence->id,
        ]);
    }

    public function test_create_locataire_with_email_creates_user(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/locataires', [
            'nom' => 'Ba',
            'prenom' => 'Aminata',
            'telephone' => '78 234 56 78',
            'email' => 'aminata@test.sn',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-12345',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['default_password']);

        $this->assertDatabaseHas('locataires', ['email' => 'aminata@test.sn']);
        $this->assertDatabaseHas('users', [
            'email' => 'aminata@test.sn',
            'role' => 'locataire',
        ]);

        $this->assertEquals(12, strlen($response->json('default_password')));
    }

    public function test_create_locataire_without_email_no_user(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/locataires', [
            'nom' => 'Sy',
            'prenom' => 'Ibrahima',
            'telephone' => '77 567 89 01',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-67890',
        ]);

        $response->assertStatus(201);
        $this->assertArrayNotHasKey('default_password', $response->json());

        $locataire = Locataire::where('numero_piece', 'SN-67890')->first();
        $this->assertNull(User::where('locataire_id', $locataire->id)->first());
    }

    public function test_duplicate_numero_piece_rejected(): void
    {
        Locataire::create([
            'nom' => 'Diop',
            'prenom' => 'Abdoulaye',
            'telephone' => '77 000 00 00',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-UNIQUE',
        ]);

        $response = $this->actingAs($this->admin)->postJson('/api/locataires', [
            'nom' => 'Fall',
            'prenom' => 'Khady',
            'telephone' => '70 111 11 11',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-UNIQUE',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('numero_piece');
    }

    public function test_duplicate_email_rejected(): void
    {
        Locataire::create([
            'nom' => 'Diop',
            'prenom' => 'Abdoulaye',
            'telephone' => '77 000 00 00',
            'email' => 'existing@test.sn',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-001',
        ]);

        $response = $this->actingAs($this->admin)->postJson('/api/locataires', [
            'nom' => 'Fall',
            'prenom' => 'Khady',
            'telephone' => '70 111 11 11',
            'email' => 'existing@test.sn',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-002',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_update_syncs_user(): void
    {
        $locataire = Locataire::create([
            'nom' => 'Ba',
            'prenom' => 'Aminata',
            'telephone' => '78 234 56 78',
            'email' => 'aminata@test.sn',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-111',
        ]);

        $user = User::create([
            'name' => 'Aminata Ba',
            'email' => 'aminata@test.sn',
            'password' => Hash::make('password'),
            'role' => 'locataire',
            'locataire_id' => $locataire->id,
        ]);

        $response = $this->actingAs($this->admin)->putJson("/api/locataires/{$locataire->id}", [
            'nom' => 'Ba',
            'prenom' => 'Aminata Fatou',
            'telephone' => '78 234 56 78',
            'email' => 'aminata.new@test.sn',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-111',
        ]);

        $response->assertOk();

        $user->refresh();
        $this->assertEquals('Aminata Fatou Ba', $user->name);
        $this->assertEquals('aminata.new@test.sn', $user->email);
    }

    public function test_destroy_deletes_associated_user(): void
    {
        $locataire = Locataire::create([
            'nom' => 'Ndiaye',
            'prenom' => 'Moussa',
            'telephone' => '76 345 67 89',
            'email' => 'moussa@test.sn',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-222',
        ]);

        User::create([
            'name' => 'Moussa Ndiaye',
            'email' => 'moussa@test.sn',
            'password' => Hash::make('password'),
            'role' => 'locataire',
            'locataire_id' => $locataire->id,
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/locataires/{$locataire->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('locataires', ['id' => $locataire->id]);
        $this->assertDatabaseMissing('users', ['email' => 'moussa@test.sn']);
    }

    public function test_list_locataires(): void
    {
        Locataire::create([
            'nom' => 'Diop',
            'prenom' => 'Abdoulaye',
            'telephone' => '77 000 00 00',
            'piece_identite' => 'CNI',
            'numero_piece' => 'SN-333',
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/locataires');

        $response->assertOk();
        $this->assertCount(1, $response->json());
    }
}
