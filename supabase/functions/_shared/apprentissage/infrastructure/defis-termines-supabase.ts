import type { SupabaseClient } from "@supabase/supabase-js";
import { estUneMatiere, matiereDeCode, Niveau, NiveauInconnu } from "../../catalogue/domain/index.ts";
import type { DefisTermines } from "../application/ports/defis-termines.ts";
import type { FileDeRevisionALEcrire, IssueDeLEnregistrement } from "../application/ports/seances-terminees.ts";
import type { DefiReleve } from "../domain/defis-de-la-matiere.ts";
import type { DefiTermine } from "../domain/seance-de-defi.ts";
import { lignesDesQuestionsRetenues } from "./files-de-revision-supabase.ts";

type LigneDeDefi = { matiere: string; classe: string; numero: number };

function releveDeLaLigne({ matiere, classe, numero }: LigneDeDefi): DefiReleve | undefined {
  if (!estUneMatiere(matiere)) return undefined;
  try {
    return { matiere: matiereDeCode(matiere), niveau: Niveau.de(classe), numero };
  } catch (cause) {
    if (cause instanceof NiveauInconnu) return undefined;
    throw cause;
  }
}

export class DefisTerminesSupabase implements DefisTermines {
  constructor(
    private readonly clientDuParent: () => SupabaseClient,
    private readonly clientDuServeur: () => SupabaseClient,
  ) {}

  async releves(enfant: string): Promise<readonly DefiReleve[]> {
    const { data, error } = await this.clientDuParent().from("defis_termines").select("matiere, classe, numero")
      .eq("profil", enfant);
    if (error) throw new Error(`Lecture des défis relevés impossible : ${error.message}`);
    return (data as LigneDeDefi[]).flatMap((ligne) => releveDeLaLigne(ligne) ?? []);
  }

  async enregistrer(fait: DefiTermine, { file, versionLue }: FileDeRevisionALEcrire) {
    const { data, error } = await this.clientDuServeur().rpc("enregistrer_le_defi_termine", {
      p_id: fait.id,
      p_profil: fait.enfant,
      p_matiere: fait.defi.matiere.code,
      p_classe: fait.defi.niveau.valeur,
      p_numero: fait.defi.numero,
      p_termine_le: fait.termineeLe.toISOString(),
      p_jour: fait.jour.toString(),
      p_version_de_la_file_lue: versionLue,
      p_erreurs_corrigees_pour_de_bon: file.erreursCorrigeesPourDeBon,
      p_questions_retenues: lignesDesQuestionsRetenues(file),
    });
    if (error) throw new Error(`Enregistrement du défi terminé impossible : ${error.message}`);
    return data as IssueDeLEnregistrement;
  }
}
