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
  
  // Outils de navigation
  const navigate = useNavigate();
  const location = useLocation(); // Permet de rafraîchir la navbar au changement de page

  // On vérifie si un token est présent dans le navigateur
  const estConnecte = !!localStorage.getItem('token');

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token'); // On supprime la clé de sécurité
    navigate('/'); // On renvoie vers l'accueil
  };

  // Gestion du mode sombre
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      
      {/* --- NAVBAR FIXÉE EN HAUT (Sticky) --- */}
      <header className="sticky top-0 z-50 bg-primaire dark:bg-carteSombre text-white p-4 shadow-md transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl tracking-wide">Vote Sécurisé</Link>
          
          <div className="flex items-center space-x-6">
            
            {/* AFFICHAGE DYNAMIQUE SELON L'ÉTAT DE CONNEXION */}
            {estConnecte ? (
              <>
                <Link to="/dashboard" className="hover:text-secondaire transition-colors font-medium">
                  Tableau de bord
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="hover:text-red-400 transition-colors font-medium"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-secondaire transition-colors font-medium">
                Se connecter
              </Link>
            )}

            {/* Bouton Mode Sombre */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-secondaire hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded shadow transition-colors ml-4"
            >
              {isDarkMode ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTENU DYNAMIQUE --- */}
      <main className="flex-grow bg-fond dark:bg-fondSombre transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sondage/:id" element={<ParticiperSondage />} />
          <Route path="/sondage/:id/resultats" element={<ResultatsSondage />} />
        </Routes>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-primaire dark:bg-carteSombre text-white p-6 text-center mt-auto transition-colors duration-300">
        <p>© 2026 - Plateforme de Sondages Sécurisés</p>
      </footer>

    </div>
  );
}

export default App;