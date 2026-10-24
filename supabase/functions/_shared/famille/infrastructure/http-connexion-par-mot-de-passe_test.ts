import { assertEquals } from "@std/assert";
import {
  AdresseDejaUtilisee,
  AdresseEmailInvalide,
  InformationsDeReinitialisationIncorrectes,
  MotDePasseNonConforme,
  MotDePasseTropLong,
  PrenomObligatoire,
  TropDEssaisDeReinitialisation,
} from "../domain/erreurs.ts";
import { ReglesDuMotDePasse } from "../domain/regles-du-mot-de-passe.ts";
import {
  adresseObligatoire,
  motDePasseObligatoire,
  statutEtMessageSansConnexion,
  traiterUneDemandeSansConnexion,
} from "./http-connexion-par-mot-de-passe.ts";
import { EntreeInvalide } from "./http-famille.ts";

const origines = ["http://localhost:5173"];

function post(corps: string): Request {
  return new Request("http://localhost/f", { method: "POST", body: corps });
}

function reglesManquantes() {
  return ReglesDuMotDePasse.verifier("a").filter((regle) => !regle.respectee);
}

const correspondances: [string, Error, number][] = [
  ["une adresse déjà utilisée", new AdresseDejaUtilisee(), 409],
  ["des informations de réinitialisation incorrectes", new InformationsDeReinitialisationIncorrectes(), 401],
  ["trop d'essais de réinitialisation", new TropDEssaisDeReinitialisation(), 429],
  ["une adresse invalide", new AdresseEmailInvalide(), 422],
  ["un prénom obligatoire", new PrenomObligatoire(), 422],
  ["un mot de passe non conforme", new MotDePasseNonConforme(reglesManquantes()), 422],
  ["un mot de passe trop long", new MotDePasseTropLong(64), 422],
  ["une entrée invalide", new EntreeInvalide("x"), 422],
  ["une erreur inattendue", new Error("boom"), 500],
];

for (const [nom, erreur, statut] of correspondances) {
  Deno.test(`${nom} répond ${statut} sans connexion`, () => {
    assertEquals(statutEtMessageSansConnexion(erreur).statut, statut);
  });
}

Deno.test("une erreur inattendue ne révèle pas son message", () => {
  assertEquals(
    statutEtMessageSansConnexion(new Error("secret interne")).message,
    "La demande n'a pas pu être traitée.",
  );
});

Deno.test("une méthode autre que POST est refusée avec 405", async () => {
  const reponse = await traiterUneDemandeSansConnexion(
    new Request("http://localhost/f", { method: "GET" }),
    () => Promise.resolve(),
    origines,
  );

  assertEquals(reponse.status, 405);
});

Deno.test("la requête OPTIONS répond 204 sans corps", async () => {
  const reponse = await traiterUneDemandeSansConnexion(
    new Request("http://localhost/f", { method: "OPTIONS" }),
    () => Promise.resolve(),
    origines,
  );

  assertEquals(reponse.status, 204);
  assertEquals(await reponse.text(), "");
});

Deno.test("un corps qui n'est pas du JSON répond 422", async () => {
  const reponse = await traiterUneDemandeSansConnexion(post("pas du json"), () => Promise.resolve(), origines);

  assertEquals(reponse.status, 422);
});

Deno.test("une demande aboutie répond 200", async () => {
  const reponse = await traiterUneDemandeSansConnexion(post('{"adresse":"a@b.fr"}'), () => Promise.resolve(), origines);

  assertEquals(reponse.status, 200);
});

Deno.test("un champ absent répond 422", async () => {
  const reponse = await traiterUneDemandeSansConnexion(
    post("{}"),
    (corps) => {
      adresseObligatoire(corps);
      return Promise.resolve();
    },
    origines,
  );

  assertEquals(reponse.status, 422);
});

Deno.test("un champ qui n'est pas du texte répond 422", async () => {
  const reponse = await traiterUneDemandeSansConnexion(
    post('{"motDePasse":42}'),
    (corps) => {
      motDePasseObligatoire(corps);
      return Promise.resolve();
    },
    origines,
  );

  assertEquals(reponse.status, 422);
});

Deno.test("un mot de passe vide est refusé", () => {
  try {
    motDePasseObligatoire({ motDePasse: "" });
    throw new Error("attendu : refus");
  } catch (cause) {
    assertEquals(cause instanceof EntreeInvalide, true);
  }
});

Deno.test("la réponse d'une erreur inattendue ne contient ni le mot de passe ni le prénom saisis", async () => {
  const reponse = await traiterUneDemandeSansConnexion(
    post('{"motDePasse":"Secret-Saisi1!","prenom":"Prénom-Saisi"}'),
    (corps) => Promise.reject(new Error(`${corps.motDePasse} ${corps.prenom}`)),
    origines,
  );

  const texte = await reponse.text();
  assertEquals(reponse.status, 500);
  assertEquals(texte.includes("Secret-Saisi1!"), false);
  assertEquals(texte.includes("Prénom-Saisi"), false);
});

Deno.test("la réponse d'un mot de passe non conforme ne contient pas le mot de passe saisi", async () => {
  const reponse = await traiterUneDemandeSansConnexion(
    post('{"motDePasse":"a"}'),
    () => Promise.reject(new MotDePasseNonConforme(reglesManquantes())),
    origines,
  );

  assertEquals(reponse.status, 422);
  assertEquals((await reponse.text()).includes('"a"'), false);
});
