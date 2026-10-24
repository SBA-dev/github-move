import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { Etoiles } from "./etoiles.ts";
import { parcoursDeLaMatiere } from "./parcours.ts";

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

const syllabes = lecon("fr-ce1-syllabes", "francais", "CE1", 20);
const sons = lecon("fr-ce1-sons", "francais", "CE1", 10);
const lettres = lecon("fr-ce1-lettres", "francais", "CE1", 10);
const francaisDuCP = lecon("fr-cp-sons", "francais", "CP", 5);
const francaisDuCE2 = lecon("fr-ce2-accords", "francais", "CE2", 5);
const mathsDuCE1 = lecon("ma-ce1-additions", "maths", "CE1", 1);

Deno.test("le parcours de français d'un enfant de CE1 ne contient que les leçons de français du CE1, dans l'ordre, chacune avec sa place", () => {
  const entrees = {
    lecons: [syllabes, mathsDuCE1, francaisDuCE2, sons, francaisDuCP, lettres],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map(),
  };

  const parcours = parcoursDeLaMatiere(entrees, syllabes.matiere);

  assertEquals(
    parcours.lecons.map(({ lecon, place }) => [lecon, place]),
    [["fr-ce1-lettres", 1], ["fr-ce1-sons", 2], ["fr-ce1-syllabes", 3]],
  );
});

const quatreLecons = ["fr-ce1-a", "fr-ce1-b", "fr-ce1-c", "fr-ce1-d"].map((id, index) =>
  lecon(id, "francais", "CE1", index + 1)
);

function etatsDuParcours(meilleuresEtoiles: Map<string, Etoiles>) {
  const parcours = parcoursDeLaMatiere(
    { lecons: quatreLecons, niveau: Niveau.de("CE1"), meilleuresEtoiles },
    quatreLecons[0].matiere,
  );
  return parcours.lecons.map(({ etat }) => etat);
}

Deno.test("dans un parcours, les leçons réussies gardent leurs étoiles, la première leçon non réussie est la prochaine et les autres sont à découvrir, sans verrou", () => {
  const etats = etatsDuParcours(new Map([["fr-ce1-a", Etoiles.de(3)], ["fr-ce1-c", Etoiles.de(1)]]));

  assertEquals(etats, [
    { genre: "reussie", etoiles: Etoiles.de(3) },
    { genre: "prochaine" },
    { genre: "reussie", etoiles: Etoiles.de(1) },
    { genre: "aDecouvrir" },
  ]);
});

Deno.test("sans progression, la première leçon du parcours est la prochaine et les autres sont à découvrir", () => {
  const etats = etatsDuParcours(new Map());

  assertEquals(etats, [{ genre: "prochaine" }, { genre: "aDecouvrir" }, { genre: "aDecouvrir" }, {
    genre: "aDecouvrir",
  }]);
});

Deno.test("quand toutes les leçons du parcours sont réussies, aucune n'est la prochaine leçon", () => {
  const meilleuresEtoiles = new Map(quatreLecons.map((l) => [l.id, Etoiles.de(2)] as [string, Etoiles]));
  const parcours = parcoursDeLaMatiere(
    { lecons: quatreLecons, niveau: Niveau.de("CE1"), meilleuresEtoiles },
    quatreLecons[0].matiere,
  );

  assertEquals(parcours.prochaineLecon, undefined);
  assertEquals(parcours.lecons.some(({ etat }) => etat.genre === "prochaine"), false);
});

Deno.test("le parcours compte les leçons réussies sur les seules leçons du niveau de l'enfant, pas celles d'un autre niveau de la même matière", () => {
  const meilleuresEtoiles = new Map([
    ["fr-ce1-b", Etoiles.de(1)],
    [francaisDuCP.id, Etoiles.de(3)],
    [francaisDuCE2.id, Etoiles.de(2)],
  ]);

  const parcours = parcoursDeLaMatiere(
    { lecons: [...quatreLecons, francaisDuCP, francaisDuCE2], niveau: Niveau.de("CE1"), meilleuresEtoiles },
    quatreLecons[0].matiere,
  );

  assertEquals(
    [parcours.nombreDeLeconsReussies, parcours.nombreDeLecons],
    [1, 4],
  );
});

Deno.test("chaque leçon du parcours porte son titre", () => {
  const parcours = parcoursDeLaMatiere(
    { lecons: [sons], niveau: Niveau.de("CE1"), meilleuresEtoiles: new Map() },
    sons.matiere,
  );

  assertEquals(parcours.lecons.map(({ titre }) => titre), ["Titre de fr-ce1-sons"]);
});
