import { LeconMalFormee } from "../erreurs.ts";
import { listeDeTextes, listeFacultative, type Objet, texteRequis } from "../lecture.ts";

const CONSIGNE_PAR_DEFAUT = "Complète le texte : choisis le mot qui manque.";

export type Segment = Readonly<{ type: "texte"; texte: string }> | Readonly<{ type: "trou"; motAttendu: string }>;

export type ExerciceTrous = Readonly<{
  type: "trous";
  titre?: string;
  consigne: string;
  segments: readonly Segment[];
  motsAttendus: readonly string[];
  distracteurs: readonly string[];
}>;

export function lireTrous(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceTrous {
  const segments = decouper(texteRequis(brut.texte, "le texte à trous"));
  const motsAttendus = segments.flatMap((segment) => segment.type === "trou" ? [segment.motAttendu] : []);
  if (motsAttendus.length === 0) throw new LeconMalFormee("le texte n'a aucun trou");
  const distracteurs = listeDeTextes(listeFacultative(brut.distracteurs, "les distracteurs") ?? [], "les distracteurs");
  verifierQueChaqueTrouPropose2Choix(motsAttendus, distracteurs);
  return Object.freeze({
    type: "trous",
    titre: communs.titre,
    consigne: communs.consigne ?? CONSIGNE_PAR_DEFAUT,
    segments: Object.freeze(segments),
    motsAttendus: Object.freeze(motsAttendus),
    distracteurs,
  });
}

function decouper(texte: string): readonly Segment[] {
  const segments: Segment[] = [];
  let reste = texte;
  while (reste !== "") {
    const ouverture = reste.indexOf("[");
    const texteSeul = ouverture === -1 ? reste : reste.slice(0, ouverture);
    if (texteSeul.includes("]")) throw new LeconMalFormee("un crochet fermant n'a pas de crochet ouvrant");
    if (texteSeul !== "") segments.push(Object.freeze({ type: "texte", texte: texteSeul }));
    if (ouverture === -1) break;
    const fermeture = reste.indexOf("]", ouverture);
    const motAttendu = fermeture === -1 ? "" : reste.slice(ouverture + 1, fermeture);
    if (fermeture === -1 || motAttendu.includes("[")) throw new LeconMalFormee("un trou n'est pas fermé");
    if (motAttendu === "") throw new LeconMalFormee("un trou est vide");
    segments.push(Object.freeze({ type: "trou", motAttendu }));
    reste = reste.slice(fermeture + 1);
  }
  return segments;
}

function verifierQueChaqueTrouPropose2Choix(motsAttendus: readonly string[], distracteurs: readonly string[]): void {
  for (const motAttendu of motsAttendus) {
    const autresChoix = [...distracteurs, ...motsAttendus].filter((mot) => mot !== motAttendu);
    if (autresChoix.length === 0) {
      throw new LeconMalFormee(`le trou « ${motAttendu} » ne peut pas proposer deux choix`);
    }
  }
}
