import { assertEquals, assertRejects } from "@std/assert";
import { type Lecon, lireLecon, matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { DefisTerminesEnMemoire } from "../test_utils/defis-termines-en-memoire.ts";
import { FilesDeRevisionEnMemoire } from "../test_utils/files-de-revision-en-memoire.ts";
import { LeconsDuCatalogueEnMemoire } from "../test_utils/lecons-du-catalogue-en-memoire.ts";
import { NiveauxDesProfilsEnMemoire } from "../test_utils/niveaux-des-profils-en-memoire.ts";
import { RattachementsEnMemoire } from "../test_utils/rattachements-en-memoire.ts";
import { ResultatsDesLeconsEnMemoire } from "../test_utils/resultats-des-lecons-en-memoire.ts";
import { ResultatsDesTestsDeDepartEnMemoire } from "../test_utils/resultats-des-tests-de-depart-en-memoire.ts";
import { CleDeQuestion } from "../domain/cle-de-question.ts";
import { type Defi, defisDeLaMatiere } from "../domain/defis-de-la-matiere.ts";
import type { DefiTermineAEnregistrer } from "../domain/defi-termine-a-enregistrer.ts";
import { DefiInconnu, ParentNonRattache } from "../domain/erreurs.ts";
import { Etoiles } from "../domain/etoiles.ts";
import { FileDeRevision, type QuestionRetenue } from "../domain/file-de-revision.ts";
import { IntervalleDeRevision } from "../domain/intervalle-de-revision.ts";
import { Jour } from "../domain/jour.ts";
import { type EntreesDuParcours, parcoursDeLaMatiere } from "../domain/parcours.ts";
import { type PlanDuDefi, planDuDefi } from "../domain/plan-du-defi.ts";
import { Reponse } from "../domain/reponse.ts";
import { ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";
import { SeanceDeDefi } from "../domain/seance-de-defi.ts";
import { tireurAuHasard } from "../domain/tireur.ts";
import { TerminerLeDefi } from "./terminer-le-defi.ts";

const CE1 = Niveau.de("CE1");
const maths = matiereDeCode("maths");
const finDuDefi = new Date("2026-10-29T16:30:00Z");
const jourDuDefi = Jour.de("2026-10-29");
const erreurFaiteLe = new Date("2026-10-28T16:30:00Z");

function uneLecon(index: number): Lecon {
  return lireLecon({
    id: `ma-ce1-${index}`,
    matiere: "maths",
    niveau: "CE1",
    titre: `Leçon ${index}`,
    ordre: index,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [{
      type: "bulles",
      questions: [1, 2, 3, 4].map((rang) => ({
        question: `Question ${rang} de la leçon ${index} ?`,
        choix: ["oui", "non"],
        reponse: "oui",
      })),
    }],
  });
}

const lecons = Array.from({ length: 10 }, (_, index) => uneLecon(index + 1));
const leconsReussies = lecons.slice(0, 5).map(({ id }) => id);

function entrees(): EntreesDuParcours {
  return { lecons, niveau: CE1, meilleuresEtoiles: new Map(leconsReussies.map((id) => [id, Etoiles.de(1)])) };
}

const defiNumero1: Defi = defisDeLaMatiere(parcoursDeLaMatiere(entrees(), maths), maths, CE1)[0];
const plan: PlanDuDefi = planDuDefi(defiNumero1, lecons, hasardSansMelange());
const [premiere, deuxieme, troisieme] = plan.questions;

/** Comme l'appareil : on joue le plan, les `fautes` premières questions avec une erreur avant la bonne réponse. */
function defiJoue({ id = "defi-1", fautes = 1 }: { id?: string; fautes?: number } = {}): DefiTermineAEnregistrer {
  const seance = SeanceDeDefi.commencer({
    id,
    enfant: "profil-lea",
    defi: defiNumero1,
    plan,
    lecons,
    tireurDe: () => tireurAuHasard(hasardSansMelange()),
    niveau: CE1,
  });
  plan.questions.forEach((_, rang) => {
    if (rang < fautes) seance.repondre(Reponse.choix("non"));
    seance.repondre(Reponse.choix("oui"));
  });
  seance.terminer(finDuDefi, jourDuDefi);
  return seance.aEnregistrer();
}

function retenue(identite: CleDeQuestion, origine: QuestionRetenue["origine"], jours: 1 | 3 | 7): QuestionRetenue {
  return {
    identite,
    origine,
    intervalle: IntervalleDeRevision.de(jours),
    dateDeRevision: Jour.de("2026-11-05"),
    derniereErreurLe: erreurFaiteLe,
    nombreDeFoisRatee: 1,
  };
}

function laFileDuProfil(...questions: QuestionRetenue[]): FileDeRevision {
  return FileDeRevision.reconstituer({ enfant: "profil-lea", questions, erreursCorrigeesPourDeBon: 0 });
}

function monde(file: FileDeRevision | null = null, catalogue: Lecon[] = lecons, niveauDuProfil: Niveau = CE1) {
  const files = new FilesDeRevisionEnMemoire();
  if (file) files.ecrire(file);
  const defis = new DefisTerminesEnMemoire(files);
  const resultats = new ResultatsDesLeconsEnMemoire();
  leconsReussies.forEach((id) => {
    const resultat = ResultatDeLaLecon.commencer("profil-lea", id);
    resultat.enregistrerSeance(1);
    resultats.ecrire(resultat);
  });
  const terminer = new TerminerLeDefi(
    new RattachementsEnMemoire(["parent-paul", "profil-lea"]),
    new LeconsDuCatalogueEnMemoire(...catalogue),
    new NiveauxDesProfilsEnMemoire(["profil-lea", niveauDuProfil]),
    resultats,
    new ResultatsDesTestsDeDepartEnMemoire(),
    files,
    defis,
  );
  return { files, defis, resultats, terminer };
}

function laFileApres(files: FilesDeRevisionEnMemoire) {
  return (files.fileDe("profil-lea")?.questions ?? []).map((
    { identite, intervalle, dateDeRevision, nombreDeFoisRatee },
  ) => [identite.valeur, intervalle.jours, dateDeRevision.toString(), nombreDeFoisRatee]);
}

Deno.test("un défi ouvert terminé est enregistré : il devient un défi relevé", async () => {
  const { defis, terminer } = monde();

  const faits = await terminer.executer({ parent: "parent-paul", defi: defiJoue() });

  assertEquals(faits.map((fait) => fait.type), ["DefiTermine"]);
  assertEquals(defis.tous().map(({ id }) => id), ["defi-1"]);
  assertEquals(await defis.releves("profil-lea"), [{ matiere: maths, niveau: CE1, numero: 1 }]);
});

Deno.test("une question ratée pendant le défi entre dans la file de révision, due le lendemain, avec sa leçon d'origine", async () => {
  const { files, terminer } = monde();

  await terminer.executer({ parent: "parent-paul", defi: defiJoue({ fautes: 1 }) });

  assertEquals(laFileApres(files), [[premiere.identite.valeur, 1, "2026-10-30", 1]]);
  assertEquals(files.fileDe("profil-lea")?.questions[0].origine, premiere.origine);
});

Deno.test("une question ratée déjà dans la file est ratée de nouveau, sa leçon d'origine ne change pas", async () => {
  const autreOrigine = { leconDOrigine: "ma-ce1-autre", position: 0, type: "bulles" as const };
  const { files, terminer } = monde(laFileDuProfil(retenue(premiere.identite, autreOrigine, 7)));

  await terminer.executer({ parent: "parent-paul", defi: defiJoue({ fautes: 1 }) });

  assertEquals(laFileApres(files), [[premiere.identite.valeur, 1, "2026-10-30", 2]]);
  assertEquals(files.fileDe("profil-lea")?.questions[0].origine, autreOrigine);
});

Deno.test("une question juste pendant le défi ne change rien à la file, même si elle y est retenue", async () => {
  const dejaRetenue = retenue(troisieme.identite, troisieme.origine, 3);
  const { files, terminer } = monde(laFileDuProfil(dejaRetenue));

  await terminer.executer({ parent: "parent-paul", defi: defiJoue({ fautes: 1 }) });

  const retenues = files.fileDe("profil-lea")?.questions ?? [];
  assertEquals(
    retenues.filter(({ identite }) => identite.valeur === troisieme.identite.valeur).map((
      { intervalle, dateDeRevision, nombreDeFoisRatee },
    ) => [intervalle.jours, dateDeRevision.toString(), nombreDeFoisRatee]),
    [[3, "2026-11-05", 1]],
  );
  assertEquals(files.fileDe("profil-lea")?.erreursCorrigeesPourDeBon, 0);
});

Deno.test("un défi sans aucune erreur est enregistré sans rien retenir", async () => {
  const { files, defis, terminer } = monde();

  await terminer.executer({ parent: "parent-paul", defi: defiJoue({ fautes: 0 }) });

  assertEquals(defis.tous().length, 1);
  assertEquals(laFileApres(files), []);
});

Deno.test("un défi terminé ne crée aucune étoile et ne touche à aucun résultat de leçon", async () => {
  const { resultats, terminer } = monde();

  await terminer.executer({ parent: "parent-paul", defi: defiJoue() });

  assertEquals(resultats.nombreDeSeances("profil-lea", "ma-ce1-1"), 1);
  assertEquals(resultats.nombreDeSeances("profil-lea", "ma-ce1-6"), 0);
});

Deno.test("un défi est enregistré quand la classe du profil, lue à part, est une autre instance de la même classe", async () => {
  const { defis, terminer } = monde(null, lecons, Niveau.de("CE1"));

  await terminer.executer({ parent: "parent-paul", defi: defiJoue() });

  assertEquals(defis.tous().map(({ id }) => id), ["defi-1"]);
});

Deno.test("un parent non rattaché au profil ne peut rien enregistrer", async () => {
  const { files, defis, terminer } = monde();

  await assertRejects(() => terminer.executer({ parent: "parent-intrus", defi: defiJoue() }), ParentNonRattache);
  assertEquals(defis.tous(), []);
  assertEquals(files.version("profil-lea"), 0);
});

Deno.test("un défi refusé par la revalidation n'écrit rien, ni défi ni file de révision", async () => {
  const { files, defis, terminer } = monde(laFileDuProfil());
  const inconnu = { ...defiJoue(), defi: { ...defiJoue().defi, numero: 99 } };

  await assertRejects(() => terminer.executer({ parent: "parent-paul", defi: inconnu }), DefiInconnu);
  assertEquals(defis.tous(), []);
  assertEquals(files.version("profil-lea"), 1);
});

Deno.test("un défi dont les leçons ne sont plus au catalogue est refusé sans rien écrire", async () => {
  const { files, defis, terminer } = monde(null, []);

  await assertRejects(() => terminer.executer({ parent: "parent-paul", defi: defiJoue() }), DefiInconnu);
  assertEquals(defis.tous(), []);
  assertEquals(files.version("profil-lea"), 0);
});

Deno.test("un défi renvoyé une seconde fois n'est enregistré qu'une fois et ne retient pas deux fois ses questions ratées", async () => {
  const { files, defis, terminer } = monde();
  const envoi = defiJoue({ fautes: 1 });
  await terminer.executer({ parent: "parent-paul", defi: envoi });
  const versionApresLePremierEnvoi = files.version("profil-lea");

  const faits = await terminer.executer({ parent: "parent-paul", defi: envoi });

  assertEquals(faits, []);
  assertEquals(defis.tous().length, 1);
  assertEquals(files.version("profil-lea"), versionApresLePremierEnvoi);
  assertEquals(laFileApres(files), [[premiere.identite.valeur, 1, "2026-10-30", 1]]);
});

Deno.test("une file modifiée entre-temps par un autre appareil est relue : les questions ratées s'ajoutent à la file à jour", async () => {
  const { files, defis, terminer } = monde(laFileDuProfil());
  const ailleurs = CleDeQuestion.de("bulles", "Une question ratée ailleurs ?oui");
  files.apresLaProchaineLecture((file) =>
    file.retenir(
      [{ identite: ailleurs, origine: { leconDOrigine: "fr-ce1-autre", position: 0, type: "bulles" } }],
      Jour.de("2026-10-29"),
      new Date("2026-10-29T09:00:00Z"),
    )
  );

  const faits = await terminer.executer({ parent: "parent-paul", defi: defiJoue({ fautes: 1 }) });

  assertEquals(laFileApres(files).map(([cle]) => cle).sort(), [ailleurs.valeur, premiere.identite.valeur].sort());
  assertEquals(defis.tous().length, 1);
  assertEquals(faits.map((fait) => fait.type), ["DefiTermine"]);
});

Deno.test("une file modifiée en continu par un autre appareil fait abandonner l'écriture après 3 essais, sans rien écrire", async () => {
  const { files, defis, terminer } = monde(laFileDuProfil());
  files.apresChaqueLecture((file) => file.oublier(deuxieme.identite));

  await assertRejects(() => terminer.executer({ parent: "parent-paul", defi: defiJoue() }));
  assertEquals(defis.tous(), []);
});
