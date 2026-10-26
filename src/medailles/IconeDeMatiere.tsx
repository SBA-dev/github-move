import type { CodeDeMatiere } from "@domain/catalogue";

type Icone = { readonly couleur: string; readonly signe: string };

const ICONES: Readonly<Record<CodeDeMatiere, Icone>> = {
  francais: { couleur: "#D2477A", signe: "Aa" },
  maths: { couleur: "#2F6FD1", signe: "1+2" },
  sciences: { couleur: "#1E9AA8", signe: "Sc" },
  histoire: { couleur: "#B5762A", signe: "His" },
  anglais: { couleur: "#7A4FD6", signe: "Hi!" },
  emc: { couleur: "#2E8656", signe: "EMC" },
};

/** L'icône d'une matière : une pastille colorée, décorative (le nom de la matière n'est pas lu). */
export function IconeDeMatiere({ matiere }: { readonly matiere: CodeDeMatiere }) {
  const { couleur, signe } = ICONES[matiere];
  return <span className="icone-de-matiere" style={{ background: couleur }} aria-hidden="true">{signe}</span>;
}
