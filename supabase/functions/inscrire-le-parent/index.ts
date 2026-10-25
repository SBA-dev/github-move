import { InscrireLeParent } from "../_shared/famille/application/inscrire-le-parent.ts";
import { clientDAdministration } from "../_shared/famille/infrastructure/client-d-administration.ts";
import {
  adresseObligatoire,
  motDePasseObligatoire,
  traiterUneDemandeSansConnexion,
} from "../_shared/famille/infrastructure/http-connexion-par-mot-de-passe.ts";
import { originesAutorisees } from "../_shared/famille/infrastructure/http-famille.ts";
import { InscriptionsDesParentsSupabase } from "../_shared/famille/infrastructure/inscriptions-des-parents-supabase.ts";

const origines = originesAutorisees(Deno.env.get("ORIGINES_AUTORISEES"));

// Appelée par un visiteur qui n'est pas connecté (déployée avec `--no-verify-jwt`, voir config.toml).
Deno.serve((requete) =>
  traiterUneDemandeSansConnexion(requete, async (corps) => {
    await new InscrireLeParent(new InscriptionsDesParentsSupabase(clientDAdministration()))
      .executer(adresseObligatoire(corps), motDePasseObligatoire(corps));
  }, origines)
);
