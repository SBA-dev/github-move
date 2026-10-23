import { type Lecon, LeconMalFormee, lireLecon } from "@domain/catalogue";
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

async function lireLeJson(chemin: string): Promise<ReadonlyArray<unknown>> {
  const reponse = await fetch(chemin);
  if (!reponse.ok) throw new Error(`${chemin} : ${reponse.status}`);
  const contenu: unknown = await reponse.json();
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

type SectionDuProgramme = {
  readonly id: string;
  readonly section: string;
  readonly domaine: string;
  readonly source: { readonly texte: string; readonly bo: string };
};

function estUneSection(valeur: unknown): valeur is SectionDuProgramme {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { id, section, domaine, source } = valeur as Record<string, unknown>;
  if (typeof source !== "object" || source === null) return false;
  const { texte, bo } = source as Record<string, unknown>;
  return typeof id === "string" && typeof section === "string" && typeof domaine === "string" &&
    typeof texte === "string" && typeof bo === "string";
}

export async function sourceDeLaSection(idDeLaSection: string): Promise<string | undefined> {
  try {
    const sections = await lireLeJson(CHEMIN_DE_L_INDEX_DES_PROGRAMMES);
    const trouvee = sections.filter(estUneSection).find((section) => section.id === idDeLaSection);
    return trouvee && `${trouvee.source.texte}, ${trouvee.source.bo} — ${trouvee.domaine} › ${trouvee.section}`;
  } catch {
    return undefined;
  }
}
