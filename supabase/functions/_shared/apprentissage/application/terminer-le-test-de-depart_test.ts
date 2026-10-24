import { assertEquals, assertRejects } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { LeconsDuCatalogueEnMemoire } from "../test_utils/lecons-du-catalogue-en-memoire.ts";
import { NiveauxDesProfilsEnMemoire } from "../test_utils/niveaux-des-profils-en-memoire.ts";
import { RattachementsEnMemoire } from "../test_utils/rattachements-en-memoire.ts";
import { ResultatsDesTestsDeDepartEnMemoire } from "../test_utils/resultats-des-tests-de-depart-en-memoire.ts";
import { ParentNonRattache, TestDeDepartIncoherent } from "../domain/erreurs.ts";
import { planDuTestDeDepart } from "../domain/plan-du-test-de-depart.ts";
import { Reponse } from "../domain/reponse.ts";
import { TestDeDepart } from "../domain/test-de-depart.ts";
import type { TestDeDepartTermineAEnregistrer } from "../domain/test-de-depart-termine-a-enregistrer.ts";
import { tireurAuHasard } from "../domain/tireur.ts";
import { TerminerLeTestDeDepart } from "./terminer-le-test-de-depart.ts";

const CE1 = Niveau.de("CE1");
const bonne = Reponse.choix("bonne");
const mauvaise = Reponse.choix("mauvaise");

function uneLecon(rang: number): Lecon {
  return lireLecon({
    id: `francais-CE1-${rang + 1}`,
    matiere: "francais",
    niveau: "CE1",
    titre: `Leçon ${rang + 1}`,
    ordre: rang + 1,
    programme: { section: "section", citation: "citation" },
    exercices: [{
      type: "bulles",
      questions: [{ question: `Question ${rang + 1} ?`, choix: ["bonne", "mauvaise"], reponse: "bonne" }],
    }],
  });
}

const lecons = [uneLecon(0), uneLecon(1), uneLecon(2)];

function envoi(
  reponses: Parameters<TestDeDepart["repondre"]>[0][],
  { test = "test-1", termineeLe = new Date("2026-10-24T10:00:00Z") } = {},
): TestDeDepartTermineAEnregistrer {
  const jeu = TestDeDepart.commencer({
    generateurId: generateurIdFixe(test),
    enfant: "profil-lea",
    niveau: CE1,
    lecons,
    plan: planDuTestDeDepart(lecons, CE1, hasardSansMelange()),
    tireur: tireurAuHasard(hasardSansMelange()),
  });
  reponses.forEach((reponse) => jeu.repondre(reponse));
  jeu.terminer(termineeLe);
  return jeu.aEnregistrer();
}

function monde() {
  const resultats = new ResultatsDesTestsDeDepartEnMemoire();
  const terminer = new TerminerLeTestDeDepart(
    new RattachementsEnMemoire(["parent-paul", "profil-lea"]),
    new LeconsDuCatalogueEnMemoire(...lecons),
    new NiveauxDesProfilsEnMemoire(["profil-lea", CE1]),
    resultats,
  );
  return { resultats, terminer };
}

Deno.test("un parent non rattaché à l'enfant ne peut rien enregistrer", async () => {
  const { resultats, terminer } = monde();

  await assertRejects(
    () => terminer.executer({ parent: "parent-intrus", test: envoi([bonne, bonne, bonne]) }),
    ParentNonRattache,
  );
  assertEquals(await resultats.de("profil-lea"), null);
});

Deno.test("un envoi cohérent est revalidé, ses leçons réussies au test de départ sont enregistrées et TestDeDepartTermine est publié", async () => {
  const { resultats, terminer } = monde();

  const faits = await terminer.executer({ parent: "parent-paul", test: envoi([bonne, bonne, bonne]) });

  const resultat = await resultats.de("profil-lea");
  assertEquals([...resultat?.leconsReussies ?? []].sort(), lecons.map(({ id }) => id));
  assertEquals(resultat?.faitLe, new Date("2026-10-24T10:00:00Z"));
  assertEquals(faits.map((fait) => [fait.type, fait.test, fait.enfant, [...fait.leconsReussies].sort()]), [
    ["TestDeDepartTermine", "test-1", "profil-lea", lecons.map(({ id }) => id)],
  ]);
});

Deno.test("un test de départ de plus réunit ses leçons réussies à celles déjà enregistrées", async () => {
  const { resultats, terminer } = monde();
  await terminer.executer({ parent: "parent-paul", test: envoi([bonne, bonne, bonne], { test: "test-1" }) });

  await terminer.executer({
    parent: "parent-paul",
    test: envoi([mauvaise, bonne, mauvaise, bonne, mauvaise, bonne], { test: "test-2" }),
  });

  assertEquals([...(await resultats.de("profil-lea"))?.leconsReussies ?? []].sort(), lecons.map(({ id }) => id));
});

Deno.test("un envoi incohérent est refusé sans rien enregistrer", async () => {
  const { resultats, terminer } = monde();
  const sansLaBonneReponse = { ...envoi([bonne, bonne, bonne]), reponses: [[mauvaise], [bonne], [bonne]] };

  await assertRejects(
    () => terminer.executer({ parent: "parent-paul", test: sansLaBonneReponse }),
    TestDeDepartIncoherent,
  );
  assertEquals(await resultats.de("profil-lea"), null);
});

Deno.test("le même test de départ envoyé deux fois n'est compté qu'une fois et n'est pas republié", async () => {
  const { resultats, terminer } = monde();
  await terminer.executer({ parent: "parent-paul", test: envoi([bonne, bonne, bonne]) });
  const avant = await resultats.de("profil-lea");

  const faits = await terminer.executer({ parent: "parent-paul", test: envoi([bonne, bonne, bonne]) });

  assertEquals(faits, []);
  assertEquals(await resultats.de("profil-lea"), avant);
});
