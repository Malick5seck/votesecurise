import { useMemo } from 'react';

export default function ModalBanUser({
    onConfirm,
    onCancel,
    motifValue,
    setMotifValue,
    durationPreset,
    setDurationPreset,
    customDays,
    setCustomDays
}) {
    const handleCancel = () => {
        if (setMotifValue) setMotifValue('');
        if (setCustomDays) setCustomDays('');
        onCancel();
    };

    // Vérifie si on est en mode personnalisé
    const isCustom = durationPreset === 'custom';
    
    // Détermine le nombre de jours actifs
    const activeDays = isCustom ? parseInt(customDays, 10) : parseInt(durationPreset, 10);

    // Validation : Le bouton est cliquable SI le motif est rempli ET (c'est permanent OU les jours > 0)
    const canSubmit = motifValue?.trim() && 
        (durationPreset === 'permanent' || (!isNaN(activeDays) && activeDays > 0));

    // Calcul automatique de la date de fin pour rassurer l'administrateur
    const dateFinEstimee = useMemo(() => {
        if (durationPreset === 'permanent') return 'Suspension définitive (à vie)';
        if (!isNaN(activeDays) && activeDays > 0) {
            const d = new Date();
            d.setDate(d.getDate() + activeDays);
            return `L'utilisateur pourra revenir le : ${d.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
        }
        return 'Veuillez saisir une durée valide.';
    }, [durationPreset, activeDays]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            {/* 🔥 RESPONSIVE : max-w-md w-full avec p-6 sur mobile et p-8 sur PC */}
            <div className="bg-white dark:bg-carteSombre p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-700 text-left">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl shadow-sm">
                    ⚠️
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    Suspendre ce compte
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 text-center leading-relaxed">
                    L'utilisateur ne pourra plus ouvrir les pages de vote ni soumettre de réponses pendant la durée choisie.
                </p>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                            Durée de suspension
                        </label>
                        <select
                            value={durationPreset}
                            onChange={(e) => {
                                setDurationPreset(e.target.value);
                                if (e.target.value !== 'custom' && setCustomDays) setCustomDays('');
                            }}
                            className="w-full px-3 py-3 rounded-xl bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 outline-none transition-shadow shadow-sm cursor-pointer"
                        >
                            <option value="7">7 jours</option>
                            <option value="30">1 mois (30 jours)</option>
                            <option value="90">3 mois (90 jours)</option>
                            <option value="365">1 an</option>
                            <option value="custom">Autre (Personnalisé)...</option>
                            <option value="permanent" className="font-bold text-red-600">Bannissement Permanent</option>
                        </select>
                    </div>

                    {/* Affichage conditionnel du champ personnalisé */}
                    {isCustom && (
                        <div className="animate-fade-in">
                            <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                Nombre de jours (manuel)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="3650"
                                value={customDays}
                                onChange={(e) => setCustomDays(e.target.value)}
                                placeholder="Ex: 14"
                                className="w-full p-3 bg-white dark:bg-fondSombre border border-red-200 dark:border-red-800/50 rounded-xl focus:ring-2 focus:ring-red-500 outline-none dark:text-white text-sm shadow-sm"
                            />
                        </div>
                    )}

                    {/* Aperçu de la date de fin */}
                    <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-800/30">
                        <p className="text-[11px] sm:text-xs font-medium text-red-800 dark:text-red-300 text-center flex items-center justify-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                            {dateFinEstimee}
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                            Motif (obligatoire)
                        </label>
                        <input
                            type="text"
                            value={motifValue}
                            onChange={(e) => setMotifValue(e.target.value)}
                            placeholder="Raison de la suspension…"
                            className="w-full p-3 bg-gray-50 dark:bg-fondSombre border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 outline-none dark:text-white text-sm shadow-sm"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={!canSubmit}
                        className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                        Suspendre
                    </button>
                </div>
            </div>
        </div>
    );
}