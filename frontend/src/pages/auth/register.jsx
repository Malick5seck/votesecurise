import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    
    const [erreur, setErreur] = useState('');
    const [messageReussite, setMessageReussite] = useState(''); 
    const [chargement, setChargement] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        setMessageReussite(''); 
        
        if (password !== passwordConfirmation) {
            return setErreur('Les mots de passe ne correspondent pas.');
        }

        setChargement(true);

        try {
            const reponse = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            setName('');
            setEmail('');
            setPassword('');
            setPasswordConfirmation('');

            localStorage.setItem('token', reponse.data.token);
            localStorage.setItem('user', JSON.stringify(reponse.data.user));

            setMessageReussite('Compte créé avec succès ! ');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
            
        } catch (err) {
            setChargement(false); 
            setErreur(err.response?.data?.message || "Erreur lors de l'inscription. L'email est peut-être déjà utilisé.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-fondSombre py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
           
            <div className="max-w-md w-full bg-white dark:bg-carteSombre p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 animate-fade-in">
                
                <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#3b82f6] dark:text-blue-400 mb-4 sm:mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Créer un compte
                    </h2>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Rejoignez-nous pour créer et participer à des sondages 100% sécurisés.
                    </p>
                </div>

                {messageReussite && (
                    <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 p-3 sm:p-4 mb-6 sm:mb-8 rounded-r-lg text-sm font-medium animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM16.28 8.22a.75.75 0 00-1.06 0l-5.47 5.47-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6-6a.75.75 0 000-1.06z" clipRule="evenodd" />
                        </svg>
                        <p>{messageReussite}</p>
                    </div>
                )}

                {erreur && !messageReussite && (
                    <div className="flex items-start sm:items-center gap-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 sm:p-4 mb-6 sm:mb-8 rounded-r-lg text-sm font-medium animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-0">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                        <p>{erreur}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" autoComplete="off">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Nom complet</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                            disabled={messageReussite !== ''} 
                            className="w-full p-3 sm:p-3.5 rounded-xl bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all text-sm disabled:opacity-50"
                            placeholder="Ex: Malick Seck"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Adresse Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            disabled={messageReussite !== ''}
                            className="w-full p-3 sm:p-3.5 rounded-xl bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all text-sm disabled:opacity-50"
                            placeholder="malick@exemple.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Mot de passe</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            disabled={messageReussite !== ''}
                            className="w-full p-3 sm:p-3.5 rounded-xl bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all text-sm tracking-widest disabled:opacity-50"
                            placeholder="••••••••"
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
                            autoComplete="new-password"
                            disabled={messageReussite !== ''}
                            className="w-full p-3 sm:p-3.5 rounded-xl bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all text-sm tracking-widest disabled:opacity-50"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-2 sm:pt-3">
                        <button
                            type="submit"
                            disabled={chargement || messageReussite !== ''}
                            className="w-full bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none text-sm sm:text-base"
                        >
                            {chargement ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Création en cours...
                                </span>
                            ) : messageReussite ? (
                                "Succès !"
                            ) : (
                                "S'inscrire"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 sm:mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6 sm:pt-8">
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/login" className="text-[#3b82f6] dark:text-blue-400 font-bold hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                            Se connecter
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
