// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ListeSondages from '../components/explorer/ListeSondages';

// export default function Accueil() {
//     const navigate = useNavigate();
//     const [isVisible, setIsVisible] = useState(false);

//     useEffect(() => {
//         window.scrollTo(0, 0);
        
//         const timer = setTimeout(() => {
//             setIsVisible(true);
//         }, 100);

//         return () => clearTimeout(timer);
//     }, []);

//     const handleCreerSondageClick = () => {
//         const token = localStorage.getItem('token');
        
//         if (token) {
//             navigate('/dashboard');
//         } else {
//             navigate('/login');
//         }
//     };

//     return (
//         // Sécurisation globale : w-full overflow-x-hidden empêche le scroll horizontal
//         <div className="w-full min-h-screen bg-gray-50 dark:bg-fondSombre transition-colors duration-300 overflow-x-hidden">
            
//             {/* SECTION HERO (Bannière bleue) */}
//             <div className={`w-full bg-[#3b82f6] dark:bg-blue-900 text-white py-16 sm:py-24 px-4 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
//                 <div className="max-w-4xl mx-auto w-full">
//                     {/* Ajout de break-words pour éviter que les longs mots ne cassent l'écran sur 320px */}
//                     <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight break-words">
//                         Bienvenue sur notre plateforme de sondages sécurisés.
//                     </h1>
                    
//                     <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed px-2 break-words">
//                         Exprimez-vous en toute confiance, votre vote est unique et protégé. Collectez des avis, analysez les résultats en temps réel et partagez vos sondages facilement.
//                     </p>
                    
//                     {/* GROUPE DE BOUTONS : flex-col sur mobile (empilés) / sm:flex-row sur tablette+ (côte à côte) */}
//                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
//                         {/* Bouton d'action principal */}
//                         <button 
//                             onClick={handleCreerSondageClick}
//                             className="w-full sm:w-auto bg-white text-[#3b82f6] dark:text-blue-900 font-bold py-3.5 px-8 rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center hover:-translate-y-1"
//                         >
//                             Créer un sondage <span className="ml-2 text-xl shrink-0">→</span>
//                         </button>

//                         {/* Bouton d'action secondaire (Scroll vers la liste) */}
//                         <button 
//                             onClick={() => {
//                                 document.getElementById('section-sondages')?.scrollIntoView({ behavior: 'smooth' });
//                             }}
//                             className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center hover:-translate-y-1"
//                         >
//                             Voter maintenant
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* SECTION FONCTIONNALITÉS */}
//             <div className={`w-full bg-white dark:bg-carteSombre py-12 sm:py-16 px-4 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//                 <div className="max-w-6xl mx-auto w-full">
//                     {/* Grille déjà parfaite : 1 colonne sur mobile, 3 sur Desktop */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 w-full">
                        
//                         <div className="w-full text-center p-6 bg-gray-50 dark:bg-fondSombre rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group overflow-hidden">
//                             <div className="flex justify-center mb-5 sm:mb-6">
//                                 <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                                     </svg>
//                                 </div>
//                             </div>
//                             <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 break-words">Rapide</h3>
//                             <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed break-words">
//                                 Créez un sondage en moins de 2 minutes avec notre éditeur intuitif.
//                             </p>
//                         </div>

//                         <div className="w-full text-center p-6 bg-gray-50 dark:bg-fondSombre rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group overflow-hidden">
//                             <div className="flex justify-center mb-5 sm:mb-6">
//                                 <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                     </svg>
//                                 </div>
//                             </div>
//                             <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 break-words">Sécurisé</h3>
//                             <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed break-words">
//                                 Anti-double vote intégré et authentification sécurisée.
//                             </p>
//                         </div>

