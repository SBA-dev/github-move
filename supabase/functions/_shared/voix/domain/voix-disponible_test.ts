import { assertEquals } from "@std/assert";
import {
  scoreDeLaVoix,
  type VoixDisponible,
  voixFrancaisesTriees,
} from "./voix-disponible.ts";

const denise: VoixDisponible = {
  nom: "Microsoft Denise Online (Natural)",
  langue: "fr-FR",
};
const thomas: VoixDisponible = { nom: "Thomas", langue: "fr-FR" };
const amelie: VoixDisponible = { nom: "Amélie", langue: "fr-CA" };
const espeak: VoixDisponible = { nom: "eSpeak French", langue: "fr-FR" };
const samantha: VoixDisponible = { nom: "Samantha", langue: "en-US" };

Deno.test("une voix fr-FR au nom « Online (Natural) » vaut 70 points", () => {
  assertEquals(scoreDeLaVoix(denise), 70);
});

Deno.test("une voix fr-FR au nom ordinaire vaut 30 points", () => {
  assertEquals(scoreDeLaVoix(thomas), 30);
});

Deno.test("une voix française d'une autre région vaut 20 points", () => {
  assertEquals(scoreDeLaVoix(amelie), 20);
});

Deno.test("la langue fr_FR avec un tiret bas est reconnue sans tenir compte de la casse", () => {
  assertEquals(scoreDeLaVoix({ nom: "Thomas", langue: "FR_fr" }), 30);
});

Deno.test("une voix compacte, eSpeak ou robot perd 30 points", () => {
  assertEquals(scoreDeLaVoix(espeak), 0);
});

Deno.test("les voix non françaises sont exclues", () => {
  assertEquals(voixFrancaisesTriees([samantha]), []);
});

Deno.test("une voix française de score 0 est gardée", () => {
  assertEquals(voixFrancaisesTriees([espeak]), [espeak]);
});

Deno.test("les voix françaises sont triées par score décroissant", () => {
  assertEquals(
    voixFrancaisesTriees([espeak, samantha, amelie, thomas, denise]),
    [denise, thomas, amelie, espeak],
  );
});
