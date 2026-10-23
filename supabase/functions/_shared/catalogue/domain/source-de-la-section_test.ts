import { assertEquals } from "@std/assert";
import { sourceDeLaSection } from "./source-de-la-section.ts";

const identifierLesMots = {
  id: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
  matiere: "francais",
  niveaux: ["CP"],
  domaine: "Lecture",
  section: "Identifier les mots de manière de plus en plus aisée",
  ordre: 0,
  source: {
    texte: "Programme de français du cycle 2",
    bo: "BO n° 41 du 31 octobre 2024",
    fichier: "sources/pdf/c2-francais.pdf",
  },
  extrait: "Objectifs d’apprentissage",
};

const lireAVoixHaute = {
  ...identifierLesMots,
  id: "c2-francais-cp-lire-a-voix-haute",
  section: "Lire à voix haute",
  ordre: 1,
};

Deno.test("la source de la section donne le texte du programme, son BO, le domaine et la section", () => {
  const source = sourceDeLaSection([lireAVoixHaute, identifierLesMots], identifierLesMots.id);

  assertEquals(
    source,
    "Programme de français du cycle 2, BO n° 41 du 31 octobre 2024 — Lecture › Identifier les mots de manière de plus en plus aisée",
  );
});

Deno.test("une section absente de l'index des programmes n'a pas de source", () => {
  const source = sourceDeLaSection([identifierLesMots], "c2-francais-cp-section-inconnue");

  assertEquals(source, undefined);
});

Deno.test("les entrées mal formées de l'index des programmes sont ignorées", () => {
  const sansSource = { id: lireAVoixHaute.id, domaine: "Lecture", section: "Lire à voix haute" };
  const index = [null, "texte", sansSource, { ...lireAVoixHaute, source: { texte: 41 } }, lireAVoixHaute];

  const source = sourceDeLaSection(index, lireAVoixHaute.id);

  assertEquals(source, "Programme de français du cycle 2, BO n° 41 du 31 octobre 2024 — Lecture › Lire à voix haute");
});

Deno.test("un index des programmes qui n'est pas une liste ne donne aucune source", () => {
  const source = sourceDeLaSection({ sections: [identifierLesMots] }, identifierLesMots.id);

  assertEquals(source, undefined);
});
