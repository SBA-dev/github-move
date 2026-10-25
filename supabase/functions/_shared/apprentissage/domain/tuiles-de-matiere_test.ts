import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { Etoiles } from "./etoiles.ts";
import { matieresDuParcours } from "./parcours.ts";
import { tuilesDeMatiere } from "./tuiles-de-matiere.ts";

function lecon(id: string, matiere: string, niveau: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere,
    niveau,
    titre: `Titre de ${id}`,
    ordre,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

const francaisA = lecon("fr-ce1-a", "francais", "CE1", 1);
const francaisB = lecon("fr-ce1-b", "francais", "CE1", 2);
const francaisC = lecon("fr-ce1-c", "francais", "CE1", 3);
const mathsDuCE1 = lecon("ma-ce1-additions", "maths", "CE1", 1);
const anglaisDuCE1 = lecon("an-ce1-couleurs", "anglais", "CE1", 1);
const emcDuCE1 = lecon("emc-ce1-regles", "emc", "CE1", 1);
const sciencesDuCE1 = lecon("sc-ce1-vivant", "sciences", "CE1", 1);
const histoireDuCE1 = lecon("hi-ce1-temps", "histoire", "CE1", 1);
const francaisDuCP = lecon("fr-cp-sons", "francais", "CP", 5);
const francaisDuCE2 = lecon("fr-ce2-accords", "francais", "CE2", 5);
const histoireDuCP = lecon("hi-cp-temps", "histoire", "CP", 1);
const sciencesDuCE2 = lecon("sc-ce2-matiere", "sciences", "CE2", 1);

Deno.test("l'accueil propose une tuile par matière du parcours, dans l'ordre du Catalogue", () => {
  const entrees = {
    lecons: [emcDuCE1, anglaisDuCE1, histoireDuCE1, mathsDuCE1, sciencesDuCE1, francaisA],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map(),
  };

  const tuiles = tuilesDeMatiere(entrees);

  assertEquals(
    tuiles.map(({ matiere }) => matiere.code),
    matieresDuParcours(entrees).map(({ code }) => code),
  );
  assertEquals(
    tuiles.map(({ matiere }) => matiere.code),
    ["francais", "maths", "sciences", "histoire", "anglais", "emc"],
  );
});

Deno.test("une matière qui n'a que des leçons des classes d'avant ou d'une classe au-dessus n'a pas de tuile", () => {
  const tuiles = tuilesDeMatiere({
    lecons: [francaisA, histoireDuCP, sciencesDuCE2],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map(),
  });

  assertEquals(tuiles.map(({ matiere }) => matiere.code), ["francais"]);
});

Deno.test("sans aucune leçon dans la classe de l'enfant, l'accueil n'a aucune tuile de matière", () => {
  const tuiles = tuilesDeMatiere({
    lecons: [francaisDuCP, francaisDuCE2],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map(),
  });

  assertEquals(tuiles, []);
});

Deno.test("le compteur d'une tuile compte les leçons réussies de la classe, par étoiles ou au test de départ, sur les leçons de la classe, sans les classes d'avant ni d'au-dessus", () => {
  const tuiles = tuilesDeMatiere({
    lecons: [francaisA, francaisB, francaisC, francaisDuCP, francaisDuCE2, mathsDuCE1],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map([
      [francaisA.id, Etoiles.de(2)],
      [francaisDuCP.id, Etoiles.de(3)],
      [francaisDuCE2.id, Etoiles.de(1)],
    ]),
    leconsReussiesAuTestDeDepart: new Set([francaisB.id]),
  });

  assertEquals(
    tuiles.map(({ matiere, nombreDeLeconsReussies, nombreDeLecons }) => [
      matiere.code,
      nombreDeLeconsReussies,
      nombreDeLecons,
    ]),
    [["francais", 2, 3], ["maths", 0, 1]],
  );
});
