import { assertEquals } from "@std/assert";
import { texteALireDeLEtape } from "./etape-de-lecon-lue.ts";

Deno.test("une étape de leçon sans exemple se lit par son seul texte", () => {
  const etape = { texte: "Écoute bien chaque mot.", exemples: [] };

  assertEquals(texteALireDeLEtape(etape), ["Écoute bien chaque mot."]);
});

Deno.test("une étape de leçon se lit en deux temps : son texte, puis ses exemples joints par des points", () => {
  const etape = { texte: "Écoute bien chaque mot.", exemples: ["ou", "on", "an"] };

  assertEquals(texteALireDeLEtape(etape), ["Écoute bien chaque mot.", "ou. on. an"]);
});
