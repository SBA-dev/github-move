export class ExerciceIntrouvable extends Error {
  constructor(readonly position: number) {
    super(`Cette leçon n'a pas d'exercice à la position ${position}.`);
    this.name = "ExerciceIntrouvable";
  }
}

export class LeconSansExercice extends Error {
  constructor(readonly lecon: string) {
    super(`La leçon ${lecon} n'a aucun exercice : elle ne peut pas être jouée.`);
    this.name = "LeconSansExercice";
  }
}

export class PasDEtapeDeLeconEnCours extends Error {
  constructor() {
    super("Aucune étape de leçon n'est en cours dans cette séance.");
    this.name = "PasDEtapeDeLeconEnCours";
  }
}

export class PasDeQuestionEnCours extends Error {
  constructor() {
    super("Aucune question n'est en cours dans cette séance.");
    this.name = "PasDeQuestionEnCours";
  }
}

export class SeanceDejaFinie extends Error {
  constructor() {
    super("Cette séance est déjà finie.");
    this.name = "SeanceDejaFinie";
  }
}

export class BonneReponseAbsenteDesChoix extends Error {
  constructor(readonly bonneReponse: string) {
    super(`La bonne réponse « ${bonneReponse} » ne figure pas parmi les choix proposés.`);
    this.name = "BonneReponseAbsenteDesChoix";
  }
}

export class QuestionDejaReussie extends Error {
  constructor() {
    super("Cette question est déjà réussie.");
    this.name = "QuestionDejaReussie";
  }
}

export class ChoixInconnu extends Error {
  constructor(readonly reponse: string) {
    super(`« ${reponse} » ne figure pas parmi les choix proposés.`);
    this.name = "ChoixInconnu";
  }
}

export class JeNeSaisPasDejaDit extends Error {
  constructor() {
    super("« Je ne sais pas » a déjà été dit pour cette question.");
    this.name = "JeNeSaisPasDejaDit";
  }
}

export class EtiquetteInconnue extends Error {
  constructor(readonly etiquette: string) {
    super(`« ${etiquette} » n'est pas une étiquette à placer.`);
    this.name = "EtiquetteInconnue";
  }
}

export class EtiquetteDejaPlacee extends Error {
  constructor(readonly etiquette: string) {
    super(`« ${etiquette} » est déjà bien placée.`);
    this.name = "EtiquetteDejaPlacee";
  }
}

export class ReponseRangeeSousUneAutreQuestion extends Error {
  constructor(readonly etiquette: string) {
    super(`Le placement de « ${etiquette} » est rangé sous la question d'une autre étiquette.`);
    this.name = "ReponseRangeeSousUneAutreQuestion";
  }
}

export class GroupeInconnu extends Error {
  constructor(readonly groupe: string | undefined) {
    super(`Le groupe « ${groupe ?? ""} » n'existe pas dans cet exercice.`);
    this.name = "GroupeInconnu";
  }
}

export class SeanceNonFinie extends Error {
  constructor() {
    super("Cette séance a encore des questions à réussir : elle ne peut pas être terminée.");
    this.name = "SeanceNonFinie";
  }
}

export class SeanceDejaTerminee extends Error {
  constructor() {
    super("Cette séance est déjà terminée.");
    this.name = "SeanceDejaTerminee";
  }
}

export class TirageInvalide extends Error {
  constructor() {
    super("Ce tirage n'est pas un ordre possible des choix de la question.");
    this.name = "TirageInvalide";
  }
}

export class TirageManquant extends Error {
  constructor() {
    super("Il manque le tirage d'une question de la séance.");
    this.name = "TirageManquant";
  }
}

export class TirageEnTrop extends Error {
  constructor() {
    super("La séance reçoit plus de tirages que de questions.");
    this.name = "TirageEnTrop";
  }
}

export class TirageHorsDuGenerateur extends Error {
  constructor(readonly tirage: string) {
    super(`L'opération tirée « ${tirage} » ne vient pas du générateur de l'exercice.`);
    this.name = "TirageHorsDuGenerateur";
  }
}

export class SeanceIncoherente extends Error {
  constructor(override readonly cause: Error) {
    super(`La séance envoyée est incohérente : ${cause.message}`);
    this.name = "SeanceIncoherente";
  }
}

export class LeconIntrouvable extends Error {
  constructor(readonly lecon: string) {
    super(`La leçon ${lecon} est introuvable.`);
    this.name = "LeconIntrouvable";
  }
}

export class ParentNonRattache extends Error {
  constructor() {
    super("Ce parent n'est pas rattaché à ce profil.");
    this.name = "ParentNonRattache";
  }
}

export class ReponseIncompatible extends Error {
  constructor(readonly genre: string) {
    super(`Une réponse de genre « ${genre} » ne convient pas à cette question.`);
    this.name = "ReponseIncompatible";
  }
}

export class FluenceNonCommencee extends Error {
  constructor() {
    super("Le signal « C'est parti ! » n'a pas encore été donné.");
    this.name = "FluenceNonCommencee";
  }
}

export class FluenceFinie extends Error {
  constructor() {
    super("Le temps de cet exercice est écoulé.");
    this.name = "FluenceFinie";
  }
}

export class JeNeSaisPasEnFluence extends Error {
  constructor() {
    super("Une fluence ne propose pas « Je ne sais pas ».");
    this.name = "JeNeSaisPasEnFluence";
  }
}

export class MotIncomplet extends Error {
  constructor() {
    super("Le mot n'est pas corrigé tant que toutes ses cases ne sont pas remplies.");
    this.name = "MotIncomplet";
  }
}

export class ToucheDejaUtilisee extends Error {
  constructor(readonly lettre: string) {
    super(`La touche « ${lettre} » est déjà utilisée.`);
    this.name = "ToucheDejaUtilisee";
  }
}

export class ToucheAbsenteDuClavier extends Error {
  constructor(readonly lettre: string) {
    super(`La touche « ${lettre} » n'est pas sur le clavier.`);
    this.name = "ToucheAbsenteDuClavier";
  }
}

export class PasDeLettreAEffacer extends Error {
  constructor() {
    super("Aucune lettre n'est écrite : il n'y a rien à effacer.");
    this.name = "PasDeLettreAEffacer";
  }
}

export class QuestionHorsDuTestDeDepart extends Error {
  constructor(readonly type: string) {
    super(`Un exercice de type « ${type} » ne pose pas de question au test de départ.`);
    this.name = "QuestionHorsDuTestDeDepart";
  }
}

export class TestDeDepartDejaFini extends Error {
  constructor() {
    super("Ce test de départ est déjà fini.");
    this.name = "TestDeDepartDejaFini";
  }
}

export class TestDeDepartNonFini extends Error {
  constructor() {
    super("Ce test de départ n'est pas fini.");
    this.name = "TestDeDepartNonFini";
  }
}

export class TestDeDepartDUnAutreEnfant extends Error {
  constructor() {
    super("Ce test de départ est celui d'un autre enfant.");
    this.name = "TestDeDepartDUnAutreEnfant";
  }
}

export class TestDeDepartIncoherent extends Error {
  constructor(override readonly cause: Error) {
    super(`Le test de départ envoyé est incohérent : ${cause.message}`);
    this.name = "TestDeDepartIncoherent";
  }
}
