import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    
    const token = searchParams.get('token'); 
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [erreur, setErreur] = useState('');
    const [message, setMessage] = useState('');
    const [succesReset, setSuccesReset] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        
        if (password !== passwordConfirmation) {
            return setErreur("Les mots de passe ne correspondent pas.");
        }

        try {
            const reponse = await api.post('/reset-password', {
                email, token, password, password_confirmation: passwordConfirmation
            });
            
            setMessage(reponse.data.message);
            setSuccesReset(true); // On affiche juste la carte de succès
            
        } catch (err) {
            setErreur(err.response?.data?.message || "Le lien est invalide ou a expiré.");
        }
    };

    // 🔥 L'écran de succès pur et dur, avec juste le bouton manuel
    if (succesReset) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-fondSombre py-12 px-4 transition-colors duration-300">
                <div className="max-w-md w-full bg-white dark:bg-carteSombre p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center animate-fade-in">
                    <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 text-4xl">✅</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mot de passe modifié !</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
                    
                    <Link to="/login" className="w-full inline-block bg-[#3b82f6] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                        Aller à la page de connexion
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-fondSombre py-12 px-4 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-carteSombre p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-extrabold text-primaire dark:text-white text-center mb-6">Nouveau mot de passe</h2>
                {erreur && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded font-bold text-sm">{erreur}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" value={email || ''} />
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nouveau mot de passe</label>
                        <input 
                            type="password" required minLength={8} 
                            value={password} onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Min. 8 caractères"
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-fondSombre border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3b82f6] outline-none dark:text-white transition-colors" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirmer le mot de passe</label>
                        <input 
                            type="password" required minLength={8} 
                            value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} 
                            placeholder="Retaper le mot de passe"
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-fondSombre border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#3b82f6] outline-none dark:text-white transition-colors" 
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#3b82f6] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                        Enregistrer
                    </button>
                </form>
            </div>
        </div>
    );
}