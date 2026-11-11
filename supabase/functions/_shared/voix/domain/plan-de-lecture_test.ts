import { assertEquals } from "@std/assert";
import { repertoireDeTest } from "../test_utils/repertoire-de-test.ts";
import { empreinteFnv1a64 } from "./cle-de-phrase.ts";
import type { LectureDemandee } from "./lecteur-a-voix-haute.ts";
import { planDeLecture, suitesDeMemeSource } from "./plan-de-lecture.ts";

const RYTHME = 0.9;
const HAUTEUR = 1;

function lecture(
  phrases: readonly string[],
  options: { langue?: string; allure?: "normale" | "lente" } = {},
): LectureDemandee {
  return {
    voix: undefined,
    langue: options.langue ?? "fr-FR",
    allure: options.allure,
    phrases: phrases.map((phrase) => ({ phrase, hauteur: HAUTEUR, rythme: RYTHME })),
  };
}

const cle = empreinteFnv1a64;

Deno.test("une phrase française présente au répertoire est lue par la voix enregistrée, à l'allure normale", () => {
  const repertoire = repertoireDeTest({ [cle("Bravo !")]: { normale: "aaaa1111" } });

  const plan = planDeLecture(lecture(["Bravo !"]), repertoire);

  assertEquals(plan, [{
    source: "enregistree",
    phrase: "Bravo !",
    rang: 0,
    cle: cle("Bravo !"),
    empreinte: "aaaa1111",
    allure: "normale",
    rythme: RYTHME,
  }]);
});

Deno.test("une phrase française absente du répertoire est lue par la voix de l'appareil", () => {
  const plan = planDeLecture(lecture(["Bravo !"]), repertoireDeTest());

  assertEquals(plan, [{
    source: "voixDeLAppareil",
    phrase: "Bravo !",
    rang: 0,
    rythme: RYTHME,
  }]);
});

Deno.test("chaque phrase d'une lecture a sa propre source, dans l'ordre", () => {
  const repertoire = repertoireDeTest({ [cle("Bravo !")]: { normale: "aaaa1111" } });

  const plan = planDeLecture(lecture(["Bravo !", "Écoute bien."]), repertoire);

  assertEquals(plan.map(({ source, phrase, rang }) => ({ source, phrase, rang })), [
    { source: "enregistree", phrase: "Bravo !", rang: 0 },
    { source: "voixDeLAppareil", phrase: "Écoute bien.", rang: 1 },
  ]);
});

Deno.test("une phrase en langue étrangère est lue par la voix de l'appareil même si sa clé existe", () => {
  const repertoire = repertoireDeTest({ [cle("Hello !")]: { normale: "aaaa1111" } });

  const plan = planDeLecture(lecture(["Hello !"], { langue: "en-GB" }), repertoire);

  assertEquals(plan.map(({ source }) => source), ["voixDeLAppareil"]);
});

Deno.test("à l'allure lente, le MP3 lent est choisi quand il existe", () => {
  const repertoire = repertoireDeTest({
    [cle("Bravo !")]: { normale: "aaaa1111", lente: "bbbb2222" },
  });

  const plan = planDeLecture(lecture(["Bravo !"], { allure: "lente" }), repertoire);

  assertEquals(plan.map(({ source, empreinte, allure }) => ({ source, empreinte, allure })), [
    { source: "enregistree", empreinte: "bbbb2222", allure: "lente" },
  ]);
});

Deno.test("à l'allure lente, sans MP3 lent, le MP3 normal est choisi et le lecteur ralentira", () => {
  const repertoire = repertoireDeTest({ [cle("Bravo !")]: { normale: "aaaa1111" } });

  const plan = planDeLecture(lecture(["Bravo !"], { allure: "lente" }), repertoire);

  assertEquals(plan.map(({ source, empreinte, allure }) => ({ source, empreinte, allure })), [
    { source: "enregistree", empreinte: "aaaa1111", allure: "normale" },
  ]);
});

Deno.test("la clé d'une phrase est calculée sur son texte normalisé : apostrophes droite et typographique donnent le même morceau", () => {
  const repertoire = repertoireDeTest({ [cle("C'est l'été !")]: { normale: "aaaa1111" } });

  const avecApostropheDroite = planDeLecture(lecture(["C'est l'été !"]), repertoire);
  const avecApostropheTypographique = planDeLecture(lecture(["C’est l’été !"]), repertoire);

  assertEquals(avecApostropheTypographique[0].source, "enregistree");
  assertEquals(
    avecApostropheTypographique.map(({ cle, empreinte }) => ({ cle, empreinte })),
    avecApostropheDroite.map(({ cle, empreinte }) => ({ cle, empreinte })),
  );
});

Deno.test("un plan est découpé en suites de morceaux consécutifs de même source, dans l'ordre", () => {
  const repertoire = repertoireDeTest({ [cle("Bravo !")]: { normale: "aaaa1111" } });
  const plan = planDeLecture(lecture(["Un.", "Deux.", "Bravo !", "Trois."]), repertoire);

  const suites = suitesDeMemeSource(plan);

  assertEquals(suites.map((suite) => suite.map((morceau) => [morceau.source, morceau.rang])), [
    [["voixDeLAppareil", 0], ["voixDeLAppareil", 1]],
    [["enregistree", 2]],
    [["voixDeLAppareil", 3]],
  ]);
});
