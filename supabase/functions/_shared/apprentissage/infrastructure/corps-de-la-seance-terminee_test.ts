import { assertEquals, assertThrows } from "@std/assert";
import { ChoixDeSeance } from "../domain/choix-de-seance.ts";
import { Reponse } from "../domain/reponse.ts";
import { lireLaSeanceTerminee } from "./corps-de-la-seance-terminee.ts";
import { EntreeInvalide } from "./http-apprentissage.ts";

const SEANCE = "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b";
const ENFANT = "9a1b2c3d-4e5f-4a6b-8c7d-0e1f2a3b4c5d";

function corpsValide(): Record<string, unknown> {
  return {
    seance: SEANCE,
    enfant: ENFANT,
    lecon: "ma-cp-calcul",
    choix: { genre: "complete" },
    tirages: [["6", "7", "8", "9"]],
    reponses: [[{ choix: "6" }, { jeNeSaisPas: true }, { choix: "7" }]],
    termineeLe: "2026-10-23T10:15:00.000Z",
  };
}

function sansLeChamp(cle: string): Record<string, unknown> {
  const corps = corpsValide();
  delete corps[cle];
  return corps;
}

Deno.test("un corps correct devient une séance terminée à enregistrer", () => {
  const envoi = lireLaSeanceTerminee(corpsValide());

  assertEquals(envoi, {
    seance: SEANCE,
    enfant: ENFANT,
    lecon: "ma-cp-calcul",
    choix: ChoixDeSeance.complete(),
    tirages: [["6", "7", "8", "9"]],
    reponses: [[Reponse.choix("6"), { genre: "jeNeSaisPas" }, Reponse.choix("7")]],
    termineeLe: new Date("2026-10-23T10:15:00.000Z"),
  });
});

Deno.test("le choix d'un seul exercice porte la position de l'exercice", () => {
  const envoi = lireLaSeanceTerminee({ ...corpsValide(), choix: { genre: "unExercice", position: 1 } });

  assertEquals(envoi.choix, ChoixDeSeance.unExercice(1));
});

Deno.test("un champ manquant est une entrée invalide", () => {
  for (const cle of ["seance", "enfant", "lecon", "choix", "tirages", "reponses", "termineeLe"]) {
    assertThrows(() => lireLaSeanceTerminee(sansLeChamp(cle)), EntreeInvalide, cle);
  }
});

Deno.test("l'identifiant de la séance et celui de l'enfant doivent être des UUID", () => {
  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), seance: "seance-1" }), EntreeInvalide, "seance");
  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), enfant: "1' or '1'='1" }), EntreeInvalide, "enfant");
});

Deno.test("un champ de mauvais type est une entrée invalide", () => {
  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), lecon: 12 }), EntreeInvalide, "lecon");
  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), tirages: "6,7" }), EntreeInvalide, "tirages");
  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), tirages: [["6", 7]] }), EntreeInvalide, "tirages");
  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), reponses: [["6"]] }), EntreeInvalide, "reponses");
});

Deno.test("un choix de séance inconnu ou une position qui n'est pas un entier positif est refusé", () => {
  for (const choix of [{ genre: "melange" }, { genre: "unExercice" }, { genre: "unExercice", position: -1 }]) {
    assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), choix }), EntreeInvalide, "choix");
  }
  assertThrows(
    () => lireLaSeanceTerminee({ ...corpsValide(), choix: { genre: "unExercice", position: 1.5 } }),
    EntreeInvalide,
    "choix",
  );
});

Deno.test("une réponse qui n'est ni un choix ni « Je ne sais pas » est refusée", () => {
  for (const reponse of [{}, { choix: "6", jeNeSaisPas: true }, { jeNeSaisPas: false }, { choix: 6 }, { autre: "6" }]) {
    assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), reponses: [[reponse]] }), EntreeInvalide, "reponses");
  }
});

Deno.test("une clé inconnue du corps est refusée et nommée", () => {
  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), pirate: true }), EntreeInvalide, "pirate");
});

Deno.test("les étoiles ne sont jamais acceptées dans le corps : le serveur les recalcule", () => {
  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), etoiles: 3 }), EntreeInvalide, "etoiles");
  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), erreurs: 0 }), EntreeInvalide, "erreurs");
});

Deno.test("une date de fin qui n'est pas une date ISO valide est refusée", () => {
  for (const termineeLe of ["demain", "2026-13-45T00:00:00Z", "", 1761214500000, null]) {
    assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), termineeLe }), EntreeInvalide, "termineeLe");
  }
});

Deno.test("plus de 200 questions dans une séance est refusé", () => {
  const tirages = Array.from({ length: 201 }, () => ["a", "b"]);
  const reponses = Array.from({ length: 201 }, () => [{ choix: "a" }]);

  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), tirages, reponses }), EntreeInvalide);
});

Deno.test("200 questions dans une séance sont acceptées", () => {
  const tirages = Array.from({ length: 200 }, () => ["a", "b"]);
  const reponses = Array.from({ length: 200 }, () => [{ choix: "a" }]);

  assertEquals(lireLaSeanceTerminee({ ...corpsValide(), tirages, reponses }).tirages.length, 200);
});

Deno.test("plus de 20 choix dans un tirage est refusé", () => {
  const tirage = Array.from({ length: 21 }, (_, i) => `choix ${i}`);

  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), tirages: [tirage] }), EntreeInvalide, "tirages");
});

Deno.test("plus de 50 réponses à une même question est refusé", () => {
  const reponses = [Array.from({ length: 51 }, () => ({ choix: "6" }))];

  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), reponses }), EntreeInvalide, "reponses");
});

Deno.test("un texte de plus de 200 caractères, dans un tirage ou une réponse, est refusé", () => {
  const long = "a".repeat(201);

  assertThrows(() => lireLaSeanceTerminee({ ...corpsValide(), tirages: [[long]] }), EntreeInvalide, "tirages");
  assertThrows(
    () => lireLaSeanceTerminee({ ...corpsValide(), reponses: [[{ choix: long }]] }),
    EntreeInvalide,
    "reponses",
  );
});
