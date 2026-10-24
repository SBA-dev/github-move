import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { leconsReussiesAuTestDeDepart } from "./lecons-reussies-au-test-de-depart.ts";

const programme = { section: "section", citation: "citation" };

function lecon(id: string, matiere: string, niveau: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere,
    niveau,
    titre: `Titre de ${id}`,
    ordre,
    programme,
    exercices: [{
      type: "bulles",
      questions: [{ question: "Quel son ?", choix: ["ou", "on"], reponse: "ou" }],
    }],
  });
}

function leconDeDicteeSeule(id: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere: "francais",
    niveau: "CE1",
    titre: `Titre de ${id}`,
    ordre,
    programme,
    exercices: [{ type: "dictee", mots: [{ mot: "chat" }] }],
  });
}

const juste = (lecon: string) => ({ lecon, juste: true });
const fausse = (lecon: string) => ({ lecon, juste: false });
const reussies = (ensemble: ReadonlySet<string>) => [...ensemble].sort();

Deno.test("les leçons placées avant une question juste sont réussies au test de départ, même si elles n'ont pas été posées", () => {
  const lecons = [
    lecon("fr-ce1-a", "francais", "CE1", 10),
    lecon("fr-ce1-b", "francais", "CE1", 20),
    lecon("fr-ce1-c", "francais", "CE1", 30),
  ];

  const resultat = leconsReussiesAuTestDeDepart(lecons, Niveau.de("CE1"), [juste("fr-ce1-c")]);

  assertEquals(reussies(resultat), ["fr-ce1-a", "fr-ce1-b", "fr-ce1-c"]);
});

Deno.test("une leçon dont la question était fausse n'est pas réussie, même placée avant une question juste", () => {
  const lecons = [
    lecon("fr-ce1-a", "francais", "CE1", 10),
    lecon("fr-ce1-b", "francais", "CE1", 20),
    lecon("fr-ce1-c", "francais", "CE1", 30),
  ];

  const resultat = leconsReussiesAuTestDeDepart(lecons, Niveau.de("CE1"), [
    fausse("fr-ce1-b"),
    juste("fr-ce1-c"),
  ]);

  assertEquals(reussies(resultat), ["fr-ce1-a", "fr-ce1-c"]);
});

Deno.test("les leçons placées après la dernière question juste ne sont pas réussies", () => {
  const lecons = [
    lecon("fr-ce1-a", "francais", "CE1", 10),
    lecon("fr-ce1-b", "francais", "CE1", 20),
    lecon("fr-ce1-c", "francais", "CE1", 30),
  ];

  const resultat = leconsReussiesAuTestDeDepart(lecons, Niveau.de("CE1"), [juste("fr-ce1-a")]);

  assertEquals(reussies(resultat), ["fr-ce1-a"]);
});

Deno.test("les leçons des classes d'avant sont réussies quand une question juste vient après elles", () => {
  const lecons = [
    lecon("fr-cp-a", "francais", "CP", 10),
    lecon("fr-cp-b", "francais", "CP", 20),
    lecon("fr-ce1-a", "francais", "CE1", 10),
  ];

  const resultat = leconsReussiesAuTestDeDepart(lecons, Niveau.de("CE1"), [juste("fr-ce1-a")]);

  assertEquals(reussies(resultat), ["fr-cp-a", "fr-cp-b", "fr-ce1-a"]);
});

Deno.test("une question juste en maths ne rend aucune leçon de français réussie", () => {
  const lecons = [
    lecon("fr-ce1-a", "francais", "CE1", 10),
    lecon("ma-ce1-a", "maths", "CE1", 10),
    lecon("ma-ce1-b", "maths", "CE1", 20),
  ];

  const resultat = leconsReussiesAuTestDeDepart(lecons, Niveau.de("CE1"), [juste("ma-ce1-b")]);

  assertEquals(reussies(resultat), ["ma-ce1-a", "ma-ce1-b"]);
});

Deno.test("sans aucune question juste, aucune leçon n'est réussie au test de départ", () => {
  const lecons = [
    lecon("fr-ce1-a", "francais", "CE1", 10),
    lecon("fr-ce1-b", "francais", "CE1", 20),
  ];

  const resultat = leconsReussiesAuTestDeDepart(lecons, Niveau.de("CE1"), [fausse("fr-ce1-b")]);

  assertEquals(reussies(resultat), []);
});

Deno.test("une leçon sans question admissible placée avant une question juste est réussie", () => {
  const lecons = [
    leconDeDicteeSeule("fr-ce1-dictee-des-sons", 10),
    lecon("fr-ce1-b", "francais", "CE1", 20),
  ];

  const resultat = leconsReussiesAuTestDeDepart(lecons, Niveau.de("CE1"), [juste("fr-ce1-b")]);

  assertEquals(reussies(resultat), ["fr-ce1-b", "fr-ce1-dictee-des-sons"]);
});
