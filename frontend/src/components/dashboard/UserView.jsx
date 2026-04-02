
// import { Link } from 'react-router-dom';
// import TousLesSondagesExplorer from '../explorer/TousLesSondagesExplorer';

// export default function UserView({
//     donneesChargees,
//     vueActuelle, 
//     mesSondages,
//     historiqueVotes,
//     tousLesSondages,
//     pageActuelle,
//     setPageActuelle,
//     sondagesParPage,
//     setSondageASupprimer,
//     handlePartager,
//     editName, setEditName, editEmail, setEditEmail, pwdData, setPwdData,
//     handleUpdateProfile, handleUpdatePassword, loadingProfil
// }) {

//     if (!donneesChargees) {
//         return (
//             <div className="flex flex-col items-center justify-center py-20 sm:py-32 bg-white dark:bg-carteSombre rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mx-4 sm:mx-0 w-full max-w-full overflow-hidden">
//                 <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-200 border-t-[#3b82f6] rounded-full animate-spin mb-4"></div>
//                 <p className="text-gray-500 dark:text-gray-400 font-medium text-base sm:text-lg text-center">Chargement de vos données...</p>
//             </div>
//         );
//     }

//     if (vueActuelle === 'tous-les-sondages') {
//         return <TousLesSondagesExplorer tousLesSondages={tousLesSondages} />;
//     }

//     if (vueActuelle === 'mes-sondages') {
//         const indexDernierSondage = pageActuelle * sondagesParPage;
//         const indexPremierSondage = indexDernierSondage - sondagesParPage;
//         const sondagesAffiches = mesSondages.slice(indexPremierSondage, indexDernierSondage);
//         const totalPages = Math.ceil(mesSondages.length / sondagesParPage);

//         return (
//             // Sécurisation globale : w-full max-w-full overflow-hidden
//             <div className="bg-white dark:bg-carteSombre p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-full overflow-hidden">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 border-b border-gray-100 dark:border-gray-800 pb-5 sm:pb-6 w-full">
//                     <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
//                         <span className="shrink-0 truncate">📋 Mes sondages</span>
//                         {mesSondages.length > 0 && (
//                             <span className="text-xs sm:text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
//                                 {mesSondages.length}
//                             </span>
//                         )}
//                     </h3>
//                     <Link to="/creer" className="w-full sm:w-auto justify-center bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 sm:py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-transform transform hover:-translate-y-0.5 shrink-0">
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                         </svg>
//                         Nouveau sondage
//                     </Link>
//                 </div>
                
//                 {mesSondages.length === 0 ? (
//                     <div className="text-center py-12 sm:py-16 px-4">
//                         <div className="text-5xl sm:text-6xl mb-4 text-gray-200 dark:text-gray-700">📭</div>
//                         <p className="text-gray-500 dark:text-gray-400 font-medium text-base sm:text-lg mb-4">Vous n'avez pas encore créé de sondage.</p>
//                         <Link to="/creer" className="text-[#3b82f6] font-bold hover:underline break-words">Commencez dès maintenant →</Link>
//                     </div>
//                 ) : (
//                     <div className="w-full">
//                         <div className="space-y-4 w-full">
//                             {sondagesAffiches.map((sondage) => (
//                                 <div 
//                                     key={sondage.id} 
//                                     className="group flex flex-col lg:flex-row justify-between lg:items-center bg-gray-50/50 dark:bg-fondSombre p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:border-blue-200 dark:hover:border-blue-800 gap-4 w-full overflow-hidden"
//                                 >
//                                     {/* Ajout de min-w-0 pour forcer les textes longs à respecter le conteneur */}
//                                     <div className="w-full lg:w-1/2 min-w-0">
//                                         <h5 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white flex items-start sm:items-center flex-wrap gap-2 leading-tight break-words">
//                                             <span className="min-w-0 line-clamp-2">{sondage.titre}</span>
//                                             {sondage.date_fin && new Date(sondage.date_fin) < new Date() && (
//                                                 <span className="shrink-0 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] sm:text-xs font-extrabold px-2 py-1 rounded-md uppercase tracking-wider mt-0.5 sm:mt-0">Expiré</span>
//                                             )}
//                                         </h5>
//                                         <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
//                                             <span className="flex items-center gap-1 shrink-0">
//                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
//                                                 {sondage.questions?.length || 0} questions
//                                             </span>
//                                             <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
//                                             <span className="flex items-center gap-1 shrink-0">
//                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
//                                                 <strong className="text-gray-700 dark:text-gray-300">{sondage.votes_count || 0}</strong> votes
//                                             </span>
//                                         </p>
//                                     </div>
                                    
