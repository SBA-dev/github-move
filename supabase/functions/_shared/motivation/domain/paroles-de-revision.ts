export function accueillirEnRevision(): string {
  return "On révise les petites erreurs des jours passés. Chaque fois que tu réussis, l'erreur s'efface un peu plus !";
}

export function parolesDeFinDeRevision(
  { prenom, questionsJustes }: { prenom: string; questionsJustes: number },
): string {
  if (questionsJustes === 0) return `Merci ${prenom} ! Ces erreurs reviendront demain : on les effacera ensemble.`;
  const effacement = questionsJustes > 1 ? "erreurs s'effacent" : "erreur s'efface";
  return `Bravo ${prenom} ! ${questionsJustes} ${effacement} un peu plus.`;
}
