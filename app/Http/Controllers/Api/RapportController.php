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
 * Contrôleur des rapports (administrateur uniquement).
 *
 * Fournit trois types de rapports : revenus mensuels, taux d'occupation
 * par bâtiment et liste des loyers impayés. Export CSV disponible.
 */
class RapportController extends Controller
{
    /** Rapport des revenus sur N mois avec taux de recouvrement. */
    public function revenus(Request $request)
    {
        $mois = (int) $request->get('mois', 12);
        $now = Carbon::now();

        $revenus = [];
        $totalEncaisse = 0;

        for ($i = $mois - 1; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $montant = Paiement::whereMonth('date_paiement', $date->month)
                ->whereYear('date_paiement', $date->year)
                ->where('statut', '!=', 'echoue')
                ->sum('montant');

            $totalEncaisse += $montant;

            $revenus[] = [
                'mois' => $date->translatedFormat('M Y'),
                'mois_court' => $date->translatedFormat('M'),
                'annee' => $date->year,
                'montant' => (float) $montant,
            ];
        }

        $locationsActives = Location::where('statut', 'active')->get();
        $totalAttendu = $locationsActives->sum('montant_loyer') * $mois;

        return response()->json([
            'revenus' => $revenus,
            'total_encaisse' => $totalEncaisse,
            'total_attendu' => $totalAttendu,
            'taux_recouvrement' => $totalAttendu > 0
                ? round(($totalEncaisse / $totalAttendu) * 100, 1)
                : 0,
        ]);
    }

    /** Taux d'occupation global et par bâtiment. */
    public function occupation()
    {
        $batiments = Batiment::withCount([
            'appartements',
            'appartements as occupes_count' => fn($q) => $q->where('etat', 'occupé'),
            'appartements as libres_count' => fn($q) => $q->where('etat', 'libre'),
        ])->get()->map(fn($bat) => [
            'id' => $bat->id,
            'nom' => $bat->nom,
            'total' => $bat->appartements_count,
            'occupes' => $bat->occupes_count,
            'libres' => $bat->libres_count,
            'taux' => $bat->appartements_count > 0
                ? round(($bat->occupes_count / $bat->appartements_count) * 100, 1)
                : 0,
        ]);

        $totalApparts = Appartement::count();
        $totalOccupes = Appartement::where('etat', 'occupé')->count();

        return response()->json([
            'batiments' => $batiments,
            'total_appartements' => $totalApparts,
            'total_occupes' => $totalOccupes,
            'taux_global' => $totalApparts > 0
                ? round(($totalOccupes / $totalApparts) * 100, 1)
                : 0,
        ]);
    }

    /** Liste des locataires avec loyer impayé ce mois, triée par jours de retard. */
    public function impayes()
    {
        $now = Carbon::now();

        $locationsActives = Location::with('locataire', 'appartement.batiment')
            ->where('statut', 'active')
            ->get();

        $impayes = [];
        $totalImpayes = 0;

        foreach ($locationsActives as $location) {
            $paieCeMois = Paiement::where('location_id', $location->id)
                ->whereMonth('date_paiement', $now->month)
                ->whereYear('date_paiement', $now->year)
                ->where('statut', '!=', 'echoue')
                ->exists();

            if (!$paieCeMois) {
                $joursRetard = max(0, $now->day - 5);
                $totalImpayes += $location->montant_loyer;

                $impayes[] = [
                    'locataire_nom' => $location->locataire?->prenom . ' ' . $location->locataire?->nom,
                    'locataire_telephone' => $location->locataire?->telephone,
                    'appartement' => 'Apt ' . $location->appartement?->numero,
                    'batiment' => $location->appartement?->batiment?->nom,
                    'montant' => (float) $location->montant_loyer,
                    'jours_retard' => $joursRetard,
                    'mois_concerne' => $now->translatedFormat('F Y'),
                ];
            }
        }

        usort($impayes, fn($a, $b) => $b['jours_retard'] - $a['jours_retard']);

        return response()->json([
            'impayes' => $impayes,
            'total_impayes' => $totalImpayes,
            'nombre_impayes' => count($impayes),
        ]);
    }

    /** Export CSV des rapports (revenus, occupation ou impayés) avec BOM UTF-8. */
    public function exportCsv(Request $request)
    {
        $type = $request->get('type', 'revenus');
        $now = Carbon::now();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=rapport_{$type}_{$now->format('Y-m-d')}.csv",
        ];

        $callback = function () use ($type, $now) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            if ($type === 'revenus') {
                fputcsv($file, ['Mois', 'Montant (FCFA)'], ';');
                for ($i = 11; $i >= 0; $i--) {
                    $date = $now->copy()->subMonths($i);
                    $montant = Paiement::whereMonth('date_paiement', $date->month)
                        ->whereYear('date_paiement', $date->year)
                        ->where('statut', '!=', 'echoue')
                        ->sum('montant');
                    fputcsv($file, [$date->translatedFormat('F Y'), number_format($montant, 0, ',', ' ')], ';');
                }
            } elseif ($type === 'occupation') {
                fputcsv($file, ['Bâtiment', 'Total Appartements', 'Occupés', 'Libres', 'Taux (%)'], ';');
                $batiments = Batiment::withCount([
                    'appartements',
                    'appartements as occupes_count' => fn($q) => $q->where('etat', 'occupé'),
                    'appartements as libres_count' => fn($q) => $q->where('etat', 'libre'),
                ])->get();
                foreach ($batiments as $bat) {
                    $taux = $bat->appartements_count > 0
                        ? round(($bat->occupes_count / $bat->appartements_count) * 100, 1)
                        : 0;
                    fputcsv($file, [$bat->nom, $bat->appartements_count, $bat->occupes_count, $bat->libres_count, $taux], ';');
                }
            } elseif ($type === 'impayes') {
                fputcsv($file, ['Locataire', 'Téléphone', 'Appartement', 'Bâtiment', 'Montant (FCFA)', 'Jours de retard'], ';');
                $locationsActives = Location::with('locataire', 'appartement.batiment')
                    ->where('statut', 'active')
                    ->get();
                foreach ($locationsActives as $loc) {
                    $paieCeMois = Paiement::where('location_id', $loc->id)
                        ->whereMonth('date_paiement', $now->month)
                        ->whereYear('date_paiement', $now->year)
                        ->where('statut', '!=', 'echoue')
                        ->exists();
                    if (!$paieCeMois) {
                        fputcsv($file, [
                            $loc->locataire?->prenom . ' ' . $loc->locataire?->nom,
                            $loc->locataire?->telephone,
                            'Apt ' . $loc->appartement?->numero,
                            $loc->appartement?->batiment?->nom,
                            number_format($loc->montant_loyer, 0, ',', ' '),
                            max(0, $now->day - 5),
                        ], ';');
                    }
                }
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
