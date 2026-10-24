import type { FormeDeSchema } from "@domain/catalogue";

/** La place d'un morceau de barre sur sa ligne : une proportion de la ligne, un poids relatif, ou ce qui reste. */
export type Taille =
  | Readonly<{ genre: "proportion"; de: number; sur: number }>
  | Readonly<{ genre: "poids"; valeur: number }>
  | Readonly<{ genre: "reste" }>;

export type Morceau = Readonly<{
  role: string;
  /** Le nombre écrit sur le morceau ; `null` pour le « ? » de la valeur cherchée. */
  valeur: number | null;
  taille: Taille;
  /** Un morceau qui ne se dessine pas en barre : l'écart d'une comparaison, la suite des parts. */
  vide?: boolean;
}>;

export type Ligne = Readonly<{ role: string; nom?: string; morceaux: readonly Morceau[] }>;

const reste: Taille = { genre: "reste" };
const poids = (valeur: number): Taille => ({ genre: "poids", valeur });
const proportion = (de: number, sur: number): Taille => ({ genre: "proportion", de, sur });

/**
 * Le dessin d'un schéma : des lignes de morceaux, dont les tailles restent proportionnelles aux nombres.
 * La réponse, une fois connue, remplace le « ? » sans changer les tailles.
 */
export function dessinerLeSchema(forme: FormeDeSchema, reponse?: number): readonly Ligne[] {
  const lu = (valeur: number | null) => valeur ?? reponse ?? null;
  switch (forme.genre) {
    case "partiesEtTout":
      return partiesEtTout(forme, lu);
    case "comparaison":
      return comparaison(forme, lu);
    case "parts":
      return parts(forme, lu, reponse);
  }
}

type Lecture = (valeur: number | null) => number | null;

function partiesEtTout({ parties: [premiere, seconde], tout }: Extract<FormeDeSchema, { genre: "partiesEtTout" }>, lu: Lecture): readonly Ligne[] {
  const ligneDuTout: Ligne = { role: "tout", morceaux: [{ role: "tout", valeur: lu(tout), taille: reste }] };
  const taille = (valeur: number | null): Taille =>
    tout === null ? poids(valeur ?? 0) : valeur === null ? reste : proportion(valeur, tout);
  return [
    ligneDuTout,
    {
      role: "parties",
      morceaux: [
        { role: "partie", valeur: lu(premiere), taille: taille(premiere) },
        { role: "partie", valeur: lu(seconde), taille: taille(seconde) },
      ],
    },
  ];
}

function comparaison(
  { grand, petit, ecart, noms: [nomDuGrand = "", nomDuPetit = ""] }: Extract<FormeDeSchema, { genre: "comparaison" }>,
  lu: Lecture,
): readonly Ligne[] {
  const ligneDuGrand: Ligne = {
    role: "grand",
    nom: nomDuGrand,
    morceaux: [{ role: "grand", valeur: lu(grand), taille: reste }],
  };
  const ligneDuPetit = (morceaux: readonly Morceau[]): Ligne => ({ role: "petit", nom: nomDuPetit, morceaux });
  const morceauDuPetit = (taille: Taille): Morceau => ({ role: "petit", valeur: lu(petit), taille });
  const morceauDeLEcart = (taille: Taille): Morceau => ({ role: "ecart", valeur: lu(ecart), taille, vide: true });
  if (grand === null) {
    return [ligneDuGrand, ligneDuPetit([morceauDuPetit(poids(petit ?? 0)), morceauDeLEcart(poids(ecart ?? 0))])];
  }
  if (petit === null) {
    return [ligneDuGrand, ligneDuPetit([morceauDuPetit(reste), morceauDeLEcart(proportion(ecart ?? 0, grand))])];
  }
  return [ligneDuGrand, ligneDuPetit([morceauDuPetit(proportion(petit, grand)), morceauDeLEcart(reste)])];
}

function parts(
  { nb, valeur, total }: Extract<FormeDeSchema, { genre: "parts" }>,
  lu: Lecture,
  reponse: number | undefined,
): readonly Ligne[] {
  const nombreDeParts = nb ?? reponse;
  const unePart = (): Morceau => ({ role: "part", valeur: lu(valeur), taille: poids(1) });
  const morceaux: Morceau[] = nombreDeParts === undefined
    ? [unePart(), unePart(), { role: "suite", valeur: null, taille: poids(1), vide: true }]
    : Array.from({ length: nombreDeParts }, unePart);
  return [
    { role: "total", morceaux: [{ role: "total", valeur: lu(total), taille: reste }] },
    { role: "parts", morceaux },
  ];
}
