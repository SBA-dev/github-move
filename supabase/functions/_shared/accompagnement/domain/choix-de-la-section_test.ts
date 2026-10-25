import { assertEquals, assertThrows } from "@std/assert";
import { Niveau, toutesLesMatieres } from "../../catalogue/domain/index.ts";
import { sectionDeTest } from "../test_utils/sections-de-test.ts";
import { sectionRetenue } from "./choix-de-la-section.ts";
import { AucuneSectionDuProgramme } from "./erreurs.ts";
import { TexteDuParent } from "./texte-du-parent.ts";

const ce1 = Niveau.de("CE1");
const francais = toutesLesMatieres().find((m) => m.code === "francais")!;

Deno.test("une liste de mots préfère la section « dictée » à une autre section", () => {
  const autre = sectionDeTest({ id: "autre", section: "Lire des textes" });
  const dictee = sectionDeTest({ id: "dictee", section: "Écrire sous la dictée" });

  const retenue = sectionRetenue(
    TexteDuParent.de("chaton, maison, poisson"),
    "listeDeMots",
    ce1,
    francais,
    [autre, dictee],
  );

  assertEquals(retenue.id, "dictee");
});

Deno.test("le texte du parent choisit la section dont l'extrait contient ses mots", () => {
  const generale = sectionDeTest({ id: "generale", extrait: "Rien à voir." });
  const volcans = sectionDeTest({ id: "volcans", extrait: "Les volcans crachent de la lave brûlante." });

  const retenue = sectionRetenue(
    TexteDuParent.de("Un volcan crache de la lave brûlante pendant une éruption."),
    "texteDocumentaire",
    ce1,
    francais,
    [generale, volcans],
  );

  assertEquals(retenue.id, "volcans");
});

Deno.test("à égalité de score, la première section reçue est retenue", () => {
  const premiere = sectionDeTest({ id: "premiere" });
  const seconde = sectionDeTest({ id: "seconde" });

  const retenue = sectionRetenue(
    TexteDuParent.de("zzzzz, yyyyy, xxxxx"),
    "listeDeMots",
    ce1,
    francais,
    [premiere, seconde],
  );

  assertEquals(retenue.id, "premiere");
});

Deno.test("une section d'un autre niveau ou d'une autre matière n'est jamais retenue", () => {
  const autreNiveau = sectionDeTest({ id: "cm2", niveaux: ["CM2"], section: "Écrire sous la dictée" });
  const autreMatiere = sectionDeTest({ id: "maths", matiere: "maths", section: "Écrire sous la dictée" });
  const candidate = sectionDeTest({ id: "candidate" });

  const retenue = sectionRetenue(
    TexteDuParent.de("chaton, maison, poisson"),
    "listeDeMots",
    ce1,
    francais,
    [autreNiveau, autreMatiere, candidate],
  );

  assertEquals(retenue.id, "candidate");
});

Deno.test("seules les sections de la matière demandée sont retenues, ici celles d'EMC pour un texte sur un métier", () => {
  const francaise = sectionDeTest({ id: "francais" });
  const emc = sectionDeTest({ id: "emc", matiere: "emc" });
  const emcMatiere = toutesLesMatieres().find((m) => m.code === "emc")!;

  const retenue = sectionRetenue(
    TexteDuParent.de("zzzzz"),
    "texteSurUnMetier",
    ce1,
    emcMatiere,
    [francaise, emc],
  );

  assertEquals(retenue.id, "emc");
});

Deno.test("sans section pour cette classe et cette matière, aucune section du programme n'est disponible", () => {
  const dUneAutreClasse = sectionDeTest({ niveaux: ["CM2"] });

  assertThrows(
    () => sectionRetenue(TexteDuParent.de("chaton, maison, poisson"), "listeDeMots", ce1, francais, [dUneAutreClasse]),
    AucuneSectionDuProgramme,
    "Aucune section du programme pour cette classe et cette matière.",
  );
});
