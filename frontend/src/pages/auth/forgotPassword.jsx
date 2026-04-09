
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur(''); 
        setMessage(''); 
        setChargement(true);

        try {
            const reponse = await api.post('/forgot-password', { email });
            setMessage(reponse.data.message);
            
            if (reponse.data.debug_token) {
                console.log("Token de réinitialisation :", reponse.data.debug_token);
            }
        } catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de la demande.");
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-fondSombre py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
           
            <div className="max-w-md w-full bg-white dark:bg-carteSombre p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 animate-fade-in">
                
                <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#3b82f6] dark:text-blue-400 mb-4 sm:mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Mot de passe oublié ?
                    </h2>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Entrez votre adresse email, nous vous enverrons un lien sécurisé pour le réinitialiser.
                    </p>
                </div>
                
                {erreur && (
                    <div className="flex items-start sm:items-center gap-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 sm:p-4 mb-6 sm:mb-8 rounded-r-lg text-sm font-medium animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-0"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
                        <p>{erreur}</p>
                    </div>
                )}

                {message && (
                    <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 p-3 sm:p-4 mb-6 sm:mb-8 rounded-r-lg text-sm font-medium animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                        <p>{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Adresse Email</label>
                        <input 
                            type="email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full p-3 sm:p-3.5 rounded-xl bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all text-sm" 
                            placeholder="malick@exemple.com" 
                            disabled={message !== '' || chargement}
                        />
                    </div>
                    <div className="pt-2 sm:pt-3">
                        <button 
                            type="submit" 
                            disabled={chargement || message !== ''} 
                            className="w-full bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none text-sm sm:text-base"
                        >
                            {chargement ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Envoi en cours...
                                </span>
                            ) : message ? (
                                "Lien envoyé"
                            ) : (
                                "Envoyer le lien"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 sm:mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6 sm:pt-8">
                    <Link to="/login" className="inline-flex items-center gap-2 text-[#3b82f6] dark:text-blue-400 font-bold hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-xs sm:text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        Retour à la connexion
                    </Link>
                </div>

            </div>
        </div>
    );
}
