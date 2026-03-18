import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import CreerSondage from '../components/creerSondage';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [afficherFormulaire, setAfficherFormulaire] = useState(false);
    
    // États
    const [mesSondages, setMesSondages] = useState([]); 
    const [tousLesUtilisateurs, setTousLesUtilisateurs] = useState([]);

    // 1. Charger UNIQUEMENT les sondages créés par l'utilisateur connecté
    const chargerMesSondages = async (userId) => {
        try {
            const reponse = await api.get('/sondages');
            const sondagesFiltres = reponse.data.filter(s => s.user_id === userId);
            setMesSondages(sondagesFiltres);
        } catch (err) {
            console.error("Erreur lors du chargement des sondages", err);
        }
    };

    // 2. Charger les utilisateurs (Réservé au Super Admin)
    const chargerUtilisateurs = async () => {
        try {
            const reponse = await api.get('/users');
            setTousLesUtilisateurs(reponse.data);
        } catch (err) {
            console.error("Erreur chargement utilisateurs", err);
        }
    };

    // 3. Supprimer un utilisateur (Réservé au Super Admin)
    const supprimerUtilisateur = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ?")) {
            try {
                await api.delete(`/users/${id}`);
                setTousLesUtilisateurs(tousLesUtilisateurs.filter(u => u.id !== id));
            } catch (err) {
                alert(err.response?.data?.message || "Erreur lors de la suppression.");
            }
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userData && token) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            
            // Si c'est un créateur (admin ou super_admin), on charge ses sondages
            if (['admin', 'super_admin'].includes(parsedUser.role)) {
                chargerMesSondages(parsedUser.id);
            }
            
            // Si c'est le patron, on charge les inscrits
            if (parsedUser.role === 'super_admin') {
                chargerUtilisateurs();
            }
            
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    const handleSondageCree = () => {
        setAfficherFormulaire(false);
        chargerMesSondages(user.id);
    };

    if (!user) return <p className="text-center p-8 dark:text-white">Chargement du profil...</p>;

    return (
        <div className="container mx-auto p-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            
            <div className="mb-8 border-b pb-6 dark:border-gray-700">
                <h2 className="text-3xl font-bold mb-2 text-primaire dark:text-secondaire">
                    Bonjour, {user.name} 👋
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Connecté en tant que : <span className="font-bold text-primaire dark:text-white uppercase">{user.role.replace('_', ' ')}</span>
                </p>
            </div>

            {/* --- VUE SUPER ADMIN (Boîte Rouge - Gestion des Utilisateurs) --- */}
            {user.role === 'super_admin' && (
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg shadow-md border-l-4 border-red-500 mb-8 transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-4 text-red-700 dark:text-red-400">Espace Propriétaire - Gestion des Utilisateurs</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-carteSombre rounded-lg overflow-hidden shadow">
                            <thead className="bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-200">
                                <tr>
                                    <th className="py-3 px-4 text-left">Nom</th>
                                    <th className="py-3 px-4 text-left">Email</th>
                                    <th className="py-3 px-4 text-left">Rôle</th>
                                    <th className="py-3 px-4 text-left">Inscription</th>
                                    <th className="py-3 px-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {tousLesUtilisateurs.map(u => (
                                    <tr key={u.id} className="text-gray-700 dark:text-gray-300">
                                        <td className="py-3 px-4 font-bold">{u.name}</td>
                                        <td className="py-3 px-4">{u.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'super_admin' ? 'bg-red-100 text-red-800' : (u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800')}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-center">
                                            {u.id !== user.id && (
                                                <button 
                                                    onClick={() => supprimerUtilisateur(u.id)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                                                >
                                                    Bannir
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- VUE ADMIN & SUPER ADMIN (Boîte Blanche - Création de Sondages) --- */}
            {['admin', 'super_admin'].includes(user.role) && (
                <div className="bg-white dark:bg-carteSombre p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-primaire dark:text-white">Gérer mes sondages</h3>
                        
                        <button 
                            onClick={() => setAfficherFormulaire(!afficherFormulaire)}
                            className="bg-secondaire hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded shadow transition-colors"
                        >
                            {afficherFormulaire ? 'Fermer le formulaire' : '+ Créer un nouveau sondage'}
                        </button>
                    </div>

                    {afficherFormulaire && (
                        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
                            <CreerSondage onSondageCree={handleSondageCree} />
                        </div>
                    )}

                    {!afficherFormulaire && (
                        <div>
                            <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Mes sondages actifs</h4>
                            
                            {mesSondages.length === 0 ? (
                                <p className="text-gray-500 italic">Vous n'avez pas encore créé de sondage.</p>
                            ) : (
                                <div className="space-y-4">
                                    {mesSondages.map(sondage => (
                                        <div key={sondage.id} className="flex flex-col md:flex-row justify-between items-center bg-gray-50 dark:bg-fondSombre p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div className="mb-4 md:mb-0">
                                                <h5 className="font-bold text-lg text-primaire dark:text-white">{sondage.titre}</h5>
                                                <p className="text-sm text-gray-500">{sondage.questions?.length || 0} question(s) • Anonyme: {sondage.est_anonyme ? 'Oui' : 'Non'}</p>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button 
                                                    onClick={() => {
                                                        const url = `${window.location.origin}/sondage/${sondage.id}`;
                                                        navigator.clipboard.writeText(url);
                                                        alert('Lien copié dans le presse-papier !');
                                                    }}
                                                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded transition-colors text-sm flex items-center"
                                                >
                                                    🔗 Partager
                                                </button>

                                                <Link 
                                                    to={`/sondage/${sondage.id}/resultats`}
                                                    className="bg-primaire hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors text-sm flex items-center"
                                                >
                                                    📊 Voir les résultats
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* --- VUE POUR LES SIMPLES VOTANTS --- */}
            {user.role === 'votant' && (
                 <div className="bg-white dark:bg-carteSombre p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center transition-colors duration-300">
                     <div className="text-5xl mb-4">🗳️</div>
                     <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Bienvenue sur votre espace de vote</h3>
                     <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                         Votre compte est prêt. Vous pouvez dès maintenant participer aux sondages de la plateforme en toute sécurité.
                     </p>
                     <Link to="/" className="bg-primaire hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full transition-colors">
                         Voir les sondages disponibles
                     </Link>
                 </div>
            )}

        </div>
    );
}