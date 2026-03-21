import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Accueil from './pages/accueil';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import ParticiperSondage from './pages/participerSondage';
import ResultatsSondage from './pages/resultatsSondage';
import Register from './pages/register';

// 🔥 Les pages de mot de passe
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const estConnecte = !!localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isSuperAdmin = user?.role === 'super_admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive ? 'bg-white text-primaire dark:bg-gray-800 dark:text-white' : 'text-white hover:bg-white/20 dark:hover:bg-gray-700'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-primaire dark:bg-carteSombre text-white p-4 shadow-md transition-colors duration-300 print:hidden">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo retiré, texte uniquement */}
          <Link to="/" className="font-bold text-2xl tracking-wide">
            Vote Sécurisé
          </Link>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {estConnecte ? (
              <nav className="flex items-center space-x-1 md:space-x-2 mr-2">
                {isSuperAdmin ? (
                  <Link to="/admin" className={getLinkStyle('/admin')}>Dashboard</Link>
                ) : (
                  <>
                    <Link to="/" className={getLinkStyle('/')}>Accueil</Link>
                    <Link to="/mes-sondages" className={getLinkStyle('/mes-sondages')}>Mes sondages</Link>
                    <Link to="/creer" className={getLinkStyle('/creer')}>Créer</Link>
                    <Link to="/profil" className={getLinkStyle('/profil')}>Profil</Link>
                  </>
                )}
              </nav>
            ) : (
              <Link to="/login" className="hover:text-secondaire transition-colors font-medium mr-4">Se connecter</Link>
            )}

            {/* 🌙/☀️ BOUTON THÈME EN SVG */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
              className="p-2 bg-secondaire hover:bg-emerald-600 text-white rounded-full shadow transition-transform transform hover:scale-110 focus:outline-none"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* 🚪 BOUTON DÉCONNEXION (Flèche pointant vers le texte) */}
            {estConnecte && (
              <button 
                onClick={handleLogout} 
                title="Se déconnecter"
                className="flex items-center gap-2 px-4 py-2 ml-1 text-white bg-red-500/20 hover:bg-red-500 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-400 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow bg-fond dark:bg-fondSombre transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mes-sondages" element={<Dashboard />} />
          <Route path="/creer" element={<Dashboard />} />
          <Route path="/profil" element={<Dashboard />} />
          <Route path="/admin" element={<Dashboard />} />
          
          <Route path="/sondage/:id" element={<ParticiperSondage />} />
          <Route path="/sondage/:id/resultats" element={<ResultatsSondage />} />
        </Routes>
      </main>

      <footer className="bg-primaire dark:bg-carteSombre text-white p-6 text-center mt-auto transition-colors duration-300 print:hidden">
        <p>© 2026 - Plateforme de Sondages Sécurisés</p>
      </footer>
    </div>
  );
}

export default App;