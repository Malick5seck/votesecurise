// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts';

// export default function ResultatsSondage() {
//     const { id } = useParams();
//     const navigate = useNavigate();
    
//     const [donnees, setDonnees] = useState(null);
//     const [chargement, setChargement] = useState(true);
//     const [erreur, setErreur] = useState('');

//     useEffect(() => {
//         const fetchResultats = async () => {
//             try {
//                 const reponse = await api.get(`/sondages/${id}/resultats`);
//                 setDonnees(reponse.data);
//             } catch (err) {
//                 setErreur(err.response?.data?.message || "Erreur lors du chargement des résultats.");
//             } finally {
//                 setChargement(false);
//             }
//         };
//         fetchResultats();
//     }, [id]);

//     const exporterPDF = () => {
//         if (!donnees) return;
//         const titreOriginal = document.title;
//         const nomFichier = `Resultats_${donnees.sondage.titre.replace(/\s+/g, '_')}`;
//         document.title = nomFichier;
//         window.print();
//         document.title = titreOriginal;
//     };

//     if (chargement) return <div className="text-center py-20 text-gray-500 text-lg">Analyse des résultats en cours...</div>;
//     if (erreur) return <div className="text-center py-20 text-red-500">{erreur}</div>;

//     const { sondage, statistiques, participants } = donnees;
//     const couleursTheme = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

//     // Calcul du nombre total de réponses
//     const totalReponses = statistiques.reduce((total, stat) => {
//         if (stat.options) {
//             return total + stat.options.reduce((sum, opt) => sum + opt.votes, 0);
//         }
//         return total;
//     }, 0);

//     return (
//         <div className="max-w-6xl mx-auto py-10 px-4 transition-colors duration-300">
            
//             {/* ✨ MAGIE CSS : On force l'impression en mode Paysage pour le tableau PDF ! */}
//             <style>{`
//                 @media print {
//                     @page { size: landscape; margin: 10mm; }
//                     body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//                 }
//             `}</style>

//             {/* ==================================================== */}
//             {/* PARTIE 1 : LE TABLEAU BRUT (CACHÉ SUR ÉCRAN, VISIBLE EN PDF) */}
//             {/* ==================================================== */}
//             <div className="hidden print:block mb-8">
//                 <div className="text-center mb-6">
//                     <h1 className="text-2xl font-bold text-black mb-1">{sondage.titre}</h1>
//                     <p className="text-sm text-gray-600">Rapport détaillé des participations | {sondage.total_votes} votes enregistrés</p>
//                     <p className="text-xs text-gray-400 mt-1">Export généré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}</p>
//                 </div>

//                 <table className="w-full text-left border-collapse text-[10px] md:text-xs font-sans">
//                     <thead>
//                         <tr className="bg-gray-100 border-b-2 border-gray-300">
//                             <th className="p-2 border border-gray-200">Horodateur</th>
//                             {/* LE CORRECTIF DU ZERO EST ICI AUSSI */}
//                             {!sondage.est_anonyme ? (
//                                 <th className="p-2 border border-gray-200">Identité</th>
//                             ) : null}
//                             {statistiques.map((q, i) => (
//                                 <th key={q.id} className="p-2 border border-gray-200 max-w-[200px]">Q{i+1}. {q.titre}</th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {participants?.map((participant, index) => (
//                             <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
//                                 <td className="p-2 border border-gray-200 whitespace-nowrap text-gray-600">{participant.date}</td>
//                                 {!sondage.est_anonyme ? (
//                                     <td className={`p-2 border border-gray-200 font-medium ${participant.identite === 'Anonyme' ? 'text-gray-400 italic' : 'text-gray-900'}`}>
//                                         {participant.identite}
//                                     </td>
//                                 ) : null}
//                                 {statistiques.map(q => (
//                                     <td key={q.id} className="p-2 border border-gray-200 text-gray-700 break-words">
//                                         {participant.reponses[q.id]}
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* ==================================================== */}
//             {/* PARTIE 2 : L'INTERFACE UTILISATEUR (VISIBLE SUR ÉCRAN, CACHÉ EN PDF) */}
//             {/* ==================================================== */}
//             <div className="print:hidden">
                
//                 {/* EN-TÊTE ÉCRAN AVEC DESCRIPTION ET BADGES GRIS */}
//                 <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
//                     <div className="flex-1">
//                         <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
//                             {sondage.titre}
//                         </h1>
                        
//                         {/* LA DESCRIPTION */}
//                         <p className="text-lg text-gray-500 dark:text-gray-400 mb-5">
//                             {sondage.description || "Consultez les statistiques détaillées de ce sondage."}
//                         </p>

