import type { EffetSonore } from "../../voix/domain/index.ts";
import type { IssueDuRecord } from "../../apprentissage/domain/index.ts";

export interface BonneReponse {
  readonly questionsReussiesAvant: number;
  readonly questionsReussiesApres: number;
  readonly exerciceComplete: boolean;
  readonly pendantLeChronoDUneFluence: boolean;
}

export function effetsSonoresApresUneBonneReponse(reponse: BonneReponse): readonly EffetSonore[] {
  const effetDeLaReponse: EffetSonore = reponse.exerciceComplete ? "texteComplet" : "reponseJuste";
  const pointGagne = reponse.questionsReussiesApres > reponse.questionsReussiesAvant;
  if (pointGagne && !reponse.pendantLeChronoDUneFluence) {
    return [effetDeLaReponse, "pointDuRecipient"];
  }
  return [effetDeLaReponse];
}

export function effetSonoreDuRecord(issue: IssueDuRecord): EffetSonore | undefined {
  return issue === "premierRecord" || issue === "nouveauRecord" ? "grandeVictoire" : undefined;
}

export interface FaitsDeLaFin {
  readonly fin: "seance" | "seanceDeRevision" | "testDeDepart";
  readonly leconAcquise: boolean;
  readonly issueDuRecord: IssueDuRecord;
  readonly objetRecu: boolean;
  readonly episodeOuvert: boolean;
}

export function effetsSonoresDeLaFin(faits: FaitsDeLaFin): readonly EffetSonore[] {
  if (faits.fin === "testDeDepart") return ["seanceTerminee"];
  const recordDejaFete = effetSonoreDuRecord(faits.issueDuRecord) !== undefined;
  const effets: EffetSonore[] = [];
  if (!recordDejaFete) {
    effets.push(faits.leconAcquise ? "grandeVictoire" : "seanceTerminee");
  }
  if (faits.objetRecu || faits.episodeOuvert) effets.push("decouverte");
  return effets;
}
