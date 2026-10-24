import { assertEquals, assertThrows } from "@std/assert";
import { ChoixDeSeance } from "../domain/choix-de-seance.ts";
import { Reponse, type ReponseDonnee } from "../domain/reponse.ts";
import { revaliderLaSeance } from "../domain/revalider-la-seance.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { ecrire, leconDeDicteeDeChatEtLapin, profilDeDictee, seanceDeDictee } from "../test_utils/lecons-de-dictee.ts";
import { leconDeClasserLesSons, seanceCommencee } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { lireLaSeanceTerminee } from "./corps-de-la-seance-terminee.ts";
import { EntreeInvalide } from "./http-apprentissage.ts";

const MAINTENANT = new Date("2026-10-23T10:15:00.000Z");

function lire(corps: Record<string, unknown>) {
  return lireLaSeanceTerminee(corps, MAINTENANT);
}

const SEANCE = "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b";
const ENFANT = "9a1b2c3d-4e5f-4a6b-8c7d-0e1f2a3b4c5d";

function corpsValide(): Record<string, unknown> {
  return {
    seance: SEANCE,
    enfant: ENFANT,
    lecon: "ma-cp-calcul",
    choix: { genre: "complete" },
    tirages: [["6", "7", "8", "9"]],
    reponses: [[{ choix: "6" }, { jeNeSaisPas: true }, { choix: "7" }]],
    termineeLe: "2026-10-23T10:15:00.000Z",
  };
}

function sansLeChamp(cle: string): Record<string, unknown> {
  const corps = corpsValide();
  delete corps[cle];
  return corps;
}

Deno.test("un corps correct devient une séance terminée à enregistrer", () => {
  const envoi = lire(corpsValide());

  assertEquals(envoi, {
    seance: SEANCE,
    enfant: ENFANT,
    lecon: "ma-cp-calcul",
    choix: ChoixDeSeance.complete(),
    tirages: [["6", "7", "8", "9"]],
    reponses: [[Reponse.choix("6"), { genre: "jeNeSaisPas" }, Reponse.choix("7")]],
    termineeLe: new Date("2026-10-23T10:15:00.000Z"),
  });
});

Deno.test("le choix d'un seul exercice porte la position de l'exercice", () => {
  const envoi = lire({ ...corpsValide(), choix: { genre: "unExercice", position: 1 } });

  assertEquals(envoi.choix, ChoixDeSeance.unExercice(1));
});

Deno.test("un champ manquant est une entrée invalide", () => {
  for (const cle of ["seance", "enfant", "lecon", "choix", "tirages", "reponses", "termineeLe"]) {
    assertThrows(() => lire(sansLeChamp(cle)), EntreeInvalide, cle);
  }
});

Deno.test("l'identifiant de la séance et celui de l'enfant doivent être des UUID", () => {
  assertThrows(() => lire({ ...corpsValide(), seance: "seance-1" }), EntreeInvalide, "seance");
  assertThrows(() => lire({ ...corpsValide(), enfant: "1' or '1'='1" }), EntreeInvalide, "enfant");
});

Deno.test("un champ de mauvais type est une entrée invalide", () => {
  assertThrows(() => lire({ ...corpsValide(), lecon: 12 }), EntreeInvalide, "lecon");
  assertThrows(() => lire({ ...corpsValide(), tirages: "6,7" }), EntreeInvalide, "tirages");
  assertThrows(() => lire({ ...corpsValide(), tirages: [["6", 7]] }), EntreeInvalide, "tirages");
  assertThrows(() => lire({ ...corpsValide(), reponses: [["6"]] }), EntreeInvalide, "reponses");
});

Deno.test("un choix de séance inconnu ou une position qui n'est pas un entier positif est refusé", () => {
  for (const choix of [{ genre: "melange" }, { genre: "unExercice" }, { genre: "unExercice", position: -1 }]) {
    assertThrows(() => lire({ ...corpsValide(), choix }), EntreeInvalide, "choix");
  }
  assertThrows(
    () => lire({ ...corpsValide(), choix: { genre: "unExercice", position: 1.5 } }),
    EntreeInvalide,
    "choix",
  );
});

Deno.test("une réponse qui n'est ni un choix ni « Je ne sais pas » est refusée", () => {
  for (const reponse of [{}, { choix: "6", jeNeSaisPas: true }, { jeNeSaisPas: false }, { choix: 6 }, { autre: "6" }]) {
    assertThrows(() => lire({ ...corpsValide(), reponses: [[reponse]] }), EntreeInvalide, "reponses");
  }
});

