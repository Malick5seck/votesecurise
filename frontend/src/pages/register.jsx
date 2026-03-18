import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        
        if (password !== passwordConfirmation) {
            return setErreur('Les mots de passe ne correspondent pas.');
        }

        setChargement(true);

        try {
            // On envoie les données à l'API Laravel
            await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            // Si ça marche, on redirige vers la page de connexion avec un petit message de succès (optionnel)
            alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
            navigate('/login');
            
        } catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de l'inscription. L'email est peut-être déjà utilisé.");
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-fondSombre py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-carteSombre p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-primaire dark:text-white">
                        Créer un compte
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Rejoignez-nous pour créer et participer aux sondages.
                    </p>
                </div>

                {erreur && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        <p>{erreur}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded bg-gray-50 dark:bg-fondSombre border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:ring-secondaire focus:outline-none dark:text-white"
                            placeholder="Jean Dupont"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-gray-50 dark:bg-fondSombre border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:ring-secondaire focus:outline-none dark:text-white"
                            placeholder="jean@exemple.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-gray-50 dark:bg-fondSombre border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:ring-secondaire focus:outline-none dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            required
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full p-3 rounded bg-gray-50 dark:bg-fondSombre border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:ring-secondaire focus:outline-none dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={chargement}
                        className="w-full bg-primaire hover:bg-blue-800 dark:bg-secondaire dark:hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
                    >
                        {chargement ? 'Création en cours...' : 'S\'inscrire'}
                    </button>
                </form>

                {/* LE LIEN VERS LA CONNEXION */}
                <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        Avez-vous déjà un compte ?{' '}
                        <Link to="/login" className="text-primaire hover:text-blue-800 dark:text-secondaire dark:hover:text-emerald-400 font-bold hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}