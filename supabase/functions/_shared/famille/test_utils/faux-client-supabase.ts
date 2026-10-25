import type { SupabaseClient } from "@supabase/supabase-js";

export type AppelDeRequete = { readonly methode: string; readonly args: readonly unknown[] };
export type RequeteFaite = { readonly cible: string; readonly appels: AppelDeRequete[] };
export type ReponseFausse = { readonly data?: unknown; readonly error?: { readonly code?: string } | null };

/**
 * Faux client Supabase en mémoire : chaque `from(table)` ou `rpc(nom)` ouvre une requête qui retient ses appels
 * chaînés, puis reçoit, une fois attendue, la réponse suivante de la file (par défaut : aucune donnée, aucune erreur).
 */
export function fauxClientSupabase(reponses: readonly ReponseFausse[] = []) {
  const requetes: RequeteFaite[] = [];
  const file = [...reponses];

  function ouvrir(cible: string, appelsInitiaux: AppelDeRequete[]) {
    const requete: RequeteFaite = { cible, appels: appelsInitiaux };
    requetes.push(requete);
    const reponse = file.shift() ?? {};
    const chaine: unknown = new Proxy({}, {
      get(_cible, propriete) {
        if (propriete === "then") {
          return (resolve: (valeur: unknown) => void) =>
            resolve({ data: reponse.data ?? null, error: reponse.error ?? null });
        }
        return (...args: unknown[]) => {
          requete.appels.push({ methode: String(propriete), args });
          return chaine;
        };
      },
    });
    return chaine;
  }

  const client = {
    from: (table: string) => ouvrir(`from:${table}`, []),
    rpc: (nom: string, parametres?: unknown) =>
      ouvrir(`rpc:${nom}`, parametres === undefined ? [] : [{ methode: "parametres", args: [parametres] }]),
  };
  return { client: client as unknown as SupabaseClient, requetes };
}
