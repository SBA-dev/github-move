import { assertEquals } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDeSoustractionsAuCE1, leconLesDoublesAuCP } from "../test_utils/lecons-de-calcul.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";
import { Seance } from "./seance.ts";

const fin = new Date("2026-10-23T10:30:00Z");

function commencer(lecon: Lecon): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    lecon,
    ChoixDeSeance.complete(),
  );
}

Deno.test("un calcul du CE1 se joue au clavier de cristaux, avec une erreur comptée pour les étoiles", () => {
  const seance = commencer(leconDeSoustractionsAuCE1());

  seance.repondre(Reponse.nombre(8));
  seance.repondre(Reponse.nombre(7));
  seance.repondre(Reponse.nombre(5));
  const fait = seance.terminer(fin);

  assertEquals([fait.etoiles, fait.erreurs, fait.parType.calcul], [2, 1, { reussites: 2, erreurs: 1 }]);
});

Deno.test("les opérations d'un calcul se posent dans l'ordre de la leçon", () => {
  const seance = commencer(leconDeSoustractionsAuCE1());

  const resultat = seance.repondre(Reponse.nombre(5));

  assertEquals(resultat, "fausse");
});

Deno.test("un calcul du CP propose des choix autour du résultat", () => {
  const seance = commencer(leconLesDoublesAuCP());

  const [choixDeLaPremiereOperation] = seance.exerciceEnCours()!.tirages();

  assertEquals([...choixDeLaPremiereOperation].sort(), ["3", "4", "5", "6"]);
});

Deno.test("rejouer une séance de calcul faite au clavier redonne le même résultat", () => {
  const lecon = leconDeSoustractionsAuCE1();
  const seance = commencer(lecon);
  seance.repondre(Reponse.nombre(8));
  seance.repondre(Reponse.nombre(7));
  seance.direJeNeSaisPas();
  seance.repondre(Reponse.nombre(5));
  const fait = seance.terminer(fin);

  assertEquals(revaliderLaSeance(lecon, seance.aEnregistrer()), fait);
});
