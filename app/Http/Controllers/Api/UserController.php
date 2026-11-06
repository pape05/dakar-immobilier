<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('agence')->latest()->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:administrateur,agent,locataire',
            'agence_id' => 'nullable|exists:agences,id',
            'locataire_id' => 'nullable|exists:locataires,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['must_change_password'] = true;
        $user = User::create($validated);
        $user->load('agence', 'locataire');

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        $user->load('agence', 'locataire');
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:administrateur,agent,locataire',
            'agence_id' => 'nullable|exists:agences,id',
            'locataire_id' => 'nullable|exists:locataires,id',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        $user->load('agence', 'locataire');

        return response()->json($user);
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 422);
        }

        if ($user->isAdmin()) {
            $adminCount = User::where('role', 'administrateur')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Impossible de supprimer le dernier administrateur.',
                ], 422);
            }
        }

        $user->delete();
        return response()->json(null, 204);
    }
}
