import { assertEquals } from "@std/assert";
import { lireLecon, matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { defisDeLaMatiere, defisDuParcours, grandDefiDeLaMatiere } from "./defis-de-la-matiere.ts";
import { parcoursDeLaMatiere } from "./parcours.ts";

function lecon(index: number): Lecon {
  return leconDe(`ma-ce1-${index}`, "maths", "CE1", index);
}

function leconDe(id: string, matiere: string, niveau: string, ordre: number): Lecon {
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

function defisPourUneClasseDe(nombreDeLecons: number) {
  const lecons = Array.from({ length: nombreDeLecons }, (_, index) => lecon(index + 1));
  const niveau = Niveau.de("CE1");
  const parcours = parcoursDeLaMatiere({ lecons, niveau, meilleuresEtoiles: new Map() }, lecons[0].matiere);
  return defisDeLaMatiere(parcours, lecons[0].matiere, niveau);
}

function numeros(nombreDeLecons: number): number[] {
  return defisPourUneClasseDe(nombreDeLecons).map(({ numero }) => numero);
}

Deno.test("une matière de 10 leçons a le Défi 1 pour les leçons 1 à 5, et pas de défi pour sa dernière partie", () => {
  const defis = defisPourUneClasseDe(10);

  assertEquals(defis.map(({ numero, lecons }) => [numero, lecons]), [
    [1, ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3", "ma-ce1-4", "ma-ce1-5"]],
  ]);
});

Deno.test("un défi porte la matière et la classe de son parcours", () => {
  const [defi] = defisPourUneClasseDe(10);

  assertEquals([defi.matiere, defi.niveau], [matiereDeCode("maths"), Niveau.de("CE1")]);
});

Deno.test("une matière de 12 leçons n'a que le Défi 1, car sa dernière partie rattache les leçons 11 et 12", () => {
  assertEquals(numeros(12), [1]);
});

Deno.test("une matière de 13 leçons a les Défis 1 et 2", () => {
  assertEquals(numeros(13), [1, 2]);
});

Deno.test("une matière d'une seule partie n'a aucun défi", () => {
  assertEquals([3, 5, 7].map(numeros), [[], [], []]);
});

Deno.test("une matière de 31 leçons a les Défis 1 à 5", () => {
  assertEquals(numeros(31), [1, 2, 3, 4, 5]);
});

Deno.test("le grand défi d'une matière de 13 leçons reprend les 13 leçons de la classe, dans l'ordre des places", () => {
  const lecons = Array.from({ length: 13 }, (_, index) => lecon(index + 1));
  const niveau = Niveau.de("CE1");
  const maths = lecons[0].matiere;
  const parcours = parcoursDeLaMatiere({ lecons: [...lecons].reverse(), niveau, meilleuresEtoiles: new Map() }, maths);

  const grandDefi = grandDefiDeLaMatiere(parcours, maths, niveau);

  assertEquals(grandDefi?.lecons, lecons.map(({ id }) => id));
});

Deno.test("le grand défi ne prend ni les leçons des classes d'avant, ni celles d'une classe au-dessus, ni les leçons personnelles", () => {
  const delaClasse = [leconDe("ma-ce1-1", "maths", "CE1", 1), leconDe("ma-ce1-2", "maths", "CE1", 2)];
  const niveau = Niveau.de("CE1");
  const maths = delaClasse[0].matiere;
  const parcours = parcoursDeLaMatiere({
    lecons: [...delaClasse, leconDe("ma-cp-1", "maths", "CP", 1), leconDe("ma-ce2-1", "maths", "CE2", 1)],
    niveau,
    meilleuresEtoiles: new Map(),
    leconsPersonnelles: [leconDe("ma-ce1-perso-doubles", "maths", "CE1", 0)],
  }, maths);

  const grandDefi = grandDefiDeLaMatiere(parcours, maths, niveau);

  assertEquals(grandDefi?.lecons, ["ma-ce1-1", "ma-ce1-2"]);
});

Deno.test("une matière d'une seule partie a un grand défi, une matière sans leçon dans la classe n'en a pas", () => {
  const lecons = [1, 2, 3].map(lecon);
  const niveau = Niveau.de("CE1");
  const maths = lecons[0].matiere;
  const entrees = { lecons, niveau, meilleuresEtoiles: new Map() };

  const avecTroisLecons = grandDefiDeLaMatiere(parcoursDeLaMatiere(entrees, maths), maths, niveau);
  const sansLecon = grandDefiDeLaMatiere(
    parcoursDeLaMatiere(entrees, matiereDeCode("sciences")),
    matiereDeCode("sciences"),
    niveau,
  );

  assertEquals([avecTroisLecons?.lecons, sansLecon], [["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"], undefined]);
});

Deno.test("le grand défi porte sa marque grandDefi, sans numéro", () => {
  const lecons = [1, 2, 3].map(lecon);
  const niveau = Niveau.de("CE1");
  const maths = lecons[0].matiere;
  const parcours = parcoursDeLaMatiere({ lecons, niveau, meilleuresEtoiles: new Map() }, maths);

  assertEquals(grandDefiDeLaMatiere(parcours, maths, niveau), {
    matiere: maths,
    niveau,
    grandDefi: true,
    lecons: ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"],
  });
});

function defisDuParcoursPour(nombreDeLecons: number, codeDeMatiere: "maths" | "sciences" = "maths") {
  const lecons = Array.from({ length: nombreDeLecons }, (_, index) => lecon(index + 1));
  const niveau = Niveau.de("CE1");
  const matiere = matiereDeCode(codeDeMatiere);
  const parcours = parcoursDeLaMatiere({ lecons, niveau, meilleuresEtoiles: new Map() }, matiere);
  return defisDuParcours(parcours, matiere, niveau);
}

Deno.test("les défis du parcours sont ceux de ses parties, puis le grand défi en dernier", () => {
  const defis = defisDuParcoursPour(13);

  assertEquals(defis.map(({ numero, grandDefi }) => [numero, grandDefi]), [[1, undefined], [2, undefined], [
    undefined,
    true,
  ]]);
});

Deno.test("une matière d'une seule partie n'a que le grand défi", () => {
  const defis = defisDuParcoursPour(3);

  assertEquals(defis.map(({ grandDefi, lecons }) => [grandDefi, lecons.length]), [[true, 3]]);
});

Deno.test("une matière sans leçon dans la classe n'a aucun défi", () => {
  assertEquals(defisDuParcoursPour(3, "sciences"), []);
});
