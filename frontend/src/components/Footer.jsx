// Ce composant gère l'affichage du pied de page (Footer).
// Il sera affiché sur absolument toutes les pages de l'application.

export default function Footer() {
    return (
        // mt-auto : Permet de pousser le footer tout en bas de l'écran si le contenu est court
        // print:hidden : Cache le footer si l'utilisateur essaie d'imprimer la page
        <footer className="bg-primaire dark:bg-carteSombre text-white p-6 text-center mt-auto transition-colors duration-300 print:hidden">
            <p>© 2026 - Plateforme de Sondages Sécurisés</p>
        </footer>
    );
}