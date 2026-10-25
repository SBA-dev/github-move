import { assertEquals, assertThrows } from "@std/assert";
import { SectionDuProgrammeMalFormee } from "./erreurs.ts";
import { lireSectionDuProgramme } from "./lire-section-du-programme.ts";

function sectionFrancais(): Record<string, unknown> {
  return {
    id: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
    matiere: "francais",
    niveaux: ["CP"],
    domaine: "Lecture",
    section: "Identifier les mots de manière de plus en plus aisée",
    ordre: 0,
    source: {
      texte: "Programme de français du cycle 2",
      bo: "BO n° 41 du 31 octobre 2024",
      fichier: "sources/pdf/c2-francais.pdf",
    },
    extrait: "Objectifs d’apprentissage",
  };
}

Deno.test("une section de programmes-index.json est lue avec son identifiant, sa source, son domaine et ses niveaux", () => {
  const { matiere: _matiere, extrait: _extrait, ...section } = lireSectionDuProgramme(sectionFrancais());

  assertEquals(section, {
    id: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
    source: { texte: "Programme de français du cycle 2", bo: "BO n° 41 du 31 octobre 2024" },
    domaine: "Lecture",
    section: "Identifier les mots de manière de plus en plus aisée",
    niveaux: ["CP"],
  });
});

Deno.test("une section est lue avec sa matière du Catalogue et son extrait du programme", () => {
  const { matiere, extrait } = lireSectionDuProgramme(sectionFrancais());

  assertEquals(matiere, { code: "francais", libelle: "Français" });
  assertEquals(extrait, "Objectifs d’apprentissage");
});

Deno.test("une section dont la matière est inconnue est mal formée", () => {
  assertThrows(
    () => lireSectionDuProgramme({ ...sectionFrancais(), matiere: "astrologie" }),
    SectionDuProgrammeMalFormee,
  );
});

Deno.test("une section sans matière est mal formée", () => {
  const { matiere: _, ...sansMatiere } = sectionFrancais();

  assertThrows(() => lireSectionDuProgramme(sansMatiere), SectionDuProgrammeMalFormee);
});

Deno.test("une section sans domaine est mal formée", () => {
  const { domaine: _, ...sansDomaine } = sectionFrancais();

  assertThrows(() => lireSectionDuProgramme(sansDomaine), SectionDuProgrammeMalFormee);
});

Deno.test("une section dont la source n'est pas un objet est mal formée", () => {
  assertThrows(
    () => lireSectionDuProgramme({ ...sectionFrancais(), source: "BO n° 41" }),
    SectionDuProgrammeMalFormee,
  );
});

Deno.test("une section dont les niveaux ne sont pas des textes est mal formée", () => {
  assertThrows(
    () => lireSectionDuProgramme({ ...sectionFrancais(), niveaux: [1] }),
    SectionDuProgrammeMalFormee,
  );
});
