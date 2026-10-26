import { assertEquals, assertThrows } from "@std/assert";
import { NiveauInconnu } from "../../catalogue/domain/index.ts";
import {
  ClavierDesDicteesInconnu,
  LangueDuParentInconnue,
  ParentNonRattache,
  PrenomObligatoire,
  ProfilEnfantIntrouvable,
} from "../domain/erreurs.ts";
import {
  entetes,
  EntreeInvalide,
  lireLeCorpsJson,
  NonAuthentifie,
  originesAutorisees,
  reglagesFacultatifs,
  statutEtMessage,
  texteFacultatif,
  texteObligatoire,
  traiterUneEcritureDeFamille,
  uuidObligatoire,
} from "./http-famille.ts";

Deno.test("un parent non rattaché et un profil introuvable sont présentés pareil (404)", () => {
  assertEquals(statutEtMessage(new ParentNonRattache()), statutEtMessage(new ProfilEnfantIntrouvable()));
  assertEquals(statutEtMessage(new ParentNonRattache()).statut, 404);
});

Deno.test("une erreur de validation métier est un 400 avec son message", () => {
  assertEquals(statutEtMessage(new PrenomObligatoire()), { statut: 400, message: "Écris le prénom de l'enfant." });
  assertEquals(statutEtMessage(new NiveauInconnu("CE9")).statut, 400);
});

Deno.test("un clavier des dictées inconnu est refusé en 400 avec son message", () => {
  assertEquals(statutEtMessage(new ClavierDesDicteesInconnu("azerty")), {
    statut: 400,
    message: "Ce clavier des dictées est inconnu : « azerty ».",
  });
});

Deno.test("une langue du parent inconnue est refusée en 400 avec son message", () => {
  assertEquals(statutEtMessage(new LangueDuParentInconnue("klingon")), {
    statut: 400,
    message: "Cette langue du parent est inconnue : « klingon ».",
  });
});

Deno.test("sans connexion c'est un 401, et une panne inconnue un 500 sans détail", () => {
  assertEquals(statutEtMessage(new NonAuthentifie()).statut, 401);
  assertEquals(statutEtMessage(new Error("mot de passe de la base")).statut, 500);
  assertEquals(statutEtMessage(new Error("mot de passe de la base")).message.includes("mot de passe"), false);
});

Deno.test("le corps doit être un objet JSON", () => {
  assertEquals(lireLeCorpsJson('{"prenom":"Léa"}'), { prenom: "Léa" });
  assertThrows(() => lireLeCorpsJson("pas du json"), EntreeInvalide);
  assertThrows(() => lireLeCorpsJson("[1]"), EntreeInvalide);
});

Deno.test("un champ texte est validé en type et en taille", () => {
  assertEquals(texteFacultatif({}, "niveau"), undefined);
  assertThrows(() => texteFacultatif({ niveau: 3 }, "niveau"), EntreeInvalide);
  assertThrows(() => texteFacultatif({ prenom: "a".repeat(101) }, "prenom"), EntreeInvalide);
  assertThrows(() => texteObligatoire({}, "prenom"), EntreeInvalide);
});

const ORIGINE_AUTORISEE = "https://savanturier.example";
const ORIGINE_REFUSEE = "https://pirate.example";
const profilUuid = "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b";

function ecritureSansEffet(requete: Request): Promise<Response> {
  return traiterUneEcritureDeFamille(requete, () => Promise.resolve({}), [ORIGINE_AUTORISEE]);
}

Deno.test("une origine de la liste des origines autorisées reçoit les en-têtes CORS", () => {
  const origines = originesAutorisees(`https://autre.example, ${ORIGINE_AUTORISEE}`);

  const reponse = entetes(ORIGINE_AUTORISEE, origines);

  assertEquals(reponse.get("Access-Control-Allow-Origin"), ORIGINE_AUTORISEE);
});

Deno.test("les fonctions acceptent l'en-tête x-region du front", () => {
  const reponse = entetes(ORIGINE_AUTORISEE, originesAutorisees(ORIGINE_AUTORISEE));

  const autorises = (reponse.get("Access-Control-Allow-Headers") ?? "").split(",").map((nom) => nom.trim());
  assertEquals(autorises.includes("x-region"), true);
});

