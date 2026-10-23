import { createClient } from "@supabase/supabase-js";
import { EnregistrerLesEtoilesDeLaLecon } from "../_shared/apprentissage/application/enregistrer-les-etoiles-de-la-lecon.ts";
import { TerminerLaSeance } from "../_shared/apprentissage/application/terminer-la-seance.ts";
import { lireLaSeanceTerminee } from "../_shared/apprentissage/infrastructure/corps-de-la-seance-terminee.ts";
import { traiterUneEcritureDApprentissage } from "../_shared/apprentissage/infrastructure/http-apprentissage.ts";
import { LeconsDuCatalogueJson } from "../_shared/apprentissage/infrastructure/lecons-du-catalogue-json.ts";
import { RattachementsDuParentSupabase } from "../_shared/apprentissage/infrastructure/rattachements-du-parent-supabase.ts";
import { ResultatsDesLeconsSupabase } from "../_shared/apprentissage/infrastructure/resultats-des-lecons-supabase.ts";
import { SeancesTermineesSupabase } from "../_shared/apprentissage/infrastructure/seances-terminees-supabase.ts";
import { originesAutorisees } from "../_shared/famille/infrastructure/http-famille.ts";
import bibliotheque from "../../../app/bibliotheque.json" with { type: "json" };

const origines = originesAutorisees(Deno.env.get("ORIGINES_AUTORISEES"));

/** Client serveur pour les seules écritures revalidées (décision 0016) : la clé de service ne quitte jamais la fonction. */
function ouvrirLeClientDuServeur() {
  return createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
    auth: { persistSession: false },
  });
}

const lecons = new LeconsDuCatalogueJson(bibliotheque);

Deno.serve((requete) =>
  traiterUneEcritureDApprentissage(requete, async ({ client, parent }, corps) => {
    const seance = lireLaSeanceTerminee(corps);
    const clientDuServeur = ouvrirLeClientDuServeur();
    const faits = await new TerminerLaSeance(
      new RattachementsDuParentSupabase(client),
      lecons,
      new SeancesTermineesSupabase(clientDuServeur),
      new EnregistrerLesEtoilesDeLaLecon(lecons, new ResultatsDesLeconsSupabase(clientDuServeur, lecons)),
    ).executer({ parent, seance });
    const fait = faits.find((f) => f.type === "SeanceTerminee");
    return {
      seance: seance.seance,
      enregistree: fait !== undefined,
      ...(fait?.type === "SeanceTerminee" ? { etoiles: fait.etoiles, erreurs: fait.erreurs } : {}),
    };
  }, origines)
);
