// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/axios';

// // Import de nos composants fraîchement créés
// import ResultatsTableauPrint from '../components/ResultatsTableauPrint';
// import StatistiqueCard from '../components/StatistiqueCard';

// export default function ResultatsSondage() {
//     const { id } = useParams();
//     const navigate = useNavigate();
    
//     const [donnees, setDonnees] = useState(null);
//     const [chargement, setChargement] = useState(true);
//     const [erreur, setErreur] = useState('');

//     useEffect(() => {
//         const fetchResultats = async () => {
//             try {
//                 const reponse = await api.get(`/sondages/${id}/resultats`);
//                 setDonnees(reponse.data);
//             } catch (err) {
//                 setErreur(err.response?.data?.message || "Erreur lors du chargement des résultats.");
//             } finally {
//                 setChargement(false);
//             }
//         };
//         fetchResultats();
//     }, [id]);

//     const exporterPDF = () => {
//         if (!donnees) return;
//         const titreOriginal = document.title;
//         const nomFichier = `Resultats_${donnees.sondage.titre.replace(/\s+/g, '_')}`;
//         document.title = nomFichier;
//         window.print();
//         document.title = titreOriginal;
//     };

//     if (chargement) return <div className="text-center py-20 text-gray-500 text-lg">Analyse des résultats en cours...</div>;
//     if (erreur) return <div className="text-center py-20 text-red-500">{erreur}</div>;

//     const { sondage, statistiques, participants } = donnees;
//     const couleursTheme = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

//     const totalReponses = statistiques.reduce((total, stat) => {
//         if (stat.options) {
//             return total + stat.options.reduce((sum, opt) => sum + opt.votes, 0);
//         }
//         return total;
//     }, 0);

//     return (
//         <div className="max-w-6xl mx-auto py-10 px-4 transition-colors duration-300">
            
//             <style>{`
//                 @media print {
//                     @page { size: landscape; margin: 10mm; }
//                     body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//                 }
//             `}</style>

//             {/* PARTIE 1 : LE COMPOSANT DU TABLEAU (CACHÉ SUR ÉCRAN, VISIBLE EN PDF) */}
//             <ResultatsTableauPrint 
//                 sondage={sondage} 
//                 statistiques={statistiques} 
//                 participants={participants} 
//             />

//             {/* PARTIE 2 : L'INTERFACE UTILISATEUR (VISIBLE SUR ÉCRAN, CACHÉ EN PDF) */}
//             <div className="print:hidden animate-fade-in">
                
//                 {/* EN-TÊTE ÉCRAN */}
//                 <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
//                     <div className="flex-1">
//                         <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
//                             {sondage.titre}
//                         </h1>
//                         <p className="text-lg text-gray-500 dark:text-gray-400 mb-5">
//                             {sondage.description || "Consultez les statistiques détaillées de ce sondage."}
//                         </p>

//                         <div className="flex flex-wrap gap-3">
//                             <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
//                                 </svg>
//                                 {sondage.total_votes} votants
//                             </span>
//                             <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-bold">
//                                 {totalReponses > 0 ? totalReponses : sondage.total_votes} réponses au total
//                             </span>
                            
//                             {sondage.est_anonyme && (
//                                 <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 border border-blue-100">
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
//                                     100% Anonyme
//                                 </span>
//                             )}
//                         </div>
//                     </div>
                    
//                     <button onClick={exporterPDF} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm mt-2 md:mt-0">
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
//                         Export PDF
//                     </button>
//                 </div>

//                 {/* LA BOUCLE MAGIQUE SUR LE NOUVEAU COMPOSANT */}
//                 <div className="space-y-8">
//                     {statistiques.map((stat, index) => (
//                         <StatistiqueCard 
//                             key={stat.id} 
//                             stat={stat} 
//                             index={index} 
//                             couleursTheme={couleursTheme} 
//                         />
//                     ))}
//                 </div>
                
//                 <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
//                     <button onClick={() => navigate('/mes-sondages')} className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto">
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125-.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
//                         Retour aux sondages
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Import de tes composants enfants
import ResultatsTableauPrint from '../components/ResultatsTableauPrint';
import StatistiqueCard from '../components/StatistiqueCard';

