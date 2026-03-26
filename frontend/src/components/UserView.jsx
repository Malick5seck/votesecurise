// import { Link } from 'react-router-dom';

// export default function UserView({
//     vueActuelle, // sera 'mes-sondages' ou 'profil'
//     mesSondages,
//     historiqueVotes,
//     pageActuelle,
//     setPageActuelle,
//     sondagesParPage,
//     setSondageASupprimer,
//     handlePartager,
//     // Fonctions de profil
//     editName, setEditName, editEmail, setEditEmail, pwdData, setPwdData,
//     handleUpdateProfile, handleUpdatePassword, loadingProfil
// }) {

//     if (vueActuelle === 'mes-sondages') {
//         const indexDernierSondage = pageActuelle * sondagesParPage;
//         const indexPremierSondage = indexDernierSondage - sondagesParPage;
//         const sondagesAffiches = mesSondages.slice(indexPremierSondage, indexDernierSondage);
//         const totalPages = Math.ceil(mesSondages.length / sondagesParPage);

//         return (
//             <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
//                     <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
//                         📋 Mes sondages actifs
//                         {mesSondages.length > 0 && (
//                             <span className="text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full">
//                                 {mesSondages.length}
//                             </span>
//                         )}
//                     </h3>
//                     <Link to="/creer" className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-blue-500/30 flex items-center gap-2">
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                         </svg>
//                         Créer un sondage
//                     </Link>
//                 </div>
                
//                 {mesSondages.length === 0 ? (
//                     <div className="text-center py-16">
//                         <div className="text-6xl mb-4 text-gray-200 dark:text-gray-700">📭</div>
//                         <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mb-4">Vous n'avez pas encore créé de sondage.</p>
//                         <Link to="/creer" className="text-[#3b82f6] font-bold hover:underline">Commencez dès maintenant →</Link>
//                     </div>
//                 ) : (
//                     <div>
//                         <div className="space-y-4">
//                             {sondagesAffiches.map((sondage) => (
//                                 <div 
//                                     key={sondage.id} 
//                                     // 🔥 RETRAIT de la bordure bleue au survol (hover:border-[#3b82f6]/40)
//                                     className="group flex flex-col md:flex-row justify-between items-center bg-gray-50/50 dark:bg-fondSombre p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
//                                 >
//                                     <div className="mb-5 md:mb-0 w-full md:w-1/2">
//                                         {/* 🔥 RETRAIT du texte bleu au survol (group-hover:text-[#3b82f6]) */}
//                                         <h5 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center flex-wrap gap-2">
//                                             {sondage.titre}
//                                             {sondage.date_fin && new Date(sondage.date_fin) < new Date() && (
//                                                 <span className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-extrabold px-2 py-1 rounded-md uppercase tracking-wider">Expiré</span>
//                                             )}
//                                         </h5>
//                                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-3">
//                                             <span className="flex items-center gap-1">
//                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
//                                                 {sondage.questions?.length || 0} questions
//                                             </span>
//                                             <span>•</span>
//                                             <span className="flex items-center gap-1">
//                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
//                                                 <strong className="text-gray-700 dark:text-gray-300">{sondage.votes_count || 0}</strong> votes
//                                             </span>
//                                         </p>
//                                     </div>
                                    
//                                     <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
//                                         <button 
//                                             onClick={() => handlePartager(sondage.id)} 
//                                             className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-[#3b82f6] hover:text-[#3b82f6] font-bold py-2 px-4 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-300 hover:shadow-md"
//                                         >
//                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
//                                             </svg>
//                                             Partager
//                                         </button>
                                        
//                                         <Link 
//                                             to={`/sondage/${sondage.id}/resultats`} 
//                                             className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#3b82f6] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-bold py-2 px-4 rounded-lg shadow-sm text-sm hover:shadow-md"
//                                         >
//                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
//                                             </svg>
//                                             Résultats
//                                         </Link>
                                        
//                                         <button 
//                                             onClick={() => setSondageASupprimer(sondage.id)} 
//                                             className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 font-bold py-2 px-4 rounded-lg shadow-sm text-sm hover:shadow-md"
//                                         >
//                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
//                                             </svg>
//                                             Supprimer
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
                        
