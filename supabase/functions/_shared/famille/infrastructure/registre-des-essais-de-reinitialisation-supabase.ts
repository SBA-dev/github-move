import type { SupabaseClient } from "@supabase/supabase-js";
import {
  EssaisDeReinitialisationModifiesEnMemeTemps,
  type RegistreDesEssaisDeReinitialisation,
  RegistreDesEssaisIndisponible,
} from "../application/ports/registre-des-essais-de-reinitialisation.ts";
import { AdresseEmail } from "../domain/adresse-email.ts";
import { EssaisDeReinitialisation } from "../domain/essais-de-reinitialisation.ts";

const TABLE = "essais_de_reinitialisation";
const CODE_POSTGRES_DE_DOUBLON = "23505";
const VERSION_D_UNE_LIGNE_INSEREE = 1;

export type LigneDEssais = {
  adresse: string;
  essais_rates: number;
  dernier_rate_le: string | null;
  bloque_jusqua: string | null;
  version: number;
};

export function essaisDepuisLaLigne(ligne: LigneDEssais): EssaisDeReinitialisation {
  return EssaisDeReinitialisation.reconstituer(
    AdresseEmail.de(ligne.adresse),
    ligne.essais_rates,
    ligne.dernier_rate_le === null ? null : new Date(ligne.dernier_rate_le),
    ligne.bloque_jusqua === null ? null : new Date(ligne.bloque_jusqua),
  );
}

export function colonnesDesEssais(essais: EssaisDeReinitialisation) {
  return {
    adresse: cleDeLAdresse(essais.adresse),
    essais_rates: essais.essaisRates,
    dernier_rate_le: essais.dernierRateLe?.toISOString() ?? null,
    bloque_jusqua: essais.bloqueJusquA?.toISOString() ?? null,
  };
}

function cleDeLAdresse(adresse: AdresseEmail): string {
  return adresse.valeur.toLowerCase();
}

/** Une instance par requête : elle retient la version lue de chaque adresse pour la mise à jour conditionnelle. */
export class RegistreDesEssaisDeReinitialisationSupabase implements RegistreDesEssaisDeReinitialisation {
  private readonly versionsLues = new Map<string, number>();

  constructor(private readonly client: SupabaseClient) {}

  async pourAdresse(adresse: AdresseEmail): Promise<EssaisDeReinitialisation> {
    const cle = cleDeLAdresse(adresse);
    const { data, error } = await this.client.from(TABLE).select("*").eq("adresse", cle)
      .maybeSingle<LigneDEssais>();
    if (error) throw new Error("Lecture des essais de réinitialisation impossible.");
    if (data === null) {
      this.versionsLues.delete(cle);
      return EssaisDeReinitialisation.nouveaux(adresse);
    }
    this.versionsLues.set(cle, data.version);
    return essaisDepuisLaLigne(data);
  }

  async enregistrer(essais: EssaisDeReinitialisation, maintenant: Date): Promise<void> {
    if (essais.estOublie(maintenant)) await this.effacer(essais);
    else await this.ecrire(essais);
    await this.effacerLesEssaisOublies();
  }

  private async effacer(essais: EssaisDeReinitialisation): Promise<void> {
    const cle = cleDeLAdresse(essais.adresse);
    const { error } = await this.client.from(TABLE).delete().eq("adresse", cle);
    if (error) throw new RegistreDesEssaisIndisponible();
    this.versionsLues.delete(cle);
  }

  private async ecrire(essais: EssaisDeReinitialisation): Promise<void> {
    const cle = cleDeLAdresse(essais.adresse);
    const versionLue = this.versionsLues.get(cle);
    const versionEcrite = versionLue === undefined
      ? await this.inserer(essais)
      : await this.mettreAJour(essais, versionLue);
    if (versionEcrite === undefined) throw new EssaisDeReinitialisationModifiesEnMemeTemps();
    this.versionsLues.set(cle, versionEcrite);
  }

  private async inserer(essais: EssaisDeReinitialisation): Promise<number | undefined> {
    const { error } = await this.client.from(TABLE).insert(colonnesDesEssais(essais));
    if (error?.code === CODE_POSTGRES_DE_DOUBLON) return undefined;
    if (error) throw new RegistreDesEssaisIndisponible();
    return VERSION_D_UNE_LIGNE_INSEREE;
  }

  private async mettreAJour(essais: EssaisDeReinitialisation, versionLue: number): Promise<number | undefined> {
    const { data, error } = await this.client.from(TABLE)
      .update({ ...colonnesDesEssais(essais), version: versionLue + 1 })
      .eq("adresse", cleDeLAdresse(essais.adresse)).eq("version", versionLue).select("adresse");
    if (error) throw new RegistreDesEssaisIndisponible();
    return data?.length === 1 ? versionLue + 1 : undefined;
  }

  private async effacerLesEssaisOublies(): Promise<void> {
    const { error } = await this.client.rpc("effacer_les_essais_de_reinitialisation_oublies");
    if (error) throw new RegistreDesEssaisIndisponible();
  }
}
