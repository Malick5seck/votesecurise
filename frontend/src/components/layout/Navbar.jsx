// import { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';

// export default function Navbar() {

//     const [isDarkMode, setIsDarkMode] = useState(false); 
//     const navigate = useNavigate();
//     const location = useLocation();

//     const estConnecte = !!localStorage.getItem('token'); 

//     const userJson = localStorage.getItem('user');
//     const user = userJson ? JSON.parse(userJson) : null;

//     const isSuperAdmin = user?.role === 'super_admin';

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user'); 
//         navigate('/'); 
//     };

//     useEffect(() => {
//         if (isDarkMode) {
//             document.documentElement.classList.add('dark'); 
//         } else {
//             document.documentElement.classList.remove('dark'); 
//         }
//     }, [isDarkMode]);

//     const getLinkStyle = (path) => {
//         const isActive = location.pathname === path; 
//         return `px-4 py-2 rounded-lg font-medium transition-colors ${
//             isActive 
//                 ? 'bg-white text-primaire dark:bg-gray-800 dark:text-white shadow-sm' 
//                 : 'text-white hover:bg-white/20 dark:hover:bg-gray-700'
//         }`;
//     };

//     return (
//         <header className="sticky top-0 z-50 bg-primaire dark:bg-carteSombre text-white p-4 shadow-md transition-colors duration-300 print:hidden">
//             <div className="container mx-auto flex justify-between items-center">
                
//                 <Link to="/" className="font-bold text-2xl tracking-wide flex items-center gap-2">
//                     VotePulse
//                 </Link>
                
//                 <div className="flex items-center space-x-2 md:space-x-4">
                    
//                     {estConnecte ? (
//                         <nav className="flex items-center space-x-1 md:space-x-2 mr-2">
//                             {isSuperAdmin ? (
//                                 <Link to="/admin" className={getLinkStyle('/admin')}>Dashboard</Link>
//                             ) : (
//                                 <>
//                                     <Link to="/" className={getLinkStyle('/')}>Accueil</Link>
//                                     <Link to="/mes-sondages" className={getLinkStyle('/mes-sondages')}>Mes sondages</Link>
//                                     <Link to="/creer" className={getLinkStyle('/creer')}>Créer</Link>
//                                     <Link to="/profil" className={getLinkStyle('/profil')}>Profil</Link>
//                                 </>
//                             )}
//                         </nav>
//                     ) : (
//                         <Link to="/login" className="hover:text-secondaire transition-colors font-medium mr-4">Se connecter</Link>
//                     )}

//                     <button 
//                         onClick={() => setIsDarkMode(!isDarkMode)} 
//                         title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
//                         className="p-2 bg-secondaire hover:bg-emerald-600 text-white rounded-full shadow transition-transform transform hover:scale-110 focus:outline-none"
//                     >
//                         {isDarkMode ? (
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
//                         ) : (
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
//                         )}
//                     </button>
                     
