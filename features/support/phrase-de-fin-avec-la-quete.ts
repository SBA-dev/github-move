import { expect, type Page } from "@playwright/test";
import { terminerLaLecture } from "./lecture-vocale.ts";
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
  return new RegExp(`^\\s*${echapper(attendu)}(?: ${echapper(fete())})?\\s*$`);
}

const DELAI_DE_LA_PHRASE_DE_FIN_MS = 20_000;

/**
 * Attend que la bulle porte la phrase complète qui se termine par `suite` (éventuellement suivie de la phrase de la quête accomplie).
 * Sur l'écran de fin, la bulle ne porte d'abord que la félicitation de la dernière réponse : les lectures de l'écran (quête, objet,
 * badge, épisode…) passent avant la phrase de fin, on les termine une à une.
 */
export async function attendreQueLaBulleSeTerminePar(page: Page, suite: string): Promise<void> {
  await expect.poll(async () => {
    const texte = sansLaQueteAccomplie(((await page.getByTestId("parole").textContent().catch(() => null)) ?? "").replace(/\s+/g, " ").trim());
    if (texte.endsWith(` ${suite}`)) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_DE_LA_PHRASE_DE_FIN_MS }).toBe(true);
}
