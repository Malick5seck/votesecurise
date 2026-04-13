<x-mail::message>
# Bonjour {{ $data['name'] }},

@if($type === 'ban')
Votre compte a été suspendu par notre équipe de modération de VotePulse .

**Durée de la suspension :** {{ $data['duree'] }}
**Motif :** {{ $data['motif'] }}

@elseif($type === 'delete')
Votre sondage **"{{ $data['sondage_titre'] }}"** a été supprimé par notre équipe de modération de VotePulse car il ne respectait pas nos conditions d'utilisation.

**Motif de la suppression :** {{ $data['motif'] }}

@elseif($type === 'close')
Votre sondage **"{{ $data['sondage_titre'] }}"** a été clôturé de manière anticipée par notre équipe de modération de VotePulse. Il n'accepte plus de nouveaux votes.

**Motif de la clôture :** {{ $data['motif'] }}
@endif

Si vous pensez qu'il s'agit d'une erreur, merci de contacter le support administrateur.

Cordialement,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>