//                                     <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start sm:justify-end mt-2 lg:mt-0 shrink-0">
//                                         <button 
//                                             onClick={() => handlePartager(sondage.id)} 
//                                             className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-[#3b82f6] hover:text-[#3b82f6] font-bold py-2 px-3 sm:px-4 rounded-lg shadow-sm text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:shadow-md transition-colors"
//                                         >
//                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
//                                             </svg>
//                                             <span className="truncate">Partager</span>
//                                         </button>
                                        
//                                         <Link 
//                                             to={`/sondage/${sondage.id}/resultats`} 
//                                             className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#3b82f6] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-bold py-2 px-3 sm:px-4 rounded-lg shadow-sm text-xs sm:text-sm hover:shadow-md transition-colors"
//                                         >
//                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
//                                             </svg>
//                                             <span className="truncate">Résultats</span>
//                                         </Link>
                                        
//                                         <button 
//                                             onClick={() => setSondageASupprimer(sondage.id)} 
//                                             className="w-full sm:flex-none justify-center flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 font-bold py-2 px-3 sm:px-4 rounded-lg shadow-sm text-xs sm:text-sm hover:shadow-md transition-colors"
//                                         >
//                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
//                                             </svg>
//                                             <span className="truncate">Supprimer</span>
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
                        
//                         {totalPages > 1 && (
//                             <div className="flex justify-center mt-8 w-full">
//                                 <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-gray-50 dark:bg-fondSombre p-3 sm:p-2 rounded-xl sm:rounded-full border border-gray-100 dark:border-gray-800 shadow-sm w-full sm:w-auto">
//                                     <button 
//                                         onClick={() => setPageActuelle(prev => Math.max(prev - 1, 1))} 
//                                         disabled={pageActuelle === 1} 
//                                         className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg sm:rounded-full font-bold text-sm bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm"
//                                     >
//                                         Précédent
//                                     </button>
//                                     <span className="text-xs sm:text-sm font-bold text-gray-500 whitespace-nowrap">Page {pageActuelle} / {totalPages}</span>
//                                     <button 
//                                         onClick={() => setPageActuelle(prev => Math.min(prev + 1, totalPages))} 
//                                         disabled={pageActuelle === totalPages} 
//                                         className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg sm:rounded-full font-bold text-sm bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm"
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
//             <div className="w-full max-w-full overflow-hidden">
//                 <div className="mb-6 sm:mb-8 text-center sm:text-left">
//                     <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white truncate">Paramètres du compte</h2>
//                 </div>
                
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 w-full">
//                     {/* Colonne de gauche : min-w-0 ajouté */}
//                     <div className="lg:col-span-5 space-y-6 sm:space-y-8 w-full min-w-0">
//                         <div className="bg-white dark:bg-carteSombre p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full">
//                             <h3 className="text-lg sm:text-xl font-extrabold dark:text-white mb-5 sm:mb-6 flex items-center gap-2 truncate">👤 Informations Personnelles</h3>
//                             <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-5 w-full">
//                                 <div>
//                                     <label className="block text-xs sm:text-sm font-bold dark:text-gray-300 mb-2">Nom complet</label>
//                                     <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none transition-shadow" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-xs sm:text-sm font-bold dark:text-gray-300 mb-2">Email</label>
//                                     <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required className="w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none transition-shadow" />
//                                 </div>
//                                 <button type="submit" disabled={loadingProfil} className="w-full bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-colors disabled:opacity-50 truncate px-2">Enregistrer les modifications</button>
//                             </form>
//                         </div>
                        
