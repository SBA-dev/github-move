import { feteDeLaQueteAccomplie } from "../../supabase/functions/_shared/motivation/domain/paroles-de-la-quete.ts";

const PRENOM_DE_L_ENFANT_DES_SCENARIOS = "Léa";

function fete(): string {
  return feteDeLaQueteAccomplie(PRENOM_DE_L_ENFANT_DES_SCENARIOS).replace(/\s+/g, " ").trim();
}

/**
 * Quand la séance accomplit la quête du jour, la story #101 ajoute sa phrase à la FIN de la phrase de fin.
 * Retire cette seule phrase (celle du domaine) en fin de texte normalisé ; tout autre texte reste intact.
 */
export function sansLaQueteAccomplie(texteNormalise: string): string {
  const suffixe = ` ${fete()}`;
  return texteNormalise.endsWith(suffixe) ? texteNormalise.slice(0, texteNormalise.length - suffixe.length) : texteNormalise;
}

/** Le texte attendu, suivi éventuellement de la seule phrase de la quête accomplie. */
export function texteSuiviEventuellementDeLaQuete(attendu: string): RegExp {
  const echapper = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${echapper(attendu)}(?: ${echapper(fete())})?$`);
}
