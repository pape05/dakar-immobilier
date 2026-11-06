<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appartement;
use App\Models\Batiment;
use App\Models\Location;
use App\Models\Paiement;
use Carbon\Carbon;
use Illuminate\Http\Request;

/**
 * Contrôleur du tableau de bord.
 *
 * Retourne les statistiques agrégées : nombre de bâtiments, appartements,
 * taux d'occupation, revenus mensuels (6 derniers mois), paiements en attente,
 * activité récente et échéances proches. Filtré par agence pour les agents.
 */
class DashboardController extends Controller
{
    /** Données complètes du tableau de bord. */
    public function index(Request $request)
    {
        $user = $request->user();
        $now = Carbon::now();
        $isAgent = $user->isAgent() && $user->agence_id;

        $batimentQuery = Batiment::query();
        $appartementQuery = Appartement::query();
        $locationQuery = Location::query();
        $paiementQuery = Paiement::query();

        if ($isAgent) {
            $agenceId = $user->agence_id;
            $batimentQuery->where('agence_id', $agenceId);
            $appartementQuery->whereHas('batiment', fn($q) => $q->where('agence_id', $agenceId));
            $locationQuery->whereHas('appartement.batiment', fn($q) => $q->where('agence_id', $agenceId));
            $paiementQuery->whereHas('location.appartement.batiment', fn($q) => $q->where('agence_id', $agenceId));
        }

        $stats = [
            'total_batiments' => (clone $batimentQuery)->count(),
            'total_appartements' => (clone $appartementQuery)->count(),
            'appartements_occupes' => (clone $appartementQuery)->where('etat', 'occupé')->count(),
            'appartements_libres' => (clone $appartementQuery)->where('etat', 'libre')->count(),
            'locations_actives' => (clone $locationQuery)->where('statut', 'active')->count(),
            'paiements_mois_encours' => (clone $paiementQuery)
                ->whereMonth('date_paiement', $now->month)
                ->whereYear('date_paiement', $now->year)
                ->sum('montant'),
        ];

        // Revenus des 6 derniers mois
        $revenus_mensuels = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $q = clone $paiementQuery;
            $revenus_mensuels[] = [
                'mois' => $date->translatedFormat('M Y'),
                'montant' => $q->whereMonth('date_paiement', $date->month)
                    ->whereYear('date_paiement', $date->year)
                    ->sum('montant'),
            ];
        }

        // Paiements en attente
        $locationsActives = (clone $locationQuery)
            ->with('locataire', 'appartement.batiment')
            ->where('statut', 'active')
            ->get();

        $paiements_en_attente = [];
        foreach ($locationsActives as $location) {
            $paieCeMois = Paiement::where('location_id', $location->id)
                ->whereMonth('date_paiement', $now->month)
                ->whereYear('date_paiement', $now->year)
                ->exists();

            if (!$paieCeMois) {
                $jourRetard = $now->day > 5 ? $now->day - 5 : 0;
                $paiements_en_attente[] = [
                    'locataire' => $location->locataire?->prenom . ' ' . $location->locataire?->nom,
                    'appartement' => 'Apt ' . $location->appartement?->numero . ' ' . $location->appartement?->batiment?->nom,
                    'montant' => $location->montant_loyer,
                    'retard' => $jourRetard,
                ];
            }
        }

        // Occupation par bâtiment
        $batiments_occupation = (clone $batimentQuery)->withCount([
            'appartements',
            'appartements as occupes_count' => function ($q) {
                $q->where('etat', 'occupé');
            },
        ])->get()->map(function ($bat) {
            return [
                'name' => $bat->nom,
                'occupied' => $bat->occupes_count,
                'total' => $bat->appartements_count,
            ];
        });

        // Activité récente
        $activite_recente = [];

        $paiementsRecents = (clone $paiementQuery)
            ->with('location.locataire')
            ->latest('date_paiement')
            ->take(3)
            ->get();

        foreach ($paiementsRecents as $p) {
            $activite_recente[] = [
                'type' => 'paiement',
                'text' => 'Paiement recu — ' . $p->location?->locataire?->prenom . ' ' . $p->location?->locataire?->nom . ' — ' . number_format($p->montant, 0, ',', ',') . ' FCFA',
                'date' => $p->date_paiement,
            ];
        }

        $locationsRecentes = (clone $locationQuery)
            ->with('locataire', 'appartement.batiment')
            ->latest()
            ->take(2)
            ->get();

        foreach ($locationsRecentes as $loc) {
            $activite_recente[] = [
                'type' => 'contrat',
                'text' => 'Nouveau contrat — ' . $loc->locataire?->prenom . ' ' . $loc->locataire?->nom . ' — Apt ' . $loc->appartement?->numero . ' ' . $loc->appartement?->batiment?->nom,
                'date' => $loc->created_at->toDateString(),
            ];
        }

        usort($activite_recente, fn($a, $b) => strtotime($b['date']) - strtotime($a['date']));

        $paiements_recus_mois = (clone $paiementQuery)
            ->whereMonth('date_paiement', $now->month)
            ->whereYear('date_paiement', $now->year)
            ->count();

        $echeances_proches = (clone $locationQuery)
            ->where('statut', 'active')
            ->whereNotNull('date_fin')
            ->whereBetween('date_fin', [$now, $now->copy()->addDays(30)])
            ->count();

        return response()->json([
            'stats' => $stats,
            'revenus_mensuels' => $revenus_mensuels,
            'paiements_en_attente' => $paiements_en_attente,
            'batiments_occupation' => $batiments_occupation,
            'activite_recente' => $activite_recente,
            'paiements_recus_mois' => $paiements_recus_mois,
            'echeances_proches' => $echeances_proches,
        ]);
    }
}
