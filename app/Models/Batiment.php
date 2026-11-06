<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Batiment extends Model
{
    protected $fillable = [
        'agence_id',
        'nom',
        'adresse',
        'nombre_appartements',
        'proprietaire',
        'description',
        'photo',
    ];

    public function agence(): BelongsTo
    {
        return $this->belongsTo(Agence::class);
    }

    public function appartements(): HasMany
    {
        return $this->hasMany(Appartement::class);
    }
}
