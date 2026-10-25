import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { TerminerLeTestDeDepart } from "../_shared/apprentissage/application/terminer-le-test-de-depart.ts";
import { lireLeTestDeDepartTermine } from "../_shared/apprentissage/infrastructure/corps-du-test-de-depart-termine.ts";
import { traiterUneEcritureDApprentissage } from "../_shared/apprentissage/infrastructure/http-apprentissage.ts";
import { LeconsDuCatalogueJson } from "../_shared/apprentissage/infrastructure/lecons-du-catalogue-json.ts";
import { NiveauDuProfilSupabase } from "../_shared/apprentissage/infrastructure/niveau-du-profil-supabase.ts";
import { RattachementsDuParentSupabase } from "../_shared/apprentissage/infrastructure/rattachements-du-parent-supabase.ts";
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
  if (!url || !cle) throw new Error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies.");
  return createClient(url, cle, { auth: { persistSession: false } });
}

const lecons = new LeconsDuCatalogueJson(bibliotheque);

Deno.serve((requete) =>
  traiterUneEcritureDApprentissage(requete, async ({ client, parent }, corps) => {
    const test = lireLeTestDeDepartTermine(corps, new Date());
    const faits = await new TerminerLeTestDeDepart(
      new RattachementsDuParentSupabase(client),
      lecons,
      new NiveauDuProfilSupabase(client),
      new ResultatsDesTestsDeDepartSupabase(clientDuServeurALaDemande()),
    ).executer({ parent, test });
    const fait = faits[0];
    return {
      test: test.test,
      enregistre: fait !== undefined,
      ...(fait ? { leconsReussies: [...fait.leconsReussies] } : {}),
    };
  }, origines)
);
