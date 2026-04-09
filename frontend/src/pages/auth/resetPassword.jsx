import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    
    const token = searchParams.get('token'); 
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [erreur, setErreur] = useState('');
    const [message, setMessage] = useState('');
    const [succesReset, setSuccesReset] = useState(false);
    const [chargement, setChargement] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        
        if (password !== passwordConfirmation) {
            return setErreur("Les mots de passe ne correspondent pas.");
        }

        setChargement(true);

        try {
            const reponse = await api.post('/reset-password', {
                email, token, password, password_confirmation: passwordConfirmation
            });
            
            setMessage(reponse.data.message);
            setSuccesReset(true);
            
        } catch (err) {
            setErreur(err.response?.data?.message || "Le lien est invalide ou a expiré.");
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-fondSombre py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            
            <div className="max-w-md w-full bg-white dark:bg-carteSombre p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 animate-slide-up relative overflow-hidden">
                
                <div className="text-center mb-8">
                    {succesReset ? (
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400 mb-4 sm:mb-6 animate-fade-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                    ) : (
                        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#3b82f6] dark:text-blue-400 mb-4 sm:mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                    )}
                    
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-all">
                        {succesReset ? "Mot de passe modifié !" : "Nouveau mot de passe"}
                    </h2>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed transition-all">
                        {succesReset 
                            ? (message || "Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.")
                            : "Choisissez un mot de passe robuste pour sécuriser votre compte."}
                    </p>
                </div>

                {succesReset ? (
                    <div className="pt-2 sm:pt-4 animate-fade-in">
                        <Link to="/login" className="w-full inline-flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 text-base sm:text-lg">
                            Retour à la connexion
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                            </svg>
                        </Link>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {erreur && (
                            <div className="flex items-start sm:items-center gap-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 sm:p-4 mb-6 sm:mb-8 rounded-r-lg text-sm font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-0">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                </svg>
                                <p>{erreur}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <input type="hidden" value={email || ''} />
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Nouveau mot de passe</label>
                                <input 
                                    type="password" 
                                    required 
                                    minLength={8} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Min. 8 caractères"
                                    className="w-full p-3 sm:p-3.5 rounded-xl bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all text-sm tracking-widest" 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Confirmer le mot de passe</label>
                                <input 
                                    type="password" 
                                    required 
                                    minLength={8} 
                                    value={passwordConfirmation} 
                                    onChange={(e) => setPasswordConfirmation(e.target.value)} 
                                    placeholder="Retaper le mot de passe"
                                    className="w-full p-3 sm:p-3.5 rounded-xl bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all text-sm tracking-widest" 
                                />
                            </div>
                            
                            <div className="pt-2 sm:pt-3">
                                <button 
                                    type="submit" 
                                    disabled={chargement}
                                    className="w-full bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none text-sm sm:text-base"
                                >
                                    {chargement ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Mise à jour...
                                        </span>
                                    ) : (
                                        "Enregistrer le mot de passe"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}