import { CreerProfilEnfant } from "../_shared/famille/application/creer-profil-enfant.ts";
import { ProfilEnfantId } from "../_shared/famille/domain/profil-enfant-id.ts";
import {
  originesAutorisees,
  reglagesFacultatifs,
  texteFacultatif,
  texteObligatoire,
  traiterUneEcritureDeFamille,
} from "../_shared/famille/infrastructure/http-famille.ts";
import { ProfilsEnfantsSupabase } from "../_shared/famille/infrastructure/profils-enfants-supabase.ts";
import { presenterLeProfil } from "../_shared/famille/infrastructure/presentation-du-profil.ts";

const origines = originesAutorisees(Deno.env.get("ORIGINES_AUTORISEES"));

Deno.serve((requete) =>
  traiterUneEcritureDeFamille(requete, async ({ client, parent }, corps) => {
    const profils = new ProfilsEnfantsSupabase(client);
    const id = crypto.randomUUID();
    await new CreerProfilEnfant(profils, { nouveau: () => id }).executer({
      parent,
      prenom: texteObligatoire(corps, "prenom"),
      niveau: texteFacultatif(corps, "niveau"),
      univers: texteFacultatif(corps, "univers"),
      reglages: reglagesFacultatifs(corps),
    }, new Date());
    return presenterLeProfil(await profils.parId(ProfilEnfantId.de(id)));
  }, origines)
);
