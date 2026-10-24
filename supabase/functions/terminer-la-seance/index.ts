import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { TerminerLaSeance } from "../_shared/apprentissage/application/terminer-la-seance.ts";
import { lireLaSeanceTerminee } from "../_shared/apprentissage/infrastructure/corps-de-la-seance-terminee.ts";
import { traiterUneEcritureDApprentissage } from "../_shared/apprentissage/infrastructure/http-apprentissage.ts";
import { LeconsDuCatalogueJson } from "../_shared/apprentissage/infrastructure/lecons-du-catalogue-json.ts";
import { RattachementsDuParentSupabase } from "../_shared/apprentissage/infrastructure/rattachements-du-parent-supabase.ts";
import { ResultatsDesLeconsSupabase } from "../_shared/apprentissage/infrastructure/resultats-des-lecons-supabase.ts";
import { RecordsDeFluenceSupabase } from "../_shared/apprentissage/infrastructure/records-de-fluence-supabase.ts";
import { SeancesTermineesSupabase } from "../_shared/apprentissage/infrastructure/seances-terminees-supabase.ts";
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
  if (!url || !cle) throw new Error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies.");
  return createClient(url, cle, { auth: { persistSession: false } });
}

const lecons = new LeconsDuCatalogueJson(bibliotheque);

Deno.serve((requete) =>
  traiterUneEcritureDApprentissage(requete, async ({ client, parent }, corps) => {
    const seance = lireLaSeanceTerminee(corps, new Date());
    const clientDuServeur = clientDuServeurALaDemande();
    const faits = await new TerminerLaSeance(
      new RattachementsDuParentSupabase(client),
      lecons,
      new SeancesTermineesSupabase(clientDuServeur),
      new ResultatsDesLeconsSupabase(clientDuServeur, lecons),
      new RecordsDeFluenceSupabase(),
    ).executer({ parent, seance });
    const fait = faits.find((f) => f.type === "SeanceTerminee");
    return {
      seance: seance.seance,
      enregistree: fait !== undefined,
      ...(fait?.type === "SeanceTerminee" ? { etoiles: fait.etoiles, erreurs: fait.erreurs } : {}),
    };
  }, origines)
);
