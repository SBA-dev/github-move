import { assertEquals } from "@std/assert";
import { adresseDuMp3 } from "./adresse-du-mp3.ts";

Deno.test("l'adresse du MP3 d'une phrase à l'allure normale ne porte que sa clé et son empreinte", () => {
  assertEquals(adresseDuMp3("0123456789abcdef", "a1b2c3d4", "normale"), "/voix/0123456789abcdef-a1b2c3d4.mp3");
});

Deno.test("l'adresse du MP3 d'une phrase à l'allure lente porte la mention lente", () => {
  assertEquals(adresseDuMp3("0123456789abcdef", "a1b2c3d4", "lente"), "/voix/0123456789abcdef-lente-a1b2c3d4.mp3");
});
