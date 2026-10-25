import { assertEquals } from "@std/assert";
import { estUnMotDictable } from "./mot-dictable.ts";

Deno.test("un élément sans aucune lettre n'est pas un mot dictable", () => {
  assertEquals(["-", "'", "’", "- '", "2024"].map(estUnMotDictable), [false, false, false, false, false]);
});
