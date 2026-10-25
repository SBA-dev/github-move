import { assertEquals, assertThrows } from "@std/assert";
import { Niveau, type SectionDuProgramme } from "../../catalogue/domain/index.ts";
import { sectionDeTest } from "../test_utils/sections-de-test.ts";
import { LeconPersonnelleInvalide } from "./erreurs.ts";
import { LeconPersonnelle } from "./lecon-personnelle.ts";
import { type LeconPreparee, preparerUneLeconPersonnelle } from "./preparer-une-lecon-personnelle.ts";
import { TexteDuParent } from "./texte-du-parent.ts";

const TEXTE = "chaton, maison, poisson, garçon";
const PROFIL = "profil-de-lina";
const MAINTENANT = new Date("2026-10-25T10:00:00Z");
const SECTIONS = [sectionDeTest({ id: "francais-ce1", niveaux: ["CE1"] })];

function leconPreparee(sections: SectionDuProgramme[] = SECTIONS): LeconPreparee {
  return preparerUneLeconPersonnelle({ texte: TEXTE, niveau: Niveau.de("CE1") }, sections);
}

function abimee(changement: Partial<LeconPreparee["lecon"]>): LeconPreparee {
  const preparee = leconPreparee();
  return { ...preparee, lecon: { ...preparee.lecon, ...changement } };
}

function creer(preparee: LeconPreparee, sections: SectionDuProgramme[] = SECTIONS) {
  return LeconPersonnelle.creer({
    id: "abc123",
    profil: PROFIL,
    texte: TexteDuParent.de(TEXTE),
    preparee,
    sections,
    maintenant: MAINTENANT,
  });
}

Deno.test("une leçon préparée normalement devient une leçon personnelle dont l'identifiant commence par perso-", () => {
  const { leconPersonnelle } = creer(leconPreparee());

  assertEquals(leconPersonnelle.lecon.id, "perso-abc123");
});

Deno.test("la leçon personnelle garde le profil, le texte du parent et sa date de création", () => {
  const { leconPersonnelle } = creer(leconPreparee());

  assertEquals(
    [leconPersonnelle.profil, leconPersonnelle.texte.valeur, leconPersonnelle.creeeLe],
    [PROFIL, TEXTE, MAINTENANT],
  );
});

Deno.test("créer une leçon personnelle émet LeconPersonnelleCreee", () => {
  const { evenement } = creer(leconPreparee());

  assertEquals(evenement, {
    type: "LeconPersonnelleCreee",
    lecon: "perso-abc123",
    profil: PROFIL,
    matiere: "francais",
    niveau: "CE1",
    creeeLe: MAINTENANT,
  });
});

Deno.test("une leçon qui ne respecte pas le format est invalide", () => {
  assertThrows(() => creer(abimee({ titre: "" })), LeconPersonnelleInvalide);
});

Deno.test("une leçon dont la section n'existe pas dans les sections fournies est invalide", () => {
  assertThrows(() => creer(leconPreparee(), []), LeconPersonnelleInvalide);
});

Deno.test("une leçon dont la section est d'une autre matière est invalide", () => {
  const autreMatiere = [sectionDeTest({ id: "francais-ce1", matiere: "histoire", niveaux: ["CE1"] })];

  assertThrows(() => creer(leconPreparee(), autreMatiere), LeconPersonnelleInvalide);
});

Deno.test("une leçon dont la section ne couvre pas son niveau est invalide", () => {
  const autreNiveau = [sectionDeTest({ id: "francais-ce1", niveaux: ["CP"] })];

  assertThrows(() => creer(leconPreparee(), autreNiveau), LeconPersonnelleInvalide);
});

Deno.test("une leçon dont la citation n'est pas mot pour mot dans l'extrait de la section est invalide", () => {
  const preparee = abimee({ programme: { section: "francais-ce1", citation: "Une phrase inventée." } });

  assertThrows(() => creer(preparee), LeconPersonnelleInvalide);
});

Deno.test("une leçon qui dicte un mot impossible à écrire au clavier est invalide", () => {
  const preparee = abimee({
    exercices: [{ type: "dictee", consigne: "Écris le mot.", mots: [{ mot: "chat2" }] }],
  });

  assertThrows(() => creer(preparee), LeconPersonnelleInvalide);
});

Deno.test("une leçon sans aucun exercice est invalide", () => {
  assertThrows(() => creer(abimee({ exercices: [] })), LeconPersonnelleInvalide);
});

Deno.test("supprimer une leçon personnelle émet LeconPersonnelleSupprimee", () => {
  const { leconPersonnelle } = creer(leconPreparee());
  const suppression = new Date("2026-10-26T08:30:00Z");

  assertEquals(leconPersonnelle.supprimer(suppression), {
    type: "LeconPersonnelleSupprimee",
    lecon: "perso-abc123",
    profil: PROFIL,
    supprimeeLe: suppression,
  });
});