//                         <div className="bg-white dark:bg-carteSombre p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full">
//                             <h3 className="text-lg sm:text-xl font-extrabold dark:text-white mb-5 sm:mb-6 flex items-center gap-2 truncate">🔒 Sécurité du compte</h3>
//                             <form onSubmit={handleUpdatePassword} className="space-y-4 sm:space-y-5 w-full">
//                                 <div>
//                                     <input type="password" placeholder="Mot de passe actuel" value={pwdData.current_password} onChange={(e) => setPwdData({...pwdData, current_password: e.target.value})} required className="w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none transition-shadow text-sm sm:text-base" />
//                                 </div>
//                                 <div>
//                                     <input type="password" placeholder="Nouveau mot de passe" value={pwdData.new_password} onChange={(e) => setPwdData({...pwdData, new_password: e.target.value})} required minLength={8} className="w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none tracking-widest transition-shadow text-sm sm:text-base" />
//                                 </div>
//                                 <div>
//                                     <input type="password" placeholder="Confirmer le nouveau mot de passe" value={pwdData.new_password_confirmation} onChange={(e) => setPwdData({...pwdData, new_password_confirmation: e.target.value})} required minLength={8} className="w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none tracking-widest transition-shadow text-sm sm:text-base" />
//                                 </div>
//                                 <button type="submit" disabled={loadingProfil} className="w-full bg-gray-900 dark:bg-gray-700 text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-gray-800 shadow-lg transition-colors disabled:opacity-50 truncate px-2">Modifier le mot de passe</button>
//                             </form>
//                         </div>
//                     </div>
                    
//                     {/* Colonne de droite : min-w-0 ajouté */}
//                     <div className="lg:col-span-7 space-y-6 sm:space-y-8 w-full min-w-0">
//                         {mesSondages.length > 0 && (
//                             <div className="bg-white dark:bg-carteSombre p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/30 w-full overflow-hidden">
//                                 <h3 className="text-lg sm:text-xl font-extrabold dark:text-white mb-5 sm:mb-6 truncate">📊 Impact Organisateur</h3>
//                                 <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-4 sm:gap-6 text-center w-full">
//                                     <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex min-[400px]:flex-col justify-between min-[400px]:justify-center items-center min-w-0">
//                                         <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-0 min-[400px]:mb-2 truncate w-full">Sondages Créés</p>
//                                         <p className="text-2xl sm:text-4xl font-extrabold text-[#3b82f6] truncate w-full">{mesSondages.length}</p>
//                                     </div>
//                                     <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 sm:p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 flex min-[400px]:flex-col justify-between min-[400px]:justify-center items-center min-w-0">
//                                         <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-0 min-[400px]:mb-2 truncate w-full">Votes Reçus</p>
//                                         <p className="text-2xl sm:text-4xl font-extrabold text-emerald-500 truncate w-full">{totalVotesRecus}</p>
//                                     </div>
//                                     <div className="bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-5 rounded-2xl border border-purple-100 dark:border-purple-800/30 flex min-[400px]:flex-col justify-between min-[400px]:justify-center items-center min-w-0">
//                                         <p className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-0 min-[400px]:mb-2 truncate w-full">Taux Moyen</p>
//                                         <p className="text-xl sm:text-2xl font-extrabold text-purple-500 min-[400px]:mt-2 truncate w-full">
//                                             {tauxParticipation} <span className="text-[10px] sm:text-sm font-normal">rép./sondage</span>
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
                        
//                         <div className="bg-white dark:bg-carteSombre p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full overflow-hidden">
//                             <h3 className="text-lg sm:text-xl font-extrabold dark:text-white mb-5 sm:mb-6 truncate">🕒 Mes participations (Historique)</h3>
//                             <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar w-full">
//                                 {historiqueVotes.length === 0 ? (
//                                     <div className="bg-gray-50 dark:bg-fondSombre rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-10 text-center px-4">
//                                         <p className="text-gray-500 italic text-sm sm:text-base break-words">Vous n'avez participé à aucun sondage public.</p>
//                                     </div>
//                                 ) : (
//                                     historiqueVotes.map(vote => {
//                                         const key = vote.id || `vote-${vote.sondage_id}-${vote.created_at}`;
                                        
//                                         return (
//                                             <div key={key} className="group w-full bg-gray-50/50 dark:bg-fondSombre p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all">
//                                                 {/* Ajout flex-1 min-w-0 pour sécuriser le line-clamp */}
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2 break-words">{vote.sondage ? vote.sondage.titre : <span className="text-red-500 italic font-normal">Sondage supprimé par l'auteur</span>}</p>
//                                                     <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-1.5 flex items-center gap-1.5 flex-wrap">
//                                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                                                         <span className="truncate">Voté le {new Date(vote.created_at).toLocaleDateString()} à {new Date(vote.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
//                                                     </p>
//                                                 </div>
                                                
