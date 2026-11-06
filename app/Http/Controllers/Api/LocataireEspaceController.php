<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Paiement;
use App\Services\QuittanceService;
use Illuminate\Http\Request;

/**
 * Contrôleur de l'espace locataire.
 *
 * Fournit au locataire connecté ses données personnelles : contrat actif,
 * historique des paiements, notifications et téléchargement de quittances PDF.
 */
class LocataireEspaceController extends Controller
{
    /** Données complètes de l'espace locataire (contrat, paiements, notifications). */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->locataire_id) {
            return response()->json(['message' => 'Aucun profil locataire associe'], 403);
        }

        $locataire = $user->locataire()->first();
        $locataire->load('locations.appartement.batiment', 'locations.paiements');

        $locationActive = $locataire->locations->where('statut', 'active')->first();

        $paiements = $locataire->locations->flatMap->paiements->sortByDesc('date_paiement')->values();

        $notifications = Notification::where('locataire_id', $locataire->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'locataire' => $locataire,
            'location_active' => $locationActive,
            'paiements' => $paiements,
            'notifications' => $notifications,
        ]);
    }

    /** Téléchargement de la quittance PDF — vérifie que le paiement appartient au locataire. */
    public function quittance(Request $request, Paiement $paiement, QuittanceService $quittanceService)
    {
        $user = $request->user();
        $paiement->loadMissing('location');

        if ($paiement->location->locataire_id !== $user->locataire_id) {
            return response()->json(['message' => 'Non autorise'], 403);
        }

        return $quittanceService->genererQuittancePDF($paiement);
    }

    /** Marque une notification comme lue (vérifie l'appartenance au locataire). */
    public function markNotificationRead(Request $request, Notification $notification)
    {
        $user = $request->user();

        if ($notification->locataire_id !== $user->locataire_id) {
            return response()->json(['message' => 'Non autorise'], 403);
        }

        $notification->update(['lu' => true]);

        return response()->json(['message' => 'OK']);
    }
}
