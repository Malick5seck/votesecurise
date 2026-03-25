<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sondage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'titre', 'description', 'slug', 'est_anonyme', 
        'est_prive', 'date_debut', 'date_fin', 'message_remerciement',
        'domaine_restreint', 'emails_autorises'
    ];

    protected $casts = [
        'est_anonyme' => 'boolean',
        'est_prive' => 'boolean',
        'emails_autorises' => 'array', 
    ];
    
    public function user() { return $this->belongsTo(User::class); }

    public function questions() { return $this->hasMany(Question::class); }

    public function votes() { return $this->hasMany(Vote::class); }
}