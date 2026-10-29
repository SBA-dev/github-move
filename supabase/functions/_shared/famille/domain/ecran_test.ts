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

Deno.test("la séance de défi et sa fin sont un écran de l'enfant, pas du parent", () => {
  const ecran: Ecran = "defi";

  const estDuParent = estUnEcranDuParent(ecran);

  assertEquals(estDuParent, false);
});
