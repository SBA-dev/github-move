import { assertEquals, assertInstanceOf, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardFixe, hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDAdditionsTireesDe1a5AuCE1, leconDUneAdditionTireeDe1a20AuCE1 } from "../test_utils/lecons-de-calcul.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { SeanceIncoherente, TirageHorsDuGenerateur } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";
import { Seance } from "./seance.ts";

const fin = new Date("2026-10-23T10:30:00Z");

function commencer(lecon: Lecon, hasard: Hasard, facilite?: number): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasard,
    "profil-tom",
    lecon,
    ChoixDeSeance.complete(),
    facilite,
  );
}

function seanceTermineeAvecLeTirage(tirage: string[], reponses: number[]) {
  const lecon = leconDAdditionsTireesDe1a5AuCE1();
  const seance = commencer(lecon, hasardFixe(0, 0.2, 0.4, 0.6, 0.8, 0.999));
  reponses.forEach((reponse) => seance.repondre(Reponse.nombre(reponse)));
  seance.terminer(fin);
  return { lecon, envoi: { ...seance.aEnregistrer(), tirages: [tirage] } };
}

Deno.test("un calcul tiré par un générateur d'additions de 1 à 5 donne trois calculs de deux nombres entre 1 et 5", () => {
  const seance = commencer(leconDAdditionsTireesDe1a5AuCE1(), hasardFixe(0, 0.2, 0.4, 0.6, 0.8, 0.999));

  const tirages = seance.exerciceEnCours()!.tirages();

  assertEquals(tirages, [["1 + 2 = 3", "3 + 4 = 7", "5 + 5 = 10"]]);
});

Deno.test("la facilité de l'adaptation de la difficulté réduit les nombres tirés", () => {
  const seance = commencer(leconDUneAdditionTireeDe1a20AuCE1(), hasardSansMelange(), 0.65);

  const tirages = seance.exerciceEnCours()!.tirages();

  assertEquals(tirages, [["13 + 13 = 26"]]);
});

Deno.test("rejouer une séance de calcul tiré redonne le même résultat", () => {
  const lecon = leconDAdditionsTireesDe1a5AuCE1();
  const seance = commencer(lecon, hasardFixe(0, 0.2, 0.4, 0.6, 0.8, 0.999));
  seance.repondre(Reponse.nombre(3));
  seance.repondre(Reponse.nombre(6));
  seance.repondre(Reponse.nombre(7));
  seance.repondre(Reponse.nombre(10));
  const fait = seance.terminer(fin);

  assertEquals(revaliderLaSeance(lecon, seance.aEnregistrer()), fait);
});

Deno.test("le serveur refuse une séance dont une opération tirée sort des intervalles du générateur", () => {
  const { lecon, envoi } = seanceTermineeAvecLeTirage(["1 + 2 = 3", "3 + 4 = 7", "5 + 5 = 10"], [3, 7, 10]);
  const horsGenerateur = { ...envoi, tirages: [["30 + 2 = 32", "3 + 4 = 7", "5 + 5 = 10"]] };

  const erreur = assertThrows(() => revaliderLaSeance(lecon, horsGenerateur), SeanceIncoherente);

  assertInstanceOf(erreur.cause, TirageHorsDuGenerateur);
});

Deno.test("le serveur refuse une séance dont le résultat d'une opération ne correspond pas à l'énoncé", () => {
  const { lecon, envoi } = seanceTermineeAvecLeTirage(["1 + 2 = 3", "3 + 4 = 7", "5 + 5 = 10"], [3, 7, 10]);
  const mauvaisResultat = { ...envoi, tirages: [["1 + 2 = 4", "3 + 4 = 7", "5 + 5 = 10"]] };

  assertThrows(() => revaliderLaSeance(lecon, mauvaisResultat), SeanceIncoherente);
});
