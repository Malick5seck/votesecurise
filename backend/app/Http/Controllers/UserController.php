<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB; 
class UserController extends Controller
{
    // Lister les utilisateurs 
    public function index()
    {
        return response()->json(User::all());
    }

    public function destroy(Request $request, $id)
    {
        if (!$request->user() || $request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Action réservée au super administrateur.'], 403);
        }

        $userToSuspend = User::findOrFail($id);
        $nomUtilisateur = $userToSuspend->name;

        if ($userToSuspend->role === 'super_admin') {
            return response()->json(['message' => 'Impossible de suspendre un super administrateur.'], 403);
        }

        if ((int) $userToSuspend->id === (int) $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez pas suspendre votre propre compte.'], 403);
        }

        $request->validate([
            'motif' => 'required|string|max:2000',
            'permanent' => 'sometimes|boolean',
        ]);

        $permanent = $request->boolean('permanent');

        if (!$permanent) {
            $request->validate([
                'duration_days' => 'required|integer|min:1|max:3650',
            ]);
        }

        $motif = $request->input('motif');
        $banUntil = null;
        $detailFin = 'durée indéterminée';

        if (!$permanent) {
            $days = (int) $request->input('duration_days');
            $banUntil = now()->addDays($days);
            $detailFin = 'jusqu\'au ' . $banUntil->format('d/m/Y H:i');
        }

        $userToSuspend->update([
            'ban_started_at' => now(),
            'ban_until' => $banUntil,
        ]);

        if ($request->user() && $request->user()->role === 'super_admin') {
            DB::table('admin_logs')->insert([
                'user_id' => $request->user()->id,
                'action' => 'ban',
                'description' => "A suspendu l'utilisateur : {$nomUtilisateur} ({$detailFin}). Motif : {$motif}",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Utilisateur suspendu avec succès.',
            'user' => $userToSuspend->fresh(),
        ]);
    }

    //fonction pour mettre à jour le profil
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Informations mises à jour avec succès.',
            'user' => $user
        ]);
    }

    //fonction pour mettre à jour le mot de passe
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }

    // fonction pour afficher l'historique d'un utilisateur (sondages créés et votes)
    public function historiqueUtilisateur($id)
    {
        $user = User::findOrFail($id);
        
        $sondagesCrees = \App\Models\Sondage::where('user_id', $id)->withCount('votes')->latest()->get();
        
        $votes = \App\Models\Vote::where('user_id', $id)->with('sondage:id,titre')->latest()->get();

        //récupérer les logs d'administration si l'utilisateur est un super admin
        $adminLogs = [];
        if ($user->role === 'super_admin') {
            $adminLogs = DB::table('admin_logs')
                ->where('user_id', $id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json([
            'user' => $user,
            'sondages_crees' => $sondagesCrees,
            'historique_votes' => $votes,
            'admin_logs' => $adminLogs 
        ]);
    }
    //fonction recuperer les actions d'administration pour le super admin
    public function getAdminLogs(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $logs = DB::table('admin_logs')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($logs);
    }
}