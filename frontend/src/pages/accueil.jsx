import ListeSondages from '../components/ListeSondages';

export default function Accueil() {
  return (
    <>
      <section className="container mx-auto p-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-4 text-primaire dark:text-secondaire">Accueil</h2>
        <p className="text-lg">
          Bienvenue sur notre plateforme de sondages sécurisés. Exprimez-vous en toute confiance, votre vote est unique et protégé.
        </p>
      </section>

      <div className="container mx-auto px-8"><div className="separateur-page"></div></div>

      <section className="container mx-auto p-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-4 text-primaire dark:text-secondaire">Nos Services</h2>
        <ul className="list-disc list-inside text-lg">
          <li>Création de sondages publics ou restreints</li>
          <li>Votes 100% anonymes et sécurisés</li>
          <li>Exportation des résultats en formats PDF et CSV</li>
        </ul>
      </section>

      <div className="container mx-auto px-8"><div className="separateur-page"></div></div>

      <section className="container mx-auto p-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-4 text-primaire dark:text-secondaire">Portfolio des Sondages</h2>
        <p className="text-lg">
          Découvrez nos derniers sondages publics et consultez les statistiques de participation en temps réel.
        </p>
        <ListeSondages />
      </section>

      <div className="container mx-auto px-8"><div className="separateur-page"></div></div>

      <section className="p-8 bg-primaire dark:bg-carteSombre text-white transition-colors duration-300 shadow-inner">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white dark:text-secondaire">À propos</h2>
          <p className="text-lg">
            Notre mission est de garantir la transparence totale. Nous avons conçu ce système pour qu'aucune fraude ne soit techniquement possible.
          </p>
        </div>
      </section>
    </>
  );
}