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

    const handleLogin = async (e) => {
        e.preventDefault();
        setErreur('');
        setSucces('');
        try {
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', { 
                withCredentials: true 
            });
            
            const reponse = await api.post('/login', { email, password });
            
            localStorage.setItem('token', reponse.data.token);
            localStorage.setItem('user', JSON.stringify(reponse.data.user));
            setSucces('Connexion réussie ! Redirection en cours...');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
            
        } catch (err) {
            console.error("Détail de l'erreur :", err.response || err);
            setErreur(err.response?.data?.message || 'Identifiants incorrects ou problème de connexion.');
        }
    };

    return (
        <div className="flex justify-center items-center py-20 transition-colors duration-300">
            <div className="bg-white dark:bg-carteSombre p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-center text-primaire dark:text-white">Connexion</h2>
                
                {erreur && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{erreur}</div>}
                {succes && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{succes}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Adresse Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-gray-50 dark:bg-fondSombre text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-secondaire dark:focus:border-secondaire"
                            required 
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold">Mot de passe</label>
                            {/* 🔥 NOUVEAU : Le lien "Mot de passe oublié" */}
                            <Link to="/forgot-password" className="text-sm font-bold text-[#3b82f6] hover:underline">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-gray-50 dark:bg-fondSombre text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-secondaire dark:focus:border-secondaire"
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-primaire hover:bg-blue-800 dark:bg-secondaire dark:hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded transition-colors"
                    >
                        Se connecter
                    </button>
                    
                </form>
                
                <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Vous n'avez pas encore de compte ?{' '}
                        <Link to="/register" className="text-primaire hover:text-blue-800 dark:text-secondaire dark:hover:text-emerald-400 font-bold hover:underline">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}