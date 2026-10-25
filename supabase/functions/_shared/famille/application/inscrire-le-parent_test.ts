import { assert, assertEquals, assertRejects } from "@std/assert";
import {
  AdresseDejaUtilisee,
  AdresseEmailInvalide,
  MotDePasseNonConforme,
  MotDePasseTropLong,
} from "../domain/erreurs.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { InscriptionsDesParentsEnMemoire } from "../test_utils/inscriptions-des-parents-en-memoire.ts";
import { InscrireLeParent } from "./inscrire-le-parent.ts";

const adresse = "paul@exemple.test";
const motDePasse = "Abcdefg%";

function inscriptions(): InscriptionsDesParentsEnMemoire {
  return new InscriptionsDesParentsEnMemoire(generateurIdFixe("parent-paul"));
}

Deno.test("une adresse et un mot de passe conformes inscrivent le parent et rendent son identifiant", async () => {
  const registre = inscriptions();

  const parent = await new InscrireLeParent(registre).executer(adresse, motDePasse);

  assertEquals(parent.valeur, "parent-paul");
  assertEquals(registre.inscriptions.map((i) => i.adresse.valeur), [adresse]);
});

Deno.test("le mot de passe transmis à l'inscription est la saisie telle quelle, espaces compris", async () => {
  const registre = inscriptions();

  await new InscrireLeParent(registre).executer(adresse, " Abcdefg% ");

  assertEquals(registre.inscriptions[0].motDePasse, " Abcdefg% ");
});

Deno.test("une adresse mal formée n'inscrit personne", async () => {
  const registre = inscriptions();

  await assertRejects(
    () => new InscrireLeParent(registre).executer("paul-at-exemple", motDePasse),
    AdresseEmailInvalide,
  );

  assertEquals(registre.inscriptions, []);
});

Deno.test("un mot de passe qui ne respecte pas les règles n'inscrit personne", async () => {
  const registre = inscriptions();

  await assertRejects(() => new InscrireLeParent(registre).executer(adresse, "abcdefgh"), MotDePasseNonConforme);

  assertEquals(registre.inscriptions, []);
});

Deno.test("un mot de passe de plus de 64 caractères n'inscrit personne", async () => {
  const registre = inscriptions();
  const tropLong = "Aa%" + "b".repeat(62);

  await assertRejects(() => new InscrireLeParent(registre).executer(adresse, tropLong), MotDePasseTropLong);

  assertEquals(registre.inscriptions, []);
});

Deno.test("une adresse déjà utilisée, même écrite avec d'autres majuscules, ne peut pas s'inscrire deux fois", async () => {
  const registre = inscriptions();
  const inscription = new InscrireLeParent(registre);
  await inscription.executer(adresse, motDePasse);

  await assertRejects(() => inscription.executer("PAUL@exemple.test", "Autre1234%x"), AdresseDejaUtilisee);

  assertEquals(registre.inscriptions.length, 1);
});

Deno.test("l'erreur d'un mot de passe non conforme ne contient pas le mot de passe saisi", async () => {
  const saisie = "motdepasse-secret";

  const erreur = await assertRejects(
    () => new InscrireLeParent(inscriptions()).executer(adresse, saisie),
    MotDePasseNonConforme,
  );

  assert(!erreur.message.includes(saisie));
});
