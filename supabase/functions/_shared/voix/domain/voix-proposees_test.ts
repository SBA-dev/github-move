import { assertEquals } from "@std/assert";
import { voixProposees } from "./voix-proposees.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

const denise: VoixDisponible = { nom: "Microsoft Denise Online (Natural)", langue: "fr-FR" };
const thomas: VoixDisponible = { nom: "Thomas", langue: "fr-FR" };
const amelie: VoixDisponible = { nom: "Amélie (compact)", langue: "fr-FR" };
const daniel: VoixDisponible = { nom: "Daniel", langue: "en-GB" };

const AUTOMATIQUE = "Automatique (recommandé)";

Deno.test("la voix automatique est proposée en premier, avec la meilleure voix française actuelle", () => {
  const [premiere] = voixProposees([thomas, denise]);

  assertEquals(premiere, {
    nom: AUTOMATIQUE,
    nomDeLaVoix: "",
    mention: `actuellement : ${denise.nom}`,
  });
});

Deno.test("une voix française très naturelle est proposée avec la mention « très naturelle »", () => {
  const proposees = voixProposees([thomas, denise]);

  assertEquals(proposees[1], { nom: denise.nom, nomDeLaVoix: denise.nom, mention: "très naturelle" });
});

Deno.test("la meilleure voix, quand elle n'est pas très naturelle, est proposée avec la mention « la meilleure ici »", () => {
  const proposees = voixProposees([amelie, thomas]);

  assertEquals(proposees[1], { nom: thomas.nom, nomDeLaVoix: thomas.nom, mention: "la meilleure ici" });
});

Deno.test("une voix qui n'est ni très naturelle ni la meilleure est proposée sans mention", () => {
  const proposees = voixProposees([amelie, thomas]);

  assertEquals(proposees[2], { nom: amelie.nom, nomDeLaVoix: amelie.nom, mention: undefined });
});

Deno.test("seules les voix françaises sont proposées, après la voix automatique", () => {
  const proposees = voixProposees([daniel, amelie, thomas]);

  assertEquals(proposees.map((p) => p.nomDeLaVoix), ["", thomas.nom, amelie.nom]);
});

Deno.test("sans voix française, seule la voix automatique est proposée, sans mention", () => {
  assertEquals(voixProposees([daniel]), [{ nom: AUTOMATIQUE, nomDeLaVoix: "", mention: undefined }]);
});
