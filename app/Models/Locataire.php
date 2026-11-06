<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Locataire extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'email',
        'piece_identite',
        'numero_piece',
        'adresse_actuelle',
        'date_naissance',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->prenom} {$this->nom}";
    }
}
