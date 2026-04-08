import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import api from '../../api/axios';
import CreerSondage from '../../components/sondage/CreerSondage';
import AdminView from '../../components/dashboard/AdminView';
import UserView from '../../components/dashboard/UserView';
import ModalBanUser from '../../components/ui/ModalBanUser';

// ⚡ RESTAURATION DU CACHE : C'est ce qui rend l'application ultra-rapide (0 ms de latence réseau)
let memoireUser = null;
let memoireAdmin = null;

// ⚡ EXTRACTEUR INTELLIGENT : Trouve le tableau de données peu importe le format envoyé par Laravel
const extraireTableau = (reponseAPI) => {
    const data = reponseAPI?.data;
    if (!data) return [];
    if (Array.isArray(data)) return data; // Si c'est un tableau direct (comme les Users)
    if (Array.isArray(data.data)) return data.data; // Si c'est une pagination classique
    
    // Si Laravel l'a emballé dans un nom personnalisé (ex: { sondages: [...] })
    const valeurs = Object.values(data);
    for (let val of valeurs) {
        if (Array.isArray(val)) return val;
        if (val && Array.isArray(val.data)) return val.data;
    }
    return [];
};

const ModalAction = ({ titre, desc, icon, color, onConfirm, onCancel, confirmText, avecMotif, motifValue, setMotifValue }) => {
    const handleCancel = () => { 
        if(setMotifValue) setMotifValue(''); 
        onCancel(); 
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-700 text-center animate-scale-up">
                <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 break-words">{titre}</h3>
                <p className="text-sm text-gray-500 mb-6 break-words">{desc}</p>
                
                {avecMotif && (
                    <div className="mb-6 text-left">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Motif obligatoire :</label>
                        <input 
                            type="text" 
                            value={motifValue} 
                            onChange={(e) => setMotifValue(e.target.value)} 
                            placeholder="Indiquez la raison de cette action..." 
                            className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 outline-none dark:text-white text-sm" 
                            required 
                            autoFocus
                        />
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button onClick={handleCancel} className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white font-bold py-3 rounded-xl transition-colors shrink-0">
                        Annuler
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={avecMotif && !motifValue?.trim()} 
                        className={`w-full sm:flex-1 text-white font-bold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${confirmText === 'Clôturer' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    
    const [mesSondages, setMesSondages] = useState([]); 
    const [historiqueVotes, setHistoriqueVotes] = useState([]);
    const [tousLesUtilisateurs, setTousLesUtilisateurs] = useState([]);
    const [tousLesSondages, setTousLesSondages] = useState([]);
    const [adminLogs, setAdminLogs] = useState([]); 
    
    const [adminOngletActif, setAdminOngletActif] = useState(() => {
        return sessionStorage.getItem('adminOngletActif') || 'dashboard';
    });

    const [showToast, setShowToast] = useState({ visible: false, message: '', type: 'success' });
    const [pageActuelle, setPageActuelle] = useState(1);
    const sondagesParPage = 5;

    const [donneesChargees, setDonneesChargees] = useState(false);

    const [sondageASupprimer, setSondageASupprimer] = useState(null);
    const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);
    const [sondageACloturer, setSondageACloturer] = useState(null);
    const [sondageAdminASupprimer, setSondageAdminASupprimer] = useState(null);
    
    const [motifAction, setMotifAction] = useState('');
    const [banDurationPreset, setBanDurationPreset] = useState('7');
    const [customDays, setCustomDays] = useState(''); 

    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [pwdData, setPwdData] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
    const [loadingProfil, setChargementProfil] = useState(false);

   const chargerDonneesNormales = async (userId) => {
        if (sessionStorage.getItem('rafraichirCache') === 'oui') {
            memoireUser = null;
            memoireAdmin = null;
            sessionStorage.removeItem('rafraichirCache');
        }

        if (memoireUser && memoireUser.userId !== userId) memoireUser = null;

        // ⚡ 1. AFFICHAGE INSTANTANÉ (On charge le cache)
        if (memoireUser) {
            setMesSondages(memoireUser.sondages);
            setHistoriqueVotes(memoireUser.votes);
            setTousLesSondages(memoireUser.tous); 
            setDonneesChargees(true);
            // ❌ ON NE MET PLUS DE "return;" ICI ! On laisse la fonction continuer.
        }
        
        // ⚡ 2. VÉRIFICATION EN ARRIÈRE-PLAN
        try {
            const [resSondages, resVotes] = await Promise.all([
                api.get('/sondages'),
                api.get('/mes-votes')
            ]);
            
            const userIdString = String(userId);
            const dataSondages = extraireTableau(resSondages);
            const sondagesFiltres = dataSondages.filter(s => String(s.user_id) === userIdString);
            
            // On met à jour l'écran silencieusement avec les données fraîches
            setMesSondages(sondagesFiltres); 
            setHistoriqueVotes(extraireTableau(resVotes));
            setTousLesSondages(dataSondages); 
            
            memoireUser = { userId: userId, sondages: sondagesFiltres, votes: resVotes.data, tous: dataSondages }; 
            
        } catch (err) { 
            console.error("Erreur chargement utilisateur :", err); 
        } finally {
            setDonneesChargees(true);
        }
    };

    const chargerDonneesAdmin = async (userId) => {
        if (sessionStorage.getItem('rafraichirCache') === 'oui') {
            memoireUser = null;
            memoireAdmin = null;
            sessionStorage.removeItem('rafraichirCache');
        }

        if (memoireAdmin && memoireAdmin.userId !== userId) memoireAdmin = null;

        // ⚡ 1. AFFICHAGE INSTANTANÉ
        if (memoireAdmin) {
            setTousLesUtilisateurs(memoireAdmin.users);
            setTousLesSondages(memoireAdmin.sondages);
            setAdminLogs(memoireAdmin.logs);
            setDonneesChargees(true);
            // ❌ PLUS DE "return;" ICI NON PLUS
        }

        // ⚡ 2. VÉRIFICATION EN ARRIÈRE-PLAN
        try {
            const [resUsers, resSondages, resLogs] = await Promise.all([
                api.get('/users'), 
                api.get('/sondages'),
                api.get('/admin/logs')
            ]);

            const dUsers = extraireTableau(resUsers);
            const dSondages = extraireTableau(resSondages);
            const dLogs = extraireTableau(resLogs);

            // Mise à jour silencieuse
            setTousLesUtilisateurs(dUsers);
            setTousLesSondages(dSondages);
            setAdminLogs(dLogs);
       
            memoireAdmin = { userId: userId, users: dUsers, sondages: dSondages, logs: dLogs };
            
        } catch (err) { 
            console.error("Erreur chargement admin :", err); 
        } finally {
            setDonneesChargees(true);
        }
    };
    
    useEffect(() => {
        sessionStorage.setItem('adminOngletActif', adminOngletActif);
    }, [adminOngletActif]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userData && token) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            
            if (!editName) setEditName(parsedUser.name);
            if (!editEmail) setEditEmail(parsedUser.email);

            if (parsedUser.role === 'super_admin') {
                chargerDonneesAdmin(parsedUser.id);
            } else {
                chargerDonneesNormales(parsedUser.id);
            }

            if (parsedUser.role === 'super_admin' && location.pathname !== '/admin') {
                navigate('/admin');
            }
        } else {
            navigate('/login');
        }
    }, [navigate, location.pathname]);

    const handleSondageCree = async () => {
        afficherToast("Sondage créé avec succès !", "success");
        memoireAdmin = null; 
        memoireUser = null;  
        
        if (user?.role === 'super_admin') { 
            await chargerDonneesAdmin(user.id); 
            navigate('/admin'); 
        } else { 
            await chargerDonneesNormales(user.id); 
            setPageActuelle(1); 
            navigate('/mes-sondages'); 
        }
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
            setMesSondages(nvListe); 
            if (memoireUser) {
                memoireUser.sondages = nvListe;
                memoireUser.tous = memoireUser.tous.filter(s => s.id !== sondageASupprimer);
                setTousLesSondages(memoireUser.tous);
            }

            setSondageASupprimer(null);
            if (pageActuelle > Math.ceil(nvListe.length / sondagesParPage)) setPageActuelle(Math.max(1, pageActuelle - 1));
            afficherToast("Sondage supprimé.");
        } catch (err) { afficherToast("Erreur", 'error'); setSondageASupprimer(null); }
    };

    const confirmerSuppressionUtilisateur = async () => {
        if (!motifAction.trim()) return afficherToast("Veuillez fournir un motif.", "error");
        
        const permanent = banDurationPreset === 'permanent';
        let duration_days = null;

        if (!permanent) {
            if (banDurationPreset === 'custom') {
                duration_days = parseInt(customDays, 10);
                if (isNaN(duration_days) || duration_days <= 0) {
                    return afficherToast("Veuillez saisir le nombre de jours", "error");
                }
            } else {
                duration_days = parseInt(banDurationPreset, 10);
            }
        }

        try {
            await api.delete(`/users/${utilisateurASupprimer}`, {
                data: {
                    motif: motifAction,
                    permanent,
                    ...(duration_days ? { duration_days } : {}),
                },
            });
            
            memoireAdmin = null; 
            
            setUtilisateurASupprimer(null);
            setMotifAction('');
            setBanDurationPreset('7');
            setCustomDays(''); 
            
            chargerDonneesAdmin(user.id);
            afficherToast("Utilisateur suspendu !");
        } catch (err) {
            afficherToast(err.response?.data?.message || "Erreur", 'error');
            setUtilisateurASupprimer(null);
            setMotifAction('');
            setBanDurationPreset('7');
            setCustomDays('');
        }
    };

    
    const confirmerCloture = async () => {
        if (!motifAction.trim()) return afficherToast("Veuillez fournir un motif.", "error");
        try {
            await api.put(`/sondages/${sondageACloturer}/cloturer`, { motif: motifAction });
            
            // ⚡ OPTIMISATION : Mise à jour optimiste (Instantanée)
            const dateFinMaintenant = new Date().toISOString(); // On génère la date/heure actuelle
            
            // On met à jour le tableau React immédiatement pour changer l'affichage
            const nvSondages = tousLesSondages.map(s => 
                s.id === sondageACloturer ? { ...s, date_fin: dateFinMaintenant } : s
            );
            setTousLesSondages(nvSondages);
            
            // On met à jour le cache mémoire pour éviter qu'il ne ramène l'ancienne date
            if (memoireAdmin) {
                memoireAdmin.sondages = nvSondages;
            }
            
            setMotifAction(''); 
            setSondageACloturer(null); 
            afficherToast("Sondage clôturé avec succès.");

            // On recharge discrètement en arrière-plan pour mettre à jour le Journal d'Audit
            chargerDonneesAdmin(user.id); 
        } catch (err) { 
            afficherToast("Erreur lors de la clôture", 'error'); 
            setSondageACloturer(null); 
            setMotifAction('');
        }
    };

    const handlePartager = (id) => {
        navigator.clipboard.writeText(`${window.location.origin}/sondage/${id}`);
        afficherToast("Lien copié !");
    };
    
    if (!user) return (
        <div className="w-full max-w-full min-h-[60vh] flex flex-col items-center justify-center animate-fade-in overflow-hidden px-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-200 border-t-[#3b82f6] dark:border-gray-700 dark:border-t-blue-400 rounded-full animate-spin mb-4 shrink-0"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base break-words text-center">Chargement de votre session...</p>
        </div>
    );

    const ToastComponent = () => (
        <div className={`fixed bottom-6 right-4 sm:right-6 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl flex items-center gap-2 sm:gap-3 z-50 transition-all duration-500 transform max-w-[calc(100vw-2rem)] sm:max-w-md ${showToast.visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'} ${showToast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'}`}>
            <span className="shrink-0">{showToast.type === 'success' ? '✅' : '❌'}</span>
            <span className="font-bold text-sm sm:text-base break-words line-clamp-2">{showToast.message}</span>
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 md:px-8 transition-colors duration-300 max-w-7xl w-full overflow-x-hidden ">
            <ToastComponent />
            
            {sondageASupprimer && (
                <ModalAction 
                    titre="Supprimer ?" desc="Irréversible." icon="🗑️" color="bg-red-100 text-red-600 dark:bg-red-900/30" 
                    onConfirm={confirmerSuppression} onCancel={() => setSondageASupprimer(null)} confirmText="Supprimer" 
                />
            )}
            
            {utilisateurASupprimer && (
                <ModalBanUser
                    motifValue={motifAction}
                    setMotifValue={setMotifAction}
                    durationPreset={banDurationPreset}
                    setDurationPreset={setBanDurationPreset}
                    customDays={customDays}
                    setCustomDays={setCustomDays}
                    onConfirm={confirmerSuppressionUtilisateur}
                    onCancel={() => {
                        setUtilisateurASupprimer(null);
                        setMotifAction('');
                        setBanDurationPreset('7');
                        setCustomDays('');
                    }}
                />
            )}
            
            {sondageAdminASupprimer && (
                <ModalAction 
                    titre="Supprimer ?" desc="Définitif." icon="🗑️" color="bg-red-100 text-red-600 dark:bg-red-900/30" 
                    onConfirm={confirmerSuppressionSondageAdmin} onCancel={() => setSondageAdminASupprimer(null)} confirmText="Supprimer" 
                    avecMotif={true} motifValue={motifAction} setMotifValue={setMotifAction} 
                />
            )}
            
            {sondageACloturer && (
                <ModalAction 
                    titre="Clôturer ?" desc="Votes bloqués." icon="🔒" color="bg-orange-100 text-orange-600 dark:bg-orange-900/30" 
                    onConfirm={confirmerCloture} onCancel={() => setSondageACloturer(null)} confirmText="Clôturer" 
                    avecMotif={true} motifValue={motifAction} setMotifValue={setMotifAction} 
                />
            )}

            <div className="w-full mt-4 sm:mt-6 md:mt-8 pb-10">
                {user.role === 'super_admin' ? (
                    <AdminView 
                        donneesChargees={donneesChargees} 
                        user={user} tousLesUtilisateurs={tousLesUtilisateurs} tousLesSondages={tousLesSondages}
                        adminLogs={adminLogs}
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
                        donneesChargees={donneesChargees}
                        vueActuelle={location.pathname.replace('/', '')}
                        mesSondages={mesSondages} 
                        historiqueVotes={historiqueVotes} 
                        tousLesSondages={tousLesSondages} 
                        pageActuelle={pageActuelle} 
                        setPageActuelle={setPageActuelle}
                        sondagesParPage={sondagesParPage} 
                        setSondageASupprimer={setSondageASupprimer} 
                        handlePartager={handlePartager}
                        editName={editName} setEditName={setEditName} editEmail={editEmail} setEditEmail={setEditEmail} pwdData={pwdData} setPwdData={setPwdData}
                        handleUpdateProfile={handleUpdateProfile} handleUpdatePassword={handleUpdatePassword} loadingProfil={loadingProfil}
                    />
                )}
            </div>
        </div>
    );
}