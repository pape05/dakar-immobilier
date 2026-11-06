<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'locataire_id',
        'paiement_id',
        'titre',
        'message',
        'type',
        'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];

    public function locataire(): BelongsTo
    {
        return $this->belongsTo(Locataire::class);
    }

    public function paiement(): BelongsTo
    {
        return $this->belongsTo(Paiement::class);
    }
}
