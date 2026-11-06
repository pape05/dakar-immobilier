<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Paiement;
use App\Services\QuittanceService;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function index()
    {
        $paiements = Paiement::with('location.appartement', 'location.locataire')->latest()->paginate(15);
        return view('paiements.index', compact('paiements'));
    }

    public function create()
    {
        $locations = Location::where('statut', 'active')->with('appartement.batiment', 'locataire')->get();
        return view('paiements.create', compact('locations'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'date_paiement' => 'required|date',
            'mois_concerne' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:espèces,chèque,virement,mobile_money',
            'reference_paiement' => 'nullable|string|max:255',
            'remarques' => 'nullable|string',
        ]);

        Paiement::create($validated);

        return redirect()->route('paiements.index')
            ->with('success', 'Paiement enregistré avec succès.');
    }

    public function show(Paiement $paiement)
    {
        $paiement->load('location.appartement.batiment', 'location.locataire');
        return view('paiements.show', compact('paiement'));
    }

    public function edit(Paiement $paiement)
    {
        $locations = Location::where('statut', 'active')->with('appartement.batiment', 'locataire')->get();
        return view('paiements.edit', compact('paiement', 'locations'));
    }

    public function update(Request $request, Paiement $paiement)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'date_paiement' => 'required|date',
            'mois_concerne' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:espèces,chèque,virement,mobile_money',
            'reference_paiement' => 'nullable|string|max:255',
            'remarques' => 'nullable|string',
        ]);

        $paiement->update($validated);

        return redirect()->route('paiements.index')
            ->with('success', 'Paiement mis à jour avec succès.');
    }

    public function destroy(Paiement $paiement)
    {
        $paiement->delete();

        return redirect()->route('paiements.index')
            ->with('success', 'Paiement supprimé avec succès.');
    }

    public function generateQuittance(Paiement $paiement, QuittanceService $quittanceService)
    {
        return $quittanceService->genererQuittancePDF($paiement);
    }
}
