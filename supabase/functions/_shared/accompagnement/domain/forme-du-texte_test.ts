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

for (
  const mot of [
    "pompier",
    "policier",
    "policière",
    "médecin",
    "infirmier",
    "boulanger",
    "métier",
    "travaille",
  ]
) {
  Deno.test(`le mot « ${mot} » dans un texte de plus de 25 mots en fait un texte sur un métier`, () => {
    const texte = texteDeMots(mot, 30);

    assertEquals(reconnaitreLaForme(texte), "texteSurUnMetier");
  });
}

const ELEMENT_LONG = "le petit chat noir dort";

function versDeMots(nombreDeMots: number): string {
  return Array.from({ length: nombreDeMots }, () => "lune").join(" ");
}

Deno.test("une liste d'éléments de 2 ou 3 mots est une liste de mots", () => {
  const texte = TexteDuParent.de("le chat, la maison, un poisson rouge");

  assertEquals(reconnaitreLaForme(texte), "listeDeMots");
});

Deno.test("une liste dont 4 éléments sur 5 sont courts (80 % pile) n'est pas une liste de mots", () => {
  const texte = TexteDuParent.de(
    `chaton, maison, poisson, garçon, ${ELEMENT_LONG}`,
  );

  assertNotEquals(reconnaitreLaForme(texte), "listeDeMots");
});

Deno.test("une liste dont 5 éléments sur 6 sont courts (plus de 80 %) est une liste de mots", () => {
  const texte = TexteDuParent.de(
    `chaton, maison, poisson, garçon, fleur, ${ELEMENT_LONG}`,
  );

  assertEquals(reconnaitreLaForme(texte), "listeDeMots");
});

Deno.test("une liste avec voir et savoir est une liste de verbes", () => {
  const texte = TexteDuParent.de("voir, savoir, chanter, finir");

  assertEquals(reconnaitreLaForme(texte), "listeDeVerbes");
});

Deno.test("une liste dont 3 verbes sur 4 sont des verbes (75 %) est une liste de verbes", () => {
  const texte = TexteDuParent.de("chanter, finir, prendre, maison");

  assertEquals(reconnaitreLaForme(texte), "listeDeVerbes");
});

Deno.test("une liste dont 2 éléments sur 3 sont des verbes (66 %) est une liste de mots", () => {
  const texte = TexteDuParent.de("chanter, finir, maison");

  assertEquals(reconnaitreLaForme(texte), "listeDeMots");
});

Deno.test("3 vers de 12 mots forment une poésie", () => {
  const texte = TexteDuParent.de(
    [versDeMots(12), versDeMots(12), versDeMots(12)].join("\n"),
  );

  assertEquals(reconnaitreLaForme(texte), "poesie");
});

Deno.test("un vers de 13 mots fait un texte documentaire", () => {
  const texte = TexteDuParent.de(
    [versDeMots(12), versDeMots(13), versDeMots(12)].join("\n"),
  );

  assertEquals(reconnaitreLaForme(texte), "texteDocumentaire");
});

Deno.test("2 lignes courtes seulement ne forment pas une poésie", () => {
  const texte = TexteDuParent.de(
    ["Le soleil se lève", "Les oiseaux chantent"].join("\n"),
  );

  assertEquals(reconnaitreLaForme(texte), "texteDocumentaire");
});
