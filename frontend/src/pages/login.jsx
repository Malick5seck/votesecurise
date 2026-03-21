import { useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erreur, setErreur] = useState('');
    const [succes, setSucces] = useState('');
    const [chargement, setChargement] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErreur('');
        setSucces('');
        setChargement(true);
        
        try {
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', { 
                withCredentials: true 
            });
            
            const reponse = await api.post('/login', { email, password });
            
            localStorage.setItem('token', reponse.data.token);
            localStorage.setItem('user', JSON.stringify(reponse.data.user));
            setSucces('Connexion réussie ! Redirection en cours...');

            // 🔥 SÉCURITÉ : On vide les variables du State pour la prochaine visite
            setEmail('');
            setPassword('');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
            
        } catch (err) {
            console.error("Détail de l'erreur :", err.response || err);
            setErreur(err.response?.data?.message || 'Identifiants incorrects ou problème de connexion.');
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-fondSombre py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-carteSombre p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 animate-fade-in">
                
                {/* EN-TÊTE DU FORMULAIRE */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#3b82f6] dark:text-blue-400 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Connexion
                    </h2>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        Connectez-vous pour gérer vos sondages et analyser vos résultats.
                    </p>
                </div>
                
                {/* MESSAGE D'ERREUR */}
                {erreur && (
                    <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-8 rounded-r-lg text-sm font-medium animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                        <p>{erreur}</p>
                    </div>
                )}

                {/* MESSAGE DE SUCCÈS */}
                {succes && (
                    <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 p-4 mb-8 rounded-r-lg text-sm font-medium animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <p>{succes}</p>
                    </div>
                )}

                {/* 🔥 SÉCURITÉ : On demande au formulaire de bloquer l'autofill global */}
                <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Adresse Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // 🔥 SÉCURITÉ : Blocage de la suggestion d'emails
                            autoComplete="off"
                            className="w-full p-3.5 rounded-xl bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all text-sm"
                            placeholder="jean@exemple.com"
                            required 
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Mot de passe</label>
                            <Link to="/forgot-password" className="text-sm font-bold text-[#3b82f6] hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // 🔥 SÉCURITÉ : Force le navigateur à ne pas remplir de mot de passe existant
                            autoComplete="new-password"
                            className="w-full p-3.5 rounded-xl bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all text-sm tracking-widest"
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                    
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={chargement || succes !== ''}
                            className="w-full bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                        >
                            {chargement ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Connexion...
                                </span>
                            ) : succes ? (
                                "Redirection..."
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </div>
                </form>
                
                {/* LIEN VERS L'INSCRIPTION */}
                <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-8">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Vous n'avez pas encore de compte ?{' '}
                        <Link to="/register" className="text-[#3b82f6] dark:text-blue-400 font-bold hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}