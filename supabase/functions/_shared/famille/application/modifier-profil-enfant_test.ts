import { assertEquals, assertRejects } from "@std/assert";
import { NiveauInconnu } from "../../catalogue/domain/index.ts";
import { ParentNonRattache, PrenomObligatoire, ProfilEnfantIntrouvable } from "../domain/erreurs.ts";
import { ProfilEnfantId } from "../domain/profil-enfant-id.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { ProfilsEnfantsEnMemoire } from "../test_utils/profils-enfants-en-memoire.ts";
import { CreerProfilEnfant } from "./creer-profil-enfant.ts";
import { ModifierProfilEnfant } from "./modifier-profil-enfant.ts";

async function profilsAvecLeaDePaul(): Promise<ProfilsEnfantsEnMemoire> {
  const profils = new ProfilsEnfantsEnMemoire();
  await new CreerProfilEnfant(profils, generateurIdFixe("profil-lea")).executer(
    { parent: "parent-paul", prenom: "Léa", niveau: "CE1", univers: "animaux" },
    new Date("2026-09-01T08:00:00Z"),
  );
  return profils;
}

const idDeLea = ProfilEnfantId.de("profil-lea");

Deno.test("un parent rattaché change le prénom, le niveau et l'univers du profil enfant", async () => {
  const profils = await profilsAvecLeaDePaul();

  await new ModifierProfilEnfant(profils).executer({
    parent: "parent-paul",
    profil: "profil-lea",
    prenom: "Léonie",
    niveau: "CE2",
    univers: "dragons",
  });

  const profil = await profils.parId(idDeLea);
  assertEquals(profil?.prenom.valeur, "Léonie");
  assertEquals(profil?.niveau.valeur, "CE2");
  assertEquals(profil?.univers, "dragons");
});

Deno.test("changer de niveau annonce NiveauDuProfilChange", async () => {
  const profils = await profilsAvecLeaDePaul();

  const faits = await new ModifierProfilEnfant(profils).executer({
    parent: "parent-paul",
    profil: "profil-lea",
    niveau: "CE2",
  });

  assertEquals(faits.map((fait) => fait.type), ["NiveauDuProfilChange"]);
});

Deno.test("un prénom vidé est refusé et le prénom d'avant reste", async () => {
  const profils = await profilsAvecLeaDePaul();

  await assertRejects(
    () => new ModifierProfilEnfant(profils).executer({ parent: "parent-paul", profil: "profil-lea", prenom: "  " }),
    PrenomObligatoire,
  );

  assertEquals((await profils.parId(idDeLea))?.prenom.valeur, "Léa");
});

Deno.test("un niveau inconnu est refusé et le niveau d'avant reste", async () => {
  const profils = await profilsAvecLeaDePaul();

  await assertRejects(
    () => new ModifierProfilEnfant(profils).executer({ parent: "parent-paul", profil: "profil-lea", niveau: "6e" }),
    NiveauInconnu,
  );

  assertEquals((await profils.parId(idDeLea))?.niveau.valeur, "CE1");
});

Deno.test("un parent non rattaché ne modifie pas le profil enfant", async () => {
  const profils = await profilsAvecLeaDePaul();

  await assertRejects(
    () => new ModifierProfilEnfant(profils).executer({ parent: "parent-marie", profil: "profil-lea", prenom: "Zoé" }),
    ParentNonRattache,
  );

  assertEquals((await profils.parId(idDeLea))?.prenom.valeur, "Léa");
});

Deno.test("modifier un profil enfant qui n'existe pas est refusé", async () => {
  const profils = new ProfilsEnfantsEnMemoire();

  await assertRejects(
    () =>
      new ModifierProfilEnfant(profils).executer({ parent: "parent-paul", profil: "profil-fantome", prenom: "Zoé" }),
    ProfilEnfantIntrouvable,
  );
});
