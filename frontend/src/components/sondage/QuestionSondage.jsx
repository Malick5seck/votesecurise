import React from 'react';  

export default function QuestionSondage({ q, index, reponses, handleTextChange, handleRadioChange, handleCheckboxChange }) {
    return (
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-fondSombre rounded-xl border border-gray-100 dark:border-gray-600 transition-colors w-full overflow-hidden">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight break-words">
                <span className="text-[#3b82f6] mr-2 shrink-0">{index + 1}.</span> 
                {q.titre} 
                {q.obligatoire && <span className="text-red-500 ml-1 text-xl shrink-0" title="Cette question est obligatoire">*</span>}
            </h3>

            {['qcm', 'boolean', 'likert'].includes(q.type) && (
                <div className="space-y-3 w-full">
                    {q.options.map(opt => (
                        <label key={opt.id} className="flex items-start gap-3 p-3 sm:p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md group w-full">
                            <input 
                                type="radio" 
                                name={`q_${q.id}`} 
                                required={q.obligatoire}
                                onChange={() => handleRadioChange(q.id, opt.id)}
                                
                                className="mt-0.5 w-5 h-5 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 transition-transform group-hover:scale-110 cursor-pointer"
                            />
                           
                            <span className="flex-1 min-w-0 text-gray-800 dark:text-gray-200 leading-relaxed break-words">{opt.contenu}</span>
                        </label>
                    ))}
                </div>
            )}

            {q.type === 'checkbox' && (
                <div className="space-y-3 w-full">
                    {q.options.map(opt => (
                        <label key={opt.id} className="flex items-start gap-3 p-3 sm:p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md group w-full">
                            <input 
                                type="checkbox" 
                                onChange={(e) => handleCheckboxChange(q.id, opt.id, e.target.checked)}
                                className="mt-0.5 w-5 h-5 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-transform group-hover:scale-110 cursor-pointer"
                            />
                            <span className="flex-1 min-w-0 text-gray-800 dark:text-gray-200 leading-relaxed break-words">{opt.contenu}</span>
                        </label>
                    ))}
                </div>
            )}

            {q.type === 'text' && (
                <textarea 
                    required={q.obligatoire} 
                    rows="4" 
                    placeholder="Votre réponse ici..."
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    className="w-full p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y shadow-sm transition-shadow max-w-full"
                ></textarea>
            )}

            {q.type === 'date' && (
                <input 
                    type="date" 
                    required={q.obligatoire}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    className="w-full sm:w-auto p-3.5 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm transition-shadow cursor-pointer"
                />
            )}

            {q.type === 'number' && (
                <input 
                    type="number" 
                    required={q.obligatoire} 
                    placeholder="Ex: 42"
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    className="w-full sm:w-1/2 lg:w-1/3 p-3.5 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm transition-shadow"
                />
            )}


            {q.type === 'slider' && (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-carteSombre p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm w-full">
                    <input 
                        type="range" min="0" max="100" defaultValue="50"
                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                        className="w-full flex-1 min-w-0 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                    />
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 text-xl w-16 text-center shrink-0 bg-blue-50 dark:bg-blue-900/30 py-1.5 rounded-lg">
                        {reponses[q.id]?.valeur_texte || "50"}%
                    </span>
                </div>
            )}


            {q.type === 'rating' && (
                <div className="flex flex-wrap gap-2 text-4xl sm:text-5xl justify-center sm:justify-start py-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button 
                            key={star} type="button"
                            onClick={() => handleTextChange(q.id, star.toString())}
                            className={`transform transition-all duration-200 hover:scale-125 focus:outline-none shrink-0 ${(reponses[q.id]?.valeur_texte >= star) ? 'text-yellow-400 drop-shadow-md' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200 dark:hover:text-yellow-600'}`}
                            aria-label={`Noter ${star} sur 5`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            )}


            {['ranking', 'matrix', 'condition'].includes(q.type) && (
                <div className="space-y-3 w-full">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 italic break-words">
                        {q.type === 'ranking' && "Attribuez un numéro (1 pour votre préféré) à chaque option."}
                    </p>
                    {q.options.map(opt => (
                        <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all w-full">
                            <span className="flex-1 min-w-0 text-gray-800 dark:text-gray-200 font-medium leading-relaxed break-words">{opt.contenu}</span>
                            <input 
                                type={q.type === 'ranking' ? "number" : "text"} 
                                placeholder={q.type === 'ranking' ? "Rang (ex: 1)" : "Votre réponse..."}
                                min={q.type === 'ranking' ? "1" : undefined}
                                onChange={(e) => handleTextChange(`${q.id}_${opt.id}`, e.target.value)}
                                className="w-full sm:w-1/3 shrink-0 p-2.5 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none dark:bg-fondSombre dark:text-white text-sm"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
