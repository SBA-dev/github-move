import type { SupabaseClient } from "@supabase/supabase-js";

type Ligne = Record<string, unknown>;
type ErreurFactice = { code?: string; message: string };

export type AppelDeFonction = { fonction: string; parametres: Record<string, unknown> };

export type ClientSupabaseFactice = {
  readonly client: () => SupabaseClient;
  readonly appels: AppelDeFonction[];
  readonly lectures: { table: string; filtres: Record<string, unknown> }[];
};

/**
 * Faux client Supabase en mémoire : `from(table).select().eq()` lit les lignes données, `rpc` enregistre l'appel
 * et rend la réponse donnée. Aucun réseau.
 */
export function clientSupabaseFactice(
  { tables = {}, reponseDeFonction = { data: null } }: {
    tables?: Record<string, Ligne[]>;
    reponseDeFonction?: { data: unknown; error?: ErreurFactice };
  } = {},
): ClientSupabaseFactice {
  const appels: AppelDeFonction[] = [];
  const lectures: { table: string; filtres: Record<string, unknown> }[] = [];
  const faux = {
    from(table: string) {
      const filtres: Record<string, unknown> = {};
      lectures.push({ table, filtres });
      const lignes = () =>
        (tables[table] ?? []).filter((ligne) => Object.entries(filtres).every(([c, v]) => ligne[c] === v));
      const requete = {
        select: () => requete,
        eq: (colonne: string, valeur: unknown) => {
          filtres[colonne] = valeur;
          return requete;
        },
        order: () => requete,
        maybeSingle: () => Promise.resolve({ data: lignes()[0] ?? null, error: null }),
        then: (surSucces: (resultat: { data: Ligne[]; error: null }) => unknown) =>
          Promise.resolve({ data: lignes(), error: null }).then(surSucces),
      };
      return requete;
    },
    rpc(fonction: string, parametres: Record<string, unknown>) {
      appels.push({ fonction, parametres });
      return Promise.resolve({ error: null, ...reponseDeFonction });
    },
  };
  return { client: () => faux as unknown as SupabaseClient, appels, lectures };
}
