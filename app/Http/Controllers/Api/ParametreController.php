<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agence;
use Illuminate\Http\Request;

class ParametreController extends Controller
{
    public function profil(Request $request)
    {
        $user = $request->user()->load('agence');

        return response()->json([
            'user' => $user,
            'agence' => $user->agence,
        ]);
    }

    public function updateProfil(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user' => $user,
        ]);
    }

    public function updateAgence(Request $request)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            abort(403, 'Seul un administrateur peut modifier les informations de l\'agence.');
        }

        if (!$user->agence_id) {
            return response()->json(['message' => 'Aucune agence associée.'], 404);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'telephone' => 'required|string|max:30',
            'email' => 'required|email|max:255',
        ]);

        $agence = Agence::findOrFail($user->agence_id);
        $agence->update($request->only('nom', 'adresse', 'telephone', 'email'));

        return response()->json([
            'message' => 'Informations de l\'agence mises à jour.',
            'agence' => $agence,
        ]);
    }

    public function updateMotDePasse(Request $request)
    {
        return app(AuthController::class)->changePassword($request);
    }
}