//                                                 {vote.sondage && (
//                                                     <Link to={`/sondage/${vote.sondage.id}/resultats`} className="inline-flex justify-center items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-[#3b82f6] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 font-bold text-xs sm:text-sm py-2 px-4 rounded-lg transition-colors shrink-0 shadow-sm w-full sm:w-auto mt-2 sm:mt-0">
//                                                         <span className="truncate">Voir les résultats</span>
//                                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
//                                                     </Link>
//                                                 )}
//                                             </div>
//                                         );
//                                     })
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
import TousLesSondagesExplorer from '../explorer/TousLesSondagesExplorer';

export default function UserView({
    donneesChargees,
    vueActuelle, 
    mesSondages,
    historiqueVotes,
    tousLesSondages,
    pageActuelle,
    setPageActuelle,
    sondagesParPage,
    setSondageASupprimer,
    handlePartager,
    editName, setEditName, editEmail, setEditEmail, pwdData, setPwdData,
    handleUpdateProfile, handleUpdatePassword, loadingProfil
}) {

    if (!donneesChargees) {
        return (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32 bg-white dark:bg-carteSombre rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mx-4 sm:mx-0 w-full max-w-full overflow-hidden">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-200 border-t-[#3b82f6] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-base sm:text-lg text-center">Chargement de vos données...</p>
            </div>
        );
    }

    if (vueActuelle === 'tous-les-sondages') {
        return <TousLesSondagesExplorer tousLesSondages={tousLesSondages} />;
    }

    if (vueActuelle === 'mes-sondages') {
        const indexDernierSondage = pageActuelle * sondagesParPage;
        const indexPremierSondage = indexDernierSondage - sondagesParPage;
        const sondagesAffiches = mesSondages.slice(indexPremierSondage, indexDernierSondage);
        const totalPages = Math.ceil(mesSondages.length / sondagesParPage);

        return (
            <div className="bg-white dark:bg-carteSombre p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 border-b border-gray-100 dark:border-gray-800 pb-5 sm:pb-6 w-full">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                        <span className="shrink-0 truncate">📋 Mes sondages</span>
                        {mesSondages.length > 0 && (
                            <span className="text-xs sm:text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
                                {mesSondages.length}
                            </span>
                        )}
                    </h3>
                    <Link to="/creer" className="w-full sm:w-auto justify-center bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 sm:py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-transform transform hover:-translate-y-0.5 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Nouveau sondage
                    </Link>
                </div>
                
                {mesSondages.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 px-4">
                        <div className="text-5xl sm:text-6xl mb-4 text-gray-200 dark:text-gray-700">📭</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-base sm:text-lg mb-4">Vous n'avez pas encore créé de sondage.</p>
                        <Link to="/creer" className="text-[#3b82f6] font-bold hover:underline break-words">Commencez dès maintenant →</Link>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="space-y-4 w-full">
                            {sondagesAffiches.map((sondage) => (
                                <div 
                                    key={sondage.id} 
                                    className="group flex flex-col lg:flex-row justify-between lg:items-center bg-gray-50/50 dark:bg-fondSombre p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:border-blue-200 dark:hover:border-blue-800 gap-4 w-full overflow-hidden"
                                >
                                    <div className="w-full lg:w-1/2 min-w-0">
                                        <h5 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white flex items-start sm:items-center flex-wrap gap-2 leading-tight break-words">
                                            <span className="min-w-0 line-clamp-2">{sondage.titre}</span>
                                            {sondage.date_fin && new Date(sondage.date_fin) < new Date() && (
                                                <span className="shrink-0 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] sm:text-xs font-extrabold px-2 py-1 rounded-md uppercase tracking-wider mt-0.5 sm:mt-0">Expiré</span>
                                            )}
                                        </h5>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                                            <span className="flex items-center gap-1 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                                                {sondage.questions?.length || 0} questions
                                            </span>
                                            <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
                                            <span className="flex items-center gap-1 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                                <strong className="text-gray-700 dark:text-gray-300">{sondage.votes_count || 0}</strong> votes
                                            </span>
                                        </p>
                                    </div>
                                    
                                    {/* CORRECTION : Alignement absolu des boutons 
                                        - flex, flex-wrap et items-center sur le parent
                                        - h-9 (mobile) et h-10 (desktop) pour forcer une hauteur identique
                                        - inline-flex items-center justify-center pour centrer le contenu
                                    */}
                                    <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 sm:gap-3 w-full lg:w-auto mt-3 lg:mt-0 shrink-0">
                                        <button 
                                            onClick={() => handlePartager(sondage.id)} 
                                            className="flex-1 sm:flex-none h-9 sm:h-10 inline-flex items-center justify-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-[#3b82f6] hover:text-[#3b82f6] font-bold px-3 sm:px-4 rounded-lg shadow-sm text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:shadow-md transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                            </svg>
                                            <span className="truncate">Partager</span>
                                        </button>
                                        
                                        <Link 
                                            to={`/sondage/${sondage.id}/resultats`} 
                                            className="flex-1 sm:flex-none h-9 sm:h-10 inline-flex items-center justify-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#3b82f6] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-bold px-3 sm:px-4 rounded-lg shadow-sm text-xs sm:text-sm hover:shadow-md transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                            </svg>
                                            <span className="truncate">Résultats</span>
                                        </Link>
                                        
                                        <button 
                                            onClick={() => setSondageASupprimer(sondage.id)} 
                                            className="w-full sm:w-auto sm:flex-none h-9 sm:h-10 inline-flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 font-bold px-3 sm:px-4 rounded-lg shadow-sm text-xs sm:text-sm hover:shadow-md transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            <span className="truncate">Supprimer</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8 w-full">
                                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-gray-50 dark:bg-fondSombre p-3 sm:p-2 rounded-xl sm:rounded-full border border-gray-100 dark:border-gray-800 shadow-sm w-full sm:w-auto">
                                    <button 
                                        onClick={() => setPageActuelle(prev => Math.max(prev - 1, 1))} 
                                        disabled={pageActuelle === 1} 
                                        className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg sm:rounded-full font-bold text-sm bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        Précédent
                                    </button>
                                    <span className="text-xs sm:text-sm font-bold text-gray-500 whitespace-nowrap">Page {pageActuelle} / {totalPages}</span>
                                    <button 
                                        onClick={() => setPageActuelle(prev => Math.min(prev + 1, totalPages))} 
                                        disabled={pageActuelle === totalPages} 
                                        className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg sm:rounded-full font-bold text-sm bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm"
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
            <div className="w-full max-w-full overflow-hidden">
                <div className="mb-6 sm:mb-8 text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white truncate">Paramètres du compte</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 w-full">
                    <div className="lg:col-span-5 space-y-6 sm:space-y-8 w-full min-w-0">
                        <div className="bg-white dark:bg-carteSombre p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full">
                            <h3 className="text-lg sm:text-xl font-extrabold dark:text-white mb-5 sm:mb-6 flex items-center gap-2 truncate">👤 Informations Personnelles</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-5 w-full">
                                <div>
                                    <label className="block text-xs sm:text-sm font-bold dark:text-gray-300 mb-2">Nom complet</label>
                                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none transition-shadow" />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-bold dark:text-gray-300 mb-2">Email</label>
                                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required className="w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none transition-shadow" />
                                </div>
                                <button type="submit" disabled={loadingProfil} className="w-full bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-colors disabled:opacity-50 truncate px-2">Enregistrer les modifications</button>
                            </form>
                        </div>
                        
                        <div className="bg-white dark:bg-carteSombre p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full">
                            <h3 className="text-lg sm:text-xl font-extrabold dark:text-white mb-5 sm:mb-6 flex items-center gap-2 truncate">🔒 Sécurité du compte</h3>
                            <form onSubmit={handleUpdatePassword} className="space-y-4 sm:space-y-5 w-full">
                                <div>
                                    <input type="password" placeholder="Mot de passe actuel" value={pwdData.current_password} onChange={(e) => setPwdData({...pwdData, current_password: e.target.value})} required className="w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none transition-shadow text-sm sm:text-base" />
                                </div>
                                <div>
                                    <input type="password" placeholder="Nouveau mot de passe" value={pwdData.new_password} onChange={(e) => setPwdData({...pwdData, new_password: e.target.value})} required minLength={8} className="w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none tracking-widest transition-shadow text-sm sm:text-base" />
                                </div>
                                <div>
                                    <input type="password" placeholder="Confirmer le nouveau mot de passe" value={pwdData.new_password_confirmation} onChange={(e) => setPwdData({...pwdData, new_password_confirmation: e.target.value})} required minLength={8} className="w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 rounded-xl dark:bg-fondSombre dark:text-white dark:border-gray-700 outline-none tracking-widest transition-shadow text-sm sm:text-base" />
                                </div>
                                <button type="submit" disabled={loadingProfil} className="w-full bg-gray-900 dark:bg-gray-700 text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-gray-800 shadow-lg transition-colors disabled:opacity-50 truncate px-2">Modifier le mot de passe</button>
                            </form>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-7 space-y-6 sm:space-y-8 w-full min-w-0">
                        {mesSondages.length > 0 && (
                            <div className="bg-white dark:bg-carteSombre p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/30 w-full overflow-hidden">
                                <h3 className="text-lg sm:text-xl font-extrabold dark:text-white mb-5 sm:mb-6 truncate">📊 Impact Organisateur</h3>
                                <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-4 sm:gap-6 text-center w-full">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex min-[400px]:flex-col justify-between min-[400px]:justify-center items-center min-w-0">
                                        <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-0 min-[400px]:mb-2 truncate w-full">Sondages Créés</p>
                                        <p className="text-2xl sm:text-4xl font-extrabold text-[#3b82f6] truncate w-full">{mesSondages.length}</p>
                                    </div>
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 sm:p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 flex min-[400px]:flex-col justify-between min-[400px]:justify-center items-center min-w-0">
                                        <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-0 min-[400px]:mb-2 truncate w-full">Votes Reçus</p>
                                        <p className="text-2xl sm:text-4xl font-extrabold text-emerald-500 truncate w-full">{totalVotesRecus}</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-5 rounded-2xl border border-purple-100 dark:border-purple-800/30 flex min-[400px]:flex-col justify-between min-[400px]:justify-center items-center min-w-0">
                                        <p className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-0 min-[400px]:mb-2 truncate w-full">Taux Moyen</p>
                                        <p className="text-xl sm:text-2xl font-extrabold text-purple-500 min-[400px]:mt-2 truncate w-full">
                                            {tauxParticipation} <span className="text-[10px] sm:text-sm font-normal">rép./sondage</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="bg-white dark:bg-carteSombre p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full overflow-hidden">
                            <h3 className="text-lg sm:text-xl font-extrabold dark:text-white mb-5 sm:mb-6 truncate">🕒 Mes participations (Historique)</h3>
                            <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar w-full">
                                {historiqueVotes.length === 0 ? (
                                    <div className="bg-gray-50 dark:bg-fondSombre rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-10 text-center px-4">
                                        <p className="text-gray-500 italic text-sm sm:text-base break-words">Vous n'avez participé à aucun sondage public.</p>
                                    </div>
                                ) : (
                                    historiqueVotes.map(vote => {
                                        const key = vote.id || `vote-${vote.sondage_id}-${vote.created_at}`;
                                        
                                        return (
                                            <div key={key} className="group w-full bg-gray-50/50 dark:bg-fondSombre p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2 break-words">{vote.sondage ? vote.sondage.titre : <span className="text-red-500 italic font-normal">Sondage supprimé par l'auteur</span>}</p>
                                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-1.5 flex items-center gap-1.5 flex-wrap">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        <span className="truncate">Voté le {new Date(vote.created_at).toLocaleDateString()} à {new Date(vote.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                    </p>
                                                </div>
                                                
                                                {vote.sondage && (
                                                    <Link to={`/sondage/${vote.sondage.id}/resultats`} className="inline-flex justify-center items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-[#3b82f6] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 font-bold text-xs sm:text-sm py-2 px-4 rounded-lg transition-colors shrink-0 shadow-sm w-full sm:w-auto mt-2 sm:mt-0 h-10">
                                                        <span className="truncate">Voir les résultats</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                                                    </Link>
                                                )}
                                            </div>
                                        );
                                    })
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