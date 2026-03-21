import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import api from '../api/axios';
import CreerSondage from '../components/creerSondage';

// 🔥 Importation de nos deux nouveaux composants d'affichage
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    
    // --- ÉTATS ---
    const [mesSondages, setMesSondages] = useState([]); 
    const [historiqueVotes, setHistoriqueVotes] = useState([]);
    const [tousLesUtilisateurs, setTousLesUtilisateurs] = useState([]);
    const [tousLesSondages, setTousLesSondages] = useState([]);
    const [adminOngletActif, setAdminOngletActif] = useState('dashboard');
    const [showToast, setShowToast] = useState({ visible: false, message: '', type: 'success' });
    const [pageActuelle, setPageActuelle] = useState(1);
    const sondagesParPage = 5;

    // --- MODALES ---
    const [sondageASupprimer, setSondageASupprimer] = useState(null);
    const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);
    const [sondageACloturer, setSondageACloturer] = useState(null);
    const [sondageAdminASupprimer, setSondageAdminASupprimer] = useState(null);

    // --- PROFIL ---
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [pwdData, setPwdData] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
    const [loadingProfil, setChargementProfil] = useState(false);

    // --- LOGIQUE DE CHARGEMENT ---
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
                api.get('/users'), api.get('/sondages')
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
            }
        } else {
            navigate('/login');
        }
    }, [navigate, location.pathname]);

    // --- LOGIQUE DES ACTIONS ---
    const handleSondageCree = () => {
        if (user?.role === 'super_admin') { chargerDonneesAdmin(); navigate('/admin'); } 
        else { chargerDonneesNormales(user.id); setPageActuelle(1); navigate('/mes-sondages'); }
    };

    const afficherToast = (message, type = 'success') => {
        setShowToast({ visible: true, message, type });
        setTimeout(() => setShowToast({ visible: false }), 3000);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault(); setChargementProfil(true);
        try {
            const reponse = await api.put('/user/profile', { name: editName, email: editEmail });
            setUser(reponse.data.user); localStorage.setItem('user', JSON.stringify(reponse.data.user));
            afficherToast("Informations mises à jour !");
        } catch (err) { afficherToast(err.response?.data?.message || "Erreur", 'error'); }
        finally { setChargementProfil(false); }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault(); setChargementProfil(true);
        try {
            await api.put('/user/password', pwdData);
            setPwdData({ current_password: '', new_password: '', new_password_confirmation: '' }); 
            afficherToast("Mot de passe modifié !");
        } catch (err) { afficherToast(err.response?.data?.message || "Erreur", 'error'); }
        finally { setChargementProfil(false); }
    };

    const confirmerSuppression = async () => {
        try {
            await api.delete(`/sondages/${sondageASupprimer}`);
            const nvListe = mesSondages.filter(s => s.id !== sondageASupprimer);
            setMesSondages(nvListe); setSondageASupprimer(null);
            if (pageActuelle > Math.ceil(nvListe.length / sondagesParPage)) setPageActuelle(Math.max(1, pageActuelle - 1));
            afficherToast("Sondage supprimé.");
        } catch (err) { afficherToast("Erreur", 'error'); setSondageASupprimer(null); }
    };

    const confirmerSuppressionUtilisateur = async () => {
        try {
            await api.delete(`/users/${utilisateurASupprimer}`);
            setTousLesUtilisateurs(tousLesUtilisateurs.filter(u => u.id !== utilisateurASupprimer));
            setUtilisateurASupprimer(null); afficherToast("Utilisateur banni !");
        } catch (err) { afficherToast("Erreur", 'error'); setUtilisateurASupprimer(null); }
    };

    const confirmerCloture = async () => {
        try {
            await api.put(`/sondages/${sondageACloturer}/cloturer`);
            chargerDonneesAdmin(); setSondageACloturer(null); afficherToast("Clôturé.");
        } catch (err) { afficherToast("Erreur", 'error'); setSondageACloturer(null); }
    };

    const confirmerSuppressionSondageAdmin = async () => {
        try {
            await api.delete(`/sondages/${sondageAdminASupprimer}`);
            setTousLesSondages(tousLesSondages.filter(s => s.id !== sondageAdminASupprimer));
            setSondageAdminASupprimer(null); afficherToast("Effacé.");
        } catch (err) { afficherToast("Erreur", 'error'); setSondageAdminASupprimer(null); }
    };

    const handlePartager = (id) => {
        navigator.clipboard.writeText(`${window.location.origin}/sondage/${id}`);
        afficherToast("Lien copié !");
    };

    // --- COMPOSANTS VISUELS PARTAGÉS (Toasts & Modales) ---
    if (!user) return <p className="text-center p-8 dark:text-white">Chargement...</p>;

    const ToastComponent = () => (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 transition-all duration-500 transform ${showToast.visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'} ${showToast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'}`}>
            {showToast.type === 'success' ? '✅' : '❌'} <span className="font-bold">{showToast.message}</span>
        </div>
    );

    const renderModal = (titre, desc, icon, color, onConfirm, onCancel, confirmText) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-700 text-center">
                <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl`}>{icon}</div>
                <h3 className="text-xl font-bold dark:text-white mb-2">{titre}</h3>
                <p className="text-sm text-gray-500 mb-6">{desc}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white font-bold py-3 rounded-xl transition-colors">Annuler</button>
                    <button onClick={onConfirm} className={`flex-1 text-white font-bold py-3 rounded-xl transition-colors shadow-sm ${confirmText === 'Clôturer' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'}`}>{confirmText}</button>
                </div>
            </div>
        </div>
    );

    // --- LE RENDU FINAL (Aiguillage) ---
    return (
        <div className="container mx-auto p-4 md:p-8 transition-colors duration-300 max-w-7xl">
            <ToastComponent />
            
            {/* Affichage des Modales Communes */}
            {sondageASupprimer && renderModal("Supprimer ?", "Irréversible.", "🗑️", "bg-red-100 text-red-600 dark:bg-red-900/30", confirmerSuppression, () => setSondageASupprimer(null), "Supprimer")}
            {utilisateurASupprimer && renderModal("Bannir ?", "Action irréversible.", "⚠️", "bg-red-100 text-red-600 dark:bg-red-900/30", confirmerSuppressionUtilisateur, () => setUtilisateurASupprimer(null), "Bannir")}
            {sondageACloturer && renderModal("Clôturer ?", "Votes bloqués.", "🔒", "bg-orange-100 text-orange-600 dark:bg-orange-900/30", confirmerCloture, () => setSondageACloturer(null), "Clôturer")}
            {sondageAdminASupprimer && renderModal("Supprimer ?", "Définitif.", "🗑️", "bg-red-100 text-red-600 dark:bg-red-900/30", confirmerSuppressionSondageAdmin, () => setSondageAdminASupprimer(null), "Supprimer")}

            {/* Aiguillage vers le bon composant selon le rôle et l'URL */}
            {user.role === 'super_admin' ? (
                <AdminView 
                    user={user} tousLesUtilisateurs={tousLesUtilisateurs} tousLesSondages={tousLesSondages}
                    adminOngletActif={adminOngletActif} setAdminOngletActif={setAdminOngletActif}
                    setUtilisateurASupprimer={setUtilisateurASupprimer} setSondageACloturer={setSondageACloturer} setSondageAdminASupprimer={setSondageAdminASupprimer}
                    editName={editName} setEditName={setEditName} editEmail={editEmail} setEditEmail={setEditEmail} pwdData={pwdData} setPwdData={setPwdData}
                    handleUpdateProfile={handleUpdateProfile} handleUpdatePassword={handleUpdatePassword} loadingProfil={loadingProfil}
                />
            ) : location.pathname === '/creer' ? (
                <CreerSondage onSondageCree={handleSondageCree} />
            ) : location.pathname === '/dashboard' ? (
                <Navigate to="/mes-sondages" replace />
            ) : (
                <UserView 
                    vueActuelle={location.pathname.replace('/', '')} // 'mes-sondages' ou 'profil'
                    mesSondages={mesSondages} historiqueVotes={historiqueVotes} pageActuelle={pageActuelle} setPageActuelle={setPageActuelle}
                    sondagesParPage={sondagesParPage} setSondageASupprimer={setSondageASupprimer} handlePartager={handlePartager}
                    editName={editName} setEditName={setEditName} editEmail={editEmail} setEditEmail={setEditEmail} pwdData={pwdData} setPwdData={setPwdData}
                    handleUpdateProfile={handleUpdateProfile} handleUpdatePassword={handleUpdatePassword} loadingProfil={loadingProfil}
                />
            )}
        </div>
    );
}