import { assertEquals } from "@std/assert";
import type { ExerciceMemoriser } from "../../catalogue/domain/exercices/memoriser.ts";
import { PlanDeMemorisation } from "./plan-de-memorisation.ts";

function poesie(titre: string, vers: readonly string[]): ExerciceMemoriser {
  return { type: "memoriser", titre, vers };
}

const auClairDeLaLune = poesie("Au clair de la lune", [
  "Au clair de la lune,",
  "Mon ami Pierrot,",
  "Ma chandelle est morte,",
]);

Deno.test("le premier entraînement remet les vers dans l'ordre", () => {
  const plan = PlanDeMemorisation.de(auClairDeLaLune);

  assertEquals(plan.ordreDesVers, {
    type: "ordre",
    titre: "Au clair de la lune",
    consigne: "Remets les vers dans l'ordre.",
    elements: ["Au clair de la lune,", "Mon ami Pierrot,", "Ma chandelle est morte,"],
  });
});

Deno.test("le second entraînement cache un mot par vers et joint les vers par « / »", () => {
  const plan = PlanDeMemorisation.de(poesie("Au clair de la lune", ["Au clair de la lune,", "Mon ami Pierrot,"]));

  assertEquals(plan.motsCaches.type, "trous");
  assertEquals(plan.motsCaches.consigne, "Des mots se sont envolés ! Retrouve-les.");
  assertEquals(plan.motsCaches.segments, [
    { type: "texte", texte: "Au " },
    { type: "trou", motAttendu: "clair" },
    { type: "texte", texte: " de la lune, / Mon ami " },
    { type: "trou", motAttendu: "Pierrot" },
    { type: "texte", texte: "," },
  ]);
});

Deno.test("les mots attendus sont les mots cachés dans l'ordre des vers", () => {
  const plan = PlanDeMemorisation.de(auClairDeLaLune);

  assertEquals(plan.motsCaches.motsAttendus, ["clair", "Pierrot", "chandelle"]);
});

Deno.test("le mot caché ne comprend pas l'article élidé", () => {
  const plan = PlanDeMemorisation.de(poesie("Sans titre", ["Pour l'amour de Dieu.", "Mon ami Pierrot,"]));

  assertEquals(plan.motsCaches.segments.slice(0, 3), [
    { type: "texte", texte: "Pour l'" },
    { type: "trou", motAttendu: "amour" },
    { type: "texte", texte: " de Dieu. / Mon ami " },
  ]);
});

Deno.test("un vers sans mot caché reste du texte, sans trou", () => {
  const plan = PlanDeMemorisation.de(poesie("Sans titre", ["Le chat dort.", "Il a vu.", "La souris file."]));

  assertEquals(plan.motsCaches.segments, [
    { type: "texte", texte: "Le " },
    { type: "trou", motAttendu: "chat" },
    { type: "texte", texte: " dort. / Il a vu. / La " },
    { type: "trou", motAttendu: "souris" },
    { type: "texte", texte: " file." },
  ]);
  assertEquals(plan.motsCaches.motsAttendus, ["chat", "souris"]);
});

Deno.test("trois mots cachés se suffisent : aucun distracteur n'est ajouté", () => {
  const plan = PlanDeMemorisation.de(auClairDeLaLune);

  assertEquals(plan.motsCaches.distracteurs, []);
});

Deno.test("une poésie courte est complétée par le plus long mot non caché pour offrir trois choix", () => {
  const plan = PlanDeMemorisation.de(poesie("Sans titre", ["Le soleil brille", "Les oiseaux chantent"]));

  assertEquals(plan.motsCaches.motsAttendus, ["soleil", "chantent"]);
  assertEquals(plan.motsCaches.distracteurs, ["oiseaux"]);
});

Deno.test("un refrain ne compte qu'une fois : les mots cachés distincts sont complétés pour offrir trois choix", () => {
  const plan = PlanDeMemorisation.de(poesie("Sans titre", ["Picoti, picota", "Picoti, picota", "Le chat dort."]));

  assertEquals(plan.motsCaches.motsAttendus, ["Picoti", "Picoti", "chat"]);
  assertEquals(plan.motsCaches.distracteurs, ["picota"]);
});
