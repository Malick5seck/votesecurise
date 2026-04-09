export default function EditeurQuestion({ 
    q, 
    index, 
    peutEtreSupprimee, 
    mettreAJourQuestion, 
    supprimerQuestion, 
    ajouterOption, 
    mettreAJourOption, 
    typesAvecOptions 
}) {
    return (
        <div className="bg-white dark:bg-carteSombre p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in relative w-full overflow-hidden">
            
            <div className="flex flex-col md:flex-row md:items-start lg:items-center gap-3 sm:gap-4 mb-5 w-full">
                
                <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-gray-300 flex flex-col gap-0.5 cursor-grab p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                            <div className="flex gap-0.5"><div className="w-1 h-1 bg-gray-300 rounded-full"></div><div className="w-1 h-1 bg-gray-300 rounded-full"></div></div>
                            <div className="flex gap-0.5"><div className="w-1 h-1 bg-gray-300 rounded-full"></div><div className="w-1 h-1 bg-gray-300 rounded-full"></div></div>
                            <div className="flex gap-0.5"><div className="w-1 h-1 bg-gray-300 rounded-full"></div><div className="w-1 h-1 bg-gray-300 rounded-full"></div></div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md shrink-0">
                            Q{index + 1}
                        </span>
                    </div>
                    
                    {peutEtreSupprimee && (
                        <button type="button" onClick={() => supprimerQuestion(q.id)} className="md:hidden text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 dark:bg-red-900/20 rounded-lg shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                    )}
                </div>
                
                <div className="w-full md:flex-1 min-w-0">
                    <input 
                        type="text" 
                        required 
                        value={q.titre} 
                        onChange={(e) => mettreAJourQuestion(q.id, 'titre', e.target.value)} 
                        placeholder="Texte de la question..." 
                        className="w-full p-2.5 sm:p-3 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white text-sm sm:text-base" 
                    />
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                    <select 
                        value={q.type} 
                        onChange={(e) => mettreAJourQuestion(q.id, 'type', e.target.value)}
                        className="w-full md:w-48 lg:w-56 p-2.5 sm:p-3 bg-white dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg text-sm sm:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer dark:text-white truncate"
                    >
                        <optgroup label="Choix">
                            <option value="qcm">Choix unique</option>
                            <option value="checkbox">Choix multiples</option>
                            <option value="boolean">Oui / Non</option>
                        </optgroup>
                        <optgroup label="Saisie libre">
                            <option value="text">Texte libre</option>
                            <option value="number">Numérique</option>
                            <option value="date">Date / Heure</option>
                        </optgroup>
                        <optgroup label="Échelles & Mesures">
                            <option value="rating">Note (Étoiles)</option>
                            <option value="likert">Échelle de Likert</option>
                            <option value="slider">Curseur (Slider)</option>
                        </optgroup>
                        <optgroup label="Avancé">
                            <option value="ranking">Classement (Ranking)</option>
                            <option value="matrix">Matrice (Grille)</option>
                            <option value="condition">Conditionnelle</option>
                        </optgroup>
                    </select>

                    {peutEtreSupprimee && (
                        <button type="button" onClick={() => supprimerQuestion(q.id)} className="hidden md:flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0" title="Supprimer la question">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                    )}
                </div>
            </div>

            {typesAvecOptions.includes(q.type) ? (
                <div className="ml-1 sm:ml-8 md:ml-10 space-y-3 w-full pr-1 sm:pr-8 md:pr-10">
                    {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2 sm:gap-3 animate-fade-in w-full">
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                            <input 
                                type="text" 
                                value={opt} 
                                onChange={(e) => mettreAJourOption(q.id, oIndex, e.target.value)}
                                placeholder={q.type === 'boolean' && oIndex === 0 ? "Ex: Oui" : q.type === 'boolean' && oIndex === 1 ? "Ex: Non" : `Option ${oIndex + 1}`}
                                
                                className="w-full p-2 sm:p-2.5 bg-gray-50/50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-lg text-sm sm:text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white"
                            />
                        </div>
                    ))}
                    <div className="pt-2">
                        <button type="button" onClick={() => ajouterOption(q.id)} className="text-[#3b82f6] hover:text-blue-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            Ajouter une option
                        </button>
                    </div>
                </div>
            ) : (
                <div className="ml-1 sm:ml-8 md:ml-10 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs sm:text-sm flex items-start sm:items-center gap-2 border border-blue-100 dark:border-blue-800 w-full sm:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                    Le champ de saisie apparaîtra automatiquement pour le votant.
                </div>
            )}
        </div>
    );
}