import { assert, assertEquals, assertRejects } from "@std/assert";
import { AdresseEmail } from "../domain/adresse-email.ts";
import {
  AdresseEmailInvalide,
  InformationsDeReinitialisationIncorrectes,
  MotDePasseNonConforme,
  MotDePasseTropLong,
  PrenomObligatoire,
  ServiceDeConnexionIndisponible,
  TropDEssaisDeReinitialisation,
} from "../domain/erreurs.ts";
import { ParentId } from "../domain/parent-id.ts";
import { Prenom } from "../domain/prenom.ts";
import { MotsDePasseDesParentsEnMemoire } from "../test_utils/mots-de-passe-des-parents-en-memoire.ts";
import { ParentsDesAdressesEnMemoire } from "../test_utils/parents-des-adresses-en-memoire.ts";
import { PrenomsDesEnfantsRattachesEnMemoire } from "../test_utils/prenoms-des-enfants-rattaches-en-memoire.ts";
import { RegistreDesEssaisDeReinitialisationEnMemoire } from "../test_utils/registre-des-essais-de-reinitialisation-en-memoire.ts";
import { RegistreDesEssaisIndisponible } from "./ports/registre-des-essais-de-reinitialisation.ts";
import { ReinitialiserLeMotDePasse } from "./reinitialiser-le-mot-de-passe.ts";

const adresse = "paul@exemple.test";
const nouveauMotDePasse = "Abcdefg%";
const midi = new Date("2026-10-24T12:00:00Z");

function apresMinutes(minutes: number): Date {
  return new Date(midi.getTime() + minutes * 60 * 1000);
}

function scenario() {
  const journal: string[] = [];
  const registre = new RegistreDesEssaisDeReinitialisationEnMemoire(journal);
  const parents = new ParentsDesAdressesEnMemoire(journal);
  const prenoms = new PrenomsDesEnfantsRattachesEnMemoire(journal);
  const motsDePasse = new MotsDePasseDesParentsEnMemoire(journal);
  const paul = ParentId.de("parent-paul");
  const marie = ParentId.de("parent-marie");
  parents.ajouter(AdresseEmail.de(adresse), paul);
  parents.ajouter(AdresseEmail.de("marie@exemple.test"), marie);
  prenoms.rattacher(paul, Prenom.de("Léa"));
  prenoms.rattacher(paul, Prenom.de("Tom"));
  prenoms.rattacher(marie, Prenom.de("Zoé"));
  const reinitialiser = new ReinitialiserLeMotDePasse(registre, parents, prenoms, motsDePasse);
  return { journal, registre, parents, prenoms, motsDePasse, paul, reinitialiser };
}

async function rater(
  reinitialiser: ReinitialiserLeMotDePasse,
  fois: number,
  adresseSaisie = adresse,
): Promise<void> {
  for (let i = 0; i < fois; i++) {
    const estLeCinquieme = i === 4;
    await assertRejects(
      () => reinitialiser.executer(adresseSaisie, "Faux", nouveauMotDePasse, midi),
      estLeCinquieme ? TropDEssaisDeReinitialisation : InformationsDeReinitialisationIncorrectes,
    );
  }
}

Deno.test("le prénom d'un enfant rattaché, sans tenir compte de la casse ni des accents, change le mot de passe de ce parent", async () => {
  const { motsDePasse, paul, reinitialiser } = scenario();

  await reinitialiser.executer(adresse, "lea", nouveauMotDePasse, midi);

  assertEquals(motsDePasse.changements, [{ parent: paul, motDePasse: nouveauMotDePasse }]);
});

Deno.test("le prénom de n'importe lequel des enfants rattachés suffit", async () => {
  const { motsDePasse, reinitialiser } = scenario();

  await reinitialiser.executer(adresse, "Tom", nouveauMotDePasse, midi);

  assertEquals(motsDePasse.changements.length, 1);
});

Deno.test("une réinitialisation réussie remet à zéro les essais de réinitialisation de l'adresse", async () => {
  const { registre, reinitialiser } = scenario();
  await rater(reinitialiser, 2);

  await reinitialiser.executer(adresse, "Léa", nouveauMotDePasse, midi);

  assertEquals(registre.conserves(), []);
});

