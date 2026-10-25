import { assertEquals, assertInstanceOf } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import {
  leconPoserUneAdditionEnColonnesAuCP,
  POSITION_DE_LA_LECON_EN_ACTION,
} from "../test_utils/lecons-d-addition.ts";
import { leconDeClasserLesSons } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { Seance } from "./seance.ts";
import type { Hasard } from "./hasard.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import type { OrigineDeLaQuestion } from "./origine-de-la-question.ts";
import { QuestionDeBoite } from "./question-de-boite.ts";
import { QuestionDeDictee } from "./question-de-dictee.ts";
import { QuestionDeProblemeEnBarres } from "./question-de-probleme-en-barres.ts";
import { questionDeRevision } from "./question-de-revision.ts";
import { Reponse } from "./reponse.ts";
import { type Tireur, tireurAuHasard, tireurSelonLesTirages } from "./tireur.ts";

const CE1 = Niveau.de("CE1");
const tireurSansMelange: Tireur = tireurAuHasard(hasardSansMelange());

function leconAvec(exercice: Record<string, unknown>): Lecon {
  return lireLecon({
    id: "fr-ce1-revision",
    matiere: "francais",
    niveau: "CE1",
    titre: "Leçon de test",
    ordre: 1,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [
      { type: "bulles", questions: [{ question: "q", choix: ["a", "b"], reponse: "a" }] },
      exercice,
    ],
  });
}

function origineAuxPosition1(type: OrigineDeLaQuestion["type"], tirage?: string): OrigineDeLaQuestion {
  return { leconDOrigine: "fr-ce1-revision", position: 1, type, ...(tirage === undefined ? {} : { tirage }) };
}

