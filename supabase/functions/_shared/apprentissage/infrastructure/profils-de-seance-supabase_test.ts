import { assertEquals, assertThrows } from "@std/assert";
import { profilDeSeanceDepuisLaLigne } from "./profils-de-seance-supabase.ts";

Deno.test("les colonnes niveau et clavier_des_dictees du profil enfant donnent le profil de séance", () => {
  const profil = profilDeSeanceDepuisLaLigne({ niveau: "CM1", clavier_des_dictees: "lettresDuMot" });

  assertEquals(profil, { clavierDesDictees: "lettresDuMot", niveau: "CM1" });
});

Deno.test("chaque réglage du clavier des dictées et chaque niveau de l'école élémentaire sont reconnus", () => {
  for (const clavier of ["automatique", "lettresDuMot", "clavierComplet"]) {
    for (const niveau of ["CP", "CE1", "CE2", "CM1", "CM2"]) {
      assertEquals(
        profilDeSeanceDepuisLaLigne({ niveau, clavier_des_dictees: clavier }),
        { clavierDesDictees: clavier, niveau },
      );
    }
  }
});

Deno.test("un réglage ou un niveau inconnu en base est une erreur, jamais un repli silencieux", () => {
  assertThrows(() => profilDeSeanceDepuisLaLigne({ niveau: "CP", clavier_des_dictees: "tactile" }));
  assertThrows(() => profilDeSeanceDepuisLaLigne({ niveau: "6e", clavier_des_dictees: "automatique" }));
});