//                         {/* LES BADGES GRIS ET LE BADGE ANONYME CORRIGÉ */}
//                         <div className="flex flex-wrap gap-3">
//                             <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
//                                 </svg>
//                                 {sondage.total_votes} votants
//                             </span>
//                             <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-bold">
//                                 {totalReponses > 0 ? totalReponses : sondage.total_votes} réponses au total
//                             </span>
                            
//                             {/* 🔥 LE FAMEUX CORRECTIF DU ZERO EST ICI 🔥 */}
//                             {sondage.est_anonyme ? (
//                                 <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 border border-blue-100">
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
//                                     100% Anonyme
//                                 </span>
//                             ) : null}
//                         </div>
//                     </div>
                    
//                     {/* LE BOUTON EXPORT SIMPLE */}
//                     <div className="flex gap-3 mt-2 md:mt-0">
//                         <button 
//                             onClick={exporterPDF} 
//                             className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
//                             Export PDF
//                         </button>
//                     </div>
//                 </div>

//                 {/* LES GRAPHIQUES */}
//                 <div className="space-y-8">
//                     {statistiques.map((stat, index) => {
//                         const nbReponsesQuestion = stat.options ? stat.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
//                         const utiliserCamembert = ['qcm', 'boolean'].includes(stat.type);
//                         const utiliserBarres = ['checkbox', 'likert'].includes(stat.type);

//                         return (
//                             <div key={stat.id} className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                
//                                 {/* L'EN TÊTE DE CARTE AVEC LE BADGE DE RÉPONSES DE RETOUR */}
//                                 <div className="flex justify-between items-start gap-4 mb-8">
//                                     <div>
//                                         <h3 className="text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
//                                             <span className="text-blue-500 font-bold mr-3">Q{index + 1}</span>
//                                             {stat.titre}
//                                         </h3>
//                                         <span className="text-xs text-gray-400 mt-2 block uppercase tracking-wider">{stat.type.replace('_', ' ')}</span>
//                                     </div>
                                    
//                                     {nbReponsesQuestion > 0 ? (
//                                         <span className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
//                                             {nbReponsesQuestion} rép.
//                                         </span>
//                                     ) : null}
//                                 </div>

//                                 {/* Camembert */}
//                                 {utiliserCamembert && stat.options && stat.options.length > 0 ? (
//                                     <div className="h-72 flex justify-center mt-2">
//                                         <ResponsiveContainer width="100%" height="100%">
//                                             <PieChart>
//                                                 <Pie data={stat.options} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="votes" nameKey="contenu" label={({ pourcentage }) => pourcentage > 0 ? `${pourcentage}%` : ''}>
//                                                     {stat.options.map((e, i) => <Cell key={i} fill={couleursTheme[i % couleursTheme.length]} />)}
//                                                 </Pie>
//                                                 <Tooltip formatter={(value, name, props) => [`${value} votes (${props.payload.pourcentage}%)`, 'Résultat']} />
//                                                 <Legend verticalAlign="bottom" height={36}/>
//                                             </PieChart>
//                                         </ResponsiveContainer>
//                                     </div>
//                                 ) : null}

//                                 {/* Barres */}
//                                 {utiliserBarres && stat.options && stat.options.length > 0 ? (
//                                     <div className="h-64 mt-2">
//                                         <ResponsiveContainer width="100%" height="100%">
//                                             <BarChart data={stat.options} margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
//                                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
//                                                 <XAxis dataKey="contenu" tick={{ fill: '#6b7280', fontSize: 13 }} axisLine={false} tickLine={false} />
//                                                 <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 13 }} axisLine={false} tickLine={false} />
//                                                 <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} formatter={(value, name, props) => [`${value} votes (${props.payload.pourcentage}%)`, 'Résultat']} />
//                                                 <Bar dataKey="votes" radius={[4, 4, 0, 0]} maxBarSize={50}>
//                                                     {stat.options.map((entry, i) => <Cell key={`cell-${i}`} fill={couleursTheme[0]} />)}
//                                                 </Bar>
//                                             </BarChart>
//                                         </ResponsiveContainer>
//                                     </div>
//                                 ) : null}

//                                 {/* Textes simples (Ranking, Matrix...) */}
//                                 {!utiliserCamembert && !utiliserBarres && stat.options && stat.options.length > 0 ? (
//                                     <div className="mt-4 grid gap-3 grid-cols-1 md:grid-cols-2">
//                                         {stat.options.map((opt, i) => (
//                                             <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-fondSombre rounded-lg border border-gray-100 dark:border-gray-800">
//                                                 <span className="font-medium text-gray-800 dark:text-gray-200">{opt.contenu}</span>
//                                                 <span className="font-bold text-blue-600">{opt.votes} votes</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : null}

