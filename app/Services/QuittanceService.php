<?php

namespace App\Services;

use App\Models\Paiement;
use TCPDF;

class QuittanceService
{
    public function genererQuittancePDF(Paiement $paiement)
    {
        $paiement->load('location.appartement.batiment.agence', 'location.locataire');

        $agence = $paiement->location->appartement->batiment->agence;
        $locataire = $paiement->location->locataire;
        $appartement = $paiement->location->appartement;
        $batiment = $appartement->batiment;

        $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);

        $pdf->SetCreator('Immo Gestion');
        $pdf->SetAuthor($agence->nom);
        $pdf->SetTitle('Quittance de Loyer - ' . $locataire->full_name);

        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->SetMargins(15, 15, 15);

        $pdf->AddPage();

        $montantFormate = number_format($paiement->montant, 0, ',', ' ');
        $datePaiement = $paiement->date_paiement->format('d/m/Y');
        $dateGeneration = now()->format('d/m/Y à H:i');
        $reference = $paiement->reference_paiement ?? '—';
        $modePaiement = ucfirst(str_replace('_', ' ', $paiement->mode_paiement));
        $remarques = $paiement->remarques ? '<br><span style="color: #64748b; font-size: 9px;">Remarques : ' . e($paiement->remarques) . '</span>' : '';

        $statutLabels = [
            'paye' => ['label' => 'PAYÉ', 'bg' => '#ecfdf5', 'color' => '#065f46'],
            'en_attente' => ['label' => 'EN ATTENTE', 'bg' => '#fef3c7', 'color' => '#92400e'],
            'echoue' => ['label' => 'ÉCHOUÉ', 'bg' => '#fef2f2', 'color' => '#991b1b'],
        ];
        $statutInfo = $statutLabels[$paiement->statut] ?? $statutLabels['en_attente'];
        $badgeStatut = $statutInfo['label'];
        $badgeBg = $statutInfo['bg'];
        $badgeColor = $statutInfo['color'];

        $html = <<<HTML
<style>
    .header-bar { background-color: #3b2418; color: #ffffff; padding: 20px 25px; border-radius: 6px; }
    .header-title { font-size: 22px; font-weight: bold; color: #ffffff; }
    .header-sub { font-size: 10px; color: #f3d2a7; letter-spacing: 1px; }
    .section-title { font-size: 11px; font-weight: bold; color: #3b2418; border-bottom: 2px solid #c79457; padding-bottom: 4px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.3px; }
    .value { font-size: 11px; color: #1e293b; font-weight: bold; }
    .montant-box { background-color: #fef7ed; border: 2px solid #c79457; border-radius: 6px; padding: 15px; text-align: center; }
    .montant-value { font-size: 28px; font-weight: bold; color: #3b2418; }
    .montant-label { font-size: 10px; color: #8a552f; text-transform: uppercase; letter-spacing: 1px; }
    .footer { font-size: 8px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    .badge { background-color: #ecfdf5; color: #065f46; font-size: 9px; padding: 3px 10px; border-radius: 10px; font-weight: bold; }
</style>

<!-- EN-TÊTE -->
<table cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td class="header-bar">
            <span class="header-sub">QUITTANCE DE LOYER</span><br><br>
            <span class="header-title">{$agence->nom}</span><br>
            <span style="font-size: 10px; color: #d9c4b1;">{$agence->adresse}</span>
        </td>
    </tr>
</table>

<br><br>

<!-- N° QUITTANCE + STATUT -->
<table cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td width="50%" style="font-size: 10px; color: #64748b;">
            Quittance N° <span style="font-weight: bold; color: #1e293b;">#{$paiement->id}</span>
        </td>
        <td width="50%" align="right">
            <span style="background-color: {$badgeBg}; color: {$badgeColor}; font-size: 9px; padding: 3px 10px; border-radius: 10px; font-weight: bold;">{$badgeStatut}</span>
        </td>
    </tr>
</table>

<br><br>

<!-- LOCATAIRE & BIEN -->
<table cellpadding="8" cellspacing="0" width="100%">
    <tr>
        <td width="48%" style="background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span class="section-title">Locataire</span><br><br>
            <span class="label">Nom complet</span><br>
            <span class="value">{$locataire->full_name}</span><br><br>
            <span class="label">Téléphone</span><br>
            <span class="value">{$locataire->telephone}</span>
        </td>
        <td width="4%"></td>
        <td width="48%" style="background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span class="section-title">Bien loué</span><br><br>
            <span class="label">Bâtiment</span><br>
            <span class="value">{$batiment->nom}</span><br><br>
            <span class="label">Appartement</span><br>
            <span class="value">N° {$appartement->numero}</span><br><br>
            <span class="label">Adresse</span><br>
            <span class="value">{$batiment->adresse}</span>
        </td>
    </tr>
</table>

<br><br>

<!-- DÉTAILS DU PAIEMENT -->
<table cellpadding="8" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
    <tr>
        <td colspan="4"><span class="section-title">Détails du paiement</span></td>
    </tr>
    <tr>
        <td width="25%">
            <span class="label">Mois concerné</span><br>
            <span class="value">{$paiement->mois_concerne}</span>
        </td>
        <td width="25%">
            <span class="label">Date de paiement</span><br>
            <span class="value">{$datePaiement}</span>
        </td>
        <td width="25%">
            <span class="label">Mode de paiement</span><br>
            <span class="value">{$modePaiement}</span>
        </td>
        <td width="25%">
            <span class="label">Référence</span><br>
            <span class="value">{$reference}</span>
        </td>
    </tr>
</table>

<br><br>

<!-- MONTANT -->
<table cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td class="montant-box">
            <span class="montant-label">Montant acquitté</span><br><br>
            <span class="montant-value">{$montantFormate} FCFA</span>
            {$remarques}
        </td>
    </tr>
</table>

<br><br><br><br>

<!-- SIGNATURE -->
<table cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td width="50%" style="font-size: 10px; color: #475569;">
            <strong>Le bailleur</strong><br><br><br><br>
            ____________________________<br>
            <span style="font-size: 8px; color: #94a3b8;">{$agence->nom}</span>
        </td>
        <td width="50%" align="right" style="font-size: 10px; color: #475569;">
            <strong>Le locataire</strong><br><br><br><br>
            ____________________________<br>
            <span style="font-size: 8px; color: #94a3b8;">{$locataire->full_name}</span>
        </td>
    </tr>
</table>

<br><br>

<!-- FOOTER -->
<table cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td class="footer">
            Document généré le {$dateGeneration} — Immo Gestion • Ce document fait office de quittance de loyer conformément à la loi.
        </td>
    </tr>
</table>
HTML;

        $pdf->writeHTML($html, true, false, true, false, '');

        $pdfContent = $pdf->Output('quittance_' . $paiement->id . '.pdf', 'S');

        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="quittance_' . $paiement->id . '.pdf"',
        ]);
    }
}
