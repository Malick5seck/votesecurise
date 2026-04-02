import { useState } from 'react'; 
import api from '../../api/axios';
import EditeurQuestion from './EditeurQuestion';

const TYPES_AVEC_OPTIONS = ['qcm', 'checkbox', 'likert', 'boolean', 'ranking', 'matrix'];

export default function CreerSondage({ onSondageCree }) {
  
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [estPublic, setEstPublic] = useState(true); 
    const [estAnonyme, setEstAnonyme] = useState(false); 
    
    const [domaineRestreint, setDomaineRestreint] = useState('');
    const [emailsAutorises, setEmailsAutorises] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        setChargement(true);
        
        const listeEmails = emailsAutorises.trim() !== '' 
            ? emailsAutorises.split(',').map(email => email.trim()).filter(email => email !== '')
            : null;

        try {
            await api.post('/sondages', {
                titre, description, date_fin: dateFin || null, est_prive: !estPublic, est_anonyme: estAnonyme,
                domaine_restreint: domaineRestreint.trim() !== '' ? domaineRestreint.trim() : null,
                emails_autorises: listeEmails,
                questions: questions.map(q => ({
                    titre: q.titre, type: q.type, obligatoire: q.obligatoire,
                    options: TYPES_AVEC_OPTIONS.includes(q.type) ? q.options.filter(opt => opt.trim() !== '') : []
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
        // 🧹 OPTIMISATION : J'ai remplacé ta longue logique de classe par un simple "animate-fade-in" 
        // (qui semble déjà exister dans ton projet) ou tu peux ajouter une classe Tailwind standard pour l'animation.
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 text-gray-800 dark:text-gray-200 overflow-x-hidden animate-fade-in">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 break-words">Créer un sondage</h2>
                <p className="text-gray-500 text-sm break-words">Configurez votre sondage et ajoutez vos questions</p>
            </div>

            {erreur && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 break-words">{erreur}</div>}

            <form onSubmit={handleSubmit} className="w-full">
                
                <div className="bg-white dark:bg-carteSombre p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8 w-full">
                    <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2">Titre *</label>
                        <input type="text" required value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex: Enquête de satisfaction" className="w-full p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" />
                    </div>
                    <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre sondage..." className="w-full p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y dark:text-white"></textarea>
                    </div>
                    
                    {/* Grille responsive pour les paramètres */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-4 items-start md:items-end">
                        <div className="w-full">
                            <label className="block text-sm font-semibold mb-2">Date d'expiration</label>
                            <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="w-full p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-500 dark:text-white" />
                        </div>
                        
                        <div className="flex items-center w-full pb-2 md:pb-3">
                            <label className="relative inline-flex items-center cursor-pointer w-full">
                                <input type="checkbox" className="sr-only peer" checked={estPublic} onChange={(e) => setEstPublic(e.target.checked)} />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white shrink-0"></div>
                                <span className="ml-3 text-sm font-medium break-words">Sondage public</span>
                            </label>
                        </div>

                        <div className="flex items-center w-full pb-2 md:pb-3">
                            <label className="relative inline-flex items-center cursor-pointer w-full">
                                <input type="checkbox" className="sr-only peer" checked={estAnonyme} onChange={(e) => setEstAnonyme(e.target.checked)} />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#3b82f6] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white shrink-0"></div>
                                <span className="ml-3 text-sm font-medium break-words">Sondage anonyme</span>
                            </label>
                        </div>
                    </div>

                    {!estPublic && (
                        <div className="mt-6 p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 animate-fade-in w-full">
                            <h3 className="font-bold text-orange-800 dark:text-orange-400 mb-2 flex items-center gap-2 break-words">
                                <span className="shrink-0">🛡️</span> Restrictions d'accès 
                            </h3>
                            <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-300 mb-5 break-words">
                                Laissez vide pour que le sondage privé soit accessible à toute personne connectée possédant le lien.
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 break-words">Restreindre à un domaine email spécifique</label>
                                    <input type="text" placeholder="ex: @gmail.com ou @univ-thies.sn" value={domaineRestreint} onChange={(e) => setDomaineRestreint(e.target.value)} className="w-full p-3 bg-white dark:bg-fondSombre border border-orange-200 dark:border-orange-700 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none dark:text-white transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 break-words">Ou créer une liste blanche </label>
                                    <textarea placeholder="jean@gmail.com, malick@univ-thies.sn" value={emailsAutorises} onChange={(e) => setEmailsAutorises(e.target.value)} className="w-full p-3 bg-white dark:bg-fondSombre border border-orange-200 dark:border-orange-700 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none dark:text-white transition-colors text-sm" rows="3" />
                                    <span className="text-[10px] sm:text-xs text-orange-500 font-medium mt-1 inline-block break-words">Séparez les adresses email par des virgules.</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold mb-4 break-words">Questions</h3>
                <div className="space-y-4 mb-4 w-full">
                    {questions.map((q, index) => (
                        <div key={q.id} className="w-full">
                            <EditeurQuestion 
                                q={q}
                                index={index}
                                peutEtreSupprimee={questions.length > 1}
                                mettreAJourQuestion={mettreAJourQuestion}
                                supprimerQuestion={supprimerQuestion}
                                ajouterOption={ajouterOption}
                                mettreAJourOption={mettreAJourOption}
                                typesAvecOptions={TYPES_AVEC_OPTIONS}
                            />
                        </div>
                    ))}
                </div>

                <button type="button" onClick={ajouterQuestion} className="w-full py-3.5 mb-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium break-words">
                    + Ajouter une question
                </button>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 w-full">
                    <button type="button" onClick={() => { if(onSondageCree) onSondageCree(); }} className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm transition-colors break-words">Annuler</button>
                    <button type="submit" disabled={chargement} className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-[#3b82f6] hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 break-words">{chargement ? 'Création...' : 'Créer le sondage'}</button>
                </div>
            </form>
        </div>
    );
}