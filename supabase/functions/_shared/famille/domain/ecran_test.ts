import { assertEquals } from "@std/assert";
import { type Ecran, estUnEcranDuParent } from "./ecran.ts";

Deno.test("la connexion, le choix de qui joue, le contrôle parental et l'espace parent sont des écrans du parent", () => {
  const ecransDuParent: Ecran[] = [
    "connexion",
    "qui-joue",
    "controle-parental",
    "espace-parent",
  ];

  const reponses = ecransDuParent.map(estUnEcranDuParent);

  assertEquals(reponses, [true, true, true, true]);
});

Deno.test("la politique de confidentialité et les mentions légales sont des écrans du parent", () => {
  const pagesLegales: Ecran[] = [
    "politique-de-confidentialite",
    "mentions-legales",
  ];

  const reponses = pagesLegales.map(estUnEcranDuParent);

  assertEquals(reponses, [true, true]);
});

Deno.test("les écrans où l'enfant apprend ne sont pas des écrans du parent", () => {
  const ecransDeLEnfant: Ecran[] = [
    "accueil-de-l-enfant",
    "parcours",
    "toutes-les-lecons",
    "medailles",
    "test-de-depart",
    "page-de-la-lecon",
    "seance",
    "revision",
  ];

  const reponses = ecransDeLEnfant.map(estUnEcranDuParent);

  assertEquals(reponses, ecransDeLEnfant.map(() => false));
});
