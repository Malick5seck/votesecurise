import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import QuestionSondage from '../../components/sondage/QuestionSondage';

export default function ParticiperSondage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
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

    useEffect(() => {
        setContexteRefus('eligibilite');
        const fetchSondage = async () => {
            try {
                const reponse = await api.get(`/sondages/${id}`);
                const donneesSondage = reponse.data;
                
                let utilisateurAutorise = true;
                let user = null;
                const userData = localStorage.getItem('user');

                if (userData) {
                    user = JSON.parse(userData);
                }

                if (donneesSondage.domaine_restreint || (donneesSondage.emails_autorises && donneesSondage.emails_autorises.length > 0)) {
                    
                    if (!user) {
                        utilisateurAutorise = false;
                        setMessageRefus("Ce sondage est restreint. Vous devez vous connecter pour vérifier votre éligibilité.");
                    } else {
                        let domaineValide = false;
                        if (donneesSondage.domaine_restreint) {
                            const userDomain = "@" + user.email.split('@')[1]; 
                            if (userDomain.toLowerCase() === donneesSondage.domaine_restreint.toLowerCase()) {
                                domaineValide = true;
                            }
                        }

                        let emailValide = false;
                        if (donneesSondage.emails_autorises && donneesSondage.emails_autorises.length > 0) {
                            if (donneesSondage.emails_autorises.includes(user.email)) {
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
            setVoteReussi(true);
        } catch (err) {
            setErreurSubmit(err.response?.data?.message || "Erreur lors de l'enregistrement du vote.");
        } finally {
            setChargement(false);
        }
    };

    if (chargement) return <div className="text-center py-20 text-gray-500 text-lg flex flex-col items-center justify-center animate-fade-in"><div className="w-12 h-12 border-4 border-blue-200 border-t-[#3b82f6] rounded-full animate-spin mb-4"></div>Chargement du sondage...</div>;
    
    if (erreur) return <div className="text-center py-20 text-red-500 text-lg font-bold">{erreur}</div>;
    
    if (accesRefuse) return (
        <div className="max-w-2xl mx-auto py-12 sm:py-20 px-4 text-center transition-colors duration-300 animate-fade-in">
            <div className={`p-6 sm:p-10 rounded-2xl shadow-lg border ${contexteRefus === 'suspension' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'}`}>
                <div className="text-5xl sm:text-6xl mb-4">{contexteRefus === 'suspension' ? '⛔' : '🔒'}</div>
                <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${contexteRefus === 'suspension' ? 'text-red-800 dark:text-red-400' : 'text-orange-800 dark:text-orange-400'}`}>
                    {contexteRefus === 'suspension' ? 'Compte suspendu' : 'Accès restreint'}
                </h2>
                <p className={`text-sm sm:text-base mb-8 leading-relaxed ${contexteRefus === 'suspension' ? 'text-red-800 dark:text-red-300' : 'text-orange-700 dark:text-orange-300'}`}>{messageRefus}</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button onClick={() => navigate(-1)} className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors">
                        Retour
                    </button>
                    {!localStorage.getItem('user') && (
                        <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1">
                            Se connecter
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const estExpire = sondage?.date_fin ? new Date(sondage.date_fin) < new Date() : false;
    
    if (estExpire) return (
        <div className="max-w-2xl mx-auto py-12 sm:py-20 px-4 text-center transition-colors duration-300 animate-fade-in">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 sm:p-10 rounded-2xl shadow-lg border border-red-200 dark:border-red-800">
                <div className="text-5xl sm:text-6xl mb-4">⏳</div>
                <h2 className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Sondage clôturé</h2>
                <p className="text-sm sm:text-base text-red-600 dark:text-red-300 mb-8">Ce sondage a atteint sa date d'expiration. Aucune nouvelle participation n'est autorisée.</p>
                <button onClick={() => navigate(-1)} className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors">
                    Retour
                </button>
            </div>
        </div>
    );

    if (aDejaVote) return (
        <div className="max-w-2xl mx-auto py-12 sm:py-20 px-4 text-center transition-colors duration-300 animate-fade-in">
            <div className="bg-white dark:bg-carteSombre p-6 sm:p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-5xl sm:text-6xl mb-4">🛡️</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Vous avez déjà participé !</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8">Votre vote a bien été pris en compte pour ce sondage. Le double vote n'est pas autorisé.</p>
                <button onClick={() => navigate(-1)} className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors">
                    Retour
                </button>
            </div>
        </div>
    );

    if (voteReussi) return (
        <div className="max-w-2xl mx-auto py-12 sm:py-20 px-4 text-center transition-colors duration-300 animate-fade-in">
            <div className="bg-white dark:bg-carteSombre p-6 sm:p-10 rounded-2xl shadow-xl border border-green-100 dark:border-green-900/30 transform transition-all">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Vote enregistré !</h2>
                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-8">
                    Merci pour votre participation. Votre réponse a bien été prise en compte et sécurisée.
                </p>
                <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1">
                    Retourner au tableau de bord
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 transition-colors duration-300 animate-fade-in">
            
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-500 hover:text-[#3b82f6] dark:text-gray-400 dark:hover:text-blue-400 font-bold mb-6 transition-colors group w-fit"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Retour
            </button>

            {/* 🔥 RESPONSIVE: p-5 sur mobile, p-8 sur PC pour l'en-tête bleu */}
            <div className="bg-[#3b82f6] text-white p-5 sm:p-8 rounded-t-2xl shadow-md">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">{sondage.titre}</h1>
                {sondage.description && <p className="text-blue-100 text-base sm:text-lg leading-relaxed">{sondage.description}</p>}
                
                <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                    {!sondage.est_prive && (
                        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                            🌍 Sondage Public
                        </span>
                    )}
                    {sondage.est_prive && (
                        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                            🔒 Sondage Privé
                        </span>
                    )}
                </div>
            </div>

            {/* 🔥 RESPONSIVE: p-5 sur mobile, p-8 sur PC pour le corps du formulaire */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-carteSombre p-5 sm:p-8 rounded-b-2xl shadow-md border border-t-0 border-gray-200 dark:border-gray-700">
                
                {erreurSubmit && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm sm:text-base">
                        <p className="font-bold">Erreur</p>
                        <p>{erreurSubmit}</p>
                    </div>
                )}

                <div className="space-y-6 sm:space-y-8">
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

                <div className={`mt-8 sm:mt-10 p-4 sm:p-5 rounded-xl border flex items-start gap-3 sm:gap-4 ${sondage.est_anonyme ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                    <div className="pt-0.5 shrink-0">
                        <input 
                            type="checkbox" id="anonymeCheck"
                            checked={voterAnonymement} 
                            onChange={(e) => setVoterAnonymement(e.target.checked)}
                            disabled={sondage.est_anonyme}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        />
                    </div>
                    <div>
                        <label htmlFor="anonymeCheck" className={`font-bold block text-sm sm:text-base ${sondage.est_anonyme ? 'text-gray-700 dark:text-gray-300 cursor-not-allowed' : 'text-blue-900 dark:text-blue-300 cursor-pointer'}`}>
                            Voter de manière anonyme
                        </label>
                        <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${sondage.est_anonyme ? 'text-gray-500 dark:text-gray-400' : 'text-blue-700 dark:text-blue-400'}`}>
                            {sondage.est_anonyme 
                                ? "Le créateur a configuré ce sondage pour qu'il soit 100% anonyme. Votre identité est protégée et vous ne pouvez pas décocher cette case." 
                                : "En cochant cette case, le créateur du sondage ne verra pas votre identité à côté de vos réponses."}
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-right">
                    <button 
                        type="submit" disabled={chargement}
                        className="w-full sm:w-auto bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3.5 sm:py-4 px-10 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 disabled:opacity-50 text-base sm:text-lg"
                    >
                        {chargement ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Envoi en cours...
                            </span>
                        ) : 'Valider mon vote'}
                    </button>
                </div>
            </form>
        </div>
    );
}