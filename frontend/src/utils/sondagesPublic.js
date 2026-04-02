export function sondagePublicEnCours(sondage, maintenant = new Date()) {
    if (sondage.est_prive) return false;
    const t = maintenant.getTime();
    if (sondage.date_fin && new Date(sondage.date_fin).getTime() <= t) return false;
    if (sondage.date_debut && new Date(sondage.date_debut).getTime() > t) return false;
    return true;
}

export function sondageAEstAccesRestreint(sondage) {
    const emails = sondage.emails_autorises;
    const liste = Array.isArray(emails) ? emails : [];
    return Boolean(sondage.domaine_restreint || liste.length > 0);
}

export function statutSuspensionUtilisateur(user) {
    if (!user?.ban_started_at) return null;
    if (!user.ban_until) return { type: 'permanent' };
    const end = new Date(user.ban_until);
    if (end.getTime() <= Date.now()) return null;
    return { type: 'jusquau', date: end };
}
