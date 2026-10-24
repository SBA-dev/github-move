import { assertEquals, assertThrows } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardFixe, hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { TestDeDepartDejaFini, TestDeDepartNonFini } from "./erreurs.ts";
import { planDuTestDeDepart } from "./plan-du-test-de-depart.ts";
import { Reponse } from "./reponse.ts";
import { TestDeDepart } from "./test-de-depart.ts";
import { type Tireur, tireurAuHasard } from "./tireur.ts";

const CE1 = Niveau.de("CE1");
const programme = { section: "section", citation: "citation" };

function identifiantDeLecon(rang: number): string {
  return `fr-ce1-lecon-${String(rang + 1).padStart(2, "0")}`;
}

function uneLecon(rang: number, exercice: Record<string, unknown>): Lecon {
  return lireLecon({
    id: identifiantDeLecon(rang),
    matiere: "francais",
    niveau: "CE1",
    titre: `Leçon ${rang + 1}`,
    ordre: rang + 1,
    programme,
    exercices: [exercice],
  });
}

function desLecons(nombre: number): Lecon[] {
  return Array.from({ length: nombre }, (_, rang) =>
    uneLecon(rang, {
      type: "bulles",
      questions: [{ question: `Question ${rang + 1} ?`, choix: ["bonne", "mauvaise"], reponse: "bonne" }],
    }));
}

function testDeDepartSur(lecons: Lecon[], tireur: Tireur = tireurAuHasard(hasardSansMelange())): TestDeDepart {
  return TestDeDepart.commencer({
    generateurId: generateurIdFixe("test-1"),
    enfant: "lea",
    niveau: CE1,
    lecons,
    plan: planDuTestDeDepart(lecons, CE1, hasardSansMelange()),
    tireur,
  });
}

function testDeDepartDe(nombre: number): TestDeDepart {
  return testDeDepartSur(desLecons(nombre));
}

const bonne = Reponse.choix("bonne");
const mauvaise = Reponse.choix("mauvaise");

Deno.test("un test de départ commencé porte l'identifiant fourni, l'enfant et pose la première question", () => {
  const test = testDeDepartDe(3);

  assertEquals([test.id.valeur, test.enfant, test.questionEnCours()?.enonce], ["test-1", "lea", "Question 1 ?"]);
});

Deno.test("une bonne réponse du premier coup rend la question juste et passe à la suivante", () => {
  const test = testDeDepartDe(3);
  const premiere = test.questionEnCours();

  test.repondre(bonne);

  assertEquals([premiere?.erreurs, test.questionEnCours()?.enonce], [0, "Question 2 ?"]);
});

Deno.test("une mauvaise réponse garde la même question posée pour une nouvelle chance", () => {
  const test = testDeDepartDe(3);
  const premiere = test.questionEnCours();

  test.repondre(mauvaise);

  assertEquals([premiere?.erreurs, test.questionEnCours()], [1, premiere]);
});

Deno.test("la question n'est passée qu'avec la bonne réponse après une erreur", () => {
  const test = testDeDepartDe(3);
  test.repondre(mauvaise);

  test.repondre(bonne);

  assertEquals(test.questionEnCours()?.enonce, "Question 2 ?");
});

Deno.test("« Je ne sais pas » garde la même question posée et reste permis à la question suivante", () => {
  const test = testDeDepartDe(3);
  const premiere = test.questionEnCours();
  test.direJeNeSaisPas();
  test.repondre(bonne);

  assertEquals([premiere?.erreurs, test.direJeNeSaisPas().bonneReponse], [1, "bonne"]);
});

Deno.test("plusieurs erreurs à une même question ne comptent que pour une question fausse", () => {
  const test = testDeDepartDe(4);
  test.repondre(mauvaise);
  test.repondre(mauvaise);
  test.repondre(mauvaise);
  test.repondre(bonne);

  assertEquals([test.estArrete(), test.estFini()], [false, false]);
});

Deno.test("trois questions fausses de suite arrêtent le test de départ", () => {
  const test = testDeDepartDe(5);
  test.repondre(mauvaise);
  test.repondre(bonne);
  test.direJeNeSaisPas();
  test.repondre(bonne);
  test.repondre(mauvaise);
  test.repondre(bonne);

  assertEquals([test.estArrete(), test.estFini(), test.questionEnCours()], [true, true, undefined]);
});

