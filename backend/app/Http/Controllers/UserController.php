<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB; // 🔥 Ajout pour pouvoir interagir avec la table admin_logs

class UserController extends Controller
{
    // Lister les utilisateurs (Pour l'admin)
    public function index()
    {
        return response()->json(User::all());
    }

    // Supprimer un utilisateur (Pour l'admin)
    public function destroy(Request $request, $id)
    {
        $userToDelete = User::findOrFail($id);
        $nomUtilisateur = $userToDelete->name; // On sauvegarde le nom avant de le détruire

        // 🔥 NOUVEAU : Enregistrer l'action dans le journal d'audit pour le Super Admin
        if ($request->user() && $request->user()->role === 'super_admin') {
            DB::table('admin_logs')->insert([
                'user_id' => $request->user()->id, // L'ID du Super Admin qui fait l'action
                'action' => 'ban',
                'description' => "A banni l'utilisateur : " . $nomUtilisateur,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Ensuite on supprime l'utilisateur
        $userToDelete->delete();

        return response()->json(['message' => 'Utilisateur banni avec succès.']);
    }

    // --- METTRE À JOUR LE PROFIL (Nom, Email) ---
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

    // --- CHANGER LE MOT DE PASSE ---
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed', // 'confirmed' vérifie que new_password_confirmation correspond
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }

    // --- HISTORIQUE POUR LE SUPER ADMIN ---
    public function historiqueUtilisateur($id)
    {
        $user = User::findOrFail($id);
        
        $sondagesCrees = \App\Models\Sondage::where('user_id', $id)->withCount('votes')->latest()->get();
        
        $votes = \App\Models\Vote::where('user_id', $id)->with('sondage:id,titre')->latest()->get();

        // Récupération des logs si l'utilisateur est admin
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
    // --- NOUVEAU : RÉCUPÉRER L'HISTORIQUE GLOBAL POUR LE SUPER ADMIN ---
    public function getAdminLogs(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        // On récupère toutes les actions, de la plus récente à la plus ancienne
        $logs = \Illuminate\Support\Facades\DB::table('admin_logs')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($logs);
    }
}