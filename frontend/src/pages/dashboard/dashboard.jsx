import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import api from '../../api/axios';
import CreerSondage from '../../components/sondage/CreerSondage';
import AdminView from '../../components/dashboard/AdminView';
import UserView from '../../components/dashboard/UserView';
import ModalBanUser from '../../components/ui/ModalBanUser';

let memoireUser = null;
let memoireAdmin = null;

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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{titre}</h3>
                <p className="text-sm text-gray-500 mb-6">{desc}</p>
                
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
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleCancel} className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white font-bold py-3 rounded-xl transition-colors">
                        Annuler
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={avecMotif && !motifValue?.trim()} 
                        className={`w-full sm:flex-1 text-white font-bold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${confirmText === 'Clôturer' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'}`}
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
        if (memoireUser) {
            setMesSondages(memoireUser.sondages);
            setHistoriqueVotes(memoireUser.votes);
            setTousLesSondages(memoireUser.tous); 
            setDonneesChargees(true);
            return; 
        }
        
        try {
            const [resSondages, resVotes] = await Promise.all([
                api.get('/sondages'),
                api.get('/mes-votes')
            ]);
            
            const sondagesFiltres = resSondages.data.filter(s => s.user_id === userId);
            setMesSondages(sondagesFiltres); 
            setHistoriqueVotes(resVotes.data);
            setTousLesSondages(resSondages.data); 
            
            memoireUser = { sondages: sondagesFiltres, votes: resVotes.data, tous: resSondages.data }; 
            
        } catch (err) { 
            console.error("Erreur chargement utilisateur :", err); 
        } finally {
            setDonneesChargees(true);
        }
    };

    const chargerDonneesAdmin = async () => {
        if (memoireAdmin) {
            setTousLesUtilisateurs(memoireAdmin.users);
            setTousLesSondages(memoireAdmin.sondages);
            setAdminLogs(memoireAdmin.logs);
            setDonneesChargees(true);
            return; 
        }

        try {
            const [resUsers, resSondages, resLogs] = await Promise.all([
                api.get('/users'), 
                api.get('/sondages'),
                api.get('/admin/logs')
            ]);
            setTousLesUtilisateurs(resUsers.data);
            setTousLesSondages(resSondages.data);
            setAdminLogs(resLogs.data);
       
            memoireAdmin = { users: resUsers.data, sondages: resSondages.data, logs: resLogs.data };
            
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
                chargerDonneesAdmin();
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
            await chargerDonneesAdmin(); 
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
            memoireUser = null; 
            const nvListe = mesSondages.filter(s => s.id !== sondageASupprimer);
            setMesSondages(nvListe); setSondageASupprimer(null);
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
                    return afficherToast("Veuillez saisir un nombre de jours valide.", "error");
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
            
            chargerDonneesAdmin();
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
            memoireAdmin = null; 
            setMotifAction(''); 
            setSondageACloturer(null); 
            chargerDonneesAdmin(); 
            afficherToast("Clôturé.");
        } catch (err) { 
            afficherToast("Erreur", 'error'); 
            setSondageACloturer(null); setMotifAction('');
        }
    };

    const confirmerSuppressionSondageAdmin = async () => {
        if (!motifAction.trim()) return afficherToast("Veuillez fournir un motif.", "error");
        try {
            await api.delete(`/sondages/${sondageAdminASupprimer}`, { data: { motif: motifAction } });
            memoireAdmin = null; 
            setSondageAdminASupprimer(null); 
            setMotifAction(''); 
            chargerDonneesAdmin(); 
            afficherToast("Effacé.");
        } catch (err) { 
            afficherToast("Erreur", 'error'); 
            setSondageAdminASupprimer(null); setMotifAction('');
        }
    };

    const handlePartager = (id) => {
        navigator.clipboard.writeText(`${window.location.origin}/sondage/${id}`);
        afficherToast("Lien copié !");
    };
    
    if (!user) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-[#3b82f6] dark:border-gray-700 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Chargement de votre session...</p>
        </div>
    );

    const ToastComponent = () => (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 transition-all duration-500 transform ${showToast.visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'} ${showToast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'}`}>
            {showToast.type === 'success' ? '✅' : '❌'} <span className="font-bold">{showToast.message}</span>
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8 transition-colors duration-300 max-w-7xl relative">
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
    );
}