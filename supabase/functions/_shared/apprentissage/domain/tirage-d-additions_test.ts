import { assert, assertEquals, assertThrows } from "@std/assert";
import { type GenerateurDAdditions, LeconMalFormee } from "../../catalogue/domain/index.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { TirageHorsDuGenerateur } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { relireLesAdditions, tirerLesAdditions } from "./tirage-d-additions.ts";

function generateur(partiel: Partial<GenerateurDAdditions>): GenerateurDAdditions {
  return { nombres: 2, min: 15, max: 59, retenue: true, combien: 3, ...partiel };
}

function hasardPseudoAleatoire(graine: number): Hasard {
  let etat = graine;
  return {
    entre0et1() {
      etat = (etat * 1103515245 + 12345) % 2147483648;
      return etat / 2147483648;
    },
  };
}

function sommeDesUnites(addition: readonly number[]): number {
  return addition.reduce((somme, nombre) => somme + (nombre % 10), 0);
}

Deno.test("un générateur d'additions donne autant d'additions que demandé, de nombres compris entre min et max", () => {
  const hasard = hasardPseudoAleatoire(7);

  const additions = tirerLesAdditions(
    generateur({ nombres: 3, min: 15, max: 59, retenue: false, combien: 20 }),
    hasard,
  );

  assertEquals(additions.length, 20);
  assert(additions.every((addition) => addition.length === 3));
  assert(additions.every((addition) => addition.every((nombre) => nombre >= 15 && nombre <= 59)));
});

Deno.test("un générateur d'additions avec retenue donne toujours une retenue dans la colonne des unités", () => {
  const hasard = hasardPseudoAleatoire(42);

  const additions = tirerLesAdditions(generateur({ combien: 200 }), hasard);

  assertEquals(additions.length, 200);
  assert(additions.every((addition) => sommeDesUnites(addition) >= 10));
  assert(additions.every((addition) => addition.every((nombre) => nombre >= 15 && nombre <= 59)));
});

Deno.test("la retenue est garantie même quand le hasard donne toujours le plus petit tirage", () => {
  const additions = tirerLesAdditions(generateur({ combien: 1 }), { entre0et1: () => 0 });

  assert(sommeDesUnites(additions[0]) >= 10);
});

Deno.test("un générateur qui ne permet aucune retenue est une leçon mal formée", () => {
  const sansRetenuePossible = generateur({ min: 10, max: 10, retenue: true });

  assertThrows(() => tirerLesAdditions(sansRetenuePossible, hasardFixe(0, 0, 0, 0, 0, 0)), LeconMalFormee);
});

Deno.test("relire un tirage d'additions conforme au générateur rend les additions", () => {
  const additions = relireLesAdditions(generateur({}), ["27 + 48", "15 + 55", "36 + 39"]);

  assertEquals(additions, [[27, 48], [15, 55], [36, 39]]);
});

Deno.test("un tirage d'additions avec un nombre hors de min et max est refusé", () => {
  assertThrows(() => relireLesAdditions(generateur({}), ["27 + 48", "15 + 55", "36 + 69"]), TirageHorsDuGenerateur);
});

Deno.test("un tirage d'additions avec un autre nombre de nombres est refusé", () => {
  assertThrows(
    () => relireLesAdditions(generateur({}), ["27 + 48", "15 + 55 + 19", "36 + 39"]),
    TirageHorsDuGenerateur,
  );
});

Deno.test("un tirage avec un autre nombre d'additions que combien est refusé", () => {
  assertThrows(() => relireLesAdditions(generateur({}), ["27 + 48", "15 + 55"]), TirageHorsDuGenerateur);
});

Deno.test("une addition sans retenue est refusée quand le générateur demande une retenue", () => {
  assertThrows(() => relireLesAdditions(generateur({}), ["27 + 48", "21 + 32", "36 + 39"]), TirageHorsDuGenerateur);
});
