export const CARACTERES_SPECIAUX_ACCEPTES = "&#{}()[]$€%@!?";

const LONGUEUR_MINIMALE = 8;

export type NomDeRegle =
  | "huitCaracteres"
  | "uneMajuscule"
  | "uneMinuscule"
  | "unCaractereSpecial";

export type RegleDuMotDePasse = {
  readonly regle: NomDeRegle;
  readonly libelle: string;
  readonly respectee: boolean;
};

export type EtatDesRegles = readonly RegleDuMotDePasse[];

function contientUnCaractereSpecial(saisie: string): boolean {
  return [...saisie].some((caractere) => CARACTERES_SPECIAUX_ACCEPTES.includes(caractere));
}

export const ReglesDuMotDePasse = {
  verifier(saisie: string): EtatDesRegles {
    return [
      {
        regle: "huitCaracteres",
        libelle: "8 caractères",
        respectee: [...saisie].length >= LONGUEUR_MINIMALE,
      },
      { regle: "uneMajuscule", libelle: "une majuscule", respectee: /\p{Lu}/u.test(saisie) },
      { regle: "uneMinuscule", libelle: "une minuscule", respectee: /\p{Ll}/u.test(saisie) },
      {
        regle: "unCaractereSpecial",
        libelle: "un caractère spécial",
        respectee: contientUnCaractereSpecial(saisie),
      },
    ];
  },
} as const;
