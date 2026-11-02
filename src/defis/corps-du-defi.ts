import { Jour, type DefiTermineAEnregistrer } from "@domain/apprentissage";
import { enReponseEnvoyee, type ReponseEnvoyee } from "../seance/fin-de-seance/corps-de-la-seance.ts";

/** Le corps JSON attendu par l'Edge Function `terminer-le-defi`. */
export type CorpsDuDefi = {
  readonly id: string;
  readonly enfant: string;
  readonly defi: { readonly matiere: string; readonly niveau: string; readonly numero: number };
  readonly questions: readonly string[];
  readonly tirages: readonly (readonly string[])[];
  readonly reponses: readonly (readonly ReponseEnvoyee[])[];
  readonly termineeLe: string;
  readonly jour: string;
};

export function enCorpsDuDefi(envoi: DefiTermineAEnregistrer): CorpsDuDefi {
  return {
    id: envoi.id,
    enfant: envoi.enfant,
    defi: { matiere: envoi.defi.matiere.code, niveau: envoi.defi.niveau.valeur, numero: envoi.defi.numero },
    questions: envoi.questions.map(({ valeur }) => valeur),
    tirages: envoi.tirages,
    reponses: envoi.reponses.map((reponses) => reponses.map(enReponseEnvoyee)),
    termineeLe: envoi.termineeLe.toISOString(),
    jour: envoi.jour,
  };
}

function estUnJourValide(valeur: unknown): boolean {
  if (typeof valeur !== "string") return false;
  try {
    Jour.de(valeur);
    return true;
  } catch {
    return false;
  }
}

export function estUnCorpsDeDefi(valeur: unknown): valeur is CorpsDuDefi {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { id, enfant, defi, questions, tirages, reponses, termineeLe, jour } = valeur as Record<string, unknown>;
  return typeof id === "string" && typeof enfant === "string" && typeof defi === "object" && defi !== null &&
    Array.isArray(questions) && Array.isArray(tirages) && Array.isArray(reponses) && typeof termineeLe === "string" &&
    estUnJourValide(jour);
}
