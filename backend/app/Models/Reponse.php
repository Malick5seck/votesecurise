<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reponse extends Model
{
    use HasFactory;

    protected $fillable = ['vote_id', 'question_id', 'option_id', 'valeur_texte'];

    public function vote() { return $this->belongsTo(Vote::class); }
    public function question() { return $this->belongsTo(Question::class); }
    public function option() { return $this->belongsTo(Option::class); }
}