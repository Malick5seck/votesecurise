import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ListeSondages() {
    const [sondages, setSondages] = useState([]);
    const [chargement, setChargement] = useState(true);
    const navigate = useNavigate();

    // 🔥 NOUVEAU : États pour gérer la pagination
    const [pageActuelle, setPageActuelle] = useState(1);
    const sondagesParPage = 6; // On affiche 6 sondages par page

    useEffect(() => {
        const fetchSondages = async () => {
            try {
                const reponse = await api.get('/sondages');
                const maintenant = new Date();
                
                const sondagesActifs = reponse.data.filter(sondage => {
                    if (!sondage.date_fin) return true;
                    return new Date(sondage.date_fin) > maintenant;
                });

                setSondages(sondagesActifs);
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

    // Pour remonter en haut de la page quand on change de page
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pageActuelle]);

    if (chargement) return <div className="text-center py-10 text-gray-500">Chargement des sondages...</div>;
    if (sondages.length === 0) return <div className="text-center py-10 text-gray-500 italic">Aucun sondage public disponible pour le moment.</div>;

    // --- LOGIQUE DE PAGINATION ---
    const indexDernierSondage = pageActuelle * sondagesParPage;
    const indexPremierSondage = indexDernierSondage - sondagesParPage;
    // On extrait uniquement les 6 sondages de la page en cours
    const sondagesAffiches = sondages.slice(indexPremierSondage, indexDernierSondage);
    // On calcule le nombre total de pages
    const totalPages = Math.ceil(sondages.length / sondagesParPage);

    return (
        <div className="space-y-10">
            {/* LA GRILLE DES SONDAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sondagesAffiches.map(sondage => (
                    <div 
                        key={sondage.id} 
                        onClick={() => handleCardClick(sondage.id)}
                        className="bg-white dark:bg-carteSombre rounded-xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between p-6 group"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primaire dark:group-hover:text-blue-400 transition-colors">
                                {sondage.titre}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6">
                                {sondage.description || "Aucune description fournie pour ce sondage."}
                            </p>
                        </div>

                        <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center gap-1.5" title="Nombre de questions">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                    </svg>
                                    {sondage.questions?.length || 0} questions
                                </span>
                                <span className="flex items-center gap-1.5" title="Nombre de votes">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                    </svg>
                                    {sondage.votes_count || 0} votes
                                </span>
                            </div>
                            <span className="flex items-center gap-1.5" title="Date de fin / Création">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                {sondage.date_fin ? new Date(sondage.date_fin).toLocaleDateString('fr-FR') : new Date(sondage.created_at).toLocaleDateString('fr-FR')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* LES CONTRÔLES DE PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                    <button 
                        onClick={() => setPageActuelle(prev => Math.max(prev - 1, 1))}
                        disabled={pageActuelle === 1}
                        className="px-4 py-2 rounded-lg font-bold transition-colors bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        Précédent
                    </button>
                    
                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPageActuelle(i + 1)}
                                className={`w-10 h-10 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center ${
                                    pageActuelle === i + 1 
                                        ? 'bg-[#3b82f6] text-white ring-2 ring-blue-300 ring-offset-1 dark:ring-offset-gray-900' 
                                        : 'bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => setPageActuelle(prev => Math.min(prev + 1, totalPages))}
                        disabled={pageActuelle === totalPages}
                        className="px-4 py-2 rounded-lg font-bold transition-colors bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}