<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Afficher tous les utilisateurs
    public function index(Request $request)
    {
        // Vérification ultra-stricte : Seul le super_admin passe !
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Accès refusé. Vous n\'êtes pas Super Admin.'], 403);
        }

        // On récupère tous les utilisateurs en les triant du plus récent au plus ancien
        $utilisateurs = User::latest()->get();
        return response()->json($utilisateurs);
    }

    // Supprimer un utilisateur
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $utilisateurASupprimer = User::findOrFail($id);

        // Sécurité : Le super admin ne doit pas pouvoir se supprimer lui-même par erreur !
        if ($utilisateurASupprimer->id === $request->user()->id) {
            return response()->json(['message' => 'Impossible de supprimer votre propre compte.'], 400);
        }

        $utilisateurASupprimer->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }
}