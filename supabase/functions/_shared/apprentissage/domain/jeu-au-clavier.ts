import { JeNeSaisPasDejaDit, QuestionDejaReussie } from "./erreurs.ts";
import type { ReponseDonnee, ResultatDeReponse } from "./reponse.ts";

/** Ce que retient une question jouée au clavier : erreurs, réponses gardées et « Je ne sais pas ». */
export class JeuAuClavier {
  private nombreDErreurs = 0;
  private estReussi = false;
  private estJeNeSaisPasDit = false;
  private readonly reponsesDonnees: ReponseDonnee[] = [];

  get erreurs(): number {
    return this.nombreDErreurs;
  }

  get reussi(): boolean {
    return this.estReussi;
  }

  get jeNeSaisPasDejaDit(): boolean {
    return this.estJeNeSaisPasDit;
  }

  reponses(): ReponseDonnee[] {
    return [...this.reponsesDonnees];
  }

  repondre(reponse: ReponseDonnee, estJuste: () => boolean): ResultatDeReponse {
    if (this.estReussi) throw new QuestionDejaReussie();
    const juste = estJuste();
    this.reponsesDonnees.push(reponse);
    if (juste) {
      this.estReussi = true;
      return "juste";
    }
    if (!this.estJeNeSaisPasDit) this.nombreDErreurs++;
    return "fausse";
  }

  direJeNeSaisPas(): void {
    if (this.estReussi) throw new QuestionDejaReussie();
    if (this.estJeNeSaisPasDit) throw new JeNeSaisPasDejaDit();
    this.estJeNeSaisPasDit = true;
    this.reponsesDonnees.push({ genre: "jeNeSaisPas" });
    if (this.nombreDErreurs === 0) this.nombreDErreurs = 1;
  }
}
