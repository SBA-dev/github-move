import { assertEquals, assertThrows } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { TestDeDepartIncoherent } from "./erreurs.ts";
import { type PlanDuTestDeDepart, planDuTestDeDepart } from "./plan-du-test-de-depart.ts";
import { Reponse, type ReponseDonnee, type ReponseEnNombre, type ReponseParChoix } from "./reponse.ts";
import { revaliderLeTestDeDepart } from "./revalider-le-test-de-depart.ts";
import { TestDeDepart } from "./test-de-depart.ts";
import type { TestDeDepartTermineAEnregistrer } from "./test-de-depart-termine-a-enregistrer.ts";
import { tireurAuHasard } from "./tireur.ts";

const CP = Niveau.de("CP");
const CE1 = Niveau.de("CE1");
const finDuTest = new Date("2026-10-24T10:00:00Z");
const bonne = Reponse.choix("bonne");
const mauvaise = Reponse.choix("mauvaise");

function uneLecon(rang: number, niveau = "CE1", matiere = "francais"): Lecon {
  return lireLecon({
    id: `${matiere}-${niveau}-${rang + 1}`,
    matiere,
    niveau,
    titre: `Leçon ${rang + 1}`,
    ordre: rang + 1,
    programme: { section: "section", citation: "citation" },
    exercices: [{
      type: "bulles",
      questions: [{ question: `Question ${rang + 1} ?`, choix: ["bonne", "mauvaise"], reponse: "bonne" }],
    }],
  });
}

function leconDeCalculFixe(rang: number): Lecon {
  return lireLecon({
    id: `francais-CE1-${rang + 1}`,
    matiere: "francais",
    niveau: "CE1",
    titre: `Leçon ${rang + 1}`,
    ordre: rang + 1,
    programme: { section: "section", citation: "citation" },
    exercices: [{ type: "calcul", generateur: { op: "+", a: [5, 5], b: [3, 3], combien: 1 } }],
  });
}

function desLecons(nombre: number): Lecon[] {
  return Array.from({ length: nombre }, (_, rang) => uneLecon(rang));
}

function question(lecon: Lecon) {
  return { leconId: lecon.id, exercice: 0, rang: 0 };
}

function jouer(
  lecons: Lecon[],
  reponses: (ReponseParChoix | ReponseEnNombre)[],
  { niveau = CE1, plan = planDuTestDeDepart(lecons, niveau, hasardSansMelange()) }: {
    niveau?: Niveau;
    plan?: PlanDuTestDeDepart;
  } = {},
) {
  const test = TestDeDepart.commencer({
    generateurId: generateurIdFixe("test-1"),
    enfant: "lea",
    niveau,
    lecons,
    plan,
    tireur: tireurAuHasard(hasardSansMelange()),
  });
  reponses.forEach((reponse) => test.repondre(reponse));
  return { fait: test.terminer(finDuTest), test };
}

function envoiJoue(
  lecons: Lecon[],
  reponses: (ReponseParChoix | ReponseEnNombre)[],
  options?: Parameters<typeof jouer>[2],
) {
  const { test, fait } = jouer(lecons, reponses, options);
  return { envoi: test.aEnregistrer(), fait };
}

function modifie(envoi: TestDeDepartTermineAEnregistrer, changements: Partial<TestDeDepartTermineAEnregistrer>) {
  return { ...envoi, ...changements };
}

function assertIncoherent(envoi: TestDeDepartTermineAEnregistrer, lecons: Lecon[], niveau = CE1) {
  assertThrows(() => revaliderLeTestDeDepart(envoi, lecons, niveau), TestDeDepartIncoherent);
}

Deno.test("un envoi cohérent est revalidé et redonne les mêmes questions justes ou fausses", () => {
  const lecons = desLecons(4);
  const { envoi, fait } = envoiJoue(lecons, [mauvaise, bonne, bonne, bonne, bonne]);

  assertEquals(revaliderLeTestDeDepart(envoi, lecons, CE1), fait);
});

