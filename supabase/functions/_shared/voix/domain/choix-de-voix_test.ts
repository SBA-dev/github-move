import { assertEquals, assertStrictEquals } from "@std/assert";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import {
  CARACTERE_LANGUE_ETRANGERE,
  choisirVoix,
  choisirVoixDeLangue,
  ChoixDeVoix,
  voixMontreeCommeChoisie,
} from "./choix-de-voix.ts";
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

const googleUk: VoixDisponible = { nom: "Google UK English Female", langue: "en-GB" };
const daniel: VoixDisponible = { nom: "Daniel", langue: "en-GB" };
const samantha: VoixDisponible = { nom: "Samantha", langue: "en-US" };

Deno.test("pour l'anglais en-GB, la voix au nom naturel l'emporte sur une voix ordinaire de la même langue", () => {
  assertEquals(choisirVoixDeLangue([daniel, googleUk], "en-GB"), googleUk);
});

Deno.test("pour l'anglais en-GB, la voix de la langue exacte l'emporte sur une autre variante", () => {
  assertEquals(choisirVoixDeLangue([samantha, daniel], "en-GB"), daniel);
});

Deno.test("une voix d'une autre variante de la langue est choisie à défaut de la langue exacte", () => {
  assertEquals(choisirVoixDeLangue([samantha], "en-GB"), samantha);
});

Deno.test("la langue de la voix est reconnue sans tenir compte de la casse", () => {
  assertEquals(choisirVoixDeLangue([{ nom: "Daniel", langue: "EN-gb" }], "en-GB")?.nom, "Daniel");
});

Deno.test("sans voix dans la langue demandée, aucune voix n'est choisie", () => {
  assertStrictEquals(choisirVoixDeLangue([denise, thomas], "en-GB"), undefined);
});

Deno.test("une langue étrangère se lit toujours avec une voix féminine, un peu plus aiguë et plus lente", () => {
  assertEquals(CARACTERE_LANGUE_ETRANGERE, { sexe: "feminine", hauteur: 1.05, rythme: 0.95 });
});

Deno.test("la voix imposée présente sur l'appareil passe avant la voix automatique", () => {
  assertEquals(choisirVoix([denise, thomas], noisette, ChoixDeVoix.imposee("Thomas")), thomas);
});

Deno.test("une voix imposée absente de l'appareil laisse la voix automatique", () => {
  assertEquals(choisirVoix([denise, thomas], noisette, ChoixDeVoix.imposee("Paul")), denise);
});

Deno.test("la voix imposée est reconnue par son nom exact seulement", () => {
  assertEquals(choisirVoix([denise, thomas], noisette, ChoixDeVoix.imposee("thomas")), denise);
});

Deno.test("la voix automatique est choisie quand le choix est automatique", () => {
  assertEquals(choisirVoix([denise, thomas], noisette, ChoixDeVoix.automatique), denise);
});

Deno.test("sans choix, la voix automatique s'applique comme avant", () => {
  assertEquals(choisirVoix([henri, denise], noisette), denise);
});

Deno.test("un nom de voix vide vaut la voix automatique", () => {
  assertEquals(ChoixDeVoix.imposee(""), ChoixDeVoix.automatique);
});

Deno.test("l'onglet Voix montre la voix imposée comme choisie quand elle est présente", () => {
  assertEquals(voixMontreeCommeChoisie([denise, thomas], ChoixDeVoix.imposee("Thomas")), thomas);
});

Deno.test("l'onglet Voix montre « automatique » quand la voix imposée a disparu", () => {
  assertEquals(voixMontreeCommeChoisie([denise], ChoixDeVoix.imposee("Thomas")), "automatique");
});
