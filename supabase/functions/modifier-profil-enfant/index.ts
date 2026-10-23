import { ModifierProfilEnfant } from "../_shared/famille/application/modifier-profil-enfant.ts";
import { ProfilEnfantId } from "../_shared/famille/domain/profil-enfant-id.ts";
import {
  originesAutorisees,
  reglagesFacultatifs,
  texteFacultatif,
  traiterUneEcritureDeFamille,
  uuidObligatoire,
} from "../_shared/famille/infrastructure/http-famille.ts";
import { presenterLeProfil } from "../_shared/famille/infrastructure/presentation-du-profil.ts";
import { ProfilsEnfantsSupabase } from "../_shared/famille/infrastructure/profils-enfants-supabase.ts";

const origines = originesAutorisees(Deno.env.get("ORIGINES_AUTORISEES"));

Deno.serve((requete) =>
  traiterUneEcritureDeFamille(requete, async ({ client, parent }, corps) => {
    const profils = new ProfilsEnfantsSupabase(client);
    const profil = uuidObligatoire(corps, "profil");
    await new ModifierProfilEnfant(profils).executer({
      parent,
      profil,
      prenom: texteFacultatif(corps, "prenom"),
      niveau: texteFacultatif(corps, "niveau"),
      univers: texteFacultatif(corps, "univers"),
      reglages: reglagesFacultatifs(corps),
    });
    return presenterLeProfil(await profils.parId(ProfilEnfantId.de(profil)));
  }, origines)
);
