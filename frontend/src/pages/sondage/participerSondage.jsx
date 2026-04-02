import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import QuestionSondage from '../../components/sondage/QuestionSondage';

export default function ParticiperSondage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Initialisation des états
    const [sondage, setSondage] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');
    const [aDejaVote, setADejaVote] = useState(false);
    const [accesRefuse, setAccesRefuse] = useState(false);
    const [messageRefus, setMessageRefus] = useState('');
    const [contexteRefus, setContexteRefus] = useState('eligibilite');
    const [voteReussi, setVoteReussi] = useState(false);
    const [erreurSubmit, setErreurSubmit] = useState('');
    const [reponses, setReponses] = useState({});
    const [voterAnonymement, setVoterAnonymement] = useState(false);

    // 2. Détection de l'utilisateur (On retire isSuperAdmin d'ici pour la sécurité)
    const userString = localStorage.getItem('user');
    let currentUser = null;
    
    if (userString) {
        try {
            currentUser = JSON.parse(userString);
        } catch (e) {
            console.error("Erreur de parsing user", e);
        }
    }

    const queryParams = new URLSearchParams(location.search);
    const isModeConsultation = queryParams.get('mode') === 'consultation';
    
    // 🔒 CORRECTION POINT 4 : On ne fait plus confiance au LocalStorage pour débloquer les écrans.
    // Le mode consultation via l'URL (qui ne permet pas de voter de toute façon) suffit pour la lecture seule.
    const isReadOnly = isModeConsultation;

    // 3. Déclaration de l'expiration
    const estExpire = sondage?.date_fin ? new Date(sondage.date_fin) < new Date() : false;

    // 4. Chargement des données
    useEffect(() => {
        setContexteRefus('eligibilite');
        const fetchSondage = async () => {
            try {
                const reponse = await api.get(`/sondages/${id}`);
                const donneesSondage = reponse.data;
                
                let utilisateurAutorise = true;

                if (isReadOnly) {
                    utilisateurAutorise = true;
                } else if (donneesSondage.domaine_restreint || (donneesSondage.emails_autorises && donneesSondage.emails_autorises.length > 0)) {
                    if (!currentUser) {
                        utilisateurAutorise = false;
                        setMessageRefus("Ce sondage est restreint. Vous devez vous connecter pour vérifier votre éligibilité.");
                    } else {
                        let domaineValide = false;
                        if (donneesSondage.domaine_restreint) {
                            const userDomain = "@" + currentUser.email.split('@')[1]; 
                            if (userDomain.toLowerCase() === donneesSondage.domaine_restreint.toLowerCase()) {
                                domaineValide = true;
                            }
                        }

                        let emailValide = false;
                        if (donneesSondage.emails_autorises && donneesSondage.emails_autorises.length > 0) {
                            if (donneesSondage.emails_autorises.includes(currentUser.email)) {
                                emailValide = true;
                            }
                        }

                        if (!domaineValide && !emailValide) {
                            utilisateurAutorise = false;
                            setMessageRefus("Votre adresse email n'est pas autorisée à participer à ce sondage.");
                        }
                    }
                }

                if (!utilisateurAutorise) {
                    setAccesRefuse(true);
                } else {
                    setSondage(donneesSondage);
                    if (donneesSondage.a_deja_vote) setADejaVote(true);
                    if (donneesSondage.est_anonyme) setVoterAnonymement(true);
                }

            } catch (err) {
                if (err.response?.status === 403 && err.response?.data?.message) {
                    setContexteRefus('suspension');
                    setMessageRefus(err.response.data.message);
                    setAccesRefuse(true);
                } else {
                    setErreur("Ce sondage n'existe pas ou est introuvable.");
                }
            } finally {
                setChargement(false);
            }
        };
        fetchSondage();
    }, [id, isReadOnly]); 

    // 5. Gestion des inputs
    const handleTextChange = (questionId, valeur) => {
        if (isReadOnly) return;
        setReponses(prev => ({ ...prev, [questionId]: { valeur_texte: valeur } }));
    };

    const handleRadioChange = (questionId, optionId) => {
        if (isReadOnly) return;
        setReponses(prev => ({ ...prev, [questionId]: { option_id: optionId } }));
    };

    const handleCheckboxChange = (questionId, optionId, estCoche) => {
        if (isReadOnly) return;
        setReponses(prev => {
            const reponseActuelle = prev[questionId] || { options_multiples: [] };
            
            // 🧹 CORRECTION POINT 6 (Clean Code) : On clone proprement le tableau existant
            // avant de le modifier, pour ne pas muter l'état React directement.
            let nouvellesOptions = [...(reponseActuelle.options_multiples || [])];
            
            if (estCoche) {
                nouvellesOptions.push(optionId);
            } else {
                nouvellesOptions = nouvellesOptions.filter(optId => optId !== optionId);
            }
            
            return { ...prev, [questionId]: { options_multiples: nouvellesOptions } };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isReadOnly) return; 
        
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
            setVoteReussi(true);
        } catch (err) {
            setErreurSubmit(err.response?.data?.message || "Erreur lors de l'enregistrement du vote.");
        } finally {
            setChargement(false);
        }
    };

    // 6. Rendu des écrans de chargement et d'erreur
    if (chargement) return <div className="text-center py-20 text-gray-500 text-lg flex flex-col items-center justify-center animate-fade-in w-full max-w-full px-4"><div className="w-12 h-12 border-4 border-blue-200 border-t-[#3b82f6] rounded-full animate-spin mb-4 shrink-0"></div><span className="break-words">Chargement du sondage...</span></div>;
    
    if (erreur) return <div className="text-center py-20 text-red-500 text-lg font-bold w-full max-w-full px-4 break-words">{erreur}</div>;
    
    if (accesRefuse) return (
        <div className="w-full max-w-2xl mx-auto py-12 sm:py-20 px-4 text-center transition-colors duration-300 animate-fade-in overflow-hidden">
            <div className={`p-6 sm:p-10 rounded-2xl shadow-lg border ${contexteRefus === 'suspension' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'}`}>
                <div className="text-5xl sm:text-6xl mb-4 shrink-0">{contexteRefus === 'suspension' ? '⛔' : '🔒'}</div>
                <h2 className={`text-xl sm:text-2xl font-bold mb-2 break-words ${contexteRefus === 'suspension' ? 'text-red-800 dark:text-red-400' : 'text-orange-800 dark:text-orange-400'}`}>
                    {contexteRefus === 'suspension' ? 'Compte suspendu' : 'Accès restreint'}
                </h2>
                <p className={`text-sm sm:text-base mb-8 leading-relaxed break-words ${contexteRefus === 'suspension' ? 'text-red-800 dark:text-red-300' : 'text-orange-700 dark:text-orange-300'}`}>{messageRefus}</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                    <button onClick={() => navigate(-1)} className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors shrink-0">
                        Retour
                    </button>
                    {!currentUser && (
                        <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1 shrink-0">
                            Se connecter
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    if (estExpire && !isReadOnly) return (
        <div className="w-full max-w-2xl mx-auto py-12 sm:py-20 px-4 text-center transition-colors duration-300 animate-fade-in overflow-hidden">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 sm:p-10 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 w-full">
                <div className="text-5xl sm:text-6xl mb-4 shrink-0">⏳</div>
                <h2 className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-400 mb-2 break-words">Sondage clôturé</h2>
                <p className="text-sm sm:text-base text-red-600 dark:text-red-300 mb-8 break-words">Ce sondage a atteint sa date d'expiration. Aucune nouvelle participation n'est autorisée.</p>
                <button onClick={() => navigate(-1)} className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors shrink-0">
                    Retour
                </button>
            </div>
        </div>
    );

    if (aDejaVote && !isReadOnly) return (
        <div className="w-full max-w-2xl mx-auto py-12 sm:py-20 px-4 text-center transition-colors duration-300 animate-fade-in overflow-hidden">
            <div className="bg-white dark:bg-carteSombre p-6 sm:p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full">
                <div className="text-5xl sm:text-6xl mb-4 shrink-0">🛡️</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 break-words">Vous avez déjà participé !</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 break-words">Votre vote a bien été pris en compte pour ce sondage. Le double vote n'est pas autorisé.</p>
                <button onClick={() => navigate(-1)} className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors shrink-0">
                    Retour
                </button>
            </div>
        </div>
    );

    if (voteReussi) return (
        <div className="w-full max-w-2xl mx-auto py-12 sm:py-20 px-4 text-center transition-colors duration-300 animate-fade-in overflow-hidden">
            <div className="bg-white dark:bg-carteSombre p-6 sm:p-10 rounded-2xl shadow-xl border border-green-100 dark:border-green-900/30 transform transition-all w-full">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 break-words">Vote enregistré !</h2>
                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-8 break-words">
                    Merci pour votre participation. Votre réponse a bien été prise en compte et sécurisée.
                </p>
                <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1 shrink-0">
                    Retourner au tableau de bord
                </button>
            </div>
        </div>
    );

    // 7. Rendu principal
    return (
        <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-4 transition-colors duration-300 animate-fade-in overflow-x-hidden">
            
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-500 hover:text-[#3b82f6] dark:text-gray-400 dark:hover:text-blue-400 font-bold mb-6 transition-colors group w-fit"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Retour
            </button>

            <div className="bg-[#3b82f6] text-white p-5 sm:p-8 rounded-t-2xl shadow-md w-full">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight break-words">{sondage.titre}</h1>
                {sondage.description && <p className="text-blue-100 text-base sm:text-lg leading-relaxed break-words">{sondage.description}</p>}
                
                <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 w-full">
                    {!sondage.est_prive && (
                        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm shrink-0">
                            🌍 Sondage Public
                        </span>
                    )}
                    {sondage.est_prive && (
                        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm shrink-0">
                            🔒 Sondage Privé
                        </span>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className={`w-full bg-white dark:bg-carteSombre p-5 sm:p-8 rounded-b-2xl shadow-md border border-t-0 border-gray-200 dark:border-gray-700 ${isReadOnly ? 'opacity-80 pointer-events-none' : ''}`}>
                
                {erreurSubmit && !isReadOnly && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm sm:text-base break-words w-full">
                        <p className="font-bold">Erreur</p>
                        <p>{erreurSubmit}</p>
                    </div>
                )}

                <div className="space-y-6 sm:space-y-8 w-full">
                    {sondage.questions.map((q, index) => (
                        <QuestionSondage 
                            key={q.id}
                            q={q}
                            index={index}
                            reponses={reponses}
                            handleTextChange={handleTextChange}
                            handleRadioChange={handleRadioChange}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    ))}
                </div>

                {isReadOnly ? (
                    <div className="mt-8 text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 font-bold">🔒 Mode consultation : Action de vote désactivée</p>
                    </div>
                ) : (
                    <>
                        <div className={`w-full mt-8 sm:mt-10 p-4 sm:p-5 rounded-xl border flex items-start gap-3 sm:gap-4 ${sondage.est_anonyme ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                            <div className="pt-0.5 shrink-0">
                                <input 
                                    type="checkbox" id="anonymeCheck"
                                    checked={voterAnonymement} 
                                    onChange={(e) => setVoterAnonymement(e.target.checked)}
                                    disabled={sondage.est_anonyme}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <label htmlFor="anonymeCheck" className={`font-bold block text-sm sm:text-base break-words ${sondage.est_anonyme ? 'text-gray-700 dark:text-gray-300 cursor-not-allowed' : 'text-blue-900 dark:text-blue-300 cursor-pointer'}`}>
                                    Voter de manière anonyme
                                </label>
                                <p className={`text-xs sm:text-sm mt-1 leading-relaxed break-words ${sondage.est_anonyme ? 'text-gray-500 dark:text-gray-400' : 'text-blue-700 dark:text-blue-400'}`}>
                                    {sondage.est_anonyme 
                                        ? "Le créateur a configuré ce sondage pour qu'il soit 100% anonyme. Votre identité est protégée et vous ne pouvez pas décocher cette case." 
                                        : "En cochant cette case, le créateur du sondage ne verra pas votre identité à côté de vos réponses."}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-10 text-right w-full">
                            <button 
                                type="submit" disabled={chargement}
                                className="w-full sm:w-auto bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 px-10 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 disabled:opacity-50 text-base sm:text-lg shrink-0"
                            >
                                {chargement ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"></div>
                                        Envoi en cours...
                                    </span>
                                ) : 'Valider mon vote'}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}