Deno.test("un test arrêté après 3 questions fausses de suite est revalidé comme arrêté", () => {
  const lecons = desLecons(5);
  const { envoi, fait } = envoiJoue(lecons, [mauvaise, bonne, mauvaise, bonne, mauvaise, bonne]);

  const revalide = revaliderLeTestDeDepart(envoi, lecons, CE1);

  assertEquals([revalide.arrete, revalide.questions.length], [true, 3]);
  assertEquals(revalide, fait);
});

Deno.test("le serveur recalcule si chaque question est juste et ignore le « juste » envoyé par le front", () => {
  const lecons = desLecons(3);
  const { envoi } = envoiJoue(lecons, [mauvaise, bonne, bonne, bonne]);
  const envoiTriche = Object.assign({}, envoi, { questions: envoi.questions.map((q) => ({ ...q, juste: true })) });

  const revalide = revaliderLeTestDeDepart(envoiTriche, lecons, CE1);

  assertEquals(revalide.questions.map(({ juste }) => juste), [false, true, true]);
});

Deno.test("une question dont la leçon est au-dessus du niveau actuel du profil rend le test incohérent", () => {
  const lecons = [uneLecon(0, "CP"), uneLecon(1, "CE1")];
  const { envoi } = envoiJoue(lecons, [bonne, bonne], { niveau: CE1 });

  assertIncoherent(envoi, lecons, CP);
});

Deno.test("une question dont la leçon n'est pas dans la réserve (autre matière) rend le test incohérent", () => {
  const lecons = [uneLecon(0), uneLecon(1, "CE1", "sciences")];
  const { envoi } = envoiJoue(lecons, [bonne, bonne], { plan: lecons.map(question) });

  assertIncoherent(envoi, lecons);
});

Deno.test("deux questions de la même leçon rendent le test incohérent", () => {
  const lecons = desLecons(2);
  const { envoi } = envoiJoue(lecons, [bonne, bonne, bonne], {
    plan: [question(lecons[0]), question(lecons[0]), question(lecons[1])],
  });

  assertIncoherent(envoi, lecons);
});

Deno.test("plus de 12 questions rendent le test incohérent", () => {
  const lecons = desLecons(13);
  const { envoi } = envoiJoue(lecons, lecons.map(() => bonne), { plan: lecons.map(question) });

  assertIncoherent(envoi, lecons);
});

Deno.test("des questions qui ne suivent pas l'ordre de la réserve rendent le test incohérent", () => {
  const lecons = desLecons(3);
  const { envoi } = envoiJoue(lecons, [bonne, bonne, bonne], {
    plan: [question(lecons[1]), question(lecons[0]), question(lecons[2])],
  });

  assertIncoherent(envoi, lecons);
});

Deno.test("un tirage invalide rend le test incohérent", () => {
  const lecons = desLecons(3);
  const { envoi } = envoiJoue(lecons, [bonne, bonne, bonne]);

  assertIncoherent(modifie(envoi, { tirages: [[["inconnue", "autre"]], ...envoi.tirages.slice(1)] }), lecons);
});

Deno.test("une question posée qui ne finit pas par la bonne réponse rend le test incohérent", () => {
  const lecons = desLecons(3);
  const { envoi } = envoiJoue(lecons, [bonne, bonne, bonne]);

  assertIncoherent(modifie(envoi, { reponses: [envoi.reponses[0], [mauvaise], envoi.reponses[2]] }), lecons);
});

Deno.test("des réponses données après l'arrêt rendent le test incohérent", () => {
  const lecons = desLecons(5);
  const { envoi } = envoiJoue(lecons, [mauvaise, bonne, mauvaise, bonne, mauvaise, bonne]);

  assertIncoherent(modifie(envoi, { reponses: [...envoi.reponses, [bonne]] }), lecons);
});

Deno.test("un test qui s'arrête avant la fin sans 3 questions fausses de suite rend le test incohérent", () => {
  const lecons = desLecons(4);
  const { envoi } = envoiJoue(lecons, [bonne, bonne, bonne, bonne]);

  assertIncoherent(modifie(envoi, { reponses: envoi.reponses.slice(0, 2) }), lecons);
});

