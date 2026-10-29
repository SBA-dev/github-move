import { assertEquals } from "@std/assert";
import type { Badge } from "./badges.ts";
import { matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import { cabaneDe } from "./cabane.ts";
import { histoireDe } from "./histoire.ts";
import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";
import { sectionsAAfficher, sectionsDeLEcran } from "./sections-de-l-ecran.ts";
import { tenuesDe } from "./tenues.ts";

Deno.test("la seule section disponible est affichée seule", () => {
  const sections = sectionsAAfficher(["recordsDeFluence"]);

  assertEquals(sections, ["recordsDeFluence"]);
});

Deno.test("les sections disponibles sont rangées dans l'ordre cabane, histoire, badges, records de fluence", () => {
  const sections = sectionsAAfficher(["recordsDeFluence", "cabane", "badges"]);

  assertEquals(sections, ["cabane", "badges", "recordsDeFluence"]);
});

Deno.test("sans section disponible, rien n'est affiché", () => {
  const sections = sectionsAAfficher([]);

  assertEquals(sections, []);
});

const pastille: PastilleDeRecord = {
  lecon: "cp-calcul-addition",
  exercice: "fluence-1",
  libelle: "Additions",
  meilleurScore: 12,
};

Deno.test("sans pastille de record, la section des records n'est pas affichée", () => {
  const sections = sectionsDeLEcran({ pastilles: [], cabane: undefined });

  assertEquals(sections, []);
});

Deno.test("avec au moins une pastille de record, la section des records de fluence est affichée", () => {
  const sections = sectionsDeLEcran({ pastilles: [pastille], cabane: undefined });

  assertEquals(sections, ["recordsDeFluence"]);
});

Deno.test("la cabane est toujours affichée en tête, même à 0 étoile", () => {
  const sections = sectionsDeLEcran({ pastilles: [], cabane: cabaneDe(0) });

  assertEquals(sections, ["cabane"]);
});

Deno.test("la cabane précède les records de fluence", () => {
  const sections = sectionsDeLEcran({ pastilles: [pastille], cabane: cabaneDe(3) });

  assertEquals(sections, ["cabane", "recordsDeFluence"]);
});

Deno.test("quand les étoiles n'ont pas pu être lues, la cabane n'est pas affichée", () => {
  const sections = sectionsDeLEcran({ pastilles: [pastille], cabane: undefined });

  assertEquals(sections, ["recordsDeFluence"]);
});

const badge: Badge = { cle: "Additionner", nom: "Additionner", matiere: "maths", lecons: ["cp-calcul-addition"] };

Deno.test("avec des badges, la section des badges est affichée entre la cabane et les records de fluence", () => {
  const sections = sectionsDeLEcran({ pastilles: [pastille], cabane: cabaneDe(3), badges: [badge] });

  assertEquals(sections, ["cabane", "badges", "recordsDeFluence"]);
});

Deno.test("sans aucun badge gagné, la section des badges est quand même affichée", () => {
  const sections = sectionsDeLEcran({ pastilles: [], cabane: undefined, badges: [] });

  assertEquals(sections, ["badges"]);
});

Deno.test("quand les badges n'ont pas pu être lus, la section des badges n'est pas affichée", () => {
  const sections = sectionsDeLEcran({ pastilles: [], cabane: cabaneDe(3), badges: undefined });

  assertEquals(sections, ["cabane"]);
});

Deno.test("avec une histoire à 0 épisode ouvert, la section de l'histoire est quand même affichée", () => {
  const sections = sectionsDeLEcran({ pastilles: [], cabane: undefined, histoire: histoireDe(0) });

  assertEquals(sections, ["histoire"]);
});

Deno.test("sans histoire connue, la section de l'histoire n'est pas affichée", () => {
  const sections = sectionsDeLEcran({ pastilles: [], cabane: cabaneDe(3), histoire: undefined });

  assertEquals(sections, ["cabane"]);
});

Deno.test("la section de l'histoire est affichée entre la cabane et les badges", () => {
  const sections = sectionsDeLEcran({
    pastilles: [pastille],
    cabane: cabaneDe(3),
    histoire: histoireDe(2),
    badges: [badge],
  });

  assertEquals(sections, ["cabane", "histoire", "badges", "recordsDeFluence"]);
});

Deno.test("les sections disponibles sont rangées dans l'ordre cabane, tenues, histoire, badges, records de fluence", () => {
  const sections = sectionsAAfficher(["recordsDeFluence", "badges", "histoire", "tenues", "cabane"]);

  assertEquals(sections, ["cabane", "tenues", "histoire", "badges", "recordsDeFluence"]);
});

Deno.test("la section des tenues vient juste après la cabane", () => {
  const sections = sectionsDeLEcran({
    pastilles: [pastille],
    cabane: cabaneDe(5),
    tenues: tenuesDe(5),
    histoire: histoireDe(2),
    badges: [badge],
  });

  assertEquals(sections, ["cabane", "tenues", "histoire", "badges", "recordsDeFluence"]);
});

Deno.test("avant le premier palier des tenues, la section des tenues n'apparaît pas", () => {
  const sections = sectionsDeLEcran({ pastilles: [], cabane: cabaneDe(4), tenues: tenuesDe(4) });

  assertEquals(sections, ["cabane"]);
});

Deno.test("quand les étoiles n'ont pas pu être lues, la section des tenues n'apparaît pas", () => {
  const sections = sectionsDeLEcran({ pastilles: [], cabane: undefined, tenues: undefined });

  assertEquals(sections, []);
});

Deno.test("« Mes défis relevés » est la dernière section, après les records de fluence", () => {
  const sections = sectionsAAfficher(["defisReleves", "recordsDeFluence", "cabane", "badges"]);

  assertEquals(sections, ["cabane", "badges", "recordsDeFluence", "defisReleves"]);
});

Deno.test("avec un défi relevé, « Mes défis relevés » s'ajoute à la fin sans déplacer les autres sections", () => {
  const defi = { matiere: matiereDeCode("maths"), niveau: Niveau.de("CE1"), numero: 1 };

  const sections = sectionsDeLEcran({ pastilles: [pastille], cabane: cabaneDe(3), defisReleves: [defi] });

  assertEquals(sections, ["cabane", "recordsDeFluence", "defisReleves"]);
});

Deno.test("sans défi relevé, la section « Mes défis relevés » n'est pas affichée", () => {
  const sections = sectionsDeLEcran({ pastilles: [pastille], cabane: cabaneDe(3), defisReleves: [] });

  assertEquals(sections, ["cabane", "recordsDeFluence"]);
});
