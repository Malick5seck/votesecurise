// import React from 'react';  
// export default function QuestionSondage({ q, index, reponses, handleTextChange, handleRadioChange, handleCheckboxChange }) {
//     return (
//         <div className="p-6 bg-gray-50 dark:bg-fondSombre rounded-xl border border-gray-100 dark:border-gray-600">
//             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
//                 {index + 1}. {q.titre} {q.obligatoire && <span className="text-red-500">*</span>}
//             </h3>

//             {/* CHOIX UNIQUE */}
//             {['qcm', 'boolean', 'likert'].includes(q.type) && (
//                 <div className="space-y-3">
//                     {q.options.map(opt => (
//                         <label key={opt.id} className="flex items-center gap-3 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
//                             <input 
//                                 type="radio" name={`q_${q.id}`} required={q.obligatoire}
//                                 onChange={() => handleRadioChange(q.id, opt.id)}
//                                 className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
//                             />
//                             <span className="text-gray-800 dark:text-gray-200">{opt.contenu}</span>
//                         </label>
//                     ))}
//                 </div>
//             )}

//             {/* CHOIX MULTIPLE */}
//             {q.type === 'checkbox' && (
//                 <div className="space-y-3">
//                     {q.options.map(opt => (
//                         <label key={opt.id} className="flex items-center gap-3 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
//                             <input 
//                                 type="checkbox" 
//                                 onChange={(e) => handleCheckboxChange(q.id, opt.id, e.target.checked)}
//                                 className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <span className="text-gray-800 dark:text-gray-200">{opt.contenu}</span>
//                         </label>
//                     ))}
//                 </div>
//             )}

//             {/* TEXTE LIBRE */}
//             {q.type === 'text' && (
//                 <textarea 
//                     required={q.obligatoire} rows="4" placeholder="Votre réponse ici..."
//                     onChange={(e) => handleTextChange(q.id, e.target.value)}
//                     className="w-full p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y"
//                 ></textarea>
//             )}

//             {/* DATE */}
//             {q.type === 'date' && (
//                 <input 
//                     type="date" required={q.obligatoire}
//                     onChange={(e) => handleTextChange(q.id, e.target.value)}
//                     className="w-full sm:w-auto p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
//                 />
//             )}

//             {/* NUMÉRIQUE */}
//             {q.type === 'number' && (
//                 <input 
//                     type="number" required={q.obligatoire} placeholder="Ex: 42"
//                     onChange={(e) => handleTextChange(q.id, e.target.value)}
//                     className="w-full sm:w-1/2 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
//                 />
//             )}

//             {/* SLIDER */}
//             {q.type === 'slider' && (
//                 <div className="flex items-center gap-4 bg-white dark:bg-carteSombre p-4 rounded-lg border border-gray-200 dark:border-gray-600">
//                     <input 
//                         type="range" min="0" max="100" defaultValue="50"
//                         onChange={(e) => handleTextChange(q.id, e.target.value)}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
//                     />
//                     <span className="font-bold text-blue-600 dark:text-blue-400 w-12 text-center">
//                         {reponses[q.id]?.valeur_texte || "50"}%
//                     </span>
//                 </div>
//             )}

//             {/* RATING */}
//             {q.type === 'rating' && (
//                 <div className="flex gap-2 text-3xl">
//                     {[1, 2, 3, 4, 5].map(star => (
//                         <button 
//                             key={star} type="button"
//                             onClick={() => handleTextChange(q.id, star.toString())}
//                             className={`${(reponses[q.id]?.valeur_texte >= star) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} hover:text-yellow-500 transition-colors focus:outline-none`}
//                         >
//                             ★
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {/* TYPES AVANCÉS */}
//             {['ranking', 'matrix', 'condition'].includes(q.type) && (
//                 <div className="space-y-3">
//                     {q.options.map(opt => (
//                         <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg">
//                             <span className="text-gray-800 dark:text-gray-200 font-medium sm:w-1/2">{opt.contenu}</span>
//                             <input 
//                                 type="text" placeholder="Votre réponse / Rang..."
//                                 onChange={(e) => handleTextChange(`${q.id}_${opt.id}`, e.target.value)}
//                                 className="w-full sm:w-1/2 p-2 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-fondSombre dark:text-white text-sm"
//                             />
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }
import React from 'react';  

