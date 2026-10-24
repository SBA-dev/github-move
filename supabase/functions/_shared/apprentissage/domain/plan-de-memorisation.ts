import type { ExerciceMemoriser, ExerciceOrdre, ExerciceTrous, Segment } from "../../catalogue/domain/index.ts";
import { motCacheDuVers, motsDuVers, peutEtreUnDistracteur } from "./mot-cache.ts";

const CONSIGNE_DE_L_ORDRE = "Remets les vers dans l'ordre.";
const CONSIGNE_DES_MOTS_CACHES = "Des mots se sont envolés ! Retrouve-les.";
const SEPARATEUR_DE_VERS = " / ";
const NOMBRE_DE_CHOIX_PAR_TROU = 3;

export class PlanDeMemorisation {
  private constructor(
    readonly ordreDesVers: ExerciceOrdre,
    readonly motsCaches: ExerciceTrous,
  ) {}

  static de(exercice: ExerciceMemoriser): PlanDeMemorisation {
    return new PlanDeMemorisation(
      {
        type: "ordre",
        titre: exercice.titre,
        consigne: CONSIGNE_DE_L_ORDRE,
        elements: exercice.vers,
      },
      motsCaches(exercice),
    );
  }
}

function motsCaches(exercice: ExerciceMemoriser): ExerciceTrous {
  const segments = segmentsDesVers(exercice.vers);
  const motsAttendus = segments.flatMap((segment) => segment.type === "trou" ? [segment.motAttendu] : []);
  return {
    type: "trous",
    titre: exercice.titre,
    consigne: CONSIGNE_DES_MOTS_CACHES,
    segments,
    motsAttendus,
    distracteurs: distracteursPour(exercice.vers, motsAttendus),
  };
}

function segmentsDesVers(vers: readonly string[]): readonly Segment[] {
  const segments: Segment[] = [];
  let texte = "";
  vers.forEach((unVers, rang) => {
    if (rang > 0) texte += SEPARATEUR_DE_VERS;
    const cache = motCacheDuVers(unVers);
    if (cache === undefined) {
      texte += unVers;
      return;
    }
    segments.push({ type: "texte", texte: texte + unVers.slice(0, cache.debut) });
    segments.push({ type: "trou", motAttendu: cache.mot });
    texte = unVers.slice(cache.debut + cache.mot.length);
  });
  if (texte !== "") segments.push({ type: "texte", texte });
  return segments;
}

function distracteursPour(vers: readonly string[], motsAttendus: readonly string[]): readonly string[] {
  const manquants = Math.max(0, NOMBRE_DE_CHOIX_PAR_TROU - new Set(motsAttendus).size);
  const candidats = vers.flatMap((unVers) => motsDuVers(unVers).map(({ mot }) => mot))
    .filter((mot) => peutEtreUnDistracteur(mot) && !motsAttendus.includes(mot));
  return [...new Set(candidats)].sort((a, b) => b.length - a.length).slice(0, manquants);
}
