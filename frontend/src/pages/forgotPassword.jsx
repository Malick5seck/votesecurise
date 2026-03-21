import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur(''); setMessage(''); setChargement(true);

        if (!email.endsWith('@gmail.com')) {
            setChargement(false);
            return setErreur("Veuillez utiliser une adresse @gmail.com valide.");
        }

        try {
            const reponse = await api.post('/forgot-password', { email });
            setMessage(reponse.data.message);
            // Pour tester sans serveur mail, tu peux afficher reponse.data.debug_token dans un console.log()
        } catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de la demande.");
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-fondSombre py-12 px-4">
            <div className="max-w-md w-full bg-white dark:bg-carteSombre p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-extrabold text-primaire dark:text-white text-center mb-6">Mot de passe oublié ?</h2>
                
                {erreur && <div className="bg-red-100 text-red-700 p-4 mb-6 rounded font-bold">{erreur}</div>}
                {message && <div className="bg-green-100 text-green-700 p-4 mb-6 rounded font-bold">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Adresse Email (@gmail.com)</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-fondSombre border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="votre.email@gmail.com" />
                    </div>
                    <button type="submit" disabled={chargement} className="w-full bg-[#3b82f6] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {chargement ? 'Envoi en cours...' : 'Envoyer le lien'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">Retour à la connexion</Link>
                </div>
            </div>
        </div>
    );
}