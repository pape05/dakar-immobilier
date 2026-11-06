<?php

namespace App\Http\Controllers;

use App\Models\Appartement;
use App\Models\Batiment;
use App\Models\Location;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalBatiments = Batiment::count();
        $totalAppartements = Appartement::count();
        $appartementsOccupes = Appartement::where('etat', 'occupé')->count();
        $appartementsLibres = Appartement::where('etat', 'libre')->count();

        $locationsActives = Location::where('statut', 'active')->count();

        $paiementsMoisEnCours = Paiement::whereMonth('date_paiement', now()->month)
            ->whereYear('date_paiement', now()->year)
            ->sum('montant');

        $paiementsRecents = Paiement::with('location.appartement', 'location.locataire')
            ->latest()
            ->take(5)
            ->get();

        $locationsRecentes = Location::with('appartement.batiment', 'locataire')
            ->latest()
            ->take(5)
            ->get();

        return view('dashboard', compact(
            'totalBatiments',
            'totalAppartements',
            'appartementsOccupes',
            'appartementsLibres',
            'locationsActives',
            'paiementsMoisEnCours',
            'paiementsRecents',
            'locationsRecentes'
        ));
    }
}
