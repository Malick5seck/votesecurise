import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts';

export default function StatistiqueCard({ stat, index, couleursTheme }) {
    const nbReponsesQuestion = stat.options ? stat.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
    const utiliserCamembert = ['qcm', 'boolean'].includes(stat.type);
    const utiliserBarres = ['checkbox', 'likert'].includes(stat.type);

    return (
        <div className="bg-white dark:bg-carteSombre p-4 sm:p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in break-inside-avoid w-full overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-3 md:gap-4 mb-6 md:mb-8 w-full">
                <div className="w-full min-w-0 flex-1">
                    <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white leading-tight md:leading-relaxed break-words">
                        <span className="text-[#3b82f6] font-bold mr-2 md:mr-3 shrink-0">Q{index + 1}</span>
                        {stat.titre}
                    </h3>
                    <span className="text-[10px] md:text-xs text-gray-400 mt-2 block uppercase tracking-wider font-bold">
                        Type: {stat.type.replace('_', ' ')}
                    </span>
                </div>
                
                {nbReponsesQuestion > 0 && (
                    <div className="shrink-0 self-start">
                        <span className="inline-block bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm">
                            {nbReponsesQuestion} rép.
                        </span>
                    </div>
                )}
            </div>

            {utiliserCamembert && stat.options && stat.options.length > 0 && (
                <div className="h-72 md:h-80 min-h-[250px] flex justify-center mt-2 w-full">
                    <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                        <PieChart>
                            <Pie 
                                data={stat.options} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={window.innerWidth < 768 ? 40 : 60} 
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
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '10px 15px', maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}
                            />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: window.innerWidth < 768 ? '10px' : '12px', width: '100%', padding: '0 10px' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {utiliserBarres && stat.options && stat.options.length > 0 && (
                <div className="h-72 md:h-80 min-h-[250px] mt-4 md:mt-2 -ml-6 sm:-ml-4 md:ml-0 w-full">
                    <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                        <BarChart data={stat.options} margin={{ top: 10, right: 10, left: window.innerWidth < 768 ? -25 : -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                            
                            <XAxis 
                                dataKey="contenu" 
                                tick={{ fill: '#6b7280', fontSize: window.innerWidth < 768 ? 9 : 12 }} 
                                axisLine={false} 
                                tickLine={false} 
                                tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                            />
                            <YAxis 
                                allowDecimals={false} 
                                tick={{ fill: '#6b7280', fontSize: window.innerWidth < 768 ? 10 : 12 }} 
                                axisLine={false} 
                                tickLine={false} 
                            />
                            
                            <Tooltip 
                                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }} 
                                formatter={(value, name, props) => [`${value} vote(s) (${props.payload.pourcentage}%)`, props.payload.contenu]} 
                            />
                            
                            <Bar dataKey="votes" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                {stat.options.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={couleursTheme[i % couleursTheme.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {!utiliserCamembert && !utiliserBarres && stat.options && stat.options.length > 0 && (
                <div className="mt-4 grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2 w-full">
                    {stat.options.map((opt, i) => (
                        <div key={i} className="flex justify-between items-center p-3 md:p-4 bg-gray-50 dark:bg-fondSombre rounded-lg border border-gray-100 dark:border-gray-800 transition-colors hover:border-blue-200 w-full min-w-0">
                            <div className="min-w-0 flex-1 pr-3">
                                <span className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-200 block truncate" title={opt.contenu}>
                                    {opt.contenu}
                                </span>
                            </div>
                            <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded text-xs md:text-sm whitespace-nowrap shrink-0">
                                {opt.votes} vote(s)
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {stat.moyenne !== undefined && (
                <div className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-fondSombre p-4 sm:p-5 md:p-6 rounded-xl border border-blue-100 dark:border-gray-700 mt-6 shadow-sm w-full">
                    <div className="text-2xl sm:text-3xl md:text-4xl bg-white dark:bg-gray-700 p-2.5 sm:p-3 rounded-full shadow-sm shrink-0">
                        {stat.type === 'slider' ? '🎚️' : '⭐'}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider mb-0.5 sm:mb-1 truncate">Score moyen global</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white truncate">
                            {stat.moyenne} <span className="text-sm sm:text-base md:text-lg font-medium text-gray-400">/ {stat.type === 'slider' ? '100' : '5'}</span>
                        </p>
                    </div>
                </div>
            )}

            {stat.reponses_textes && (
                <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6 w-full">
                    {stat.reponses_textes.length === 0 ? (
                        <div className="flex items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-fondSombre rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-400 dark:text-gray-500 italic text-sm md:text-base text-center break-words">Aucune réponse rédigée pour le moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 md:space-y-4 w-full">
                            <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider truncate">Aperçu des réponses rédigées :</p>
                            <div className="grid gap-3 sm:grid-cols-2 w-full">
                                {stat.reponses_textes.slice(0, 6).map((texte, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-fondSombre px-4 md:px-5 py-3 md:py-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative group hover:border-blue-200 transition-colors w-full min-w-0">
                                        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed italic break-words">
                                            "{texte}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {stat.reponses_textes.length > 6 && (
                                <p className="text-[10px] sm:text-xs text-center text-gray-400 mt-3 sm:mt-4 italic break-words">+ {stat.reponses_textes.length - 6} autres réponses masquées.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}