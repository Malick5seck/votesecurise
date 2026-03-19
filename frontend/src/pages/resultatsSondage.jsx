import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

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
                setErreur(err.response?.data?.message || "Erreur lors du chargement des résultats.");
            } finally {
                setChargement(false);
            }
        };

        fetchResultats();
    }, [id]);

    // Fonction d'exportation PDF magique
    const exporterPDF = () => {
        if (!donnees) return;
        const titreOriginal = document.title;
        const nomFichier = `Resultats_${donnees.sondage.titre.replace(/\s+/g, '_')}`;
        document.title = nomFichier;
        window.print();
        document.title = titreOriginal;
    };

    if (chargement) return <div className="text-center py-20 text-gray-500 text-lg">Analyse des résultats en cours...</div>;
    
    if (erreur) return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
            <div className="bg-red-50 p-8 rounded-xl border border-red-200">
                <h2 className="text-xl font-bold text-red-700 mb-4">Accès refusé</h2>
                <p className="text-red-600 mb-6">{erreur}</p>
                <button onClick={() => navigate('/')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors mx-auto">
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );

    const { sondage, statistiques } = donnees;
    const couleursBarres = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    // Calcul du nombre total de réponses
    const totalReponses = statistiques.reduce((total, stat) => {
        if (stat.options) {
            return total + stat.options.reduce((sum, opt) => sum + opt.votes, 0);
        }
        return total;
    }, 0);

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 transition-colors duration-300">
            
            {/* EN-TÊTE VERSION PDF (Invisible à l'écran) */}
            <div className="hidden print:block mb-8 border-b pb-4 text-center">
                <h1 className="text-3xl font-extrabold text-black mb-2">{sondage.titre}</h1>
                <p className="text-gray-600">Rapport des résultats | {sondage.total_votes} participants uniques</p>
                <p className="text-gray-500 text-sm mt-1">Généré le {new Date().toLocaleDateString()}</p>
            </div>

            {/* EN-TÊTE ÉCRAN : IDENTIQUE À TON IMAGE, MAIS AVEC BOUTON ROUGE */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6 print:hidden">
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                        {sondage.titre}
                    </h1>
                    
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-5">
                        {sondage.description || "Consultez les statistiques détaillées de ce sondage."}
                    </p>

                    {/* LES BADGES GRIS POUR LES VOTANTS ET RÉPONSES */}
                    <div className="flex flex-wrap gap-3">
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                            {sondage.total_votes} votants
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-bold">
                            {totalReponses > 0 ? totalReponses : sondage.total_votes} réponses au total
                        </span>
                    </div>
                </div>
                
                {/* LE BOUTON EXPORT PDF EN ROUGE (bg-red-600) */}
                <div className="flex gap-3 mt-2 md:mt-0">
                    <button 
                        onClick={exporterPDF} 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* LISTE DES CARTES DE QUESTIONS */}
            <div className="space-y-8">
                {statistiques.map((stat, index) => {
                    const nbReponsesQuestion = stat.options ? stat.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;

                    return (
                        <div key={stat.id} className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 break-inside-avoid">
                            
                            {/* EN-TÊTE DE LA CARTE : Q1 Bleu et Badge du nombre de réponses */}
                            <div className="flex justify-between items-start gap-4 mb-8">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
                                    <span className="text-blue-500 font-bold mr-3">Q{index + 1}</span>
                                    {stat.titre}
                                </h3>
                                
                                {nbReponsesQuestion > 0 && (
                                    <span className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                                        {nbReponsesQuestion} rép.
                                    </span>
                                )}
                            </div>

                            {/* GRAPHIQUE RECHARTS */}
                            {stat.options && stat.options.length > 0 && (
                                <div className="h-64 mt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart 
                                            data={stat.options} 
                                            margin={{ top: 0, right: 20, left: -20, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis 
                                                dataKey="contenu" 
                                                tick={{ fill: '#6b7280', fontSize: 13 }} 
                                                axisLine={false} 
                                                tickLine={false} 
                                            />
                                            <YAxis 
                                                allowDecimals={false} 
                                                tick={{ fill: '#6b7280', fontSize: 13 }} 
                                                axisLine={false} 
                                                tickLine={false} 
                                            />
                                            <Tooltip 
                                                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                                formatter={(value, name, props) => [`${value} votes (${props.payload.pourcentage}%)`, 'Résultat']}
                                            />
                                            <Bar dataKey="votes" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                                {stat.options.map((entry, i) => (
                                                    <Cell key={`cell-${i}`} fill={couleursBarres[i % couleursBarres.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {/* MOYENNES (Si c'est une question de type note) */}
                            {stat.moyenne !== undefined && (
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-fondSombre p-5 rounded-xl border border-gray-100 dark:border-gray-800 mt-4">
                                    <div className="text-3xl">🎯</div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-1">Score moyen</p>
                                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                            {stat.moyenne} <span className="text-base font-medium text-gray-500">/ 5 ou 100</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* RÉPONSES TEXTES */}
                            {stat.reponses_textes && (
                                <div className="mt-6">
                                    {stat.reponses_textes.length === 0 ? (
                                        <p className="text-gray-400 italic text-sm">Aucune réponse écrite.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {stat.reponses_textes.map((texte, i) => (
                                                <div key={i} className="bg-gray-50 dark:bg-fondSombre px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm">
                                                    {texte}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* LE GROS BOUTON BLEU RETOUR */}
            <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-700 pt-8 print:hidden">
                <button 
                    onClick={() => navigate('/mes-sondages')} 
                    className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125-.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                    Retour aux sondages
                </button>
            </div>

        </div>
    );
}