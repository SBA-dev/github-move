import { assertEquals, assertNotEquals } from "@std/assert";
import { reconnaitreLaForme } from "./forme-du-texte.ts";
import { TexteDuParent } from "./texte-du-parent.ts";

function texteDeMots(sujet: string, nombreDeMots: number): TexteDuParent {
  const remplissage = Array.from({ length: nombreDeMots - 1 }, () => "beaucoup");
  return TexteDuParent.de([sujet, ...remplissage].join(" "));
}

Deno.test("une liste de noms courts est une liste de mots", () => {
  const texte = TexteDuParent.de("chaton, maison, poisson, garçon");

  assertEquals(reconnaitreLaForme(texte), "listeDeMots");
});

Deno.test("une liste de mots à l'infinitif est une liste de verbes", () => {
  const texte = TexteDuParent.de("chanter, finir, prendre, manger");

  assertEquals(reconnaitreLaForme(texte), "listeDeVerbes");
});

Deno.test("deux éléments seulement ne forment pas une liste", () => {
  const texte = TexteDuParent.de("chaton, maison");

  assertNotEquals(reconnaitreLaForme(texte), "listeDeMots");
});

Deno.test("des vers courts sur plusieurs lignes forment une poésie", () => {
  const texte = TexteDuParent.de(
    [
      "Le soleil se lève sur la colline",
      "Les oiseaux chantent dans le matin",
      "Le vent joue avec les feuilles",
      "La journée commence doucement",
    ].join("\n"),
  );

  assertEquals(reconnaitreLaForme(texte), "poesie");
});

Deno.test("un paragraphe de phrases longues est un texte documentaire", () => {
  const texte = TexteDuParent.de(
    "Les abeilles vivent dans une ruche où chacune a un rôle précis pour toute la colonie pendant l'été. " +
      "Elles récoltent le nectar des fleurs et le transforment lentement en miel que la colonie conserve pour l'hiver. " +
      "Au printemps, la reine pond des milliers d'oeufs dans les alvéoles construites avec de la cire.",
  );

  assertEquals(reconnaitreLaForme(texte), "texteDocumentaire");
});

Deno.test("un texte de plus de 25 mots qui parle d'un pompier est un texte sur un métier", () => {
  const texte = texteDeMots("pompier", 30);

  assertEquals(reconnaitreLaForme(texte), "texteSurUnMetier");
});

Deno.test("un texte de 20 mots qui parle d'un pompier n'est pas un texte sur un métier", () => {
  const texte = texteDeMots("pompier", 20);

  assertNotEquals(reconnaitreLaForme(texte), "texteSurUnMetier");
});

Deno.test("un texte de 25 mots exactement n'est pas un texte sur un métier", () => {
  const texte = texteDeMots("pompier", 25);

  assertNotEquals(reconnaitreLaForme(texte), "texteSurUnMetier");
});

Deno.test("le métier est reconnu malgré les accents et les majuscules", () => {
  const texte = texteDeMots("Médecin", 30);

  assertEquals(reconnaitreLaForme(texte), "texteSurUnMetier");
});
