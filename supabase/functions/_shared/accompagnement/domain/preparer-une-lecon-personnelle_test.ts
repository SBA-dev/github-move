import { assertEquals, assertNotEquals, assertThrows } from "@std/assert";
import {
  type CodeDeMatiere,
  lireLecon,
  Niveau,
  type SectionDuProgramme,
  toutesLesMatieres,
} from "../../catalogue/domain/index.ts";
import { sectionDeTest } from "../test_utils/sections-de-test.ts";
import { AucuneSectionDuProgramme, TexteTropCourt } from "./erreurs.ts";
import { leconDuTexte } from "./generateurs-locaux.ts";
import { reconnaitreLaForme } from "./forme-du-texte.ts";
import { leconEnBrut } from "./lecon-en-brut.ts";
import { ORDRE_DES_LECONS_PERSONNELLES, preparerUneLeconPersonnelle } from "./preparer-une-lecon-personnelle.ts";
import { TexteDuParent } from "./texte-du-parent.ts";

const LISTE_DE_MOTS = "chaton, maison, poisson, garçon";
const LISTE_DE_VERBES = "chanter, finir, prendre, manger";
const POESIE = [
  "Le vent souffle sur la colline",
  "La lune brille dans la nuit",
  "Les étoiles dansent et filent",
  "Le jour revient avec le bruit",
].join("\n");
const TEXTE_DOCUMENTAIRE = [
  "Les abeilles construisent des ruches.",
  "Les abeilles fabriquent du miel.",
  "Une reine pond beaucoup d'oeufs.",
  "Les ouvrières butinent les fleurs.",
  "Le miel nourrit toute la colonie.",
  "Ainsi, la ruche vit tout l'été.",
].join(" ");
const TEXTE_SUR_UN_METIER =
  "Le pompier travaille à la caserne. Il part vite quand on l'appelle, il éteint les incendies et il aide les gens en danger toute la journée.";

function laMatiere(code: CodeDeMatiere) {
  return toutesLesMatieres().find((matiere) => matiere.code === code)!;
}

const CE1 = Niveau.de("CE1");
const CE2 = Niveau.de("CE2");
const CP = Niveau.de("CP");

const sectionDeFrancaisDuCE1 = sectionDeTest({ id: "francais-ce1", niveaux: ["CE1"] });

function demande(texte: string, niveau: Niveau = CE1) {
  return { texte, niveau };
}

Deno.test("un texte trop court ne permet pas de préparer une leçon personnelle", () => {
  assertThrows(() => preparerUneLeconPersonnelle(demande("ab"), [sectionDeFrancaisDuCE1]), TexteTropCourt);
});

Deno.test("la leçon préparée d'une liste de mots est la dictée du générateur de sa forme", () => {
  const texte = TexteDuParent.de(LISTE_DE_MOTS);
  const { contenu } = leconDuTexte(texte, reconnaitreLaForme(texte));

  const { lecon } = preparerUneLeconPersonnelle(demande(LISTE_DE_MOTS), [sectionDeFrancaisDuCE1]);

  assertEquals(lecon.titre, contenu.titre);
  assertEquals(lecon.etapes, contenu.etapes);
  assertEquals(lecon.exercices, contenu.exercices);
});

Deno.test("la leçon préparée garde le niveau demandé", () => {
  const sections = [sectionDeTest({ niveaux: ["CE1", "CE2"] })];

  const { lecon } = preparerUneLeconPersonnelle(demande(LISTE_DE_MOTS, CE2), sections);

  assertEquals(lecon.niveau, CE2);
});

Deno.test("la leçon préparée garde la matière demandée", () => {
  const sections = [sectionDeTest({ matiere: "histoire", niveaux: ["CE1"] })];

  const { lecon } = preparerUneLeconPersonnelle(
    { texte: LISTE_DE_MOTS, niveau: CE1, matiere: laMatiere("histoire") },
    sections,
  );

  assertEquals(lecon.matiere, laMatiere("histoire"));
});

Deno.test("un texte sur le métier de pompier, sans matière, donne une leçon d'EMC en CE2 quand une section d'EMC couvre le CE2", () => {
  const sections = [
    sectionDeTest({ id: "francais-ce2", niveaux: ["CE2"] }),
    sectionDeTest({ id: "emc-ce2", matiere: "emc", niveaux: ["CE2"] }),
  ];

  const { lecon } = preparerUneLeconPersonnelle(demande(TEXTE_SUR_UN_METIER, CE2), sections);

  assertEquals(lecon.matiere, laMatiere("emc"));
});

Deno.test("un texte sur le métier de pompier, sans matière, donne une leçon de français en CP quand aucune section d'EMC ne couvre le CP", () => {
  const sections = [
    sectionDeTest({ id: "francais-cp", niveaux: ["CP"] }),
    sectionDeTest({ id: "emc-ce2", matiere: "emc", niveaux: ["CE2"] }),
  ];

  const { lecon } = preparerUneLeconPersonnelle(demande(TEXTE_SUR_UN_METIER, CP), sections);

  assertEquals(lecon.matiere, laMatiere("francais"));
});

