import { assertEquals, assertRejects } from "@std/assert";
import { SeanceIncoherente } from "../domain/erreurs.ts";
import type { ProfilDeSeance } from "../domain/profil-de-seance.ts";
import type { SeanceTermineeAEnregistrer } from "../domain/seance-terminee-a-enregistrer.ts";
import { ecrire, leconDeDicteeDuChat, seanceDeDictee } from "../test_utils/lecons-de-dictee.ts";
import { LeconsDuCatalogueEnMemoire } from "../test_utils/lecons-du-catalogue-en-memoire.ts";
import { ProfilsDeSeanceEnMemoire } from "../test_utils/profils-de-seance-en-memoire.ts";
import { RattachementsEnMemoire } from "../test_utils/rattachements-en-memoire.ts";
import { ResultatsDesLeconsEnMemoire } from "../test_utils/resultats-des-lecons-en-memoire.ts";
import { SeancesTermineesEnMemoire } from "../test_utils/seances-terminees-en-memoire.ts";
import { TerminerLaSeance } from "./terminer-la-seance.ts";

function dicteeJoueeAvec(profil: ProfilDeSeance): SeanceTermineeAEnregistrer {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), profil);
  ecrire(seance, "chat");
  seance.terminer(new Date("2026-10-23T10:30:00Z"));
  return seance.aEnregistrer();
}

function terminerPour(profilDeLEnfant: ProfilDeSeance) {
  const resultats = new ResultatsDesLeconsEnMemoire();
  const seances = new SeancesTermineesEnMemoire(resultats);
  const terminer = new TerminerLaSeance(
    new RattachementsEnMemoire(["parent-paul", "profil-lea"]),
    new ProfilsDeSeanceEnMemoire(["profil-lea", profilDeLEnfant]),
    new LeconsDuCatalogueEnMemoire(leconDeDicteeDuChat()),
    seances,
    resultats,
  );
  return { seances, terminer };
}

Deno.test("un enfant de CE2 réglé en automatique qui a joué une dictée au clavier complet : la séance est acceptée", async () => {
  const profil: ProfilDeSeance = { clavierDesDictees: "automatique", niveau: "CE2" };
  const { seances, terminer } = terminerPour(profil);

  await terminer.executer({ parent: "parent-paul", seance: dicteeJoueeAvec(profil) });

  assertEquals(seances.toutes().map((s) => [s.seance, s.enfant, s.erreurs]), [["seance-1", "profil-lea", 0]]);
});

Deno.test("un enfant réglé « lettres du mot » dont l'envoi annonce un clavier complet : la séance est refusée", async () => {
  const { seances, terminer } = terminerPour({ clavierDesDictees: "lettresDuMot", niveau: "CE2" });
  const envoiAuClavierComplet = dicteeJoueeAvec({ clavierDesDictees: "clavierComplet", niveau: "CE2" });

  await assertRejects(
    () => terminer.executer({ parent: "parent-paul", seance: envoiAuClavierComplet }),
    SeanceIncoherente,
  );
  assertEquals(seances.toutes(), []);
});
