import { assertEquals, assertThrows } from "@std/assert";
import { presenterLeProfil } from "./presentation-du-profil.ts";
import { profilDepuisLaLigne } from "./profils-enfants-supabase.ts";

const profil = profilDepuisLaLigne({
  id: "profil-1",
  prenom: "Léa",
  niveau: "CE1",
  univers: "princesse",
  cree_le: "2026-10-23T10:00:00.000Z",
  mode_dys: true,
  tout_lire_a_voix_haute: false,
  parcours_libre: true,
  clavier_des_dictees: "clavierComplet",
  langue_du_parent: "arabe",
  rattachements: [{ parent: "paul" }],
});

Deno.test("la réponse présente le profil avec ses réglages", () => {
  assertEquals(presenterLeProfil(profil), {
    profil: {
      id: "profil-1",
      prenom: "Léa",
      niveau: "CE1",
      univers: "princesse",
      reglages: {
        modeDys: true,
        toutLireAVoixHaute: false,
        parcoursLibre: true,
        clavierDesDictees: "clavierComplet",
        langueDuParent: "arabe",
      },
    },
  });
});

Deno.test("un profil introuvable à la relecture est une panne", () => {
  assertThrows(() => presenterLeProfil(null), Error, "introuvable");
});
