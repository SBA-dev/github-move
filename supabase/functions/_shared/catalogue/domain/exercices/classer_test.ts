import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
  return {
    id: "fr-cp-sons-ou-on-an",
    matiere: "francais",
    niveau: "CP",
    titre: "Les sons ou, on, an",
    ordre: 5,
    programme: {
      section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
      citation: "Décoder et encoder de 25 à 30 CGP.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

const lesMaisonsDesSons = {
  type: "classer",
  titre: "Les maisons des sons",
  consigne: "Range chaque mot dans la maison de son son.",
  groupes: [{ id: "1", nom: "ou" }, { id: "2", nom: "on" }, { id: "3", nom: "an" }],
  items: [
    { texte: "loup", groupe: "1" },
    { texte: "pont", groupe: "2" },
    { texte: "banc", groupe: "3" },
  ],
};

function exerciceClasser(exercice: unknown) {
  const lu = lireLecon(leconAvec(exercice)).exercices[0];
  if (lu.type !== "classer") throw new Error("exercice « classer » attendu");
  return lu;
}

Deno.test("un exercice « classer » donne ses groupes et ses étiquettes avec leur groupe", () => {
  const exercice = exerciceClasser(lesMaisonsDesSons);

  assertEquals(exercice.consigne, "Range chaque mot dans la maison de son son.");
  assertEquals(exercice.groupes, [{ id: "1", nom: "ou" }, { id: "2", nom: "on" }, { id: "3", nom: "an" }]);
  assertEquals(exercice.items[1], { texte: "pont", groupe: "2", aide: undefined });
});

Deno.test("l'aide d'une étiquette à classer est gardée", () => {
  const exercice = exerciceClasser({
    ...lesMaisonsDesSons,
    items: [{ texte: "baleine", groupe: "1", aide: "La baleine vit dans l'eau." }, { texte: "pont", groupe: "2" }],
  });

  assertEquals(exercice.items[0].aide, "La baleine vit dans l'eau.");
});

Deno.test("un exercice « classer » sans consigne a la consigne par défaut", () => {
  const { consigne: _consigne, ...sansConsigne } = lesMaisonsDesSons;

  assertEquals(exerciceClasser(sansConsigne).consigne, "Range chaque étiquette dans la bonne maison.");
});

Deno.test("un exercice « classer » mal formé rend la leçon mal formée", () => {
  const malFormes = [
    { ...lesMaisonsDesSons, groupes: [{ id: "1", nom: "ou" }] },
    { ...lesMaisonsDesSons, groupes: [{ id: "1", nom: "ou" }, { id: "1", nom: "on" }] },
    { ...lesMaisonsDesSons, items: [{ texte: "", groupe: "1" }] },
    { ...lesMaisonsDesSons, items: [{ texte: "loup", groupe: "9" }] },
    { ...lesMaisonsDesSons, items: [{ texte: "loup" }] },
    { ...lesMaisonsDesSons, items: [{ texte: "loup", groupe: "1", aide: 3 }] },
    { ...lesMaisonsDesSons, items: [] },
  ];
  for (const exercice of malFormes) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, JSON.stringify(exercice));
  }
});
