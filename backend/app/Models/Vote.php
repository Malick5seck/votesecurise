<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    protected $table = 'votes';

    // On a retiré option_sondage_id, mais on garde adresse_ip
    protected $fillable = ['user_id', 'sondage_id', 'adresse_ip','est_anonyme']; // <-- NOUVEAUTÉ : On ajoute le champ anonyme

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sondage()
    {
        return $this->belongsTo(Sondage::class);
    }

    // LA NOUVEAUTÉ : Un vote contient désormais plusieurs réponses !
    public function reponses()
    {
        return $this->hasMany(Reponse::class);
    }
}