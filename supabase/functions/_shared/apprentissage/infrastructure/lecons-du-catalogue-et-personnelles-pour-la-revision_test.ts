import { assertEquals } from "@std/assert";
import { LeconsDuCatalogueEtPersonnellesPourLaRevision } from "./lecons-du-catalogue-et-personnelles-pour-la-revision.ts";
import { LeconsDuCatalogueEnMemoire } from "../test_utils/lecons-du-catalogue-en-memoire.ts";
import { LeconsPersonnellesDuProfilEnMemoire } from "../test_utils/lecons-personnelles-en-memoire.ts";
import { leconDeCalcul, leconDeLecture } from "../test_utils/lecons-de-test.ts";

const profil = "profil-lea";
const autreProfil = "profil-tom";
const leconPersonnelle = { ...leconDeLecture(), id: "perso-1" };
const leconPersonnelleDUnAutre = { ...leconDeLecture(), id: "perso-2" };

function pourLaRevision(personnelles: LeconsPersonnellesDuProfilEnMemoire) {
  return new LeconsDuCatalogueEtPersonnellesPourLaRevision(
    new LeconsDuCatalogueEnMemoire(leconDeCalcul()),
    personnelles,
    profil,
  );
}

Deno.test("pour la révision, l'ensemble des leçons est le catalogue plus les leçons personnelles du profil seulement", async () => {
  const personnelles = new LeconsPersonnellesDuProfilEnMemoire()
    .ajouter(profil, leconPersonnelle)
    .ajouter(autreProfil, leconPersonnelleDUnAutre);

  assertEquals(await pourLaRevision(personnelles).toutes(), [leconDeCalcul(), leconPersonnelle]);
});

Deno.test("pour la révision, une leçon personnelle du profil est retrouvée par son identifiant", async () => {
  const personnelles = new LeconsPersonnellesDuProfilEnMemoire().ajouter(profil, leconPersonnelle);

  assertEquals(await pourLaRevision(personnelles).parId("perso-1"), leconPersonnelle);
});

Deno.test("pour la révision, la leçon personnelle d'un autre profil reste introuvable", async () => {
  const personnelles = new LeconsPersonnellesDuProfilEnMemoire().ajouter(autreProfil, leconPersonnelleDUnAutre);

  assertEquals(await pourLaRevision(personnelles).parId("perso-2"), null);
});

Deno.test("pour la révision, une leçon de la bibliothèque est lue sans interroger les leçons personnelles", async () => {
  const personnelles = new LeconsPersonnellesDuProfilEnMemoire();

  assertEquals(await pourLaRevision(personnelles).parId("ma-cp-calcul"), leconDeCalcul());
  assertEquals(personnelles.identifiantsInterroges, []);
});
