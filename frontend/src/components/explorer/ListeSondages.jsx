import { useState, useEffect, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import SondageCard from '../ui/SondageCard';

export default function ListeSondages({ variant = 'default' }) {
    const [sondages, setSondages] = useState([]);
    const [chargement, setChargement] = useState(true);
    const navigate = useNavigate();
    
    const listeRef = useRef(null); 

    const [pageActuelle, setPageActuelle] = useState(1);
    const sondagesParPage = 6; 

    useEffect(() => {
        const fetchSondages = async () => {
            try {
                const reponse = await api.get('/sondages?actifs_seulement=true');
                
                let sondagesActifs = reponse.data;

                if (variant === 'accueil') {
                    sondagesActifs = [...sondagesActifs].sort(
                        (a, b) => (b.votes_count || 0) - (a.votes_count || 0)
                    ).slice(0, 5);
                } else {
                    sondagesActifs = sondagesActifs.sort(
                        (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    );
                }

                setSondages(sondagesActifs);
            } catch (erreur) {
                console.error("Erreur lors du chargement des sondages", erreur);
            } finally {
                setChargement(false);
            }
        };

        fetchSondages();
    }, [variant]);

    const handleCardClick = (sondageId) => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate(`/sondage/${sondageId}`);
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        if (variant === 'accueil' || !listeRef.current) return;
        const positionY = listeRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: positionY, behavior: 'smooth' });
    }, [pageActuelle, variant]);

    if (chargement) return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 animate-fade-in px-4 text-center w-full max-w-full">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-200 border-t-[#3b82f6] rounded-full animate-spin mb-4 shrink-0"></div>
            <p className="text-gray-500 font-medium tracking-wide text-sm sm:text-base break-words">Chargement des sondages...</p>
        </div>
    );

    if (sondages.length === 0) return (
        <div className="text-center py-12 sm:py-20 animate-fade-in px-4 w-full max-w-full overflow-hidden">
            <div className="text-5xl sm:text-6xl mb-4 text-gray-300 dark:text-gray-600 shrink-0">📭</div>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium break-words">Aucun sondage public n'est disponible pour le moment.</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 break-words">Soyez le premier à en créer un !</p>
        </div>
    );

    const indexDernierSondage = pageActuelle * sondagesParPage;
    const indexPremierSondage = indexDernierSondage - sondagesParPage;
    const sondagesAffiches = variant === 'accueil' 
        ? sondages 
        : sondages.slice(indexPremierSondage, indexDernierSondage);
        
    const totalPages = Math.ceil(sondages.length / sondagesParPage);

    return (
        <div ref={listeRef} className="w-full max-w-full space-y-8 sm:space-y-10 animate-fade-in px-0">
            
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                {sondagesAffiches.map(sondage => (
                    <div key={sondage.id} className="w-full min-w-0">
                        <SondageCard 
                            sondage={sondage} 
                            onClick={handleCardClick} 
                            estRestreint={false} 
                        />
                    </div>
                ))}
            </div>

            {/* Pagination Responsive */}
            {variant !== 'accueil' && totalPages > 1 && (
                <div className="flex justify-center mt-8 sm:mt-10 animate-fade-in w-full">
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-gray-50 dark:bg-fondSombre p-3 sm:p-2 rounded-xl sm:rounded-full border border-gray-100 dark:border-gray-800 shadow-sm shrink-0">
                        <button 
                            onClick={() => setPageActuelle(prev => Math.max(prev - 1, 1))} 
                            disabled={pageActuelle === 1} 
                            className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg sm:rounded-full font-bold text-sm bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Précédent
                        </button>
                        <span className="text-xs sm:text-sm font-bold text-gray-500 whitespace-nowrap">Page {pageActuelle} / {totalPages}</span>
                        <button 
                            onClick={() => setPageActuelle(prev => Math.min(prev + 1, totalPages))} 
                            disabled={pageActuelle === totalPages} 
                            className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg sm:rounded-full font-bold text-sm bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}