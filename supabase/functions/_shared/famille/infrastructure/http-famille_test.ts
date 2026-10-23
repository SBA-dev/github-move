import { assertEquals, assertThrows } from "@std/assert";
import { NiveauInconnu } from "../../catalogue/domain/index.ts";
import { ParentNonRattache, PrenomObligatoire, ProfilEnfantIntrouvable } from "../domain/erreurs.ts";
import {
  EntreeInvalide,
  lireLeCorpsJson,
  NonAuthentifie,
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

async function avecOriginesAutorisees<T>(valeur: string | undefined, action: () => Promise<T>): Promise<T> {
  const avant = Deno.env.get("ORIGINES_AUTORISEES");
  if (valeur === undefined) Deno.env.delete("ORIGINES_AUTORISEES");
  else Deno.env.set("ORIGINES_AUTORISEES", valeur);
  try {
    return await action();
  } finally {
    if (avant === undefined) Deno.env.delete("ORIGINES_AUTORISEES");
    else Deno.env.set("ORIGINES_AUTORISEES", avant);
  }
}

function ecritureSansEffet(requete: Request): Promise<Response> {
  return traiterUneEcritureDeFamille(requete, () => Promise.resolve({}));
}

function postDepuis(origine: string): Request {
  return new Request("http://fonction.test/", { method: "POST", headers: { Origin: origine } });
}

Deno.test("une origine de la liste ORIGINES_AUTORISEES reçoit les en-têtes CORS", async () => {
  const reponse = await avecOriginesAutorisees(
    `https://autre.example, ${ORIGINE_AUTORISEE}`,
    () => ecritureSansEffet(postDepuis(ORIGINE_AUTORISEE)),
  );

  assertEquals(reponse.headers.get("Access-Control-Allow-Origin"), ORIGINE_AUTORISEE);
});

Deno.test("une origine refusée ne reçoit aucun en-tête CORS", async () => {
  const reponse = await avecOriginesAutorisees(
    ORIGINE_AUTORISEE,
    () => ecritureSansEffet(postDepuis(ORIGINE_REFUSEE)),
  );

  assertEquals(reponse.headers.get("Access-Control-Allow-Origin"), null);
  assertEquals(reponse.headers.get("Access-Control-Allow-Methods"), null);
});

Deno.test("sans liste configurée, seul le poste local de développement est autorisé", async () => {
  const locale = await avecOriginesAutorisees(undefined, () => ecritureSansEffet(postDepuis("http://localhost:5173")));
  const autre = await avecOriginesAutorisees(undefined, () => ecritureSansEffet(postDepuis(ORIGINE_REFUSEE)));

  assertEquals(locale.headers.get("Access-Control-Allow-Origin"), "http://localhost:5173");
  assertEquals(autre.headers.get("Access-Control-Allow-Origin"), null);
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
