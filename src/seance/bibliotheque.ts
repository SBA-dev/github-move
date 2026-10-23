import { type Lecon, LeconMalFormee, lireLecon, sourceDeLaSection } from "@domain/catalogue";
import { chargerLeconsPreparees } from "../demonstration/disponibilite.ts";

const CHEMIN_DE_LA_BIBLIOTHEQUE = "/bibliotheque.json";
const CHEMIN_DE_L_INDEX_DES_PROGRAMMES = "/programmes-index.json";

export type ResultatDeLecture =
  | { readonly type: "lue"; readonly lecon: Lecon }
  | { readonly type: "introuvable" }
  | { readonly type: "indisponible" };

function identifiantDe(brute: unknown): unknown {
  return typeof brute === "object" && brute !== null ? (brute as { id?: unknown }).id : undefined;
}

async function chargerLeJson(chemin: string): Promise<unknown> {
  const reponse = await fetch(chemin);
  if (!reponse.ok) throw new Error(`${chemin} : ${reponse.status}`);
  return await reponse.json();
}

async function lireLeJson(chemin: string): Promise<ReadonlyArray<unknown>> {
  const contenu = await chargerLeJson(chemin);
  if (!Array.isArray(contenu)) throw new Error(`${chemin} : liste attendue`);
  return contenu;
}

export async function chargerLaLecon(id: string): Promise<ResultatDeLecture> {
  try {
    const preparees = chargerLeconsPreparees ? await chargerLeconsPreparees() : [];
    const brute = [...preparees, ...(await lireLeJson(CHEMIN_DE_LA_BIBLIOTHEQUE))].find((candidate) =>
      identifiantDe(candidate) === id
    );
    if (brute === undefined) return { type: "introuvable" };
    return { type: "lue", lecon: lireLecon(brute) };
  } catch (erreur) {
    return erreur instanceof LeconMalFormee ? { type: "introuvable" } : { type: "indisponible" };
  }
}

export async function chargerLaSourceDeLaSection(idDeLaSection: string): Promise<string | undefined> {
  try {
    return sourceDeLaSection(await chargerLeJson(CHEMIN_DE_L_INDEX_DES_PROGRAMMES), idDeLaSection);
  } catch {
    return undefined;
  }
}
