import React from 'react';  
export default function QuestionSondage({ q, index, reponses, handleTextChange, handleRadioChange, handleCheckboxChange }) {
    return (
        <div className="p-6 bg-gray-50 dark:bg-fondSombre rounded-xl border border-gray-100 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {index + 1}. {q.titre} {q.obligatoire && <span className="text-red-500">*</span>}
            </h3>

            {/* CHOIX UNIQUE */}
            {['qcm', 'boolean', 'likert'].includes(q.type) && (
                <div className="space-y-3">
                    {q.options.map(opt => (
                        <label key={opt.id} className="flex items-center gap-3 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                            <input 
                                type="radio" name={`q_${q.id}`} required={q.obligatoire}
                                onChange={() => handleRadioChange(q.id, opt.id)}
                                className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="text-gray-800 dark:text-gray-200">{opt.contenu}</span>
                        </label>
                    ))}
                </div>
            )}

            {/* CHOIX MULTIPLE */}
            {q.type === 'checkbox' && (
                <div className="space-y-3">
                    {q.options.map(opt => (
                        <label key={opt.id} className="flex items-center gap-3 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                            <input 
                                type="checkbox" 
                                onChange={(e) => handleCheckboxChange(q.id, opt.id, e.target.checked)}
                                className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-800 dark:text-gray-200">{opt.contenu}</span>
                        </label>
                    ))}
                </div>
            )}

            {/* TEXTE LIBRE */}
            {q.type === 'text' && (
                <textarea 
                    required={q.obligatoire} rows="4" placeholder="Votre réponse ici..."
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    className="w-full p-4 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y"
                ></textarea>
            )}

            {/* DATE */}
            {q.type === 'date' && (
                <input 
                    type="date" required={q.obligatoire}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    className="w-full sm:w-auto p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
            )}

            {/* NUMÉRIQUE */}
            {q.type === 'number' && (
                <input 
                    type="number" required={q.obligatoire} placeholder="Ex: 42"
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    className="w-full sm:w-1/2 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
            )}

            {/* SLIDER */}
            {q.type === 'slider' && (
                <div className="flex items-center gap-4 bg-white dark:bg-carteSombre p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <input 
                        type="range" min="0" max="100" defaultValue="50"
                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="font-bold text-blue-600 dark:text-blue-400 w-12 text-center">
                        {reponses[q.id]?.valeur_texte || "50"}%
                    </span>
                </div>
            )}

            {/* RATING */}
            {q.type === 'rating' && (
                <div className="flex gap-2 text-3xl">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button 
                            key={star} type="button"
                            onClick={() => handleTextChange(q.id, star.toString())}
                            className={`${(reponses[q.id]?.valeur_texte >= star) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} hover:text-yellow-500 transition-colors focus:outline-none`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            )}

            {/* TYPES AVANCÉS */}
            {['ranking', 'matrix', 'condition'].includes(q.type) && (
                <div className="space-y-3">
                    {q.options.map(opt => (
                        <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-white dark:bg-carteSombre border border-gray-200 dark:border-gray-600 rounded-lg">
                            <span className="text-gray-800 dark:text-gray-200 font-medium sm:w-1/2">{opt.contenu}</span>
                            <input 
                                type="text" placeholder="Votre réponse / Rang..."
                                onChange={(e) => handleTextChange(`${q.id}_${opt.id}`, e.target.value)}
                                className="w-full sm:w-1/2 p-2 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-fondSombre dark:text-white text-sm"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}