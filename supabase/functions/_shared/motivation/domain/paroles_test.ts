import { assertEquals } from "@std/assert";
import {
  direJeNeSaisPasAuClavierDeCristaux,
  direJeNeSaisPasAvecLesChoix,
  encourager,
  feliciter,
  inviterACreerLePremierProfil,
  presentation,
  presentationAuRetourDuSon,
  saluer,
} from "./paroles.ts";
import { type CleUnivers, universDe } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

const felicitationsCommunes = [
  "Bravo !",
  "Super !",
  "Ouah, bien joué !",
  "Exactement !",
  "Génial !",
  "Tu gères !",
  "Parfait !",
  "Oui, c'est ça !",
];

const expressionsAttendues: [CleUnivers, string[]][] = [
  ["princesse", ["Abracadabra !", "Par ma baguette, bravo !", "Magique !"]],
  ["animaux", ["Youpi !", "Hop hop hop, bravo !", "Trop fort, ça !"]],
  ["sports", ["Allez, on y va !", "Et c'est le but !", "Quelle équipe !"]],
  ["police", ["Enquête résolue !", "Bien vu, détective !", "Affaire classée !"]],
  ["pompier", ["Mission accomplie !", "Pin-pon, bravo !", "Sauvetage réussi !"]],
  ["danse", ["Et hop, une pirouette !", "En rythme, bravo !", "Quelle grâce !"]],
];

const noisette = universDe("animaux").personnageGuide;

Deno.test("un premier tirage de 0,34 donne une expression du personnage guide", () => {
  const felicitation = feliciter(noisette, hasardFixe(0.34, 0));

  assertEquals(felicitation.texte, "Youpi !");
});

Deno.test("un premier tirage de 0,35 donne une félicitation commune", () => {
  const felicitation = feliciter(noisette, hasardFixe(0.35, 0));

  assertEquals(felicitation.texte, "Bravo !");
});

Deno.test("le second tirage choisit la dernière expression du personnage guide", () => {
  const felicitation = feliciter(noisette, hasardFixe(0, 0.99));

  assertEquals(felicitation.texte, "Trop fort, ça !");
});

Deno.test("le second tirage choisit la dernière félicitation commune", () => {
  const felicitation = feliciter(noisette, hasardFixe(0.9, 0.99));

  assertEquals(felicitation.texte, "Oui, c'est ça !");
});

for (const [cle, expressions] of expressionsAttendues) {
  const personnageGuide = universDe(cle).personnageGuide;

  Deno.test(`${personnageGuide.nom} a ses trois expressions, mot pour mot`, () => {
    const textes = [0, 0.4, 0.99].map((second) => feliciter(personnageGuide, hasardFixe(0, second)).texte);

    assertEquals(textes, expressions);
  });

  Deno.test(`${personnageGuide.nom} ne dit jamais l'expression d'un autre personnage guide`, () => {
    const autres = expressionsAttendues
      .filter(([autreCle]) => autreCle !== cle)
      .flatMap(([, textes]) => textes);

    for (const second of [0, 0.4, 0.99]) {
      assertEquals(
        autres.includes(feliciter(personnageGuide, hasardFixe(0.1, second)).texte),
        false,
      );
    }
  });
}

Deno.test("les huit félicitations communes sont tirées mot pour mot", () => {
  const textes = felicitationsCommunes.map((_, i) => feliciter(noisette, hasardFixe(0.5, (i + 0.5) / 8)).texte);

  assertEquals(textes, felicitationsCommunes);
});

const encouragementsLegacy = [
  "Oups, presque !",
  "Hmm, pas tout à fait…",
  "Pas grave, on réessaie !",
  "Ah, celle-là est piégeuse !",
  "Presque ! Regarde bien.",
];

Deno.test("un tirage de 0 donne le premier encouragement", () => {
  assertEquals(encourager(hasardFixe(0)).texte, "Oups, presque !");
});

Deno.test("un tirage de 0,99 donne le dernier encouragement", () => {
  assertEquals(encourager(hasardFixe(0.99)).texte, "Presque ! Regarde bien.");
});

Deno.test("les cinq encouragements sont tirés mot pour mot", () => {
  const textes = encouragementsLegacy.map((_, i) => encourager(hasardFixe((i + 0.5) / 5)).texte);

  assertEquals(textes, encouragementsLegacy);
});

Deno.test("Noisette se présente au retour du son", () => {
  assertEquals(presentationAuRetourDuSon(noisette), "Je t'entends ! Je suis Noisette.");
});

Deno.test("Capitaine Sam se présente au retour du son", () => {
  assertEquals(
    presentationAuRetourDuSon(universDe("pompier").personnageGuide),
    "Je t'entends ! Je suis Capitaine Sam.",
  );
});

const presentationsAttendues: [CleUnivers, string][] = [
  ["princesse", "Je suis Lumi, la fée des nombres et des mots du Royaume des Savanturiers."],
  ["animaux", "Je suis Noisette, l'écureuil savant de la Forêt des Savanturiers."],
  ["sports", "Je suis Coach Léo, l'entraîneur des champions du Stade des Savanturiers."],
  ["police", "Je suis Agente Mila, la policière détective du Commissariat des Savanturiers."],
  ["pompier", "Je suis Capitaine Sam, le pompier courageux de la Caserne des Savanturiers."],
  ["danse", "Je suis Lili, la danseuse étoile de l'Opéra des Savanturiers."],
];

for (const [cle, attendue] of presentationsAttendues) {
  Deno.test(`le personnage guide de l'univers ${cle} se présente avec son titre et son royaume`, () => {
    assertEquals(presentation(universDe(cle)), attendue);
  });
}

Deno.test("le personnage guide salue l'enfant choisi par son prénom", () => {
  assertEquals(saluer("Léa"), "Bonjour Léa !");
});

Deno.test("le personnage guide invite à créer le profil de l'enfant qui va jouer", () => {
  assertEquals(
    inviterACreerLePremierProfil(),
    "Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer. Tu pourras en ajouter d'autres ensuite.",
  );
});

Deno.test("avec les choix, « Je ne sais pas » dit l'aide puis que la bonne réponse brille", () => {
  assertEquals(
    direJeNeSaisPasAvecLesChoix("Pense à la lettre muette, comme dans chaton."),
    "Pas de souci, on apprend ensemble ! Pense à la lettre muette, comme dans chaton. La bonne réponse brille : touche-la.",
  );
});

Deno.test("avec les choix, sans aide, « Je ne sais pas » dit seulement que la bonne réponse brille", () => {
  assertEquals(
    direJeNeSaisPasAvecLesChoix(undefined),
    "Pas de souci, on apprend ensemble ! La bonne réponse brille : touche-la.",
  );
});

Deno.test("au clavier de cristaux, « Je ne sais pas » dit l'aide puis la réponse à taper", () => {
  assertEquals(
    direJeNeSaisPasAuClavierDeCristaux("7", "Pars de 12 et recule de 5."),
    "Pas de souci ! Pars de 12 et recule de 5. La réponse est 7. Tape-la sur les cristaux.",
  );
});

Deno.test("au clavier de cristaux, sans aide, « Je ne sais pas » dit seulement la réponse à taper", () => {
  assertEquals(
    direJeNeSaisPasAuClavierDeCristaux("7", undefined),
    "Pas de souci ! La réponse est 7. Tape-la sur les cristaux.",
  );
});
