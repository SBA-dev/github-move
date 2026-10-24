import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
  return {
    id: "fr-cp-dictee-animaux",
    matiere: "francais",
    niveau: "CP",
    titre: "J'écris les animaux",
    ordre: 10,
    programme: {
      section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
      citation: "Décoder et encoder de 25 à 30 CGP.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

const lesAnimaux = {
  type: "dictee",
  titre: "J'écris les animaux",
  mots: [{ mot: "chat", phrase: "Le chat dort sur le lit." }, { mot: "loup" }],
};

function exerciceDictee(exercice: unknown) {
  const lu = lireLecon(leconAvec(exercice)).exercices[0];
  if (lu.type !== "dictee") throw new Error("exercice « dictee » attendu");
  return lu;
}

Deno.test("une dictée donne ses mots dictés, avec leur phrase d'exemple quand il y en a une", () => {
  const exercice = exerciceDictee(lesAnimaux);

  assertEquals(exercice.mots, [{ mot: "chat", phrase: "Le chat dort sur le lit." }, {
    mot: "loup",
    phrase: undefined,
  }]);
});

Deno.test("une dictée garde la consigne de la leçon", () => {
  const exercice = exerciceDictee({ ...lesAnimaux, consigne: "Écris les mots des animaux." });

  assertEquals(exercice.consigne, "Écris les mots des animaux.");
});

Deno.test("une dictée sans consigne a la consigne par défaut", () => {
  const exercice = exerciceDictee(lesAnimaux);

  assertEquals(exercice.consigne, "Écoute bien et écris le mot que tu entends.");
});

Deno.test("un mot dicté avec espace, apostrophe ou tiret est accepté tant qu'il a une lettre à écrire", () => {
  const exercice = exerciceDictee({
    ...lesAnimaux,
    mots: [{ mot: "l'été" }, { mot: "porte-clés" }, { mot: "pomme de terre" }],
  });

  assertEquals(exercice.mots.map((mot) => mot.mot), ["l'été", "porte-clés", "pomme de terre"]);
});

Deno.test("une dictée mal formée rend la leçon mal formée", () => {
  const malFormees = [
    { ...lesAnimaux, mots: [] },
    { ...lesAnimaux, mots: undefined },
    { ...lesAnimaux, mots: [{ mot: "" }] },
    { ...lesAnimaux, mots: [{ mot: "chat" }, {}] },
    { ...lesAnimaux, mots: [{ mot: 12 }] },
    { ...lesAnimaux, mots: ["chat"] },
    { ...lesAnimaux, mots: [{ mot: "chat", phrase: 3 }] },
  ];
  for (const exercice of malFormees) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, JSON.stringify(exercice));
  }
});

Deno.test("un mot dicté sans aucune lettre à écrire rend la leçon mal formée", () => {
  const sansLettre = [" ", "'", "’", "-", ".", " ' - . "];
  for (const mot of sansLettre) {
    assertThrows(
      () => lireLecon(leconAvec({ ...lesAnimaux, mots: [{ mot }] })),
      LeconMalFormee,
      undefined,
      JSON.stringify(mot),
    );
  }
});
