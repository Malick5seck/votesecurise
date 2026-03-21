// src/components/ResultatsTableauPrint.jsx
export default function ResultatsTableauPrint({ sondage, statistiques, participants }) {
    return (
        <div className="hidden print:block mb-8">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-black mb-1">{sondage.titre}</h1>
                <p className="text-sm text-gray-600">Rapport détaillé des participations | {sondage.total_votes} votes enregistrés</p>
                <p className="text-xs text-gray-400 mt-1">Export généré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}</p>
            </div>

            <table className="w-full text-left border-collapse text-[10px] md:text-xs font-sans">
                <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="p-2 border border-gray-200">Horodateur</th>
                        {!sondage.est_anonyme && (
                            <th className="p-2 border border-gray-200">Identité</th>
                        )}
                        {statistiques.map((q, i) => (
                            <th key={q.id} className="p-2 border border-gray-200 max-w-[200px]">Q{i+1}. {q.titre}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {participants?.map((participant, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-2 border border-gray-200 whitespace-nowrap text-gray-600">{participant.date}</td>
                            {!sondage.est_anonyme && (
                                <td className={`p-2 border border-gray-200 font-medium ${participant.identite === 'Anonyme' ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                                    {participant.identite}
                                </td>
                            )}
                            {statistiques.map(q => (
                                <td key={q.id} className="p-2 border border-gray-200 text-gray-700 break-words">
                                    {participant.reponses[q.id]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}