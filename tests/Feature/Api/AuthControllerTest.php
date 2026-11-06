<?php

namespace Tests\Feature\Api;

use App\Models\Agence;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        $agence = Agence::create(['nom' => 'Agence Test', 'adresse' => 'Dakar']);
        return User::create([
            'name' => 'Admin',
            'email' => 'admin@test.sn',
            'password' => Hash::make('password123'),
            'role' => 'administrateur',
            'agence_id' => $agence->id,
        ]);
    }

    public function test_login_with_valid_credentials(): void
    {
        $user = $this->createAdmin();

        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.sn',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['access_token', 'token_type', 'user']);
    }

    public function test_login_with_invalid_credentials(): void
    {
        $this->createAdmin();

        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.sn',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_login_validation(): void
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_logout(): void
    {
        $user = $this->createAdmin();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/logout');

        $response->assertOk()
            ->assertJson(['message' => 'Déconnexion réussie']);
        $this->assertCount(0, $user->tokens()->get());
    }

    public function test_get_current_user(): void
    {
        $user = $this->createAdmin();

        $response = $this->actingAs($user)
            ->getJson('/api/user');

        $response->assertOk()
            ->assertJsonFragment(['email' => 'admin@test.sn']);
    }

    public function test_register_as_admin(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->postJson('/api/register', [
                'name' => 'Nouvel Agent',
                'email' => 'agent@test.sn',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'agent',
                'agence_id' => $admin->agence_id,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('user.email', 'agent@test.sn');
    }

    public function test_register_forbidden_for_agent(): void
    {
        $agence = Agence::create(['nom' => 'Agence', 'adresse' => 'Dakar']);
        $agent = User::create([
            'name' => 'Agent',
            'email' => 'agent@test.sn',
            'password' => Hash::make('password123'),
            'role' => 'agent',
            'agence_id' => $agence->id,
        ]);

        $response = $this->actingAs($agent)
            ->postJson('/api/register', [
                'name' => 'Test',
                'email' => 'new@test.sn',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role' => 'agent',
            ]);

        $response->assertStatus(403);
    }

    public function test_change_password(): void
    {
        $user = $this->createAdmin();

        $response = $this->actingAs($user)
            ->postJson('/api/change-password', [
                'current_password' => 'password123',
                'password' => 'newpassword456',
                'password_confirmation' => 'newpassword456',
            ]);

        $response->assertOk();
        $this->assertTrue(Hash::check('newpassword456', $user->fresh()->password));
    }

    public function test_change_password_wrong_current(): void
    {
        $user = $this->createAdmin();

        $response = $this->actingAs($user)
            ->postJson('/api/change-password', [
                'current_password' => 'wrongpassword',
                'password' => 'newpassword456',
                'password_confirmation' => 'newpassword456',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('current_password');
    }

    public function test_unauthenticated_access(): void
    {
        $response = $this->getJson('/api/user');
        $response->assertStatus(401);
    }
}
