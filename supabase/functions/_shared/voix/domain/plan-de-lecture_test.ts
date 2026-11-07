import { assertEquals } from "@std/assert";
import { repertoireDesSonsEnMemoire } from "../test_utils/repertoire-des-sons-en-memoire.ts";
import { CleDeLaPhrase } from "./cle-de-la-phrase.ts";
import { planDeLecture } from "./plan-de-lecture.ts";
import type { ReglageDePhrase } from "./reglage-de-phrase.ts";
import type { SonDePhrase } from "./son-de-phrase.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

const VOIX_FRANCAISE: VoixDisponible = { nom: "Voix de l'appareil", langue: "fr-FR" };
const VOIX_BRITANNIQUE: VoixDisponible = { nom: "Voix britannique", langue: "en-GB" };

function reglage(phrase: string): ReglageDePhrase {
  return { phrase, hauteur: 1, rythme: 0.9 };
}

function son(phrase: string): SonDePhrase {
  return { cle: CleDeLaPhrase.de(phrase), fichier: "empreinte-1.mp3", dureeMs: 1800 };
}

Deno.test("une phrase dont le son existe est lue avec la voix de l'application", () => {
  const bonjour = reglage("Bonjour, on commence !");
  const repertoire = repertoireDesSonsEnMemoire([son(bonjour.phrase)]);

  const plan = planDeLecture({
    phrases: [bonjour],
    langue: "fr-FR",
    repertoire,
    voixDeLAppareil: VOIX_FRANCAISE,
    voixImposee: false,
  });

  assertEquals(plan.etapes, [
    { type: "voixDeLApplication", son: son(bonjour.phrase), rythme: 0.9 },
  ]);
});

Deno.test("une phrase sans son est lue avec la voix de l'appareil quand elle est disponible", () => {
  const phrase = reglage("Observe bien la page.");

  const plan = planDeLecture({
    phrases: [phrase],
    langue: "fr-FR",
    repertoire: repertoireDesSonsEnMemoire([]),
    voixDeLAppareil: VOIX_FRANCAISE,
    voixImposee: false,
  });

  assertEquals(plan.etapes, [{ type: "voixDeLAppareil", reglage: phrase }]);
});

Deno.test("une phrase sans son et sans voix de l'appareil n'est pas lue", () => {
  const phrase = reglage("Observe bien la page.");

  const plan = planDeLecture({
    phrases: [phrase],
    langue: "fr-FR",
    repertoire: repertoireDesSonsEnMemoire([]),
    voixDeLAppareil: undefined,
    voixImposee: false,
  });

  assertEquals(plan.etapes, [{ type: "aucune", phrase: phrase.phrase }]);
});

Deno.test("chaque phrase choisit sa source, sans changer celle des suivantes", () => {
  const premiere = reglage("Bravo, tu as réussi !");
  const deuxieme = reglage("Lis maintenant le mot.");
  const troisieme = reglage("Tu peux continuer.");
  const repertoire = repertoireDesSonsEnMemoire([son(premiere.phrase), son(troisieme.phrase)]);

  const plan = planDeLecture({
    phrases: [premiere, deuxieme, troisieme],
    langue: "fr-FR",
    repertoire,
    voixDeLAppareil: VOIX_FRANCAISE,
    voixImposee: false,
  });

  assertEquals(plan.etapes, [
    { type: "voixDeLApplication", son: son(premiere.phrase), rythme: 0.9 },
    { type: "voixDeLAppareil", reglage: deuxieme },
    { type: "voixDeLApplication", son: son(troisieme.phrase), rythme: 0.9 },
  ]);
});

Deno.test("une phrase en langue étrangère ne prend jamais de son de phrase", () => {
  const mot = reglage("Cat");
  const repertoire = repertoireDesSonsEnMemoire([son(mot.phrase)]);

  const plan = planDeLecture({
    phrases: [mot],
    langue: "en-GB",
    repertoire,
    voixDeLAppareil: VOIX_BRITANNIQUE,
    voixImposee: false,
  });

  assertEquals(plan.etapes, [{ type: "voixDeLAppareil", reglage: mot }]);
});

Deno.test("avec une voix imposée par le parent, toutes les phrases vont à la voix de l'appareil", () => {
  const bonjour = reglage("Bonjour, on commence !");
  const repertoire = repertoireDesSonsEnMemoire([son(bonjour.phrase)]);

  const plan = planDeLecture({
    phrases: [bonjour],
    langue: "fr-FR",
    repertoire,
    voixDeLAppareil: VOIX_FRANCAISE,
    voixImposee: true,
  });

  assertEquals(plan.etapes, [{ type: "voixDeLAppareil", reglage: bonjour }]);
});
