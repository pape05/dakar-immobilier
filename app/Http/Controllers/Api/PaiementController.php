<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\Notification;
use App\Models\Paiement;
use App\Services\QuittanceService;
use Illuminate\Http\Request;

/**
 * Contrôleur CRUD des paiements de loyer.
 *
 * Accessible aux administrateurs et agents.
 * Lors de la création d'un paiement en attente, une notification est envoyée au locataire.
 * Génère des quittances PDF via le QuittanceService (TCPDF).
 */
class PaiementController extends Controller
{
    /** Liste des paiements avec location, appartement et locataire. */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Paiement::with('location.appartement.batiment', 'location.locataire');

        if ($user->isAgent() && $user->agence_id) {
            $query->whereHas('location.appartement.batiment', fn($q) => $q->where('agence_id', $user->agence_id));
        }

        $paiements = $query->latest()->get();
        return response()->json($paiements);
    }

    /** Enregistrement d'un paiement — notifie le locataire si statut en_attente. */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'date_paiement' => 'required|date',
            'mois_concerne' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:especes,cheque,virement,mobile_money',
            'statut' => 'nullable|in:paye,en_attente,echoue',
            'reference_paiement' => 'nullable|string|max:255',
            'remarques' => 'nullable|string',
        ]);

        $this->authorizeAgenceByLocation($request, $validated['location_id']);

        $paiement = Paiement::create($validated);
        $paiement->load('location.appartement', 'location.locataire');

        if (($validated['statut'] ?? 'en_attente') === 'en_attente') {
            $location = $paiement->location;
            Notification::create([
                'locataire_id' => $location->locataire_id,
                'paiement_id' => $paiement->id,
                'titre' => 'Nouvelle facture a regler',
                'message' => "Veuillez regler votre loyer de {$validated['mois_concerne']} ({$validated['montant']} FCFA) avant la date d'echeance.",
                'type' => 'facture',
            ]);
        }

        return response()->json($paiement, 201);
    }

    public function show(Request $request, Paiement $paiement)
    {
        $this->authorizeAgence($request, $paiement);
        $paiement->load('location.appartement.batiment', 'location.locataire');
        return response()->json($paiement);
    }

    public function update(Request $request, Paiement $paiement)
    {
        $this->authorizeAgence($request, $paiement);

        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'date_paiement' => 'required|date',
            'mois_concerne' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:especes,cheque,virement,mobile_money',
            'statut' => 'nullable|in:paye,en_attente,echoue',
            'reference_paiement' => 'nullable|string|max:255',
            'remarques' => 'nullable|string',
        ]);

        $paiement->update($validated);
        $paiement->load('location.appartement', 'location.locataire');

        return response()->json($paiement);
    }

    public function destroy(Request $request, Paiement $paiement)
    {
        $this->authorizeAgence($request, $paiement);
        $paiement->delete();
        return response()->json(null, 204);
    }

    /** Génère et retourne la quittance PDF d'un paiement. */
    public function generateQuittance(Request $request, Paiement $paiement, QuittanceService $quittanceService)
    {
        $this->authorizeAgence($request, $paiement);
        return $quittanceService->genererQuittancePDF($paiement);
    }

    private function authorizeAgence(Request $request, Paiement $paiement): void
    {
        $user = $request->user();
        if ($user->isAgent() && $user->agence_id) {
            $paiement->loadMissing('location.appartement.batiment');
            if ($paiement->location->appartement->batiment->agence_id !== $user->agence_id) {
                abort(403, 'Accès non autorisé à ce paiement.');
            }
        }
    }

    private function authorizeAgenceByLocation(Request $request, int $locationId): void
    {
        $user = $request->user();
        if ($user->isAgent() && $user->agence_id) {
            $location = Location::with('appartement.batiment')->findOrFail($locationId);
            if ($location->appartement->batiment->agence_id !== $user->agence_id) {
                abort(403, 'Accès non autorisé à cette location.');
            }
        }
    }
}
