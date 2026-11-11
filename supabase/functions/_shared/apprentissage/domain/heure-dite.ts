import { HeureDeLHorloge, Niveau } from "../../catalogue/domain/index.ts";
import { nombreEnLettres } from "./nombre-en-lettres.ts";

const HEURES_DU_JOUR = 24;
const MIDI = 12;
const MINUTES_DE_L_HEURE = 60;
const QUART = 15;
const DEMI_HEURE = 30;
const PREMIERE_MINUTE_DITE_AVEC_MOINS = 40;
const PAS_DES_MINUTES_DITES_AVEC_MOINS = 5;

const DERNIER_NIVEAU_SANS_MOINS = Niveau.de("CE1");
const DERNIER_NIVEAU_SANS_SECONDES = Niveau.de("CM1");

/** L'heure en mots, telle qu'on la dit à voix haute (aucun chiffre). */
export function heureDite(heure: HeureDeLHorloge, niveau: Niveau): string {
  if (secondesDites(heure, niveau)) {
    return `${heureSeule(heure.heures)} ${minutesEtSecondes(heure)}`;
  }
  if (heureDiteAvecMoins(heure, niveau)) return heureAvecMoins(heure);
  const heureEnMots = heureSeule(heure.heures);
  if (heure.minutes === QUART) return `${heureEnMots} et quart`;
  if (heure.minutes === DEMI_HEURE) return `${heureEnMots} et demie`;
  if (heure.minutes === 0) return heureEnMots;
  return `${heureEnMots} ${nombreEnLettres(heure.minutes, true)}`;
}

function secondesDites(heure: HeureDeLHorloge, niveau: Niveau): boolean {
  return heure.secondes > 0 && niveau.estAuDessusDe(DERNIER_NIVEAU_SANS_SECONDES);
}

function heureDiteAvecMoins(heure: HeureDeLHorloge, niveau: Niveau): boolean {
  return niveau.estAuDessusDe(DERNIER_NIVEAU_SANS_MOINS) &&
    heure.secondes === 0 &&
    heure.minutes >= PREMIERE_MINUTE_DITE_AVEC_MOINS &&
    heure.minutes % PAS_DES_MINUTES_DITES_AVEC_MOINS === 0;
}

function heureAvecMoins(heure: HeureDeLHorloge): string {
  const restant = MINUTES_DE_L_HEURE - heure.minutes;
  const reste = restant === QUART ? "le quart" : nombreEnLettres(restant);
  return `${heureSeule(heure.heures + 1)} moins ${reste}`;
}

function heureSeule(heures: number): string {
  const heureDuCadran = heures % HEURES_DU_JOUR;
  if (heureDuCadran === MIDI) return "midi";
  if (heureDuCadran === 0) return "minuit";
  const mots = nombreEnLettres(heureDuCadran, true);
  return heureDuCadran === 1 ? `${mots} heure` : `${mots} heures`;
}

function minutesEtSecondes(heure: HeureDeLHorloge): string {
  const secondes = unite(heure.secondes, "seconde");
  if (heure.minutes === 0) return `et ${secondes}`;
  return `${unite(heure.minutes, "minute")} et ${secondes}`;
}

function unite(quantite: number, nom: string): string {
  const mots = nombreEnLettres(quantite, true);
  return quantite === 1 ? `${mots} ${nom}` : `${mots} ${nom}s`;
}
