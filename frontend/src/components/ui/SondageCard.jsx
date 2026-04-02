// import { Link } from 'react-router-dom';

// /**
//  * Composant unifié pour afficher une carte de sondage
//  * @param {Object} props
//  * @param {Object} props.sondage - Les données du sondage
//  * @param {Function} props.onClick - Fonction appelée lors du clic sur la carte
//  * @param {Boolean} [props.estRestreint=false] - Si vrai, affiche le badge "Votes restreints" (utile pour TousLesSondages)
//  */
// export default function SondageCard({ sondage, onClick, estRestreint = false }) {
    
//     // Logique pour afficher le badge "Nouveau" (moins de 3 jours)
//     const estNouveau = (dateCreation) => {
//         const diffTemps = new Date() - new Date(dateCreation);
//         const diffJours = diffTemps / (1000 * 3600 * 24);
//         return diffJours <= 3;
//     };

//     return (
//         <div 
//             onClick={() => onClick(sondage.id)}
//             role="button"
//             tabIndex={0}
//             onKeyDown={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') onClick(sondage.id);
//             }}
//             className="group bg-white dark:bg-carteSombre rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:border-[#3b82f6]/30 dark:hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
//         >
//             {/* Ligne de couleur au sommet de la carte */}
//             <div className={`h-1.5 w-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity ${estRestreint ? 'from-amber-400 to-[#3b82f6]' : 'from-blue-400 to-[#3b82f6]'}`}></div>
            
//             <div className="p-5 sm:p-7 flex flex-col flex-1">
//                 {/* En-tête de la carte : Badges (Public, Nouveau, Restreint) */}
//                 <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
//                     <div className="flex flex-wrap gap-2">
//                         {estRestreint ? (
//                             <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide px-3 py-1 shrink-0">
//                                 🔒 Restreint
//                             </span>
//                         ) : (
//                             <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
//                                 Public
//                             </span>
//                         )}
                        
//                         {estNouveau(sondage.created_at) && (
//                             <span className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shrink-0">
//                                 Nouveau
//                             </span>
//                         )}
//                     </div>
//                     {sondage.est_anonyme && (
//                         <span className="text-gray-400 dark:text-gray-500 shrink-0 ml-2 text-sm sm:text-base" title="Sondage Anonyme">🕵️‍♂️</span>
//                     )}
//                 </div>

//                 {/* Titre et Description */}
//                 <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-[#3b82f6] dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
//                     {sondage.titre}
//                 </h3>
//                 <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
//                     {sondage.description || "Aucune description fournie pour ce sondage. Cliquez pour découvrir les questions."}
//                 </p>
//             </div>

//             {/* Pied de carte : Métadonnées (Questions, Votes, Date) */}
//             {/* 🔥 RESPONSIVE : flex-col sur mobile, flex-row à partir de sm */}
//             <div className="px-5 sm:px-7 py-4 sm:py-5 bg-gray-50/50 dark:bg-fondSombre border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mt-auto">
//                 <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0">
//                     {sondage.questions && (
//                         <span className="flex items-center gap-1.5 shrink-0" title="Nombre de questions">
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0">
//                               <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
//                             </svg>
//                             {sondage.questions.length} Q.
//                         </span>
//                     )}
//                     <span className="flex items-center gap-1.5 font-bold text-[#3b82f6] shrink-0" title="Nombre total de votes">
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
//                         </svg>
//                         {sondage.votes_count || 0} votes
//                     </span>
//                 </div>
                
//                 {/* Affichage adaptatif de la date (Créé le OU Date de fin) */}
//                 <span className="flex items-center gap-1.5 text-left shrink-0 min-w-0">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
//                     </svg>
//                     <span className="truncate">
//                         {sondage.date_fin 
//                             ? `Fin ${new Date(sondage.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}`
//                             : `Créé le ${new Date(sondage.created_at).toLocaleDateString('fr-FR')}`}
//                     </span>
//                 </span>
//             </div>
//         </div>
//     );
// }
import { Link } from 'react-router-dom';

/**
 * Composant unifié pour afficher une carte de sondage
 * @param {Object} props
 * @param {Object} props.sondage - Les données du sondage
 * @param {Function} props.onClick - Fonction appelée lors du clic sur la carte
 * @param {Boolean} [props.estRestreint=false] - Si vrai, affiche le badge "Votes restreints" (utile pour TousLesSondages)
 */
export default function SondageCard({ sondage, onClick, estRestreint = false }) {
    
    // Logique pour afficher le badge "Nouveau" (moins de 3 jours)
    const estNouveau = (dateCreation) => {
        const diffTemps = new Date() - new Date(dateCreation);
        const diffJours = diffTemps / (1000 * 3600 * 24);
        return diffJours <= 3;
    };

    return (
        <div 
            onClick={() => onClick(sondage.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClick(sondage.id);
            }}
            // Ajout de w-full pour prendre parfaitement la place de la grille parente
            className="group w-full bg-white dark:bg-carteSombre rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:border-[#3b82f6]/30 dark:hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
        >
            {/* Ligne de couleur au sommet de la carte */}
            <div className={`h-1.5 w-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity ${estRestreint ? 'from-amber-400 to-[#3b82f6]' : 'from-blue-400 to-[#3b82f6]'}`}></div>
            
            <div className="p-5 sm:p-7 flex flex-col flex-1 min-w-0">
                {/* En-tête de la carte : Badges (Public, Nouveau, Restreint) */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4 w-full">
                    <div className="flex flex-wrap gap-2 min-w-0">
                        {estRestreint ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide px-3 py-1 shrink-0 truncate">
                                🔒 Restreint
                            </span>
                        ) : (
                            <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider shrink-0 truncate">
                                Public
                            </span>
                        )}
                        
                        {estNouveau(sondage.created_at) && (
                            <span className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shrink-0 truncate">
                                Nouveau
                            </span>
                        )}
                    </div>
                    {sondage.est_anonyme && (
                        <span className="text-gray-400 dark:text-gray-500 shrink-0 ml-2 text-sm sm:text-base" title="Sondage Anonyme">🕵️‍♂️</span>
                    )}
                </div>

                {/* Titre et Description - Ajout de break-words pour empêcher les longs mots sans espace de déborder */}
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-[#3b82f6] dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight break-words">
                    {sondage.titre}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4 flex-1 break-words">
                    {sondage.description || "Aucune description fournie pour ce sondage. Cliquez pour découvrir les questions."}
                </p>
            </div>

            {/* Pied de carte : Métadonnées (Questions, Votes, Date) */}
            <div className="px-5 sm:px-7 py-4 sm:py-5 bg-gray-50/50 dark:bg-fondSombre border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mt-auto w-full overflow-hidden">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto flex-1">
                    {sondage.questions && (
                        <span className="flex items-center gap-1.5 shrink-0 truncate" title="Nombre de questions">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                            </svg>
                            {sondage.questions.length} Q.
                        </span>
                    )}
                    <span className="flex items-center gap-1.5 font-bold text-[#3b82f6] shrink-0 truncate" title="Nombre total de votes">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        {sondage.votes_count || 0} votes
                    </span>
                </div>
                
                {/* Affichage adaptatif de la date */}
                <span className="flex items-center gap-1.5 text-left shrink-0 min-w-0 max-w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span className="truncate">
                        {sondage.date_fin 
                            ? `Fin ${new Date(sondage.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}`
                            : `Créé le ${new Date(sondage.created_at).toLocaleDateString('fr-FR')}`}
                    </span>
                </span>
            </div>
        </div>
    );
}