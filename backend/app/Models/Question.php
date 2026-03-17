<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = ['sondage_id', 'titre', 'type', 'obligatoire', 'ordre'];

    public function sondage() { return $this->belongsTo(Sondage::class); }
    public function options() { return $this->hasMany(Option::class); }
}