Deno.test("un prénom faux enregistre un essai de réinitialisation raté et laisse le mot de passe inchangé", async () => {
  const { registre, motsDePasse, reinitialiser } = scenario();

  await rater(reinitialiser, 1);

  assertEquals(registre.conserves().map((essais) => essais.essaisRates), [1]);
  assertEquals(motsDePasse.changements, []);
});

Deno.test("une adresse inconnue est refusée avec la même erreur et compte un essai de réinitialisation raté", async () => {
  const { registre, motsDePasse, reinitialiser } = scenario();

  await assertRejects(
    () => reinitialiser.executer("inconnu@exemple.test", "Léa", nouveauMotDePasse, midi),
    InformationsDeReinitialisationIncorrectes,
  );

  assertEquals(registre.conserves().map((essais) => essais.essaisRates), [1]);
  assertEquals(motsDePasse.changements, []);
});

Deno.test("un parent sans enfant rattaché est refusé avec la même erreur et compte un essai de réinitialisation raté", async () => {
  const { registre, parents, motsDePasse, reinitialiser } = scenario();
  parents.ajouter(AdresseEmail.de("seul@exemple.test"), ParentId.de("parent-seul"));

  await assertRejects(
    () => reinitialiser.executer("seul@exemple.test", "Léa", nouveauMotDePasse, midi),
    InformationsDeReinitialisationIncorrectes,
  );

  assertEquals(registre.conserves().map((essais) => essais.essaisRates), [1]);
  assertEquals(motsDePasse.changements, []);
});

Deno.test("le prénom d'un enfant d'un autre parent ne réinitialise rien", async () => {
  const { registre, motsDePasse, reinitialiser } = scenario();

  await assertRejects(
    () => reinitialiser.executer(adresse, "Zoé", nouveauMotDePasse, midi),
    InformationsDeReinitialisationIncorrectes,
  );

  assertEquals(motsDePasse.changements, []);
  assertEquals(registre.conserves().map((essais) => essais.essaisRates), [1]);
});

Deno.test("une adresse mal formée est refusée sans essai de réinitialisation ni lecture", async () => {
  const { registre, parents, prenoms, reinitialiser } = scenario();

  await assertRejects(
    () => reinitialiser.executer("paul-at-exemple", "Léa", nouveauMotDePasse, midi),
    AdresseEmailInvalide,
  );

  assertEquals(registre.enregistrements, 0);
  assertEquals([parents.lectures, prenoms.lectures], [0, 0]);
});

Deno.test("un prénom vide est refusé sans essai de réinitialisation ni lecture", async () => {
  const { registre, parents, prenoms, reinitialiser } = scenario();

  await assertRejects(
    () => reinitialiser.executer(adresse, "   ", nouveauMotDePasse, midi),
    PrenomObligatoire,
  );

  assertEquals(registre.enregistrements, 0);
  assertEquals([parents.lectures, prenoms.lectures], [0, 0]);
});

Deno.test("un mot de passe non conforme est refusé sans essai de réinitialisation ni lecture", async () => {
  const { registre, parents, prenoms, motsDePasse, reinitialiser } = scenario();

  await assertRejects(
    () => reinitialiser.executer(adresse, "Léa", "abcdefgh", midi),
    MotDePasseNonConforme,
  );

  assertEquals(registre.enregistrements, 0);
  assertEquals([parents.lectures, prenoms.lectures], [0, 0]);
  assertEquals(motsDePasse.changements, []);
});

Deno.test("un mot de passe de plus de 64 caractères est refusé sans essai de réinitialisation ni lecture", async () => {
  const { registre, parents, prenoms, motsDePasse, reinitialiser } = scenario();
  const tropLong = "Aa%" + "b".repeat(62);

  await assertRejects(
    () => reinitialiser.executer(adresse, "Léa", tropLong, midi),
    MotDePasseTropLong,
  );

  assertEquals(registre.enregistrements, 0);
  assertEquals([parents.lectures, prenoms.lectures], [0, 0]);
  assertEquals(motsDePasse.changements, []);
});

