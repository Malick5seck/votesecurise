// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import QuestionSondage from '../components/QuestionSondage'; // <-- Nouvel import

// export default function ParticiperSondage() {
//     const { id } = useParams();
//     const navigate = useNavigate();
    
//     const [sondage, setSondage] = useState(null);
//     const [chargement, setChargement] = useState(true);
//     const [erreur, setErreur] = useState('');
//     const [aDejaVote, setADejaVote] = useState(false);
    
//     const [voteReussi, setVoteReussi] = useState(false);
//     const [erreurSubmit, setErreurSubmit] = useState('');
    
//     const [reponses, setReponses] = useState({});
//     const [voterAnonymement, setVoterAnonymement] = useState(false);

//     useEffect(() => {
//         const fetchSondage = async () => {
//             try {
//                 const reponse = await api.get(`/sondages/${id}`);
//                 setSondage(reponse.data);
                
//                 if (reponse.data.a_deja_vote) {
//                     setADejaVote(true);
//                 }

//                 if (reponse.data.est_anonyme) {
//                     setVoterAnonymement(true);
//                 }

//             } catch (err) {
//                 setErreur("Ce sondage n'existe pas ou est introuvable.");
//             } finally {
//                 setChargement(false);
//             }
//         };
//         fetchSondage();
//     }, [id]);

//     const handleTextChange = (questionId, valeur) => {
//         setReponses(prev => ({ ...prev, [questionId]: { valeur_texte: valeur } }));
//     };

//     const handleRadioChange = (questionId, optionId) => {
//         setReponses(prev => ({ ...prev, [questionId]: { option_id: optionId } }));
//     };

//     const handleCheckboxChange = (questionId, optionId, estCoche) => {
//         setReponses(prev => {
//             const reponseActuelle = prev[questionId] || { options_multiples: [] };
//             let nouvellesOptions = reponseActuelle.options_multiples || [];
            
//             if (estCoche) {
//                 nouvellesOptions.push(optionId);
//             } else {
//                 nouvellesOptions = nouvellesOptions.filter(id !== optionId);
//             }
            
//             return { ...prev, [questionId]: { options_multiples: nouvellesOptions } };
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setChargement(true);
//         setErreurSubmit('');

//         const formatReponses = [];
//         for (const [questionId, data] of Object.entries(reponses)) {
//             if (data.options_multiples && data.options_multiples.length > 0) {
//                 data.options_multiples.forEach(optId => {
//                     formatReponses.push({ question_id: questionId, option_id: optId });
//                 });
//             } else {
//                 formatReponses.push({
//                     question_id: questionId,
//                     option_id: data.option_id || null,
//                     valeur_texte: data.valeur_texte || null
//                 });
//             }
//         }

//         try {
//             await api.post(`/sondages/${id}/voter`, { 
//                 reponses: formatReponses,
//                 est_anonyme: voterAnonymement 
//             });
//             setVoteReussi(true);
//         } catch (err) {
//             setErreurSubmit(err.response?.data?.message || "Erreur lors de l'enregistrement du vote.");
//         } finally {
//             setChargement(false);
//         }
//     };

//     if (chargement) return <div className="text-center py-20 text-gray-500 text-lg">Chargement du sondage...</div>;
//     if (erreur) return <div className="text-center py-20 text-red-500 text-lg font-bold">{erreur}</div>;
    
//     const estExpire = sondage?.date_fin ? new Date(sondage.date_fin) < new Date() : false;
    
//     if (estExpire) return (
//         <div className="max-w-2xl mx-auto py-20 px-4 text-center transition-colors duration-300">
//             <div className="bg-red-50 dark:bg-red-900/20 p-10 rounded-2xl shadow-lg border border-red-200 dark:border-red-800">
//                 <div className="text-6xl mb-4">⏳</div>
//                 <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Sondage clôturé</h2>
//                 <p className="text-red-600 dark:text-red-300 mb-8">Ce sondage a atteint sa date d'expiration. Aucune nouvelle participation n'est autorisée.</p>
//                 <button onClick={() => navigate('/')} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors">
//                     Retour à l'accueil
//                 </button>
//             </div>
//         </div>
//     );

//     if (aDejaVote) return (
//         <div className="max-w-2xl mx-auto py-20 px-4 text-center transition-colors duration-300">
//             <div className="bg-white dark:bg-carteSombre p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
//                 <div className="text-6xl mb-4">🛡️</div>
//                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Vous avez déjà participé !</h2>
//                 <p className="text-gray-600 dark:text-gray-400 mb-8">Votre vote a bien été pris en compte pour ce sondage. Le double vote n'est pas autorisé sur notre plateforme.</p>
//                 <button onClick={() => navigate('/')} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors">
//                     Retour à l'accueil
//                 </button>
//             </div>
//         </div>
//     );

