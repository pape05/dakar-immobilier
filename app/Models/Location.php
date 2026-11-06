<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $fillable = [
        'appartement_id',
        'locataire_id',
        'date_debut',
        'date_fin',
        'duree_mois',
        'montant_loyer',
        'caution',
        'conditions_contrat',
        'statut',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'montant_loyer' => 'decimal:2',
        'caution' => 'decimal:2',
    ];

    public function appartement(): BelongsTo
    {
        return $this->belongsTo(Appartement::class);
    }

    public function locataire(): BelongsTo
    {
        return $this->belongsTo(Locataire::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }
}
