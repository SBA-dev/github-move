import { ReinitialiserLeMotDePasse } from "../_shared/famille/application/reinitialiser-le-mot-de-passe.ts";
import { clientDAdministration } from "../_shared/famille/infrastructure/client-d-administration.ts";
import {
  adresseObligatoire,
  motDePasseObligatoire,
  traiterUneDemandeSansConnexion,
} from "../_shared/famille/infrastructure/http-connexion-par-mot-de-passe.ts";
import { originesAutorisees, texteObligatoire } from "../_shared/famille/infrastructure/http-famille.ts";
import { MotsDePasseDesParentsSupabase } from "../_shared/famille/infrastructure/mots-de-passe-des-parents-supabase.ts";
import { ParentsDesAdressesSupabase } from "../_shared/famille/infrastructure/parents-des-adresses-supabase.ts";
import { PrenomsDesEnfantsRattachesSupabase } from "../_shared/famille/infrastructure/prenoms-des-enfants-rattaches-supabase.ts";
import {
  EssaisDeReinitialisationModifiesEnMemeTemps,
  RegistreDesEssaisDeReinitialisationSupabase,
} from "../_shared/famille/infrastructure/registre-des-essais-de-reinitialisation-supabase.ts";

const origines = originesAutorisees(Deno.env.get("ORIGINES_AUTORISEES"));
const TENTATIVES_EN_CAS_D_ESSAIS_SIMULTANES = 5;

async function reinitialiser(adresse: string, prenom: string, motDePasse: string): Promise<void> {
  const client = clientDAdministration();
  for (let tentative = 1;; tentative++) {
    try {
      await new ReinitialiserLeMotDePasse(
        new RegistreDesEssaisDeReinitialisationSupabase(client),
        new ParentsDesAdressesSupabase(client),
        new PrenomsDesEnfantsRattachesSupabase(client),
        new MotsDePasseDesParentsSupabase(client),
      ).executer(adresse, prenom, motDePasse, new Date());
      return;
    } catch (cause) {
      // Deux essais simultanés : on recommence avec l'état à jour, pour qu'aucun essai raté ne reste hors du compte.
      const aReessayer = cause instanceof EssaisDeReinitialisationModifiesEnMemeTemps &&
        tentative < TENTATIVES_EN_CAS_D_ESSAIS_SIMULTANES;
      if (!aReessayer) throw cause;
    }
  }
}

// Appelée par un visiteur qui n'est pas connecté (déployée avec `--no-verify-jwt`, voir config.toml).
Deno.serve((requete) =>
  traiterUneDemandeSansConnexion(requete, async (corps) => {
    await reinitialiser(adresseObligatoire(corps), texteObligatoire(corps, "prenom"), motDePasseObligatoire(corps));
  }, origines)
);
