const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** « Vendredi 23 octobre », « Vendredi 1er janvier » : en français et avec une majuscule, quelle que soit la langue de l'appareil. */
export function dateEnToutesLettres(date: Date): string {
  const quantieme = date.getDate() === 1 ? "1er" : String(date.getDate());
  return `${JOURS[date.getDay()]} ${quantieme} ${MOIS[date.getMonth()]}`;
}

/** La date au format attendu par l'attribut `datetime` : le jour du calendrier de l'appareil. */
export function dateDuJourPourLesMachines(date: Date): string {
  const deuxChiffres = (nombre: number) => String(nombre).padStart(2, "0");
  return `${date.getFullYear()}-${deuxChiffres(date.getMonth() + 1)}-${deuxChiffres(date.getDate())}`;
}
