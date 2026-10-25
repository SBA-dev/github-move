import { assertEquals } from "@std/assert";
import { LeconsDuCatalogueEtPersonnelles } from "./lecons-du-catalogue-et-personnelles.ts";
import { LeconsDuCatalogueEnMemoire } from "../test_utils/lecons-du-catalogue-en-memoire.ts";
import { LeconsPersonnellesEnMemoire } from "../test_utils/lecons-personnelles-en-memoire.ts";
import { leconDeCalcul, leconDeLecture } from "../test_utils/lecons-de-test.ts";

const profil = "profil-lea";
const autreProfil = "profil-tom";
const leconPersonnelle = { ...leconDeLecture(), id: "perso-1" };

function composite(personnelles: LeconsPersonnellesEnMemoire) {
  return new LeconsDuCatalogueEtPersonnelles(
    new LeconsDuCatalogueEnMemoire(leconDeCalcul()),
    personnelles,
    profil,
  );
}

Deno.test("une leçon de la bibliothèque est lue dans le catalogue sans interroger les leçons personnelles", async () => {
  const personnelles = new LeconsPersonnellesEnMemoire();

  const lecon = await composite(personnelles).parId("ma-cp-calcul");

  assertEquals(lecon, leconDeCalcul());
  assertEquals(personnelles.identifiantsInterroges, []);
});

Deno.test("une leçon personnelle du profil est retrouvée par son identifiant", async () => {
  const personnelles = new LeconsPersonnellesEnMemoire().ajouter(profil, leconPersonnelle);

  assertEquals(await composite(personnelles).parId("perso-1"), leconPersonnelle);
});

Deno.test("la leçon personnelle d'un autre profil reste introuvable", async () => {
  const personnelles = new LeconsPersonnellesEnMemoire().ajouter(autreProfil, leconPersonnelle);

  assertEquals(await composite(personnelles).parId("perso-1"), null);
});

Deno.test("un identifiant inconnu ne donne aucune leçon", async () => {
  const personnelles = new LeconsPersonnellesEnMemoire().ajouter(profil, leconPersonnelle);

  assertEquals(await composite(personnelles).parId("inconnue"), null);
});

Deno.test("les leçons personnelles n'entrent pas dans l'ensemble des leçons du catalogue", async () => {
  const personnelles = new LeconsPersonnellesEnMemoire().ajouter(profil, leconPersonnelle);

  assertEquals(await composite(personnelles).toutes(), [leconDeCalcul()]);
});
