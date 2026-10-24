import { assert, assertEquals, assertThrows } from "@std/assert";
import {
  ecrire,
  leconDeDicteeDeChatEtLapin,
  leconDeDicteeDuChat,
  profilDeDictee,
  seanceDeDictee,
} from "../../test_utils/lecons-de-dictee.ts";
import { MotIncomplet, SeanceIncoherente } from "../erreurs.ts";
import { Reponse } from "../reponse.ts";
import { revaliderLaSeance } from "../revalider-la-seance.ts";

const FIN = new Date("2026-10-24T10:30:00Z");
const LETTRES_DU_MOT = profilDeDictee("lettresDuMot", "CP");
const CLAVIER_COMPLET = profilDeDictee("clavierComplet", "CM2");

Deno.test("avec les lettres du mot, le tirage des touches proposées est enregistré, une fois par mot", () => {
  const seance = seanceDeDictee(leconDeDicteeDeChatEtLapin(), LETTRES_DU_MOT);
  ecrire(seance, "chat");
  ecrire(seance, "lapin");
  seance.terminer(FIN);

  const { tirages } = seance.aEnregistrer();

  assertEquals(tirages.map((tirage) => tirage.length), [7, 8]);
});

Deno.test("avec le clavier complet, le tirage d'un mot est vide", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET);
  ecrire(seance, "chat");
  seance.terminer(FIN);

  assertEquals(seance.aEnregistrer().tirages, [[]]);
});

Deno.test("une séance de dictée enregistrée est rejouée à l'identique", () => {
  const seance = seanceDeDictee(leconDeDicteeDeChatEtLapin(), LETTRES_DU_MOT);
  ecrire(seance, "chta");
  ecrire(seance, "at");
  seance.direJeNeSaisPas();
  ecrire(seance, "lapin");
  const terminee = seance.terminer(FIN);

  const rejouee = revaliderLaSeance(leconDeDicteeDeChatEtLapin(), seance.aEnregistrer(), LETTRES_DU_MOT);

  assertEquals(rejouee, terminee);
});

Deno.test("une séance de dictée au clavier complet est rejouée à l'identique", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET);
  ecrire(seance, "bxyz");
  ecrire(seance, "chat");
  const terminee = seance.terminer(FIN);

  const rejouee = revaliderLaSeance(leconDeDicteeDuChat(), seance.aEnregistrer(), CLAVIER_COMPLET);

  assertEquals(rejouee.etoiles, 2);
  assertEquals(rejouee, terminee);
});

Deno.test("un mot faux envoyé comme réussi rend la séance incohérente", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET);
  ecrire(seance, "chat");
  seance.terminer(FIN);
  const envoi = seance.aEnregistrer();

  assertThrows(
    () =>
      revaliderLaSeance(leconDeDicteeDuChat(), {
        ...envoi,
        reponses: [[Reponse.motEcrit(["c", "h", "a", "s"])]],
      }, CLAVIER_COMPLET),
    SeanceIncoherente,
  );
});

Deno.test("la séance rejouée avec un autre réglage que celui du profil est incohérente", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET);
  ecrire(seance, "chat");
  seance.terminer(FIN);

  assertThrows(
    () => revaliderLaSeance(leconDeDicteeDuChat(), seance.aEnregistrer(), LETTRES_DU_MOT),
    SeanceIncoherente,
  );
});

Deno.test("un mot écrit forgé avec moins de lettres que de cases rend la séance incohérente, pour cause de mot incomplet", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET);
  ecrire(seance, "chat");
  seance.terminer(FIN);
  const envoi = { ...seance.aEnregistrer(), reponses: [[Reponse.motEcrit(["c", "h", "a"])]] };

  const erreur = assertThrows(
    () => revaliderLaSeance(leconDeDicteeDuChat(), envoi, CLAVIER_COMPLET),
    SeanceIncoherente,
  );

  assert(erreur.cause instanceof MotIncomplet);
});
