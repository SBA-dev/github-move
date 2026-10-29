import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { TerminerLeDefi } from "../_shared/apprentissage/application/terminer-le-defi.ts";
import { lireLeDefiTermine } from "../_shared/apprentissage/infrastructure/corps-du-defi-termine.ts";
import { DefisTerminesSupabase } from "../_shared/apprentissage/infrastructure/defis-termines-supabase.ts";
import { FilesDeRevisionSupabase } from "../_shared/apprentissage/infrastructure/files-de-revision-supabase.ts";
import { traiterUneEcritureDApprentissage } from "../_shared/apprentissage/infrastructure/http-apprentissage.ts";
import { LeconsDuCatalogueJson } from "../_shared/apprentissage/infrastructure/lecons-du-catalogue-json.ts";
import { NiveauDuProfilSupabase } from "../_shared/apprentissage/infrastructure/niveau-du-profil-supabase.ts";
import { RattachementsDuParentSupabase } from "../_shared/apprentissage/infrastructure/rattachements-du-parent-supabase.ts";
import { ResultatsDesLeconsSupabase } from "../_shared/apprentissage/infrastructure/resultats-des-lecons-supabase.ts";
import { ResultatsDesTestsDeDepartSupabase } from "../_shared/apprentissage/infrastructure/resultats-des-tests-de-depart-supabase.ts";
import { originesAutorisees } from "../_shared/famille/infrastructure/http-famille.ts";
import bibliotheque from "../../../app/bibliotheque.json" with { type: "json" };

const origines = originesAutorisees(Deno.env.get("ORIGINES_AUTORISEES"));

/** Client serveur, ouvert au premier usage (après le contrôle du rattachement) pour les seules écritures revalidées (décision 0016) : la clé de service ne quitte jamais la fonction. */
function clientDuServeurALaDemande(): () => SupabaseClient {
  let client: SupabaseClient | undefined;
  return () => client ??= ouvrirLeClientDuServeur();
}

function ouvrirLeClientDuServeur() {
  const url = Deno.env.get("SUPABASE_URL");
  const cle = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !cle) {
    throw new Error(
      "SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies.",
    );
  }
  return createClient(url, cle, { auth: { persistSession: false } });
}

const lecons = new LeconsDuCatalogueJson(bibliotheque);

Deno.serve((requete) =>
  traiterUneEcritureDApprentissage(
    requete,
    async ({ client, parent }, corps) => {
      const defi = lireLeDefiTermine(corps, new Date());
      const clientDuParent = () => client;
      const clientDuServeur = clientDuServeurALaDemande();
      const faits = await new TerminerLeDefi(
        new RattachementsDuParentSupabase(client),
        lecons,
        new NiveauDuProfilSupabase(client),
        new ResultatsDesLeconsSupabase(clientDuParent, lecons),
        new ResultatsDesTestsDeDepartSupabase(clientDuParent),
        new FilesDeRevisionSupabase(clientDuServeur),
        new DefisTerminesSupabase(clientDuServeur),
      ).executer({ parent, defi });
      const fait = faits[0];
      return {
        defi: defi.id,
        enregistre: fait !== undefined,
        ...(fait
          ? {
            nombreDeQuestions: fait.nombreDeQuestions,
            questionsRatees: fait.questionsRatees.length,
          }
          : {}),
      };
    },
    origines,
  )
);