//                         <div className="w-full text-center p-6 bg-gray-50 dark:bg-fondSombre rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group overflow-hidden">
//                             <div className="flex justify-center mb-5 sm:mb-6">
//                                 <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm6-11l-2 2 4-4m0 0a12.01 12.01 0 001.934 2.183M15 7l2 2-4 4" />
//                                     </svg>
//                                 </div>
//                             </div>
//                             <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 break-words">Analytique</h3>
//                             <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed break-words">
//                                 Résultats en temps réel avec graphiques et export PDF.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* SECTION LISTE DES SONDAGES (Ajout de l'ID pour le bouton de scroll) */}
//             <div id="section-sondages" className={`w-full py-12 sm:py-16 px-4 max-w-7xl mx-auto transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//                 <div className="text-center mb-10 sm:mb-12 w-full">
//                     <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white mb-3 break-words">
//                         Top 5 des sondages les plus populaires en cours
//                     </h1>
//                 </div>
                
//                 {/* On s'assure que le composant enfant prendra bien toute la largeur sans déborder */}
//                 <div className="w-full">
//                     <ListeSondages variant="accueil" />
//                 </div>
//             </div>

//         </div>
//     );
// }
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListeSondages from '../components/explorer/ListeSondages';

export default function Accueil() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const handleCreerSondageClick = () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-fondSombre transition-colors duration-300 overflow-x-hidden">
            
            {/* ========================================== */}
            {/* SECTION 1 : HERO (Bannière bleue Full Screen) */}
            {/* ========================================== */}
            <div className={`w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#3b82f6] dark:bg-blue-900 text-white px-4 py-12 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                <div className="max-w-4xl mx-auto w-full">
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 sm:mb-8 tracking-tight leading-tight break-words">
                        Bienvenue sur notre plateforme de sondages sécurisés.
                    </h1>
                    
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-10 sm:mb-12 text-blue-100 max-w-2xl mx-auto leading-relaxed px-2 break-words">
                        Exprimez-vous en toute confiance, votre vote est unique et protégé. Collectez des avis, analysez les résultats en temps réel et partagez vos sondages facilement.
                    </p>
                    
                    {/* Bouton d'action unique centré */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
                        <button 
                            onClick={handleCreerSondageClick}
                            className="w-full sm:w-auto bg-white text-[#3b82f6] dark:text-blue-900 font-bold py-3.5 sm:py-4 px-10 rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center hover:-translate-y-1 text-lg"
                        >
                            Créer un sondage <span className="ml-3 text-xl shrink-0">→</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ========================================== */}
            {/* SECTION 2 : FONCTIONNALITÉS (Visible au scroll) */}
            {/* ========================================== */}
            <div id="section-fonctionnalites" className={`w-full bg-white dark:bg-carteSombre py-16 sm:py-24 px-4 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="max-w-6xl mx-auto w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
                        
                        <div className="w-full text-center p-8 bg-gray-50 dark:bg-fondSombre rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group overflow-hidden">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 break-words">Rapide</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed break-words">
                                Créez un sondage en moins de 2 minutes avec notre éditeur intuitif.
                            </p>
                        </div>

                        <div className="w-full text-center p-8 bg-gray-50 dark:bg-fondSombre rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group overflow-hidden">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 break-words">Sécurisé</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed break-words">
                                Anti-double vote intégré et authentification sécurisée.
                            </p>
                        </div>

                        <div className="w-full text-center p-8 bg-gray-50 dark:bg-fondSombre rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group overflow-hidden">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm6-11l-2 2 4-4m0 0a12.01 12.01 0 001.934 2.183M15 7l2 2-4 4" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 break-words">Analytique</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed break-words">
                                Résultats en temps réel avec graphiques et export PDF.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================== */}
            {/* SECTION 3 : SONDAGES POPULAIRES */}
            {/* ========================================== */}
            <div id="section-sondages" className={`w-full py-16 sm:py-24 px-4 max-w-7xl mx-auto transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="text-center mb-10 sm:mb-12 w-full">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white mb-3 break-words">
                        Top 5 des sondages les plus populaires en cours
                    </h2>
                </div>
                
                <div className="w-full">
                    <ListeSondages variant="accueil" />
                </div>
            </div>

        </div>
    );
}