//     if (voteReussi) return (
//         <div className="max-w-2xl mx-auto py-20 px-4 text-center transition-colors duration-300">
//             <div className="bg-white dark:bg-carteSombre p-10 rounded-2xl shadow-xl border border-green-100 dark:border-green-900/30 transform transition-all">
//                 <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                     </svg>
//                 </div>
//                 <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Vote enregistré !</h2>
//                 <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
//                     Merci pour votre participation. Votre réponse a bien été prise en compte et sécurisée.
//                 </p>
//                 <button onClick={() => navigate('/')} className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1">
//                     Retourner aux sondages
//                 </button>
//             </div>
//         </div>
//     );

//     return (
//         <div className="max-w-3xl mx-auto py-10 px-4 transition-colors duration-300">
//             <div className="bg-[#3b82f6] text-white p-8 rounded-t-2xl shadow-md">
//                 <h1 className="text-3xl font-extrabold mb-3">{sondage.titre}</h1>
//                 {sondage.description && <p className="text-blue-100 text-lg">{sondage.description}</p>}
                
//                 <div className="mt-4 flex gap-3">
//                     {!sondage.est_prive && (
//                         <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
//                             🌍 Sondage Public
//                         </span>
//                     )}
//                     {sondage.est_prive && (
//                         <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
//                             🔒 Sondage Privé
//                         </span>
//                     )}
//                 </div>
//             </div>

//             <form onSubmit={handleSubmit} className="bg-white dark:bg-carteSombre p-8 rounded-b-2xl shadow-md border border-t-0 border-gray-200 dark:border-gray-700">
                
//                 {erreurSubmit && (
//                     <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
//                         <p className="font-bold">Erreur</p>
//                         <p>{erreurSubmit}</p>
//                     </div>
//                 )}

//                 <div className="space-y-8">
//                     {/* UTILISATION DU NOUVEAU COMPOSANT ICI */}
//                     {sondage.questions.map((q, index) => (
//                         <QuestionSondage 
//                             key={q.id}
//                             q={q}
//                             index={index}
//                             reponses={reponses}
//                             handleTextChange={handleTextChange}
//                             handleRadioChange={handleRadioChange}
//                             handleCheckboxChange={handleCheckboxChange}
//                         />
//                     ))}
//                 </div>

//                 <div className={`mt-10 p-5 rounded-xl border flex items-start gap-4 ${sondage.est_anonyme ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'}`}>
//                     <div className="pt-0.5">
//                         <input 
//                             type="checkbox" id="anonymeCheck"
//                             checked={voterAnonymement} 
//                             onChange={(e) => setVoterAnonymement(e.target.checked)}
//                             disabled={sondage.est_anonyme}
//                             className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="anonymeCheck" className={`font-bold block ${sondage.est_anonyme ? 'text-gray-700 dark:text-gray-300 cursor-not-allowed' : 'text-blue-900 dark:text-blue-300 cursor-pointer'}`}>
//                             Voter de manière anonyme
//                         </label>
//                         <p className={`text-sm mt-1 ${sondage.est_anonyme ? 'text-gray-500 dark:text-gray-400' : 'text-blue-700 dark:text-blue-400'}`}>
//                             {sondage.est_anonyme 
//                                 ? "Le créateur a configuré ce sondage pour qu'il soit 100% anonyme. Votre identité est protégée et vous ne pouvez pas décocher cette case." 
//                                 : "En cochant cette case, le créateur du sondage ne verra pas votre identité à côté de vos réponses."}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="mt-8 text-right">
//                     <button 
//                         type="submit" disabled={chargement}
//                         className="w-full sm:w-auto bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 disabled:opacity-50 text-lg"
//                     >
//                         {chargement ? 'Envoi en cours...' : 'Valider mon vote'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import QuestionSondage from '../components/QuestionSondage';

