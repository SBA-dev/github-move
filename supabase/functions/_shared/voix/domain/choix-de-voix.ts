import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import {
  estFeminine,
  estMasculine,
  scoreDeLaVoix,
  type VoixDisponible,
  voixFrancaisesTriees,
} from "./voix-disponible.ts";

const ECART_DE_SCORE_TOLERE = 15;

export type ChoixDeVoix =
  | { readonly type: "automatique" }
  | { readonly type: "imposee"; readonly nomDeLaVoix: string };

const AUTOMATIQUE: ChoixDeVoix = { type: "automatique" };

export const ChoixDeVoix = {
  automatique: AUTOMATIQUE,
  imposee(nomDeLaVoix: string): ChoixDeVoix {
    return nomDeLaVoix === "" ? AUTOMATIQUE : { type: "imposee", nomDeLaVoix };
  },
};

function voixImposeePresente(
  voix: readonly VoixDisponible[],
  choix: ChoixDeVoix,
): VoixDisponible | undefined {
  if (choix.type === "automatique") return undefined;
  return voixFrancaisesTriees(voix).find((v) => v.nom === choix.nomDeLaVoix);
}

export function voixMontreeCommeChoisie(
  voix: readonly VoixDisponible[],
  choix: ChoixDeVoix,
): VoixDisponible | "automatique" {
  return voixImposeePresente(voix, choix) ?? "automatique";
}

function voixAutomatique(
  voix: readonly VoixDisponible[],
  caractere: CaractereDeLaVoix,
): VoixDisponible | undefined {
  const [meilleure, ...autres] = voixFrancaisesTriees(voix);
  if (!meilleure) return undefined;
  const estDuBonSexe = caractere.sexe === "masculine" ? estMasculine : estFeminine;
  const scoreMinimal = scoreDeLaVoix(meilleure) - ECART_DE_SCORE_TOLERE;
  return [meilleure, ...autres].find((v) => estDuBonSexe(v) && scoreDeLaVoix(v) >= scoreMinimal) ?? meilleure;
}

export function choisirVoix(
  voix: readonly VoixDisponible[],
  caractere: CaractereDeLaVoix,
  choix: ChoixDeVoix = ChoixDeVoix.automatique,
): VoixDisponible | undefined {
  return voixImposeePresente(voix, choix) ?? voixAutomatique(voix, caractere);
}

export const CARACTERE_LANGUE_ETRANGERE: CaractereDeLaVoix = {
  sexe: "feminine",
  hauteur: 1.05,
  rythme: 0.95,
};

const BONUS_NOM_NATUREL = 10;
const BONUS_LANGUE_EXACTE = 5;

function scoreDeLaVoixEtrangere(voix: VoixDisponible, langue: string): number {
  const bonusNom = /natural|neural|online|premium|enhanced|google/i.test(voix.nom) ? BONUS_NOM_NATUREL : 0;
  const bonusLangue = voix.langue.toLowerCase() === langue.toLowerCase() ? BONUS_LANGUE_EXACTE : 0;
  return bonusNom + bonusLangue;
}

export function choisirVoixDeLangue(
  voix: readonly VoixDisponible[],
  langue: string,
): VoixDisponible | undefined {
  const codeDeLangue = langue.slice(0, 2).toLowerCase();
  return voix
    .filter((v) => v.langue.toLowerCase().startsWith(codeDeLangue))
    .sort((a, b) => scoreDeLaVoixEtrangere(b, langue) - scoreDeLaVoixEtrangere(a, langue))[0];
}
