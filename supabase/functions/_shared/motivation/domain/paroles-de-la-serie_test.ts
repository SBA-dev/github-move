import { assertEquals } from "@std/assert";
import { saluerAvecLaSerie, texteDeLaPastille } from "./paroles-de-la-serie.ts";

Deno.test("sans série, la pastille propose une petite leçon pour bien commencer", () => {
  const texte = texteDeLaPastille({ nombreDeJours: 0, aJoueAujourdhui: false });

  assertEquals(texte, "Une petite leçon pour bien commencer ?");
});

Deno.test("une série de 1 jour jouée aujourd'hui dit que l'enfant a joué aujourd'hui", () => {
  const texte = texteDeLaPastille({ nombreDeJours: 1, aJoueAujourdhui: true });

  assertEquals(texte, "Tu as joué aujourd'hui !");
});

Deno.test("une série de 1 jour jusqu'à hier dit que l'enfant a joué hier et l'invite à rejouer", () => {
  const texte = texteDeLaPastille({ nombreDeJours: 1, aJoueAujourdhui: false });

  assertEquals(texte, "Tu as joué hier. Une petite leçon aujourd'hui ?");
});

Deno.test("à partir de 2 jours, la pastille dit les jours d'affilée, jouée aujourd'hui ou jusqu'à hier", () => {
  const textes = [
    texteDeLaPastille({ nombreDeJours: 2, aJoueAujourdhui: false }),
    texteDeLaPastille({ nombreDeJours: 3, aJoueAujourdhui: true }),
    texteDeLaPastille({ nombreDeJours: 365, aJoueAujourdhui: true }),
  ];

  assertEquals(textes, [
    "2 jours d'affilée, bravo !",
    "3 jours d'affilée, bravo !",
    "365 jours d'affilée, bravo !",
  ]);
});

Deno.test("le personnage guide salue l'enfant par son prénom puis dit la pastille de série", () => {
  const parole = saluerAvecLaSerie("Léa", { nombreDeJours: 3, aJoueAujourdhui: true });

  assertEquals(parole, "Bonjour Léa ! 3 jours d'affilée, bravo !");
});
