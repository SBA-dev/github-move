import { assertEquals } from "@std/assert";
import { ProfilEnfantIntrouvable } from "../../famille/domain/erreurs.ts";
import {
  AucuneQuestionPourLeDefi,
  DefiAVenir,
  DefiIncoherent,
  DefiInconnu,
  DefiNonFini,
  LeconIntrouvable,
  ParentNonRattache,
  PlanDuDefiIncoherent,
  QuestionHorsDuDefi,
  SeanceDeRevisionIncoherente,
  SeanceIncoherente,
  TestDeDepartIncoherent,
  TirageInvalide,
} from "../domain/erreurs.ts";
import { EntreeInvalide, statutEtMessage } from "./http-apprentissage.ts";

Deno.test("un parent non rattaché est présenté comme un profil introuvable (404)", () => {
  assertEquals(statutEtMessage(new ParentNonRattache()), statutEtMessage(new ProfilEnfantIntrouvable()));
  assertEquals(statutEtMessage(new ParentNonRattache()).statut, 404);
});

Deno.test("une leçon introuvable est un 404 qui ne répète pas l'identifiant reçu", () => {
  const { statut, message } = statutEtMessage(new LeconIntrouvable("fr-cp-pirate"));

  assertEquals(statut, 404);
  assertEquals(message.includes("fr-cp-pirate"), false);
});

Deno.test("une séance incohérente est un 422 sans détail sur la cause", () => {
  const cause = new TirageInvalide();

  const { statut, message } = statutEtMessage(new SeanceIncoherente(cause));

  assertEquals(statut, 422);
  assertEquals(message.includes(cause.message), false);
});

Deno.test("une séance de révision incohérente est un 422 propre à la révision, sans détail sur la cause", () => {
  const cause = new TirageInvalide();

  assertEquals(statutEtMessage(new SeanceDeRevisionIncoherente(cause)), {
    statut: 422,
    message: "Cette séance de révision n'a pas pu être vérifiée.",
  });
});

Deno.test("un test de départ incohérent est un 422 sans détail sur la cause", () => {
  const cause = new TirageInvalide();

  const { statut, message } = statutEtMessage(new TestDeDepartIncoherent(cause));

  assertEquals(statut, 422);
  assertEquals(message.includes(cause.message), false);
});

const erreursDuDefi: [string, Error][] = [
  ["un défi inconnu", new DefiInconnu()],
  ["un défi à venir", new DefiAVenir()],
  ["une question hors du défi", new QuestionHorsDuDefi()],
  ["un plan du défi incohérent", new PlanDuDefiIncoherent()],
  ["un défi non fini", new DefiNonFini()],
  ["un défi incohérent", new DefiIncoherent(new TirageInvalide())],
  ["un défi sans aucune question à poser", new AucuneQuestionPourLeDefi()],
];

for (const [nom, erreur] of erreursDuDefi) {
  Deno.test(`${nom} est un 422 propre au défi, sans détail sur la cause`, () => {
    assertEquals(statutEtMessage(erreur), { statut: 422, message: "Ce défi n'a pas pu être vérifié." });
  });
}

Deno.test("une entrée invalide est un 400 avec son message", () => {
  assertEquals(statutEtMessage(new EntreeInvalide("Le champ « lecon » est obligatoire.")), {
    statut: 400,
    message: "Le champ « lecon » est obligatoire.",
  });
});

Deno.test("une panne inconnue est un 500 sans détail", () => {
  const { statut, message } = statutEtMessage(new Error("mot de passe de la base"));

  assertEquals(statut, 500);
  assertEquals(message.includes("mot de passe"), false);
});
