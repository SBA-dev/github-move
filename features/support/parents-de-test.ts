// Adresses stables des parents de test (décision 0040) : réutiliser les mêmes
// comptes d'une exécution à l'autre évite de consommer le quota MAU de Supabase.

export function suffixeDesParentsDeTest(
  source: { equipe: string; projet: string; indexDuWorker: number },
): string {
  return `${source.equipe}-${source.projet}${source.indexDuWorker}`;
}
