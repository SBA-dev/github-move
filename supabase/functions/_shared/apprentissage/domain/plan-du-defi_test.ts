import { assert, assertEquals, assertThrows } from "@std/assert";
import { type Lecon, lireLecon, matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import type { Defi } from "./defis-de-la-matiere.ts";
import { AucuneQuestionPourLeDefi } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { planDuDefi, questionsPosablesDuDefi } from "./plan-du-defi.ts";

const programme = { section: "section", citation: "citation" };
const hasardToujoursEnTete: Hasard = { entre0et1: () => 0 };

function lecon(id: string, nombreDeQuestions: number, autresExercices: object[] = []): Lecon {
  const bulles = nombreDeQuestions === 0 ? [] : [{
    type: "bulles",
    questions: Array.from({ length: nombreDeQuestions }, (_, rang) => ({
      question: `Question ${rang} de ${id} ?`,
      choix: ["ou", "on"],
      reponse: "ou",
    })),
  }];
  return lireLecon({
    id,
    matiere: "maths",
    niveau: "CE1",
    titre: `Titre de ${id}`,
    ordre: 1,
    programme,
    exercices: [...bulles, ...autresExercices],
  });
}

function leconsDe(...nombresDeQuestions: number[]): Lecon[] {
  return nombresDeQuestions.map((nombre, index) => lecon(`ma-ce1-${index + 1}`, nombre));
}

function defiDe(lecons: readonly Lecon[]): Defi {
  return { matiere: matiereDeCode("maths"), niveau: Niveau.de("CE1"), numero: 1, lecons: lecons.map(({ id }) => id) };
}

function questionsParLecon(lecons: readonly Lecon[], hasard: Hasard = hasardSansMelange()): number[] {
  const { questions } = planDuDefi(defiDe(lecons), lecons, hasard);
  return lecons.map(({ id }) => questions.filter(({ origine }) => origine.leconDOrigine === id).length);
}

const fluence = { type: "fluence", titre: "Calcul rapide", duree: 45, generateur: { op: "×", a: [1, 10], b: [2, 2] } };
const ordre = { type: "ordre", elements: ["do", "mi", "no"] };
const memoriser = { type: "memoriser", titre: "Le poème", vers: ["Un vers", "Un autre vers"] };

Deno.test("les questions posables d'un défi sont celles de ses leçons, avec leur leçon d'origine, leur position et leur type", () => {
  const lecons = leconsDe(2);

  const posables = questionsPosablesDuDefi(defiDe(lecons), lecons);

  assertEquals(
    posables.map(({ origine }) => origine),
    [
      { leconDOrigine: "ma-ce1-1", position: 0, type: "bulles" },
      { leconDOrigine: "ma-ce1-1", position: 0, type: "bulles" },
    ],
  );
  assertEquals(new Set(posables.map(({ identite }) => identite.valeur)).size, 2);
});

Deno.test("les questions posables d'un défi ne viennent jamais d'une leçon hors du défi", () => {
  const lecons = leconsDe(2, 2, 2);
  const defi = defiDe(lecons.slice(0, 2));

  const posables = questionsPosablesDuDefi(defi, lecons);

  assertEquals(posables.length, 4);
  assert(posables.every(({ origine }) => origine.leconDOrigine !== "ma-ce1-3"));
});

Deno.test("les questions posables d'un défi ne comprennent ni fluence, ni ordre, ni mémoriser", () => {
  const lecons = [lecon("ma-ce1-1", 1, [fluence, ordre, memoriser])];

  const posables = questionsPosablesDuDefi(defiDe(lecons), lecons);

  assertEquals(posables.map(({ origine }) => origine.type), ["bulles"]);
});

Deno.test("un défi de 5 leçons de 2 questions pose 2 questions par leçon", () => {
  assertEquals(questionsParLecon(leconsDe(2, 2, 2, 2, 2)), [2, 2, 2, 2, 2]);
});

Deno.test("un défi de 5 leçons de 4 questions pose 10 questions, 2 par leçon", () => {
  assertEquals(questionsParLecon(leconsDe(4, 4, 4, 4, 4)), [2, 2, 2, 2, 2]);
});

Deno.test("une leçon qui manque de questions les donne toutes et les autres complètent jusqu'à 10", () => {
  const parLecon = questionsParLecon(leconsDe(1, 4, 4, 4, 4));

  assertEquals(parLecon[0], 1);
  assertEquals(parLecon.reduce((a, b) => a + b, 0), 10);
  assert(parLecon.slice(1).every((nombre) => nombre >= 2 && nombre <= 3));
});

Deno.test("sept leçons riches se partagent 10 questions : chacune en donne 1 ou 2", () => {
  const parLecon = questionsParLecon(leconsDe(4, 4, 4, 4, 4, 4, 4));

  assertEquals(parLecon.reduce((a, b) => a + b, 0), 10);
  assertEquals(parLecon.filter((nombre) => nombre === 2).length, 3);
  assertEquals(parLecon.filter((nombre) => nombre === 1).length, 4);
});

Deno.test("les leçons qui donnent une question de plus sont tirées au hasard", () => {
  const lecons = leconsDe(4, 4, 4, 4, 4, 4, 4);
  const tirageFavorable: Hasard = { entre0et1: () => 0 };
  const tirageDefavorable: Hasard = { entre0et1: () => 0.999 };

  assert(
    questionsParLecon(lecons, tirageFavorable).join() !== questionsParLecon(lecons, tirageDefavorable).join(),
  );
});

Deno.test("avec moins de 10 questions posables, le défi les pose toutes, une fois chacune", () => {
  const lecons = leconsDe(2, 2, 1, 1);
  const attendues = questionsPosablesDuDefi(defiDe(lecons), lecons).map(({ identite }) => identite.valeur).sort();

  const { questions } = planDuDefi(defiDe(lecons), lecons, hasardSansMelange());

  assertEquals(questions.map(({ identite }) => identite.valeur).sort(), attendues);
  assertEquals(questions.length, 6);
});

Deno.test("une question n'est jamais posée deux fois dans un défi", () => {
  const lecons = leconsDe(4, 4, 4, 4, 4);

  const { questions } = planDuDefi(defiDe(lecons), lecons, hasardToujoursEnTete);

  assertEquals(new Set(questions.map(({ identite }) => identite.valeur)).size, 10);
});

Deno.test("les questions du défi sont mélangées : elles ne sont pas groupées par leçon", () => {
  const lecons = leconsDe(2, 2, 2, 2, 2);

  const { questions } = planDuDefi(defiDe(lecons), lecons, hasardToujoursEnTete);

  const leconsDansLOrdre = questions.map(({ origine }) => origine.leconDOrigine);
  const groupees = [...leconsDansLOrdre].sort();
  assert(leconsDansLOrdre.join() !== groupees.join());
});

Deno.test("une fluence, un ordre ou un mémoriser d'une leçon du défi n'est jamais tiré", () => {
  const lecons = [
    lecon("ma-ce1-1", 6, [fluence, ordre, memoriser]),
    lecon("ma-ce1-2", 6, [fluence, ordre, memoriser]),
  ];

  const { questions } = planDuDefi(defiDe(lecons), lecons, hasardToujoursEnTete);

  assertEquals(questions.length, 10);
  assert(questions.every(({ origine }) => origine.type === "bulles"));
});

Deno.test("le plan du défi ne tire jamais une question d'une leçon hors du défi", () => {
  const lecons = leconsDe(4, 4, 4);

  const { questions } = planDuDefi(defiDe(lecons.slice(0, 2)), lecons, hasardSansMelange());

  assert(questions.every(({ origine }) => origine.leconDOrigine !== "ma-ce1-3"));
});

Deno.test("un défi sans aucune question posable n'a pas de plan", () => {
  const lecons = [lecon("ma-ce1-1", 0, [fluence, ordre]), lecon("ma-ce1-2", 0)];

  assertThrows(() => planDuDefi(defiDe(lecons), lecons, hasardSansMelange()), AucuneQuestionPourLeDefi);
});
