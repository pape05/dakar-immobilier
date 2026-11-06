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
 * Contrôleur des alertes (administrateur et agent).
 *
 * Génère dynamiquement 4 types d'alertes :
 * - Loyers impayés (avec calcul du retard en jours)
 * - Contrats expirant dans les 30 prochains jours
 * - Bâtiments avec taux d'occupation inférieur à 50%
 * - Paiements reçus dans les dernières 48h
 *
 * Les alertes sont triées par priorité (haute > moyenne > basse > info).
 */
class AlerteController extends Controller
{
    /** Retourne la liste des alertes avec compteurs par priorité. */
    public function index(Request $request)
    {
        $user = $request->user();
        $now = Carbon::now();
        $alertes = [];

        $isAgent = $user->isAgent() && $user->agence_id;
        $agenceId = $user->agence_id;

        $locationQuery = Location::with('locataire', 'appartement.batiment')
            ->where('statut', 'active');

        if ($isAgent) {
            $locationQuery->whereHas('appartement.batiment', fn($q) => $q->where('agence_id', $agenceId));
        }

        // 1. Loyers impayés ce mois
        $locationsActives = $locationQuery->get();

        foreach ($locationsActives as $location) {
            $paieCeMois = Paiement::where('location_id', $location->id)
                ->whereMonth('date_paiement', $now->month)
                ->whereYear('date_paiement', $now->year)
                ->where('statut', '!=', 'echoue')
                ->exists();

            if (!$paieCeMois && $now->day > 5) {
                $jours = $now->day - 5;
                $alertes[] = [
                    'id' => 'impaye_' . $location->id,
                    'type' => 'loyer_retard',
                    'priorite' => $jours > 15 ? 'haute' : ($jours > 5 ? 'moyenne' : 'basse'),
                    'titre' => 'Loyer impayé',
                    'message' => ($location->locataire?->prenom ?? '') . ' ' . ($location->locataire?->nom ?? '') .
                        ' — ' . ($location->appartement?->batiment?->nom ?? '') .
                        ', Apt ' . ($location->appartement?->numero ?? '') .
                        ' — ' . number_format($location->montant_loyer, 0, ',', ' ') . ' FCFA',
                    'detail' => $jours . ' jour' . ($jours > 1 ? 's' : '') . ' de retard',
                    'date' => $now->toDateString(),
                ];
            }
        }

        // 2. Contrats expirant dans les 30 prochains jours
        $contratsQuery = Location::with('locataire', 'appartement.batiment')
            ->where('statut', 'active')
            ->whereNotNull('date_fin')
            ->whereBetween('date_fin', [$now, $now->copy()->addDays(30)]);

        if ($isAgent) {
            $contratsQuery->whereHas('appartement.batiment', fn($q) => $q->where('agence_id', $agenceId));
        }

        foreach ($contratsQuery->get() as $contrat) {
            $joursRestants = $now->diffInDays($contrat->date_fin, false);
            $alertes[] = [
                'id' => 'expiration_' . $contrat->id,
                'type' => 'contrat_expiration',
                'priorite' => $joursRestants <= 7 ? 'haute' : ($joursRestants <= 15 ? 'moyenne' : 'basse'),
                'titre' => 'Contrat bientôt expiré',
                'message' => ($contrat->locataire?->prenom ?? '') . ' ' . ($contrat->locataire?->nom ?? '') .
                    ' — ' . ($contrat->appartement?->batiment?->nom ?? '') .
                    ', Apt ' . ($contrat->appartement?->numero ?? ''),
                'detail' => 'Expire dans ' . $joursRestants . ' jour' . ($joursRestants > 1 ? 's' : '') .
                    ' (' . $contrat->date_fin->format('d/m/Y') . ')',
                'date' => $contrat->date_fin->toDateString(),
            ];
        }

        // 3. Bâtiments avec occupation basse (< 50%)
        $batimentQuery = Batiment::withCount([
            'appartements',
            'appartements as occupes_count' => fn($q) => $q->where('etat', 'occupé'),
        ])->having('appartements_count', '>', 0);

        if ($isAgent) {
            $batimentQuery->where('agence_id', $agenceId);
        }

        foreach ($batimentQuery->get() as $bat) {
            $taux = round(($bat->occupes_count / $bat->appartements_count) * 100, 1);
            if ($taux < 50) {
                $alertes[] = [
                    'id' => 'occupation_' . $bat->id,
                    'type' => 'occupation_basse',
                    'priorite' => $taux < 25 ? 'haute' : 'moyenne',
                    'titre' => 'Occupation basse',
                    'message' => $bat->nom . ' — ' . $bat->occupes_count . '/' . $bat->appartements_count . ' appartements occupés',
                    'detail' => 'Taux d\'occupation : ' . $taux . '%',
                    'date' => $now->toDateString(),
                ];
            }
        }

        // 4. Paiements récents (dernières 48h)
        $paiementQuery = Paiement::with('location.locataire', 'location.appartement.batiment')
            ->where('date_paiement', '>=', $now->copy()->subDays(2))
            ->where('statut', '!=', 'echoue')
            ->latest('date_paiement')
            ->take(5);

        if ($isAgent) {
            $paiementQuery->whereHas('location.appartement.batiment', fn($q) => $q->where('agence_id', $agenceId));
        }

        foreach ($paiementQuery->get() as $paiement) {
            $alertes[] = [
                'id' => 'paiement_' . $paiement->id,
                'type' => 'nouveau_paiement',
                'priorite' => 'info',
                'titre' => 'Paiement reçu',
                'message' => ($paiement->location?->locataire?->prenom ?? '') . ' ' .
                    ($paiement->location?->locataire?->nom ?? '') .
                    ' — ' . number_format($paiement->montant, 0, ',', ' ') . ' FCFA',
                'detail' => ($paiement->location?->appartement?->batiment?->nom ?? '') .
                    ', Apt ' . ($paiement->location?->appartement?->numero ?? '') .
                    ' — ' . $paiement->mode_paiement,
                'date' => $paiement->date_paiement->toDateString(),
            ];
        }

        // Tri par priorité puis date
        $prioriteOrdre = ['haute' => 0, 'moyenne' => 1, 'basse' => 2, 'info' => 3];
        usort($alertes, function ($a, $b) use ($prioriteOrdre) {
            $pa = $prioriteOrdre[$a['priorite']] ?? 9;
            $pb = $prioriteOrdre[$b['priorite']] ?? 9;
            if ($pa !== $pb) return $pa - $pb;
            return strcmp($b['date'], $a['date']);
        });

        $compteurs = [
            'total' => count($alertes),
            'haute' => count(array_filter($alertes, fn($a) => $a['priorite'] === 'haute')),
            'moyenne' => count(array_filter($alertes, fn($a) => $a['priorite'] === 'moyenne')),
            'basse' => count(array_filter($alertes, fn($a) => $a['priorite'] === 'basse')),
            'info' => count(array_filter($alertes, fn($a) => $a['priorite'] === 'info')),
        ];

        return response()->json([
            'alertes' => $alertes,
            'compteurs' => $compteurs,
        ]);
    }
}
