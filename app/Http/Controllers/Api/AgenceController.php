<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agence;
use Illuminate\Http\Request;

class AgenceController extends Controller
{
    public function index()
    {
        $agences = Agence::withCount('batiments', 'users')->latest()->get();
        return response()->json($agences);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string',
            'telephone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $agence = Agence::create($validated);

        return response()->json($agence, 201);
    }

    public function show(Agence $agence)
    {
        $agence->load('batiments', 'users');
        return response()->json($agence);
    }

    public function update(Request $request, Agence $agence)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string',
            'telephone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $agence->update($validated);

        return response()->json($agence);
    }

    public function destroy(Agence $agence)
    {
        if ($agence->batiments()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer une agence contenant des bâtiments. Supprimez d\'abord les bâtiments.',
            ], 422);
        }

        $agence->delete();
        return response()->json(null, 204);
    }
}
