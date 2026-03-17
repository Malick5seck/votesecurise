import { useState } from 'react';
import api from '../api/axios';

// La liste officielle de nos 7 types de questions
const TYPES_QUESTIONS = [
    { id: 'qcm', label: '🔘 QCM (une seule réponse)' },
    { id: 'checkbox', label: '☑️ Cases à cocher (plusieurs réponses)' },
    { id: 'text', label: '📝 Texte libre (court ou long)' },
    { id: 'rating', label: '⭐ Note (1 à 5 ou 1 à 10)' },
    { id: 'ranking', label: '↕️ Classement par glisser-déposer' },
    { id: 'matrix', label: '📊 Tableau de questions (matrice)' },
    { id: 'conditional', label: '🔀 Question conditionnelle' }
];

export default function CreerSondage({ onSondageCree }) {
    // --- 1. CONFIGURATION DU SONDAGE ---
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [estAnonyme, setEstAnonyme] = useState(true);
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [messageRemerciement, setMessageRemerciement] = useState('Merci pour votre participation !');

    // --- 2. LE CONSTRUCTEUR DE QUESTIONS ---
    const [questions, setQuestions] = useState([
        { id: Date.now(), titre: '', type: 'qcm', options: ['', ''], obligatoire: true }
    ]);

    const [erreur, setErreur] = useState('');
    const [succes, setSucces] = useState('');
    const [chargement, setChargement] = useState(false);

    // --- LOGIQUE DE GESTION DES QUESTIONS ---
    const ajouterQuestion = () => {
        setQuestions([
            ...questions, 
            { id: Date.now(), titre: '', type: 'qcm', options: ['', ''], obligatoire: true }
        ]);
    };

    const supprimerQuestion = (id) => {
        if (questions.length > 1) {
            setQuestions(questions.filter(q => q.id !== id));
        }
    };

    const mettreAJourQuestion = (id, champ, valeur) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [champ]: valeur } : q));
    };

    const mettreAJourOption = (questionId, indexOption, valeur) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const nouvellesOptions = [...q.options];
                nouvellesOptions[indexOption] = valeur;
                return { ...q, options: nouvellesOptions };
            }
            return q;
        }));
    };

    const ajouterOption = (questionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) return { ...q, options: [...q.options, ''] };
            return q;
        }));
    };

    const supprimerOption = (questionId, indexOption) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId && q.options.length > 2) {
                return { ...q, options: q.options.filter((_, i) => i !== indexOption) };
            }
            return q;
        }));
    };

    // --- SOUMISSION VERS LARAVEL ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        setSucces('');

        // Petite vérification côté frontend
        if (questions.length === 0) {
            setErreur('Votre sondage doit contenir au moins une question.');
            return;
        }

        setChargement(true);

        try {
            // Préparation du payload avec la nouvelle structure complexe
            const payload = {
                titre,
                description,
                est_anonyme: estAnonyme,
                date_debut: dateDebut || null,
                date_fin: dateFin || null,
                message_remerciement: messageRemerciement,
                questions: questions
            };

            // Envoi à l'API
            await api.post('/sondages', payload);

            // Succès !
            setSucces('Le sondage a été créé avec succès !');
            
            // Réinitialisation du formulaire
            setTitre(''); 
            setDescription(''); 
            setDateDebut(''); 
            setDateFin('');
            setQuestions([{ id: Date.now(), titre: '', type: 'qcm', options: ['', ''], obligatoire: true }]);

            // Fermeture du formulaire dans le Dashboard après un court délai
            if (onSondageCree) {
                setTimeout(() => onSondageCree(), 1500);
            }

        } catch (err) {
            setErreur(err.response?.data?.message || 'Erreur lors de la création du sondage. Vérifiez votre connexion.');
            console.error(err);
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="bg-white dark:bg-carteSombre rounded-lg transition-colors duration-300">
            {erreur && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert"><p>{erreur}</p></div>}
            {succes && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert"><p>{succes}</p></div>}
            
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* --- BLOC 1 : CONFIGURATION GLOBALE --- */}
                <div className="bg-gray-50 dark:bg-fondSombre p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-bold mb-4 text-primaire dark:text-secondaire border-b pb-2">1. Configuration du Sondage</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Titre du sondage</label>
                            <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} className="w-full p-3 rounded bg-white dark:bg-carteSombre text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:outline-none" placeholder="Ex: Enquête de satisfaction" required />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Message de remerciement</label>
                            <input type="text" value={messageRemerciement} onChange={(e) => setMessageRemerciement(e.target.value)} className="w-full p-3 rounded bg-white dark:bg-carteSombre text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:outline-none" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Date de début (Auto)</label>
                                <input type="datetime-local" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className="w-full p-3 rounded bg-white dark:bg-carteSombre text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Date de fin (Auto)</label>
                                <input type="datetime-local" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="w-full p-3 rounded bg-white dark:bg-carteSombre text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:outline-none" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={estAnonyme} onChange={(e) => setEstAnonyme(e.target.checked)} className="w-5 h-5 text-secondaire rounded focus:ring-secondaire" />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Mode Anonyme (Cacher l'identité des votants)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* --- BLOC 2 : CONSTRUCTEUR DE QUESTIONS --- */}
                <div className="space-y-6">
                    <h4 className="text-lg font-bold text-primaire dark:text-secondaire border-b pb-2">2. Vos Questions</h4>

                    {questions.map((question, index) => (
                        <div key={question.id} className="p-6 border-l-4 border-secondaire bg-gray-50 dark:bg-fondSombre rounded-r-lg shadow-sm relative">
                            
                            {/* Bouton de suppression */}
                            {questions.length > 1 && (
                                <button type="button" onClick={() => supprimerQuestion(question.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold">
                                    Supprimer la question
                                </button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Question {index + 1}</label>
                                    <input type="text" value={question.titre} onChange={(e) => mettreAJourQuestion(question.id, 'titre', e.target.value)} className="w-full p-3 rounded bg-white dark:bg-carteSombre text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:outline-none" placeholder="Saisissez votre question ici" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Type de question</label>
                                    <select value={question.type} onChange={(e) => mettreAJourQuestion(question.id, 'type', e.target.value)} className="w-full p-3 rounded bg-white dark:bg-carteSombre text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:outline-none">
                                        {TYPES_QUESTIONS.map(type => (
                                            <option key={type.id} value={type.id}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Options pour QCM, Checkbox, et Ranking */}
                            {['qcm', 'checkbox', 'ranking'].includes(question.type) && (
                                <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Options de réponse :</p>
                                    {question.options.map((opt, i) => (
                                        <div key={i} className="flex items-center space-x-2 mb-2">
                                            <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                                            <input type="text" value={opt} onChange={(e) => mettreAJourOption(question.id, i, e.target.value)} className="flex-grow p-2 rounded bg-white dark:bg-carteSombre text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-secondaire focus:outline-none" placeholder={`Option ${i + 1}`} required />
                                            {question.options.length > 2 && (
                                                <button type="button" onClick={() => supprimerOption(question.id, i)} className="text-red-500 px-2 font-bold">X</button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => ajouterOption(question.id)} className="text-sm font-bold text-secondaire hover:text-emerald-600 mt-2">
                                        + Ajouter une option
                                    </button>
                                </div>
                            )}

                            {question.type === 'text' && (
                                <div className="mt-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center text-gray-500">
                                    L'utilisateur verra un champ de texte libre ici.
                                </div>
                            )}

                            {question.type === 'rating' && (
                                <div className="mt-4 flex space-x-2 text-2xl text-gray-300">
                                    ⭐ ⭐ ⭐ ⭐ ⭐
                                </div>
                            )}
                            
                            {['matrix', 'conditional'].includes(question.type) && (
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 text-primaire dark:text-blue-200 rounded text-sm">
                                    ⚙️ Interface de configuration avancée en cours de construction pour ce type.
                                </div>
                            )}

                        </div>
                    ))}

                    <button type="button" onClick={ajouterQuestion} className="w-full py-4 border-2 border-dashed border-secondaire text-secondaire font-bold rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                        + AJOUTER UNE NOUVELLE QUESTION
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={chargement}
                    className="w-full bg-primaire hover:bg-blue-800 dark:bg-secondaire dark:hover:bg-emerald-600 text-white font-bold py-4 px-4 rounded shadow-lg transition-colors text-lg disabled:opacity-50"
                >
                    {chargement ? 'Enregistrement en cours...' : 'Enregistrer le sondage'}
                </button>
            </form>
        </div>
    );
}