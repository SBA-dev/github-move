import { assertEquals, assertRejects } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDUneSeuleFluenceAuCP } from "../test_utils/lecons-de-fluence.ts";
import { LeconsDuCatalogueEnMemoire } from "../test_utils/lecons-du-catalogue-en-memoire.ts";
import { RattachementsEnMemoire } from "../test_utils/rattachements-en-memoire.ts";
import { RecordsDeFluenceEnMemoire } from "../test_utils/records-de-fluence-en-memoire.ts";
import { ResultatsDesLeconsEnMemoire } from "../test_utils/resultats-des-lecons-en-memoire.ts";
import { SeancesTermineesEnMemoire } from "../test_utils/seances-terminees-en-memoire.ts";
import { ChoixDeSeance } from "../domain/choix-de-seance.ts";
import { Reponse } from "../domain/reponse.ts";
import { Seance } from "../domain/seance.ts";
import type { SeanceTermineeAEnregistrer } from "../domain/seance-terminee-a-enregistrer.ts";
import { TerminerLaSeance } from "./terminer-la-seance.ts";

const debut = new Date("2026-10-23T10:00:00Z");
const apres = (secondes: number) => new Date(debut.getTime() + secondes * 1000);
const exercice = "Calcul rapide : les doubles";

function envoiDUneFluence(identifiant: string, bonnesReponses: number): SeanceTermineeAEnregistrer {
  const seance = Seance.commencer(
    generateurIdFixe(identifiant),
    hasardSansMelange(),
    "profil-lea",
    leconDUneSeuleFluenceAuCP(),
    ChoixDeSeance.complete(),
  );
  seance.demarrerLaFluence(debut);
  for (let i = 1; i <= bonnesReponses; i++) seance.repondre(Reponse.nombre(20), apres(i));
  seance.finirLaFluence(apres(45));
  seance.terminer(apres(60));
  return seance.aEnregistrer();
}

function monde() {
  const resultats = new ResultatsDesLeconsEnMemoire();
  const seances = new SeancesTermineesEnMemoire(resultats);
  const records = new RecordsDeFluenceEnMemoire();
  const terminer = new TerminerLaSeance(
    new RattachementsEnMemoire(["parent-paul", "profil-lea"]),
    new LeconsDuCatalogueEnMemoire(leconDUneSeuleFluenceAuCP()),
    seances,
    resultats,
    records,
  );
  return { seances, resultats, records, terminer };
}

Deno.test("une séance faite seulement d'une fluence est enregistrée sans toucher au résultat de la leçon", async () => {
  const { seances, resultats, terminer } = monde();

  const faits = await terminer.executer({ parent: "parent-paul", seance: envoiDUneFluence("seance-1", 1) });

  assertEquals(seances.toutes().map((s) => [s.seance, s.etoiles]), [["seance-1", undefined]]);
  assertEquals(await resultats.de("profil-lea", "ma-cp-doubles-fluence"), null);
  assertEquals(faits.map((fait) => fait.type), ["SeanceTerminee"]);
});

Deno.test("le score d'une fluence devient le record de l'enfant pour cet exercice", async () => {
  const { records, terminer } = monde();

  await terminer.executer({ parent: "parent-paul", seance: envoiDUneFluence("seance-1", 1) });

  const record = await records.lire("profil-lea", "ma-cp-doubles-fluence", exercice);
  assertEquals(record?.meilleurScore, 1);
});

Deno.test("battre son record de fluence annonce NouveauRecordDeFluence", async () => {
  const { records, terminer } = monde();
  await terminer.executer({ parent: "parent-paul", seance: envoiDUneFluence("seance-1", 1) });

  const faits = await terminer.executer({ parent: "parent-paul", seance: envoiDUneFluence("seance-2", 2) });

  assertEquals(faits.map((fait) => fait.type), ["SeanceTerminee", "NouveauRecordDeFluence"]);
  assertEquals((await records.lire("profil-lea", "ma-cp-doubles-fluence", exercice))?.meilleurScore, 2);
});

Deno.test("un renvoi après un échec d'écriture du record enregistre le record", async () => {
  const { records, terminer } = monde();
  records.echouerALaProchaineEcriture();
  await assertRejects(() => terminer.executer({ parent: "parent-paul", seance: envoiDUneFluence("seance-1", 3) }));

  await terminer.executer({ parent: "parent-paul", seance: envoiDUneFluence("seance-1", 3) });

  assertEquals((await records.lire("profil-lea", "ma-cp-doubles-fluence", exercice))?.meilleurScore, 3);
});
