import { Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Accueil from './pages/accueil';

// 🔒 CORRECTION POINT 3 : Mise en minuscules des chemins pour correspondre aux vrais fichiers
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgotPassword';
import ResetPassword from './pages/auth/resetPassword';

import Dashboard from './pages/dashboard/dashboard';
import HistoriqueUtilisateur from './pages/dashboard/HistoriqueUtilisateur';

// 🔒 CORRECTION POINT 3 : Mise en minuscules des chemins
import ParticiperSondage from './pages/sondage/participerSondage';
import ResultatsSondage from './pages/sondage/resultatsSondage';

function App() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      
      <Navbar />
      
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
          <Route path="/tous-les-sondages" element={<Dashboard />} />
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