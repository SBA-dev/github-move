const LIBELLES = {
  francais: "Français",
  maths: "Mathématiques",
  sciences: "Sciences",
  histoire: "Histoire et géographie",
  anglais: "Anglais",
  emc: "Vivre ensemble (EMC)",
} as const;

const LIBELLES_COURTS: Readonly<Record<keyof typeof LIBELLES, string>> = {
  francais: "Français",
  maths: "Maths",
  sciences: "Sciences",
  histoire: "Histoire-géo",
  anglais: "Anglais",
  emc: "Vivre ensemble",
};

export type CodeDeMatiere = keyof typeof LIBELLES;

export function estUneMatiere(code: unknown): code is CodeDeMatiere {
  return typeof code === "string" && Object.hasOwn(LIBELLES, code);
}

export type Matiere = Readonly<{ code: CodeDeMatiere; libelle: string }>;

export function toutesLesMatieres(): Matiere[] {
  return (Object.keys(LIBELLES) as CodeDeMatiere[]).map(matiereDeCode);
}

export function matiereDeCode(code: CodeDeMatiere): Matiere {
  return Object.freeze({ code, libelle: LIBELLES[code] });
}

export function libelleCourtDe(code: CodeDeMatiere): string {
  return LIBELLES_COURTS[code];
}
