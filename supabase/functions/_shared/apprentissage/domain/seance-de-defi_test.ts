import { assertEquals, assertExists, assertThrows } from "@std/assert";
import { type Lecon, lireLecon, matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import type { Defi } from "./defis-de-la-matiere.ts";
import { DefiDejaTermine, DefiNonFini } from "./erreurs.ts";
import { Jour } from "./jour.ts";
import type { PlanDuDefi } from "./plan-du-defi.ts";
import { Reponse } from "./reponse.ts";
import { SeanceDeDefi } from "./seance-de-defi.ts";
import { type Tireur, tireurAuHasard } from "./tireur.ts";

const CE1 = Niveau.de("CE1");
const tireur: Tireur = tireurAuHasard(hasardSansMelange());
const finDuDefi = new Date("2026-10-29T16:30:00Z");
const jourDuDefi = Jour.de("2026-10-29");

function uneLecon(id: string, exercice: Record<string, unknown>): Lecon {
  return lireLecon({
    id,
    matiere: "francais",
    niveau: "CE1",
    titre: `Leçon ${id}`,
    ordre: 1,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [exercice],
  });
}

const leconDesSyllabes = uneLecon("fr-ce1-syllabes", {
  type: "bulles",
  questions: [
    { question: "Combien de syllabes dans « bateau » ?", choix: ["1", "2"], reponse: "2" },
    { question: "Combien de syllabes dans « chat » ?", choix: ["1", "2", "3", "4"], reponse: "1" },
  ],
});
const leconDuCalcul = uneLecon("fr-ce1-calcul", { type: "calcul", operations: [{ q: "2 + 2", r: 4 }] });

const bateau = CleDeQuestion.de("bulles", "Combien de syllabes dans « bateau » ?2");
const chat = CleDeQuestion.de("bulles", "Combien de syllabes dans « chat » ?1");
const calcul = CleDeQuestion.de("calcul", "2 + 2");

const defi: Defi = {
  matiere: matiereDeCode("francais"),
  niveau: CE1,
  numero: 1,
  lecons: [leconDesSyllabes.id, leconDuCalcul.id],
};

const origineDesSyllabes = { leconDOrigine: leconDesSyllabes.id, position: 0, type: "bulles" as const };
const origineDuCalcul = { leconDOrigine: leconDuCalcul.id, position: 0, type: "calcul" as const };

function planDe(...identites: CleDeQuestion[]): PlanDuDefi {
  return {
    questions: identites.map((identite) => ({
      identite,
      origine: identite === calcul ? origineDuCalcul : origineDesSyllabes,
    })),
  };
}

function seanceSur(plan: PlanDuDefi): SeanceDeDefi {
  return SeanceDeDefi.commencer({
    id: "defi-1",
    enfant: "profil-lea",
    defi,
    plan,
    lecons: [leconDesSyllabes, leconDuCalcul],
    tireurDe: () => tireur,
    niveau: CE1,
  });
}

function bonneReponseDe(identite: CleDeQuestion) {
  if (identite === calcul) return Reponse.nombre(4);
  return Reponse.choix(identite === bateau ? "2" : "1");
}

function mauvaiseReponseDe(identite: CleDeQuestion) {
  if (identite === calcul) return Reponse.nombre(5);
  return Reponse.choix(identite === bateau ? "1" : "2");
}

Deno.test("un défi pose ses questions dans l'ordre de son plan", () => {
  const seance = seanceSur(planDe(chat, calcul, bateau));
  const posees: (CleDeQuestion | undefined)[] = [];

  posees.push(seance.questionEnCours()?.identite);
  seance.repondre(bonneReponseDe(chat));
  posees.push(seance.questionEnCours()?.identite);
  seance.repondre(bonneReponseDe(calcul));
  posees.push(seance.questionEnCours()?.identite);

  assertEquals(posees, [chat, calcul, bateau]);
});

Deno.test("une bonne réponse dans un défi fait passer à la question suivante, et la dernière termine les questions", () => {
  const seance = seanceSur(planDe(chat, bateau));

  assertEquals(seance.repondre(bonneReponseDe(chat)), "juste");
  assertEquals(seance.questionEnCours()?.identite, bateau);
  assertEquals(seance.estFinie(), false);
  seance.repondre(bonneReponseDe(bateau));

  assertEquals(seance.estFinie(), true);
});

Deno.test("dans un défi, des réponses fausses différentes laissent la même question pour une nouvelle chance, sans limite", () => {
  const seance = seanceSur(planDe(chat, bateau));

  const resultats = ["2", "3", "4"].map((choix) => seance.repondre(Reponse.choix(choix)));

  assertEquals(resultats, ["fausse", "fausse", "fausse"]);
  assertEquals(seance.questionEnCours()?.identite, chat);
  assertEquals(seance.estFinie(), false);
});

Deno.test("dans un défi, renvoyer un choix déjà écarté ne change pas de question", () => {
  const seance = seanceSur(planDe(chat, bateau));
  seance.repondre(Reponse.choix("2"));

  const resultat = seance.repondre(Reponse.choix("2"));

  assertEquals(resultat, "dejaEcartee");
  assertEquals(seance.questionEnCours()?.identite, chat);
});

Deno.test("dans un défi, « Je ne sais pas » donne l'aide et garde la même question", () => {
  const seance = seanceSur(planDe(chat, bateau));

  const aide = seance.direJeNeSaisPas();

  assertEquals(aide.bonneReponse, "1");
  assertEquals(seance.questionEnCours()?.identite, chat);
});

Deno.test("un défi terminé sans erreur donne l'événement DefiTermine, sans question ratée", () => {
  const seance = seanceSur(planDe(chat, bateau));
  seance.repondre(bonneReponseDe(chat));
  seance.repondre(bonneReponseDe(bateau));

  const fait = seance.terminer(finDuDefi, jourDuDefi);

  assertEquals(fait.type, "DefiTermine");
  assertEquals(fait.id, "defi-1");
  assertEquals(fait.enfant, "profil-lea");
  assertEquals(fait.defi, defi);
  assertEquals(fait.nombreDeQuestions, 2);
  assertEquals(fait.questionsRatees, []);
});

Deno.test("les questions ratées d'un défi sont celles qui ont eu une erreur ou un « Je ne sais pas », avec leur leçon d'origine", () => {
  const seance = seanceSur(planDe(chat, calcul, bateau));
  seance.repondre(mauvaiseReponseDe(chat));
  seance.repondre(bonneReponseDe(chat));
  seance.direJeNeSaisPas();
  seance.repondre(bonneReponseDe(calcul));
  seance.repondre(bonneReponseDe(bateau));

  const fait = seance.terminer(finDuDefi, jourDuDefi);

  assertEquals(fait.questionsRatees, [
    { identite: chat, origine: origineDesSyllabes },
    { identite: calcul, origine: origineDuCalcul },
  ]);
});

Deno.test("un défi avec une erreur à chaque question est quand même terminé", () => {
  const seance = seanceSur(planDe(chat, bateau));
  for (const identite of [chat, bateau]) {
    seance.repondre(mauvaiseReponseDe(identite));
    seance.repondre(bonneReponseDe(identite));
  }

  const fait = seance.terminer(finDuDefi, jourDuDefi);

  assertEquals(fait.nombreDeQuestions, 2);
  assertEquals(fait.questionsRatees.map(({ identite }) => identite), [chat, bateau]);
});

Deno.test("un défi dont une question n'est pas réussie ne peut pas être terminé", () => {
  const seance = seanceSur(planDe(chat, bateau));
  seance.repondre(bonneReponseDe(chat));

  assertThrows(() => seance.terminer(finDuDefi, jourDuDefi), DefiNonFini);
});

Deno.test("un défi déjà terminé ne peut pas l'être une seconde fois", () => {
  const seance = seanceSur(planDe(bateau));
  seance.repondre(bonneReponseDe(bateau));
  seance.terminer(finDuDefi, jourDuDefi);

  assertThrows(() => seance.terminer(finDuDefi, jourDuDefi), DefiDejaTermine);
});

function tirageDeLaQuestionEnCours(seance: SeanceDeDefi): string[] {
  const posee = seance.questionEnCours()?.question;
  assertExists(posee);
  return posee.tirage();
}

Deno.test("l'envoi d'un défi terminé contient le défi, les questions, leurs tirages et leurs réponses dans l'ordre", () => {
  const seance = seanceSur(planDe(chat, bateau));
  const tirageDeChat = tirageDeLaQuestionEnCours(seance);
  seance.repondre(mauvaiseReponseDe(chat));
  seance.repondre(bonneReponseDe(chat));
  const tirageDeBateau = tirageDeLaQuestionEnCours(seance);
  seance.direJeNeSaisPas();
  seance.repondre(bonneReponseDe(bateau));
  seance.terminer(finDuDefi, jourDuDefi);

  assertEquals(seance.aEnregistrer(), {
    id: "defi-1",
    enfant: "profil-lea",
    defi: { matiere: defi.matiere, niveau: defi.niveau, numero: 1 },
    questions: [chat, bateau],
    tirages: [tirageDeChat, tirageDeBateau],
    reponses: [
      [mauvaiseReponseDe(chat), bonneReponseDe(chat)],
      [{ genre: "jeNeSaisPas" }, bonneReponseDe(bateau)],
    ],
    termineeLe: finDuDefi,
    jour: "2026-10-29",
  });
});

Deno.test("l'envoi d'un défi qui n'a pas été terminé est refusé", () => {
  const seance = seanceSur(planDe(chat, bateau));
  seance.repondre(bonneReponseDe(chat));
  seance.repondre(bonneReponseDe(bateau));

  assertThrows(() => seance.aEnregistrer(), DefiNonFini);
});
