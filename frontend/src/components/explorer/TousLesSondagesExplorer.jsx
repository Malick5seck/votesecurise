import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    sondagePublicEnCours,
    sondageAEstAccesRestreint,
} from '../../utils/sondagesPublic';
import SondageCard from '../ui/SondageCard';

export default function TousLesSondagesExplorer({ tousLesSondages = [] }) {
    const [recherche, setRecherche] = useState('');
    const [tri, setTri] = useState('popularite');
    const navigate = useNavigate();

    const sondagesPublicsActifs = useMemo(() => {
        const maintenant = new Date();
        return tousLesSondages.filter(s => sondagePublicEnCours(s, maintenant));
    }, [tousLesSondages]);

    const listesTriees = useMemo(() => {
        const q = recherche.trim().toLowerCase();
        
        const match = (s) =>
            !q ||
            (s.titre && s.titre.toLowerCase().includes(q)) ||
            (s.description && s.description.toLowerCase().includes(q));

        const restreints = sondagesPublicsActifs.filter((s) => sondageAEstAccesRestreint(s) && match(s));
        const normaux = sondagesPublicsActifs.filter((s) => !sondageAEstAccesRestreint(s) && match(s));

        const cmpPopularite = (a, b) => (b.votes_count || 0) - (a.votes_count || 0);
        const cmpRecent = (a, b) => new Date(b.created_at) - new Date(a.created_at);
        const triFn = tri === 'popularite' ? cmpPopularite : cmpRecent;

        return [
            ...restreints.sort(triFn),
            ...normaux.sort(triFn),
        ];
    }, [sondagesPublicsActifs, recherche, tri]);

    const handleCardClick = (sondageId) => {
        const token = localStorage.getItem('token');
        if (token) navigate(`/sondage/${sondageId}`);
        else navigate('/login');
    };

    return (
        <div className="bg-white dark:bg-carteSombre p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-gray-100 dark:border-gray-800 pb-5 sm:pb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                        Tous les sondages
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl leading-relaxed">
                        Sondages publics <strong className="text-gray-700 dark:text-gray-300">en cours</strong>, triables
                        et filtrables. Les votes avec accès restreint sont listés en premier.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 bg-gray-50 dark:bg-fondSombre p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex-1 min-w-0 sm:min-w-[220px]">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">
                        Recherche
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input
                            type="search"
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            placeholder="Titre ou description…"
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-shadow shadow-sm"
                        />
                    </div>
                </div>
                <div className="w-full sm:w-56 shrink-0">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">
                        Trier par
                    </label>
                    <select
                        value={tri}
                        onChange={(e) => setTri(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none shadow-sm cursor-pointer"
                    >
                        <option value="popularite"> Popularité (votes)</option>
                        <option value="recent"> Plus récents</option>
                    </select>
                </div>
            </div>

            {listesTriees.length === 0 ? (
                <div className="text-center py-16 sm:py-20 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    <div className="text-4xl sm:text-5xl mb-4 opacity-50">🔍</div>
                    <p className="font-medium text-base sm:text-lg">Aucun sondage ne correspond à votre recherche.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {listesTriees.map((sondage) => (
                        <SondageCard 
                            key={sondage.id}
                            sondage={sondage}
                            onClick={handleCardClick}
                            estRestreint={sondageAEstAccesRestreint(sondage)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}