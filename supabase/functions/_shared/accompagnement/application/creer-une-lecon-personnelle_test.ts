import { assertEquals, assertInstanceOf, assertRejects } from "@std/assert";
import { type Matiere, matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import { AucuneSectionDuProgramme, ParentNonRattache, TexteTropCourt } from "../domain/erreurs.ts";
import { leconEnBrut } from "../domain/lecon-en-brut.ts";
import { preparerUneLeconPersonnelle } from "../domain/preparer-une-lecon-personnelle.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { LeconsPersonnellesEnMemoire } from "../test_utils/lecons-personnelles-en-memoire.ts";
import { RattachementsEnMemoire } from "../test_utils/rattachements-en-memoire.ts";
import { sectionDeTest } from "../test_utils/sections-de-test.ts";
import { SectionsDuProgrammeEnMemoire } from "../test_utils/sections-du-programme-en-memoire.ts";
import { CreerUneLeconPersonnelle } from "./creer-une-lecon-personnelle.ts";

const PARENT = "parent-de-lina";
const PROFIL = "profil-de-lina";
const TEXTE = "chaton, maison, poisson, garçon";
const MAINTENANT = new Date("2026-10-25T10:00:00Z");

function monter(sections = [sectionDeTest({ id: "francais-ce1", niveaux: ["CE1"] })]) {
  const lecons = new LeconsPersonnellesEnMemoire();
  const cas = new CreerUneLeconPersonnelle(
    new RattachementsEnMemoire([PARENT, PROFIL]),
    new SectionsDuProgrammeEnMemoire(sections),
    lecons,
    generateurIdFixe("abc123"),
  );
  return { cas, lecons };
}

const demande = (changement: { parent?: string; texte?: string; matiere?: Matiere } = {}) => ({
  parent: PARENT,
  profil: PROFIL,
  texte: TEXTE,
  niveau: Niveau.de("CE1"),
  ...changement,
});

Deno.test("un parent non rattaché au profil ne peut pas créer de leçon personnelle et rien n'est enregistré", async () => {
  const { cas, lecons } = monter();

  await assertRejects(() => cas.executer(demande({ parent: "parent-inconnu" }), MAINTENANT), ParentNonRattache);

  assertEquals(lecons.toutes(), []);
});

Deno.test("créer une leçon personnelle enregistre la leçon préparée avec le texte du parent et rend la leçon et l'événement", async () => {
  const { cas, lecons } = monter();

  const { leconPersonnelle, evenement } = await cas.executer(demande(), MAINTENANT);

  assertEquals(leconPersonnelle.lecon.id, "perso-abc123");
  assertEquals(evenement.type, "LeconPersonnelleCreee");
  assertEquals(await lecons.parId("perso-abc123"), leconPersonnelle);
  assertEquals(leconPersonnelle.texte.valeur, TEXTE);
});

Deno.test("un texte trop court est refusé par la préparation et rien n'est enregistré", async () => {
  const { cas, lecons } = monter();

  const erreur = await assertRejects(() => cas.executer(demande({ texte: "a" }), MAINTENANT));

  assertInstanceOf(erreur, TexteTropCourt);
  assertEquals(lecons.toutes(), []);
});

Deno.test("sans section du programme pour la classe, la leçon n'est pas enregistrée", async () => {
  const { cas, lecons } = monter([]);

  await assertRejects(() => cas.executer(demande(), MAINTENANT), AucuneSectionDuProgramme);

  assertEquals(lecons.toutes(), []);
});

const SECTIONS_FRANCAIS_ET_MATHS = [
  sectionDeTest({ id: "francais-ce1", niveaux: ["CE1"] }),
  sectionDeTest({ id: "maths-ce1", matiere: "maths", niveaux: ["CE1"] }),
];

Deno.test("le parent peut choisir la matière de la leçon personnelle : elle se retrouve dans la leçon et dans sa section du programme", async () => {
  const { cas } = monter(SECTIONS_FRANCAIS_ET_MATHS);

  const { leconPersonnelle } = await cas.executer(demande({ matiere: matiereDeCode("maths") }), MAINTENANT);

  assertEquals(
    [leconPersonnelle.lecon.matiere.code, leconPersonnelle.lecon.programme.section],
    ["maths", "maths-ce1"],
  );
});

Deno.test("une matière sans section du programme pour la classe est refusée et rien n'est enregistré", async () => {
  const { cas, lecons } = monter();

  await assertRejects(
    () => cas.executer(demande({ matiere: matiereDeCode("maths") }), MAINTENANT),
    AucuneSectionDuProgramme,
  );

  assertEquals(lecons.toutes(), []);
});

Deno.test("la leçon enregistrée, hors identifiant, est celle que prépare la préparation pour la même demande", async () => {
  const sections = SECTIONS_FRANCAIS_ET_MATHS;
  const { cas } = monter(sections);
  const matiere = matiereDeCode("maths");

  const { leconPersonnelle } = await cas.executer(demande({ matiere }), MAINTENANT);

  const preparee = preparerUneLeconPersonnelle({ texte: TEXTE, niveau: Niveau.de("CE1"), matiere }, sections);
  assertEquals(
    leconEnBrut(leconPersonnelle.lecon, "x"),
    leconEnBrut(preparee.lecon, "x"),
  );
});
