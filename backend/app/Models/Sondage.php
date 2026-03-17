<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sondage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'titre', 'description', 'slug', 'est_anonyme', 
        'est_prive', 'date_debut', 'date_fin', 'message_remerciement'
    ];

    public function user() { return $this->belongsTo(User::class); }
    
    // Un sondage possède désormais plusieurs questions (et plus directement des options)
    public function questions() { return $this->hasMany(Question::class); }
}