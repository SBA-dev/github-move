import { assert, assertEquals } from "@std/assert";
import { sectionDeTest } from "../test_utils/sections-de-test.ts";
import { citationDeLaSection } from "./citation-de-la-section.ts";

function sectionAvecExtrait(...phrases: string[]) {
  return sectionDeTest({ extrait: phrases.join(" ") });
}

function espacesUnifies(texte: string): string {
  return texte.replace(/\s+/g, " ").trim();
}

const PHRASE_COURTE = "Le chat dort sur le canapé du salon.";
const PHRASE_PROCHE_DE_120 =
  "Le chat dort paisiblement sur le grand canapé du salon pendant que les enfants jouent dans le jardin avec leur ballon.";

Deno.test("la citation est un passage de l'extrait de la section recopié tel quel", () => {
  const section = sectionAvecExtrait(
    "Les élèves apprennent à lire des mots simples.",
    "Le chat mange son poisson dans la cuisine.",
  );

  const citation = citationDeLaSection(section, ["chat"]);

  assert(citation.length > 0);
  assert(espacesUnifies(section.extrait).includes(espacesUnifies(citation)));
});

Deno.test("la phrase qui contient le plus de mots-clés l'emporte", () => {
  const section = sectionAvecExtrait(
    "Le poisson nage dans le bassin du jardin.",
    "Le chat dort sur le canapé du salon.",
    "Le poisson nage avec le chat dans le bassin.",
  );

  const citation = citationDeLaSection(section, ["chat", "poisson"]);

  assertEquals(citation, "Le poisson nage avec le chat dans le bassin.");
});

Deno.test("à nombre égal de mots-clés, une phrase propre l'emporte sur une phrase mal formée", () => {
  const section = sectionAvecExtrait(
    "le chat dort sur le canapé du grand salon de la maison familiale près de la fenêtre ouverte.",
    "Le chat mange son poisson dans la cuisine.",
  );

  const citation = citationDeLaSection(section, ["chat"]);

  assertEquals(citation, "Le chat mange son poisson dans la cuisine.");
});

Deno.test("à égalité de mots-clés et de propreté, la phrase la plus proche de 120 caractères l'emporte", () => {
  const section = sectionAvecExtrait(PHRASE_COURTE, PHRASE_PROCHE_DE_120);

  const citation = citationDeLaSection(section, ["chat"]);

  assertEquals(citation, PHRASE_PROCHE_DE_120);
});

Deno.test("une phrase de moins de 25 caractères est ignorée même si elle contient tous les mots-clés", () => {
  const section = sectionAvecExtrait(
    "Le chat voit un poisson.",
    "Le chat de la voisine dort sur le canapé.",
  );

  const citation = citationDeLaSection(section, ["chat", "poisson"]);

  assertEquals(citation, "Le chat de la voisine dort sur le canapé.");
});

Deno.test("une phrase de plus de 450 caractères est ignorée même si elle contient tous les mots-clés", () => {
  const phraseTropLongue = `Le chat et le poisson ${"vivent ensemble dans la maison ".repeat(15)}tranquillement.`;
  const section = sectionAvecExtrait(
    phraseTropLongue,
    "Le chat de la voisine dort sur le canapé.",
  );

  const citation = citationDeLaSection(section, ["chat", "poisson"]);

  assertEquals(citation, "Le chat de la voisine dort sur le canapé.");
});

Deno.test("les mots-clés se comparent sans tenir compte des accents ni de la casse", () => {
  const section = sectionAvecExtrait(
    "Les enfants jouent dehors tout le long du jour.",
    "Pendant l’Été, les enfants jouent dehors.",
  );

  const citation = citationDeLaSection(section, ["ete"]);

  assertEquals(citation, "Pendant l’Été, les enfants jouent dehors.");
});

Deno.test("sans mot-clé présent, la citation est la phrase lisible la plus proche de 120 caractères", () => {
  const section = sectionAvecExtrait(PHRASE_COURTE, PHRASE_PROCHE_DE_120);

  const citation = citationDeLaSection(section, ["baleine"]);

  assertEquals(citation, PHRASE_PROCHE_DE_120);
});

Deno.test("l'extrait réel d'une section de dictée du CE1 donne une citation qui en est un passage", () => {
  const section = sectionDeTest({
    id: "c2-francais-ce1-encoder-puis-ecrire-sous-dictee",
    section: "Encoder puis écrire sous dictée",
    extrait:
      "Objectifs d’apprentissage  Exemples de réussite - Orthographier correctement les mots fréquents,  - L’élève réalise des dictées en lien avec l’étude des réguliers puis irréguliers.  graphèmes avec ou sans appui du cahier où ils sont - Réaliser des accords en genre et en nombre dans le  consignés. groupe nominal (article, nom, adjectif) et dans le groupe  - Il réalise des dictées en lien avec l’étude de la langue. verbal (marque de pluriel des verbes = nt).  - Il se familiarise avec divers types de dictée.",
  });

  const citation = citationDeLaSection(section, ["dictée", "orthographe"]);

  assert(citation.length > 0);
  assert(espacesUnifies(section.extrait).includes(espacesUnifies(citation)));
});
