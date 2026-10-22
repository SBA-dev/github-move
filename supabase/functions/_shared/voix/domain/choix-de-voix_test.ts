import { assertEquals, assertStrictEquals } from "@std/assert";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import { choisirVoix } from "./choix-de-voix.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

const noisette: CaractereDeLaVoix = {
  sexe: "feminine",
  hauteur: 1.1,
  rythme: 1,
};
const capitaineSam: CaractereDeLaVoix = {
  sexe: "masculine",
  hauteur: 0.8,
  rythme: 1,
};

const denise: VoixDisponible = {
  nom: "Microsoft Denise Online (Natural)",
  langue: "fr-FR",
};
const henri: VoixDisponible = {
  nom: "Microsoft Henri Online (Natural)",
  langue: "fr-FR",
};
const thomas: VoixDisponible = { nom: "Thomas", langue: "fr-FR" };

Deno.test("un personnage guide à voix féminine a la voix féminine à égalité de score", () => {
  assertEquals(choisirVoix([henri, denise], noisette), denise);
});

Deno.test("un personnage guide à voix masculine a la voix masculine à égalité de score", () => {
  assertEquals(choisirVoix([denise, henri], capitaineSam), henri);
});

Deno.test("une voix du bon sexe trop loin de la meilleure est écartée au profit de la meilleure", () => {
  assertEquals(choisirVoix([denise, thomas], capitaineSam), denise);
});

Deno.test("sans voix française, aucune voix n'est choisie", () => {
  assertStrictEquals(choisirVoix([], capitaineSam), undefined);
});
