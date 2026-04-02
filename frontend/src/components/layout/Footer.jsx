// export default function Footer() {
//     return (
//         <footer className="bg-primaire dark:bg-carteSombre text-white p-6 text-center mt-auto transition-colors duration-300 print:hidden">
//             <p>© 2026 - Plateforme de Sondages Sécurisés</p>
//         </footer>
//     );
// }
export default function Footer() {
    return (
        // Remplacement de bg-primaire par la couleur exacte pour éviter les soucis
        <footer className="bg-[#3b82f6] dark:bg-gray-900 text-white py-6 px-4 text-center mt-auto transition-colors duration-300 print:hidden w-full">
            <div className="max-w-7xl mx-auto">
                <p className="text-sm md:text-base font-medium">
                    © 2026 - Plateforme de Sondages Sécurisés
                </p>
                {/* Ajout optionnel d'un sous-texte pour faire plus pro sur mobile */}
                <p className="text-xs text-blue-200 dark:text-gray-400 mt-1">
                    VotePulse - Tous droits réservés.
                </p>
            </div>
        </footer>
    );
}