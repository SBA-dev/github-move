import { assertEquals, assertRejects } from "@std/assert";
import { matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "../domain/cle-de-question.ts";
import type { DefiTermine } from "../domain/seance-de-defi.ts";
import { FileDeRevision } from "../domain/file-de-revision.ts";
import { IntervalleDeRevision } from "../domain/intervalle-de-revision.ts";
import { Jour } from "../domain/jour.ts";
import { clientSupabaseFactice } from "../test_utils/client-supabase-factice.ts";
import { DefisTerminesSupabase } from "./defis-termines-supabase.ts";

const ENFANT = "9a1b2c3d-4e5f-4a6b-8c7d-0e1f2a3b4c5d";
const AUTRE_ENFANT = "1d2c3b4a-5f6e-4d7c-8b9a-0f1e2d3c4b5a";
const DEFI = "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b";

const clientDuServeurInutilise = clientSupabaseFactice().client;
const clientDuParentInutilise = clientSupabaseFactice().client;

const fait: DefiTermine = {
  type: "DefiTermine",
  id: DEFI,
  enfant: ENFANT,
  defi: { matiere: matiereDeCode("maths"), niveau: Niveau.de("CE1"), numero: 2, lecons: ["ma-ce1-addition"] },
  nombreDeQuestions: 10,
  questionsRatees: [],
  termineeLe: new Date("2026-10-29T08:30:00.000Z"),
  jour: Jour.de("2026-10-29"),
};

const file = FileDeRevision.reconstituer({
  enfant: ENFANT,
  erreursCorrigeesPourDeBon: 1,
  questions: [{
    identite: CleDeQuestion.de("ecoute", "cat"),
    origine: { leconDOrigine: "fr-cp-lecture", position: 1, type: "ecoute", tirage: "a|b" },
    intervalle: IntervalleDeRevision.de(1),
    dateDeRevision: Jour.de("2026-10-30"),
    derniereErreurLe: new Date("2026-10-29T08:30:00.000Z"),
    nombreDeFoisRatee: 2,
  }],
});

Deno.test("les défis relevés d'un enfant sont lus dans sa table et rendus avec leur matière et leur niveau", async () => {
  const faux = clientSupabaseFactice({
    tables: {
      defis_termines: [
        { profil: ENFANT, matiere: "maths", classe: "CE1", numero: 2 },
        { profil: ENFANT, matiere: "francais", classe: "CP", numero: 1 },
        { profil: AUTRE_ENFANT, matiere: "anglais", classe: "CM2", numero: 3 },
      ],
    },
  });

  const releves = await new DefisTerminesSupabase(faux.client, clientDuServeurInutilise).releves(ENFANT);

  assertEquals(releves, [
    { matiere: matiereDeCode("maths"), niveau: Niveau.de("CE1"), numero: 2 },
    { matiere: matiereDeCode("francais"), niveau: Niveau.de("CP"), numero: 1 },
  ]);
  assertEquals(faux.lectures, [{ table: "defis_termines", filtres: { profil: ENFANT } }]);
});

Deno.test("une ligne illisible des défis relevés (matière ou classe inconnue) est ignorée", async () => {
  const faux = clientSupabaseFactice({
    tables: {
      defis_termines: [
        { profil: ENFANT, matiere: "danse", classe: "CE1", numero: 2 },
        { profil: ENFANT, matiere: "maths", classe: "6e", numero: 2 },
        { profil: ENFANT, matiere: "emc", classe: "CM1", numero: 1 },
      ],
    },
  });

  const releves = await new DefisTerminesSupabase(faux.client, clientDuServeurInutilise).releves(ENFANT);

  assertEquals(releves, [{ matiere: matiereDeCode("emc"), niveau: Niveau.de("CM1"), numero: 1 }]);
});

Deno.test("une erreur de la base à la lecture des défis relevés est remontée", async () => {
  const faux = clientSupabaseFactice();
  const client = () => {
    const c = faux.client() as unknown as { from: (t: string) => Record<string, unknown> };
    const requete: Record<string, unknown> = {
      select: () => requete,
      eq: () => requete,
      then: (f: (r: unknown) => unknown) => Promise.resolve({ data: null, error: { message: "panne" } }).then(f),
    };
    c.from = () => requete;
    return c as never;
  };

  await assertRejects(
    () => new DefisTerminesSupabase(client, clientDuServeurInutilise).releves(ENFANT),
    Error,
    "panne",
  );
});

Deno.test("le défi terminé et la file sont écrits par la fonction Postgres dédiée", async () => {
  const faux = clientSupabaseFactice({ reponseDeFonction: { data: "enregistree" } });

  const issue = await new DefisTerminesSupabase(clientDuParentInutilise, faux.client).enregistrer(fait, {
    file,
    versionLue: 7,
  });

  assertEquals(faux.appels, [{
    fonction: "enregistrer_le_defi_termine",
    parametres: {
      p_id: DEFI,
      p_profil: ENFANT,
      p_matiere: "maths",
      p_classe: "CE1",
      p_numero: 2,
      p_termine_le: "2026-10-29T08:30:00.000Z",
      p_jour: "2026-10-29",
      p_version_de_la_file_lue: 7,
      p_erreurs_corrigees_pour_de_bon: 1,
      p_questions_retenues: [{
        cle: "e:cat",
        lecon_d_origine: "fr-cp-lecture",
        position: 1,
        type: "ecoute",
        tirage: "a|b",
        intervalle: 1,
        date_de_revision: "2026-10-30",
        derniere_erreur_le: "2026-10-29T08:30:00.000Z",
        nombre_de_fois_ratee: 2,
      }],
    },
  }]);
  assertEquals(issue, "enregistree");
});

Deno.test("l'issue de la fonction Postgres du défi est rendue telle quelle : déjà enregistrée ou conflit", async () => {
  for (const issue of ["dejaEnregistree", "conflit"]) {
    const faux = clientSupabaseFactice({ reponseDeFonction: { data: issue } });

    assertEquals(
      await new DefisTerminesSupabase(clientDuParentInutilise, faux.client).enregistrer(fait, { file, versionLue: 0 }),
      issue,
    );
  }
});

Deno.test("une erreur de la base lors de l'enregistrement d'un défi terminé est remontée", async () => {
  const faux = clientSupabaseFactice({ reponseDeFonction: { data: null, error: { message: "panne" } } });

  await assertRejects(
    () => new DefisTerminesSupabase(clientDuParentInutilise, faux.client).enregistrer(fait, { file, versionLue: 1 }),
    Error,
    "panne",
  );
});

Deno.test("les défis relevés sont lus avec le client du parent, sous RLS, et jamais avec celui du serveur", async () => {
  const duParent = clientSupabaseFactice({
    tables: { defis_termines: [{ profil: ENFANT, matiere: "maths", classe: "CE1", numero: 2 }] },
  });
  const duServeur = clientSupabaseFactice();

  const releves = await new DefisTerminesSupabase(duParent.client, duServeur.client).releves(ENFANT);

  assertEquals(releves.length, 1);
  assertEquals(duParent.lectures.length, 1);
  assertEquals(duServeur.lectures, []);
});

Deno.test("le défi terminé est enregistré avec le client du serveur, jamais avec celui du parent", async () => {
  const duParent = clientSupabaseFactice();
  const duServeur = clientSupabaseFactice({ reponseDeFonction: { data: "enregistree" } });

  await new DefisTerminesSupabase(duParent.client, duServeur.client).enregistrer(fait, { file, versionLue: 7 });

  assertEquals(duServeur.appels.map((appel) => appel.fonction), ["enregistrer_le_defi_termine"]);
  assertEquals(duParent.appels, []);
});
