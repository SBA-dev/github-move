import type { SupabaseClient } from "@supabase/supabase-js";
import { estUneMatiere, matiereDeCode, Niveau, NiveauInconnu } from "../../catalogue/domain/index.ts";
import type { DefisTermines } from "../application/ports/defis-termines.ts";
import type { FileDeRevisionALEcrire, IssueDeLEnregistrement } from "../application/ports/seances-terminees.ts";
import type { DefiReleve } from "../domain/defis-de-la-matiere.ts";
import type { DefiTermine } from "../domain/seance-de-defi.ts";
import { lignesDesQuestionsRetenues } from "./files-de-revision-supabase.ts";

type LigneDeDefi = { matiere: string; classe: string; numero?: number };

function releveDeLaLigne({ matiere, classe, numero }: LigneDeDefi): DefiReleve | undefined {
  if (!estUneMatiere(matiere)) return undefined;
  try {
    const defi = { matiere: matiereDeCode(matiere), niveau: Niveau.de(classe) };
    return numero === undefined ? { ...defi, grandDefi: true } : { ...defi, numero };
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
    const defis = await this.lire("defis_termines", "matiere, classe, numero", enfant);
    const grandsDefis = await this.lire("grands_defis_termines", "matiere, classe", enfant);
    return [...defis, ...grandsDefis].flatMap((ligne) => releveDeLaLigne(ligne) ?? []);
  }

  async enregistrer(fait: DefiTermine, { file, versionLue }: FileDeRevisionALEcrire) {
    const { fonction, numero } = fait.defi.grandDefi === true
      ? { fonction: "enregistrer_le_grand_defi_termine", numero: {} }
      : { fonction: "enregistrer_le_defi_termine", numero: { p_numero: fait.defi.numero } };
    const { data, error } = await this.clientDuServeur().rpc(fonction, {
      p_id: fait.id,
      p_profil: fait.enfant,
      p_matiere: fait.defi.matiere.code,
      p_classe: fait.defi.niveau.valeur,
      ...numero,
      p_termine_le: fait.termineeLe.toISOString(),
      p_jour: fait.jour.toString(),
      p_version_de_la_file_lue: versionLue,
      p_erreurs_corrigees_pour_de_bon: file.erreursCorrigeesPourDeBon,
      p_questions_retenues: lignesDesQuestionsRetenues(file),
    });
    if (error) throw new Error(`Enregistrement du défi terminé impossible : ${error.message}`);
    return data as IssueDeLEnregistrement;
  }

  private async lire(table: string, colonnes: string, enfant: string): Promise<LigneDeDefi[]> {
    const { data, error } = await this.clientDuParent().from(table).select(colonnes).eq("profil", enfant);
    if (error) throw new Error(`Lecture des défis relevés impossible : ${error.message}`);
    return data as unknown as LigneDeDefi[];
  }
}
