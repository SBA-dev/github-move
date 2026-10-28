import type { CodeDeMatiere } from "@domain/catalogue";


const SIGNES: Readonly<Record<CodeDeMatiere, string>> = {
  francais: "Aa",
  maths: "1+2",
  sciences: "Sc",
  histoire: "His",
  anglais: "Hi!",
  emc: "EMC",
};

/** L'icône d'une matière : une pastille colorée, décorative (le nom de la matière n'est pas lu). */
export function IconeDeMatiere({ matiere }: { readonly matiere: CodeDeMatiere }) {
  return <span className="icone-de-matiere" data-matiere={matiere} aria-hidden="true">{SIGNES[matiere]}</span>;
}
