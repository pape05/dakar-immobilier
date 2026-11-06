<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appartement;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Contrôleur CRUD des contrats de location.
 *
 * Gère le cycle de vie d'une location : création (vérifie que l'appartement est libre),
 * mise à jour du statut, et libération automatique de l'appartement à la résiliation/suppression.
 */
class LocationController extends Controller
{
    /** Liste des locations avec appartement, bâtiment et locataire. */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Location::with('appartement.batiment', 'locataire');

        if ($user->isAgent() && $user->agence_id) {
            $query->whereHas('appartement.batiment', fn($q) => $q->where('agence_id', $user->agence_id));
        }

        $locations = $query->latest()->get();
        return response()->json($locations);
    }

    /**
     * Création d'une location.
     * Vérifie que l'appartement est libre avant de l'affecter.
     * Passe l'appartement en état "occupé" si le statut est actif.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'appartement_id' => 'required|exists:appartements,id',
            'locataire_id' => 'required|exists:locataires,id',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after:date_debut',
            'duree_mois' => 'required|integer|min:1',
            'montant_loyer' => 'required|numeric|min:0',
            'caution' => 'nullable|numeric|min:0',
            'conditions_contrat' => 'nullable|string',
            'statut' => 'required|in:active,terminee,resiliee',
        ]);

        $appartement = Appartement::findOrFail($validated['appartement_id']);

        $this->authorizeAgenceByAppartement($request, $appartement);

        if ($validated['statut'] === 'active' && $appartement->etat !== 'libre') {
            return response()->json([
                'message' => 'Cet appartement n\'est pas disponible (état actuel : ' . $appartement->etat . ').',
            ], 422);
        }

        $location = DB::transaction(function () use ($validated, $appartement) {
            $location = Location::create($validated);

            if ($validated['statut'] === 'active') {
                $appartement->update(['etat' => 'occupé']);
            }

            return $location;
        });

        $location->load('appartement.batiment', 'locataire');

        return response()->json($location, 201);
    }

    public function show(Request $request, Location $location)
    {
        $this->authorizeAgence($request, $location);
        $location->load('appartement.batiment', 'locataire', 'paiements');
        return response()->json($location);
    }

    /** Mise à jour — gère le changement d'appartement et la libération si résiliation. */
    public function update(Request $request, Location $location)
    {
        $this->authorizeAgence($request, $location);

        $validated = $request->validate([
            'appartement_id' => 'required|exists:appartements,id',
            'locataire_id' => 'required|exists:locataires,id',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after:date_debut',
            'duree_mois' => 'required|integer|min:1',
            'montant_loyer' => 'required|numeric|min:0',
            'caution' => 'nullable|numeric|min:0',
            'conditions_contrat' => 'nullable|string',
            'statut' => 'required|in:active,terminee,resiliee',
        ]);

        $oldAppartementId = $location->appartement_id;

        DB::transaction(function () use ($location, $validated, $oldAppartementId) {
            $location->update($validated);

            if ($validated['statut'] !== 'active') {
                $location->appartement->update(['etat' => 'libre']);
            } elseif ($oldAppartementId != $validated['appartement_id']) {
                Appartement::find($oldAppartementId)->update(['etat' => 'libre']);
                Appartement::find($validated['appartement_id'])->update(['etat' => 'occupé']);
            }
        });

        $location->load('appartement.batiment', 'locataire');

        return response()->json($location);
    }

    /** Suppression — libère l'appartement automatiquement. */
    public function destroy(Request $request, Location $location)
    {
        $this->authorizeAgence($request, $location);

        DB::transaction(function () use ($location) {
            $location->appartement->update(['etat' => 'libre']);
            $location->delete();
        });

        return response()->json(null, 204);
    }

    private function authorizeAgence(Request $request, Location $location): void
    {
        $user = $request->user();
        if ($user->isAgent() && $user->agence_id) {
            $location->loadMissing('appartement.batiment');
            if ($location->appartement->batiment->agence_id !== $user->agence_id) {
                abort(403, 'Accès non autorisé à cette location.');
            }
        }
    }

    private function authorizeAgenceByAppartement(Request $request, Appartement $appartement): void
    {
        $user = $request->user();
        if ($user->isAgent() && $user->agence_id) {
            $appartement->loadMissing('batiment');
            if ($appartement->batiment->agence_id !== $user->agence_id) {
                abort(403, 'Accès non autorisé à cet appartement.');
            }
        }
    }
}