//                         {/* PAGINATION */}
//                         {totalPages > 1 && (
//                             <div className="flex justify-center items-center mt-10">
//                                 <div className="flex items-center gap-4 bg-gray-50 dark:bg-fondSombre p-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
//                                     <button 
//                                         onClick={() => setPageActuelle(prev => Math.max(prev - 1, 1))} 
//                                         disabled={pageActuelle === 1} 
//                                         className="px-5 py-2.5 rounded-lg font-bold bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 shadow-sm"
//                                     >
//                                         Précédent
//                                     </button>
//                                     <span className="text-sm font-bold text-gray-500">Page {pageActuelle} / {totalPages}</span>
//                                     <button 
//                                         onClick={() => setPageActuelle(prev => Math.min(prev + 1, totalPages))} 
//                                         disabled={pageActuelle === totalPages} 
//                                         className="px-5 py-2.5 rounded-lg font-bold bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 shadow-sm"
//                                     >
//                                         Suivant
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         );
//     }

//     if (vueActuelle === 'profil') {
//         const totalVotesRecus = mesSondages.reduce((acc, s) => acc + (s.votes_count || 0), 0);
//         const tauxParticipation = mesSondages.length > 0 ? Math.round(totalVotesRecus / mesSondages.length) : 0;

//         return (
//             <div>
//                 <div className="mb-8"><h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Paramètres du compte</h2></div>
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
//                     <div className="lg:col-span-5 space-y-8">
//                         {/* FORMULAIRES DE PROFIL */}
//                         <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
//                             <h3 className="text-xl font-extrabold dark:text-white mb-6">👤 Informations Personnelles</h3>
//                             <form onSubmit={handleUpdateProfile} className="space-y-5">
//                                 <div><label className="block text-sm font-bold dark:text-gray-300 mb-2">Nom complet</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none" /></div>
//                                 <div><label className="block text-sm font-bold dark:text-gray-300 mb-2">Email</label><input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none" /></div>
//                                 <button type="submit" disabled={loadingProfil} className="w-full bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30">Enregistrer</button>
//                             </form>
//                         </div>
                        
//                         <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
//                             <h3 className="text-xl font-extrabold dark:text-white mb-6">🔒 Sécurité du compte</h3>
//                             <form onSubmit={handleUpdatePassword} className="space-y-5">
//                                 <div><input type="password" placeholder="Mot de passe actuel" value={pwdData.current_password} onChange={(e) => setPwdData({...pwdData, current_password: e.target.value})} required className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none" /></div>
//                                 <div><input type="password" placeholder="Nouveau mot de passe" value={pwdData.new_password} onChange={(e) => setPwdData({...pwdData, new_password: e.target.value})} required minLength={8} className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none tracking-widest" /></div>
//                                 <div><input type="password" placeholder="Confirmer" value={pwdData.new_password_confirmation} onChange={(e) => setPwdData({...pwdData, new_password_confirmation: e.target.value})} required minLength={8} className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none tracking-widest" /></div>
//                                 <button type="submit" disabled={loadingProfil} className="w-full bg-gray-900 dark:bg-gray-700 text-white font-bold py-4 rounded-xl hover:bg-gray-800 shadow-lg">Changer le mot de passe</button>
//                             </form>
//                         </div>
//                     </div>
                    
//                     <div className="lg:col-span-7 space-y-8">
//                         {/* STATISTIQUES ORGANISATEUR */}
//                         {mesSondages.length > 0 && (
//                             <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/30">
//                                 <h3 className="text-xl font-extrabold dark:text-white mb-6">📊 Espace Organisateur</h3>
//                                 <div className="grid grid-cols-3 gap-6 text-center">
//                                     <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30"><p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">Créés</p><p className="text-4xl font-extrabold text-[#3b82f6]">{mesSondages.length}</p></div>
//                                     <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30"><p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-2">Reçus</p><p className="text-4xl font-extrabold text-emerald-500">{totalVotesRecus}</p></div>
//                                     <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/30"><p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-2">Participation</p><p className="text-2xl font-extrabold text-purple-500 mt-2">{tauxParticipation} <span className="text-sm font-normal">/sondage</span></p></div>
//                                 </div>
//                             </div>
//                         )}
                        
