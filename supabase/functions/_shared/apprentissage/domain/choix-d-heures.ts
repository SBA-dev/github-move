import { HeureDeLHorloge, type PrecisionDeLHeure } from "../../catalogue/domain/index.ts";

const HEURES_SUR_LE_CADRAN = 12;
const MINUTES_PAR_GRADUATION = 5;
const HEURES_PROPOSEES = 3;
const DECALAGES_D_HEURES = [1, -1, 2, -2, 3, -3];

/** La bonne heure et deux heures voisines : aiguilles lues à l'envers, puis heures d'à côté. */
export function heuresProposees(heure: HeureDeLHorloge, precision: PrecisionDeLHeure): HeureDeLHorloge[] {
  const candidates = [
    heureAuxAiguillesALEnvers(heure),
    ...DECALAGES_D_HEURES.map((decalage) => decaler(heure, decalage)),
  ]
    .filter((candidate): candidate is HeureDeLHorloge => candidate !== undefined && precision.respectee(candidate));
  const proposees = [heure];
  for (const candidate of candidates) {
    if (proposees.length === HEURES_PROPOSEES) break;
    if (!proposees.some((deja) => deja.egaleSurLeCadran(candidate))) proposees.push(candidate);
  }
  return proposees;
}

function heureAuxAiguillesALEnvers(heure: HeureDeLHorloge): HeureDeLHorloge | undefined {
  if (heure.secondes > 0 || heure.minutes % MINUTES_PAR_GRADUATION !== 0) return undefined;
  const heures = heure.minutes / MINUTES_PAR_GRADUATION || HEURES_SUR_LE_CADRAN;
  return ecrire(heures, (heure.heures % HEURES_SUR_LE_CADRAN) * MINUTES_PAR_GRADUATION, 0);
}

function decaler(heure: HeureDeLHorloge, decalage: number): HeureDeLHorloge {
  const surLeCadran = heure.heures % HEURES_SUR_LE_CADRAN || HEURES_SUR_LE_CADRAN;
  const decalee = ((surLeCadran - 1 + decalage + HEURES_SUR_LE_CADRAN) % HEURES_SUR_LE_CADRAN) + 1;
  const apresMidi = heure.heures > HEURES_SUR_LE_CADRAN;
  const heures = apresMidi && decalee !== HEURES_SUR_LE_CADRAN ? decalee + HEURES_SUR_LE_CADRAN : decalee;
  return ecrire(heures, heure.minutes, heure.secondes);
}

function ecrire(heures: number, minutes: number, secondes: number): HeureDeLHorloge {
  const deuxChiffres = (nombre: number) => String(nombre).padStart(2, "0");
  return HeureDeLHorloge.lire(`${heures}:${deuxChiffres(minutes)}:${deuxChiffres(secondes)}`);
}
