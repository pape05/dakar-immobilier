<?php

namespace App\Http\Controllers;

use App\Models\Appartement;
use App\Models\Batiment;
use Illuminate\Http\Request;

class AppartementController extends Controller
{
    public function index()
    {
        $appartements = Appartement::with('batiment')->latest()->paginate(15);
        return view('appartements.index', compact('appartements'));
    }

    public function create()
    {
        $batiments = Batiment::all();
        return view('appartements.create', compact('batiments'));
    }

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
        ]);

        Appartement::create($validated);

        return redirect()->route('appartements.index')
            ->with('success', 'Appartement créé avec succès.');
    }

    public function show(Appartement $appartement)
    {
        $appartement->load('batiment', 'locations.locataire');
        return view('appartements.show', compact('appartement'));
    }

    public function edit(Appartement $appartement)
    {
        $batiments = Batiment::all();
        return view('appartements.edit', compact('appartement', 'batiments'));
    }

    public function update(Request $request, Appartement $appartement)
    {
        $validated = $request->validate([
            'batiment_id' => 'required|exists:batiments,id',
            'numero' => 'required|string|max:255',
            'superficie' => 'required|numeric|min:0',
            'loyer_mensuel' => 'required|numeric|min:0',
            'etat' => 'required|in:libre,occupé,en_travaux',
            'nombre_pieces' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $appartement->update($validated);

        return redirect()->route('appartements.index')
            ->with('success', 'Appartement mis à jour avec succès.');
    }

    public function destroy(Appartement $appartement)
    {
        $appartement->delete();

        return redirect()->route('appartements.index')
            ->with('success', 'Appartement supprimé avec succès.');
    }
}
