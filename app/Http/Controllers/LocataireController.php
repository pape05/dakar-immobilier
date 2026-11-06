<?php

namespace App\Http\Controllers;

use App\Models\Locataire;
use Illuminate\Http\Request;

class LocataireController extends Controller
{
    public function index()
    {
        $locataires = Locataire::latest()->paginate(15);
        return view('locataires.index', compact('locataires'));
    }

    public function create()
    {
        return view('locataires.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'piece_identite' => 'required|string|max:255',
            'numero_piece' => 'required|string|max:255',
            'adresse_actuelle' => 'nullable|string',
            'date_naissance' => 'nullable|date',
        ]);

        Locataire::create($validated);

        return redirect()->route('locataires.index')
            ->with('success', 'Locataire créé avec succès.');
    }

    public function show(Locataire $locataire)
    {
        $locataire->load('locations.appartement.batiment');
        return view('locataires.show', compact('locataire'));
    }

    public function edit(Locataire $locataire)
    {
        return view('locataires.edit', compact('locataire'));
    }

    public function update(Request $request, Locataire $locataire)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'piece_identite' => 'required|string|max:255',
            'numero_piece' => 'required|string|max:255',
            'adresse_actuelle' => 'nullable|string',
            'date_naissance' => 'nullable|date',
        ]);

        $locataire->update($validated);

        return redirect()->route('locataires.index')
            ->with('success', 'Locataire mis à jour avec succès.');
    }

    public function destroy(Locataire $locataire)
    {
        $locataire->delete();

        return redirect()->route('locataires.index')
            ->with('success', 'Locataire supprimé avec succès.');
    }
}
