import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HistoriqueUtilisateur from './pages/HistoriqueUtilisateur';

// Pages
import Accueil from './pages/accueil';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import ParticiperSondage from './pages/participerSondage';
import ResultatsSondage from './pages/resultatsSondage';
import Register from './pages/register';
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword';

function App() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      
      <Navbar />

      {/* Le main retrouve son comportement instantané */}
      <main className="flex-grow bg-fond dark:bg-fondSombre transition-colors duration-300 overflow-x-hidden">
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
          <Route path="/admin/utilisateurs/:id" element={<HistoriqueUtilisateur />} />
        </Routes>
      </main>

      <Footer />
      
    </div>
  );
}

export default App;