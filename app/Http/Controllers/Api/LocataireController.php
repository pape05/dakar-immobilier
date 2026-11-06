<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Locataire;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Contrôleur CRUD des locataires.
 *
 * Accessible aux administrateurs et agents.
 * Lors de la création, si un email est fourni, un compte utilisateur (rôle locataire)
 * est automatiquement créé avec un mot de passe aléatoire.
 */
class LocataireController extends Controller
{
    /** Liste des locataires avec leurs locations. */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Locataire::with('locations.appartement.batiment');

        if ($user->isAgent() && $user->agence_id) {
            $query->whereHas('locations.appartement.batiment', fn($q) => $q->where('agence_id', $user->agence_id));
        }

        $locataires = $query->latest()->get();
        return response()->json($locataires);
    }

    /**
     * Création d'un locataire.
     * Si un email est fourni, crée aussi un User avec must_change_password = true
     * et retourne le mot de passe par défaut généré.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:locataires,email|unique:users,email',
            'piece_identite' => 'required|string|max:255',
            'numero_piece' => 'required|string|max:255|unique:locataires,numero_piece',
            'adresse_actuelle' => 'nullable|string',
            'date_naissance' => 'nullable|date',
        ]);

        $result = DB::transaction(function () use ($validated) {
            $locataire = Locataire::create($validated);
            $defaultPassword = null;

            if (!empty($validated['email'])) {
                $defaultPassword = Str::random(12);

                User::create([
                    'name' => $validated['prenom'] . ' ' . $validated['nom'],
                    'email' => $validated['email'],
                    'password' => Hash::make($defaultPassword),
                    'role' => 'locataire',
                    'locataire_id' => $locataire->id,
                    'must_change_password' => true,
                ]);
            }

            return ['locataire' => $locataire, 'password' => $defaultPassword];
        });

        $response = $result['locataire']->toArray();
        if ($result['password']) {
            $response['default_password'] = $result['password'];
        }

        return response()->json($response, 201);
    }

    public function show(Locataire $locataire)
    {
        $locataire->load('locations.appartement.batiment');
        return response()->json($locataire);
    }

    /** Mise à jour — synchronise aussi le User associé (nom, email). */
    public function update(Request $request, Locataire $locataire)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:locataires,email,' . $locataire->id,
            'piece_identite' => 'required|string|max:255',
            'numero_piece' => 'required|string|max:255|unique:locataires,numero_piece,' . $locataire->id,
            'adresse_actuelle' => 'nullable|string',
            'date_naissance' => 'nullable|date',
        ]);

        DB::transaction(function () use ($locataire, $validated) {
            $locataire->update($validated);

            $user = User::where('locataire_id', $locataire->id)->first();
            if ($user) {
                $userUpdate = ['name' => $validated['prenom'] . ' ' . $validated['nom']];
                if (!empty($validated['email']) && $validated['email'] !== $user->email) {
                    $userUpdate['email'] = $validated['email'];
                }
                $user->update($userUpdate);
            }
        });

        return response()->json($locataire);
    }

    /** Suppression du locataire et de son compte User associé. */
    public function destroy(Locataire $locataire)
    {
        DB::transaction(function () use ($locataire) {
            User::where('locataire_id', $locataire->id)->delete();
            $locataire->delete();
        });

        return response()->json(null, 204);
    }
}
