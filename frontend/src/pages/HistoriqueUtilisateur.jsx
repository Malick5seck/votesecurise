import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function HistoriqueUtilisateur() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [donnees, setDonnees] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');
    const [pageChargee, setPageChargee] = useState(false);

    useEffect(() => {
        const fetchHistorique = async () => {
            try {
                const reponse = await api.get(`/users/${id}/historique`);
                setDonnees(reponse.data);
            } catch (err) {
                setErreur("Impossible de charger l'historique de cet utilisateur.");
            } finally {
                setChargement(false);
                setTimeout(() => setPageChargee(true), 50);
            }
        };
        fetchHistorique();
    }, [id]);

    if (chargement) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-[#3b82f6] dark:border-gray-700 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Analyse du profil en cours...</p>
        </div>
    );

    if (erreur) return (
        <div className="max-w-3xl mx-auto py-20 px-4 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{erreur}</h2>
            <button onClick={() => navigate('/dashboard')} className="mt-6 bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors">Retour au panel</button>
        </div>
    );

    if (!donnees) return null;

    // 🔥 On récupère le journal d'audit (s'il existe depuis le backend)
    const { user, sondages_crees, historique_votes, admin_logs = [] } = donnees;

    return (
        <div className={`max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out transform ${pageChargee ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-[#3b82f6] dark:text-gray-400 dark:hover:text-blue-400 font-bold mb-8 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                Retour à l'annuaire
            </button>

            {/* EN-TÊTE DU PROFIL */}
            <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold shadow-sm ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-[#3b82f6] dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                            {user.name}
                            <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-wider ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                {user.role.replace('_', ' ')}
                            </span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.909A2.25 2.25 0 012.25 8.513V6.75" /></svg>{user.email}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Inscrit le {new Date(user.created_at).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto text-center">
                    <div className="flex-1 md:flex-none bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Sondages</p>
                        <p className="text-2xl font-extrabold text-[#3b82f6]">{sondages_crees.length}</p>
                    </div>
                    <div className="flex-1 md:flex-none bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Votes</p>
                        <p className="text-2xl font-extrabold text-emerald-500">{historique_votes.length}</p>
                    </div>
                    {user.role === 'super_admin' && (
                        <div className="flex-1 md:flex-none bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Actions</p>
                            <p className="text-2xl font-extrabold text-purple-600">{admin_logs.length}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 🔥 BLOC EXCLUSIF SUPER ADMIN : JOURNAL D'AUDIT */}
            {user.role === 'super_admin' && (
                <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/30 mb-8 animate-fade-in">
                    <h3 className="text-xl font-extrabold text-purple-900 dark:text-purple-300 mb-6 border-b border-purple-100 dark:border-purple-900/30 pb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                        Journal d'Administration (Audit)
                    </h3>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {admin_logs.length === 0 ? (
                            <p className="text-gray-500 italic py-4">Aucune action administrative récente n'a été enregistrée.</p>
                        ) : (
                            admin_logs.map((log, index) => (
                                <div key={index} className="flex items-center gap-4 bg-gray-50/50 dark:bg-fondSombre p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className={`p-2 rounded-lg ${log.action === 'ban' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : log.action === 'cloture' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                                        {log.action === 'ban' ? '🔨' : log.action === 'cloture' ? '🔒' : '🗑️'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{log.description}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BLOC : SONDAGES CRÉÉS */}
                <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-extrabold dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">📝 Sondages publiés</h3>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {sondages_crees.length === 0 ? (
                            <p className="text-gray-500 italic py-4">Cet utilisateur n'a créé aucun sondage.</p>
                        ) : (
                            sondages_crees.map(sondage => (
                                <div key={sondage.id} className="group bg-gray-50/50 dark:bg-fondSombre p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center transition-all hover:border-[#3b82f6]/40 hover:shadow-md hover:-translate-y-0.5">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-[#3b82f6] transition-colors line-clamp-1">{sondage.titre}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {sondage.votes_count || 0} votes récoltés • {new Date(sondage.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Link to={`/sondage/${sondage.id}`} className="text-[#3b82f6] hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg transition-colors" title="Voir le sondage">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* BLOC : HISTORIQUE DES VOTES */}
                <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-extrabold dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">🕒 Participations</h3>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {historique_votes.length === 0 ? (
                            <p className="text-gray-500 italic py-4">Cet utilisateur n'a jamais voté.</p>
                        ) : (
                            historique_votes.map(vote => (
                                <div key={vote.id} className="group bg-gray-50/50 dark:bg-fondSombre p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center transition-all hover:border-emerald-400/40 hover:shadow-md hover:-translate-y-0.5">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-1">
                                            {vote.sondage ? vote.sondage.titre : "Sondage supprimé"}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                                            A voté le {new Date(vote.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {vote.sondage && (
                                        <Link to={`/sondage/${vote.sondage.id}/resultats`} className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 p-2 rounded-lg transition-colors" title="Voir les résultats">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                        </Link>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}