Deno.test("une question dont la leçon a été retirée de la bibliothèque est ignorée : ni juste ni fausse, le reste est revalidé", () => {
  const lecons = desLecons(4);
  const { envoi } = envoiJoue(lecons, [bonne, mauvaise, bonne, bonne, bonne]);
  const sansLaDeuxieme = lecons.filter((_, rang) => rang !== 1);

  const revalide = revaliderLeTestDeDepart(envoi, sansLaDeuxieme, CE1);

  assertEquals(revalide.questions, [
    { lecon: lecons[0].id, juste: true },
    { lecon: lecons[2].id, juste: true },
    { lecon: lecons[3].id, juste: true },
  ]);
});

Deno.test("le pas régulier du plan n'est pas revérifié : un plan qui saute des leçons de la réserve est accepté", () => {
  const lecons = desLecons(6);
  const { envoi, fait } = envoiJoue(lecons, [bonne, bonne, bonne], {
    plan: [question(lecons[0]), question(lecons[2]), question(lecons[4])],
  });

  assertEquals(revaliderLeTestDeDepart(envoi, lecons, CE1), fait);
});

Deno.test("une question retirée de la bibliothèque est ignorée avec son tirage d'opérations générées, le reste est revalidé", () => {
  const lecons = [uneLecon(0), leconDeCalculFixe(1), uneLecon(2)];
  const { envoi } = envoiJoue(lecons, [bonne, Reponse.nombre(8), bonne]);
  const sansLeCalcul = [lecons[0], lecons[2]];

  const revalide = revaliderLeTestDeDepart(envoi, sansLeCalcul, CE1);

  assertEquals(revalide.questions, [
    { lecon: lecons[0].id, juste: true },
    { lecon: lecons[2].id, juste: true },
  ]);
});

function envoiDeTroisQuestions() {
  const lecons = desLecons(3);
  return { lecons, ...envoiJoue(lecons, [bonne, bonne, bonne]) };
}

function avecReponsesALaPremiereQuestion(envoi: TestDeDepartTermineAEnregistrer, reponses: ReponseDonnee[]) {
  return modifie(envoi, { reponses: [reponses, ...envoi.reponses.slice(1)] });
}

Deno.test("une réponse par un choix qui n'est pas proposé rend le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();

  assertIncoherent(avecReponsesALaPremiereQuestion(envoi, [Reponse.choix("inconnu"), bonne]), lecons);
});

Deno.test("une réponse en nombre à une question à choix rend le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();

  assertIncoherent(avecReponsesALaPremiereQuestion(envoi, [Reponse.nombre(8)]), lecons);
});

Deno.test("une réponse par placement rend le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();

  assertIncoherent(avecReponsesALaPremiereQuestion(envoi, [Reponse.placement("etiquette"), bonne]), lecons);
});

Deno.test("une réponse par mot écrit rend le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();

  assertIncoherent(avecReponsesALaPremiereQuestion(envoi, [Reponse.motEcrit(["a"]), bonne]), lecons);
});

Deno.test("un « Je ne sais pas » répété sur la même question rend le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();
  const jeNeSaisPas = { genre: "jeNeSaisPas" } as const;

  assertIncoherent(avecReponsesALaPremiereQuestion(envoi, [jeNeSaisPas, jeNeSaisPas, bonne]), lecons);
});

Deno.test("des réponses pour un rang au-delà du plan rendent le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();

  assertIncoherent(modifie(envoi, { reponses: [...envoi.reponses, [bonne]] }), lecons);
});

Deno.test("un groupe de tirages de plus que de questions prévues rend le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();

  assertIncoherent(modifie(envoi, { tirages: [...envoi.tirages, [["bonne", "mauvaise"]]] }), lecons);
});

Deno.test("un tirage non consommé dans le groupe d'une question rend le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();
  const tiragesEnTrop = [[...envoi.tirages[0], ["bonne", "mauvaise"]], ...envoi.tirages.slice(1)];

  assertIncoherent(modifie(envoi, { tirages: tiragesEnTrop }), lecons);
});

function laissantLaLeconRetiree(lecons: Lecon[], retiree: number) {
  return lecons.filter((_, rang) => rang !== retiree);
}

