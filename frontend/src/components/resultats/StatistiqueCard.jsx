// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts';

// export default function StatistiqueCard({ stat, index, couleursTheme }) {
//     const nbReponsesQuestion = stat.options ? stat.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
//     const utiliserCamembert = ['qcm', 'boolean'].includes(stat.type);
//     const utiliserBarres = ['checkbox', 'likert'].includes(stat.type);

//     return (
//         <div className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in">
//             {/* L'EN TÊTE DE LA CARTE */}
//             <div className="flex justify-between items-start gap-4 mb-8">
//                 <div>
//                     <h3 className="text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
//                         <span className="text-blue-500 font-bold mr-3">Q{index + 1}</span>
//                         {stat.titre}
//                     </h3>
//                     <span className="text-xs text-gray-400 mt-2 block uppercase tracking-wider">{stat.type.replace('_', ' ')}</span>
//                 </div>
                
//                 {nbReponsesQuestion > 0 && (
//                     <span className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
//                         {nbReponsesQuestion} rép.
//                     </span>
//                 )}
//             </div>

//             {/* Camembert */}
//             {utiliserCamembert && stat.options && stat.options.length > 0 && (
//                 <div className="h-72 flex justify-center mt-2">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                             <Pie data={stat.options} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="votes" nameKey="contenu" label={({ pourcentage }) => pourcentage > 0 ? `${pourcentage}%` : ''}>
//                                 {stat.options.map((e, i) => <Cell key={i} fill={couleursTheme[i % couleursTheme.length]} />)}
//                             </Pie>
//                             <Tooltip formatter={(value, name, props) => [`${value} votes (${props.payload.pourcentage}%)`, 'Résultat']} />
//                             <Legend verticalAlign="bottom" height={36}/>
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>
//             )}

//             {/* Barres */}
//             {utiliserBarres && stat.options && stat.options.length > 0 && (
//                 <div className="h-64 mt-2">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={stat.options} margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
//                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
//                             <XAxis dataKey="contenu" tick={{ fill: '#6b7280', fontSize: 13 }} axisLine={false} tickLine={false} />
//                             <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 13 }} axisLine={false} tickLine={false} />
//                             <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} formatter={(value, name, props) => [`${value} votes (${props.payload.pourcentage}%)`, 'Résultat']} />
//                             <Bar dataKey="votes" radius={[4, 4, 0, 0]} maxBarSize={50}>
//                                 {stat.options.map((entry, i) => <Cell key={`cell-${i}`} fill={couleursTheme[0]} />)}
//                             </Bar>
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             )}

//             {/* Textes simples (Ranking, Matrix...) */}
//             {!utiliserCamembert && !utiliserBarres && stat.options && stat.options.length > 0 && (
//                 <div className="mt-4 grid gap-3 grid-cols-1 md:grid-cols-2">
//                     {stat.options.map((opt, i) => (
//                         <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-fondSombre rounded-lg border border-gray-100 dark:border-gray-800">
//                             <span className="font-medium text-gray-800 dark:text-gray-200">{opt.contenu}</span>
//                             <span className="font-bold text-blue-600">{opt.votes} votes</span>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Moyennes (Slider, Note) */}
//             {stat.moyenne !== undefined && (
//                 <div className="flex items-center gap-4 bg-gray-50 dark:bg-fondSombre p-5 rounded-xl border border-gray-100 dark:border-gray-800 mt-6">
//                     <div className="text-3xl">🎯</div>
//                     <div>
//                         <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-1">Score moyen</p>
//                         <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
//                             {stat.moyenne} <span className="text-base font-medium text-gray-500">/ {stat.type === 'slider' ? '100' : '5'}</span>
//                         </p>
//                     </div>
//                 </div>
//             )}

//             {/* Réponses Textes libres */}
//             {stat.reponses_textes && (
//                 <div className="mt-6">
//                     {stat.reponses_textes.length === 0 ? (
//                         <p className="text-gray-400 italic text-sm">Aucune réponse écrite pour le moment.</p>
//                     ) : (
//                         <div className="space-y-3">
//                             <p className="text-sm font-bold text-gray-500 mb-2 uppercase">Dernières réponses :</p>
//                             {stat.reponses_textes.map((texte, i) => (
//                                 <div key={i} className="bg-gray-50 dark:bg-fondSombre px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm italic">
//                                     "{texte}"
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts';

