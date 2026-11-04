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

export const ADRESSES_DES_SCENARIOS = [
  "paul@exemple.test",
  "claire@exemple.test",
  "marie@exemple.test",
  "inconnu@exemple.test",
  "dupont@exemple.test",
] as const;

// Décision 0040 : le quota MAU de Supabase impose un plafond de quelques
// centaines de parents de test par mois.
const EQUIPES_ACTIVES_PAR_MOIS = 15;
const PROJETS = 2;
const WORKERS = 3;
const ADRESSES = ADRESSES_DES_SCENARIOS.length;

export const PLAFOND_DES_PARENTS_DE_TEST = {
  equipesActivesParMois: EQUIPES_ACTIVES_PAR_MOIS,
  projets: PROJETS,
  workers: WORKERS,
  adresses: ADRESSES,
  total: EQUIPES_ACTIVES_PAR_MOIS * PROJETS * WORKERS * ADRESSES,
} as const;
