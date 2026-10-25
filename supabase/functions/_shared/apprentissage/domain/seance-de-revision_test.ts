import { assertEquals, assertThrows } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { AucuneQuestionDue } from "./erreurs.ts";
import { FileDeRevision, type PlanDeSeanceDeRevision } from "./file-de-revision.ts";
import { Jour } from "./jour.ts";
import { Reponse } from "./reponse.ts";
import { SeanceDeRevision } from "./seance-de-revision.ts";
import { type Tireur, tireurAuHasard } from "./tireur.ts";

const CE1 = Niveau.de("CE1");
const tireur: Tireur = tireurAuHasard(hasardSansMelange());
const jourDesErreurs = Jour.de("2026-10-24");
const jourDeLaRevision = Jour.de("2026-10-25");
const termineeLe = new Date("2026-10-24T16:30:00Z");

const leconDesSyllabes: Lecon = lireLecon({
  id: "fr-ce1-syllabes",
  matiere: "francais",
  niveau: "CE1",
  titre: "Les syllabes",
  ordre: 1,
  programme: { section: "c2-test", citation: "Citation de test." },
  lecon: [],
  exercices: [{
    type: "bulles",
    questions: [
      { question: "Combien de syllabes dans « bateau » ?", choix: ["1", "2"], reponse: "2" },
      { question: "Combien de syllabes dans « chat » ?", choix: ["1", "2"], reponse: "1" },
    ],
  }],
});

const bateau = CleDeQuestion.de("bulles", "Combien de syllabes dans « bateau » ?2");
const chat = CleDeQuestion.de("bulles", "Combien de syllabes dans « chat » ?1");
const introuvable = CleDeQuestion.de("bulles", "Une question qui n'existe plus ?oui");

function planDesQuestionsRatees(...identites: CleDeQuestion[]): PlanDeSeanceDeRevision {
  const file = FileDeRevision.vide("profil-lea");
  file.retenir(
    identites.map((identite) => ({
      identite,
      origine: { leconDOrigine: leconDesSyllabes.id, position: 0, type: "bulles" as const },
    })),
    jourDesErreurs,
    termineeLe,
  );
  return file.planDeLaSeanceDeRevision(jourDeLaRevision);
}

function seanceSur(plan: PlanDeSeanceDeRevision, lecons: readonly Lecon[] = [leconDesSyllabes]): SeanceDeRevision {
  return SeanceDeRevision.commencer({ id: "revision-1", enfant: "profil-lea", plan, lecons, tireur, niveau: CE1 });
}

Deno.test("une séance de révision pose les questions une à une, dans l'ordre du plan, jusqu'à la dernière bonne réponse", () => {
  const plan = planDesQuestionsRatees(bateau, chat);
  const [premiere, seconde] = plan.questions.map(({ identite }) => identite);
  const seance = seanceSur(plan);
  const poseesDansLOrdre: (CleDeQuestion | undefined)[] = [];

  poseesDansLOrdre.push(seance.questionEnCours()?.identite);
  seance.questionEnCours()?.question?.repondre(Reponse.choix(premiere === bateau ? "2" : "1"));
  poseesDansLOrdre.push(seance.questionEnCours()?.identite);
  const finieAvantLaDerniere = seance.estFinie();
  seance.questionEnCours()?.question?.repondre(Reponse.choix(seconde === bateau ? "2" : "1"));

  assertEquals(poseesDansLOrdre, [premiere, seconde]);
  assertEquals([finieAvantLaDerniere, seance.estFinie(), seance.questionEnCours()], [false, true, undefined]);
});

Deno.test("après une réponse fausse en révision, la même question reste posée pour une nouvelle chance", () => {
  const plan = planDesQuestionsRatees(bateau, chat);
  const seance = seanceSur(plan);
  const premiere = seance.questionEnCours();
  const fausse = premiere?.identite === bateau ? "1" : "2";

  premiere?.question?.repondre(Reponse.choix(fausse));

  assertEquals(seance.questionEnCours(), premiere);
});