Deno.test("une clé inconnue du corps est refusée et nommée", () => {
  assertThrows(() => lire({ ...corpsValide(), pirate: true }), EntreeInvalide, "pirate");
});

Deno.test("les étoiles ne sont jamais acceptées dans le corps : le serveur les recalcule", () => {
  assertThrows(() => lire({ ...corpsValide(), etoiles: 3 }), EntreeInvalide, "etoiles");
  assertThrows(() => lire({ ...corpsValide(), erreurs: 0 }), EntreeInvalide, "erreurs");
});

Deno.test("une date de fin qui n'est pas une date ISO valide est refusée", () => {
  for (const termineeLe of ["demain", "2026-13-45T00:00:00Z", "", 1761214500000, null]) {
    assertThrows(() => lire({ ...corpsValide(), termineeLe }), EntreeInvalide, "termineeLe");
  }
});

Deno.test("plus de 200 questions dans une séance est refusé", () => {
  const tirages = Array.from({ length: 201 }, () => ["a", "b"]);
  const reponses = Array.from({ length: 201 }, () => [{ choix: "a" }]);

  assertThrows(() => lire({ ...corpsValide(), tirages, reponses }), EntreeInvalide);
});

Deno.test("200 questions dans une séance sont acceptées", () => {
  const tirages = Array.from({ length: 200 }, () => ["a", "b"]);
  const reponses = Array.from({ length: 200 }, () => [{ choix: "a" }]);

  assertEquals(lire({ ...corpsValide(), tirages, reponses }).tirages.length, 200);
});

Deno.test("plus de 20 choix dans un tirage est refusé", () => {
  const tirage = Array.from({ length: 21 }, (_, i) => `choix ${i}`);

  assertThrows(() => lire({ ...corpsValide(), tirages: [tirage] }), EntreeInvalide, "tirages");
});

Deno.test("plus de 50 réponses à une même question est refusé", () => {
  const reponses = [Array.from({ length: 51 }, () => ({ choix: "6" }))];

  assertThrows(() => lire({ ...corpsValide(), reponses }), EntreeInvalide, "reponses");
});

Deno.test("un texte de plus de 200 caractères, dans un tirage ou une réponse, est refusé", () => {
  const long = "a".repeat(201);

  assertThrows(() => lire({ ...corpsValide(), tirages: [[long]] }), EntreeInvalide, "tirages");
  assertThrows(
    () => lire({ ...corpsValide(), reponses: [[{ choix: long }]] }),
    EntreeInvalide,
    "reponses",
  );
});

Deno.test("une date de fin dans le futur, au-delà de 5 minutes de tolérance, est refusée", () => {
  const termineeLe = "2026-10-23T10:20:01.000Z";

  assertThrows(() => lire({ ...corpsValide(), termineeLe }), EntreeInvalide, "termineeLe");
});

Deno.test("une date de fin légèrement en avance, dans les 5 minutes de tolérance, est acceptée", () => {
  const termineeLe = "2026-10-23T10:19:59.000Z";

  assertEquals(lire({ ...corpsValide(), termineeLe }).termineeLe, new Date(termineeLe));
});

Deno.test("un placement dans un groupe est lu comme le placement d'une étiquette dans ce groupe", () => {
  const reponses = [[{ placement: { etiquette: "loup", groupe: "g-ou" } }]];

  assertEquals(lire({ ...corpsValide(), reponses }).reponses, [[Reponse.placement("loup", "g-ou")]]);
});

Deno.test("un placement sans groupe, dans un ordre, est lu comme le placement d'une étiquette seule", () => {
  const reponses = [[{ placement: { etiquette: "mi" } }]];

  assertEquals(lire({ ...corpsValide(), reponses }).reponses, [[Reponse.placement("mi")]]);
});

Deno.test("un placement mal formé est refusé comme toute réponse invalide", () => {
  const malFormes = [
    { placement: {} },
    { placement: { groupe: "g-ou" } },
    { placement: { etiquette: 6 } },
    { placement: { etiquette: "a".repeat(201) } },
    { placement: { etiquette: "loup", groupe: 3 } },
    { placement: { etiquette: "loup", groupe: "a".repeat(201) } },
    { placement: "loup" },
    { placement: { etiquette: "loup" }, choix: "loup" },
  ];
  for (const reponse of malFormes) {
    assertThrows(() => lire({ ...corpsValide(), reponses: [[reponse]] }), EntreeInvalide, "reponses");
  }
});

