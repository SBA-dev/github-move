import { vocatif } from "./vocatif.ts";

export function accueillirEnRevision(): string {
  return "On révise les petites erreurs des jours passés. Chaque fois que tu réussis, l'erreur s'efface un peu plus !";
}

function finDeRevision(questionsJustes: number, prenom?: string): string {
  if (questionsJustes === 0) {
    return `Merci${vocatif(prenom)} ! Ces erreurs reviendront demain : on les effacera ensemble.`;
  }
  const effacement = questionsJustes > 1 ? "erreurs s'effacent" : "erreur s'efface";
  return `Bravo${vocatif(prenom)} ! ${questionsJustes} ${effacement} un peu plus.`;
}

export function parolesDeFinDeRevision(
  { prenom, questionsJustes }: { prenom: string; questionsJustes: number },
): string {
  return finDeRevision(questionsJustes, prenom);
}

export function parolesDeFinDeRevisionSansPrenom({ questionsJustes }: { questionsJustes: number }): string {
  return finDeRevision(questionsJustes);
}

export function annonceDeLaSeanceDeRevision(nombreDeQuestionsDues: number): string {
  const pluriel = nombreDeQuestionsDues > 1 ? "petites erreurs" : "petite erreur";
  return `${nombreDeQuestionsDues} ${pluriel} des jours passés`;
}
