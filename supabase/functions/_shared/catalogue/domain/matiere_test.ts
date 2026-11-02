import { assertEquals } from "@std/assert";
import { type CodeDeMatiere, libelleCourtDe } from "./matiere.ts";

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
