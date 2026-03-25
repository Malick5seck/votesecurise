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
        <div className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in">
            {/* L'EN TÊTE DE LA CARTE */}
            <div className="flex justify-between items-start gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
                        <span className="text-blue-500 font-bold mr-3">Q{index + 1}</span>
                        {stat.titre}
                    </h3>
                    <span className="text-xs text-gray-400 mt-2 block uppercase tracking-wider">{stat.type.replace('_', ' ')}</span>
                </div>
                
                {nbReponsesQuestion > 0 && (
                    <span className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                        {nbReponsesQuestion} rép.
                    </span>
                )}
            </div>

            {/* Camembert */}
            {utiliserCamembert && stat.options && stat.options.length > 0 && (
                <div className="h-72 flex justify-center mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={stat.options} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="votes" nameKey="contenu" label={({ pourcentage }) => pourcentage > 0 ? `${pourcentage}%` : ''}>
                                {stat.options.map((e, i) => <Cell key={i} fill={couleursTheme[i % couleursTheme.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value, name, props) => [`${value} votes (${props.payload.pourcentage}%)`, 'Résultat']} />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Barres */}
            {utiliserBarres && stat.options && stat.options.length > 0 && (
                <div className="h-64 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stat.options} margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="contenu" tick={{ fill: '#6b7280', fontSize: 13 }} axisLine={false} tickLine={false} />
                            <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 13 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} formatter={(value, name, props) => [`${value} votes (${props.payload.pourcentage}%)`, 'Résultat']} />
                            <Bar dataKey="votes" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                {stat.options.map((entry, i) => <Cell key={`cell-${i}`} fill={couleursTheme[0]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Textes simples (Ranking, Matrix...) */}
            {!utiliserCamembert && !utiliserBarres && stat.options && stat.options.length > 0 && (
                <div className="mt-4 grid gap-3 grid-cols-1 md:grid-cols-2">
                    {stat.options.map((opt, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-fondSombre rounded-lg border border-gray-100 dark:border-gray-800">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{opt.contenu}</span>
                            <span className="font-bold text-blue-600">{opt.votes} votes</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Moyennes (Slider, Note) */}
            {stat.moyenne !== undefined && (
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-fondSombre p-5 rounded-xl border border-gray-100 dark:border-gray-800 mt-6">
                    <div className="text-3xl">🎯</div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-1">Score moyen</p>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            {stat.moyenne} <span className="text-base font-medium text-gray-500">/ {stat.type === 'slider' ? '100' : '5'}</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Réponses Textes libres */}
            {stat.reponses_textes && (
                <div className="mt-6">
                    {stat.reponses_textes.length === 0 ? (
                        <p className="text-gray-400 italic text-sm">Aucune réponse écrite pour le moment.</p>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-gray-500 mb-2 uppercase">Dernières réponses :</p>
                            {stat.reponses_textes.map((texte, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-fondSombre px-5 py-4 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm italic">
                                    "{texte}"
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}