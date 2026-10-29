import { assertEquals, assertExists, assertThrows } from "@std/assert";
import { type Lecon, lireLecon, matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import type { Defi, DefiReleve } from "./defis-de-la-matiere.ts";
import {
  DefiAVenir,
  DefiIncoherent,
  DefiInconnu,
  DefiNonFini,
  PlanDuDefiIncoherent,
  QuestionHorsDuDefi,
} from "./erreurs.ts";
import type { DefiTermineAEnregistrer } from "./defi-termine-a-enregistrer.ts";
import { Etoiles } from "./etoiles.ts";
import { Jour } from "./jour.ts";
import { type EntreesDuParcours, parcoursDeLaMatiere } from "./parcours.ts";
import { defisDeLaMatiere } from "./defis-de-la-matiere.ts";
import { type PlanDuDefi, planDuDefi, questionsPosablesDuDefi } from "./plan-du-defi.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLeDefi } from "./revalider-le-defi.ts";
import { REPONSES_AU_PLUS_PAR_QUESTION } from "./revalider-la-seance.ts";
import { SeanceDeDefi } from "./seance-de-defi.ts";
import { tireurAuHasard } from "./tireur.ts";

const CE1 = Niveau.de("CE1");
const maths = matiereDeCode("maths");
const finDuDefi = new Date("2026-10-29T16:30:00Z");
const jourDuDefi = Jour.de("2026-10-29");

function uneLecon(index: number): Lecon {
  return lireLecon({
    id: `ma-ce1-${index}`,
    matiere: "maths",
    niveau: "CE1",
    titre: `Leçon ${index}`,
    ordre: index,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [{
      type: "bulles",
      questions: [1, 2, 3, 4].map((rang) => ({
        question: `Question ${rang} de la leçon ${index} ?`,
        choix: ["oui", "non"],
        reponse: "oui",
      })),
    }],
  });
}

const lecons = Array.from({ length: 10 }, (_, index) => uneLecon(index + 1));
const leconsReussies = ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3", "ma-ce1-4", "ma-ce1-5"];

function entrees(reussies: readonly string[] = leconsReussies): EntreesDuParcours {
  return {
    lecons,
    niveau: CE1,
    meilleuresEtoiles: new Map(reussies.map((id) => [id, Etoiles.de(1)])),
  };
}

const defiNumero1: Defi = defisDeLaMatiere(parcoursDeLaMatiere(entrees(), maths), maths, CE1)[0];

const bonneReponse = Reponse.choix("oui");
const mauvaiseReponse = Reponse.choix("non");

/** Comme l'appareil : on joue le plan, la première question avec une erreur, la deuxième avec « Je ne sais pas ». */
function jouerLeDefi(plan: PlanDuDefi) {
  const seance = SeanceDeDefi.commencer({
    id: "defi-1",
    enfant: "profil-lea",
    defi: defiNumero1,
    plan,
    lecons,
    tireurDe: () => tireurAuHasard(hasardSansMelange()),
    niveau: CE1,
  });
  plan.questions.forEach((_, rang) => {
    if (rang === 0) seance.repondre(mauvaiseReponse);
    if (rang === 1) seance.direJeNeSaisPas();
    seance.repondre(bonneReponse);
  });
  const fait = seance.terminer(finDuDefi, jourDuDefi);
  return { fait, envoi: seance.aEnregistrer() };
}

const jouer = (plan: PlanDuDefi): DefiTermineAEnregistrer => jouerLeDefi(plan).envoi;

const planValide = planDuDefi(defiNumero1, lecons, hasardSansMelange());
const { fait: faitValide, envoi: envoiValide } = jouerLeDefi(planValide);

function revalider(
  envoi: DefiTermineAEnregistrer,
  options: { reussies?: readonly string[]; releves?: readonly DefiReleve[] } = {},
) {
  return revaliderLeDefi(envoi, entrees(options.reussies), options.releves ?? []);
}

Deno.test("un défi ouvert envoyé par l'appareil est revalidé et redonne le même défi terminé", () => {
  assertEquals(revalider(envoiValide), faitValide);
});

Deno.test("un défi déjà relevé, rejoué, est accepté", () => {
  const releves = [{ matiere: maths, niveau: CE1, numero: 1 }];

  const revalide = revalider(envoiValide, { releves });

  assertEquals(revalide.nombreDeQuestions, 10);
});

Deno.test("un défi relevé reste accepté même si ses leçons ne sont plus toutes réussies", () => {
  const releves = [{ matiere: maths, niveau: CE1, numero: 1 }];

  const revalide = revalider(envoiValide, { reussies: [], releves });

  assertEquals(revalide.defi.numero, 1);
});

Deno.test("les questions ratées d'un défi sont recalculées par le serveur en rejouant les réponses", () => {
  const revalide = revalider(envoiValide);

  assertEquals(
    revalide.questionsRatees.map(({ identite }) => identite),
    planValide.questions.slice(0, 2).map(({ identite }) => identite),
  );
});

Deno.test("une question avec une erreur puis la bonne réponse est ratée", () => {
  const revalide = revalider(envoiValide);

  assertEquals(revalide.questionsRatees[0].identite, planValide.questions[0].identite);
  assertEquals(revalide.questionsRatees[0].origine, planValide.questions[0].origine);
});

Deno.test("un « Je ne sais pas » rend la question ratée", () => {
  const revalide = revalider(envoiValide);

  assertEquals(revalide.questionsRatees[1].identite, planValide.questions[1].identite);
});

Deno.test("une question répondue juste du premier coup n'est pas ratée", () => {
  const revalide = revalider(envoiValide);

  const ratees = revalide.questionsRatees.map(({ identite }) => identite.valeur);
  assertEquals(ratees.includes(planValide.questions[2].identite.valeur), false);
});

Deno.test("un défi dont le numéro n'existe pas est refusé", () => {
  const envoi = { ...envoiValide, defi: { ...envoiValide.defi, numero: 99 } };

  assertThrows(() => revalider(envoi), DefiInconnu);
});

Deno.test("le défi de la dernière partie du parcours n'existe pas", () => {
  const envoi = { ...envoiValide, defi: { ...envoiValide.defi, numero: 2 } };

  assertThrows(() => revalider(envoi, { reussies: lecons.map(({ id }) => id) }), DefiInconnu);
});

Deno.test("un défi dont les leçons ne sont pas toutes réussies est à venir et refusé", () => {
  assertThrows(() => revalider(envoiValide, { reussies: leconsReussies.slice(0, 4) }), DefiAVenir);
});

Deno.test("une question d'une leçon hors du défi est refusée", () => {
  const horsDuDefi = questionsPosablesDuDefi({ ...defiNumero1, lecons: ["ma-ce1-6"] }, lecons)[0];
  const questions = [...planValide.questions.slice(0, 9), horsDuDefi];

  assertThrows(() => revalider(jouer({ questions })), QuestionHorsDuDefi);
});

Deno.test("une question qui n'existe dans aucune leçon du défi est refusée", () => {
  const inconnue = CleDeQuestion.de("bulles", "Une question qui n'existe pas ?oui");
  const questions = envoiValide.questions.map((cle, rang) => rang === 9 ? inconnue : cle);

  assertThrows(() => revalider({ ...envoiValide, questions }), QuestionHorsDuDefi);
});

Deno.test("un défi qui pose deux fois la même question est refusé comme incohérent", () => {
  const questions = [...planValide.questions.slice(0, 9), planValide.questions[0]];

  assertThrows(() => revalider(jouer({ questions })), PlanDuDefiIncoherent);
});

Deno.test("un défi de plus de 10 questions est refusé comme incohérent", () => {
  const supplementaire = questionsPosablesDuDefi(defiNumero1, lecons)
    .find(({ identite }) => !planValide.questions.some((q) => q.identite.valeur === identite.valeur));
  assertExists(supplementaire);
  const questions = [...planValide.questions, supplementaire];

  assertThrows(() => revalider(jouer({ questions })), PlanDuDefiIncoherent);
});

Deno.test("un défi de moins de 10 questions alors que la bibliothèque en offre assez est refusé comme incohérent", () => {
  const questions = planValide.questions.slice(0, 9);

  assertThrows(() => revalider(jouer({ questions })), PlanDuDefiIncoherent);
});

Deno.test("un défi dont les questions ne sont pas réparties entre les leçons est refusé comme incohérent", () => {
  const deLaLecon = (id: string) => questionsPosablesDuDefi({ ...defiNumero1, lecons: [id] }, lecons);
  const questions = [
    ...deLaLecon("ma-ce1-1"),
    ...deLaLecon("ma-ce1-2"),
    ...deLaLecon("ma-ce1-3").slice(0, 2),
  ];

  assertThrows(() => revalider(jouer({ questions })), PlanDuDefiIncoherent);
});

Deno.test("une question qui ne finit pas par la bonne réponse est refusée", () => {
  const reponses = envoiValide.reponses.map((donnees, rang) => rang === 4 ? [mauvaiseReponse] : donnees);

  assertThrows(() => revalider({ ...envoiValide, reponses }), DefiNonFini);
});

Deno.test("une question sans aucune réponse est refusée", () => {
  const reponses = envoiValide.reponses.map((donnees, rang) => rang === 4 ? [] : donnees);

  assertThrows(() => revalider({ ...envoiValide, reponses }), DefiNonFini);
});

Deno.test("une réponse donnée après la réussite d'une question est refusée, sans être reportée sur la question suivante", () => {
  const reponses = envoiValide.reponses.map((donnees, rang) => rang === 4 ? [...donnees, bonneReponse] : donnees);

  assertThrows(() => revalider({ ...envoiValide, reponses }), DefiIncoherent);
});

Deno.test("une question sans réponse est refusée même quand la question précédente a une réponse de trop", () => {
  const reponses = envoiValide.reponses.map((donnees, rang) => {
    if (rang === 4) return [...donnees, bonneReponse];
    return rang === 5 ? [] : donnees;
  });

  assertThrows(() => revalider({ ...envoiValide, reponses }), DefiIncoherent);
});

Deno.test("un tirage qui n'est pas un ordre possible des choix est refusé comme incohérent", () => {
  const tirages = envoiValide.tirages.map((tirage, rang) => rang === 0 ? ["inconnue", "autre"] : tirage);

  assertThrows(() => revalider({ ...envoiValide, tirages }), DefiIncoherent);
});

Deno.test("un défi envoyé pour une autre classe que celle du profil est refusé", () => {
  const envoi = { ...envoiValide, defi: { ...envoiValide.defi, niveau: Niveau.de("CE2") } };

  assertThrows(() => revalider(envoi), DefiInconnu);
});

Deno.test("un envoi qui a moins de tirages que de questions est refusé comme incohérent", () => {
  const tirages = envoiValide.tirages.slice(0, 9);

  assertThrows(() => revalider({ ...envoiValide, tirages }), DefiIncoherent);
});

Deno.test("un envoi qui a moins de listes de réponses que de questions est refusé comme incohérent", () => {
  const reponses = envoiValide.reponses.slice(0, 9);

  assertThrows(() => revalider({ ...envoiValide, reponses }), DefiIncoherent);
});

Deno.test("un envoi qui a plus de listes de réponses que de questions est refusé comme incohérent", () => {
  const reponses = [...envoiValide.reponses, [bonneReponse]];

  assertThrows(() => revalider({ ...envoiValide, reponses }), DefiIncoherent);
});

Deno.test("une question avec trop de réponses est refusée comme incohérente", () => {
  const tropDeReponses = Array.from({ length: REPONSES_AU_PLUS_PAR_QUESTION + 1 }, () => mauvaiseReponse);
  const reponses = envoiValide.reponses.map((donnees, rang) => rang === 4 ? tropDeReponses : donnees);

  assertThrows(() => revalider({ ...envoiValide, reponses }), DefiIncoherent);
});

const CE2 = Niveau.de("CE2");

function uneLeconDeCE2(index: number): Lecon {
  return lireLecon({
    id: `ma-ce2-${index}`,
    matiere: "maths",
    niveau: "CE2",
    titre: `Leçon ${index}`,
    ordre: index,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [{
      type: "bulles",
      questions: [1, 2, 3, 4].map((rang) => ({
        question: `Question ${rang} de la leçon ${index} ?`,
        choix: ["oui", "non"],
        reponse: "oui",
      })),
    }],
  });
}

const leconsDesDeuxClasses = [...lecons, ...Array.from({ length: 10 }, (_, index) => uneLeconDeCE2(index + 1))];

function entreesDuProfilEnCE2(reussies: readonly string[]): EntreesDuParcours {
  return {
    lecons: leconsDesDeuxClasses,
    niveau: CE2,
    meilleuresEtoiles: new Map(reussies.map((id) => [id, Etoiles.de(1)])),
  };
}

const cinqLeconsDeCE2 = ["ma-ce2-1", "ma-ce2-2", "ma-ce2-3", "ma-ce2-4", "ma-ce2-5"];
const defiCE2Numero1: Defi =
  defisDeLaMatiere(parcoursDeLaMatiere(entreesDuProfilEnCE2(cinqLeconsDeCE2), maths), maths, CE2)[0];

function jouerLeDefiDeCE2(): DefiTermineAEnregistrer {
  const plan = planDuDefi(defiCE2Numero1, leconsDesDeuxClasses, hasardSansMelange());
  const seance = SeanceDeDefi.commencer({
    id: "defi-2",
    enfant: "profil-lea",
    defi: defiCE2Numero1,
    plan,
    lecons: leconsDesDeuxClasses,
    tireurDe: () => tireurAuHasard(hasardSansMelange()),
    niveau: CE2,
  });
  plan.questions.forEach(() => seance.repondre(bonneReponse));
  seance.terminer(finDuDefi, jourDuDefi);
  return seance.aEnregistrer();
}

Deno.test("le défi terminé d'un profil porte la classe du profil", () => {
  const revalide = revaliderLeDefi(jouerLeDefiDeCE2(), entreesDuProfilEnCE2(cinqLeconsDeCE2), []);

  assertEquals(revalide.defi.niveau, CE2);
});

Deno.test("un défi de CE1 déjà relevé n'ouvre pas le défi de CE2 de même numéro, qui reste à venir", () => {
  const releves = [{ matiere: maths, niveau: CE1, numero: 1 }];

  assertThrows(() => revaliderLeDefi(jouerLeDefiDeCE2(), entreesDuProfilEnCE2([]), releves), DefiAVenir);
});

Deno.test("un profil de CE2 ne peut pas faire passer un défi de CE1 relevé pour le défi de même numéro de sa classe", () => {
  const releves = [{ matiere: maths, niveau: CE1, numero: 1 }];

  assertThrows(() => revaliderLeDefi(envoiValide, entreesDuProfilEnCE2([]), releves), DefiInconnu);
});