Deno.test("une question juste remet à zéro le compte des questions fausses de suite", () => {
  const test = testDeDepartDe(6);
  for (const reponse of [mauvaise, mauvaise]) {
    test.repondre(reponse);
    test.repondre(bonne);
  }
  test.repondre(bonne);
  test.repondre(mauvaise);
  test.repondre(bonne);

  assertEquals([test.estArrete(), test.estFini()], [false, false]);
});

Deno.test("un test de départ dont toutes les questions sont passées est fini sans être arrêté", () => {
  const test = testDeDepartDe(2);
  test.repondre(bonne);
  test.repondre(bonne);

  assertEquals([test.estFini(), test.estArrete(), test.questionEnCours()], [true, false, undefined]);
});

Deno.test("répondre à un test de départ fini lève TestDeDepartDejaFini", () => {
  const test = testDeDepartDe(1);
  test.repondre(bonne);

  assertThrows(() => test.repondre(bonne), TestDeDepartDejaFini);
});

Deno.test("une question de calcul du test de départ se répond par un nombre au clavier", () => {
  const lecons = [uneLecon(0, { type: "calcul", operations: [{ q: "12 + 15", r: 27 }] })];
  const test = testDeDepartSur(lecons);

  test.repondre(Reponse.nombre(27));

  assertEquals(test.estFini(), true);
});

const finDuTest = new Date("2026-10-24T10:00:00Z");

Deno.test("terminer un test fini produit TestDeDepartTermine avec la leçon et le résultat de chaque question", () => {
  const test = testDeDepartDe(3);
  test.repondre(mauvaise);
  test.repondre(bonne);
  test.direJeNeSaisPas();
  test.repondre(bonne);
  test.repondre(bonne);

  const fait = test.terminer(finDuTest);

  assertEquals(fait, {
    type: "TestDeDepartTermine",
    test: "test-1",
    enfant: "lea",
    termineeLe: finDuTest,
    questions: [
      { lecon: identifiantDeLecon(0), juste: false },
      { lecon: identifiantDeLecon(1), juste: false },
      { lecon: identifiantDeLecon(2), juste: true },
    ],
    arrete: false,
  });
});

Deno.test("terminer un test arrêté n'indique que les questions posées et arrete", () => {
  const test = testDeDepartDe(5);
  for (let i = 0; i < 3; i++) {
    test.repondre(mauvaise);
    test.repondre(bonne);
  }

  const fait = test.terminer(finDuTest);

  assertEquals(fait.questions.map(({ lecon }) => lecon), [0, 1, 2].map(identifiantDeLecon));
  assertEquals(fait.arrete, true);
});

Deno.test("terminer un test pas fini lève TestDeDepartNonFini", () => {
  const test = testDeDepartDe(2);
  test.repondre(bonne);

  assertThrows(() => test.terminer(finDuTest), TestDeDepartNonFini);
});

Deno.test("l'envoi d'un test terminé porte l'identifiant, l'enfant, les questions prévues et la date de fin", () => {
  const lecons = desLecons(2);
  const test = testDeDepartSur(lecons);
  test.repondre(bonne);
  test.repondre(bonne);
  test.terminer(finDuTest);

  const envoi = test.aEnregistrer();

  assertEquals([envoi.test, envoi.enfant, envoi.termineeLe], ["test-1", "lea", finDuTest]);
  assertEquals(envoi.questions, planDuTestDeDepart(lecons, CE1, hasardSansMelange()));
});

Deno.test("l'envoi d'un test terminé contient les tirages réellement utilisés pour chaque question", () => {
  const test = testDeDepartSur(desLecons(2), tireurAuHasard(hasardFixe(0, 0)));
  test.repondre(bonne);
  test.repondre(bonne);
  test.terminer(finDuTest);

  assertEquals(test.aEnregistrer().tirages, [["mauvaise", "bonne"], ["mauvaise", "bonne"]]);
});

Deno.test("l'envoi contient les réponses de chaque question posée dans l'ordre, « Je ne sais pas » compris", () => {
  const test = testDeDepartDe(5);
  test.repondre(mauvaise);
  test.repondre(bonne);
  test.direJeNeSaisPas();
  test.repondre(bonne);
  test.repondre(mauvaise);
  test.repondre(bonne);
  test.terminer(finDuTest);

  assertEquals(test.aEnregistrer().reponses, [
    [mauvaise, bonne],
    [{ genre: "jeNeSaisPas" }, bonne],
    [mauvaise, bonne],
  ]);
});

Deno.test("l'envoi d'un test pas terminé lève TestDeDepartNonFini", () => {
  const test = testDeDepartDe(2);
  test.repondre(bonne);

  assertThrows(() => test.aEnregistrer(), TestDeDepartNonFini);
});
