import { assertEquals } from "@std/assert";
import { accueillirEnRevision, parolesDeFinDeRevision } from "./paroles-de-revision.ts";

Deno.test("le personnage guide accueille la séance de révision en parlant des petites erreurs des jours passés", () => {
  const texte = accueillirEnRevision();

  assertEquals(
    texte,
    "On révise les petites erreurs des jours passés. Chaque fois que tu réussis, l'erreur s'efface un peu plus !",
  );
});

Deno.test("à la fin d'une révision, plusieurs questions justes sont félicitées au pluriel", () => {
  const texte = parolesDeFinDeRevision({ prenom: "Léa", questionsJustes: 3 });

  assertEquals(texte, "Bravo Léa ! 3 erreurs s'effacent un peu plus.");
});

Deno.test("à la fin d'une révision, une seule question juste est félicitée au singulier", () => {
  const texte = parolesDeFinDeRevision({ prenom: "Léa", questionsJustes: 1 });

  assertEquals(texte, "Bravo Léa ! 1 erreur s'efface un peu plus.");
});

Deno.test("à la fin d'une révision sans question juste, le personnage guide remercie et promet de recommencer demain", () => {
  const texte = parolesDeFinDeRevision({ prenom: "Léa", questionsJustes: 0 });

  assertEquals(texte, "Merci Léa ! Ces erreurs reviendront demain : on les effacera ensemble.");
});
