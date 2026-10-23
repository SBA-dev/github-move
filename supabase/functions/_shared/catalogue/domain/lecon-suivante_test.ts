import { assertEquals } from "@std/assert";
import { leconSuivante } from "./lecon-suivante.ts";
import { lireLecon } from "./lire-lecon.ts";
import type { Lecon } from "./lecon.ts";

function lecon(id: string, matiere: string, niveau: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere,
    niveau,
    titre: id,
    ordre,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

const sonsOuOnAn = lecon("fr-cp-sons-ou-on-an", "francais", "CP", 5);
const syllabes = lecon("fr-cp-syllabes", "francais", "CP", 8);
const dicteeAnimaux = lecon("fr-cp-dictee-animaux", "francais", "CP", 10);
const animaux = lecon("an-cp-animaux", "anglais", "CP", 40);
const couleurs = lecon("an-cp-couleurs", "anglais", "CP", 20);
const autreMatiere = lecon("ma-cp-boite-ajouter", "maths", "CP", 6);
const autreNiveau = lecon("fr-ce1-autre", "francais", "CE1", 6);

Deno.test("la leçon suivante est celle d'ordre immédiatement supérieur, de la même matière et du même niveau", () => {
  const lecons = [dicteeAnimaux, autreNiveau, autreMatiere, syllabes, sonsOuOnAn];

  assertEquals(leconSuivante(lecons, sonsOuOnAn)?.id, "fr-cp-syllabes");
});

Deno.test("il n'y a pas de leçon suivante après la dernière leçon d'une matière", () => {
  const lecons = [couleurs, animaux, autreMatiere, autreNiveau];

  assertEquals(leconSuivante(lecons, animaux), undefined);
});