function enReponseEnvoyee(reponse: ReponseDonnee): Record<string, unknown> {
  if (reponse.genre === "choix") return { choix: reponse.texte };
  if (reponse.genre === "jeNeSaisPas") return { jeNeSaisPas: true };
  if (reponse.genre === "motEcrit") return { motEcrit: reponse.lettres };
  return {
    placement: reponse.groupe === undefined
      ? { etiquette: reponse.etiquette }
      : { etiquette: reponse.etiquette, groupe: reponse.groupe },
  };
}

Deno.test("le corps d'une séance de classer est lu puis revalidé sans incohérence", () => {
  const seance = seanceCommencee(leconDeClasserLesSons(), hasardFixe(0, 0));
  seance.repondre(Reponse.placement("savon", "g-on"));
  seance.repondre(Reponse.placement("loup", "g-on"));
  seance.repondre(Reponse.placement("loup", "g-ou"));
  seance.repondre(Reponse.placement("pont", "g-on"));
  const fait = seance.terminer(MAINTENANT);
  const envoi = seance.aEnregistrer();
  const corps = {
    ...envoi,
    seance: SEANCE,
    enfant: ENFANT,
    termineeLe: MAINTENANT.toISOString(),
    reponses: envoi.reponses.map((question) => question.map(enReponseEnvoyee)),
  };

  const revalidee = revaliderLaSeance(leconDeClasserLesSons(), lire(corps));

  assertEquals([revalidee.etoiles, revalidee.erreurs], [fait.etoiles, fait.erreurs]);
});

Deno.test("les lettres d'un mot écrit sont lues comme le mot écrit par l'enfant", () => {
  const reponses = [[{ motEcrit: ["c", "h", "a", "t"] }]];

  assertEquals(lire({ ...corpsValide(), reponses }).reponses, [[Reponse.motEcrit(["c", "h", "a", "t"])]]);
});

Deno.test("la lettre « œ » est une lettre du mot écrit", () => {
  const reponses = [[{ motEcrit: ["c", "œ", "u", "r"] }]];

  assertEquals(lire({ ...corpsValide(), reponses }).reponses, [[Reponse.motEcrit(["c", "œ", "u", "r"])]]);
});

Deno.test("un mot écrit mal formé est refusé comme toute réponse invalide", () => {
  const malFormes = [
    { motEcrit: "chat" },
    { motEcrit: { 0: "c" } },
    { motEcrit: ["c", 7, "a", "t"] },
    { motEcrit: ["c", "h", null, "t"] },
    { motEcrit: ["c", "ha", "t"] },
    { motEcrit: ["c", "", "a", "t"] },
    { motEcrit: [] },
    { motEcrit: Array.from({ length: 51 }, () => "a") },
    { motEcrit: ["c", "h", "a", "t"], choix: "chat" },
  ];
  for (const reponse of malFormes) {
    assertThrows(() => lire({ ...corpsValide(), reponses: [[reponse]] }), EntreeInvalide, "reponses");
  }
});

Deno.test("un mot écrit de 50 lettres est accepté", () => {
  const reponses = [[{ motEcrit: Array.from({ length: 50 }, () => "a") }]];

  assertEquals(lire({ ...corpsValide(), reponses }).reponses[0]?.length, 1);
});

Deno.test("le corps d'une séance de dictée est lu puis revalidé sans incohérence", () => {
  const profil = profilDeDictee("lettresDuMot", "CP");
  const seance = seanceDeDictee(leconDeDicteeDeChatEtLapin(), profil);
  ecrire(seance, "chat");
  ecrire(seance, "lapin");
  const fait = seance.terminer(MAINTENANT);
  const envoi = seance.aEnregistrer();
  const corps = {
    ...envoi,
    seance: SEANCE,
    enfant: ENFANT,
    termineeLe: MAINTENANT.toISOString(),
    reponses: envoi.reponses.map((question) => question.map(enReponseEnvoyee)),
  };

  const revalidee = revaliderLaSeance(leconDeDicteeDeChatEtLapin(), lire(corps), profil);

  assertEquals([revalidee.etoiles, revalidee.erreurs], [fait.etoiles, fait.erreurs]);
});