//                     {estConnecte && (
//                         <button 
//                             onClick={handleLogout} 
//                             title="Se déconnecter"
//                             className="flex items-center gap-2 px-4 py-2 ml-1 text-white bg-red-500/20 hover:bg-red-500 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-400 font-medium"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
//                             </svg>
//                             <span className="hidden sm:inline">Déconnexion</span>
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// }
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {

    const [isDarkMode, setIsDarkMode] = useState(false); 
    // 🔥 NOUVEAU : État pour le menu mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    const estConnecte = !!localStorage.getItem('token'); 

    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const isSuperAdmin = user?.role === 'super_admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); 
        setIsMobileMenuOpen(false); // Ferme le menu mobile lors de la déconnexion
        navigate('/'); 
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark'); 
        } else {
            document.documentElement.classList.remove('dark'); 
        }
    }, [isDarkMode]);

    const getLinkStyle = (path) => {
        const isActive = location.pathname === path; 
        return `px-4 py-2 rounded-lg font-medium transition-colors ${
            isActive 
                ? 'bg-white text-primaire dark:bg-gray-800 dark:text-white shadow-sm' 
                : 'text-white hover:bg-white/20 dark:hover:bg-gray-700'
        }`;
    };

    // Helper pour le style des liens mobiles (prend toute la largeur)
    const getMobileLinkStyle = (path) => {
        const isActive = location.pathname === path; 
        return `block w-full text-left px-4 py-3 rounded-lg font-bold transition-colors ${
            isActive 
                ? 'bg-white text-primaire dark:bg-gray-800 dark:text-white shadow-sm' 
                : 'text-white hover:bg-white/20 dark:hover:bg-gray-700'
        }`;
    };

    return (
        <header className="sticky top-0 z-50 bg-primaire dark:bg-carteSombre text-white p-4 shadow-md transition-colors duration-300 print:hidden">
            <div className="container mx-auto">
                {/* LIGNE PRINCIPALE (Toujours visible en haut) */}
                <div className="flex justify-between items-center">
                    
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-2xl tracking-wide flex items-center gap-2">
                        VotePulse
                    </Link>
                    
                    <div className="flex items-center space-x-2 md:space-x-4">
                        
                        {/* MENU DESKTOP (Caché sur mobile via 'hidden md:flex') */}
                        {estConnecte ? (
                            <nav className="hidden md:flex items-center space-x-1 md:space-x-2 mr-2">
                                {isSuperAdmin ? (
                                    <Link to="/admin" className={getLinkStyle('/admin')}>Dashboard</Link>
                                ) : (
                                    <>
                                        <Link to="/" className={getLinkStyle('/')}>Accueil</Link>
                                        <Link to="/tous-les-sondages" className={getLinkStyle('/tous-les-sondages')}> Les sondages</Link>
                                        <Link to="/mes-sondages" className={getLinkStyle('/mes-sondages')}>Mes sondages</Link>
                                        <Link to="/creer" className={getLinkStyle('/creer')}>Créer</Link>
                                        <Link to="/profil" className={getLinkStyle('/profil')}>Profil</Link>
                                    </>
                                )}
                            </nav>
                        ) : (
                            // Lien "Se connecter" visible sur tous les écrans si déconnecté
                            <Link to="/login" className="hover:text-secondaire transition-colors font-medium mr-2 md:mr-4">Se connecter</Link>
                        )}

                        {/* BOUTONS GLOBAUX (Thème et Hamburger) */}
                        <div className="flex items-center gap-2">
                            {/* Bouton Mode Sombre */}
                            <button 
                                onClick={() => setIsDarkMode(!isDarkMode)} 
                                title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
                                className="p-2 bg-secondaire hover:bg-emerald-600 text-white rounded-full shadow transition-transform transform hover:scale-110 focus:outline-none"
                            >
                                {isDarkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                                )}
                            </button>
                             
                            {/* Bouton Déconnexion Desktop (Caché sur mobile) */}
                            {estConnecte && (
                                <button 
                                    onClick={handleLogout} 
                                    title="Se déconnecter"
                                    className="hidden md:flex items-center gap-2 px-4 py-2 text-white bg-red-500/20 hover:bg-red-500 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-400 font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                    </svg>
                                    <span>Déconnexion</span>
                                </button>
                            )}

                            {/* 🔥 NOUVEAU : Bouton Hamburger pour Mobile (visible si connecté et écran < md) */}
                            {estConnecte && (
                                <button 
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors focus:outline-none ml-1"
                                    aria-label="Menu principal"
                                >
                                    {isMobileMenuOpen ? (
                                        // Icône 'X' quand le menu est ouvert
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        // Icône Hamburger (3 lignes) quand le menu est fermé
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🔥 NOUVEAU : ZONE DU MENU MOBILE DÉROULANT */}
                {/* L'animation utilise max-h pour glisser doucement vers le bas */}
                {estConnecte && (
                    <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[32rem] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <nav className="flex flex-col space-y-2 pb-4 pt-2 border-t border-white/10 dark:border-gray-700/50">
                            {isSuperAdmin ? (
                                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkStyle('/admin')}>Dashboard</Link>
                            ) : (
                                <>
                                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkStyle('/')}>Accueil</Link>
                                    <Link to="/tous-les-sondages" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkStyle('/tous-les-sondages')}>Tous les sondages</Link>
                                    <Link to="/mes-sondages" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkStyle('/mes-sondages')}>Mes sondages</Link>
                                    <Link to="/creer" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkStyle('/creer')}>Créer</Link>
                                    <Link to="/profil" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkStyle('/profil')}>Profil</Link>
                                </>
                            )}
                            
                            {/* Bouton de déconnexion spécifique au menu mobile */}
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center gap-2 w-full text-left px-4 py-3 mt-2 text-white bg-red-500/20 hover:bg-red-500 rounded-lg transition-colors font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                                Se déconnecter
                            </button>
                        </nav>
                    </div>
                )}

            </div>
        </header>
    );
}