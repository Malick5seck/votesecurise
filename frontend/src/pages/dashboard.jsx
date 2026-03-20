import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import CreerSondage from '../components/creerSondage';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    
    // États Utilisateur Normal
    const [mesSondages, setMesSondages] = useState([]); 
    const [historiqueVotes, setHistoriqueVotes] = useState([]);
    
    // États Super Admin
    const [tousLesUtilisateurs, setTousLesUtilisateurs] = useState([]);
    const [tousLesSondages, setTousLesSondages] = useState([]);
    const [adminOngletActif, setAdminOngletActif] = useState('dashboard');
    
    // États UX (Toasts et Modales)
    const [showToast, setShowToast] = useState({ visible: false, message: '', type: 'success' });
    const [pageActuelle, setPageActuelle] = useState(1);
    const sondagesParPage = 5;

    // 🔥 GESTION DES MODALES SANS ALERT()
    const [sondageASupprimer, setSondageASupprimer] = useState(null);
    const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);
    const [sondageACloturer, setSondageACloturer] = useState(null);
    const [sondageAdminASupprimer, setSondageAdminASupprimer] = useState(null);

    // États Profil
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [pwdData, setPwdData] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
    const [loadingProfil, setChargementProfil] = useState(false);

    // --- FONCTIONS DE CHARGEMENT ---
    const chargerDonneesNormales = async (userId) => {
        try {
            const resSondages = await api.get('/sondages');
            setMesSondages(resSondages.data.filter(s => s.user_id === userId));
            const resVotes = await api.get('/mes-votes');
            setHistoriqueVotes(resVotes.data);
        } catch (err) { console.error(err); }
    };

    const chargerDonneesAdmin = async () => {
        try {
            const [resUsers, resSondages] = await Promise.all([
                api.get('/users'),
                api.get('/sondages')
            ]);
            setTousLesUtilisateurs(resUsers.data);
            setTousLesSondages(resSondages.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userData && token) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setEditName(parsedUser.name);
            setEditEmail(parsedUser.email);
            
            if (parsedUser.role === 'super_admin') {
                chargerDonneesAdmin();
                if (location.pathname !== '/admin') navigate('/admin');
            } else {
                chargerDonneesNormales(parsedUser.id);
                if (location.pathname === '/admin') navigate('/mes-sondages');
            }
        } else {
            navigate('/login');
        }
    }, [navigate, location.pathname]);

    // --- NOTIFICATIONS (TOASTS) ---
    const afficherToast = (message, type = 'success') => {
        setShowToast({ visible: true, message, type });
        setTimeout(() => setShowToast({ visible: false, message: '', type: 'success' }), 3000);
    };

    // --- ACTIONS PROFIL ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setChargementProfil(true);
        try {
            const reponse = await api.put('/user/profile', { name: editName, email: editEmail });
            setUser(reponse.data.user);
            localStorage.setItem('user', JSON.stringify(reponse.data.user));
            afficherToast("Informations mises à jour !");
        } catch (err) { afficherToast(err.response?.data?.message || "Erreur de modification", 'error'); }
        finally { setChargementProfil(false); }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setChargementProfil(true);
        try {
            await api.put('/user/password', pwdData);
            setPwdData({ current_password: '', new_password: '', new_password_confirmation: '' }); 
            afficherToast("Mot de passe modifié !");
        } catch (err) { afficherToast(err.response?.data?.message || "Erreur", 'error'); }
        finally { setChargementProfil(false); }
    };

    // --- ACTIONS DE SUPPRESSION (SANS ALERT() NI CONFIRM()) ---
    const confirmerSuppression = async () => {
        if (!sondageASupprimer) return;
        try {
            await api.delete(`/sondages/${sondageASupprimer}`);
            const nouvelleListe = mesSondages.filter(s => s.id !== sondageASupprimer);
            setMesSondages(nouvelleListe);
            setSondageASupprimer(null);
            
            const totalPagesApresSuppression = Math.ceil(nouvelleListe.length / sondagesParPage);
            if (pageActuelle > totalPagesApresSuppression && totalPagesApresSuppression > 0) {
                setPageActuelle(totalPagesApresSuppression);
            }
            afficherToast("Sondage supprimé de votre espace.");
        } catch (err) { afficherToast("Erreur de suppression", 'error'); setSondageASupprimer(null); }
    };

    const confirmerSuppressionUtilisateur = async () => {
        if (!utilisateurASupprimer) return;
        try {
            await api.delete(`/users/${utilisateurASupprimer}`);
            // 🔥 Suppression instantanée du tableau visuel !
            setTousLesUtilisateurs(tousLesUtilisateurs.filter(u => u.id !== utilisateurASupprimer));
            setUtilisateurASupprimer(null);
            afficherToast("Utilisateur banni avec succès !");
        } catch (err) { afficherToast("Erreur lors de la suppression.", 'error'); setUtilisateurASupprimer(null); }
    };

    const confirmerCloture = async () => {
        if (!sondageACloturer) return;
        try {
            await api.put(`/sondages/${sondageACloturer}/cloturer`);
            chargerDonneesAdmin(); // Recharger la liste pour voir le statut "Expiré"
            setSondageACloturer(null);
            afficherToast("Le sondage a été clôturé.");
        } catch (err) { afficherToast("Erreur lors de la clôture", 'error'); setSondageACloturer(null); }
    };

    const confirmerSuppressionSondageAdmin = async () => {
        if (!sondageAdminASupprimer) return;
        try {
            await api.delete(`/sondages/${sondageAdminASupprimer}`);
            setTousLesSondages(tousLesSondages.filter(s => s.id !== sondageAdminASupprimer));
            setSondageAdminASupprimer(null);
            afficherToast("Sondage effacé de la plateforme.");
        } catch (err) { afficherToast("Erreur de suppression", 'error'); setSondageAdminASupprimer(null); }
    };

    const handlePartager = (id) => {
        const url = `${window.location.origin}/sondage/${id}`;
        navigator.clipboard.writeText(url);
        afficherToast("Lien copié dans le presse-papier !");
    };

    if (!user) return <p className="text-center p-8 dark:text-white">Chargement...</p>;

    // ==========================================
    // COMPOSANTS VISUELS PARTAGÉS
    // ==========================================
    const ToastComponent = () => (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 transition-all duration-500 transform ${showToast.visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'} ${showToast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'}`}>
            {showToast.type === 'success' ? '✅' : '❌'} <span className="font-bold">{showToast.message}</span>
        </div>
    );

    // Fonction magique pour générer des Modales propres
    const renderModal = (titre, description, icon, colorClass, onConfirm, onCancel, confirmText) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-700 transform scale-100 transition-transform">
                <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl`}>
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{titre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 rounded-xl transition-colors">Annuler</button>
                    <button onClick={onConfirm} className={`flex-1 text-white font-bold py-3 rounded-xl transition-colors shadow-sm ${confirmText === 'Clôturer' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'}`}>{confirmText}</button>
                </div>
            </div>
        </div>
    );

    // ==========================================
    // VUE SUPER ADMIN EXCLUSIVE (/admin)
    // ==========================================
    if (user.role === 'super_admin') {
        const totalVotes = tousLesSondages.reduce((sum, s) => sum + (s.votes_count || 0), 0);
        const sondagesActifs = tousLesSondages.filter(s => !s.date_fin || new Date(s.date_fin) > new Date()).length;
        const sondagesExpires = tousLesSondages.length - sondagesActifs;
        const topSondages = [...tousLesSondages].sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0)).slice(0, 5);

        return (
            <div className="container mx-auto p-4 md:p-8 transition-colors duration-300 max-w-7xl">
                <ToastComponent />
                
                {/* AFFICHAGE DES MODALES ADMIN */}
                {utilisateurASupprimer && renderModal("Bannir cet utilisateur ?", "Toutes ses données et ses sondages seront définitivement effacés. Cette action est irréversible.", "⚠️", "bg-red-100 text-red-600 dark:bg-red-900/30", confirmerSuppressionUtilisateur, () => setUtilisateurASupprimer(null), "Oui, bannir")}
                {sondageACloturer && renderModal("Clôturer ce sondage ?", "Les votes seront immédiatement bloqués et le sondage passera en statut expiré.", "🔒", "bg-orange-100 text-orange-600 dark:bg-orange-900/30", confirmerCloture, () => setSondageACloturer(null), "Clôturer")}
                {sondageAdminASupprimer && renderModal("Supprimer ce sondage ?", "Ce sondage sera définitivement supprimé de la plateforme avec toutes ses réponses.", "🗑️", "bg-red-100 text-red-600 dark:bg-red-900/30", confirmerSuppressionSondageAdmin, () => setSondageAdminASupprimer(null), "Oui, supprimer")}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3"><span className="text-4xl">👑</span> Centre de Contrôle</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Bienvenue Super Admin, vous avez les pleins pouvoirs.</p>
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-2 mb-8 bg-gray-100/50 dark:bg-gray-800/30 p-2 rounded-xl custom-scrollbar">
                    {['dashboard', 'utilisateurs', 'sondages', 'profil'].map(onglet => (
                        <button key={onglet} onClick={() => setAdminOngletActif(onglet)} className={`px-6 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${adminOngletActif === onglet ? 'bg-white dark:bg-carteSombre text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}>
                            {onglet === 'dashboard' && '📊 Indicateurs & Stats'}
                            {onglet === 'utilisateurs' && '👥 Gestion Utilisateurs'}
                            {onglet === 'sondages' && '📝 Gestion Sondages'}
                            {onglet === 'profil' && '⚙️ Mon Compte & Sécurité'}
                        </button>
                    ))}
                </div>

                {adminOngletActif === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4"><div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl">👥</div><div><p className="text-sm text-gray-500 font-bold uppercase">Utilisateurs</p><p className="text-3xl font-extrabold dark:text-white">{tousLesUtilisateurs.length}</p></div></div>
                            <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4"><div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl">📝</div><div><p className="text-sm text-gray-500 font-bold uppercase">Sondages</p><p className="text-3xl font-extrabold dark:text-white">{tousLesSondages.length}</p></div></div>
                            <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4"><div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl">🗳️</div><div><p className="text-sm text-gray-500 font-bold uppercase">Votes Totaux</p><p className="text-3xl font-extrabold dark:text-white">{totalVotes}</p></div></div>
                            <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4"><div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl">⚡</div><div><p className="text-sm text-gray-500 font-bold uppercase">État Sondages</p><p className="text-lg font-bold text-green-600">{sondagesActifs} Actifs <span className="text-gray-300">|</span> <span className="text-red-500">{sondagesExpires} Expirés</span></p></div></div>
                        </div>
                        <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-bold mb-6 dark:text-white">🏆 Sondages les plus populaires</h3>
                            <div className="space-y-3">
                                {topSondages.map((s, index) => (
                                    <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-fondSombre rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-4"><span className="text-2xl font-bold text-gray-300 dark:text-gray-600">#{index + 1}</span><div><p className="font-bold text-gray-900 dark:text-white">{s.titre}</p><p className="text-sm text-gray-500">Créé le {new Date(s.created_at).toLocaleDateString()}</p></div></div>
                                        <div className="bg-blue-100 text-blue-800 font-bold px-4 py-1.5 rounded-full text-sm">{s.votes_count || 0} votes</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {adminOngletActif === 'utilisateurs' && (
                    <div className="bg-white dark:bg-carteSombre rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700"><h3 className="text-xl font-bold dark:text-white">Annuaire des Utilisateurs</h3></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase"><tr><th className="p-4">Utilisateur</th><th className="p-4">Inscription</th><th className="p-4">Rôle</th><th className="p-4 text-right">Actions</th></tr></thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {tousLesUtilisateurs.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                                            <td className="p-4"><p className="font-bold text-gray-900 dark:text-white">{u.name}</p><p className="text-sm text-gray-500">{u.email}</p></td>
                                            <td className="p-4 text-gray-600 dark:text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td className="p-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>{u.role}</span></td>
                                            <td className="p-4 text-right">
                                                {u.id !== user.id && (
                                                    // Remplacement de window.confirm par l'ouverture de la Modale
                                                    <button onClick={() => setUtilisateurASupprimer(u.id)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/10 px-3 py-1.5 rounded-lg transition-colors">Bannir</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {adminOngletActif === 'sondages' && (
                    <div className="bg-white dark:bg-carteSombre rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700"><h3 className="text-xl font-bold dark:text-white">Tous les sondages de la plateforme</h3></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase"><tr><th className="p-4">Titre & Infos</th><th className="p-4">Statut</th><th className="p-4">Votes</th><th className="p-4 text-right">Actions</th></tr></thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {tousLesSondages.map(s => {
                                        const estExpire = s.date_fin && new Date(s.date_fin) < new Date();
                                        return (
                                            <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                                                <td className="p-4"><p className="font-bold text-gray-900 dark:text-white">{s.titre}</p><p className="text-xs text-gray-500 mt-1">ID: {s.id} • {s.est_anonyme ? 'Anonyme' : 'Public'}</p></td>
                                                <td className="p-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${estExpire ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{estExpire ? 'Expiré' : 'Actif'}</span></td>
                                                <td className="p-4 font-bold text-blue-600">{s.votes_count || 0}</td>
                                                <td className="p-4 flex justify-end gap-2">
                                                    <Link to={`/sondage/${s.id}/resultats`} className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg">Voir</Link>
                                                    {!estExpire && <button onClick={() => setSondageACloturer(s.id)} className="text-orange-600 hover:text-orange-800 font-bold text-sm bg-orange-50 px-3 py-1.5 rounded-lg">Clôturer</button>}
                                                    <button onClick={() => setSondageAdminASupprimer(s.id)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg">Supprimer</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {adminOngletActif === 'profil' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                        <div className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">👤 Informations Administrateur</h3>
                            <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50">
                                <p className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase">Rôle : {user.role.replace('_', ' ')}</p>
                                <p className="text-sm text-purple-600/80 dark:text-purple-400/80">Privilèges maximaux accordés.</p>
                            </div>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nom</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#3b82f6] outline-none dark:text-white" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label><input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#3b82f6] outline-none dark:text-white" /></div>
                                <button type="submit" disabled={loadingProfil} className="w-full bg-[#3b82f6] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">Mettre à jour</button>
                            </form>
                        </div>

                        <div className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🔒 Sécurité</h3>
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mot de passe actuel</label><input type="password" value={pwdData.current_password} onChange={(e) => setPwdData({...pwdData, current_password: e.target.value})} required className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none dark:text-white" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nouveau mot de passe</label><input type="password" value={pwdData.new_password} onChange={(e) => setPwdData({...pwdData, new_password: e.target.value})} required minLength={8} className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none dark:text-white" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirmer</label><input type="password" value={pwdData.new_password_confirmation} onChange={(e) => setPwdData({...pwdData, new_password_confirmation: e.target.value})} required minLength={8} className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none dark:text-white" /></div>
                                <button type="submit" disabled={loadingProfil} className="w-full bg-gray-900 dark:bg-gray-700 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">Changer le mot de passe</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ==========================================
    // VUE UTILISATEUR NORMAL (/mes-sondages, /creer, /profil)
    // ==========================================
    
    // (1) MES SONDAGES
    if (location.pathname === '/mes-sondages') {
        const indexDernierSondage = pageActuelle * sondagesParPage;
        const indexPremierSondage = indexDernierSondage - sondagesParPage;
        const sondagesAffiches = mesSondages.slice(indexPremierSondage, indexDernierSondage);
        const totalPages = Math.ceil(mesSondages.length / sondagesParPage);

        return (
            <div className="container mx-auto p-8 transition-colors duration-300 relative">
                <ToastComponent />
                {sondageASupprimer && renderModal("Supprimer ce sondage ?", "Toutes les réponses récoltées seront définitivement perdues.", "🗑️", "bg-red-100 text-red-600 dark:bg-red-900/30", confirmerSuppression, () => setSondageASupprimer(null), "Oui, supprimer")}

                <div className="bg-white dark:bg-carteSombre p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="text-2xl font-bold text-primaire dark:text-white">
                            Mes sondages actifs {mesSondages.length > 0 && <span className="text-sm font-normal text-gray-500 ml-2">({mesSondages.length} au total)</span>}
                        </h3>
                        <Link to="/creer" className="bg-secondaire hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                            Créer un sondage
                        </Link>
                    </div>
                    
                    {mesSondages.length === 0 ? (
                        <div className="text-center py-10 border-t border-gray-100 dark:border-gray-700 mt-4">
                            <p className="text-gray-500 italic mb-4">Vous n'avez pas encore créé de sondage.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="space-y-4">
                                {sondagesAffiches.map(sondage => (
                                    <div key={sondage.id} className="flex flex-col md:flex-row justify-between items-center bg-gray-50 dark:bg-fondSombre p-5 rounded-xl border border-gray-200 dark:border-gray-600 transition-colors">
                                        <div className="mb-4 md:mb-0 w-full md:w-1/2">
                                            <h5 className="font-bold text-lg text-primaire dark:text-white flex items-center flex-wrap gap-2">
                                                {sondage.titre}
                                                {sondage.date_fin && new Date(sondage.date_fin) < new Date() && (
                                                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded border border-red-200">Expiré</span>
                                                )}
                                            </h5>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {sondage.questions?.length || 0} question(s) • Anonyme: {sondage.est_anonyme ? 'Oui' : 'Non'} • <span className="font-bold text-blue-600">{sondage.votes_count || 0} vote(s)</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                                            <button onClick={() => handlePartager(sondage.id)} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 font-bold py-2.5 px-4 rounded-lg shadow-sm text-sm dark:text-white">Partager</button>
                                            <Link to={`/sondage/${sondage.id}/resultats`} className="bg-blue-50 text-blue-700 font-bold py-2.5 px-4 rounded-lg shadow-sm text-sm">Résultats</Link>
                                            <button onClick={() => setSondageASupprimer(sondage.id)} className="bg-red-50 text-red-600 font-bold py-2.5 px-4 rounded-lg shadow-sm text-sm">Supprimer</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                                    <div className="flex gap-2 mx-auto">
                                        <button onClick={() => setPageActuelle(prev => Math.max(prev - 1, 1))} disabled={pageActuelle === 1} className="px-4 py-2 rounded-lg font-bold bg-gray-100 disabled:opacity-50">Précédent</button>
                                        <button onClick={() => setPageActuelle(prev => Math.min(prev + 1, totalPages))} disabled={pageActuelle === totalPages} className="px-4 py-2 rounded-lg font-bold bg-gray-100 disabled:opacity-50">Suivant</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // (2) CRÉER UN SONDAGE
    if (location.pathname === '/creer') {
        return <div className="container mx-auto p-4 md:p-8"><CreerSondage onSondageCree={handleSondageCree} /></div>;
    }

    // (3) PROFIL UTILISATEUR NORMAL
    if (location.pathname === '/profil') {
        const totalVotesRecus = mesSondages.reduce((acc, s) => acc + (s.votes_count || 0), 0);
        const tauxParticipation = mesSondages.length > 0 ? Math.round(totalVotesRecus / mesSondages.length) : 0;

        return (
            <div className="container mx-auto p-4 md:p-8 transition-colors duration-300 max-w-7xl">
                <ToastComponent />
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Paramètres du compte</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold dark:text-white mb-6">👤 Informations Personnelles</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div><label className="block text-sm font-bold dark:text-gray-300 mb-2">Nom complet</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full p-3 bg-gray-50 border rounded-xl dark:bg-fondSombre dark:text-white" /></div>
                                <div><label className="block text-sm font-bold dark:text-gray-300 mb-2">Email</label><input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required className="w-full p-3 bg-gray-50 border rounded-xl dark:bg-fondSombre dark:text-white" /></div>
                                <button type="submit" disabled={loadingProfil} className="w-full bg-[#3b82f6] text-white font-bold py-3 rounded-xl hover:bg-blue-700">Enregistrer</button>
                            </form>
                        </div>
                        <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold dark:text-white mb-6">🔒 Sécurité du compte</h3>
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div><input type="password" placeholder="Mot de passe actuel" value={pwdData.current_password} onChange={(e) => setPwdData({...pwdData, current_password: e.target.value})} required className="w-full p-3 bg-gray-50 border rounded-xl dark:bg-fondSombre dark:text-white" /></div>
                                <div><input type="password" placeholder="Nouveau mot de passe" value={pwdData.new_password} onChange={(e) => setPwdData({...pwdData, new_password: e.target.value})} required minLength={8} className="w-full p-3 bg-gray-50 border rounded-xl dark:bg-fondSombre dark:text-white" /></div>
                                <div><input type="password" placeholder="Confirmer" value={pwdData.new_password_confirmation} onChange={(e) => setPwdData({...pwdData, new_password_confirmation: e.target.value})} required minLength={8} className="w-full p-3 bg-gray-50 border rounded-xl dark:bg-fondSombre dark:text-white" /></div>
                                <button type="submit" disabled={loadingProfil} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl">Changer le mot de passe</button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-8">
                        {mesSondages.length > 0 && (
                            <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-sm border border-blue-100">
                                <h3 className="text-xl font-bold dark:text-white mb-6">📊 Espace Organisateur</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-blue-50 p-4 rounded-xl"><p className="text-xs text-blue-600 font-bold uppercase mb-2">Créés</p><p className="text-3xl font-extrabold text-blue-900">{mesSondages.length}</p></div>
                                    <div className="bg-emerald-50 p-4 rounded-xl"><p className="text-xs text-emerald-600 font-bold uppercase mb-2">Reçus</p><p className="text-3xl font-extrabold text-emerald-900">{totalVotesRecus}</p></div>
                                    <div className="bg-purple-50 p-4 rounded-xl"><p className="text-xs text-purple-600 font-bold uppercase mb-2">Participation</p><p className="text-xl font-bold text-purple-900">{tauxParticipation} <span className="text-sm">/sondage</span></p></div>
                                </div>
                            </div>
                        )}
                        <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold dark:text-white mb-6">🕒 Activité (Historique des votes)</h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {historiqueVotes.map(vote => (
                                    <div key={vote.id} className="bg-gray-50 dark:bg-fondSombre p-5 rounded-xl border flex flex-col sm:flex-row justify-between gap-4">
                                        <div>
                                            <p className="font-bold dark:text-white">{vote.sondage ? vote.sondage.titre : "Sondage supprimé"}</p>
                                            <p className="text-sm text-gray-500 mt-1">Voté le {new Date(vote.created_at).toLocaleDateString()}</p>
                                        </div>
                                        {vote.sondage && <Link to={`/sondage/${vote.sondage.id}/resultats`} className="text-[#3b82f6] hover:underline font-bold text-sm">Résultats →</Link>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (location.pathname === '/dashboard') navigate('/mes-sondages');
    return null;
}