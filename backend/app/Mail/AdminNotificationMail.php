<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue; // ⚡ L'interface magique pour l'asynchrone
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $type;
    public $data;

    public function __construct($type, $data)
    {
        $this->type = $type;
        $this->data = $data;
    }

    public function envelope(): Envelope
    {
        $subjects = [
            'ban' => '⚠️ Suspension de votre compte',
            'delete' => '🗑️ Suppression de votre sondage',
            'close' => '🔒 Clôture de votre sondage'
        ];

        return new Envelope(
            subject: $subjects[$this->type] ?? 'Notification Administrateur',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.admin_notification',
        );
    }
}