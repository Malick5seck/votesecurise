<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash; // Ajout important pour le mot de passe

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
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }

    // --- NOUVEAU : METTRE À JOUR LE PROFIL (Nom, Email) ---
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

    // --- NOUVEAU : CHANGER LE MOT DE PASSE ---
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
}