//                         {/* HISTORIQUE DES VOTES */}
//                         <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
//                             <h3 className="text-xl font-extrabold dark:text-white mb-6">🕒 Historique de vos votes</h3>
//                             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//                                 {historiqueVotes.length === 0 ? (
//                                     <p className="text-gray-500 italic text-center py-8">Vous n'avez participé à aucun sondage public.</p>
//                                 ) : (
//                                     historiqueVotes.map(vote => (
//                                         <div key={vote.id} className="group bg-gray-50/50 dark:bg-fondSombre p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md">
//                                             <div>
//                                                 {/* 🔥 RETRAIT du texte bleu au survol dans l'historique */}
//                                                 <p className="font-bold text-gray-900 dark:text-white">{vote.sondage ? vote.sondage.titre : "Sondage supprimé"}</p>
//                                                 <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
//                                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                                                     Voté le {new Date(vote.created_at).toLocaleDateString()}
//                                                 </p>
//                                             </div>
//                                             {vote.sondage && (
//                                                 <Link to={`/sondage/${vote.sondage.id}/resultats`} className="inline-flex items-center gap-1 text-[#3b82f6] hover:text-blue-800 dark:hover:text-blue-300 font-bold text-sm">
//                                                     Voir les résultats
//                                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
//                                                 </Link>
//                                             )}
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
    
//     return null;
// }
import { Link } from 'react-router-dom';

