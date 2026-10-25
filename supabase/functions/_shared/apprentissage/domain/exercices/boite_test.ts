import { assertEquals } from "@std/assert";
import type { ItemDeBoite } from "../../../catalogue/domain/index.ts";
import { aideDeLaBoite, deroulementDeLaBoite, ouvertureDeLaBoite } from "./boite.ts";

const quatrePlusTrois: ItemDeBoite = { a: 4, sens: "ajout", b: 3, reponse: 7, ecriture: "4 + 3 = 7" };
const deuxPlusSept: ItemDeBoite = { a: 2, sens: "ajout", b: 7, reponse: 9, ecriture: "2 + 7 = 9" };
const huitMoinsTrois: ItemDeBoite = { a: 8, sens: "retrait", b: 3, reponse: 5, ecriture: "8 − 3 = 5" };
const septMoinsSept: ItemDeBoite = { a: 7, sens: "retrait", b: 7, reponse: 0, ecriture: "7 − 7 = 0" };
const unPlusUn: ItemDeBoite = { a: 1, sens: "ajout", b: 1, reponse: 2, ecriture: "1 + 1 = 2" };

const questionDeLaBoite =
  "La boîte est fermée. Combien y a-t-il de jetons dedans ? Réfléchis dans ta tête, avec tes doigts, ou en dessinant.";

Deno.test("le déroulé d'une boîte où l'on ajoute des jetons dit les jetons mis, ceux qu'on remet, puis pose la question", () => {
  assertEquals(deroulementDeLaBoite(quatrePlusTrois), [
    "Je mets 4 jetons dans la boîte.",
    "Et j'en mets encore 3.",
    questionDeLaBoite,
  ]);
});

Deno.test("le déroulé d'une boîte où l'on retire des jetons dit les jetons retirés", () => {
  assertEquals(deroulementDeLaBoite(huitMoinsTrois), [
    "Je mets 8 jetons dans la boîte.",
    "Maintenant, j'en retire 3.",
    questionDeLaBoite,
  ]);
});

Deno.test("le déroulé garde « jeton » au singulier pour 1 jeton", () => {
  assertEquals(deroulementDeLaBoite(unPlusUn)[0], "Je mets 1 jeton dans la boîte.");
});

Deno.test("le déroulé garde « jeton » au singulier pour 0 jeton", () => {
  const zeroPlusDeux: ItemDeBoite = { a: 0, sens: "ajout", b: 2, reponse: 2, ecriture: "0 + 2 = 2" };

  assertEquals(deroulementDeLaBoite(zeroPlusDeux)[0], "Je mets 0 jeton dans la boîte.");
});

Deno.test("l'aide d'une boîte où l'on ajoute part du plus grand nombre et avance du plus petit", () => {
  assertEquals(aideDeLaBoite(quatrePlusTrois), "Mets 4 dans ta tête, et avance de 3.");
  assertEquals(aideDeLaBoite(deuxPlusSept), "Mets 7 dans ta tête, et avance de 2.");
});

Deno.test("l'aide d'une boîte où l'on retire part du nombre de départ et recule", () => {
  assertEquals(aideDeLaBoite(huitMoinsTrois), "Pars de 8 et recule de 3.");
});

Deno.test("l'ouverture de la boîte annonce les jetons et l'écriture du calcul", () => {
  assertEquals(ouvertureDeLaBoite(quatrePlusTrois), "On ouvre la boîte pour vérifier… 7 jetons ! 4 + 3 = 7.");
});

Deno.test("l'ouverture d'une boîte vide garde « jeton » au singulier", () => {
  assertEquals(ouvertureDeLaBoite(septMoinsSept), "On ouvre la boîte pour vérifier… 0 jeton ! 7 − 7 = 0.");
});
