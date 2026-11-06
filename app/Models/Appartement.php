<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Appartement extends Model
{
    protected $fillable = [
        'batiment_id',
        'numero',
        'superficie',
        'loyer_mensuel',
        'etat',
        'nombre_pieces',
        'description',
        'photo',
    ];

    protected $casts = [
        'superficie' => 'decimal:2',
        'loyer_mensuel' => 'decimal:2',
    ];

    public function batiment(): BelongsTo
    {
        return $this->belongsTo(Batiment::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    public function locationActive(): HasOne
    {
        return $this->hasOne(Location::class)->where('statut', 'active');
    }
}
