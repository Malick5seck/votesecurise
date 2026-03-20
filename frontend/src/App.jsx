import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Accueil from './pages/accueil';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import ParticiperSondage from './pages/participerSondage';
import ResultatsSondage from './pages/resultatsSondage';
import Register from './pages/register';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const estConnecte = !!localStorage.getItem('token');
  
  // 🔥 Récupérer l'utilisateur pour vérifier son rôle
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isSuperAdmin = user?.role === 'super_admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
        ? 'bg-white text-primaire dark:bg-gray-800 dark:text-white'
        : 'text-white hover:bg-white/20 dark:hover:bg-gray-700'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-primaire dark:bg-carteSombre text-white p-4 shadow-md transition-colors duration-300 print:hidden">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl tracking-wide">Vote Sécurisé</Link>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {estConnecte ? (
              <nav className="flex items-center space-x-1 md:space-x-2 mr-4">
                
                {/* 🚨 SÉPARATION DES MENUS SELON LE RÔLE */}
                {isSuperAdmin ? (
                  // MENU EXCLUSIF SUPER ADMIN
                  <Link to="/admin" className={getLinkStyle('/admin')}>
                    ⚙️ Panneau de Contrôle
                  </Link>
                ) : (
                  // MENU STANDARD UTILISATEUR
                  <>
                    <Link to="/" className={getLinkStyle('/')}>Accueil</Link>
                    <Link to="/mes-sondages" className={getLinkStyle('/mes-sondages')}>Mes sondages</Link>
                    <Link to="/creer" className={getLinkStyle('/creer')}>Créer</Link>
                    <Link to="/profil" className={getLinkStyle('/profil')}>Profil</Link>
                  </>
                )}

                {/* BOUTON DÉCONNEXION (COMMUN À TOUS) */}
                <button onClick={handleLogout} className="px-4 py-2 hover:bg-red-500/80 rounded-lg transition-colors font-medium ml-2">
                  Déconnexion
                </button>
              </nav>
            ) : (
              <Link to="/login" className="hover:text-secondaire transition-colors font-medium mr-4">
                Se connecter
              </Link>
            )}

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-secondaire hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded shadow transition-colors"
            >
              {isDarkMode ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
            </button>
          </div>
        </div>
      </header>

      {/* ROUTES */}
      <main className="flex-grow bg-fond dark:bg-fondSombre transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mes-sondages" element={<Dashboard />} />
          <Route path="/creer" element={<Dashboard />} />
          <Route path="/profil" element={<Dashboard />} />
          
          {/* Route vers l'administration */}
          <Route path="/admin" element={<Dashboard />} />
          
          <Route path="/sondage/:id" element={<ParticiperSondage />} />
          <Route path="/sondage/:id/resultats" element={<ResultatsSondage />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="bg-primaire dark:bg-carteSombre text-white p-6 text-center mt-auto transition-colors duration-300 print:hidden">
        <p>© 2026 - Plateforme de Sondages Sécurisés</p>
      </footer>

    </div>
  );
}

export default App;