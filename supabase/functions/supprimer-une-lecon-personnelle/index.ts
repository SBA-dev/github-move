import { SupprimerUneLeconPersonnelle } from "../_shared/accompagnement/application/supprimer-une-lecon-personnelle.ts";
import {
  lireLaSuppression,
  traiterUneEcritureDAccompagnement,
} from "../_shared/accompagnement/infrastructure/http-accompagnement.ts";
import { LeconsPersonnellesSupabase } from "../_shared/accompagnement/infrastructure/lecons-personnelles-supabase.ts";
import { RattachementsDuParentSupabase } from "../_shared/accompagnement/infrastructure/rattachements-du-parent-supabase.ts";
import { originesAutorisees } from "../_shared/famille/infrastructure/http-famille.ts";

const origines = originesAutorisees(Deno.env.get("ORIGINES_AUTORISEES"));

Deno.serve((requete) =>
  traiterUneEcritureDAccompagnement(
    requete,
    async ({ client, parent }, corps) => {
      const cas = new SupprimerUneLeconPersonnelle(
        new RattachementsDuParentSupabase(client),
        new LeconsPersonnellesSupabase(client),
      );
      await cas.executer({ parent, ...lireLaSuppression(corps) }, new Date());
      return { supprimee: true };
    },
    origines,
  )
);
