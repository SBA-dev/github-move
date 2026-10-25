import type { LeconId } from "../../apprentissage/domain/index.ts";
import type { CodeDeMatiere, Lecon } from "../../catalogue/domain/index.ts";
import type { EntreesDuSuivi, SeanceLue } from "./entrees-du-suivi.ts";
import { estDeLaClasseEnCours, meilleuresEtoilesDeLaLecon } from "./etat-de-la-lecon.ts";

export type EtoilesAffichees =
  | Readonly<{ genre: "etoiles"; nombre: number }>
  | Readonly<{ genre: "reussieAuTestDeDepart" }>
  | Readonly<{ genre: "aucune" }>;

export type MentionDeClasse = "classePrecedente" | "classeAuDessus";

export type LeconJouee = Readonly<{
  lecon: LeconId;
  titre: string;
  matiere: CodeDeMatiere;
  etoiles: EtoilesAffichees;
  erreursDeLaDerniereSeance?: number;
  derniereSeance: Date;
  mention?: MentionDeClasse;
}>;

export type TableauDesLeconsJouees = Readonly<{
  deLaClasseEnCours: readonly LeconJouee[];
  dAutresClasses: readonly LeconJouee[];
}>;

export function leconsJouees(entrees: EntreesDuSuivi): TableauDesLeconsJouees {
  const jouees = entrees.lecons
    .map((lecon) => leconJoueeOuAbsente(entrees, lecon))
    .filter((jouee): jouee is LeconJouee => jouee !== undefined)
    .sort(parDerniereSeanceDecroissantePuisTitre);
  return {
    deLaClasseEnCours: jouees.filter((jouee) => jouee.mention === undefined),
    dAutresClasses: jouees.filter((jouee) => jouee.mention !== undefined),
  };
}

function leconJoueeOuAbsente(entrees: EntreesDuSuivi, lecon: Lecon): LeconJouee | undefined {
  const derniere = derniereSeanceDe(entrees, lecon.id);
  const reussieAuTestDeDepart = entrees.leconsReussiesAuTestDeDepart.includes(lecon.id);
  const derniereSeance = derniere?.termineeLe ?? (reussieAuTestDeDepart ? entrees.testDeDepartFaitLe : undefined);
  if (derniereSeance === undefined) return undefined;
  return {
    lecon: lecon.id,
    titre: lecon.titre,
    matiere: lecon.matiere.code,
    etoiles: etoilesAfficheesDe(entrees, lecon.id, reussieAuTestDeDepart),
    ...(derniere && { erreursDeLaDerniereSeance: derniere.erreurs }),
    derniereSeance,
    ...mentionDe(entrees, lecon),
  };
}

function derniereSeanceDe(entrees: EntreesDuSuivi, lecon: LeconId): SeanceLue | undefined {
  return entrees.seances
    .filter((seance) => seance.lecon === lecon)
    .reduce<SeanceLue | undefined>(
      (plusRecente, seance) =>
        plusRecente === undefined || seance.termineeLe > plusRecente.termineeLe ? seance : plusRecente,
      undefined,
    );
}

function etoilesAfficheesDe(entrees: EntreesDuSuivi, lecon: LeconId, reussieAuTestDeDepart: boolean): EtoilesAffichees {
  const nombre = meilleuresEtoilesDeLaLecon(entrees, lecon);
  if (nombre > 0) return { genre: "etoiles", nombre };
  return reussieAuTestDeDepart ? { genre: "reussieAuTestDeDepart" } : { genre: "aucune" };
}

function mentionDe(entrees: EntreesDuSuivi, lecon: Lecon): { mention?: MentionDeClasse } {
  if (estDeLaClasseEnCours(entrees, lecon)) return {};
  return { mention: lecon.niveau.estAuDessusDe(entrees.enfant.niveau) ? "classeAuDessus" : "classePrecedente" };
}

function parDerniereSeanceDecroissantePuisTitre(a: LeconJouee, b: LeconJouee): number {
  return b.derniereSeance.getTime() - a.derniereSeance.getTime() || a.titre.localeCompare(b.titre, "fr");
}
