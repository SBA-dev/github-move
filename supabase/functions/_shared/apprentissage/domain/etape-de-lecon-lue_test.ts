import { assertEquals } from "@std/assert";
import { leconSonsOuOnAn } from "../test_utils/lecons-de-test.ts";
import { texteALireDeLEtape } from "./etape-de-lecon-lue.ts";

Deno.test("une étape de leçon sans exemple se lit par son seul texte", () => {
  const etape = leconSonsOuOnAn().etapes[0];

  assertEquals(texteALireDeLEtape(etape), [
    "Certains sons s'écrivent avec deux lettres. O et U ensemble font le son « ou », comme dans loup.",
  ]);
});

Deno.test("les exemples d'une étape de leçon se lisent après son texte, séparés par un point", () => {
  const etape = leconSonsOuOnAn().etapes[2];

  assertEquals(texteALireDeLEtape(etape), [
    "Écoute bien chaque mot, et cherche le son que tu entends.",
    "ou. on. an",
  ]);
});
