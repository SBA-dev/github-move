import { assertEquals } from "@std/assert";
import type { ProfilEnfant } from "../domain/profil-enfant.ts";
import type { SeanceTermineeAEnregistrer } from "../domain/seance-terminee-a-enregistrer.ts";
import { ecrire, leconDeDicteeDuChat, seanceDeDictee } from "../test_utils/lecons-de-dictee.ts";
import { FilesDeRevisionEnMemoire } from "../test_utils/files-de-revision-en-memoire.ts";
import { LeconsDuCatalogueEnMemoire } from "../test_utils/lecons-du-catalogue-en-memoire.ts";
import { RattachementsEnMemoire } from "../test_utils/rattachements-en-memoire.ts";
import { RecordsDeFluenceEnMemoire } from "../test_utils/records-de-fluence-en-memoire.ts";
import { ResultatsDesLeconsEnMemoire } from "../test_utils/resultats-des-lecons-en-memoire.ts";
import { SeancesTermineesEnMemoire } from "../test_utils/seances-terminees-en-memoire.ts";
import { TerminerLaSeance } from "./terminer-la-seance.ts";

function dicteeJoueeAvec(profil: ProfilEnfant): SeanceTermineeAEnregistrer {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), profil);
  ecrire(seance, "chat");
  seance.terminer(new Date("2026-10-23T10:30:00Z"));
  return seance.aEnregistrer();
}

function terminer() {
  const resultats = new ResultatsDesLeconsEnMemoire();
  const files = new FilesDeRevisionEnMemoire();
  const seances = new SeancesTermineesEnMemoire(resultats, files);
  const terminer = new TerminerLaSeance(
    new RattachementsEnMemoire(["parent-paul", "profil-lea"]),
    new LeconsDuCatalogueEnMemoire(leconDeDicteeDuChat()),
    seances,
    resultats,
    new RecordsDeFluenceEnMemoire(),
    files,
  );
  return { seances, terminer };
}

Deno.test("une dictée jouée au clavier complet est acceptée, quel que soit le réglage actuel de l'enfant", async () => {
  const { seances, terminer: cas } = terminer();
  const envoi = dicteeJoueeAvec({ clavierDesDictees: "clavierComplet", niveau: "CE2" });

  await cas.executer({ parent: "parent-paul", seance: envoi });

  assertEquals(seances.toutes().map((s) => [s.seance, s.enfant, s.erreurs]), [["seance-1", "profil-lea", 0]]);
});

Deno.test("une dictée jouée avec les lettres du mot est acceptée sans relire le profil", async () => {
  const { seances, terminer: cas } = terminer();
  const envoi = dicteeJoueeAvec({ clavierDesDictees: "lettresDuMot", niveau: "CP" });

  await cas.executer({ parent: "parent-paul", seance: envoi });

  assertEquals(seances.toutes().map((s) => [s.seance, s.enfant, s.erreurs]), [["seance-1", "profil-lea", 0]]);
});
