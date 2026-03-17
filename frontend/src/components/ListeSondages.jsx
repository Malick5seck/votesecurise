import { useState, useEffect } from 'react';
import api from '../api/axios'; // On importe notre configuration axios

export default function ListeSondages() {
    // États pour stocker les données, le chargement et les erreurs
    const [sondages, setSondages] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        // Fonction pour récupérer les données depuis Laravel
        const fetchSondages = async () => {
            try {
                const reponse = await api.get('/sondages');
                setSondages(reponse.data);
                setChargement(false);
            } catch (err) {
                console.error(err);
                setErreur('Impossible de charger les sondages. Vérifiez que votre serveur Laravel est allumé.');
                setChargement(false);
            }
        };

        fetchSondages();
    }, []);

    // Affichage pendant le chargement
    if (chargement) {
        return <p className="text-gray-500 dark:text-gray-400 mt-4">Chargement des sondages en cours...</p>;
    }

    // Affichage en cas d'erreur
    if (erreur) {
        return <p className="text-red-500 mt-4 font-semibold">{erreur}</p>;
    }

    // Affichage si la base de données est vide
    if (sondages.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400 mt-4">Aucun sondage n'est disponible pour le moment.</p>;
    }

    // Affichage des cartes de sondages
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {sondages.map((sondage) => (
                <div 
                    key={sondage.id} 
                    className="bg-white dark:bg-carteSombre p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 flex flex-col"
                >
                    <h3 className="text-xl font-bold mb-2 text-primaire dark:text-white line-clamp-2">
                        {sondage.titre}
                    </h3>
                    
                    {sondage.description && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                            {sondage.description}
                        </p>
                    )}
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {sondage.options ? sondage.options.length : 0} options
                        </span>
                        <button className="bg-secondaire hover:bg-emerald-600 text-white px-4 py-2 rounded shadow transition-colors">
                            Voir / Voter
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}