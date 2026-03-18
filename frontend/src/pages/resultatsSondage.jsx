import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ResultatsSondage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [donnees, setDonnees] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        const fetchResultats = async () => {
            try {
                const reponse = await api.get(`/sondages/${id}/resultats`);
                setDonnees(reponse.data);
            } catch (err) {
                setErreur(err.response?.data?.message || "Erreur lors du chargement des résultats. Vous n'avez peut-être pas les droits.");
            } finally {
                setChargement(false);
            }
        };

        fetchResultats();
    }, [id]);

    if (chargement) return <div className="text-center py-20 text-gray-500 text-lg">Analyse des résultats en cours...</div>;
    
    if (erreur) return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl border border-red-200 dark:border-red-800">
                <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4">Accès refusé</h2>
                <p className="text-red-600 dark:text-red-300 mb-6">{erreur}</p>
                {/* LE FAMEUX BOUTON RETOUR (Version Erreur) */}
                <button 
                    onClick={() => navigate('/')} 
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );

    const { sondage, statistiques } = donnees;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 transition-colors duration-300">
            
            {/* EN-TÊTE AVEC LE BOUTON RETOUR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Résultats : {sondage.titre}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Total des participants : <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full text-sm">{sondage.total_votes} votes</span>
                    </p>
                </div>
                
                {/* LE FAMEUX BOUTON RETOUR (Version Haut de page) */}
                <button 
                    onClick={() => navigate('/')} 
                    className="bg-white hover:bg-gray-50 dark:bg-carteSombre dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    Retour à l'accueil
                </button>
            </div>

            {/* LISTE DES STATISTIQUES */}
            <div className="space-y-8">
                {statistiques.map((stat, index) => (
                    <div key={stat.id} className="bg-white dark:bg-carteSombre p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                            {index + 1}. {stat.titre}
                        </h3>

                        {/* AFFICHAGE DES OPTIONS (Barres de progression pour QCM, Checkbox, etc.) */}
                        {stat.options && (
                            <div className="space-y-4">
                                {stat.options.map(opt => (
                                    <div key={opt.id}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{opt.contenu}</span>
                                            <span className="text-gray-500 font-bold">{opt.pourcentage}% ({opt.votes} votes)</span>
                                        </div>
                                        {/* Jauge de progression */}
                                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                                            <div 
                                                className="bg-[#3b82f6] h-3 rounded-full transition-all duration-1000" 
                                                style={{ width: `${opt.pourcentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* AFFICHAGE DES MOYENNES (Pour Note, Rating, Slider) */}
                        {stat.moyenne !== undefined && (
                            <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                <div className="text-4xl">📊</div>
                                <div>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide">Moyenne obtenue</p>
                                    <p className="text-3xl font-extrabold text-blue-900 dark:text-blue-300">
                                        {stat.moyenne} <span className="text-lg font-medium text-blue-700 dark:text-blue-400">/ 5 ou 100</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* AFFICHAGE DES TEXTES (Dernières réponses libres) */}
                        {stat.reponses_textes && (
                            <div className="mt-4">
                                {stat.reponses_textes.length === 0 ? (
                                    <p className="text-gray-500 italic text-sm">Aucune réponse écrite pour l'instant.</p>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dernières réponses :</p>
                                        {stat.reponses_textes.map((texte, i) => (
                                            <div key={i} className="bg-gray-50 dark:bg-fondSombre p-4 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 italic text-sm">
                                                « {texte} »
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* LE FAMEUX BOUTON RETOUR (Version Bas de page) */}
            <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
                <button 
                    onClick={() => navigate('/')} 
                    className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                    Retourner à la page d'accueil
                </button>
            </div>

        </div>
    );
}