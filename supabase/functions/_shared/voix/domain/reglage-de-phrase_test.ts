import { assertAlmostEquals, assertEquals } from "@std/assert";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import { reglerPhrases } from "./reglage-de-phrase.ts";
import { texteALire } from "./texte-a-lire.ts";
import type { VoixDisponible } from "./voix-disponible.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

const capitaineSam: CaractereDeLaVoix = { sexe: "masculine", hauteur: 0.95, rythme: 1 };
const noisette: CaractereDeLaVoix = { sexe: "feminine", hauteur: 1.45, rythme: 1.08 };
const denise: VoixDisponible = { nom: "Microsoft Denise Online (Natural)", langue: "fr-FR" };
const henri: VoixDisponible = { nom: "Microsoft Henri Online (Natural)", langue: "fr-FR" };
const sansVariation = hasardFixe(0.5);

function texte(brut: string) {
  const lu = texteALire(brut);
  if (!lu) throw new Error("texte de test vide");
  return lu;
}

Deno.test("un personnage guide masculin lu par une voix non masculine est abaissé de 0,25", () => {
  const [phrase] = reglerPhrases(texte("Salut."), capitaineSam, denise, 1, sansVariation);
  assertAlmostEquals(phrase.hauteur, 0.7);
});

Deno.test("un personnage guide masculin lu par une voix masculine garde sa hauteur", () => {
  const [phrase] = reglerPhrases(texte("Salut."), capitaineSam, henri, 1, sansVariation);
  assertAlmostEquals(phrase.hauteur, 0.95);
});

Deno.test("sans voix choisie, la hauteur d'un personnage guide masculin n'est pas abaissée", () => {
  const [phrase] = reglerPhrases(texte("Salut."), capitaineSam, undefined, 1, sansVariation);
  assertAlmostEquals(phrase.hauteur, 0.95);
});

Deno.test("une phrase qui finit par « ! » est plus aiguë de 0,08", () => {
  const [phrase] = reglerPhrases(texte("Bravo !"), noisette, denise, 1, sansVariation);
  assertAlmostEquals(phrase.hauteur, 1.53);
});

Deno.test("le rythme est celui du caractère multiplié par le rythme demandé", () => {
  const [phrase] = reglerPhrases(texte("Salut."), noisette, denise, 1.1, sansVariation);
  assertAlmostEquals(phrase.rythme, 1.188);
});

Deno.test("le rythme ne dépasse pas 1,4", () => {
  const [phrase] = reglerPhrases(texte("Salut."), noisette, denise, 1.5, sansVariation);
  assertAlmostEquals(phrase.rythme, 1.4);
});

Deno.test("le plus petit tirage baisse la hauteur de 0,03", () => {
  const [phrase] = reglerPhrases(texte("Salut."), noisette, denise, 1, hasardFixe(0));
  assertAlmostEquals(phrase.hauteur, 1.42);
});

Deno.test("le plus grand tirage monte la hauteur d'environ 0,03", () => {
  const [phrase] = reglerPhrases(texte("Salut."), noisette, denise, 1, hasardFixe(1 - Number.EPSILON));
  assertAlmostEquals(phrase.hauteur, 1.48);
});

Deno.test("la hauteur d'une phrase ne descend pas sous 0,5", () => {
  const grave: CaractereDeLaVoix = { sexe: "feminine", hauteur: 0.3, rythme: 1 };
  const [phrase] = reglerPhrases(texte("Salut."), grave, denise, 1, sansVariation);
  assertAlmostEquals(phrase.hauteur, 0.5);
});

Deno.test("la hauteur d'une phrase ne dépasse pas 2", () => {
  const aigu: CaractereDeLaVoix = { sexe: "feminine", hauteur: 2.5, rythme: 1 };
  const [phrase] = reglerPhrases(texte("Salut."), aigu, denise, 1, sansVariation);
  assertAlmostEquals(phrase.hauteur, 2);
});

Deno.test("chaque phrase du texte reçoit son propre réglage", () => {
  const reglages = reglerPhrases(texte("Bravo ! Encore une."), noisette, denise, 1, sansVariation);
  assertEquals(reglages.map((r) => r.phrase), ["Bravo !", "Encore une."]);
});
