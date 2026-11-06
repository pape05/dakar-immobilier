<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Batiment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BatimentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Batiment::with('agence', 'appartements');

        if ($user->isAgent() && $user->agence_id) {
            $query->where('agence_id', $user->agence_id);
        }

        $batiments = $query->latest()->get();
        return response()->json($batiments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'agence_id' => 'required|exists:agences,id',
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string',
            'nombre_appartements' => 'required|integer|min:1',
            'proprietaire' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        $user = $request->user();
        if ($user->isAgent() && $user->agence_id && $validated['agence_id'] != $user->agence_id) {
            abort(403, 'Vous ne pouvez créer un bâtiment que pour votre agence.');
        }

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('batiments', 'public');
        }

        $batiment = Batiment::create($validated);
        $batiment->load('agence');

        return response()->json($batiment, 201);
    }

    public function show(Request $request, Batiment $batiment)
    {
        $this->authorizeAgence($request, $batiment);
        $batiment->load('agence', 'appartements');
        return response()->json($batiment);
    }

    public function update(Request $request, Batiment $batiment)
    {
        $this->authorizeAgence($request, $batiment);

        $validated = $request->validate([
            'agence_id' => 'required|exists:agences,id',
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string',
            'nombre_appartements' => 'required|integer|min:1',
            'proprietaire' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('photo')) {
            if ($batiment->photo) {
                Storage::disk('public')->delete($batiment->photo);
            }
            $validated['photo'] = $request->file('photo')->store('batiments', 'public');
        }

        $batiment->update($validated);
        $batiment->load('agence');

        return response()->json($batiment);
    }

    public function destroy(Request $request, Batiment $batiment)
    {
        $this->authorizeAgence($request, $batiment);

        if ($batiment->appartements()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer un bâtiment contenant des appartements.',
            ], 422);
        }

        $batiment->delete();
        return response()->json(null, 204);
    }

    private function authorizeAgence(Request $request, Batiment $batiment): void
    {
        $user = $request->user();
        if ($user->isAgent() && $user->agence_id && $batiment->agence_id !== $user->agence_id) {
            abort(403, 'Accès non autorisé à ce bâtiment.');
        }
    }
}