//                                 {/* Moyennes (Slider, Note) */}
//                                 {stat.moyenne !== undefined ? (
//                                     <div className="flex items-center gap-4 bg-gray-50 dark:bg-fondSombre p-5 rounded-xl border border-gray-100 dark:border-gray-800 mt-6">
//                                         <div className="text-3xl">🎯</div>
//                                         <div>
//                                             <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-1">Score moyen</p>
//                                             <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
//                                                 {stat.moyenne} <span className="text-base font-medium text-gray-500">/ {stat.type === 'slider' ? '100' : '5'}</span>
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ) : null}

//                                 {/* Réponses Textes libres */}
//                                 {stat.reponses_textes ? (
//                                     <div className="mt-6">
//                                         {stat.reponses_textes.length === 0 ? (
//                                             <p className="text-gray-400 italic text-sm">Aucune réponse écrite pour le moment.</p>
//                                         ) : (
//                                             <div className="space-y-3">
//                                                 <p className="text-sm font-bold text-gray-500 mb-2 uppercase">Dernières réponses :</p>
//                                                 {stat.reponses_textes.map((texte, i) => (
//                                                     <div key={i} className="bg-gray-50 dark:bg-fondSombre px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm italic">
//                                                         "{texte}"
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 ) : null}
//                             </div>
//                         );
//                     })}
//                 </div>
                
//                 {/* LE GROS BOUTON BLEU DE RETOUR */}
//                 <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
//                     <button 
//                         onClick={() => navigate('/mes-sondages')} 
//                         className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125-.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
//                         </svg>
//                         Retour aux sondages
//                     </button>
//                 </div>
//             </div>

//         </div>
//     );
// }

// src/pages/resultatsSondage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Import de nos composants fraîchement créés
import ResultatsTableauPrint from '../components/ResultatsTableauPrint';
import StatistiqueCard from '../components/StatistiqueCard';

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

    const exporterPDF = () => {
        if (!donnees) return;
        const titreOriginal = document.title;
        const nomFichier = `Resultats_${donnees.sondage.titre.replace(/\s+/g, '_')}`;
        document.title = nomFichier;
        window.print();
        document.title = titreOriginal;
    };

    if (chargement) return <div className="text-center py-20 text-gray-500 text-lg">Analyse des résultats en cours...</div>;
    if (erreur) return <div className="text-center py-20 text-red-500">{erreur}</div>;

    const { sondage, statistiques, participants } = donnees;
    const couleursTheme = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    const totalReponses = statistiques.reduce((total, stat) => {
        if (stat.options) {
            return total + stat.options.reduce((sum, opt) => sum + opt.votes, 0);
        }
        return total;
    }, 0);

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 transition-colors duration-300">
            
            <style>{`
                @media print {
                    @page { size: landscape; margin: 10mm; }
                    body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>

            {/* PARTIE 1 : LE COMPOSANT DU TABLEAU (CACHÉ SUR ÉCRAN, VISIBLE EN PDF) */}
            <ResultatsTableauPrint 
                sondage={sondage} 
                statistiques={statistiques} 
                participants={participants} 
            />

            {/* PARTIE 2 : L'INTERFACE UTILISATEUR (VISIBLE SUR ÉCRAN, CACHÉ EN PDF) */}
            <div className="print:hidden animate-fade-in">
                
                {/* EN-TÊTE ÉCRAN */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                            {sondage.titre}
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-5">
                            {sondage.description || "Consultez les statistiques détaillées de ce sondage."}
                        </p>

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
                            
                            {sondage.est_anonyme && (
                                <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 border border-blue-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                    100% Anonyme
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <button onClick={exporterPDF} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm mt-2 md:mt-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        Export PDF
                    </button>
                </div>

                {/* LA BOUCLE MAGIQUE SUR LE NOUVEAU COMPOSANT */}
                <div className="space-y-8">
                    {statistiques.map((stat, index) => (
                        <StatistiqueCard 
                            key={stat.id} 
                            stat={stat} 
                            index={index} 
                            couleursTheme={couleursTheme} 
                        />
                    ))}
                </div>
                
                <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
                    <button onClick={() => navigate('/mes-sondages')} className="bg-[#3b82f6] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125-.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                        Retour aux sondages
                    </button>
                </div>
            </div>
        </div>
    );
}