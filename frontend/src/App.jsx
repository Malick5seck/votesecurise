
// import { Routes, Route } from 'react-router-dom';

// // Importation de nos composants d'architecture (Ceux qui sont toujours visibles)
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// // Importation de toutes nos Pages (Le contenu dynamique qui change au milieu)
// import Accueil from './pages/accueil';
// import Login from './pages/login';
// import Dashboard from './pages/dashboard';
// import ParticiperSondage from './pages/participerSondage';
// import ResultatsSondage from './pages/resultatsSondage';
// import Register from './pages/register';
// import ForgotPassword from './pages/forgotPassword';
// import ResetPassword from './pages/resetPassword';

// function App() {
//   return (
//     // Conteneur principal qui prend au minimum 100% de la hauteur de l'écran (min-h-screen)
//     <div className="min-h-screen flex flex-col transition-colors duration-300">
      
//       {/* 1. LA BARRE DE NAVIGATION (Toujours en haut) */}
//       <Navbar />

//       {/* 2. LE CONTENU PRINCIPAL (Flex-grow permet de pousser le footer tout en bas) */}
//       <main className="flex-grow bg-fond dark:bg-fondSombre transition-colors duration-300">
        
//         {/* Le dictionnaire des URLs. Chaque <Route> relie une URL à un composant */}
//         <Routes>
//           {/* Pages Publiques */}
//           <Route path="/" element={<Accueil />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
          
//           {/* Pages de récupération de compte */}
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />

//           {/* Pages Protégées (Toutes redirigent vers le composant Dashboard pour le moment) */}
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/mes-sondages" element={<Dashboard />} />
//           <Route path="/creer" element={<Dashboard />} />
//           <Route path="/profil" element={<Dashboard />} />
//           <Route path="/admin" element={<Dashboard />} />
          
//           {/* Pages de Sondages Publics (Dynamiques selon l'ID du sondage) */}
//           <Route path="/sondage/:id" element={<ParticiperSondage />} />
//           <Route path="/sondage/:id/resultats" element={<ResultatsSondage />} />
//         </Routes>

//       </main>

//       {/* 3. LE PIED DE PAGE (Toujours en bas) */}
//       <Footer />
      
//     </div>
//   );
// }

// export default App;
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
        </Routes>
      </main>

      <Footer />
      
    </div>
  );
}

export default App;