export default function ParticiperSondage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // --- ÉTATS STANDARDS ---
    const [sondage, setSondage] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');
    const [aDejaVote, setADejaVote] = useState(false);
    
    // --- ÉTATS DE SÉCURITÉ ---
    const [accesRefuse, setAccesRefuse] = useState(false); // 🔥 NOUVEAU : Gère le refus d'accès
    const [messageRefus, setMessageRefus] = useState(''); // 🔥 NOUVEAU : Message explicatif
    
    // --- ÉTATS DU FORMULAIRE ---
    const [voteReussi, setVoteReussi] = useState(false);
    const [erreurSubmit, setErreurSubmit] = useState('');
    const [reponses, setReponses] = useState({});
    const [voterAnonymement, setVoterAnonymement] = useState(false);

    useEffect(() => {
        const fetchSondage = async () => {
            try {
                const reponse = await api.get(`/sondages/${id}`);
                const donneesSondage = reponse.data;
                
                // 🔥 1. VÉRIFICATION DES RESTRICTIONS (DOMAINE ET EMAILS)
                let utilisateurAutorise = true;
                let user = null;
                const userData = localStorage.getItem('user');

                if (userData) {
                    user = JSON.parse(userData);
                }

                // S'il y a des restrictions sur le sondage...
                if (donneesSondage.domaine_restreint || (donneesSondage.emails_autorises && donneesSondage.emails_autorises.length > 0)) {
                    
                    // Si l'utilisateur n'est pas connecté, il ne peut pas prouver son identité
                    if (!user) {
                        utilisateurAutorise = false;
                        setMessageRefus("Ce sondage est restreint. Vous devez vous connecter pour vérifier votre éligibilité.");
                    } else {
                        // On vérifie d'abord le domaine (s'il est configuré)
                        let domaineValide = false;
                        if (donneesSondage.domaine_restreint) {
                            // On extrait le domaine de l'email de l'utilisateur (ex: "@ecole.fr")
                            const userDomain = "@" + user.email.split('@')[1]; 
                            if (userDomain.toLowerCase() === donneesSondage.domaine_restreint.toLowerCase()) {
                                domaineValide = true;
                            }
                        }

                        // Ensuite, on vérifie la liste d'emails (si elle est configurée)
                        let emailValide = false;
                        if (donneesSondage.emails_autorises && donneesSondage.emails_autorises.length > 0) {
                            if (donneesSondage.emails_autorises.includes(user.email)) {
                                emailValide = true;
                            }
                        }

                        // L'utilisateur est autorisé s'il remplit au moins une des conditions configurées
                        // Si le créateur a mis un domaine ET une liste, on accepte l'un ou l'autre
                        if (!domaineValide && !emailValide) {
                            utilisateurAutorise = false;
                            setMessageRefus("Votre adresse email n'est pas autorisée à participer à ce sondage.");
                        }
                    }
                }

                // 🔥 2. APPLICATION DE LA DÉCISION
                if (!utilisateurAutorise) {
                    setAccesRefuse(true);
                } else {
                    // Si tout est bon, on affiche le sondage
                    setSondage(donneesSondage);
                    if (donneesSondage.a_deja_vote) setADejaVote(true);
                    if (donneesSondage.est_anonyme) setVoterAnonymement(true);
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
            setVoteReussi(true);
        } catch (err) {
            setErreurSubmit(err.response?.data?.message || "Erreur lors de l'enregistrement du vote.");
        } finally {
            setChargement(false);
        }
    };

    if (chargement) return <div className="text-center py-20 text-gray-500 text-lg flex flex-col items-center justify-center animate-fade-in"><div className="w-12 h-12 border-4 border-blue-200 border-t-[#3b82f6] rounded-full animate-spin mb-4"></div>Chargement du sondage...</div>;
    
    if (erreur) return <div className="text-center py-20 text-red-500 text-lg font-bold">{erreur}</div>;
    
    // 🔥 NOUVEL ÉCRAN : AFFICHAGE DU REFUS D'ACCÈS
    if (accesRefuse) return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center transition-colors duration-300 animate-fade-in">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-10 rounded-2xl shadow-lg border border-orange-200 dark:border-orange-800">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-400 mb-2">Accès Restreint</h2>
                <p className="text-orange-700 dark:text-orange-300 mb-8">{messageRefus}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => navigate('/')} className="bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors">
                        Retour à l'accueil
                    </button>
                    {!localStorage.getItem('user') && (
                        <button onClick={() => navigate('/login')} className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1">
                            Se connecter
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const estExpire = sondage?.date_fin ? new Date(sondage.date_fin) < new Date() : false;
    
    if (estExpire) return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center transition-colors duration-300">
            <div className="bg-red-50 dark:bg-red-900/20 p-10 rounded-2xl shadow-lg border border-red-200 dark:border-red-800">
                <div className="text-6xl mb-4">⏳</div>
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Sondage clôturé</h2>
                <p className="text-red-600 dark:text-red-300 mb-8">Ce sondage a atteint sa date d'expiration. Aucune nouvelle participation n'est autorisée.</p>
                <button onClick={() => navigate('/')} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors">
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );

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
                <button onClick={() => navigate('/dashboard')} className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1">
                    Retourner au tableau de bord
                </button>
            </div>
        </div>
    );

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
                
                {erreurSubmit && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        <p className="font-bold">Erreur</p>
                        <p>{erreurSubmit}</p>
                    </div>
                )}

                <div className="space-y-8">
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