import { type ExerciceHorloge, HeureDeLHorloge, type ItemDHorloge, type Niveau } from "../../catalogue/domain/index.ts";
import { heuresProposees } from "./choix-d-heures.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import { cleDeLHorloge } from "./cles-des-questions.ts";
import { HeureEcriteImpossible, ReponseIncompatible } from "./erreurs.ts";
import { heureDite } from "./heure-dite.ts";
import { JeuAuClavier } from "./jeu-au-clavier.ts";
import { lectureDesChoix } from "./lecture-des-choix.ts";
import { ModeDeReponse } from "./mode-de-reponse.ts";
import { type AideDonnee, QuestionJouee } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import type { HeureEcrite, ReponseDonnee, ReponseEnNombre, ReponseParChoix, ResultatDeReponse } from "./reponse.ts";
import type { Tireur } from "./tireur.ts";

const CONSIGNE_PAR_DEFAUT = "Quelle heure est-il ?";
const AIDE_PAR_DEFAUT = "La petite aiguille montre les heures, la grande les minutes.";
const MIDI = 12;
const DERNIERE_HEURE_DU_JOUR = 23;
const DERNIERE_MINUTE_OU_SECONDE = 59;

export type ChampDeLHeure = "heures" | "minutes" | "secondes";

export type HorlogeEnCours = Readonly<{
  mode:
    | { genre: "choix"; choix: readonly string[]; ecartes: readonly string[] }
    | { genre: "clavierDeCristaux"; champs: readonly ChampDeLHeure[] };
  jeNeSaisPasPropose: boolean;
  reponseATaper?: string;
  reponseATaperDite?: string;
}>;

const MOMENTS_DITS = { "matin": "C'est le matin.", "apres-midi": "C'est l'après-midi." };

type HeureProposeeDite = Readonly<{ texte: string; dite: string }>;

export class QuestionDHorloge implements QuestionPosee {
  readonly type = "horloge";
  readonly cle: CleDeQuestion;
  private readonly auClavier = new JeuAuClavier();

  private constructor(
    private readonly exercice: ExerciceHorloge,
    private readonly item: ItemDHorloge,
    private readonly auxChoix: QuestionJouee | undefined,
    private readonly heuresDites: readonly HeureProposeeDite[],
    private readonly niveau: Niveau,
  ) {
    this.cle = cleDeLHorloge(exercice.mode, item);
  }

  static pour(exercice: ExerciceHorloge, item: ItemDHorloge, tireur: Tireur, niveau: Niveau): QuestionDHorloge {
    if (ModeDeReponse.pour(niveau).genre !== "choix") {
      return new QuestionDHorloge(exercice, item, undefined, [], niveau);
    }
    const bonneReponse = item.heure.ecriture();
    const heures = heuresProposees(item.heure, exercice.precision);
    const heuresDites = heures.map((heure) => ({ texte: heure.ecriture(), dite: heureDite(heure, niveau) }));
    const textes = heuresDites.map(({ texte }) => texte);
    const question = QuestionJouee.aChoix({
      cle: cleDeLHorloge(exercice.mode, item),
      enonce: consigneDe(exercice),
      choix: tireur.choix(textes, bonneReponse),
      bonneReponse,
      type: "bulles",
      complements: { aide: item.aide },
    });
    return new QuestionDHorloge(exercice, item, question, heuresDites, niveau);
  }

  get enonce(): string {
    return this.texteAffiche();
  }

  get erreurs(): number {
    return this.auxChoix?.erreurs ?? this.auClavier.erreurs;
  }

  get reussie(): boolean {
    return this.auxChoix?.reussie ?? this.auClavier.reussi;
  }

  get bonneReponseMontree(): boolean {
    return this.auxChoix?.bonneReponseMontree ?? this.auClavier.jeNeSaisPasDejaDit;
  }

  texteAffiche(): string {
    return consigneDe(this.exercice);
  }

  texteDit(): string {
    const { moment } = this.item;
    return moment === undefined ? this.texteAffiche() : `${this.texteAffiche()} ${MOMENTS_DITS[moment]}`;
  }

