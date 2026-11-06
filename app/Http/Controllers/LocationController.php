<?php

namespace App\Http\Controllers;

use App\Models\Appartement;
use App\Models\Locataire;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::with('appartement.batiment', 'locataire')->latest()->paginate(15);
        return view('locations.index', compact('locations'));
    }

    public function create()
    {
        $appartements = Appartement::where('etat', 'libre')->get();
        $locataires = Locataire::all();
        return view('locations.create', compact('appartements', 'locataires'));
    }

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
            'statut' => 'required|in:active,terminée,résiliée',
        ]);

        $location = Location::create($validated);

        $appartement = Appartement::find($validated['appartement_id']);
        $appartement->update(['etat' => 'occupé']);

        return redirect()->route('locations.index')
            ->with('success', 'Location créée avec succès.');
    }

    public function show(Location $location)
    {
        $location->load('appartement.batiment', 'locataire', 'paiements');
        return view('locations.show', compact('location'));
    }

    public function edit(Location $location)
    {
        $appartements = Appartement::all();
        $locataires = Locataire::all();
        return view('locations.edit', compact('location', 'appartements', 'locataires'));
    }

    public function update(Request $request, Location $location)
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
            'statut' => 'required|in:active,terminée,résiliée',
        ]);

        $oldAppartementId = $location->appartement_id;
        $location->update($validated);

        if ($validated['statut'] !== 'active') {
            $location->appartement->update(['etat' => 'libre']);
        } elseif ($oldAppartementId != $validated['appartement_id']) {
            Appartement::find($oldAppartementId)->update(['etat' => 'libre']);
            Appartement::find($validated['appartement_id'])->update(['etat' => 'occupé']);
        }

        return redirect()->route('locations.index')
            ->with('success', 'Location mise à jour avec succès.');
    }

    public function destroy(Location $location)
    {
        $location->appartement->update(['etat' => 'libre']);
        $location->delete();

        return redirect()->route('locations.index')
            ->with('success', 'Location supprimée avec succès.');
    }
}
