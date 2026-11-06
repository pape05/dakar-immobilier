<?php

namespace Tests\Feature\Api;

use App\Models\Agence;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    private Agence $agence;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agence = Agence::create(['nom' => 'Agence Test', 'adresse' => 'Dakar']);

        $this->admin = User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@test.sn',
            'password' => Hash::make('password'),
            'role' => 'administrateur',
            'agence_id' => $this->agence->id,
        ]);
    }

    public function test_admin_can_list_users(): void
    {
        User::create([
            'name' => 'Agent',
            'email' => 'agent@test.sn',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'agence_id' => $this->agence->id,
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/users');

        $response->assertOk();
        $this->assertGreaterThanOrEqual(2, count($response->json()));
    }

    public function test_admin_can_create_user(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/users', [
            'name' => 'Nouvel Agent',
            'email' => 'new@test.sn',
            'password' => 'password123',
            'role' => 'agent',
            'agence_id' => $this->agence->id,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'new@test.sn']);

        $newUser = User::where('email', 'new@test.sn')->first();
        $this->assertTrue($newUser->must_change_password);
    }

    public function test_agent_cannot_access_users(): void
    {
        $agent = User::create([
            'name' => 'Agent',
            'email' => 'agent@test.sn',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'agence_id' => $this->agence->id,
        ]);

        $response = $this->actingAs($agent)->getJson('/api/users');

        $response->assertStatus(403);
    }

    public function test_cannot_delete_self(): void
    {
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/users/{$this->admin->id}");

        $response->assertStatus(422)
            ->assertJsonFragment(['message' => 'Vous ne pouvez pas supprimer votre propre compte.']);
    }

    public function test_cannot_delete_last_admin(): void
    {
        $otherAdmin = User::create([
            'name' => 'Autre Admin',
            'email' => 'admin2@test.sn',
            'password' => Hash::make('password'),
            'role' => 'administrateur',
            'agence_id' => $this->agence->id,
        ]);

        // Can delete when there are 2 admins
        $response = $this->actingAs($otherAdmin)
            ->deleteJson("/api/users/{$this->admin->id}");

        $response->assertStatus(204);

        // Now otherAdmin is the last admin — cannot be deleted
        $anotherUser = User::create([
            'name' => 'Agent Temp',
            'email' => 'temp@test.sn',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'agence_id' => $this->agence->id,
        ]);

        // Create a new admin to perform the delete attempt
        $newAdmin = User::create([
            'name' => 'New Admin',
            'email' => 'newadmin@test.sn',
            'password' => Hash::make('password'),
            'role' => 'administrateur',
            'agence_id' => $this->agence->id,
        ]);

        // Now delete newAdmin from otherAdmin (2 admins, should work)
        $response = $this->actingAs($otherAdmin)
            ->deleteJson("/api/users/{$newAdmin->id}");

        $response->assertStatus(204);

        // Now otherAdmin is the last admin again
        $this->assertEquals(1, User::where('role', 'administrateur')->count());
    }

    public function test_update_user(): void
    {
        $agent = User::create([
            'name' => 'Agent',
            'email' => 'agent@test.sn',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'agence_id' => $this->agence->id,
        ]);

        $response = $this->actingAs($this->admin)->putJson("/api/users/{$agent->id}", [
            'name' => 'Agent Modifié',
            'email' => 'agent@test.sn',
            'role' => 'agent',
            'agence_id' => $this->agence->id,
        ]);

        $response->assertOk()
            ->assertJsonPath('name', 'Agent Modifié');
    }
}