Deno.test("une question de bulles retenue est retrouvée par sa clé dans l'exercice d'origine et posée telle quelle", () => {
  const lecon = leconAvec({
    type: "bulles",
    questions: [
      { question: "Combien de syllabes dans « bateau » ?", choix: ["1", "2", "3"], reponse: "2" },
      { question: "Quel son entends-tu dans « poule » ?", choix: ["ou", "on", "an"], reponse: "ou" },
    ],
  });
  const identite = CleDeQuestion.de("bulles", "Quel son entends-tu dans « poule » ?ou");

  const question = questionDeRevision(lecon, origineAuxPosition1("bulles"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "Quel son entends-tu dans « poule » ?");
  assertEquals(question?.question?.repondre(Reponse.choix("ou")), "juste");
});

Deno.test("une question d'écoute retenue est retrouvée par sa clé et posée telle quelle", () => {
  const lecon = leconAvec({
    type: "ecoute",
    items: [
      { dire: "cat", choix: ["chat", "chien"], reponse: "chat" },
      { dire: "dog", choix: ["chat", "chien"], reponse: "chien" },
    ],
  });
  const identite = CleDeQuestion.de("ecoute", "dog");

  const question = questionDeRevision(lecon, origineAuxPosition1("ecoute"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.repondre(Reponse.choix("chien")), "juste");
});

Deno.test("un calcul écrit dans la leçon est retrouvé par sa clé et posé tel quel", () => {
  const lecon = leconAvec({ type: "calcul", operations: [{ q: "2 + 2", r: 4 }, { q: "3 + 3", r: 6 }] });
  const identite = CleDeQuestion.de("calcul", "3 + 3");

  const question = questionDeRevision(lecon, origineAuxPosition1("calcul"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "3 + 3");
  assertEquals(question?.question?.repondre(Reponse.nombre(6)), "juste");
});

Deno.test("un calcul tiré est reposé depuis le tirage gardé dans l'origine", () => {
  const lecon = leconAvec({
    type: "calcul",
    generateur: { op: "+", a: [1, 5], b: [1, 5], combien: 3 },
  });
  const identite = CleDeQuestion.de("calcul", "3 + 4");

  const question = questionDeRevision(
    lecon,
    origineAuxPosition1("calcul", "3 + 4 = 7"),
    identite,
    tireurSansMelange,
    CE1,
  );

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "3 + 4");
  assertEquals(question?.question?.repondre(Reponse.nombre(7)), "juste");
});

Deno.test("une question de lecture retenue est retrouvée par sa clé et posée telle quelle, avec son texte", () => {
  const lecon = leconAvec({
    type: "lecture",
    texte: "Plume est un petit oiseau. Il dort dans le lit et mange des graines.",
    questions: [
      { question: "Où dort Plume ?", choix: ["dans le lit", "sur le toit"], reponse: "dans le lit" },
      { question: "Que mange Plume ?", choix: ["des graines", "du pain"], reponse: "des graines" },
    ],
  });
  const identite = CleDeQuestion.de("lecture", "Que mange Plume ?des graines");

  const question = questionDeRevision(lecon, origineAuxPosition1("lecture"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "Que mange Plume ?");
  assertEquals(question?.question?.repondre(Reponse.choix("des graines")), "juste");
});

Deno.test("une question de dictée retenue est retrouvée par son mot et posée avec le clavier des dictées", () => {
  const lecon = leconAvec({
    type: "dictee",
    consigne: "Écoute bien et écris le mot que tu entends.",
    mots: [{ mot: "chat" }, { mot: "lapin" }],
  });
  const identite = CleDeQuestion.de("dictee", "lapin");

  const question = questionDeRevision(lecon, origineAuxPosition1("dictee"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertInstanceOf(question?.dictee, QuestionDeDictee);
  assertEquals(question?.question, undefined);
});

Deno.test("une question de boîte à jetons retenue est rejouée en boîte à jetons", () => {
  const lecon = leconAvec({
    type: "boite",
    items: [{ a: 4, op: "+", b: 3 }, { a: 15, op: "+", b: 9 }],
  });
  const identite = CleDeQuestion.de("boite", "15 + 9");

  const question = questionDeRevision(lecon, origineAuxPosition1("boite"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question instanceof QuestionDeBoite, true);
});

Deno.test("une question de problème en barres retenue est rejouée en problème en barres", () => {
  const enonce = "Lina a 9 crayons, dont 6 rouges. Combien de bleus ?";
  const lecon = leconAvec({
    type: "barres",
    items: [
      { enonce: "J'achète 4 pommes rouges et 2 pommes vertes. Combien de pommes ?", parties: [4, 2], tout: null },
      { enonce, parties: [6, null], tout: 9 },
    ],
  });
  const identite = CleDeQuestion.de("barres", enonce);

  const question = questionDeRevision(lecon, origineAuxPosition1("barres"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question instanceof QuestionDeProblemeEnBarres, true);
});

Deno.test("une étiquette à classer retenue sous sa clé de séance est rejouée en question « dans quelle maison ? »", () => {
  const lecon = leconAvec({
    type: "classer",
    groupes: [{ id: "g-ou", nom: "ou" }, { id: "g-on", nom: "on" }],
    items: [{ texte: "loup", groupe: "g-ou" }, { texte: "pont", groupe: "g-on" }],
  });
  const identite = CleDeQuestion.de("classer", "pontou,on");

  const question = questionDeRevision(lecon, origineAuxPosition1("classer"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "« pont » va dans quelle maison ?");
  assertEquals(question?.question?.repondre(Reponse.choix("on")), "juste");
});

Deno.test("une forme de conjugaison retenue est rejouée en question à choix", () => {
  const lecon = leconAvec({
    type: "conjugaison",
    verbe: "être",
    temps: "présent",
    formes: [{ pronom: "je", forme: "suis" }, { pronom: "tu", forme: "es" }, { pronom: "il", forme: "est" }],
  });
  const identite = CleDeQuestion.de("conjugaison", "être · présent · tu");

  const question = questionDeRevision(lecon, origineAuxPosition1("conjugaison"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "Le verbe être au présent : tu …");
  assertEquals(question?.question?.repondre(Reponse.choix("es")), "juste");
});

Deno.test("un trou retenu est rejoué en question à choix : la phrase qui le contient", () => {
  const lecon = leconAvec({
    type: "trous",
    consigne: "Complète chaque phrase.",
    texte: "Je [suis] ici. Tu [es] là.",
    distracteurs: ["sont"],
  });
  const identite = CleDeQuestion.de("trous", "Tu … là.");

  const question = questionDeRevision(lecon, origineAuxPosition1("trous"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "Tu … là.");
  assertEquals(question?.question?.repondre(Reponse.choix("es")), "juste");
});

Deno.test("une addition écrite dans la leçon, retenue sous son identité en ligne, est rejouée en calcul en ligne", () => {
  const lecon = leconAvec({ type: "addition", operations: [[12, 29, 8], [45, 37]], etapes: ["poser", "calculer"] });
  const identite = CleDeQuestion.de("calcul", "45 + 37");

  const question = questionDeRevision(lecon, origineAuxPosition1("calcul"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "45 + 37");
  assertEquals(question?.question?.repondre(Reponse.nombre(82)), "juste");
});

Deno.test("une addition tirée retenue est rejouée en calcul en ligne depuis le tirage gardé dans l'origine", () => {
  const lecon = leconAvec({
    type: "addition",
    generateur: { nombres: 2, min: 15, max: 59, retenue: true, combien: 3 },
    etapes: ["calculer"],
  });
  const identite = CleDeQuestion.de("calcul", "59 + 59");

  const question = questionDeRevision(
    lecon,
    origineAuxPosition1("calcul", "59 + 59"),
    identite,
    tireurSansMelange,
    CE1,
  );

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "59 + 59");
  assertEquals(question?.question?.repondre(Reponse.nombre(118)), "juste");
});

Deno.test("une question retenue dont l'exercice d'origine n'existe plus n'est pas rejouée", () => {
  const lecon = leconAvec({ type: "calcul", operations: [{ q: "2 + 2", r: 4 }] });
  const origineAbsente: OrigineDeLaQuestion = { ...origineAuxPosition1("calcul"), position: 7 };

  const question = questionDeRevision(
    lecon,
    origineAbsente,
    CleDeQuestion.de("calcul", "2 + 2"),
    tireurSansMelange,
    CE1,
  );

  assertEquals(question, undefined);
});

Deno.test("une question retenue dont le texte a changé dans la leçon n'est pas rejouée", () => {
  const lecon = leconAvec({ type: "calcul", operations: [{ q: "2 + 3", r: 5 }] });

  const question = questionDeRevision(
    lecon,
    origineAuxPosition1("calcul"),
    CleDeQuestion.de("calcul", "2 + 2"),
    tireurSansMelange,
    CE1,
  );

  assertEquals(question, undefined);
});

Deno.test("un calcul tiré dont le tirage gardé est illisible n'est pas rejoué", () => {
  const lecon = leconAvec({ type: "calcul", generateur: { op: "+", a: [1, 5], b: [1, 5], combien: 3 } });

  const question = questionDeRevision(
    lecon,
    origineAuxPosition1("calcul", "n'importe quoi"),
    CleDeQuestion.de("calcul", "3 + 4"),
    tireurSansMelange,
    CE1,
  );

  assertEquals(question, undefined);
});

const CP = Niveau.de("CP");

function hasardQuiMelange(): Hasard {
  const tirages = [0.1, 0.7, 0.3, 0.9, 0.5, 0.2, 0.8, 0.4, 0.6];
  let prochain = 0;
  return { entre0et1: () => tirages[prochain++ % tirages.length] as number };
}

function tirageDe(question: ReturnType<typeof questionDeRevision>): string[] {
  return (question?.question ?? question?.dictee)?.tirage() ?? [];
}

function reposeeAvecSonSeulTirage(
  lecon: Lecon,
  origine: OrigineDeLaQuestion,
  identite: CleDeQuestion,
  niveau: Niveau,
) {
  const premiere = questionDeRevision(lecon, origine, identite, tireurAuHasard(hasardQuiMelange()), niveau);
  const tirage = tirageDe(premiere);
  const tirages = (tirage.length > 0 ? [tirage] : [])[Symbol.iterator]();
  const seconde = questionDeRevision(lecon, origine, identite, tireurSelonLesTirages(tirages), niveau);
  return { premiere, seconde };
}

Deno.test("une forme de conjugaison reposée avec son seul tirage redonne la même question", () => {
  const lecon = leconAvec({
    type: "conjugaison",
    verbe: "être",
    temps: "présent",
    formes: [{ pronom: "je", forme: "suis" }, { pronom: "tu", forme: "es" }, { pronom: "il", forme: "est" }],
  });
  const identite = CleDeQuestion.de("conjugaison", "être · présent · tu");

  const { premiere, seconde } = reposeeAvecSonSeulTirage(lecon, origineAuxPosition1("conjugaison"), identite, CE1);

  assertEquals(seconde?.question?.enonce, premiere?.question?.enonce);
  assertEquals(seconde?.question?.tirage(), premiere?.question?.tirage());
  assertEquals(seconde?.question?.repondre(Reponse.choix("es")), "juste");
});

Deno.test("une question de bulles reposée avec son seul tirage redonne les mêmes choix", () => {
  const lecon = leconAvec({
    type: "bulles",
    questions: [
      { question: "Combien de syllabes dans « bateau » ?", choix: ["1", "2", "3"], reponse: "2" },
      { question: "Quel son entends-tu dans « poule » ?", choix: ["ou", "on", "an"], reponse: "ou" },
    ],
  });
  const identite = CleDeQuestion.de("bulles", "Quel son entends-tu dans « poule » ?ou");

  const { premiere, seconde } = reposeeAvecSonSeulTirage(lecon, origineAuxPosition1("bulles"), identite, CE1);

  assertEquals(seconde?.question?.enonce, premiere?.question?.enonce);
  assertEquals(seconde?.question?.tirage(), premiere?.question?.tirage());
  assertEquals(seconde?.question?.repondre(Reponse.choix("ou")), "juste");
});

Deno.test("une question de dictée reposée avec son seul tirage redonne le même clavier", () => {
  const lecon = leconAvec({
    type: "dictee",
    consigne: "Écoute bien et écris le mot que tu entends.",
    mots: [{ mot: "chat" }, { mot: "lapin" }],
  });
  const identite = CleDeQuestion.de("dictee", "lapin");

  const { premiere, seconde } = reposeeAvecSonSeulTirage(lecon, origineAuxPosition1("dictee"), identite, CE1);

  assertEquals(seconde?.dictee?.tirage(), premiere?.dictee?.tirage());
  assertEquals(seconde?.dictee?.cle, identite);
});

Deno.test("un calcul écrit dans la leçon, posé à choix au CP, reposé avec son seul tirage redonne les mêmes choix", () => {
  const lecon = leconAvec({ type: "calcul", operations: [{ q: "2 + 2", r: 4 }, { q: "3 + 3", r: 6 }] });
  const identite = CleDeQuestion.de("calcul", "3 + 3");

  const { premiere, seconde } = reposeeAvecSonSeulTirage(lecon, origineAuxPosition1("calcul"), identite, CP);

  assertEquals(seconde?.question?.tirage(), premiere?.question?.tirage());
  assertEquals(seconde?.question?.repondre(Reponse.choix("6")), "juste");
});

Deno.test("une étiquette à classer reposée avec son seul tirage redonne les mêmes choix", () => {
  const lecon = leconAvec({
    type: "classer",
    groupes: [{ id: "g-ou", nom: "ou" }, { id: "g-on", nom: "on" }],
    items: [{ texte: "loup", groupe: "g-ou" }, { texte: "pont", groupe: "g-on" }],
  });
  const identite = CleDeQuestion.de("classer", "pontou,on");

  const { premiere, seconde } = reposeeAvecSonSeulTirage(lecon, origineAuxPosition1("classer"), identite, CE1);

  assertEquals(seconde?.question?.enonce, premiere?.question?.enonce);
  assertEquals(seconde?.question?.tirage(), premiere?.question?.tirage());
});

Deno.test("un calcul tiré dont le tirage n'est pas une opération lisible est oublié", () => {
  const lecon = leconAvec({ type: "calcul", generateur: { op: "+", a: [1, 5], b: [1, 5], combien: 3 } });

  const question = questionDeRevision(
    lecon,
    origineAuxPosition1("calcul", "3 + 4 = abc"),
    CleDeQuestion.de("calcul", "3 + 4"),
    tireurSansMelange,
    CE1,
  );

  assertEquals(question, undefined);
});

Deno.test("un calcul tiré dont la somme du tirage est fausse est oublié", () => {
  const lecon = leconAvec({ type: "calcul", generateur: { op: "+", a: [1, 5], b: [1, 5], combien: 3 } });

  const question = questionDeRevision(
    lecon,
    origineAuxPosition1("calcul", "3 + 4 = 8"),
    CleDeQuestion.de("calcul", "3 + 4"),
    tireurSansMelange,
    CE1,
  );

  assertEquals(question, undefined);
});

function seanceDe(lecon: Lecon, choix: ChoixDeSeance): Seance {
  const seance = Seance.commencer(generateurIdFixe("seance-1"), hasardSansMelange(), "profil-lea", lecon, choix);
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  return seance;
}

const finDeSeance = new Date("2026-10-25T10:30:00Z");

Deno.test("une étiquette à classer ratée en séance est rejouée par la question de révision, sans clé écrite en dur", () => {
  const lecon = leconDeClasserLesSons();
  const seance = seanceDe(lecon, ChoixDeSeance.complete());
  seance.repondre(Reponse.placement("loup", "g-on"));
  seance.repondre(Reponse.placement("loup", "g-ou"));
  seance.repondre(Reponse.placement("pont", "g-on"));
  seance.repondre(Reponse.placement("savon", "g-on"));
  const aRetenir = seance.terminer(finDeSeance).questionsRateesARetenir[0];

  const question = aRetenir && questionDeRevision(lecon, aRetenir.origine, aRetenir.identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, aRetenir?.identite);
  assertEquals(question?.question?.enonce, "« loup » va dans quelle maison ?");
});

Deno.test("une addition posée ratée en séance est rejouée par la question de révision, sans clé écrite en dur", () => {
  const lecon = leconPoserUneAdditionEnColonnesAuCP();
  const seance = seanceDe(lecon, ChoixDeSeance.unExercice(POSITION_DE_LA_LECON_EN_ACTION));
  seance.repondre(Reponse.placement("4", "unites"));
  seance.repondre(Reponse.placement("4", "dizaines"));
  seance.repondre(Reponse.placement("5", "unites"));
  seance.repondre(Reponse.placement("3", "dizaines"));
  seance.repondre(Reponse.placement("7", "unites"));
  seance.repondre(Reponse.choix("11"));
  seance.repondre(Reponse.choix("12"));
  seance.repondre(Reponse.choix("8"));
  const aRetenir = seance.terminer(finDeSeance).questionsRateesARetenir[0];

  const question = aRetenir && questionDeRevision(lecon, aRetenir.origine, aRetenir.identite, tireurSansMelange, CP);

  assertEquals(question?.identite, aRetenir?.identite);
  assertEquals(question?.question?.enonce, "45 + 37");
});
