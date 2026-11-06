<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    protected $fillable = [
        'location_id',
        'date_paiement',
        'mois_concerne',
        'montant',
        'mode_paiement',
        'reference_paiement',
        'remarques',
        'statut',
    ];

    protected $attributes = [
        'statut' => 'en_attente',
    ];

    protected $casts = [
        'date_paiement' => 'date',
        'montant' => 'decimal:2',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }
}