Deno.test("après 5 essais de réinitialisation ratés, même le bon prénom est refusé sans lire le parent ni les prénoms", async () => {
  const { parents, prenoms, motsDePasse, reinitialiser } = scenario();
  await rater(reinitialiser, 5);
  const lecturesAvant = [parents.lectures, prenoms.lectures];

  await assertRejects(
    () => reinitialiser.executer(adresse, "Léa", nouveauMotDePasse, apresMinutes(10)),
    TropDEssaisDeReinitialisation,
  );

  assertEquals([parents.lectures, prenoms.lectures], lecturesAvant);
  assertEquals(motsDePasse.changements, []);
});

Deno.test("un essai de réinitialisation pendant le blocage ne prolonge pas le blocage", async () => {
  const { motsDePasse, reinitialiser } = scenario();
  await rater(reinitialiser, 5);
  await assertRejects(
    () => reinitialiser.executer(adresse, "Léa", nouveauMotDePasse, apresMinutes(50)),
    TropDEssaisDeReinitialisation,
  );

  await reinitialiser.executer(adresse, "Léa", nouveauMotDePasse, apresMinutes(61));

  assertEquals(motsDePasse.changements.length, 1);
});

Deno.test("61 minutes après le 5e essai de réinitialisation raté, une bonne réponse réussit", async () => {
  const { motsDePasse, reinitialiser } = scenario();
  await rater(reinitialiser, 5);

  await reinitialiser.executer(adresse, "Léa", nouveauMotDePasse, apresMinutes(61));

  assertEquals(motsDePasse.changements.length, 1);
});

Deno.test("une adresse inconnue est bloquée de la même façon après 5 essais de réinitialisation ratés", async () => {
  const { reinitialiser } = scenario();
  await rater(reinitialiser, 5, "inconnu@exemple.test");

  await assertRejects(
    () => reinitialiser.executer("INCONNU@exemple.test", "Léa", nouveauMotDePasse, apresMinutes(1)),
    TropDEssaisDeReinitialisation,
  );
});

Deno.test("les essais de réinitialisation enregistrés ne contiennent jamais le prénom saisi", async () => {
  const { registre, reinitialiser } = scenario();

  await assertRejects(
    () => reinitialiser.executer(adresse, "Prénomsecret", nouveauMotDePasse, midi),
    InformationsDeReinitialisationIncorrectes,
  );

  assert(registre.conserves().length > 0);
  assert(!JSON.stringify(registre.conserves()).includes("secret"));
});

Deno.test("le mot de passe transmis pour le changement est la saisie telle quelle, espaces compris", async () => {
  const { motsDePasse, reinitialiser } = scenario();

  await reinitialiser.executer(adresse, "Léa", " Abcdefg% ", midi);

  assertEquals(motsDePasse.changements[0].motDePasse, " Abcdefg% ");
});

Deno.test("l'essai est enregistré avant toute lecture du parent et des prénoms", async () => {
  const { journal, reinitialiser } = scenario();

  await assertRejects(
    () => reinitialiser.executer(adresse, "Faux", nouveauMotDePasse, midi),
    InformationsDeReinitialisationIncorrectes,
  );

  assertEquals(journal, ["registre.lire", "registre.enregistrer", "parents.lire", "prenoms.lire"]);
});

Deno.test("un conflit à l'enregistrement de l'essai fait relire les essais et recommencer avant de comparer le prénom", async () => {
  const { journal, registre, motsDePasse, reinitialiser } = scenario();
  registre.provoquerDesConflits(1);

  await reinitialiser.executer(adresse, "Léa", nouveauMotDePasse, midi);

  assertEquals(journal, [
    "registre.lire",
    "registre.conflit",
    "registre.lire",
    "registre.enregistrer",
    "parents.lire",
    "prenoms.lire",
    "mot-de-passe.changer",
    "registre.enregistrer",
  ]);
  assertEquals(motsDePasse.changements.length, 1);
});

Deno.test("des conflits répétés à l'enregistrement de l'essai font échouer la réinitialisation sans lire de prénom ni changer le mot de passe", async () => {
  const { journal, registre, parents, prenoms, motsDePasse, reinitialiser } = scenario();
  registre.provoquerDesConflits(100);

  await assertRejects(
    () => reinitialiser.executer(adresse, "Léa", nouveauMotDePasse, midi),
    ServiceDeConnexionIndisponible,
  );

  assertEquals([parents.lectures, prenoms.lectures], [0, 0]);
  assertEquals(motsDePasse.changements, []);
  assertEquals(journal.filter((appel) => appel === "registre.conflit").length, 5);
});

