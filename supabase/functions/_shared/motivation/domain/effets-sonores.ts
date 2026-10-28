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

export interface FinDeParcours {
  readonly fin: "seance" | "seanceDeRevision" | "testDeDepart";
  readonly leconAcquise: boolean;
  readonly issueDuRecord: IssueDuRecord;
  readonly objetRecu: boolean;
  readonly episodeOuvert: boolean;
}

export function effetsSonoresDeLaFin(parcours: FinDeParcours): readonly EffetSonore[] {
  if (parcours.fin === "testDeDepart") return ["seanceTerminee"];
  const victoire = parcours.leconAcquise || effetSonoreDuRecord(parcours.issueDuRecord) !== undefined;
  const effets: EffetSonore[] = [victoire ? "grandeVictoire" : "seanceTerminee"];
  if (parcours.objetRecu || parcours.episodeOuvert) effets.push("decouverte");
  return effets;
}
