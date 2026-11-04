import { assertEquals } from "@std/assert";
import { type CodeDeMatiere, libelleCourtDe, matiereAvecArticle, matiereAvecDe } from "./matiere.ts";

Deno.test("chaque matière a un libellé court pour les petits espaces", () => {
  const libellesCourts: Record<CodeDeMatiere, string> = {
    francais: "Français",
    maths: "Maths",
    sciences: "Sciences",
    histoire: "Histoire-géo",
    anglais: "Anglais",
    emc: "Vivre ensemble",
  };

  for (const [code, libelle] of Object.entries(libellesCourts)) {
    assertEquals(libelleCourtDe(code as CodeDeMatiere), libelle);
  }
});

Deno.test("chaque matière se nomme avec son article défini contracté dans une phrase", () => {
  const formes: Record<CodeDeMatiere, string> = {
    francais: "du français",
    maths: "des maths",
    sciences: "des sciences",
    histoire: "de l'histoire-géo",
    anglais: "de l'anglais",
    emc: "du vivre ensemble",
  };

  for (const [code, forme] of Object.entries(formes)) {
    assertEquals(matiereAvecArticle(code as CodeDeMatiere), forme);
  }
});
