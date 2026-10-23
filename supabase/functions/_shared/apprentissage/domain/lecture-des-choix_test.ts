import { assertEquals } from "@std/assert";
import { lectureDesChoix } from "./lecture-des-choix.ts";

Deno.test("les choix sont lus dans l'ordre donné : « Est-ce 6, 7, 8, ou 9 ? »", () => {
  assertEquals(
    lectureDesChoix(["6", "7", "8", "9"]),
    "Est-ce 6, 7, 8, ou 9 ?",
  );
});

Deno.test("deux choix sont lus : « Est-ce 6, ou 7 ? »", () => {
  assertEquals(lectureDesChoix(["6", "7"]), "Est-ce 6, ou 7 ?");
});

Deno.test("il n'y a rien à lire quand il reste moins de deux choix", () => {
  assertEquals(lectureDesChoix(["7"]), undefined);
  assertEquals(lectureDesChoix([]), undefined);
});