export default function QuestionSondage({ q, index, reponses, handleTextChange, handleRadioChange, handleCheckboxChange }) {
    return (
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-fondSombre rounded-xl border border-gray-100 dark:border-gray-600 transition-colors">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                <span className="text-[#3b82f6] mr-2">{index + 1}.</span> 
                {q.titre} 
                {q.obligatoire && <span className="text-red-500 ml-1 text-xl" title="Cette question est obligatoire">*</span>}
            </h3>

            {/* CHOIX UNIQUE (Radio) */}
            {['qcm', 'boolean', 'likert'].includes(q.type) && (
                <div className="space-y-3">
                    {q.options.map(opt => (
                        <label key={opt.id} className="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md group">
                            <input 
                                type="radio" 
                                name={`q_${q.id}`} 
                                required={q.obligatoire}
                                onChange={() => handleRadioChange(q.id, opt.id)}
                                // 🔥 UX : Le bouton radio s'agrandit légèrement au survol de la ligne
                                className="mt-1 sm:mt-0 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 transition-transform group-hover:scale-110 cursor-pointer"
                            />
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">{opt.contenu}</span>
                        </label>
                    ))}
                </div>
            )}

            {/* CHOIX MULTIPLE (Checkbox) */}
            {q.type === 'checkbox' && (
                <div className="space-y-3">
                    {q.options.map(opt => (
                        <label key={opt.id} className="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md group">
                            <input 
                                type="checkbox" 
                                onChange={(e) => handleCheckboxChange(q.id, opt.id, e.target.checked)}
                                className="mt-1 sm:mt-0 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-transform group-hover:scale-110 cursor-pointer"
                            />
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">{opt.contenu}</span>
                        </label>
                    ))}
                </div>
            )}

            {/* TEXTE LIBRE */}
            {q.type === 'text' && (
                <textarea 
                    required={q.obligatoire} 
                    rows="4" 
                    placeholder="Votre réponse ici..."
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    className="w-full p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y shadow-sm transition-shadow"
                ></textarea>
            )}

            {/* DATE */}
            {q.type === 'date' && (
                <input 
                    type="date" 
                    required={q.obligatoire}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    className="w-full sm:w-auto p-3.5 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm transition-shadow cursor-pointer"
                />
            )}

            {/* NUMÉRIQUE */}
            {q.type === 'number' && (
                <input 
                    type="number" 
                    required={q.obligatoire} 
                    placeholder="Ex: 42"
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    // On empêche les flèches du navigateur (spin-button) pour un look plus propre sur certains navigateurs
                    className="w-full sm:w-1/2 lg:w-1/3 p-3.5 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm transition-shadow"
                />
            )}

            {/* SLIDER */}
            {q.type === 'slider' && (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-carteSombre p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <input 
                        type="range" min="0" max="100" defaultValue="50"
                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                        // Style personnalisé pour la barre
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                    />
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 text-xl w-16 text-center shrink-0 bg-blue-50 dark:bg-blue-900/30 py-1.5 rounded-lg">
                        {reponses[q.id]?.valeur_texte || "50"}%
                    </span>
                </div>
            )}

            {/* RATING (Étoiles) */}
            {q.type === 'rating' && (
                <div className="flex flex-wrap gap-2 text-4xl sm:text-5xl justify-center sm:justify-start py-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button 
                            key={star} type="button"
                            onClick={() => handleTextChange(q.id, star.toString())}
                            className={`transform transition-all duration-200 hover:scale-125 focus:outline-none ${(reponses[q.id]?.valeur_texte >= star) ? 'text-yellow-400 drop-shadow-md' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200 dark:hover:text-yellow-600'}`}
                            aria-label={`Noter ${star} sur 5`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            )}

            {/* TYPES AVANCÉS (Ranking, Matrix) */}
            {['ranking', 'matrix', 'condition'].includes(q.type) && (
                <div className="space-y-3">
                    {/* Message d'aide pour le votant */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 italic">
                        {q.type === 'ranking' && "Attribuez un numéro (1 pour votre préféré) à chaque option."}
                    </p>
                    {q.options.map(opt => (
                        <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                            <span className="text-gray-800 dark:text-gray-200 font-medium sm:w-2/3 leading-relaxed">{opt.contenu}</span>
                            <input 
                                type={q.type === 'ranking' ? "number" : "text"} 
                                placeholder={q.type === 'ranking' ? "Rang (ex: 1)" : "Votre réponse..."}
                                min={q.type === 'ranking' ? "1" : undefined}
                                onChange={(e) => handleTextChange(`${q.id}_${opt.id}`, e.target.value)}
                                className="w-full sm:w-1/3 p-2.5 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none dark:bg-fondSombre dark:text-white text-sm"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}