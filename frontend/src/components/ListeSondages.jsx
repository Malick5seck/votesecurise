import { useState, useEffect, useRef } from 'react'; // <-- Ajout de useRef
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ListeSondages() {
    const [sondages, setSondages] = useState([]);
    const [chargement, setChargement] = useState(true);
    const navigate = useNavigate();
    
    // <-- NOUVEAU : Création d'une référence pour cibler la liste
    const listeRef = useRef(null); 

    // --- PAGINATION ---
    const [pageActuelle, setPageActuelle] = useState(1);
    const sondagesParPage = 6; 

    useEffect(() => {
        const fetchSondages = async () => {
            try {
                const reponse = await api.get('/sondages');
                const maintenant = new Date();
                
                const sondagesActifs = reponse.data.filter(sondage => {
                    if (sondage.est_prive) return false;
                    if (!sondage.date_fin) return true;
                    return new Date(sondage.date_fin) > maintenant;
                });

                const sondagesTries = sondagesActifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                setSondages(sondagesTries);
            } catch (erreur) {
                console.error("Erreur lors du chargement des sondages", erreur);
            } finally {
                setChargement(false);
            }
        };

        fetchSondages();
    }, []);

    const handleCardClick = (sondageId) => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate(`/sondage/${sondageId}`);
        } else {
            navigate('/login');
        }
    };

    // <-- CORRECTION : Scroll dynamique et précis au changement de page
    useEffect(() => {
        // On vérifie que la référence existe bien sur la page
        if (listeRef.current) {
            // Calcule la position exacte du haut de la liste de sondages
            // Le "- 100" permet de laisser un peu d'espace en haut (utile si vous avez une navbar fixe)
            const positionY = listeRef.current.getBoundingClientRect().top + window.scrollY - 100;
            
            window.scrollTo({ top: positionY, behavior: 'smooth' });
        }
    }, [pageActuelle]);

    if (chargement) return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium tracking-wide">Chargement des sondages...</p>
        </div>
    );

    if (sondages.length === 0) return (
        <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4 text-gray-300 dark:text-gray-600">📭</div>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Aucun sondage public n'est disponible pour le moment.</p>
            <p className="text-sm text-gray-400 mt-2">Soyez le premier à en créer un !</p>
        </div>
    );

    const indexDernierSondage = pageActuelle * sondagesParPage;
    const indexPremierSondage = indexDernierSondage - sondagesParPage;
    const sondagesAffiches = sondages.slice(indexPremierSondage, indexDernierSondage);
    const totalPages = Math.ceil(sondages.length / sondagesParPage);

    const estNouveau = (dateCreation) => {
        const diffTemps = new Date() - new Date(dateCreation);
        const diffJours = diffTemps / (1000 * 3600 * 24);
        return diffJours <= 3;
    };

    return (
        // <-- NOUVEAU : On attache la référence (ref={listeRef}) au conteneur principal
        <div ref={listeRef} className="space-y-10 animate-fade-in">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sondagesAffiches.map(sondage => (
                    <div 
                        key={sondage.id} 
                        onClick={() => handleCardClick(sondage.id)}
                        className="group bg-white dark:bg-carteSombre rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-[#3b82f6]/30 dark:hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 to-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="p-7">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-2">
                                    <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Public
                                    </span>
                                    {estNouveau(sondage.created_at) && (
                                        <span className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                                            Nouveau
                                        </span>
                                    )}
                                </div>
                                {sondage.est_anonyme && (
                                    <span className="text-gray-400 dark:text-gray-500" title="Sondage Anonyme">🕵️‍♂️</span>
                                )}
                            </div>

                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3 group-hover:text-[#3b82f6] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                {sondage.titre}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                {sondage.description || "Aucune description fournie pour ce sondage. Cliquez pour découvrir les questions."}
                            </p>
                        </div>

                        <div className="px-7 py-5 bg-gray-50/50 dark:bg-fondSombre border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center gap-1.5" title="Nombre de questions">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                    </svg>
                                    {sondage.questions?.length || 0} Q.
                                </span>
                                <span className="flex items-center gap-1.5 font-bold text-[#3b82f6]" title="Nombre de votes">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                    </svg>
                                    {sondage.votes_count || 0} votes
                                </span>
                            </div>
                            <span className="flex items-center gap-1.5" title="Créé le">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                {new Date(sondage.created_at).toLocaleDateString('fr-FR')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-10 animate-fade-in">
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-fondSombre p-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <button 
                            onClick={() => setPageActuelle(prev => Math.max(prev - 1, 1))} 
                            disabled={pageActuelle === 1} 
                            className="px-5 py-2.5 rounded-lg font-bold bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Précédent
                        </button>
                        <span className="text-sm font-bold text-gray-500">Page {pageActuelle} / {totalPages}</span>
                        <button 
                            onClick={() => setPageActuelle(prev => Math.min(prev + 1, totalPages))} 
                            disabled={pageActuelle === totalPages} 
                            className="px-5 py-2.5 rounded-lg font-bold bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}