import { useState } from 'react';
import api from '../api/axios';

export default function CreerSondage({ onSondageCree }) {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [estPublic, setEstPublic] = useState(true); 

    const [questions, setQuestions] = useState([
        { id: Date.now(), titre: '', type: 'qcm', obligatoire: true, options: ['', ''] }
    ]);

    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');

    const ajouterQuestion = () => setQuestions([...questions, { id: Date.now(), titre: '', type: 'qcm', obligatoire: true, options: ['', ''] }]);
    const supprimerQuestion = (id) => setQuestions(questions.filter(q => q.id !== id));
    const mettreAJourQuestion = (id, champ, valeur) => setQuestions(questions.map(q => q.id === id ? { ...q, [champ]: valeur } : q));
    const ajouterOption = (questionId) => setQuestions(questions.map(q => q.id === questionId ? { ...q, options: [...q.options, ''] } : q));
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

    // Liste des types de questions qui nécessitent que le créateur tape des choix (options)
    const typesAvecOptions = ['qcm', 'checkbox', 'likert', 'boolean', 'ranking', 'matrix'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        setChargement(true);
        try {
            await api.post('/sondages', {
                titre, description, date_fin: dateFin || null, est_prive: !estPublic, est_anonyme: false,
                questions: questions.map(q => ({
                    titre: q.titre, type: q.type, obligatoire: q.obligatoire,
                    // On envoie les options uniquement si le type de question le requiert
                    options: typesAvecOptions.includes(q.type) ? q.options.filter(opt => opt.trim() !== '') : []
                }))
            });
            if (onSondageCree) onSondageCree();
        } catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de la création.");
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 text-gray-800 dark:text-gray-200">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Créer un sondage</h2>
                <p className="text-gray-500 text-sm">Configurez votre sondage et ajoutez vos questions</p>
            </div>

            {erreur && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">{erreur}</div>}

            <form onSubmit={handleSubmit}>
                {/* BLOC 1 : INFOS */}
                <div className="bg-white dark:bg-carteSombre p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
                    <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2">Titre *</label>
                        <input type="text" required value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex: Enquête de satisfaction" className="w-full p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre sondage..." className="w-full p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"></textarea>
                    </div>
                    <div className="flex items-center gap-8">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Date d'expiration</label>
                            <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="w-48 p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-500" />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={estPublic} onChange={(e) => setEstPublic(e.target.checked)} />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                <span className="ml-3 text-sm font-medium">Sondage public</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* BLOC 2 : QUESTIONS */}
                <h3 className="text-xl font-bold mb-4">Questions</h3>
                <div className="space-y-4 mb-4">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-white dark:bg-carteSombre p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="text-gray-300 flex flex-col gap-0.5 cursor-grab">
                                    <div className="flex gap-0.5"><div className="w-1 h-1 bg-gray-300 rounded-full"></div><div className="w-1 h-1 bg-gray-300 rounded-full"></div></div>
                                    <div className="flex gap-0.5"><div className="w-1 h-1 bg-gray-300 rounded-full"></div><div className="w-1 h-1 bg-gray-300 rounded-full"></div></div>
                                    <div className="flex gap-0.5"><div className="w-1 h-1 bg-gray-300 rounded-full"></div><div className="w-1 h-1 bg-gray-300 rounded-full"></div></div>
                                </div>
                                <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                                <input type="text" required value={q.titre} onChange={(e) => mettreAJourQuestion(q.id, 'titre', e.target.value)} placeholder="Texte de la question..." className="flex-grow p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                
                                {/* LE NOUVEAU MENU DÉROULANT COMPLET */}
                                <select 
                                    value={q.type} onChange={(e) => mettreAJourQuestion(q.id, 'type', e.target.value)}
                                    className="w-48 p-2.5 bg-white dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                >
                                    <optgroup label="Choix">
                                        <option value="qcm">Choix unique</option>
                                        <option value="checkbox">Choix multiples</option>
                                        <option value="boolean">Dichotomique (Oui/Non)</option>
                                    </optgroup>
                                    <optgroup label="Saisie libre">
                                        <option value="text">Texte libre</option>
                                        <option value="number">Numérique</option>
                                        <option value="date">Date / Heure</option>
                                    </optgroup>
                                    <optgroup label="Échelles & Mesures">
                                        <option value="rating">Note (Étoiles)</option>
                                        <option value="likert">Échelle de Likert</option>
                                        <option value="slider">Curseur (Slider)</option>
                                    </optgroup>
                                    <optgroup label="Avancé">
                                        <option value="ranking">Classement (Ranking)</option>
                                        <option value="matrix">Matrice (Grille)</option>
                                        <option value="condition">Conditionnelle</option>
                                    </optgroup>
                                </select>

                                {questions.length > 1 && (
                                    <button type="button" onClick={() => supprimerQuestion(q.id)} className="text-red-400 hover:text-red-600 transition-colors px-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                    </button>
                                )}
                            </div>

                            {/* AFFICHAGE CONDITIONNEL DES OPTIONS */}
                            {typesAvecOptions.includes(q.type) && (
                                <div className="ml-9 space-y-3">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                            <input 
                                                type="text" value={opt} onChange={(e) => mettreAJourOption(q.id, oIndex, e.target.value)}
                                                placeholder={q.type === 'boolean' && oIndex === 0 ? "Ex: Oui" : q.type === 'boolean' && oIndex === 1 ? "Ex: Non" : `Option ${oIndex + 1}`}
                                                className="w-full max-w-2xl p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => ajouterOption(q.id)} className="text-[#3b82f6] hover:text-blue-700 text-sm font-medium mt-1 flex items-center gap-1">
                                        + Ajouter une option
                                    </button>
                                </div>
                            )}

                            {/* PETITS MESSAGES D'AIDE POUR LES NOUVEAUX TYPES */}
                            {!typesAvecOptions.includes(q.type) && (
                                <div className="ml-9 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                                    Le champ de saisie apparaîtra automatiquement pour le votant.
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button type="button" onClick={ajouterQuestion} className="w-full py-3.5 mb-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                    + Ajouter une question
                </button>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" onClick={() => { if(onSondageCree) onSondageCree(); }} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">Annuler</button>
                    <button type="submit" disabled={chargement} className="px-6 py-2.5 bg-[#3b82f6] hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50">{chargement ? 'Création...' : 'Créer le sondage'}</button>
                </div>
            </form>
        </div>
    );
}