<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Contrôleur d'authentification.
 *
 * Gère l'inscription (réservée aux administrateurs), la connexion via Sanctum,
 * la déconnexion, la récupération du profil et le changement de mot de passe.
 */
class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur (admin ou agent).
     * Seul un administrateur authentifié peut créer des comptes.
     *
     * @return \Illuminate\Http\JsonResponse 201 avec l'utilisateur créé
     */
    public function register(Request $request)
    {
        $currentUser = $request->user();

        if (!$currentUser || !$currentUser->isAdmin()) {
            abort(403, 'Seul un administrateur peut créer des comptes.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:administrateur,agent',
            'agence_id' => 'nullable|exists:agences,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'agence_id' => $request->agence_id,
        ]);

        return response()->json([
            'user' => $user->load('agence'),
        ], 201);
    }

    /**
     * Connexion d'un utilisateur.
     * Génère un token Sanctum (Bearer) en cas de succès.
     *
     * @return \Illuminate\Http\JsonResponse Token + données utilisateur
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('agence', 'locataire'),
        ]);
    }

    /**
     * Déconnexion — révoque le token courant.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Retourne le profil de l'utilisateur authentifié avec son agence et locataire.
     */
    public function user(Request $request)
    {
        return response()->json($request->user()->load('agence', 'locataire'));
    }

    /**
     * Changement de mot de passe.
     * Réinitialise le flag must_change_password après la première connexion.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false,
        ]);

        return response()->json(['message' => 'Mot de passe modifie avec succes.']);
    }
}