export default function UserView({
    donneesChargees, // 🔥 NOUVEAU : On récupère l'état de chargement
    vueActuelle, // sera 'mes-sondages' ou 'profil'
    mesSondages,
    historiqueVotes,
    pageActuelle,
    setPageActuelle,
    sondagesParPage,
    setSondageASupprimer,
    handlePartager,
    // Fonctions de profil
    editName, setEditName, editEmail, setEditEmail, pwdData, setPwdData,
    handleUpdateProfile, handleUpdatePassword, loadingProfil
}) {

    // 🔥 NOUVEAU : L'écran de chargement global pour éviter le flash d'un tableau vide
    if (!donneesChargees) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-carteSombre rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-[#3b82f6] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Chargement de vos données...</p>
            </div>
        );
    }

    if (vueActuelle === 'mes-sondages') {
        const indexDernierSondage = pageActuelle * sondagesParPage;
        const indexPremierSondage = indexDernierSondage - sondagesParPage;
        const sondagesAffiches = mesSondages.slice(indexPremierSondage, indexDernierSondage);
        const totalPages = Math.ceil(mesSondages.length / sondagesParPage);

        return (
            <div className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        📋 Mes sondages actifs
                        {mesSondages.length > 0 && (
                            <span className="text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full">
                                {mesSondages.length}
                            </span>
                        )}
                    </h3>
                    <Link to="/creer" className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-blue-500/30 flex items-center gap-2 transition-transform transform hover:-translate-y-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Créer un sondage
                    </Link>
                </div>
                
                {mesSondages.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4 text-gray-200 dark:text-gray-700">📭</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mb-4">Vous n'avez pas encore créé de sondage.</p>
                        <Link to="/creer" className="text-[#3b82f6] font-bold hover:underline">Commencez dès maintenant →</Link>
                    </div>
                ) : (
                    <div>
                        <div className="space-y-4">
                            {sondagesAffiches.map((sondage) => (
                                <div 
                                    key={sondage.id} 
                                    className="group flex flex-col md:flex-row justify-between items-center bg-gray-50/50 dark:bg-fondSombre p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                                >
                                    <div className="mb-5 md:mb-0 w-full md:w-1/2">
                                        <h5 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center flex-wrap gap-2">
                                            {sondage.titre}
                                            {sondage.date_fin && new Date(sondage.date_fin) < new Date() && (
                                                <span className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-extrabold px-2 py-1 rounded-md uppercase tracking-wider">Expiré</span>
                                            )}
                                        </h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                                                {sondage.questions?.length || 0} questions
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                                <strong className="text-gray-700 dark:text-gray-300">{sondage.votes_count || 0}</strong> votes
                                            </span>
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
                                        <button 
                                            onClick={() => handlePartager(sondage.id)} 
                                            className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-[#3b82f6] hover:text-[#3b82f6] font-bold py-2 px-4 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-300 hover:shadow-md transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                            </svg>
                                            Partager
                                        </button>
                                        
                                        <Link 
                                            to={`/sondage/${sondage.id}/resultats`} 
                                            className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#3b82f6] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-bold py-2 px-4 rounded-lg shadow-sm text-sm hover:shadow-md transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                            </svg>
                                            Résultats
                                        </Link>
                                        
                                        <button 
                                            onClick={() => setSondageASupprimer(sondage.id)} 
                                            className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 font-bold py-2 px-4 rounded-lg shadow-sm text-sm hover:shadow-md transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-10">
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-fondSombre p-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <button 
                                        onClick={() => setPageActuelle(prev => Math.max(prev - 1, 1))} 
                                        disabled={pageActuelle === 1} 
                                        className="px-5 py-2.5 rounded-lg font-bold bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 shadow-sm transition-colors"
                                    >
                                        Précédent
                                    </button>
                                    <span className="text-sm font-bold text-gray-500">Page {pageActuelle} / {totalPages}</span>
                                    <button 
                                        onClick={() => setPageActuelle(prev => Math.min(prev + 1, totalPages))} 
                                        disabled={pageActuelle === totalPages} 
                                        className="px-5 py-2.5 rounded-lg font-bold bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 shadow-sm transition-colors"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (vueActuelle === 'profil') {
        const totalVotesRecus = mesSondages.reduce((acc, s) => acc + (s.votes_count || 0), 0);
        const tauxParticipation = mesSondages.length > 0 ? Math.round(totalVotesRecus / mesSondages.length) : 0;

        return (
            <div>
                <div className="mb-8"><h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Paramètres du compte</h2></div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div className="lg:col-span-5 space-y-8">
                        {/* FORMULAIRES DE PROFIL */}
                        <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-extrabold dark:text-white mb-6">👤 Informations Personnelles</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div><label className="block text-sm font-bold dark:text-gray-300 mb-2">Nom complet</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none" /></div>
                                <div><label className="block text-sm font-bold dark:text-gray-300 mb-2">Email</label><input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none" /></div>
                                <button type="submit" disabled={loadingProfil} className="w-full bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-colors">Enregistrer</button>
                            </form>
                        </div>
                        
                        <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-extrabold dark:text-white mb-6">🔒 Sécurité du compte</h3>
                            <form onSubmit={handleUpdatePassword} className="space-y-5">
                                <div><input type="password" placeholder="Mot de passe actuel" value={pwdData.current_password} onChange={(e) => setPwdData({...pwdData, current_password: e.target.value})} required className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none" /></div>
                                <div><input type="password" placeholder="Nouveau mot de passe" value={pwdData.new_password} onChange={(e) => setPwdData({...pwdData, new_password: e.target.value})} required minLength={8} className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none tracking-widest" /></div>
                                <div><input type="password" placeholder="Confirmer" value={pwdData.new_password_confirmation} onChange={(e) => setPwdData({...pwdData, new_password_confirmation: e.target.value})} required minLength={8} className="w-full p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none tracking-widest" /></div>
                                <button type="submit" disabled={loadingProfil} className="w-full bg-gray-900 dark:bg-gray-700 text-white font-bold py-4 rounded-xl hover:bg-gray-800 shadow-lg transition-colors">Changer le mot de passe</button>
                            </form>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-7 space-y-8">
                        {/* STATISTIQUES ORGANISATEUR */}
                        {mesSondages.length > 0 && (
                            <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/30">
                                <h3 className="text-xl font-extrabold dark:text-white mb-6">📊 Espace Organisateur</h3>
                                <div className="grid grid-cols-3 gap-6 text-center">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30"><p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">Créés</p><p className="text-4xl font-extrabold text-[#3b82f6]">{mesSondages.length}</p></div>
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30"><p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-2">Reçus</p><p className="text-4xl font-extrabold text-emerald-500">{totalVotesRecus}</p></div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/30"><p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-2">Participation</p><p className="text-2xl font-extrabold text-purple-500 mt-2">{tauxParticipation} <span className="text-sm font-normal">/sondage</span></p></div>
                                </div>
                            </div>
                        )}
                        
                        {/* HISTORIQUE DES VOTES */}
                        <div className="bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-extrabold dark:text-white mb-6">🕒 Historique de vos votes</h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {historiqueVotes.length === 0 ? (
                                    <p className="text-gray-500 italic text-center py-8">Vous n'avez participé à aucun sondage public.</p>
                                ) : (
                                    historiqueVotes.map(vote => (
                                        <div key={vote.id} className="group bg-gray-50/50 dark:bg-fondSombre p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition-shadow">
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{vote.sondage ? vote.sondage.titre : "Sondage supprimé"}</p>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Voté le {new Date(vote.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {vote.sondage && (
                                                <Link to={`/sondage/${vote.sondage.id}/resultats`} className="inline-flex items-center gap-1 text-[#3b82f6] hover:text-blue-800 dark:hover:text-blue-300 font-bold text-sm transition-colors">
                                                    Voir les résultats
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                                                </Link>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
} 