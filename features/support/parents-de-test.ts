// Adresses stables des parents de test (décision 0040) : réutiliser les mêmes
// comptes d'une exécution à l'autre évite de consommer le quota MAU de Supabase.

export function suffixeDesParentsDeTest(
  source: { equipe: string; projet: string; indexDuWorker: number },
): string {
  return `${source.equipe}-${source.projet}${source.indexDuWorker}`;
}

export const EQUIPE_PAR_DEFAUT = "local";

const FORMAT_EQUIPE = /^[a-z0-9-]+$/;
const BRANCHE_DE_STORY = /^feature\/(\d+)-/;

export function equipeDesTests(
  source: { variable?: string; branche?: string },
): string {
  const variable = source.variable?.trim();
  if (variable) {
    if (!FORMAT_EQUIPE.test(variable)) {
      throw new Error(
        "E2E_EQUIPE n'accepte que des minuscules, des chiffres et des tirets",
      );
    }
    return variable;
  }
  return source.branche?.match(BRANCHE_DE_STORY)?.[1] ?? EQUIPE_PAR_DEFAUT;
}
