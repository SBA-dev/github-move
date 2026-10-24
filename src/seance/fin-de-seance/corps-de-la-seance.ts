import type { ChoixDeSeance, ReponseDonnee, SeanceTermineeAEnregistrer } from "@domain/apprentissage";

type ReponseEnvoyee =
  | { readonly choix: string }
  | { readonly placement: { readonly etiquette: string; readonly groupe?: string } }
  | { readonly motEcrit: readonly string[] }
  | { readonly jeNeSaisPas: true };

/** Le corps JSON attendu par l'Edge Function `terminer-la-seance`. */
export type CorpsDeLaSeance = {
  readonly seance: string;
  readonly enfant: string;
  readonly lecon: string;
  readonly choix: ChoixDeSeance;
  readonly tirages: readonly (readonly string[])[];
  readonly reponses: readonly (readonly ReponseEnvoyee[])[];
  readonly termineeLe: string;
};

function enReponseEnvoyee(reponse: ReponseDonnee): ReponseEnvoyee {
  switch (reponse.genre) {
    case "choix":
      return { choix: reponse.texte };
    case "placement":
      return { placement: reponse.groupe === undefined ? { etiquette: reponse.etiquette } : { etiquette: reponse.etiquette, groupe: reponse.groupe } };
    case "motEcrit":
      return { motEcrit: reponse.lettres };
    case "jeNeSaisPas":
      return { jeNeSaisPas: true };
  }
}

export function enCorps(envoi: SeanceTermineeAEnregistrer): CorpsDeLaSeance {
  return {
    seance: envoi.seance,
    enfant: envoi.enfant,
    lecon: envoi.lecon,
    choix: envoi.choix,
    tirages: envoi.tirages,
    reponses: envoi.reponses.map((reponses) => reponses.map(enReponseEnvoyee)),
    termineeLe: envoi.termineeLe.toISOString(),
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Un profil préparé pour les tests n'a pas d'identifiant UUID : il n'existe pas côté serveur. */
export function estUnIdentifiantDeProfil(valeur: string): boolean {
  return UUID.test(valeur);
}

export function estUnCorpsDeSeance(valeur: unknown): valeur is CorpsDeLaSeance {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { seance, enfant, lecon, choix, tirages, reponses, termineeLe } = valeur as Record<string, unknown>;
  return typeof seance === "string" && typeof enfant === "string" && typeof lecon === "string" &&
    typeof choix === "object" && choix !== null && Array.isArray(tirages) && Array.isArray(reponses) &&
    typeof termineeLe === "string";
}
