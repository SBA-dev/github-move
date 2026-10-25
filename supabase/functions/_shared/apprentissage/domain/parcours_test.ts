import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { Etoiles } from "./etoiles.ts";
import { matieresDuParcours, parcoursDeLaMatiere } from "./parcours.ts";

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

Deno.test("dans un parcours, les leçons réussies gardent leurs étoiles, la première leçon non réussie est la prochaine et les autres sont à découvrir", () => {
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

Deno.test("les matières du parcours sont celles qui ont une leçon du niveau de l'enfant, dans l'ordre du Catalogue et sans doublon", () => {
  const anglaisDuCE1 = lecon("an-ce1-couleurs", "anglais", "CE1", 1);
  const sciencesDuCP = lecon("sc-cp-vivant", "sciences", "CP", 1);
  const histoireDuCE2 = lecon("hi-ce2-temps", "histoire", "CE2", 1);

  const matieres = matieresDuParcours({
    lecons: [anglaisDuCE1, sciencesDuCP, mathsDuCE1, histoireDuCE2, syllabes, sons],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map(),
  });

  assertEquals(matieres.map(({ code }) => code), ["francais", "maths", "anglais"]);
});

Deno.test("sans aucune leçon du niveau de l'enfant, le parcours n'a aucune matière", () => {
  const matieres = matieresDuParcours({
    lecons: [francaisDuCP, francaisDuCE2],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map(),
  });

  assertEquals(matieres, []);
});

const futurDuCE2 = lecon("fr-ce2-futur", "francais", "CE2", 3);
const imparfaitDuCE2 = lecon("fr-ce2-imparfait", "francais", "CE2", 4);
const mathsDuCE2 = lecon("ma-ce2-tables", "maths", "CE2", 1);
const francaisDuCM1 = lecon("fr-cm1-passe", "francais", "CM1", 1);

Deno.test("un enfant redescendu en CE1 retrouve, à part, ses seules leçons réussies de la matière dans les classes au-dessus, avec niveau, titre et meilleures étoiles", () => {
  const entrees = {
    lecons: [imparfaitDuCE2, francaisDuCM1, futurDuCE2, francaisDuCP, mathsDuCE2, ...quatreLecons],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map([
      [futurDuCE2.id, Etoiles.de(2)],
      [francaisDuCM1.id, Etoiles.de(1)],
      [francaisDuCP.id, Etoiles.de(3)],
      [mathsDuCE2.id, Etoiles.de(3)],
    ]),
  };

  const parcours = parcoursDeLaMatiere(entrees, futurDuCE2.matiere);

  assertEquals(
    parcours.leconsReussiesDesClassesAuDessus.map(({ lecon, niveau, titre, etoiles }) => ({
      lecon,
      niveau: niveau.valeur,
      titre,
      etoiles,
    })),
    [
      { lecon: "fr-ce2-futur", niveau: "CE2", titre: "Titre de fr-ce2-futur", etoiles: Etoiles.de(2) },
      { lecon: "fr-cm1-passe", niveau: "CM1", titre: "Titre de fr-cm1-passe", etoiles: Etoiles.de(1) },
    ],
  );
});

Deno.test("les leçons réussies des classes au-dessus ne comptent pas dans le parcours et ne sont jamais la prochaine leçon", () => {
  const entrees = {
    lecons: [...quatreLecons, futurDuCE2],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map([["fr-ce1-a", Etoiles.de(1)], [futurDuCE2.id, Etoiles.de(2)]]),
  };

  const parcours = parcoursDeLaMatiere(entrees, futurDuCE2.matiere);

  assertEquals(
    [parcours.nombreDeLeconsReussies, parcours.nombreDeLecons, parcours.prochaineLecon],
    [1, 4, "fr-ce1-b"],
  );
});

function parcoursAvecTestDeDepart(
  meilleuresEtoiles: Map<string, Etoiles>,
  leconsReussiesAuTestDeDepart: string[],
) {
  return parcoursDeLaMatiere(
    {
      lecons: quatreLecons,
      niveau: Niveau.de("CE1"),
      meilleuresEtoiles,
      leconsReussiesAuTestDeDepart: new Set(leconsReussiesAuTestDeDepart),
    },
    quatreLecons[0].matiere,
  );
}

Deno.test("une leçon réussie au test de départ a l'état réussie au test de départ, sans étoiles, et la prochaine leçon est la première leçon ni réussie ni réussie au test de départ", () => {
  const parcours = parcoursAvecTestDeDepart(new Map(), ["fr-ce1-a", "fr-ce1-b"]);

  assertEquals(parcours.lecons.map(({ etat }) => etat), [
    { genre: "reussieAuTestDeDepart" },
    { genre: "reussieAuTestDeDepart" },
    { genre: "prochaine" },
    { genre: "aDecouvrir" },
  ]);
  assertEquals(parcours.prochaineLecon, "fr-ce1-c");
});

Deno.test("une leçon réussie au test de départ qui a aussi des meilleures étoiles garde l'état réussie avec ses étoiles", () => {
  const parcours = parcoursAvecTestDeDepart(new Map([["fr-ce1-a", Etoiles.de(2)]]), ["fr-ce1-a"]);

  assertEquals(parcours.lecons[0].etat, { genre: "reussie", etoiles: Etoiles.de(2) });
});

Deno.test("les leçons réussies au test de départ comptent dans le nombre de leçons réussies du parcours", () => {
  const parcours = parcoursAvecTestDeDepart(new Map([["fr-ce1-a", Etoiles.de(1)]]), ["fr-ce1-a", "fr-ce1-c"]);

  assertEquals([parcours.nombreDeLeconsReussies, parcours.nombreDeLecons], [2, 4]);
});

Deno.test("quand toutes les leçons d'une matière sont réussies au test de départ, elle n'a plus de prochaine leçon", () => {
  const parcours = parcoursAvecTestDeDepart(new Map(), quatreLecons.map((l) => l.id));

  assertEquals(parcours.prochaineLecon, undefined);
  assertEquals(parcours.lecons.some(({ etat }) => etat.genre === "prochaine"), false);
});

Deno.test("un enfant redescendu en CE1 retrouve, sans étoiles, une leçon de la classe au-dessus réussie au test de départ", () => {
  const entrees = {
    lecons: [...quatreLecons, futurDuCE2],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map(),
    leconsReussiesAuTestDeDepart: new Set([futurDuCE2.id]),
  };

  const parcours = parcoursDeLaMatiere(entrees, futurDuCE2.matiere);

  assertEquals(
    parcours.leconsReussiesDesClassesAuDessus.map(({ lecon, niveau, titre, etoiles }) => ({
      lecon,
      niveau: niveau.valeur,
      titre,
      etoiles,
    })),
    [{ lecon: "fr-ce2-futur", niveau: "CE2", titre: "Titre de fr-ce2-futur", etoiles: undefined }],
  );
});

Deno.test("sans aucune réussite, un enfant de CE2 retrouve les leçons de la matière des classes d'avant, à découvrir, par niveau croissant puis ordre", () => {
  const voyelles = lecon("fr-cp-voyelles", "francais", "CP", 10);
  const consonnes = lecon("fr-cp-consonnes", "francais", "CP", 20);
  const lecturesDuCE1 = lecon("fr-ce1-lectures", "francais", "CE1", 10);
  const mathsDuCP = lecon("ma-cp-nombres", "maths", "CP", 10);
  const entrees = {
    lecons: [lecturesDuCE1, consonnes, mathsDuCP, futurDuCE2, voyelles],
    niveau: Niveau.de("CE2"),
    meilleuresEtoiles: new Map(),
  };

  const parcours = parcoursDeLaMatiere(entrees, futurDuCE2.matiere);

  assertEquals(
    parcours.leconsDesClassesDAvant.map(({ lecon, niveau, titre, etat }) => ({
      lecon,
      niveau: niveau.valeur,
      titre,
      etat,
    })),
    [
      { lecon: "fr-cp-voyelles", niveau: "CP", titre: "Titre de fr-cp-voyelles", etat: { genre: "aDecouvrir" } },
      { lecon: "fr-cp-consonnes", niveau: "CP", titre: "Titre de fr-cp-consonnes", etat: { genre: "aDecouvrir" } },
      { lecon: "fr-ce1-lectures", niveau: "CE1", titre: "Titre de fr-ce1-lectures", etat: { genre: "aDecouvrir" } },
    ],
  );
});

const voyellesDuCP = lecon("fr-cp-voyelles", "francais", "CP", 10);
const lecturesDuCE1 = lecon("fr-ce1-lectures", "francais", "CE1", 10);

function etatsDesClassesDAvant(
  meilleuresEtoiles: Map<string, Etoiles>,
  leconsReussiesAuTestDeDepart: string[] = [],
) {
  const parcours = parcoursDeLaMatiere(
    {
      lecons: [voyellesDuCP, lecturesDuCE1, futurDuCE2],
      niveau: Niveau.de("CE2"),
      meilleuresEtoiles,
      leconsReussiesAuTestDeDepart: new Set(leconsReussiesAuTestDeDepart),
    },
    futurDuCE2.matiere,
  );
  return parcours.leconsDesClassesDAvant.map(({ etat }) => etat);
}

Deno.test("une leçon des classes d'avant réussie garde ses meilleures étoiles dans son état", () => {
  const etats = etatsDesClassesDAvant(new Map([[voyellesDuCP.id, Etoiles.de(3)]]));

  assertEquals(etats, [{ genre: "reussie", etoiles: Etoiles.de(3) }, { genre: "aDecouvrir" }]);
});

Deno.test("une leçon des classes d'avant réussie au test de départ seulement a l'état réussie au test de départ, sans étoiles", () => {
  const etats = etatsDesClassesDAvant(new Map(), [lecturesDuCE1.id]);

  assertEquals(etats, [{ genre: "aDecouvrir" }, { genre: "reussieAuTestDeDepart" }]);
});

Deno.test("une leçon des classes d'avant réussie au test de départ qui a aussi des étoiles garde l'état réussie avec ses étoiles", () => {
  const etats = etatsDesClassesDAvant(new Map([[voyellesDuCP.id, Etoiles.de(2)]]), [voyellesDuCP.id]);

  assertEquals(etats[0], { genre: "reussie", etoiles: Etoiles.de(2) });
});

Deno.test("quand toutes les leçons du niveau de l'enfant sont réussies, il n'y a pas de prochaine leçon, même s'il reste des leçons des classes d'avant à découvrir", () => {
  const parcours = parcoursDeLaMatiere(
    {
      lecons: [voyellesDuCP, futurDuCE2, imparfaitDuCE2],
      niveau: Niveau.de("CE2"),
      meilleuresEtoiles: new Map([[futurDuCE2.id, Etoiles.de(2)], [imparfaitDuCE2.id, Etoiles.de(1)]]),
    },
    futurDuCE2.matiere,
  );

  assertEquals(parcours.prochaineLecon, undefined);
  assertEquals(parcours.leconsDesClassesDAvant.map(({ etat }) => etat), [{ genre: "aDecouvrir" }]);
});

Deno.test("les leçons des classes d'avant réussies ne comptent ni dans le nombre de leçons réussies ni dans le nombre de leçons du parcours", () => {
  const parcours = parcoursDeLaMatiere(
    {
      lecons: [voyellesDuCP, lecturesDuCE1, futurDuCE2, imparfaitDuCE2],
      niveau: Niveau.de("CE2"),
      meilleuresEtoiles: new Map([[voyellesDuCP.id, Etoiles.de(3)], [futurDuCE2.id, Etoiles.de(1)]]),
      leconsReussiesAuTestDeDepart: new Set([lecturesDuCE1.id]),
    },
    futurDuCE2.matiere,
  );

  assertEquals([parcours.nombreDeLeconsReussies, parcours.nombreDeLecons], [1, 2]);
});

Deno.test("au CP, il n'y a aucune leçon des classes d'avant", () => {
  const parcours = parcoursDeLaMatiere(
    { lecons: [voyellesDuCP, lecturesDuCE1, futurDuCE2], niveau: Niveau.de("CP"), meilleuresEtoiles: new Map() },
    voyellesDuCP.matiere,
  );

  assertEquals(parcours.leconsDesClassesDAvant, []);
});
