import { assertEquals } from "@std/assert";
import { aideApresUneErreurDeCalcul } from "./astuce-de-l-operation.ts";

Deno.test("l'aide de l'opération est dite après une erreur, quand elle existe", () => {
  assertEquals(
    aideApresUneErreurDeCalcul({ q: "9 + 6", r: 15, aide: "Fais 9 + 1, puis ajoute 5." }),
    "Fais 9 + 1, puis ajoute 5.",
  );
});

Deno.test("sans aide, une addition reçoit l'astuce de l'addition", () => {
  assertEquals(
    aideApresUneErreurDeCalcul({ q: "3 + 3", r: 6 }),
    "Pars du plus grand nombre, et avance du plus petit.",
  );
});

Deno.test("sans aide, un complément « 3 + … = 10 » reçoit l'astuce de l'addition", () => {
  assertEquals(
    aideApresUneErreurDeCalcul({ q: "3 + … = 10", r: 7 }),
    "Pars du plus grand nombre, et avance du plus petit.",
  );
});

Deno.test("sans aide, une soustraction reçoit l'astuce de la soustraction", () => {
  const astuce = "Pars du plus petit et compte jusqu'au plus grand, ou recule.";
  assertEquals(aideApresUneErreurDeCalcul({ q: "9 − 4", r: 5 }), astuce);
  assertEquals(aideApresUneErreurDeCalcul({ q: "9 - 4", r: 5 }), astuce);
});

Deno.test("sans aide, une multiplication reçoit l'astuce de la multiplication", () => {
  assertEquals(
    aideApresUneErreurDeCalcul({ q: "3 × 4", r: 12 }),
    "Pense à la table, ou ajoute le même nombre plusieurs fois.",
  );
});

Deno.test("sans aide, une division reçoit l'astuce de la division", () => {
  assertEquals(
    aideApresUneErreurDeCalcul({ q: "12 : 3", r: 4 }),
    "Cherche dans la table : combien de fois le second nombre tient-il dans le premier ?",
  );
});

Deno.test("une question sans signe et sans aide n'a aucune astuce", () => {
  assertEquals(aideApresUneErreurDeCalcul({ q: "Moitié de 10", r: 5 }), undefined);
  assertEquals(aideApresUneErreurDeCalcul({ q: "Carré de côté 5", r: 25 }), undefined);
});
