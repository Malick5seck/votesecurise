import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ParticiperSondage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [sondage, setSondage] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');
    const [aDejaVote, setADejaVote] = useState(false);
    
    // NOUVEAU : État pour afficher la carte de succès
    const [voteReussi, setVoteReussi] = useState(false);
    const [erreurSubmit, setErreurSubmit] = useState('');
    
    const [reponses, setReponses] = useState({});
    const [voterAnonymement, setVoterAnonymement] = useState(false);

    useEffect(() => {
        const fetchSondage = async () => {
            try {
                const reponse = await api.get(`/sondages/${id}`);
                setSondage(reponse.data);
                
                if (reponse.data.a_deja_vote) {
                    setADejaVote(true);
                }

                if (reponse.data.est_anonyme) {
                    setVoterAnonymement(true);
                }

            } catch (err) {
                setErreur("Ce sondage n'existe pas ou est introuvable.");
            } finally {
                setChargement(false);
            }
        };
        fetchSondage();
    }, [id]);

    const handleTextChange = (questionId, valeur) => {
        setReponses(prev => ({ ...prev, [questionId]: { valeur_texte: valeur } }));
    };

    const handleRadioChange = (questionId, optionId) => {
        setReponses(prev => ({ ...prev, [questionId]: { option_id: optionId } }));
    };

    const handleCheckboxChange = (questionId, optionId, estCoche) => {
        setReponses(prev => {
            const reponseActuelle = prev[questionId] || { options_multiples: [] };
            let nouvellesOptions = reponseActuelle.options_multiples || [];
            
            if (estCoche) {
                nouvellesOptions.push(optionId);
            } else {
                nouvellesOptions = nouvellesOptions.filter(id => id !== optionId);
            }
            
            return { ...prev, [questionId]: { options_multiples: nouvellesOptions } };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setChargement(true);
        setErreurSubmit('');

        const formatReponses = [];
        for (const [questionId, data] of Object.entries(reponses)) {
            if (data.options_multiples && data.options_multiples.length > 0) {
                data.options_multiples.forEach(optId => {
                    formatReponses.push({ question_id: questionId, option_id: optId });
                });
            } else {
                formatReponses.push({
                    question_id: questionId,
                    option_id: data.option_id || null,
                    valeur_texte: data.valeur_texte || null
                });
            }
        }

        try {
            await api.post(`/sondages/${id}/voter`, { 
                reponses: formatReponses,
                est_anonyme: voterAnonymement 
            });
            // AU LIEU DU ALERT : On déclenche l'affichage de la carte de succès !
            setVoteReussi(true);
        } catch (err) {
            setErreurSubmit(err.response?.data?.message || "Erreur lors de l'enregistrement du vote.");
        } finally {
            setChargement(false);
        }
    };

    // --- LES DIFFÉRENTES VUES (Chargement, Erreur, Déjà Voté, Succès) ---
    
    if (chargement) return <div className="text-center py-20 text-gray-500 text-lg">Chargement du sondage...</div>;
    if (erreur) return <div className="text-center py-20 text-red-500 text-lg font-bold">{erreur}</div>;
    
    // Vue : Déjà Voté
    if (aDejaVote) return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center transition-colors duration-300">
            <div className="bg-white dark:bg-carteSombre p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-6xl mb-4">🛡️</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Vous avez déjà participé !</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Votre vote a bien été pris en compte pour ce sondage. Le double vote n'est pas autorisé sur notre plateforme.</p>
                <button onClick={() => navigate('/')} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors">
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );

    // NOUVELLE VUE : Succès du vote ! 🎉
    if (voteReussi) return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center transition-colors duration-300">
            <div className="bg-white dark:bg-carteSombre p-10 rounded-2xl shadow-xl border border-green-100 dark:border-green-900/30 transform transition-all">
                <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Vote enregistré !</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                    Merci pour votre participation. Votre réponse a bien été prise en compte et sécurisée.
                </p>
                <button onClick={() => navigate('/')} className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1">
                    Retourner aux sondages
                </button>
            </div>
        </div>
    );

    // Vue : Le Formulaire normal
    return (
        <div className="max-w-3xl mx-auto py-10 px-4 transition-colors duration-300">
            
            <div className="bg-[#3b82f6] text-white p-8 rounded-t-2xl shadow-md">
                <h1 className="text-3xl font-extrabold mb-3">{sondage.titre}</h1>
                {sondage.description && <p className="text-blue-100 text-lg">{sondage.description}</p>}
                
                <div className="mt-4 flex gap-3">
                    {!sondage.est_prive && (
                        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                            🌍 Sondage Public
                        </span>
                    )}
                    {sondage.est_prive && (
                        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                            🔒 Sondage Privé
                        </span>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-carteSombre p-8 rounded-b-2xl shadow-md border border-t-0 border-gray-200 dark:border-gray-700">
                
                {/* Affichage d'une erreur si la soumission échoue */}
                {erreurSubmit && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        <p className="font-bold">Erreur</p>
                        <p>{erreurSubmit}</p>
                    </div>
                )}

                <div className="space-y-8">
                    {sondage.questions.map((q, index) => (
                        <div key={q.id} className="p-6 bg-gray-50 dark:bg-fondSombre rounded-xl border border-gray-100 dark:border-gray-600">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                {index + 1}. {q.titre} {q.obligatoire && <span className="text-red-500">*</span>}
                            </h3>

                            {/* CHOIX UNIQUE */}
                            {['qcm', 'boolean', 'likert'].includes(q.type) && (
                                <div className="space-y-3">
                                    {q.options.map(opt => (
                                        <label key={opt.id} className="flex items-center gap-3 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                                            <input 
                                                type="radio" name={`q_${q.id}`} required={q.obligatoire}
                                                onChange={() => handleRadioChange(q.id, opt.id)}
                                                className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="text-gray-800 dark:text-gray-200">{opt.contenu}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* CHOIX MULTIPLE */}
                            {q.type === 'checkbox' && (
                                <div className="space-y-3">
                                    {q.options.map(opt => (
                                        <label key={opt.id} className="flex items-center gap-3 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                                            <input 
                                                type="checkbox" 
                                                onChange={(e) => handleCheckboxChange(q.id, opt.id, e.target.checked)}
                                                className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-gray-800 dark:text-gray-200">{opt.contenu}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* TEXTE LIBRE */}
                            {q.type === 'text' && (
                                <textarea 
                                    required={q.obligatoire} rows="4" placeholder="Votre réponse ici..."
                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                    className="w-full p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y"
                                ></textarea>
                            )}

                            {/* DATE */}
                            {q.type === 'date' && (
                                <input 
                                    type="date" required={q.obligatoire}
                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                    className="w-full sm:w-auto p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                            )}

                            {/* NUMÉRIQUE */}
                            {q.type === 'number' && (
                                <input 
                                    type="number" required={q.obligatoire} placeholder="Ex: 42"
                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                    className="w-full sm:w-1/2 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                            )}

                            {/* SLIDER */}
                            {q.type === 'slider' && (
                                <div className="flex items-center gap-4 bg-white dark:bg-carteSombre p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <input 
                                        type="range" min="0" max="100" defaultValue="50"
                                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                    <span className="font-bold text-blue-600 dark:text-blue-400 w-12 text-center">
                                        {reponses[q.id]?.valeur_texte || "50"}%
                                    </span>
                                </div>
                            )}

                            {/* RATING */}
                            {q.type === 'rating' && (
                                <div className="flex gap-2 text-3xl">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button 
                                            key={star} type="button"
                                            onClick={() => handleTextChange(q.id, star.toString())}
                                            className={`${(reponses[q.id]?.valeur_texte >= star) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} hover:text-yellow-500 transition-colors focus:outline-none`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* TYPES AVANCÉS */}
                            {['ranking', 'matrix', 'condition'].includes(q.type) && (
                                <div className="space-y-3">
                                    {q.options.map(opt => (
                                        <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg">
                                            <span className="text-gray-800 dark:text-gray-200 font-medium sm:w-1/2">{opt.contenu}</span>
                                            <input 
                                                type="text" placeholder="Votre réponse / Rang..."
                                                onChange={(e) => handleTextChange(`${q.id}_${opt.id}`, e.target.value)}
                                                className="w-full sm:w-1/2 p-2 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-fondSombre dark:text-white text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* GESTION DE L'ANONYMAT */}
                <div className={`mt-10 p-5 rounded-xl border flex items-start gap-4 ${sondage.est_anonyme ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                    <div className="pt-0.5">
                        <input 
                            type="checkbox" id="anonymeCheck"
                            checked={voterAnonymement} 
                            onChange={(e) => setVoterAnonymement(e.target.checked)}
                            disabled={sondage.est_anonyme}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="anonymeCheck" className={`font-bold block ${sondage.est_anonyme ? 'text-gray-700 dark:text-gray-300 cursor-not-allowed' : 'text-blue-900 dark:text-blue-300 cursor-pointer'}`}>
                            Voter de manière anonyme
                        </label>
                        <p className={`text-sm mt-1 ${sondage.est_anonyme ? 'text-gray-500 dark:text-gray-400' : 'text-blue-700 dark:text-blue-400'}`}>
                            {sondage.est_anonyme 
                                ? "Le créateur a configuré ce sondage pour qu'il soit 100% anonyme. Votre identité est protégée et vous ne pouvez pas décocher cette case." 
                                : "En cochant cette case, le créateur du sondage ne verra pas votre identité à côté de vos réponses."}
                        </p>
                    </div>
                </div>

                {/* BOUTON DE SOUMISSION */}
                <div className="mt-8 text-right">
                    <button 
                        type="submit" disabled={chargement}
                        className="w-full sm:w-auto bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 disabled:opacity-50 text-lg"
                    >
                        {chargement ? 'Envoi en cours...' : 'Valider mon vote'}
                    </button>
                </div>
            </form>
        </div>
    );
}