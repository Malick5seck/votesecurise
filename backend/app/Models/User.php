<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name','email','password','role','ban_started_at','ban_until'];

    protected $hidden = ['password','remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'ban_started_at' => 'datetime',
            'ban_until' => 'datetime',
        ];
    }

    public function clearExpiredBan(): void
    {
        if ($this->ban_until === null || $this->ban_started_at === null) {
            return;
        }
        if (now()->greaterThanOrEqualTo($this->ban_until)) {
            $this->forceFill(['ban_started_at' => null, 'ban_until' => null])->save();
        }
    }

    public function isCurrentlyBanned(): bool
    {
        $this->clearExpiredBan();
        $this->refresh();

        if (!$this->ban_started_at) {
            return false;
        }
        if ($this->ban_until === null) {
            return true;
        }

        return now()->lessThan($this->ban_until);
    }

    public function sondages(){return $this->hasMany(Sondage::class);}

    public function votes(){return $this->hasMany(Vote::class);}
}
