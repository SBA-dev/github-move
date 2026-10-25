import { lireCleUnivers, type ProfilEnCours, Reglages } from "@domain/famille";
import { estUnReglagesBruts } from "../../reglages/index.ts";

/** Le profil que `creer-profil-enfant` rend, lu comme un profil en cours ; `undefined` si la réponse est illisible. */
export function profilCreeCommeProfilEnCours(reponse: unknown): ProfilEnCours | undefined {
  const profil = (reponse as { profil?: Record<string, unknown> } | null)?.profil;
  if (typeof profil !== "object" || profil === null) return undefined;
  const { id, prenom, niveau, univers, reglages } = profil;
  if (typeof id !== "string" || typeof prenom !== "string" || typeof niveau !== "string" || typeof univers !== "string") return undefined;
  if (!estUnReglagesBruts(reglages)) return undefined;
  try {
    return { id, prenom, niveau, univers: lireCleUnivers(univers), reglages: Reglages.depuis(reglages) };
  } catch {
    return undefined;
  }
}