export default function ResultatsSondage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [donnees, setDonnees] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');
    const [userRole, setUserRole] = useState('user'); // 🔥 Ajout pour gérer le bouton retour

    useEffect(() => {
        // 🔥 On récupère l'utilisateur pour adapter l'interface (Admin ou User)
        const userData = localStorage.getItem('user');
        if (userData) {
            setUserRole(JSON.parse(userData).role);
        }

        const fetchResultats = async () => {
            try {
                // Laravel va vérifier ici si on est le propriétaire ou un super_admin
                const reponse = await api.get(`/sondages/${id}/resultats`);
                setDonnees(reponse.data);
            } catch (err) {
                // 🔥 Gestion spécifique de l'erreur de permission (403)
                if (err.response && err.response.status === 403) {
                    setErreur("Accès refusé : Vous n'êtes pas autorisé à voir les résultats de ce sondage.");
                } else {
                    setErreur(err.response?.data?.message || "Erreur lors du chargement des résultats.");
                }
            } finally {
                setChargement(false);
            }
        };
        fetchResultats();
    }, [id]);

    const exporterPDF = () => {
        if (!donnees) return;
        const titreOriginal = document.title;
        const nomFichier = `Resultats_${donnees.sondage.titre.replace(/\s+/g, '_')}`;
        document.title = nomFichier;
        window.print();
        document.title = titreOriginal;
    };

    // --- ÉCRANS DE CHARGEMENT ET D'ERREUR ---
    if (chargement) return (
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Analyse des résultats en cours...</p>
        </div>
    );

    if (erreur) return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-fade-in">
            <div className="bg-red-50 dark:bg-red-900/20 p-10 rounded-2xl shadow-lg border border-red-200 dark:border-red-800">
                <div className="text-6xl mb-4">⛔</div>
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">{erreur}</h2>
                <button 
                    onClick={() => navigate(userRole === 'super_admin' ? '/admin' : '/mes-sondages')} 
                    className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2.5 px-6 rounded-xl border border-gray-300 transition-colors shadow-sm"
                >
                    Retour en lieu sûr
                </button>
            </div>
        </div>
    );

    // --- AFFICHAGE DES RÉSULTATS ---
    const { sondage, statistiques, participants } = donnees;
    const couleursTheme = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    // Calcul du total des réponses individuelles
    const totalReponses = statistiques.reduce((total, stat) => {
        if (stat.options) {
            return total + stat.options.reduce((sum, opt) => sum + opt.votes, 0);
        }
        return total;
    }, 0);

    // Sécurisation du nombre de votes (Laravel utilise souvent votes_count)
    const nombreVotants = sondage.votes_count || sondage.total_votes || 0;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 transition-colors duration-300">
            
            <style>{`
                @media print {
                    @page { size: landscape; margin: 10mm; }
                    body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>

            {/* PARTIE 1 : LE COMPOSANT DU TABLEAU (CACHÉ SUR ÉCRAN, VISIBLE EN PDF) */}
            <ResultatsTableauPrint 
                sondage={sondage} 
                statistiques={statistiques} 
                participants={participants} 
            />

            {/* PARTIE 2 : L'INTERFACE UTILISATEUR (VISIBLE SUR ÉCRAN, CACHÉ EN PDF) */}
            <div className="print:hidden animate-fade-in">
                
                {/* EN-TÊTE ÉCRAN */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6 bg-white dark:bg-carteSombre p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                {sondage.titre}
                            </h1>
                            {sondage.est_prive && (
                                <span className="bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">Privé</span>
                            )}
                        </div>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
                            {sondage.description || "Consultez les statistiques détaillées de ce sondage."}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                {nombreVotants} participant{nombreVotants > 1 ? 's' : ''}
                            </span>
                            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                {totalReponses > 0 ? totalReponses : nombreVotants} réponses au total
                            </span>
                            
                            {sondage.est_anonyme && (
                                <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                    100% Anonyme
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <button onClick={exporterPDF} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center gap-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        Exporter le Rapport PDF
                    </button>
                </div>

                {/* BOUCLE SUR LES CARTES DE STATISTIQUES */}
                <div className="space-y-8">
                    {statistiques.map((stat, index) => (
                        <StatistiqueCard 
                            key={stat.id} 
                            stat={stat} 
                            index={index} 
                            couleursTheme={couleursTheme} 
                        />
                    ))}
                </div>
                
                {/* BOUTON RETOUR INTELLIGENT */}
                <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-800 pt-8 pb-10">
                    <button 
                        onClick={() => navigate(userRole === 'super_admin' ? '/admin' : '/mes-sondages')} 
                        className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-bold py-4 px-10 rounded-xl shadow-md transition-transform transform hover:-translate-y-1 inline-flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                        Retour {userRole === 'super_admin' ? 'au Centre de Contrôle' : 'à mes sondages'}
                    </button>
                </div>
            </div>
        </div>
    );
}