Deno.test("une origine refusée ne reçoit aucun en-tête CORS", () => {
  const reponse = entetes(ORIGINE_REFUSEE, originesAutorisees(ORIGINE_AUTORISEE));

  assertEquals(reponse.get("Access-Control-Allow-Origin"), null);
  assertEquals(reponse.get("Access-Control-Allow-Methods"), null);
});

Deno.test("une requête sans origine ne reçoit aucun en-tête CORS", () => {
  assertEquals(entetes(null, originesAutorisees(ORIGINE_AUTORISEE)).get("Access-Control-Allow-Origin"), null);
});

Deno.test("sans liste configurée, seul le poste local de développement est autorisé", () => {
  const origines = originesAutorisees(undefined);

  assertEquals(entetes("http://localhost:5173", origines).get("Access-Control-Allow-Origin"), "http://localhost:5173");
  assertEquals(entetes(ORIGINE_REFUSEE, origines).get("Access-Control-Allow-Origin"), null);
});

Deno.test("une écriture de Famille demandée en GET est refusée en 405", async () => {
  const reponse = await ecritureSansEffet(new Request("http://fonction.test/", { method: "GET" }));

  assertEquals(reponse.status, 405);
});

Deno.test("une écriture de Famille sans jeton Bearer est refusée en 401", async () => {
  const sansEntete = await ecritureSansEffet(new Request("http://fonction.test/", { method: "POST", body: "{}" }));
  const autreSchema = await ecritureSansEffet(
    new Request("http://fonction.test/", { method: "POST", body: "{}", headers: { Authorization: "Basic abc" } }),
  );

  assertEquals(sansEntete.status, 401);
  assertEquals(autreSchema.status, 401);
});
Deno.test("l'identifiant d'un profil enfant qui n'est pas un UUID est une entrée invalide (400)", () => {
  assertThrows(() => uuidObligatoire({ profil: "profil-lea" }, "profil"), EntreeInvalide);
  assertThrows(() => uuidObligatoire({ profil: "1' or '1'='1" }, "profil"), EntreeInvalide);
  assertThrows(() => uuidObligatoire({}, "profil"), EntreeInvalide);
  assertEquals(statutEtMessage(new EntreeInvalide("x")).statut, 400);
});

Deno.test("l'identifiant d'un profil enfant au format UUID est accepté", () => {
  assertEquals(uuidObligatoire({ profil: profilUuid }, "profil"), profilUuid);
});

Deno.test("sans champ « reglages », rien n'est à modifier", () => {
  assertEquals(reglagesFacultatifs({ prenom: "Léa" }), undefined);
});

Deno.test("le champ « reglages » doit être un objet", () => {
  for (const brut of ["dys", 1, true, null, ["modeDys"]]) {
    assertThrows(() => reglagesFacultatifs({ reglages: brut }), EntreeInvalide, "objet");
  }
});

Deno.test("un réglage inconnu est refusé et nommé", () => {
  assertThrows(() => reglagesFacultatifs({ reglages: { modeSombre: true } }), EntreeInvalide, "modeSombre");
});

Deno.test("un réglage vrai ou faux qui n'est pas un booléen est refusé", () => {
  for (const cle of ["modeDys", "toutLireAVoixHaute", "parcoursLibre"]) {
    assertThrows(() => reglagesFacultatifs({ reglages: { [cle]: "oui" } }), EntreeInvalide, cle);
  }
});

Deno.test("un réglage de texte qui n'est pas un texte est refusé", () => {
  for (const cle of ["clavierDesDictees", "langueDuParent"]) {
    assertThrows(() => reglagesFacultatifs({ reglages: { [cle]: 3 } }), EntreeInvalide, cle);
  }
});

Deno.test("des réglages corrects sont rendus tels quels, y compris partiels", () => {
  assertEquals(reglagesFacultatifs({ reglages: { modeDys: false, langueDuParent: "arabe" } }), {
    modeDys: false,
    langueDuParent: "arabe",
  });
  assertEquals(reglagesFacultatifs({ reglages: {} }), {});
  assertEquals(
    reglagesFacultatifs({
      reglages: {
        modeDys: true,
        toutLireAVoixHaute: true,
        parcoursLibre: true,
        clavierDesDictees: "clavierComplet",
        langueDuParent: "aucune",
      },
    }),
    {
      modeDys: true,
      toutLireAVoixHaute: true,
      parcoursLibre: true,
      clavierDesDictees: "clavierComplet",
      langueDuParent: "aucune",
    },
  );
});
