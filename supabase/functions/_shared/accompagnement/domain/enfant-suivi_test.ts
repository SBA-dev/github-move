import { assertEquals } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { ProfilEnfantId } from "../../famille/domain/index.ts";
import { enfantSuivi } from "./enfant-suivi.ts";
import type { ProfilSuivi } from "./entrees-du-suivi.ts";

function unProfil(id: string, prenom: string, niveau: string): ProfilSuivi {
  return { id: ProfilEnfantId.de(id), prenom, niveau: Niveau.de(niveau) };
}

const lea = unProfil("profil-lea", "Léa", "CE1");
const tom = unProfil("profil-tom", "Tom", "CM2");

Deno.test("sans choix, l'enfant suivi est le premier profil rattaché", () => {
  assertEquals(enfantSuivi([lea, tom]), lea);
});

Deno.test("le parent suit l'enfant qu'il a choisi parmi ses profils rattachés", () => {
  assertEquals(enfantSuivi([lea, tom], ProfilEnfantId.de("profil-tom")), tom);
});

Deno.test("un choix qui ne désigne aucun profil rattaché retombe sur le premier profil", () => {
  assertEquals(enfantSuivi([lea, tom], ProfilEnfantId.de("profil-supprime")), lea);
});

Deno.test("sans profil rattaché, il n'y a pas d'enfant suivi", () => {
  assertEquals(enfantSuivi([]), undefined);
});
