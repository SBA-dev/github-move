import { assertEquals } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDUneFluenceDe1a20AuCE1 } from "../test_utils/lecons-de-fluence.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { Seance } from "./seance.ts";

Deno.test("la facilité de l'adaptation de la difficulté ne réduit pas les nombres d'une fluence", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    leconDUneFluenceDe1a20AuCE1(),
    ChoixDeSeance.complete(),
    0.65,
  );

  const tirages = seance.exerciceEnCours()!.tirages();

  assertEquals(tirages, [["20 × 1 = 20"]]);
});
