import type { IssueDuRecord } from "@domain/apprentissage";
import { effetSonoreDuRecord, effetsSonoresDeLaFin } from "@domain/motivation";
import type { EffetSonore } from "@domain/voix";
import type { NouveautesDeFin } from "./nouveautes-de-fin.ts";

/**
 * Les effets sonores de la fin d'une séance. Une séance sans étoiles est faite seulement d'une fluence : son record
 * a déjà fait entendre « grande victoire » à la fin de la fluence, il n'est pas rejoué (décision 97.18).
 */
export function effetsDeLaFinDeSeance(
  etoiles: number | undefined,
  nouveautes: NouveautesDeFin,
  issueDeLaFluence: IssueDuRecord,
): readonly EffetSonore[] {
  const fluenceSeule = etoiles === undefined;
  const effets = effetsSonoresDeLaFin({
    fin: "seance",
    leconAcquise: nouveautes.leconAcquise,
    issueDuRecord: fluenceSeule ? issueDeLaFluence : "aucunRecord",
    objetRecu: nouveautes.objet !== undefined,
    episodeOuvert: nouveautes.episode !== undefined,
  });
  const recordDejaFete = fluenceSeule && effetSonoreDuRecord(issueDeLaFluence) !== undefined;
  return recordDejaFete ? effets.slice(1) : effets;
}
