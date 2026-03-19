import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import CreerSondage from '../components/CreerSondage';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    
    // États
    const [mesSondages, setMesSondages] = useState([]); 
    const [historiqueVotes, setHistoriqueVotes] = useState([]);
    const [tousLesUtilisateurs, setTousLesUtilisateurs] = useState([]);
    
    // États pour l'UX (Notifications et Modales)
    const [showToast, setShowToast] = useState(false);
    const [sondageASupprimer, setSondageASupprimer] = useState(null); // <-- NOUVEL ÉTAT POUR LA MODALE

    const chargerMesSondages = async (userId) => {
        try {
            const reponse = await api.get('/sondages');
            const sondagesFiltres = reponse.data.filter(s => s.user_id === userId);
            setMesSondages(sondagesFiltres);
        } catch (err) {
            console.error("Erreur lors du chargement des sondages", err);
        }
    };

    const chargerHistoriqueVotes = async () => {
        try {
            const reponse = await api.get('/mes-votes'); 
            setHistoriqueVotes(reponse.data);
        } catch (err) {
            console.error("Erreur lors du chargement de l'historique", err);
        }
    };

    const chargerUtilisateurs = async () => {
        try {
            const reponse = await api.get('/users');
            setTousLesUtilisateurs(reponse.data);
        } catch (err) {
            console.error("Erreur chargement utilisateurs", err);
        }
    };

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

    // --- NOUVELLE LOGIQUE DE SUPPRESSION ---
    // 1. On ouvre la modale en stockant l'ID
    const demanderSuppression = (id) => {
        setSondageASupprimer(id);
    };

    // 2. Si on confirme dans la modale, on exécute la vraie suppression
    const confirmerSuppression = async () => {
        if (!sondageASupprimer) return;
        
        try {
            await api.delete(`/sondages/${sondageASupprimer}`);
            setMesSondages(mesSondages.filter(s => s.id !== sondageASupprimer));
            setSondageASupprimer(null); // On ferme la modale
        } catch (err) {
            alert("Erreur lors de la suppression du sondage.");
            setSondageASupprimer(null); // On ferme la modale même en cas d'erreur
        }
    };

    const handlePartager = (id) => {
        const url = `${window.location.origin}/sondage/${id}`;
        navigator.clipboard.writeText(url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userData && token) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            
            chargerMesSondages(parsedUser.id);
            chargerHistoriqueVotes(); 
            
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
        chargerMesSondages(user.id);
        navigate('/mes-sondages');
    };

    if (!user) return <p className="text-center p-8 dark:text-white">Chargement de votre espace...</p>;

    // ==========================================
    // VUE 1 : MES SONDAGES (/mes-sondages)
    // ==========================================
    if (location.pathname === '/mes-sondages') {
        return (
            <div className="container mx-auto p-8 transition-colors duration-300 relative">
                
                {/* TOAST NOTIFICATION (Partage) */}
                <div 
                    className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 transition-all duration-500 transform ${
                        showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
                    } bg-white text-gray-900 dark:bg-carteSombre dark:text-white border border-gray-200 dark:border-gray-700`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="font-bold">Lien copié !</span>
                </div>

                {/* --- LA FAMEUSE MODALE DE SUPPRESSION --- */}
                {sondageASupprimer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-700 transform scale-100 transition-transform">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Supprimer ce sondage ?</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Êtes-vous sûr de vouloir supprimer ce sondage ? <br className="hidden md:block" />
                                    <strong className="text-gray-700 dark:text-gray-300">Toutes les réponses récoltées seront définitivement perdues.</strong>
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSondageASupprimer(null)} // Bouton Annuler ferme la modale
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmerSuppression} // Bouton Confirmer lance la suppression
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2"
                                >
                                    Oui, supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-carteSombre p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="text-2xl font-bold text-primaire dark:text-white">Mes sondages actifs</h3>
                        <Link 
                            to="/creer" 
                            className="bg-secondaire hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            Créer un sondage
                        </Link>
                    </div>
                    
                    {mesSondages.length === 0 ? (
                        <div className="text-center py-10 border-t border-gray-100 dark:border-gray-700 mt-4">
                            <p className="text-gray-500 italic mb-4">Vous n'avez pas encore créé de sondage.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mesSondages.map(sondage => (
                                <div key={sondage.id} className="flex flex-col md:flex-row justify-between items-center bg-gray-50 dark:bg-fondSombre p-5 rounded-xl border border-gray-200 dark:border-gray-600 transition-colors">
                                    <div className="mb-4 md:mb-0 w-full md:w-1/2">
                                        <h5 className="font-bold text-lg text-primaire dark:text-white">{sondage.titre}</h5>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {sondage.questions?.length || 0} question(s) • Anonyme: {sondage.est_anonyme ? 'Oui' : 'Non'} • <span className="font-bold text-blue-600 dark:text-blue-400">{sondage.votes_count || 0} vote(s)</span> • Créé le {new Date(sondage.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                                        
                                        <button 
                                            onClick={() => handlePartager(sondage.id)}
                                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2 shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                                            Partager
                                        </button>

                                        <Link 
                                            to={`/sondage/${sondage.id}/resultats`}
                                            className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2 shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                            Résultats
                                        </Link>

                                        {/* LE NOUVEAU BOUTON SUPPRIMER (Design plus moderne) */}
                                        <button 
                                            onClick={() => demanderSuppression(sondage.id)}
                                            className="bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2 shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ==========================================
    // VUE 2 : CRÉER UN SONDAGE (/creer)
    // ==========================================
    if (location.pathname === '/creer') {
        return (
            <div className="container mx-auto p-4 md:p-8 transition-colors duration-300">
                <CreerSondage onSondageCree={handleSondageCree} />
            </div>
        );
    }

    // ==========================================
    // VUE 3 : PROFIL & HISTORIQUE (/profil)
    // ==========================================
    if (location.pathname === '/profil') {
        return (
            <div className="container mx-auto p-8 transition-colors duration-300 max-w-4xl">
                <div className="bg-white dark:bg-carteSombre p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
                    
                    <div className="w-24 h-24 mx-auto bg-primaire/10 dark:bg-secondaire/20 rounded-full flex items-center justify-center text-4xl mb-4">👤</div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">{user.email}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-10">
                        <div className="bg-gray-50 dark:bg-fondSombre p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Rôle du compte</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white uppercase">{user.role.replace('_', ' ')}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-fondSombre p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sondages créés</p>
                            <p className="text-xl font-bold text-primaire dark:text-secondaire">{mesSondages.length}</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                            <p className="text-sm text-blue-600 dark:text-blue-400">Participations (Votes)</p>
                            <p className="text-xl font-bold text-blue-900 dark:text-blue-300">{historiqueVotes.length}</p>
                        </div>
                    </div>

                    <div className="text-left border-t border-gray-200 dark:border-gray-700 pt-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mon historique de votes</h3>
                        
                        {historiqueVotes.length === 0 ? (
                            <p className="text-gray-500 italic p-4 bg-gray-50 dark:bg-fondSombre rounded-lg">Vous n'avez participé à aucun sondage pour le moment.</p>
                        ) : (
                            <div className="space-y-3">
                                {historiqueVotes.map(vote => (
                                    <div key={vote.id} className="bg-gray-50 dark:bg-fondSombre p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-white">
                                                {vote.sondage ? vote.sondage.titre : "Sondage supprimé ou expiré"}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                A voté le : {new Date(vote.created_at).toLocaleDateString()} à {new Date(vote.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                        {vote.sondage && (
                                            <Link 
                                                to={`/sondage/${vote.sondage.id}/resultats`} 
                                                className="bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors text-center shadow-sm"
                                            >
                                                Voir les résultats
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        );
    }

    if (location.pathname === '/dashboard') {
        navigate('/mes-sondages');
    }

    return null;
}