Deno.test("une question retenue dont la leçon d'origine est absente est sautée", () => {
  const sansLecon = planDesQuestionsRatees(bateau);
  const autreOrigine = {
    ...sansLecon.questions[0],
    origine: { leconDOrigine: "fr-ce1-retiree", position: 0, type: "bulles" as const },
  };
  const plan: PlanDeSeanceDeRevision = { questions: [autreOrigine, ...planDesQuestionsRatees(chat).questions] };

  const seance = seanceSur(plan);

  assertEquals(seance.questionEnCours()?.identite, chat);
});

Deno.test("une question retenue introuvable dans sa leçon est sautée", () => {
  const plan = planDesQuestionsRatees(introuvable, chat);

  const seance = seanceSur(plan);

  assertEquals(seance.questionEnCours()?.identite, chat);
});

Deno.test("une séance de révision dont aucune question n'est posable ne peut pas commencer", () => {
  const plan = planDesQuestionsRatees(introuvable);

  assertThrows(() => seanceSur(plan), AucuneQuestionDue);
});

function bonneReponseDe(identite: CleDeQuestion) {
  return Reponse.choix(identite === bateau ? "2" : "1");
}

function mauvaiseReponseDe(identite: CleDeQuestion) {
  return Reponse.choix(identite === bateau ? "1" : "2");
}

Deno.test("en révision, une question réussie sans erreur est juste et une question avec une réponse fausse est fausse", () => {
  const plan = planDesQuestionsRatees(bateau, chat);
  const [premiere, seconde] = plan.questions.map(({ identite }) => identite);
  const seance = seanceSur(plan);

  seance.repondre(mauvaiseReponseDe(premiere));
  seance.repondre(bonneReponseDe(premiere));
  seance.repondre(bonneReponseDe(seconde));

  assertEquals(seance.resultats(), [{ identite: premiere, juste: false }, { identite: seconde, juste: true }]);
});

Deno.test("en révision, « Je ne sais pas » rend la question fausse, montre la bonne réponse puis passe à la suivante", () => {
  const plan = planDesQuestionsRatees(bateau, chat);
  const [premiere, seconde] = plan.questions.map(({ identite }) => identite);
  const seance = seanceSur(plan);

  const aide = seance.direJeNeSaisPas();
  seance.repondre(bonneReponseDe(premiere));

  assertEquals(aide.bonneReponse, premiere === bateau ? "2" : "1");
  assertEquals(seance.questionEnCours()?.identite, seconde);
  seance.repondre(bonneReponseDe(seconde));
  assertEquals(seance.resultats(), [{ identite: premiere, juste: false }, { identite: seconde, juste: true }]);
});

Deno.test("en révision, une question de dictée se joue jusqu'au bout et est fausse après une erreur", () => {
  const leconDesDictees: Lecon = lireLecon({
    id: "fr-ce1-dictees",
    matiere: "francais",
    niveau: "CE1",
    titre: "Les dictées",
    ordre: 2,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [{
      type: "dictee",
      consigne: "Écoute bien et écris le mot que tu entends.",
      mots: [{ mot: "chat" }],
    }],
  });
  const mot = CleDeQuestion.de("dictee", "chat");
  const file = FileDeRevision.vide("profil-lea");
  file.retenir(
    [{ identite: mot, origine: { leconDOrigine: leconDesDictees.id, position: 0, type: "dictee" } }],
    jourDesErreurs,
    termineeLe,
  );
  const seance = seanceSur(file.planDeLaSeanceDeRevision(jourDeLaRevision), [leconDesDictees]);

  seance.repondre(Reponse.motEcrit(["x", "h", "a", "t"]));
  seance.repondre(Reponse.motEcrit(["c", "h", "a", "t"]));

  assertEquals(seance.estFinie(), true);
  assertEquals(seance.resultats(), [{ identite: mot, juste: false }]);
});
