<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agence extends Model
{
    protected $fillable = [
        'nom',
        'adresse',
        'telephone',
        'email',
    ];

    public function batiments(): HasMany
    {
        return $this->hasMany(Batiment::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