Deno.test("sans matière, un texte qui ne parle pas d'un métier donne une leçon de français", () => {
  const sections = [
    sectionDeTest({ id: "francais-ce2", niveaux: ["CE2"] }),
    sectionDeTest({ id: "emc-ce2", matiere: "emc", niveaux: ["CE2"] }),
  ];

  const { lecon } = preparerUneLeconPersonnelle(demande(LISTE_DE_MOTS, CE2), sections);

  assertEquals(lecon.matiere, laMatiere("francais"));
});

Deno.test("la leçon préparée cite la section du programme retenue", () => {
  const sections = [
    sectionDeTest({ id: "autre-section", niveaux: ["CE2"] }),
    sectionDeTest({ id: "francais-ce1", niveaux: ["CE1"] }),
  ];

  const { lecon, section } = preparerUneLeconPersonnelle(demande(LISTE_DE_MOTS), sections);

  assertEquals(section.id, "francais-ce1");
  assertEquals(lecon.programme.section, "francais-ce1");
});

Deno.test("la citation de la leçon préparée est la phrase de la section qui contient un mot indice de la forme", () => {
  const section = sectionDeTest({
    niveaux: ["CE1"],
    extrait:
      "Le programme décrit des attentes très générales pour la classe. Les élèves apprennent à encoder les mots en dictée avec soin.",
  });

  const { lecon } = preparerUneLeconPersonnelle(demande(LISTE_DE_MOTS), [section]);

  assertEquals(lecon.programme.citation, "Les élèves apprennent à encoder les mots en dictée avec soin.");
});

Deno.test("la citation de la leçon préparée est la phrase de la section qui contient un mot du texte du parent", () => {
  const section = sectionDeTest({
    niveaux: ["CE1"],
    extrait:
      "Le programme décrit des attentes très générales pour la classe. Les élèves observent les abeilles et leur ruche.",
  });

  const { lecon } = preparerUneLeconPersonnelle(demande(TEXTE_DOCUMENTAIRE), [section]);

  assertEquals(lecon.programme.citation, "Les élèves observent les abeilles et leur ruche.");
});

Deno.test("la leçon préparée n'a ni compétence ni passage du guide fondamental", () => {
  const { lecon } = preparerUneLeconPersonnelle(demande(LISTE_DE_MOTS), [sectionDeFrancaisDuCE1]);

  assertEquals(lecon.competence, undefined);
  assertEquals(lecon.guide, undefined);
});

Deno.test("la leçon préparée a l'ordre fixe des leçons personnelles", () => {
  const { lecon } = preparerUneLeconPersonnelle(demande(LISTE_DE_MOTS), [sectionDeFrancaisDuCE1]);

  assertEquals(lecon.ordre, ORDRE_DES_LECONS_PERSONNELLES);
});

Deno.test("la même demande avec les mêmes sections donne la même leçon préparée", () => {
  const sections: SectionDuProgramme[] = [sectionDeFrancaisDuCE1];

  const premiere = preparerUneLeconPersonnelle(demande(TEXTE_DOCUMENTAIRE), sections);
  const seconde = preparerUneLeconPersonnelle(demande(TEXTE_DOCUMENTAIRE), sections);

  assertEquals(seconde, premiere);
});

Deno.test("la leçon préparée garde la forme et les mots écartés du texte", () => {
  const { forme, ecartes } = preparerUneLeconPersonnelle(
    demande("chaton, anticonstitutionnellement, maison, zoo@, poisson"),
    [sectionDeFrancaisDuCE1],
  );

  assertEquals(forme, "listeDeMots");
  assertNotEquals(ecartes.length, 0);
});

for (
  const [forme, texte] of [
    ["liste de mots", LISTE_DE_MOTS],
    ["liste de verbes", LISTE_DE_VERBES],
    ["poésie", POESIE],
    ["texte documentaire", TEXTE_DOCUMENTAIRE],
  ] as const
) {
  Deno.test(`la leçon préparée d'une ${forme}, une fois enregistrée, est relue par le Catalogue`, () => {
    const { lecon } = preparerUneLeconPersonnelle(demande(texte), [sectionDeFrancaisDuCE1]);

    const relue = lireLecon(leconEnBrut(lecon, "perso-1"));

    assertEquals(relue.titre, lecon.titre);
    assertEquals(relue.exercices.length, lecon.exercices.length);
  });
}

Deno.test("une matière sans section du programme pour la classe empêche de préparer la leçon", () => {
  const sections = [sectionDeTest({ matiere: "histoire", niveaux: ["CE1"] })];

  assertThrows(
    () =>
      preparerUneLeconPersonnelle(
        { texte: LISTE_DE_MOTS, niveau: CE2, matiere: laMatiere("histoire") },
        sections,
      ),
    AucuneSectionDuProgramme,
  );
});
