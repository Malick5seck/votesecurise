<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    protected $table = 'votes';

    protected $fillable = ['user_id', 'sondage_id', 'adresse_ip','est_anonyme']; 

    public function user() {return $this->belongsTo(User::class);}

    public function sondage() {return $this->belongsTo(Sondage::class);}

    public function reponses(){ return $this->hasMany(Reponse::class);}
}