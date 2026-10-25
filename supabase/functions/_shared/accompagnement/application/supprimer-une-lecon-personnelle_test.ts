import { assertEquals, assertRejects } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { LeconPersonnelleIntrouvable } from "../domain/erreurs.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { LeconsPersonnellesEnMemoire } from "../test_utils/lecons-personnelles-en-memoire.ts";
import { RattachementsEnMemoire } from "../test_utils/rattachements-en-memoire.ts";
import { sectionDeTest } from "../test_utils/sections-de-test.ts";
import { SectionsDuProgrammeEnMemoire } from "../test_utils/sections-du-programme-en-memoire.ts";
import { CreerUneLeconPersonnelle } from "./creer-une-lecon-personnelle.ts";
import { SupprimerUneLeconPersonnelle } from "./supprimer-une-lecon-personnelle.ts";

const PARENT = "parent-de-lina";
const PROFIL = "profil-de-lina";
const AUTRE_PARENT = "parent-d-une-autre-famille";
const MAINTENANT = new Date("2026-10-25T10:00:00Z");
const ID_DE_LA_LECON = "perso-abc123";

async function monter() {
  const lecons = new LeconsPersonnellesEnMemoire();
  const rattachements = new RattachementsEnMemoire([PARENT, PROFIL]);
  await new CreerUneLeconPersonnelle(
    rattachements,
    new SectionsDuProgrammeEnMemoire([sectionDeTest({ id: "francais-ce1", niveaux: ["CE1"] })]),
    lecons,
    generateurIdFixe("abc123"),
  ).executer(
    { parent: PARENT, profil: PROFIL, texte: "chaton, maison, poisson, garçon", niveau: Niveau.de("CE1") },
    MAINTENANT,
  );
  return { cas: new SupprimerUneLeconPersonnelle(rattachements, lecons), lecons };
}

Deno.test("supprimer une leçon personnelle la retire du dépôt avec son texte et rend l'événement LeconPersonnelleSupprimee", async () => {
  const { cas, lecons } = await monter();

  const evenement = await cas.executer({ parent: PARENT, lecon: ID_DE_LA_LECON }, MAINTENANT);

  assertEquals(evenement, {
    type: "LeconPersonnelleSupprimee",
    lecon: ID_DE_LA_LECON,
    profil: PROFIL,
    supprimeeLe: MAINTENANT,
  });
  assertEquals(await lecons.parId(ID_DE_LA_LECON), undefined);
});

Deno.test("supprimer une leçon personnelle inconnue est refusé", async () => {
  const { cas } = await monter();

  await assertRejects(
    () => cas.executer({ parent: PARENT, lecon: "perso-inconnue" }, MAINTENANT),
    LeconPersonnelleIntrouvable,
  );
});

// Un parent d'une autre famille ne doit pas pouvoir deviner l'existence de la leçon :
// il reçoit la même erreur qu'une leçon inconnue (sous RLS, le dépôt ne la lui montrerait pas).
Deno.test("un parent non rattaché au profil de la leçon la trouve introuvable et rien n'est supprimé", async () => {
  const { cas, lecons } = await monter();

  await assertRejects(
    () => cas.executer({ parent: AUTRE_PARENT, lecon: ID_DE_LA_LECON }, MAINTENANT),
    LeconPersonnelleIntrouvable,
  );

  assertEquals(lecons.toutes().length, 1);
});
