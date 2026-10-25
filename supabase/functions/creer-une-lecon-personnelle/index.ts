import programmesIndex from "../../../app/programmes-index.json" with { type: "json" };
import { CreerUneLeconPersonnelle } from "../_shared/accompagnement/application/creer-une-lecon-personnelle.ts";
import {
  lireLaCreation,
  traiterUneEcritureDAccompagnement,
} from "../_shared/accompagnement/infrastructure/http-accompagnement.ts";
import { LeconsPersonnellesSupabase } from "../_shared/accompagnement/infrastructure/lecons-personnelles-supabase.ts";
import { RattachementsDuParentSupabase } from "../_shared/accompagnement/infrastructure/rattachements-du-parent-supabase.ts";
import { SectionsDuProgrammeJson } from "../_shared/accompagnement/infrastructure/sections-du-programme-json.ts";
import { originesAutorisees } from "../_shared/famille/infrastructure/http-famille.ts";

const origines = originesAutorisees(Deno.env.get("ORIGINES_AUTORISEES"));
const sectionsDuProgramme = new SectionsDuProgrammeJson(programmesIndex);

Deno.serve((requete) =>
  traiterUneEcritureDAccompagnement(requete, async ({ client, parent }, corps) => {
    const cas = new CreerUneLeconPersonnelle(
      new RattachementsDuParentSupabase(client),
      sectionsDuProgramme,
      new LeconsPersonnellesSupabase(client),
      { nouveau: () => crypto.randomUUID() },
    );
    const { leconPersonnelle } = await cas.executer({ parent, ...lireLaCreation(corps) }, new Date());
    const { lecon } = leconPersonnelle;
    return { id: lecon.id, titre: lecon.titre, matiere: lecon.matiere.code, niveau: lecon.niveau.valeur };
  }, origines)
);
