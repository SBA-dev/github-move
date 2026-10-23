import { assertEquals } from "@std/assert";
import { LeconsDuCatalogueJson } from "./lecons-du-catalogue-json.ts";

const programme = { section: "c2-test", citation: "Citation de test." };

const leconBrute = {
  id: "ma-cp-calcul",
  matiere: "maths",
  niveau: "CP",
  titre: "Compter",
  ordre: 1,
  programme,
  lecon: [],
  exercices: [{
    type: "bulles",
    questions: [{ question: "Combien font 3 + 4 ?", choix: ["6", "7", "8", "9"], reponse: "7" }],
  }],
};

const leconIllisible = { ...leconBrute, id: "ma-cp-cassee", matiere: "astrologie" };

Deno.test("le catalogue rend la leçon lue par le domaine Catalogue à partir du JSON de la bibliothèque", async () => {
  const catalogue = new LeconsDuCatalogueJson([leconBrute]);

  const lecon = await catalogue.parId("ma-cp-calcul");

  assertEquals(lecon?.id, "ma-cp-calcul");
  assertEquals(lecon?.titre, "Compter");
  assertEquals(lecon?.exercices.length, 1);
});

Deno.test("une leçon absente de la bibliothèque est rendue absente (null)", async () => {
  const catalogue = new LeconsDuCatalogueJson([leconBrute]);

  assertEquals(await catalogue.parId("fr-cp-inconnue"), null);
});

Deno.test("une leçon illisible est traitée comme absente, sans gêner les autres leçons", async () => {
  const catalogue = new LeconsDuCatalogueJson([leconIllisible, leconBrute]);

  assertEquals(await catalogue.parId("ma-cp-cassee"), null);
  assertEquals((await catalogue.parId("ma-cp-calcul"))?.id, "ma-cp-calcul");
});

Deno.test("un élément de la bibliothèque qui n'est pas un objet est ignoré", async () => {
  const catalogue = new LeconsDuCatalogueJson([null, "texte", 3, leconBrute]);

  assertEquals((await catalogue.parId("ma-cp-calcul"))?.id, "ma-cp-calcul");
});
