<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    use HasFactory;

    // L'option est maintenant liée à la question !
    protected $fillable = ['question_id', 'contenu'];

    public function question() { return $this->belongsTo(Question::class); }
}