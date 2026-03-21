import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListeSondages from '../components/ListeSondages';

export default function Accueil() {
    const navigate = useNavigate();
    
    // État pour gérer les animations au chargement
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 1. Force la page à commencer TOUT EN HAUT au chargement
        window.scrollTo(0, 0);
        
        // 2. Déclenche les animations juste après l'affichage
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Fonction intelligente pour le clic sur le bouton
    const handleCreerSondageClick = () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            // S'il est déjà connecté, on l'envoie sur son espace pour créer
            navigate('/dashboard');
        } else {
            // S'il n'est pas connecté, redirection directe et fluide vers le login
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-fondSombre transition-colors duration-300 overflow-hidden">
            
            {/* --- SECTION HERO (Bannière bleue de image_0.png) --- */}
            {/* Ajout de l'animation d'apparition avec translate et opacity */}
            <div className={`bg-[#3b82f6] dark:bg-blue-900 text-white py-24 px-4 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                <div className="max-w-4xl mx-auto">
                    {/* Le grand titre */}
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Bienvenue sur notre plateforme de sondages sécurisés.
                    </h1>
                    
                    {/* Le sous-titre */}
                    <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        Exprimez-vous en toute confiance, votre vote est unique et protégé. Collectez des avis, analysez les résultats en temps réel et partagez vos sondages facilement.
                    </p>
                    
                    {/* Le bouton d'action */}
                    <button 
                        onClick={handleCreerSondageClick}
                        className="bg-white text-[#3b82f6] dark:text-blue-900 font-bold py-3 px-8 rounded-lg shadow hover:bg-gray-100 hover:shadow-lg transition-all duration-300 inline-flex items-center hover:scale-105"
                    >
                        Créer un sondage <span className="ml-2 text-xl">→</span>
                    </button>
                </div>
            </div>

            {/* --- NOUVELLE SECTION FONCTIONNALITÉS (Icônes de image_1.png) --- */}
            {/* Animation avec un petit délai (delay-300) pour faire un effet cascade */}
            <div className={`bg-white dark:bg-carteSombre py-16 px-4 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* 1. Rapide */}
                        <div className="text-center p-6 bg-gray-50 dark:bg-fondSombre rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Rapide</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Créez un sondage en moins de 2 minutes avec notre éditeur intuitif.
                            </p>
                        </div>

                      
                        <div className="text-center p-6 bg-gray-50 dark:bg-fondSombre rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sécurisé</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Anti-double vote intégré et authentification sécurisée.
                            </p>
                        </div>

                        {/* 3. Analytique */}
                        <div className="text-center p-6 bg-gray-50 dark:bg-fondSombre rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm6-11l-2 2 4-4m0 0a12.01 12.01 0 001.934 2.183M15 7l2 2-4 4" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analytique</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Résultats en temps réel avec graphiques et export PDF.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION LISTE DES SONDAGES --- */}
            {/* Animation avec un délai plus long (delay-500) pour terminer la cascade */}
            <div className={`container mx-auto py-16 px-4 bg-gray-50 dark:bg-fondSombre transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                        Sondages publics récents
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Participez aux sondages ci-dessous ou créez le vôtre pour recueillir des avis.
                    </p>
                </div>
                
                {/* On affiche les jolies cartes des sondages ici */}
                <ListeSondages />
            </div>

        </div>
    );
}