import { assertEquals, assertThrows } from "@std/assert";
import type { ExerciceFluence } from "../../catalogue/domain/index.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { ExerciceChronometre } from "./exercice-chronometre.ts";
import { FluenceFinie, FluenceNonCommencee } from "./erreurs.ts";
import { tireurAuHasard } from "./tireur.ts";

const top = new Date("2026-10-24T10:00:00Z");

function apres(secondes: number): Date {
  return new Date(top.getTime() + secondes * 1000);
}

function calculRapideLesDoubles(): ExerciceFluence {
  return {
    type: "fluence",
    titre: "Calcul rapide : les doubles",
    duree: 45,
    generateur: { op: "+", a: [1, 10], b: [1, 10], cible: 10, combien: 5 },
  };
}

// Opérations tirées dans l'ordre : 1 + 1, 10 + 10, 1 + 1
function exerciceChronometre(): ExerciceChronometre {
  const hasard = hasardFixe(0, 0, 0.999, 0.999, 0, 0);
  return ExerciceChronometre.pour(calculRapideLesDoubles(), tireurAuHasard(hasard));
}

Deno.test("avant le signal « C'est parti ! », aucune réponse n'est prise", () => {
  const exercice = exerciceChronometre();

  assertThrows(() => exercice.repondre(2, top), FluenceNonCommencee);
});

Deno.test("au signal « C'est parti ! », il reste toute la durée de l'exercice", () => {
  const exercice = exerciceChronometre();

  exercice.demarrer(top);

  assertEquals(exercice.tempsRestant(top), 45);
  assertEquals(exercice.tempsRestant(apres(10)), 35);
});

Deno.test("l'exercice est fini quand la durée est écoulée", () => {
  const exercice = exerciceChronometre();
  exercice.demarrer(top);

  assertEquals(exercice.estFinie(apres(44)), false);
  assertEquals(exercice.estFinie(apres(45)), true);
});

Deno.test("une bonne réponse ajoute un calcul réussi et passe à une nouvelle opération", () => {
  const exercice = exerciceChronometre();
  exercice.demarrer(top);

  const resultat = exercice.repondre(2, apres(3));

  assertEquals(resultat, "juste");
  assertEquals(exercice.score, 1);
  assertEquals(exercice.enonce, "10 + 10");
});

Deno.test("une réponse fausse ne rapporte rien et laisse l'opération posée", () => {
  const exercice = exerciceChronometre();
  exercice.demarrer(top);

  const resultat = exercice.repondre(3, apres(3));

  assertEquals(resultat, "fausse");
  assertEquals(exercice.score, 0);
  assertEquals(exercice.enonce, "1 + 1");
});

Deno.test("les réponses fausses sont comptées à part du score", () => {
  const exercice = exerciceChronometre();
  exercice.demarrer(top);

  exercice.repondre(3, apres(3));
  exercice.repondre(2, apres(5));

  assertEquals(exercice.score, 1);
  assertEquals(exercice.reponsesFausses, 1);
});

Deno.test("après la fin, plus aucune réponse n'est prise et le score ne bouge plus", () => {
  const exercice = exerciceChronometre();
  exercice.demarrer(top);
  exercice.repondre(2, apres(3));

  assertThrows(() => exercice.repondre(20, apres(45)), FluenceFinie);
  assertEquals(exercice.score, 1);
});