export default function StatistiqueCard({ stat, index, couleursTheme }) {
    const nbReponsesQuestion = stat.options ? stat.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
    const utiliserCamembert = ['qcm', 'boolean'].includes(stat.type);
    const utiliserBarres = ['checkbox', 'likert'].includes(stat.type);

    return (
        <div className="bg-white dark:bg-carteSombre p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in break-inside-avoid">
            
            {/* L'EN TÊTE DE LA CARTE */}
            <div className="flex justify-between items-start gap-3 md:gap-4 mb-6 md:mb-8">
                <div>
                    <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white leading-tight md:leading-relaxed">
                        <span className="text-[#3b82f6] font-bold mr-2 md:mr-3">Q{index + 1}</span>
                        {stat.titre}
                    </h3>
                    <span className="text-[10px] md:text-xs text-gray-400 mt-2 block uppercase tracking-wider font-bold">
                        Type: {stat.type.replace('_', ' ')}
                    </span>
                </div>
                
                {nbReponsesQuestion > 0 && (
                    <span className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm shrink-0">
                        {nbReponsesQuestion} rép.
                    </span>
                )}
            </div>

            {/* GRAPHIQUE 1 : Camembert (PieChart) pour QCM et Oui/Non */}
            {utiliserCamembert && stat.options && stat.options.length > 0 && (
                <div className="h-64 md:h-72 flex justify-center mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={stat.options} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={window.innerWidth < 768 ? 40 : 60} // Plus petit sur mobile
                                outerRadius={window.innerWidth < 768 ? 70 : 100} 
                                paddingAngle={3} 
                                dataKey="votes" 
                                nameKey="contenu" 
                                label={({ pourcentage }) => pourcentage > 0 ? `${pourcentage}%` : ''}
                                labelLine={false}
                            >
                                {stat.options.map((e, i) => <Cell key={i} fill={couleursTheme[i % couleursTheme.length]} />)}
                            </Pie>
                            <Tooltip 
                                formatter={(value, name, props) => [`${value} vote(s) (${props.payload.pourcentage}%)`, props.payload.contenu]} 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '10px 15px' }}
                            />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* GRAPHIQUE 2 : Barres (BarChart) pour Choix Multiples et Likert */}
            {utiliserBarres && stat.options && stat.options.length > 0 && (
                <div className="h-64 mt-4 md:mt-2 -ml-4 md:ml-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stat.options} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                            
                            {/* Les étiquettes (X) sont parfois trop longues, on réduit la police sur mobile */}
                            <XAxis 
                                dataKey="contenu" 
                                tick={{ fill: '#6b7280', fontSize: window.innerWidth < 768 ? 10 : 12 }} 
                                axisLine={false} 
                                tickLine={false} 
                            />
                            <YAxis 
                                allowDecimals={false} 
                                tick={{ fill: '#6b7280', fontSize: 12 }} 
                                axisLine={false} 
                                tickLine={false} 
                            />
                            
                            <Tooltip 
                                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                                formatter={(value, name, props) => [`${value} vote(s) (${props.payload.pourcentage}%)`, props.payload.contenu]} 
                            />
                            
                            {/* CORRECTION ICI : Le <Bar> est bien à la racine du BarChart */}
                            <Bar dataKey="votes" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                {stat.options.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={couleursTheme[i % couleursTheme.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* LISTE : Textes simples (Ranking, Matrix...) */}
            {!utiliserCamembert && !utiliserBarres && stat.options && stat.options.length > 0 && (
                <div className="mt-4 grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2">
                    {stat.options.map((opt, i) => (
                        <div key={i} className="flex justify-between items-center p-3 md:p-4 bg-gray-50 dark:bg-fondSombre rounded-lg border border-gray-100 dark:border-gray-800 transition-colors hover:border-blue-200">
                            <span className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-200 truncate pr-4" title={opt.contenu}>
                                {opt.contenu}
                            </span>
                            <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded text-xs md:text-sm whitespace-nowrap">
                                {opt.votes} vote(s)
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* MOYENNES : (Slider, Note) */}
            {stat.moyenne !== undefined && (
                <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-fondSombre p-5 md:p-6 rounded-xl border border-blue-100 dark:border-gray-700 mt-6 shadow-sm">
                    <div className="text-3xl md:text-4xl bg-white dark:bg-gray-700 p-3 rounded-full shadow-sm">
                        {stat.type === 'slider' ? '🎚️' : '⭐'}
                    </div>
                    <div>
                        <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Score moyen global</p>
                        <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                            {stat.moyenne} <span className="text-base md:text-lg font-medium text-gray-400">/ {stat.type === 'slider' ? '100' : '5'}</span>
                        </p>
                    </div>
                </div>
            )}

            {/* RÉPONSES TEXTES : (Texte libre) */}
            {stat.reponses_textes && (
                <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
                    {stat.reponses_textes.length === 0 ? (
                        <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-fondSombre rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-400 dark:text-gray-500 italic text-sm md:text-base text-center">Aucune réponse rédigée pour le moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 md:space-y-4">
                            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Aperçu des réponses rédigées :</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {stat.reponses_textes.slice(0, 6).map((texte, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-fondSombre px-4 md:px-5 py-3 md:py-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative group hover:border-blue-200 transition-colors">
                                        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed italic">
                                            "{texte}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {stat.reponses_textes.length > 6 && (
                                <p className="text-xs text-center text-gray-400 mt-4 italic">+ {stat.reponses_textes.length - 6} autres réponses masquées.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}