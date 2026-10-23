import { type Lecon, lireLecon, lireSectionDuProgramme, type SectionDuProgramme } from "@domain/catalogue";

const CHEMIN_DE_LA_BIBLIOTHEQUE = "/bibliotheque.json";
const CHEMIN_DE_L_INDEX_DES_PROGRAMMES = "/programmes-index.json";

const dejaChargees = new Map<string, Promise<readonly unknown[]>>();

async function telecharger(chemin: string): Promise<readonly unknown[]> {
  const reponse = await fetch(chemin);
  if (!reponse.ok) throw new Error(`${chemin} : ${reponse.status}`);
  const contenu: unknown = await reponse.json();
  if (!Array.isArray(contenu)) throw new Error(`${chemin} : une liste est attendue`);
  return contenu;
}

function charger(chemin: string): Promise<readonly unknown[]> {
  const enCours = dejaChargees.get(chemin) ?? telecharger(chemin);
  dejaChargees.set(chemin, enCours);
  enCours.catch(() => dejaChargees.delete(chemin));
  return enCours;
}

function aLIdentifiant(brut: unknown, identifiant: string): boolean {
  return typeof brut === "object" && brut !== null && "id" in brut && brut.id === identifiant;
}

/** Lit la leçon voulue seulement : une autre leçon mal formée ne gêne pas. `undefined` si elle est introuvable ou illisible. */
export async function chargerLaLecon(identifiant: string): Promise<Lecon | undefined> {
  try {
    const brute = (await charger(CHEMIN_DE_LA_BIBLIOTHEQUE)).find((candidate) => aLIdentifiant(candidate, identifiant));
    return brute === undefined ? undefined : lireLecon(brute);
  } catch {
    return undefined;
  }
}

/** Toutes les leçons lisibles de la bibliothèque (pour trouver la leçon suivante). Vide si elle est indisponible. */
export async function chargerToutesLesLecons(): Promise<readonly Lecon[]> {
  try {
    return (await charger(CHEMIN_DE_LA_BIBLIOTHEQUE)).flatMap((brute) => {
      try {
        return [lireLecon(brute)];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
}

/** La source d'une leçon est un complément pour les adultes : sans elle, la page reste utilisable. */
export async function chargerLaSectionDuProgramme(identifiant: string): Promise<SectionDuProgramme | undefined> {
  try {
    const brute = (await charger(CHEMIN_DE_L_INDEX_DES_PROGRAMMES)).find((candidate) => aLIdentifiant(candidate, identifiant));
    return brute === undefined ? undefined : lireSectionDuProgramme(brute);
  } catch {
    return undefined;
  }
}
