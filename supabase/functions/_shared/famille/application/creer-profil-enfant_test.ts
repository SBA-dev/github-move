import { assertEquals, assertRejects } from "@std/assert";
import { NiveauInconnu } from "../../catalogue/domain/index.ts";
import { PrenomObligatoire, UniversInconnu } from "../domain/erreurs.ts";
import { ParentId } from "../domain/parent-id.ts";
import { ProfilEnfantId } from "../domain/profil-enfant-id.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { ProfilsEnfantsEnMemoire } from "../test_utils/profils-enfants-en-memoire.ts";
import { CreerProfilEnfant } from "./creer-profil-enfant.ts";

const paul = ParentId.de("parent-paul");
const maintenant = new Date("2026-09-01T08:00:00Z");

function creation(profils: ProfilsEnfantsEnMemoire, identifiant = "profil-lea"): CreerProfilEnfant {
  return new CreerProfilEnfant(profils, generateurIdFixe(identifiant));
}

Deno.test("un parent crée le profil enfant de Léa en CE1 dans l'univers des dragons", async () => {
  const profils = new ProfilsEnfantsEnMemoire();

  await creation(profils).executer(
    { parent: "parent-paul", prenom: "Léa", niveau: "CE1", univers: "dragons" },
    maintenant,
  );

  const profil = await profils.parId(ProfilEnfantId.de("profil-lea"));
  assertEquals(profil?.prenom.valeur, "Léa");
  assertEquals(profil?.niveau.valeur, "CE1");
  assertEquals(profil?.univers, "dragons");
  assertEquals(profil?.estRattacheA(paul), true);
});

Deno.test("sans niveau ni univers choisis, le profil enfant est en CP dans l'univers des animaux", async () => {
  const profils = new ProfilsEnfantsEnMemoire();

  await creation(profils).executer({ parent: "parent-paul", prenom: "Léa" }, maintenant);

  const profil = await profils.parId(ProfilEnfantId.de("profil-lea"));
  assertEquals(profil?.niveau.valeur, "CP");
  assertEquals(profil?.univers, "animaux");
});

Deno.test("créer un profil enfant annonce ProfilEnfantCree", async () => {
  const profils = new ProfilsEnfantsEnMemoire();

  const faits = await creation(profils).executer({ parent: "parent-paul", prenom: "Léa" }, maintenant);

  assertEquals(faits.map((fait) => fait.type), ["ProfilEnfantCree"]);
});

Deno.test("un prénom vide ne crée aucun profil enfant", async () => {
  const profils = new ProfilsEnfantsEnMemoire();

  await assertRejects(
    () => creation(profils).executer({ parent: "parent-paul", prenom: "   " }, maintenant),
    PrenomObligatoire,
  );

  assertEquals(await profils.duParent(paul), []);
});

Deno.test("un niveau inconnu ne crée aucun profil enfant", async () => {
  const profils = new ProfilsEnfantsEnMemoire();

  await assertRejects(
    () => creation(profils).executer({ parent: "parent-paul", prenom: "Léa", niveau: "6e" }, maintenant),
    NiveauInconnu,
  );

  assertEquals(await profils.duParent(paul), []);
});

Deno.test("un univers inconnu ne crée aucun profil enfant", async () => {
  const profils = new ProfilsEnfantsEnMemoire();

  await assertRejects(
    () => creation(profils).executer({ parent: "parent-paul", prenom: "Léa", univers: "espace-lointain" }, maintenant),
    UniversInconnu,
  );

  assertEquals(await profils.duParent(paul), []);
});

Deno.test("les profils enfants d'un parent sont listés dans l'ordre de création", async () => {
  const profils = new ProfilsEnfantsEnMemoire();
  await creation(profils, "profil-tom").executer(
    { parent: "parent-paul", prenom: "Tom" },
    new Date("2026-09-01T08:00:00Z"),
  );
  await creation(profils, "profil-lea").executer(
    { parent: "parent-paul", prenom: "Léa" },
    new Date("2026-09-02T08:00:00Z"),
  );

  const prenoms = (await profils.duParent(paul)).map((profil) => profil.prenom.valeur);

  assertEquals(prenoms, ["Tom", "Léa"]);
});

Deno.test("un parent ne retrouve pas les profils enfants d'un autre parent", async () => {
  const profils = new ProfilsEnfantsEnMemoire();
  await creation(profils).executer({ parent: "parent-marie", prenom: "Zoé" }, maintenant);

  assertEquals(await profils.duParent(paul), []);
});
