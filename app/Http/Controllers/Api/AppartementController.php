<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appartement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Contrôleur CRUD des appartements.
 *
 * Accessible aux administrateurs et agents.
 * Un agent ne voit que les appartements des bâtiments de son agence.
 */
class AppartementController extends Controller
{
    /** Liste des appartements avec leur bâtiment et agence. */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Appartement::with('batiment.agence');

        if ($user->isAgent() && $user->agence_id) {
            $query->whereHas('batiment', fn($q) => $q->where('agence_id', $user->agence_id));
        }

        $appartements = $query->latest()->get();
        return response()->json($appartements);
    }

    /** Création d'un appartement avec upload photo optionnel (max 5 Mo). */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'batiment_id' => 'required|exists:batiments,id',
            'numero' => 'required|string|max:255',
            'superficie' => 'required|numeric|min:0',
            'loyer_mensuel' => 'required|numeric|min:0',
            'etat' => 'required|in:libre,occupé,en_travaux',
            'nombre_pieces' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        $this->authorizeAgenceByBatiment($request, $validated['batiment_id']);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('appartements', 'public');
        }

        $appartement = Appartement::create($validated);
        $appartement->load('batiment');

        return response()->json($appartement, 201);
    }

    public function show(Request $request, Appartement $appartement)
    {
        $this->authorizeAgence($request, $appartement);
        $appartement->load('batiment.agence', 'locations.locataire');
        return response()->json($appartement);
    }

    public function update(Request $request, Appartement $appartement)
    {
        $this->authorizeAgence($request, $appartement);

        $validated = $request->validate([
            'batiment_id' => 'required|exists:batiments,id',
            'numero' => 'required|string|max:255',
            'superficie' => 'required|numeric|min:0',
            'loyer_mensuel' => 'required|numeric|min:0',
            'etat' => 'required|in:libre,occupé,en_travaux',
            'nombre_pieces' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('photo')) {
            if ($appartement->photo) {
                Storage::disk('public')->delete($appartement->photo);
            }
            $validated['photo'] = $request->file('photo')->store('appartements', 'public');
        }

        $appartement->update($validated);
        $appartement->load('batiment');

        return response()->json($appartement);
    }

    /** Suppression — refuse si l'appartement a une location active. */
    public function destroy(Request $request, Appartement $appartement)
    {
        $this->authorizeAgence($request, $appartement);

        if ($appartement->locations()->where('statut', 'active')->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer un appartement ayant une location active.',
            ], 422);
        }

        if ($appartement->photo) {
            Storage::disk('public')->delete($appartement->photo);
        }
        $appartement->delete();
        return response()->json(null, 204);
    }

    private function authorizeAgence(Request $request, Appartement $appartement): void
    {
        $user = $request->user();
        if ($user->isAgent() && $user->agence_id) {
            $appartement->loadMissing('batiment');
            if ($appartement->batiment->agence_id !== $user->agence_id) {
                abort(403, 'Accès non autorisé à cet appartement.');
            }
        }
    }

    private function authorizeAgenceByBatiment(Request $request, int $batimentId): void
    {
        $user = $request->user();
        if ($user->isAgent() && $user->agence_id) {
            $batiment = \App\Models\Batiment::findOrFail($batimentId);
            if ($batiment->agence_id !== $user->agence_id) {
                abort(403, 'Vous ne pouvez ajouter un appartement que dans un bâtiment de votre agence.');
            }
        }
    }
}
