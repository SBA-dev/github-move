import { assertEquals } from "@std/assert";
import { HasardFixe } from "../test_utils/hasard-fixe.ts";
import { AccesALEspaceParent } from "./acces-a-l-espace-parent.ts";

function accesAvecTirages(...facteurs: number[]): AccesALEspaceParent {
  return new AccesALEspaceParent(new HasardFixe(facteurs));
}

Deno.test("au départ, l'espace parent est fermé", () => {
  const acces = accesAvecTirages();

  assertEquals(acces.etat(), { type: "ferme" });
});

Deno.test("demander l'entrée pose une question tirée par le hasard", () => {
  const acces = accesAvecTirages(6, 7);

  acces.demanderLEntree();

  assertEquals(acces.etat(), { type: "questionPosee", enonce: "combien font 6 × 7 ?" });
});

Deno.test("une bonne réponse ouvre l'espace parent", () => {
  const acces = accesAvecTirages(6, 7);
  acces.demanderLEntree();

  const resultat = acces.repondre("42");

  assertEquals(resultat, "ouvert");
  assertEquals(acces.etat(), { type: "ouvert" });
});

Deno.test("une mauvaise réponse est refusée, l'espace reste fermé et la même question reste posée", () => {
  const hasard = new HasardFixe([6, 7]);
  const acces = new AccesALEspaceParent(hasard);
  acces.demanderLEntree();

  const resultat = acces.repondre("41");

  assertEquals(resultat, "refuse");
  assertEquals(acces.etat(), { type: "questionPosee", enonce: "combien font 6 × 7 ?" });
  assertEquals(hasard.tirages.length, 2);
});

Deno.test("le nombre d'essais est illimité : après 5 mauvaises réponses, la bonne ouvre l'espace parent", () => {
  const acces = accesAvecTirages(6, 7);
  acces.demanderLEntree();

  for (let essai = 0; essai < 5; essai++) acces.repondre("0");
  acces.repondre("42");

  assertEquals(acces.etat(), { type: "ouvert" });
});

Deno.test("après avoir quitté, l'espace parent est fermé et une nouvelle demande pose une nouvelle question", () => {
  const acces = accesAvecTirages(6, 7, 8, 9);
  acces.demanderLEntree();
  acces.repondre("42");

  acces.quitter();
  assertEquals(acces.etat(), { type: "ferme" });
  acces.demanderLEntree();

  assertEquals(acces.etat(), { type: "questionPosee", enonce: "combien font 8 × 9 ?" });
});

Deno.test("juste après la connexion du parent, l'espace parent est ouvert sans question", () => {
  const hasard = new HasardFixe([]);
  const acces = new AccesALEspaceParent(hasard);

  acces.ouvrirApresLaConnexion();

  assertEquals(acces.etat(), { type: "ouvert" });
  assertEquals(hasard.tirages.length, 0);
});

Deno.test("répondre sans question posée ne fait rien : l'espace parent reste fermé", () => {
  const acces = accesAvecTirages();

  const resultat = acces.repondre("42");

  assertEquals(resultat, "refuse");
  assertEquals(acces.etat(), { type: "ferme" });
});
