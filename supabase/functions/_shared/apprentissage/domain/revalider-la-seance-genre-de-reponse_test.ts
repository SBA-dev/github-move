import { assertInstanceOf, assertThrows } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import {
  leconPoserUneAdditionEnColonnesAuCP,
  POSITION_DE_LA_LECON_EN_ACTION,
} from "../test_utils/lecons-d-addition.ts";
import { leconDeSoustractionsAuCE1 } from "../test_utils/lecons-de-calcul.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { ReponseIncompatible, SeanceIncoherente } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";
import { Seance } from "./seance.ts";

const fin = new Date("2026-10-24T10:30:00Z");

Deno.test("une soustraction au clavier répondue par un choix au lieu d'un nombre rend la séance incohérente", () => {
  const lecon = leconDeSoustractionsAuCE1();
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    lecon,
    ChoixDeSeance.complete(),
  );
  seance.repondre(Reponse.nombre(7));
  seance.repondre(Reponse.nombre(5));
  seance.terminer(fin);
  const envoi = seance.aEnregistrer();
  const forge = { ...envoi, reponses: [[Reponse.choix("7")], ...envoi.reponses.slice(1)] };

  const erreur = assertThrows(() => revaliderLaSeance(lecon, forge), SeanceIncoherente);

  assertInstanceOf(erreur.cause, ReponseIncompatible);
});

Deno.test("une addition posée répondue par un mot écrit au lieu d'un placement rend la séance incohérente", () => {
  const lecon = leconPoserUneAdditionEnColonnesAuCP();
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    lecon,
    ChoixDeSeance.unExercice(POSITION_DE_LA_LECON_EN_ACTION),
  );
  seance.repondre(Reponse.placement("4", "dizaines"));
  seance.repondre(Reponse.placement("5", "unites"));
  seance.repondre(Reponse.placement("3", "dizaines"));
  seance.repondre(Reponse.placement("7", "unites"));
  seance.repondre(Reponse.choix("11"));
  seance.repondre(Reponse.choix("12"));
  seance.repondre(Reponse.choix("8"));
  seance.terminer(fin);
  const envoi = seance.aEnregistrer();
  const forge = { ...envoi, reponses: [[Reponse.motEcrit(["4"])], ...envoi.reponses.slice(1)] };

  const erreur = assertThrows(() => revaliderLaSeance(lecon, forge), SeanceIncoherente);

  assertInstanceOf(erreur.cause, ReponseIncompatible);
});