Deno.test("une leçon retirée entre deux questions fausses compte comme fausse : le test arrêté à 3 questions fausses de suite reste revalidé", () => {
  const lecons = desLecons(5);
  const { envoi } = envoiJoue(lecons, [mauvaise, bonne, mauvaise, bonne, mauvaise, bonne]);

  const revalide = revaliderLeTestDeDepart(envoi, laissantLaLeconRetiree(lecons, 1), CE1);

  assertEquals(revalide.arrete, true);
  assertEquals(revalide.questions, [
    { lecon: lecons[0].id, juste: false },
    { lecon: lecons[2].id, juste: false },
  ]);
});

Deno.test("une leçon retirée répondue juste interrompt la série des questions fausses de suite : le test n'est pas arrêté", () => {
  const lecons = desLecons(5);
  const { envoi } = envoiJoue(lecons, [mauvaise, bonne, mauvaise, bonne, bonne, mauvaise, bonne, mauvaise, bonne]);

  const revalide = revaliderLeTestDeDepart(envoi, laissantLaLeconRetiree(lecons, 2), CE1);

  assertEquals(revalide.arrete, false);
  assertEquals(revalide.questions.length, 4);
});

function uneLeconAvecUneDictee(): Lecon {
  return lireLecon({
    id: "francais-CE1-1",
    matiere: "francais",
    niveau: "CE1",
    titre: "Leçon 1",
    ordre: 1,
    programme: { section: "section", citation: "citation" },
    exercices: [
      {
        type: "bulles",
        questions: [{ question: "Question 1 ?", choix: ["bonne", "mauvaise"], reponse: "bonne" }],
      },
      { type: "dictee", titre: "Dictée", mots: [{ mot: "chat" }] },
    ],
  });
}

function avecLaPremiereQuestion(
  envoi: TestDeDepartTermineAEnregistrer,
  changements: Partial<ReturnType<typeof question>>,
) {
  return modifie(envoi, { questions: [{ ...envoi.questions[0], ...changements }, ...envoi.questions.slice(1)] });
}

Deno.test("un plan qui vise un exercice exclu du test de départ (dictée) rend le test incohérent", () => {
  const lecons = [uneLeconAvecUneDictee(), uneLecon(1), uneLecon(2)];
  const { envoi } = envoiJoue(lecons, [bonne, bonne, bonne]);

  assertIncoherent(avecLaPremiereQuestion(envoi, { exercice: 1 }), lecons);
});

Deno.test("un indice d'exercice hors limites rend le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();

  assertIncoherent(avecLaPremiereQuestion(envoi, { exercice: 7 }), lecons);
});

Deno.test("un rang de question hors limites rend le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();

  assertIncoherent(avecLaPremiereQuestion(envoi, { rang: 5 }), lecons);
});

Deno.test("un groupe de tirages vide pour une question qui doit être tirée rend le test incohérent", () => {
  const lecons = [leconDeCalculFixe(0), uneLecon(1), uneLecon(2)];
  const { envoi } = envoiJoue(lecons, [Reponse.nombre(8), bonne, bonne]);

  assertIncoherent(modifie(envoi, { tirages: [[], ...envoi.tirages.slice(1)] }), lecons);
});

Deno.test("un tirage déplacé dans le groupe de la question précédente rend le test incohérent", () => {
  const lecons = [uneLecon(0), leconDeCalculFixe(1), uneLecon(2)];
  const { envoi } = envoiJoue(lecons, [bonne, Reponse.nombre(8), bonne]);
  const [premier, deuxieme, ...suite] = envoi.tirages;

  assertIncoherent(modifie(envoi, { tirages: [[...premier, ...deuxieme], [], ...suite] }), lecons);
});

Deno.test("un envoi sans aucune question rend le test incohérent", () => {
  const { lecons, envoi } = envoiDeTroisQuestions();

  assertIncoherent(modifie(envoi, { questions: [], tirages: [], reponses: [] }), lecons);
});

Deno.test("un envoi dont toutes les leçons ont été retirées de la bibliothèque rend le test incohérent", () => {
  const { envoi } = envoiDeTroisQuestions();

  assertIncoherent(envoi, []);
});
