<?php

namespace App\Http\Controllers;

use App\Models\Agence;
use App\Models\Batiment;
use Illuminate\Http\Request;

class BatimentController extends Controller
{
    public function index()
    {
        $batiments = Batiment::with('agence', 'appartements')->latest()->paginate(10);
        return view('batiments.index', compact('batiments'));
    }

    public function create()
    {
        $agences = Agence::all();
        return view('batiments.create', compact('agences'));
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
        ]);

        Batiment::create($validated);

        return redirect()->route('batiments.index')
            ->with('success', 'Bâtiment créé avec succès.');
    }

    public function show(Batiment $batiment)
    {
        $batiment->load('agence', 'appartements');
        return view('batiments.show', compact('batiment'));
    }

    public function edit(Batiment $batiment)
    {
        $agences = Agence::all();
        return view('batiments.edit', compact('batiment', 'agences'));
    }

    public function update(Request $request, Batiment $batiment)
    {
        $validated = $request->validate([
            'agence_id' => 'required|exists:agences,id',
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string',
            'nombre_appartements' => 'required|integer|min:1',
            'proprietaire' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $batiment->update($validated);

        return redirect()->route('batiments.index')
            ->with('success', 'Bâtiment mis à jour avec succès.');
    }

    public function destroy(Batiment $batiment)
    {
        $batiment->delete();

        return redirect()->route('batiments.index')
            ->with('success', 'Bâtiment supprimé avec succès.');
    }
}