  lectureDesChoix(): string | undefined {
    if (!this.auxChoix) return undefined;
    const dites = this.auxChoix.choix.textes().flatMap((texte) =>
      this.heuresDites.filter((proposee) => proposee.texte === texte).map(({ dite }) => dite)
    );
    return lectureDesChoix(dites);
  }

  aideApresErreur(): string {
    return this.item.aide ?? AIDE_PAR_DEFAUT;
  }

  enCours(): HorlogeEnCours {
    if (this.auxChoix) {
      return {
        mode: { genre: "choix", choix: this.auxChoix.choix.textes(), ecartes: this.auxChoix.choix.ecartes() },
        jeNeSaisPasPropose: this.jeNeSaisPasEstPropose(),
      };
    }
    return {
      mode: { genre: "clavierDeCristaux", champs: this.champsDeLHeure() },
      jeNeSaisPasPropose: this.jeNeSaisPasEstPropose(),
      ...(this.auClavier.jeNeSaisPasDejaDit && {
        reponseATaper: this.item.heure.ecriture(),
        reponseATaperDite: heureDite(this.item.heure, this.niveau),
      }),
    };
  }

  private jeNeSaisPasEstPropose(): boolean {
    return !this.reussie && !this.bonneReponseMontree;
  }

  tirage(): string[] {
    return this.auxChoix?.tirage() ?? [];
  }

  reponses(): ReponseDonnee[] {
    return this.auxChoix?.reponses() ?? this.auClavier.reponses();
  }

  repondre(reponse: ReponseParChoix | ReponseEnNombre | HeureEcrite): ResultatDeReponse {
    if (this.auxChoix) {
      if (reponse.genre !== "choix") throw new ReponseIncompatible(reponse.genre);
      return this.auxChoix.repondre(reponse);
    }
    if (reponse.genre !== "heureEcrite") throw new ReponseIncompatible(reponse.genre);
    return this.repondreAuClavier(reponse);
  }

  direJeNeSaisPas(): AideDonnee {
    if (this.auxChoix) return this.auxChoix.direJeNeSaisPas();
    this.auClavier.direJeNeSaisPas();
    return { aide: this.aideApresErreur(), bonneReponse: this.item.heure.ecriture(), maniere: "briller" };
  }

  private champsDeLHeure(): ChampDeLHeure[] {
    return this.exercice.precision.ecriture() === "seconde" ? ["heures", "minutes", "secondes"] : ["heures", "minutes"];
  }

  private repondreAuClavier(reponse: HeureEcrite): ResultatDeReponse {
    return this.auClavier.repondre(reponse, () => this.estLaBonneHeure(heureEcrite(reponse)));
  }

  private estLaBonneHeure(heure: HeureDeLHorloge): boolean {
    return heure.egaleSurLeCadran(this.item.heure) && this.estDuBonMoment(heure);
  }

  private estDuBonMoment(heure: HeureDeLHorloge): boolean {
    const { moment } = this.item;
    return moment === undefined || (moment === "apres-midi") === (heure.heures >= MIDI);
  }
}

function consigneDe({ consigne }: ExerciceHorloge): string {
  return consigne ?? CONSIGNE_PAR_DEFAUT;
}

function heureEcrite({ heures, minutes, secondes }: HeureEcrite): HeureDeLHorloge {
  const possible = Number.isInteger(heures) && Number.isInteger(minutes) && Number.isInteger(secondes) &&
    heures >= 0 && heures <= DERNIERE_HEURE_DU_JOUR &&
    minutes >= 0 && minutes <= DERNIERE_MINUTE_OU_SECONDE &&
    secondes >= 0 && secondes <= DERNIERE_MINUTE_OU_SECONDE;
  if (!possible) throw new HeureEcriteImpossible();
  return HeureDeLHorloge.lire(`${heures}:${String(minutes).padStart(2, "0")}:${String(secondes).padStart(2, "0")}`);
}
