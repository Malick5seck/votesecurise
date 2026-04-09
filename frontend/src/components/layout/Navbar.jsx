import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {

    const [isDarkMode, setIsDarkMode] = useState(false); 
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
        setIsMobileMenuOpen(false);
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
        return `px-3 py-2 rounded-lg font-medium text-sm lg:text-base whitespace-nowrap transition-colors ${
            isActive 
                ? 'bg-white text-[#3b82f6] dark:bg-gray-800 dark:text-white shadow-sm' 
                : 'text-white hover:bg-white/20 dark:hover:bg-gray-700'
        }`;
    };

    const getMobileLinkStyle = (path) => {
        const isActive = location.pathname === path; 
        return `block w-full text-left px-4 py-3 rounded-lg font-bold transition-colors ${
            isActive 
                ? 'bg-white text-[#3b82f6] dark:bg-gray-800 dark:text-white shadow-sm' 
                : 'text-white hover:bg-white/20 dark:hover:bg-gray-700'
        }`;
    };

    return (
        <header className="sticky top-0 z-50 bg-[#3b82f6] dark:bg-gray-900 text-white shadow-md transition-colors duration-300 print:hidden w-full">
            
            <div className="w-full px-4 sm:px-6 lg:px-8">
                
                <div className="flex justify-between items-center h-16 w-full">
                    
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-xl sm:text-2xl tracking-wide flex items-center gap-2 whitespace-nowrap">
                            VotePulse
                        </Link>
                    </div>
                    
                    <div className="flex items-center gap-4 lg:gap-6">
                        
                        {estConnecte ? (
                            <nav className="hidden lg:flex items-center gap-2 lg:gap-4">
                                {isSuperAdmin ? (
                                    <Link to="/admin" className={getLinkStyle('/admin')}>Dashboard</Link>
                                ) : (
                                    <>
                                        <Link to="/" className={getLinkStyle('/')}>Accueil</Link>
                                        <Link to="/tous-les-sondages" className={getLinkStyle('/tous-les-sondages')}>Les sondages</Link>
                                        <Link to="/mes-sondages" className={getLinkStyle('/mes-sondages')}>Mes sondages</Link>
                                        <Link to="/creer" className={getLinkStyle('/creer')}>Créer</Link>
                                        <Link to="/profil" className={getLinkStyle('/profil')}>Profil</Link>
                                    </>
                                )}
                            </nav>
                        ) : (
                            <Link 
                                to="/login" 
                                className="flex items-center gap-2 px-5 py-2 bg-white text-[#3b82f6] hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 font-bold rounded-xl transition-all shadow-sm transform hover:-translate-y-0.5 whitespace-nowrap"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
                                </svg>
                                <span>Se connecter</span>
                            </Link>
                        )}

                        <div className="flex items-center gap-3">
                            
                            <button 
                                onClick={() => setIsDarkMode(!isDarkMode)} 
                                className="p-2 bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-full shadow transition-transform transform hover:scale-110 focus:outline-none flex-shrink-0"
                            >
                                {isDarkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                                )}
                            </button>
                             
                            {estConnecte && (
                                <button 
                                    onClick={handleLogout} 
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 text-white bg-red-500/80 hover:bg-red-600 rounded-lg transition-all focus:outline-none hover:-translate-y-0.5 font-medium flex-shrink-0 whitespace-nowrap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                    </svg>
                                    <span>Déconnexion</span>
                                </button>
                            )}

                            {estConnecte && (
                                <button 
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors focus:outline-none flex-shrink-0"
                                    aria-label="Menu principal"
                                >
                                    {isMobileMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[32rem] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                    <nav className="flex flex-col space-y-2 pt-3 border-t border-blue-400 dark:border-gray-700 mt-2">
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
                        
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-2 w-full text-left px-4 py-3 mt-2 text-white bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors font-bold"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            Se déconnecter
                        </button>
                    </nav>
                </div>

            </div>
        </header>
    );
}
