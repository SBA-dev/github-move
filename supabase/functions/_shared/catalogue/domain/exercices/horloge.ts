import { LeconMalFormee } from "../erreurs.ts";
import { HeureDeLHorloge } from "../heure-de-l-horloge.ts";
import { liste, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";
import type { Niveau } from "../niveau.ts";
import { PrecisionDeLHeure } from "../precision-de-l-heure.ts";

const MODES = ["lire", "placer"] as const;
const MOMENTS = ["matin", "apres-midi"] as const;
const DERNIERE_HEURE_A_PLACER_AU_CP = 12;

export type ModeDHorloge = typeof MODES[number];
export type MomentDeLaJournee = typeof MOMENTS[number];

export type ItemDHorloge = Readonly<{
  heure: HeureDeLHorloge;
  moment?: MomentDeLaJournee;
  aide?: string;
}>;

export type ExerciceHorloge = Readonly<{
  type: "horloge";
  titre?: string;
  consigne?: string;
  mode: ModeDHorloge;
  precision: PrecisionDeLHeure;
  items: readonly ItemDHorloge[];
}>;

export function lireHorloge(
  brut: Objet,
  communs: { titre?: string; consigne?: string },
  niveau: Niveau,
): ExerciceHorloge {
  const mode = lireMode(brut.mode);
  const precision = lirePrecision(brut.precision, niveau);
  const items = liste(brut.items, "les items").map((item) => lireItem(item, precision));
  if (items.length === 0) throw new LeconMalFormee("l'exercice n'a aucun item");
  verifierLesHeuresDistinctes(items);
  if (mode === "placer" && niveau.valeur === "CP") verifierLesHeuresAPlacerAuCp(items);
  return Object.freeze({
    type: "horloge",
    titre: communs.titre,
    consigne: communs.consigne,
    mode,
    precision,
    items: Object.freeze(items),
  });
}

function lireMode(valeur: unknown): ModeDHorloge {
  const mode = MODES.find((connu) => connu === valeur);
  if (mode === undefined) throw new LeconMalFormee(`le mode doit être l'un de : ${MODES.join(", ")}`);
  return mode;
}

function lirePrecision(valeur: unknown, niveau: Niveau): PrecisionDeLHeure {
  if (valeur === undefined) return PrecisionDeLHeure.parDefaut(niveau);
  const precision = PrecisionDeLHeure.lire(texteRequis(valeur, "la précision"));
  if (!precision.permiseAu(niveau)) throw new LeconMalFormee("la précision est trop fine pour le niveau de la leçon");
  return precision;
}

function lireItem(brut: unknown, precision: PrecisionDeLHeure): ItemDHorloge {
  const item = brut as Objet;
  const heure = HeureDeLHorloge.lire(texteRequis(item.heure, "l'heure d'un item"));
  if (heure.heures === 0 && heure.minutes === 0 && heure.secondes === 0) {
    throw new LeconMalFormee("minuit n'est pas permis");
  }
  if (!precision.respectee(heure)) {
    throw new LeconMalFormee(`l'heure « ${heure.ecriture()} » ne respecte pas la précision de l'exercice`);
  }
  return Object.freeze({
    heure,
    moment: lireMoment(item.moment),
    aide: texteFacultatif(item.aide, "l'aide d'un item"),
  });
}

function lireMoment(valeur: unknown): MomentDeLaJournee | undefined {
  if (valeur === undefined) return undefined;
  const moment = MOMENTS.find((connu) => connu === valeur);
  if (moment === undefined) throw new LeconMalFormee(`le moment doit être l'un de : ${MOMENTS.join(", ")}`);
  return moment;
}

function verifierLesHeuresDistinctes(items: readonly ItemDHorloge[]): void {
  const doublon = items.some((item, rang) =>
    items.slice(rang + 1).some((autre) => autre.heure.egaleSurLeCadran(item.heure))
  );
  if (doublon) throw new LeconMalFormee("deux items montrent la même heure sur le cadran");
}

function verifierLesHeuresAPlacerAuCp(items: readonly ItemDHorloge[]): void {
  if (items.some((item) => item.heure.heures > DERNIERE_HEURE_A_PLACER_AU_CP)) {
    throw new LeconMalFormee("au CP, l'heure à placer est inférieure ou égale à 12 h");
  }
}
