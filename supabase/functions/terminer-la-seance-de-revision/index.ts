import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { TerminerLaSeanceDeRevision } from "../_shared/apprentissage/application/terminer-la-seance-de-revision.ts";
import { lireLaSeanceDeRevisionTerminee } from "../_shared/apprentissage/infrastructure/corps-de-la-seance-de-revision-terminee.ts";
import { traiterUneEcritureDApprentissage } from "../_shared/apprentissage/infrastructure/http-apprentissage.ts";
import { FilesDeRevisionSupabase } from "../_shared/apprentissage/infrastructure/files-de-revision-supabase.ts";
import { LeconsDuCatalogueJson } from "../_shared/apprentissage/infrastructure/lecons-du-catalogue-json.ts";
import { NiveauDuProfilSupabase } from "../_shared/apprentissage/infrastructure/niveau-du-profil-supabase.ts";
import { RattachementsDuParentSupabase } from "../_shared/apprentissage/infrastructure/rattachements-du-parent-supabase.ts";
import { SeancesDeRevisionTermineesSupabase } from "../_shared/apprentissage/infrastructure/seances-de-revision-terminees-supabase.ts";
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
      const seance = lireLaSeanceDeRevisionTerminee(corps, new Date());
      const clientDuServeur = clientDuServeurALaDemande();
      const faits = await new TerminerLaSeanceDeRevision(
        new RattachementsDuParentSupabase(client),
        lecons,
        new NiveauDuProfilSupabase(client),
        new FilesDeRevisionSupabase(clientDuServeur),
        new SeancesDeRevisionTermineesSupabase(clientDuServeur),
      ).executer({ parent, seance });
      const fait = faits.find((f) => f.type === "SeanceDeRevisionTerminee");
      return {
        seance: seance.id,
        enregistree: fait !== undefined,
        ...(fait?.type === "SeanceDeRevisionTerminee"
          ? {
            nombreDeQuestions: fait.nombreDeQuestions,
            nombreDeQuestionsJustes: fait.nombreDeQuestionsJustes,
          }
          : {}),
      };
    },
    origines,
  )
);
