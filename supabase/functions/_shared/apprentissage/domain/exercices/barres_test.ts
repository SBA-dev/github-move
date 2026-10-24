import { assertEquals } from "@std/assert";
import type { ProblemeEnBarres } from "../../../catalogue/domain/index.ts";
import { aideDesBarres, explicationDeLaReponseEnBarres, explicationDuSchema } from "./barres.ts";

const quatrePlusDeux: ProblemeEnBarres = {
  enonce: "Léa a 4 pommes et Tom en a 2. Combien en ont-ils ?",
  reponse: 6,
  ecriture: "4 + 2 = 6",
  forme: { genre: "partiesEtTout", parties: [4, 2], tout: null },
};

const neufMoinsSix: ProblemeEnBarres = {
  enonce: "Il y a 9 billes, dont 6 rouges. Combien de bleues ?",
  reponse: 3,
  ecriture: "9 − 6 = 3",
  forme: { genre: "partiesEtTout", parties: [6, null], tout: 9 },
};

const comparaison: ProblemeEnBarres = {
  enonce: "Léa a 43 billes, Tom en a 37. Combien de plus ?",
  reponse: 6,
  ecriture: "43 − 37 = 6",
  forme: { genre: "comparaison", grand: 43, petit: 37, ecart: null, noms: ["Léa", "Tom"] },
};

const parts: ProblemeEnBarres = {
  enonce: "12 bonbons pour 3 enfants. Combien chacun ?",
  reponse: 4,
  ecriture: "12 = 3 × 4",
  forme: { genre: "parts", nb: 3, valeur: null, total: 12 },
};

Deno.test("le schéma est expliqué : le point d'interrogation, c'est ce qu'on cherche", () => {
  assertEquals(explicationDuSchema(), "Regarde le schéma : le point d'interrogation, c'est ce qu'on cherche.");
});

Deno.test("l'aide d'un problème en barres est son aide quand il en a une", () => {
  const probleme: ProblemeEnBarres = {
    ...neufMoinsSix,
    aide: "On connaît le tout, 9, et une partie, 6. On cherche l'autre partie.",
  };

  assertEquals(aideDesBarres(probleme), "On connaît le tout, 9, et une partie, 6. On cherche l'autre partie.");
});

Deno.test("sans aide, un problème en parties et tout demande si l'on cherche le tout ou une partie", () => {
  assertEquals(aideDesBarres(quatrePlusDeux), "Regarde le schéma : cherches-tu le tout, ou une partie ?");
});

Deno.test("sans aide, un problème en comparaison demande si l'on cherche la grande barre, la petite ou l'écart", () => {
  assertEquals(
    aideDesBarres(comparaison),
    "Regarde le schéma : cherches-tu la grande barre, la petite, ou l'écart entre les deux ?",
  );
});

Deno.test("sans aide, un problème en parts demande si l'on cherche le total, la valeur d'une part ou le nombre de parts", () => {
  assertEquals(
    aideDesBarres(parts),
    "Regarde le schéma : cherches-tu le total, la valeur d'une part, ou le nombre de parts ?",
  );
});

Deno.test("après la bonne réponse, l'écriture du calcul est suivie de la phrase réponse où {r} devient la réponse", () => {
  const probleme: ProblemeEnBarres = { ...quatrePlusDeux, phrase: "J'ai {r} pommes." };

  assertEquals(explicationDeLaReponseEnBarres(probleme), "4 + 2 = 6. J'ai 6 pommes.");
});

Deno.test("après la bonne réponse, sans phrase réponse, seule l'écriture du calcul est dite", () => {
  assertEquals(explicationDeLaReponseEnBarres(neufMoinsSix), "9 − 6 = 3.");
});

Deno.test("après la bonne réponse d'un problème en parts, l'écriture du calcul est dite telle quelle", () => {
  assertEquals(explicationDeLaReponseEnBarres(parts), "12 = 3 × 4.");
});
