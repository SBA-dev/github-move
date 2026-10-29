export function inviterARelever({ prenom, numeroDuDefi }: { prenom: string; numeroDuDefi: number }): string {
  return `Bravo ${prenom} ! Tu as réussi toutes les leçons avant le défi ${numeroDuDefi}. Tu veux le relever ?`;
}

export function parolesDeDebutDeDefi({ nombreDeLecons }: { nombreDeLecons: number }): string {
  return `Voici des questions de ${nombreDeLecons} leçons que tu connais. Prends ton temps, je suis avec toi !`;
}

export function parolesDeFinDeDefi(
  { prenom, numeroDuDefi, dejaReleve }: { prenom: string; numeroDuDefi: number; dejaReleve: boolean },
): string {
  const encore = dejaReleve ? "encore " : "";
  return `Bravo ${prenom} ! Tu as ${encore}relevé le défi ${numeroDuDefi} !`;
}

export function annonceDuDefiOuvert(numeroDuDefi: number): string {
  return `Le défi ${numeroDuDefi} est ouvert !`;
}

export function titreDuDefiReleve(): string {
  return "Défi relevé !";
}
