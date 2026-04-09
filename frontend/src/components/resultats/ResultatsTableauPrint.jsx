export default function ResultatsTableauPrint({ sondage, statistiques, participants }) {
    // Si on n'a pas de participants ou de statistiques, on n'affiche rien.
    if (!participants || !statistiques) return null;

    return (
        <div className="hidden print:block mb-8 bg-white p-4">
            
            {/* EN-TÊTE DU DOCUMENT */}
            <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
                <h1 className="text-3xl font-extrabold text-black mb-2 uppercase tracking-wide">{sondage.titre}</h1>
                <p className="text-sm text-gray-800 font-medium">Rapport détaillé des participations | <span className="font-bold">{sondage.votes_count || sondage.total_votes || 0} votes enregistrés</span></p>
                <p className="text-xs text-gray-500 mt-2">Document exporté le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()} depuis la plateforme VotePulse.</p>
            </div>

            {/* TABLEAU DES RÉSULTATS */}
            <table className="w-full text-left border-collapse text-[10px] md:text-xs font-sans table-auto">
                <thead className="bg-gray-100 text-gray-900">
                    <tr className="border-b-2 border-gray-800">
                        <th className="p-3 border border-gray-300 font-bold w-32">Horodateur</th>
                        
                        {!sondage.est_anonyme && (
                            <th className="p-3 border border-gray-300 font-bold">Identité</th>
                        )}
                        
                        {statistiques.map((q, i) => (
                            <th key={q.id} className="p-3 border border-gray-300 font-bold max-w-[250px]">
                                Q{i+1}. {q.titre}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-gray-800">
                    {participants.map((participant, index) => (
                        <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 break-inside-avoid">
                            <td className="p-3 border border-gray-300 whitespace-nowrap font-mono text-[10px]">
                                {participant.date}
                            </td>
                            
                            {!sondage.est_anonyme && (
                                <td className={`p-3 border border-gray-300 font-medium ${participant.identite === 'Anonyme' ? 'text-gray-500 italic' : 'text-black font-bold'}`}>
                                    {participant.identite}
                                </td>
                            )}
                            
                            {statistiques.map(q => (
                                <td key={q.id} className="p-3 border border-gray-300 break-words align-top">
                                    {participant.reponses[q.id] || <span className="text-gray-400">-</span>}
                                </td>
                            ))}
                        </tr>
                    ))}
                    
                    {participants.length === 0 && (
                        <tr>
                            <td colSpan={statistiques.length + (sondage.est_anonyme ? 1 : 2)} className="p-6 text-center text-gray-500 italic border border-gray-300">
                                Aucun vote enregistré pour ce sondage.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                <p>Fin du rapport.</p>
            </div>
        </div>
    );
}