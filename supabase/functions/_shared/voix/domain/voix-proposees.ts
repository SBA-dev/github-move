import { estTresNaturelle, type VoixDisponible, voixFrancaisesTriees } from "./voix-disponible.ts";

const NOM_VOIX_AUTOMATIQUE = "Automatique (recommandé)";

export type VoixProposee = {
  readonly nom: string;
  readonly nomDeLaVoix: string;
  readonly mention: string | undefined;
};

function mentionDeLaVoix(voix: VoixDisponible, estLaMeilleure: boolean): string | undefined {
  if (estTresNaturelle(voix)) return "très naturelle";
  return estLaMeilleure ? "la meilleure ici" : undefined;
}

export function voixProposees(voix: readonly VoixDisponible[]): VoixProposee[] {
  const francaises = voixFrancaisesTriees(voix);
  const [meilleure] = francaises;
  return [
    {
      nom: NOM_VOIX_AUTOMATIQUE,
      nomDeLaVoix: "",
      mention: meilleure && `actuellement : ${meilleure.nom}`,
    },
    ...francaises.map((v, rang) => ({
      nom: v.nom,
      nomDeLaVoix: v.nom,
      mention: mentionDeLaVoix(v, rang === 0),
    })),
  ];
}
