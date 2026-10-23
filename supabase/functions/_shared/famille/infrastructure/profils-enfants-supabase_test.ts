import { assertEquals } from "@std/assert";
import { colonnesDesReglages, modificationDepuisLeProfil, profilDepuisLaLigne } from "./profils-enfants-supabase.ts";
import { ParentId } from "../domain/parent-id.ts";
import { Reglages } from "../domain/reglages.ts";

const ligne = {
  id: "profil-1",
  prenom: "Léa",
  niveau: "CE1",
  univers: "princesse",
  cree_le: "2026-10-23T10:00:00.000Z",
  mode_dys: true,
  tout_lire_a_voix_haute: true,
  parcours_libre: true,
  clavier_des_dictees: "lettresDuMot",
  langue_du_parent: "arabe",
  rattachements: [{ parent: "paul" }, { parent: "marie" }],
};

Deno.test("la ligne d'un profil devient un profil enfant rattaché à ses parents", () => {
  const profil = profilDepuisLaLigne(ligne);

  assertEquals(profil.id.valeur, "profil-1");
  assertEquals(profil.prenom.valeur, "Léa");
  assertEquals(profil.niveau.valeur, "CE1");
  assertEquals(profil.univers, "princesse");
  assertEquals(profil.creeLe, new Date("2026-10-23T10:00:00.000Z"));
  assertEquals(profil.estRattacheA(ParentId.de("marie")), true);
  assertEquals(profil.estRattacheA(ParentId.de("autre")), false);
});

Deno.test("la modification écrite en base reprend prénom, niveau et univers du profil", () => {
  assertEquals(modificationDepuisLeProfil(profilDepuisLaLigne(ligne)), {
    prenom: "Léa",
    niveau: "CE1",
    univers: "princesse",
  });
});

Deno.test("la ligne d'un profil porte ses réglages dans le profil enfant", () => {
  const { reglages } = profilDepuisLaLigne(ligne);

  assertEquals(reglages.modeDys, true);
  assertEquals(reglages.toutLireAVoixHaute, true);
  assertEquals(reglages.parcoursLibre, true);
  assertEquals(reglages.clavierDesDictees.valeur, "lettresDuMot");
  assertEquals(reglages.langueDuParent.valeur, "arabe");
});

Deno.test("les réglages absents de la ligne prennent leur valeur par défaut", () => {
  const { reglages } = profilDepuisLaLigne({
    id: "profil-1",
    prenom: "Léa",
    niveau: "CE1",
    univers: "princesse",
    cree_le: "2026-10-23T10:00:00.000Z",
    rattachements: [{ parent: "paul" }],
  });

  assertEquals(reglages, Reglages.parDefaut());
});

Deno.test("les réglages s'écrivent en base dans leurs cinq colonnes", () => {
  assertEquals(colonnesDesReglages(profilDepuisLaLigne(ligne).reglages), {
    mode_dys: true,
    tout_lire_a_voix_haute: true,
    parcours_libre: true,
    clavier_des_dictees: "lettresDuMot",
    langue_du_parent: "arabe",
  });
});

Deno.test("les réglages par défaut s'écrivent en base : tout désactivé, clavier automatique, aucune langue", () => {
  assertEquals(colonnesDesReglages(Reglages.parDefaut()), {
    mode_dys: false,
    tout_lire_a_voix_haute: false,
    parcours_libre: false,
    clavier_des_dictees: "automatique",
    langue_du_parent: "aucune",
  });
});
