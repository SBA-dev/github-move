import { ReponseIncompatible, SeanceDeRevisionDejaFinie } from "./erreurs.ts";
import type { QuestionDeRevision } from "./question-de-revision.ts";
import type { AideDonnee } from "./question-jouee.ts";
import type { QuestionSuivie } from "./question-suivie.ts";
import type { MotEcrit, ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";

/** La boucle commune aux séances de questions rejouées : une question à la fois, jusqu'à ce qu'elle soit réussie. */
export class QuestionsEnCours {
  constructor(
    private readonly questions: readonly QuestionDeRevision[],
    private readonly erreurSiFinie: () => Error = () => new SeanceDeRevisionDejaFinie(),
  ) {}

  enCours(): QuestionDeRevision | undefined {
    return this.questions.find((posee) => !suivie(posee).reussie);
  }

  estFinie(): boolean {
    return this.enCours() === undefined;
  }

  repondre(reponse: ReponseParChoix | ReponseEnNombre | MotEcrit): ResultatDeReponse {
    const { question, dictee } = this.aPoser();
    if (dictee) {
      if (reponse.genre !== "motEcrit") throw new ReponseIncompatible(reponse.genre);
      return dictee.repondre(reponse);
    }
    if (reponse.genre === "motEcrit") throw new ReponseIncompatible(reponse.genre);
    return question.repondre(reponse);
  }

  direJeNeSaisPas(): AideDonnee {
    return suivie(this.aPoser()).direJeNeSaisPas();
  }

  private aPoser(): QuestionDeRevision {
    const enCours = this.enCours();
    if (!enCours) throw this.erreurSiFinie();
    return enCours;
  }
}

export function suivie(
  { question, dictee }: QuestionDeRevision,
): QuestionSuivie & { direJeNeSaisPas(): AideDonnee; tirage(): string[] } {
  return question ?? dictee;
}
