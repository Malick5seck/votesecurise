<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    // fonction pour l'inscription 
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // fonction pour la connexion
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();
        
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        if ($user->isCurrentlyBanned()) {
            $message = $user->ban_until
                ? 'Votre compte est suspendu jusqu\'au ' . $user->ban_until->timezone(config('app.timezone'))->format('d/m/Y \à H:i') . '.'
                : 'Votre compte est suspendu.';

            return response()->json([
                'message' => $message,
                'ban_until' => $user->ban_until,
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token
        ]);
    }

    // fonction pour la déconnexion
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    // fonction pour la demande de réinitialisation de mot de passe
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Aucun compte associé à cette adresse email.'], 404);
        }

        $token = Str::random(60);
 
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => Hash::make($token), 'created_at' => Carbon::now()]
        );

        Log::info("Demande de réinitialisation de mot de passe initiée pour : " . $user->email);

        $resetLink = env('FRONTEND_URL', 'http://localhost:5173') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);

        try {
            Mail::send([], [], function ($message) use ($user, $resetLink) {
                $message->to($user->email)
                        ->subject('Réinitialisation de votre mot de passe')
                        ->html("
                            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                                <h2>Bonjour {$user->name},</h2>
                                <p>Vous avez demandé la réinitialisation de votre mot de passe sur la plateforme de <strong>Vote Sécurisé</strong>.</p>
                                <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                                <br>
                                <a href='{$resetLink}' style='padding: 12px 25px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>
                                    Réinitialiser mon mot de passe
                                </a>
                                <br><br>
                                <p style='color: #666; font-size: 14px;'>⚠️ Ce lien expirera dans 15 minutes.</p>
                                <p style='color: #999; font-size: 12px;'>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
                            </div>
                        ");
            });

            return response()->json([
                'message' => 'Si cet email existe, un lien de réinitialisation a été envoyé dans votre boîte mail !'
            ]);

        } catch (\Exception $e) {
            Log::error("Erreur d'envoi d'email : " . $e->getMessage());
            return response()->json([
                'message' => "Erreur technique lors de l'envoi de l'email. Veuillez contacter l'administrateur."
            ], 500);
        }
    }

    // fonction pour la validation du nouveau mot de passe
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|min:8|confirmed',
        ]);

        $resetRecord = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
            return response()->json(['message' => 'Ce lien de réinitialisation est invalide.'], 400);
        }

        if (Carbon::parse($resetRecord->created_at)->addMinutes(15)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Ce lien a expiré (> 15 minutes). Veuillez refaire une demande.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => Hash::make($request->password)]);

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        Log::info("Mot de passe réinitialisé avec succès pour : " . $user->email);

        return response()->json(['message' => 'Votre mot de passe a été réinitialisé avec succès.']);
    }
}