import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreerSondage from '../components/creerSondage'; // L'import est bien ici !

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    // L'état qui contrôle l'affichage du formulaire
    const [afficherFormulaire, setAfficherFormulaire] = useState(false);

   useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token'); // On vérifie aussi le token

        if (userData && token) {
            setUser(JSON.parse(userData));
        } else {
            // S'il manque l'un des deux, on considère qu'il n'est pas authentifié
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    if (!user) return <p className="text-center p-8 dark:text-white">Chargement du profil...</p>;

    return (
        <div className="container mx-auto p-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-primaire dark:text-secondaire">
                    Bonjour, {user.name} 👋
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Connecté en tant que : <span className="font-bold text-primaire dark:text-white uppercase">{user.role.replace('_', ' ')}</span>
                </p>
            </div>

            {/* VUE SUPER ADMIN */}
            {user.role === 'super_admin' && (
                <div className="bg-red-50 dark:bg-carteSombre p-6 rounded-lg shadow-md border-l-4 border-red-500 mb-8 transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-4 text-red-700 dark:text-red-400">Espace Propriétaire (Super Admin)</h3>
                    <p className="mb-4">Ici, vous aurez bientôt accès aux métriques globales de la plateforme :</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Nombre total d'inscrits</li>
                        <li>Nombre total de sondages créés</li>
                        <li>Modération : Supprimer des utilisateurs ou des sondages</li>
                    </ul>
                </div>
            )}

            {/* VUE UTILISATEUR / ADMIN (Créateur de sondage) */}
            <div className="bg-white dark:bg-carteSombre p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-primaire dark:text-white">Gérer mes sondages (Admin)</h3>
                    
                    {/* Le fameux bouton qui change l'état */}
                    <button 
                        onClick={() => setAfficherFormulaire(!afficherFormulaire)}
                        className="bg-secondaire hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded shadow transition-colors"
                    >
                        {afficherFormulaire ? 'Fermer le formulaire' : '+ Créer un nouveau sondage'}
                    </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Gérez ici les sondages dont vous êtes le créateur.
                </p>

                {/* Affichage conditionnel du formulaire */}
                {afficherFormulaire && (
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <CreerSondage onSondageCree={() => setAfficherFormulaire(false)} />
                    </div>
                )}
            </div>

            {/* VUE VOTANT */}
            <div className="mt-8 bg-white dark:bg-carteSombre p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-xl font-bold mb-4 text-primaire dark:text-white">Historique de mes votes (Votant)</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Retrouvez ici la liste des sondages auxquels vous avez participé.
                </p>
            </div>

        </div>
    );
}