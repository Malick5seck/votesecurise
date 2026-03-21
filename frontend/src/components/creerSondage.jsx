import { useState, useEffect } from 'react'; // 🔥 Ajout de useEffect
import api from '../api/axios';
import EditeurQuestion from './EditeurQuestion';

export default function CreerSondage({ onSondageCree }) {
    // 🔥 NOUVEAU : État pour l'animation d'entrée ralentie
    const [pageChargee, setPageChargee] = useState(false);

    // --- ÉTATS GLOBAUX DU SONDAGE ---
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [estPublic, setEstPublic] = useState(true); 
    const [estAnonyme, setEstAnonyme] = useState(false); 
    
    // --- SÉCURITÉ ---
    const [domaineRestreint, setDomaineRestreint] = useState('');
    const [emailsAutorises, setEmailsAutorises] = useState('');

    // --- ÉTATS DES QUESTIONS ---
    const [questions, setQuestions] = useState([
        { id: Date.now(), titre: '', type: 'qcm', obligatoire: true, options: ['', ''] }
    ]);

    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');

    // 🔥 NOUVEAU : Déclenchement de l'animation au chargement
    useEffect(() => {
        // Un petit délai pour s'assurer que le navigateur a rendu le composant invisible avant d'animer
        const timer = setTimeout(() => setPageChargee(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // --- LOGIQUE DES QUESTIONS ---
    const typesAvecOptions = ['qcm', 'checkbox', 'likert', 'boolean', 'ranking', 'matrix'];

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

    // --- SOUMISSION À L'API ---
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
        // 🔥 APPLICATION DE L'ANIMATION LENTE : duration-700 (0.7s) au lieu de l'animation par défaut
        <div className={`max-w-4xl mx-auto py-8 text-gray-800 dark:text-gray-200 transition-all duration-700 ease-out transform ${pageChargee ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Créer un sondage</h2>
                <p className="text-gray-500 text-sm">Configurez votre sondage et ajoutez vos questions</p>
            </div>

            {erreur && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">{erreur}</div>}

            <form onSubmit={handleSubmit}>
                
                {/* BLOC 1 : INFOS GÉNÉRALES */}
                <div className="bg-white dark:bg-carteSombre p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
                    <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2">Titre *</label>
                        <input type="text" required value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex: Enquête de satisfaction" className="w-full p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white" />
                    </div>
                    <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre sondage..." className="w-full p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y dark:text-white"></textarea>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-8 mb-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Date d'expiration</label>
                            <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="w-48 p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-500 dark:text-white" />
                        </div>
                        
                        <div className="flex items-center pt-6">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={estPublic} onChange={(e) => setEstPublic(e.target.checked)} />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                <span className="ml-3 text-sm font-medium">Sondage public</span>
                            </label>
                        </div>

                        <div className="flex items-center pt-6">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={estAnonyme} onChange={(e) => setEstAnonyme(e.target.checked)} />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#3b82f6] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                <span className="ml-3 text-sm font-medium">Sondage anonyme</span>
                            </label>
                        </div>
                    </div>

                    {/* SÉCURITÉ AVANCÉE */}
                    {!estPublic && (
                        <div className="mt-6 p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 animate-fade-in">
                            <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-2 flex items-center gap-2">
                                <span>🛡️</span> Restrictions d'accès (Optionnel)
                            </h4>
                            <p className="text-sm text-orange-600 dark:text-orange-300 mb-5">
                                Laissez vide pour que le sondage privé soit accessible à toute personne connectée possédant le lien.
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Restreindre à un domaine email spécifique</label>
                                    <input type="text" placeholder="ex: @gmail.com ou @monentreprise.com" value={domaineRestreint} onChange={(e) => setDomaineRestreint(e.target.value)} className="w-full p-3 bg-white dark:bg-fondSombre border border-orange-200 dark:border-orange-700 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none dark:text-white transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Ou créer une liste blanche (Emails précis)</label>
                                    <textarea placeholder="jean@gmail.com, marie@entreprise.com" value={emailsAutorises} onChange={(e) => setEmailsAutorises(e.target.value)} className="w-full p-3 bg-white dark:bg-fondSombre border border-orange-200 dark:border-orange-700 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none dark:text-white transition-colors text-sm" rows="3" />
                                    <span className="text-xs text-orange-500 font-medium mt-1 inline-block">Séparez les adresses email par des virgules.</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* BLOC 2 : QUESTIONS (Affichage simplifié grâce au nouveau composant) */}
                <h3 className="text-xl font-bold mb-4">Questions</h3>
                <div className="space-y-4 mb-4">
                    {questions.map((q, index) => (
                        <EditeurQuestion 
                            key={q.id}
                            q={q}
                            index={index}
                            peutEtreSupprimee={questions.length > 1}
                            mettreAJourQuestion={mettreAJourQuestion}
                            supprimerQuestion={supprimerQuestion}
                            ajouterOption={ajouterOption}
                            mettreAJourOption={mettreAJourOption}
                            typesAvecOptions={typesAvecOptions}
                        />
                    ))}
                </div>

                <button type="button" onClick={ajouterQuestion} className="w-full py-3.5 mb-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                    + Ajouter une question
                </button>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" onClick={() => { if(onSondageCree) onSondageCree(); }} className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm transition-colors">Annuler</button>
                    <button type="submit" disabled={chargement} className="px-6 py-2.5 bg-[#3b82f6] hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50">{chargement ? 'Création...' : 'Créer le sondage'}</button>
                </div>
            </form>
        </div>
    );
}