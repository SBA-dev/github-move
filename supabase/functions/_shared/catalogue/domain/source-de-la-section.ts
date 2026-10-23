type SectionDuProgramme = {
  readonly id: string;
  readonly section: string;
  readonly domaine: string;
  readonly source: { readonly texte: string; readonly bo: string };
};

function estUnObjet(valeur: unknown): valeur is Readonly<Record<string, unknown>> {
  return typeof valeur === "object" && valeur !== null;
}

function estUneSection(valeur: unknown): valeur is SectionDuProgramme {
  if (!estUnObjet(valeur) || !estUnObjet(valeur.source)) return false;
  const { id, section, domaine, source: { texte, bo } } = valeur;
  return typeof id === "string" && typeof section === "string" && typeof domaine === "string" &&
    typeof texte === "string" && typeof bo === "string";
}

function mettreEnForme({ section, domaine, source }: SectionDuProgramme): string {
  return `${source.texte}, ${source.bo} — ${domaine} › ${section}`;
}

export function sourceDeLaSection(indexBrut: unknown, idDeLaSection: string): string | undefined {
  if (!Array.isArray(indexBrut)) return undefined;
  const trouvee = indexBrut.filter(estUneSection).find((section) => section.id === idDeLaSection);
  return trouvee && mettreEnForme(trouvee);
}