Deno.test("deux essais simultanés comptent tous les deux : le second voit le compte à jour avant de lire les prénoms", async () => {
  const { journal, registre, parents, prenoms, motsDePasse } = scenario();
  const premier = new ReinitialiserLeMotDePasse(registre.uneAutreRequete(), parents, prenoms, motsDePasse);
  const second = new ReinitialiserLeMotDePasse(registre.uneAutreRequete(), parents, prenoms, motsDePasse);

  const resultats = await Promise.allSettled([
    premier.executer(adresse, "Faux", nouveauMotDePasse, midi),
    second.executer(adresse, "Faux", nouveauMotDePasse, midi),
  ]);

  assertEquals(
    resultats.map((resultat) => resultat.status === "rejected" && resultat.reason.constructor),
    [InformationsDeReinitialisationIncorrectes, InformationsDeReinitialisationIncorrectes],
  );
  assertEquals(registre.conserves().map((essais) => essais.essaisRates), [2]);
  const secondeReservation = journal.indexOf("registre.enregistrer", journal.indexOf("registre.enregistrer") + 1);
  assert(secondeReservation !== -1 && secondeReservation < journal.indexOf("prenoms.lire"));
});

Deno.test("au 5e essai de réinitialisation, après 4 essais ratés, le bon prénom réussit et remet les essais à zéro", async () => {
  const { journal, registre, motsDePasse, reinitialiser } = scenario();
  await rater(reinitialiser, 4);
  journal.length = 0;

  await reinitialiser.executer(adresse, "Léa", nouveauMotDePasse, midi);

  assertEquals(journal, [
    "registre.lire",
    "registre.enregistrer",
    "parents.lire",
    "prenoms.lire",
    "mot-de-passe.changer",
    "registre.enregistrer",
  ]);
  assertEquals(motsDePasse.changements.length, 1);
  assertEquals(registre.conserves(), []);
});

Deno.test("du 1er au 4e essai de réinitialisation raté, le parent reçoit des informations incorrectes et rien n'est bloqué", async () => {
  const { registre, reinitialiser } = scenario();

  await rater(reinitialiser, 4);

  assertEquals(registre.conserves().map((essais) => essais.bloqueJusquA), [null]);
});

Deno.test("au 5e essai de réinitialisation, un faux prénom pose le blocage et le parent reçoit aussitôt « Trop d'essais »", async () => {
  const { journal, registre, reinitialiser } = scenario();
  await rater(reinitialiser, 4);
  journal.length = 0;

  await assertRejects(
    () => reinitialiser.executer(adresse, "Faux", nouveauMotDePasse, midi),
    TropDEssaisDeReinitialisation,
    "Trop d'essais. Réessaie dans une heure.",
  );

  assertEquals(journal.slice(0, 2), ["registre.lire", "registre.enregistrer"]);
  assertEquals(registre.conserves().map((essais) => essais.bloqueJusquA !== null), [true]);
});

Deno.test("un registre en panne après le changement du mot de passe n'empêche pas la réinitialisation de réussir", async () => {
  const { registre, motsDePasse, paul, reinitialiser } = scenario();
  registre.tomberEnPanneALaRemiseAZero(new RegistreDesEssaisIndisponible());

  await reinitialiser.executer(adresse, "Léa", nouveauMotDePasse, midi);

  assertEquals(motsDePasse.changements, [{ parent: paul, motDePasse: nouveauMotDePasse }]);
});

Deno.test("une erreur inattendue à l'enregistrement qui suit le changement du mot de passe remonte", async () => {
  const { registre, reinitialiser } = scenario();
  registre.tomberEnPanneALaRemiseAZero(new TypeError("erreur de programmation"));

  await assertRejects(
    () => reinitialiser.executer(adresse, "Léa", nouveauMotDePasse, midi),
    TypeError,
    "erreur de programmation",
  );
});
