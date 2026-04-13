import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statutSuspensionUtilisateur } from '../../utils/sondagesPublic';

export default function AdminView({ 
    user, 
    tousLesUtilisateurs = [], 
    tousLesSondages = [], 
    adminLogs = [], 
    adminOngletActif, 
    setAdminOngletActif, 
    setUtilisateurASupprimer, 
    setSondageACloturer, 
    setSondageAdminASupprimer,
    editName, setEditName, editEmail, setEditEmail, pwdData, setPwdData,
    handleUpdateProfile, handleUpdatePassword, loadingProfil,
    donneesChargees
}) {
    
    const [pageChargee, setPageChargee] = useState(false);
    const [rechercheUtilisateur, setRechercheUtilisateur] = useState('');
    const [rechercheSondage, setRechercheSondage] = useState('');
    const [pageUtilisateurs, setPageUtilisateurs] = useState(1);
    const [pageSondages, setPageSondages] = useState(1);
    const itemsParPage = 10;

    useEffect(() => {
        setPageChargee(false); 
        const timer = setTimeout(() => setPageChargee(true), 50); 
        return () => clearTimeout(timer); 
    }, [adminOngletActif, donneesChargees]);

    const safeSondages = Array.isArray(tousLesSondages) ? tousLesSondages : [];
    const safeUsers = Array.isArray(tousLesUtilisateurs) ? tousLesUtilisateurs : [];
    const safeLogs = Array.isArray(adminLogs) ? adminLogs : [];

    const totalVotes = safeSondages.reduce((sum, s) => sum + (s.votes_count || 0), 0);
    const sActifs = safeSondages.filter(s => !s.date_fin || new Date(s.date_fin) > new Date()).length;
    const sExpires = safeSondages.length - sActifs;
    const topS = [...safeSondages].sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0)).slice(0, 5);

    const utilisateursFiltres = safeUsers.filter(u => 
        (u?.name || '').toLowerCase().includes(rechercheUtilisateur.toLowerCase()) || 
        (u?.email || '').toLowerCase().includes(rechercheUtilisateur.toLowerCase())
    ).sort((a, b) => {
        const nbSondagesA = safeSondages.filter(s => String(s.user_id) === String(a.id)).length;
        const nbSondagesB = safeSondages.filter(s => String(s.user_id) === String(b.id)).length;
        
        if (nbSondagesB !== nbSondagesA) {
            return nbSondagesB - nbSondagesA;
        }
        
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const sondagesFiltres = safeSondages.filter(s => 
        (s?.titre || '').toLowerCase().includes(rechercheSondage.toLowerCase())
    );

    const indexDernierUser = pageUtilisateurs * itemsParPage;
    const indexPremierUser = indexDernierUser - itemsParPage;
    const utilisateursPaginees = utilisateursFiltres.slice(indexPremierUser, indexDernierUser);
    const totalPagesUsers = Math.ceil(utilisateursFiltres.length / itemsParPage);

    const indexDernierSondage = pageSondages * itemsParPage;
    const indexPremierSondage = indexDernierSondage - itemsParPage;
    const sondagesPagines = sondagesFiltres.slice(indexPremierSondage, indexDernierSondage);
    const totalPagesSondages = Math.ceil(sondagesFiltres.length / itemsParPage);

    const renderPagination = (pageActuelle, setPage, totalPages) => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-fondSombre">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pageActuelle === 1} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg font-bold text-sm bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">Précédent</button>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Page {pageActuelle} sur {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={pageActuelle === totalPages} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg font-bold text-sm bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">Suivant</button>
            </div>
        );
    };

    return (
        <div className="w-full max-w-full overflow-hidden">
            <div className="mb-6 sm:mb-8 animate-fade-in">
                <h1 className="text-2xl sm:text-3xl font-extrabold dark:text-white truncate"> Centre de Contrôle</h1>
            </div>
            
            <div className="flex overflow-x-auto gap-2 mb-6 sm:mb-8 bg-gray-100/50 dark:bg-gray-800/30 p-2 rounded-xl custom-scrollbar animate-fade-in">
                {['dashboard', 'utilisateurs', 'sondages', 'historique', 'profil'].map(onglet => (
                    <button 
                        key={onglet} 
                        onClick={() => setAdminOngletActif(onglet)} 
                        className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap shrink-0 ${adminOngletActif === onglet ? 'bg-white dark:bg-carteSombre text-[#3b82f6] dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
                    >
                        {onglet === 'dashboard' ? '📊 Stats' : 
                         onglet === 'utilisateurs' ? '👥 Utilisateurs' : 
                         onglet === 'sondages' ? '📝 Modération' : 
                         onglet === 'historique' ? '📜 Historique' : '⚙️ Profil'}
                    </button>
                ))}
            </div>

            {!donneesChargees ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-carteSombre rounded-2xl border border-gray-100 dark:border-gray-800 animate-fade-in">
                    <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-400 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-center px-4">Initialisation du Centre de Contrôle...</p>
                </div>
            ) : (
                <div className={`transition-all duration-700 ease-out transform w-full ${pageChargee ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    
                    {/* ONGLET DASHBOARD */}
                    {adminOngletActif === 'dashboard' && (
                        <div className="space-y-6 sm:space-y-8 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                                <div className="bg-white dark:bg-carteSombre p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start justify-between transform transition-all hover:scale-105 duration-300">
                                    <div className="min-w-0 mr-2"><p className="text-xs sm:text-sm font-bold uppercase text-gray-500 mb-1 truncate">Utilisateurs</p><p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white truncate">{safeUsers.length}</p></div>
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full text-[#3b82f6] dark:text-blue-400 shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg></div>
                                </div>
                                <div className="bg-white dark:bg-carteSombre p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start justify-between transform transition-all hover:scale-105 duration-300">
                                    <div className="min-w-0 mr-2"><p className="text-xs sm:text-sm font-bold uppercase text-gray-500 mb-1 truncate">Sondages</p><p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white truncate">{safeSondages.length}</p></div>
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                                </div>
                                <div className="bg-white dark:bg-carteSombre p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start justify-between transform transition-all hover:scale-105 duration-300">
                                    <div className="min-w-0 mr-2"><p className="text-xs sm:text-sm font-bold uppercase text-gray-500 mb-1 truncate">Votes récoltés</p><p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white truncate">{totalVotes}</p></div>
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.029.028-.053.059-.08.081a1 1 0 00-1.154 0 2.12 2.12 0 01-.147.117a1.054 1.054 0 00-.304.372c-.114.29-.114.61 0 .899a1.077 1.077 0 00.304.372 1.14 1.14 0 01.147.117 1 1 0 001.154 0 2.12 2.12 0 01.147-.117c.13-.102.23-.23.304-.372a1.094 1.094 0 000-.899c-.074-.142-.174-.27-.304-.372a2.12 2.12 0 01-.147-.117zM12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm3.22 7.22a.75.75 0 00-1.06 0L11 12.393l-1.16-1.16a.75.75 0 10-1.06 1.06l1.69 1.69a.75.75 0 001.06 0l3.75-3.75z" /></svg></div>
                                </div>
                                <div className="bg-white dark:bg-carteSombre p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start justify-between transform transition-all hover:scale-105 duration-300">
                                    <div className="min-w-0 mr-2"><p className="text-xs sm:text-sm font-bold uppercase text-gray-500 mb-1 truncate">Actifs / Expirés</p><p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1 truncate">{sActifs} <span className="text-gray-400 text-xl sm:text-2xl mx-1 font-medium">/</span> {sExpires}</p></div>
                                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-carteSombre p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 dark:text-white truncate">🏆 Sondages les plus populaires</h3>
                                <div className="space-y-3">
                                    {topS.map((s, index) => {
                                        const auteur = safeUsers.find(u => u.id === s.user_id)?.name || 'Inconnu';
                                        return (
                                            <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-fondSombre rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow gap-3 w-full">
                                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                                    <span className={`text-xl sm:text-2xl font-bold shrink-0 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-gray-300 dark:text-gray-600'}`}>#{index + 1}</span>
                                                    <div className="min-w-0 flex-1">
                                                        
                                                        <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1 break-words">{s.titre}</p>
                                                        <p className="text-xs sm:text-sm text-gray-500 truncate">Par {auteur} • Créé le {new Date(s.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="self-start sm:self-auto shrink-0 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap">
                                                    {s.votes_count || 0} votes
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {adminOngletActif === 'utilisateurs' && (
                        <div className="bg-white dark:bg-carteSombre rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden w-full">
                            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                                <h3 className="text-lg sm:text-xl font-bold dark:text-white truncate w-full sm:w-auto">Annuaire des Utilisateurs</h3>
                                <div className="relative w-full sm:w-72 shrink-0">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                                    <input 
                                        type="text" 
                                        placeholder="Nom ou email..." 
                                        value={rechercheUtilisateur} 
                                        onChange={(e) => {
                                            setRechercheUtilisateur(e.target.value);
                                            setPageUtilisateurs(1);
                                        }} 
                                        className="w-full pl-10 p-2.5 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#3b82f6] outline-none dark:text-white transition-colors" 
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left min-w-[650px]">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase whitespace-nowrap">
                                        <tr><th className="p-3 sm:p-4">Utilisateur</th><th className="p-3 sm:p-4">Inscription</th><th className="p-3 sm:p-4">Rôle</th><th className="p-3 sm:p-4 text-center">Sondages</th><th className="p-3 sm:p-4 text-right">Actions</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {utilisateursPaginees.map(u => {
                                            const nbSondagesUtilisateur = safeSondages.filter(s => s.user_id === u.id).length;
                                            const susp = statutSuspensionUtilisateur(u);
                                            return (
                                                <tr key={u.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors ${susp ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                                                    <td className="p-3 sm:p-4">
                                                        <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base break-words line-clamp-1">{u.name}</p>
                                                        <p className="text-xs sm:text-sm text-gray-500 break-words line-clamp-1">{u.email}</p>
                                                        {susp && (
                                                            <div className="mt-1.5 flex flex-wrap">
                                                                <span className="inline-flex items-center rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 whitespace-nowrap">
                                                                    {susp.type === 'permanent'
                                                                        ? 'Compte suspendu'
                                                                        : `Suspendu jusqu'au ${susp.date.toLocaleDateString('fr-FR')}`}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                                                    <td className="p-3 sm:p-4 whitespace-nowrap"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>{u.role}</span></td>
                                                    
                                                    <td className="p-3 sm:p-4 text-center font-bold whitespace-nowrap">
                                                        {u.role === 'super_admin' ? (
                                                            <span className="text-gray-400 font-normal">-</span>
                                                        ) : (
                                                            <span className={nbSondagesUtilisateur > 20 ? "text-red-500" : "text-[#3b82f6]"}>
                                                                {nbSondagesUtilisateur}
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="p-3 sm:p-4 flex justify-end gap-2 whitespace-nowrap">
                                                        {u.role !== 'super_admin' && (
                                                            <>
                                                                <Link to={`/admin/utilisateurs/${u.id}`} className="text-[#3b82f6] hover:text-blue-800 font-bold text-xs sm:text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-2 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0" title="Voir l'historique">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span className="hidden sm:inline">Historique</span>
                                                                </Link>
                                                                <button onClick={() => setUtilisateurASupprimer(u.id)} className="text-red-500 hover:text-red-700 font-bold text-xs sm:text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/30 px-2 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0" title="Suspendre l'utilisateur">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg><span className="hidden sm:inline">Suspendre</span>
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {utilisateursFiltres.length === 0 && <div className="p-8 text-center text-gray-500 dark:text-gray-400 italic">Aucun utilisateur ne correspond à "{rechercheUtilisateur}"</div>}
                                {renderPagination(pageUtilisateurs, setPageUtilisateurs, totalPagesUsers)}
                            </div>
                        </div>
                    )}

                    {adminOngletActif === 'sondages' && (
                        <div className="bg-white dark:bg-carteSombre rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden w-full">
                            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                                <div><h3 className="text-lg sm:text-xl font-bold dark:text-white truncate">Modération des contenus</h3><p className="text-xs sm:text-sm text-gray-500 mt-1">Vérifiez les questions et les résultats.</p></div>
                                <div className="relative w-full sm:w-72 shrink-0">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                                    <input 
                                        type="text" 
                                        placeholder="Chercher un sondage..." 
                                        value={rechercheSondage} 
                                        onChange={(e) => {
                                            setRechercheSondage(e.target.value);
                                            setPageSondages(1);
                                        }} 
                                        className="w-full pl-10 p-2.5 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#3b82f6] outline-none dark:text-white transition-colors" 
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase whitespace-nowrap">
                                        <tr><th className="p-3 sm:p-4">Sondage & Auteur</th><th className="p-3 sm:p-4">Statut</th><th className="p-3 sm:p-4">Votes</th><th className="p-3 sm:p-4 text-right">Actions</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {sondagesPagines.map(s => {
                                            const estExpire = s.date_fin && new Date(s.date_fin) < new Date();
                                            const auteur = safeUsers.find(u => u.id === s.user_id)?.name || 'Inconnu';
                                            return (
                                                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                                    <td className="p-3 sm:p-4"><p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1 break-words">{s.titre}</p><p className="text-xs text-gray-500 mt-1 line-clamp-1 break-words">Par <span className="font-bold text-[#3b82f6]">{auteur}</span> • {s.est_anonyme ? 'Anonyme' : 'Public'}</p></td>
                                                    <td className="p-3 sm:p-4 whitespace-nowrap"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${estExpire ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{estExpire ? 'Expiré' : 'Actif'}</span></td>
                                                    <td className="p-3 sm:p-4 font-bold text-gray-700 dark:text-gray-300 text-sm sm:text-base whitespace-nowrap">{s.votes_count || 0}</td>
                                                    <td className="p-3 sm:p-4 flex justify-end gap-2 whitespace-nowrap">
                                                        <Link to={`/sondage/${s.id}`} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs sm:text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 sm:px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0" title="Aperçu">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                            <span className="hidden sm:inline">Aperçu</span>
                                                        </Link>
                                                        <Link to={`/sondage/${s.id}/resultats`} className="text-blue-600 hover:text-blue-800 font-bold text-xs sm:text-sm bg-blue-50 dark:bg-blue-900/20 px-2 sm:px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0" title="Résultats">
                                                            <span>📊</span> <span className="hidden sm:inline">Stats</span>
                                                        </Link>
                                                        {!estExpire && (
                                                            <button onClick={() => setSondageACloturer(s.id)} className="text-orange-600 hover:text-orange-800 font-bold text-xs sm:text-sm bg-orange-50 dark:bg-orange-900/20 px-2 sm:px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0">
                                                                <span>🔒</span> <span className="hidden sm:inline">Clôturer</span>
                                                            </button>
                                                        )}
                                                        <button onClick={() => setSondageAdminASupprimer(s.id)} className="text-red-500 hover:text-red-700 font-bold text-xs sm:text-sm bg-red-50 dark:bg-red-900/20 px-2 sm:px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0">
                                                            <span>🗑️</span> <span className="hidden sm:inline">Supprimer</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                {sondagesFiltres.length === 0 && <div className="p-8 text-center text-gray-500 dark:text-gray-400 italic">Aucun sondage ne correspond à "{rechercheSondage}"</div>}
                                {renderPagination(pageSondages, setPageSondages, totalPagesSondages)}
                            </div>
                        </div>
                    )}

                    {adminOngletActif === 'historique' && (
                        <div className="bg-white dark:bg-carteSombre p-4 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full overflow-hidden">
                            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 dark:text-white flex items-center gap-3 truncate">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                                Journal d'Audit
                            </h3>
                            <div className="space-y-3 sm:space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar w-full">
                                {safeLogs.length === 0 ? (
                                    <div className="text-center py-10 bg-gray-50 dark:bg-fondSombre rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-500 dark:text-gray-400 italic text-sm sm:text-base">Aucune action administrative enregistrée pour le moment.</p>
                                    </div>
                                ) : (
                                    safeLogs.map((log, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 bg-gray-50/50 dark:bg-fondSombre p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:-translate-y-0.5 w-full">
                                            <div className={`self-start sm:self-auto p-2 sm:p-3 rounded-xl shadow-sm shrink-0 ${log.action === 'ban' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : log.action === 'cloture' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                {log.action === 'ban' ? '🔨' : log.action === 'cloture' ? '🔒' : '🗑️'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-snug break-words">{log.description}</p>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1.5 whitespace-nowrap">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {new Date(log.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {adminOngletActif === 'profil' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
                            <div className="bg-white dark:bg-carteSombre p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 w-full">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">👤 Informations Administrateur</h3>
                                <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50">
                                    <p className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-400 uppercase break-words">Rôle : {user.role.replace('_', ' ')}</p>
                                    <p className="text-xs sm:text-sm text-purple-600/80 dark:text-purple-400/80 mt-1">Privilèges maximaux accordés.</p>
                                </div>
                                <form onSubmit={handleUpdateProfile} className="space-y-4 w-full">
                                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nom</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#3b82f6] outline-none dark:text-white text-sm sm:text-base" /></div>
                                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label><input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#3b82f6] outline-none dark:text-white text-sm sm:text-base" /></div>
                                    <button type="submit" disabled={loadingProfil} className="w-full bg-[#3b82f6] text-white font-bold py-3.5 sm:py-3 rounded-xl hover:bg-blue-700 transition-colors">Mettre à jour</button>
                                </form>
                            </div>
                            <div className="bg-white dark:bg-carteSombre p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 w-full">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">🔒 Sécurité</h3>
                                <form onSubmit={handleUpdatePassword} className="space-y-4 w-full">
                                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mot de passe actuel</label><input type="password" value={pwdData.current_password} onChange={(e) => setPwdData({...pwdData, current_password: e.target.value})} required className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none dark:text-white text-sm sm:text-base" /></div>
                                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nouveau mot de passe</label><input type="password" value={pwdData.new_password} onChange={(e) => setPwdData({...pwdData, new_password: e.target.value})} required minLength={8} className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none dark:text-white text-sm sm:text-base" /></div>
                                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirmer</label><input type="password" value={pwdData.new_password_confirmation} onChange={(e) => setPwdData({...pwdData, new_password_confirmation: e.target.value})} required minLength={8} className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none dark:text-white text-sm sm:text-base" /></div>
                                    <button type="submit" disabled={loadingProfil} className="w-full bg-gray-900 dark:bg-gray-700 text-white font-bold py-3.5 sm:py-3 rounded-xl hover:bg-gray-800 transition-colors">Changer le mot de passe</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
