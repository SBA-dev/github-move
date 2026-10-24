import type { Lecon } from "../../catalogue/domain/index.ts";
import type { NombreDEtoiles } from "../domain/etoiles.ts";
import { LeconIntrouvable, ParentNonRattache } from "../domain/erreurs.ts";
import { type FaitDeRecord, RecordDeFluence } from "../domain/record-de-fluence.ts";
import { type FaitDeResultat, ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";
import { revaliderLaSeance } from "../domain/revalider-la-seance.ts";
import type { SeanceTerminee } from "../domain/seance.ts";
import type { SeanceTermineeAEnregistrer } from "../domain/seance-terminee-a-enregistrer.ts";
import type { LeconsDuCatalogue } from "./ports/lecons-du-catalogue.ts";
import type { RattachementsDuParent } from "./ports/rattachements-du-parent.ts";
import type { RecordsDeFluence } from "./ports/records-de-fluence.ts";
import type { ResultatsDesLecons } from "./ports/resultats-des-lecons.ts";
import type { SeancesTerminees } from "./ports/seances-terminees.ts";

const ESSAIS_AU_PLUS = 3;

export class TerminerLaSeance {
  constructor(
    private readonly rattachements: RattachementsDuParent,
    private readonly lecons: LeconsDuCatalogue,
    private readonly seances: SeancesTerminees,
    private readonly resultats: ResultatsDesLecons,
    private readonly records: RecordsDeFluence,
  ) {}

  async executer(
    { parent, seance }: { parent: string; seance: SeanceTermineeAEnregistrer },
  ): Promise<(SeanceTerminee | FaitDeResultat | FaitDeRecord)[]> {
    if (!await this.rattachements.estRattache(parent, seance.enfant)) throw new ParentNonRattache();
    const lecon = await this.lecons.parId(seance.lecon);
    if (!lecon) throw new LeconIntrouvable(seance.lecon);

    const fait = revaliderLaSeance(lecon, seance);
    const faits = fait.etoiles === undefined
      ? await this.enregistrerSansResultat(fait)
      : await this.enregistrerAvecLeResultat(fait, fait.etoiles, lecon);
    if (faits.length === 0) return [];
    return [...faits, ...await this.proposerLesScoresDeFluence(fait)];
  }

  private async enregistrerSansResultat(fait: SeanceTerminee): Promise<SeanceTerminee[]> {
    const issue = await this.seances.enregistrerSansResultat(fait);
    return issue === "enregistree" ? [fait] : [];
  }

  // Écriture optimiste : si une autre séance de la même leçon est passée entre la lecture et l'écriture,
  // on relit le résultat et on y fait avancer cette séance : aucune séance n'est perdue.
  private async enregistrerAvecLeResultat(
    fait: SeanceTerminee,
    etoiles: NombreDEtoiles,
    lecon: Lecon,
  ): Promise<(SeanceTerminee | FaitDeResultat)[]> {
    for (let essai = 1; essai <= ESSAIS_AU_PLUS; essai++) {
      const resultat = await this.resultats.de(fait.enfant, fait.lecon) ??
        ResultatDeLaLecon.commencer(fait.enfant, fait.lecon, lecon.competence);
      const nombreDeSeancesLu = resultat.nombreDeSeances;
      resultat.enregistrerSeance(etoiles);
      const issue = await this.seances.enregistrerAvecLeResultat(fait, resultat, nombreDeSeancesLu);
      if (issue === "dejaEnregistree") return [];
      if (issue === "enregistree") return [fait, ...resultat.retirerFaits()];
    }
    throw new Error("Résultat de la leçon modifié en continu : écriture abandonnée.");
  }

  private async proposerLesScoresDeFluence(fait: SeanceTerminee): Promise<FaitDeRecord[]> {
    const faits: FaitDeRecord[] = [];
    for (const [exercice, score] of Object.entries(fait.scoresDeFluence ?? {})) {
      const record = await this.records.lire(fait.enfant, fait.lecon, exercice) ??
        RecordDeFluence.commencer(fait.enfant, fait.lecon, exercice);
      record.proposer(score);
      await this.records.enregistrer(record);
      faits.push(...record.retirerFaits());
    }
    return faits;
  }
}
