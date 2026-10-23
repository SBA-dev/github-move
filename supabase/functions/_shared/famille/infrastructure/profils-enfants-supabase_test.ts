import { assertEquals } from "@std/assert";
import { modificationDepuisLeProfil, profilDepuisLaLigne } from "./profils-enfants-supabase.ts";
import { ParentId } from "../domain/parent-id.ts";

const ligne = {
  id: "profil-1",
  prenom: "Léa",
  niveau: "CE1",
  univers: "princesse",
  cree_le: "2026-10-23T10:00:00.000Z",
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
