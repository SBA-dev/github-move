export const NS = "http://www.w3.org/2000/svg";

export function trouver(parent: ParentNode, selecteur: string): SVGElement {
  const element = parent.querySelector<SVGElement>(selecteur);
  if (!element) throw new Error(`Élément de la scène de célébration introuvable : ${selecteur}`);
  return element;
}

/** Retrouve un élément de la scène par son identifiant, une seule fois. */
export function elementsDe(racine: ParentNode): (id: string) => SVGElement {
  const memo = new Map<string, SVGElement>();
  return (id) => {
    const connu = memo.get(id);
    if (connu) return connu;
    const trouve = trouver(racine, `#sports-${id}`);
    memo.set(id, trouve);
    return trouve;
  };
}

export const poser = (element: Element, attribut: string, valeur: string | number) => element.setAttribute(attribut, String(valeur));
export const deplacer = (element: Element, transformation: string) => element.setAttribute("transform", transformation);

export function creerUnGroupe(attributs: Readonly<Record<string, string>> = {}): SVGGElement {
  const groupe = document.createElementNS(NS, "g");
  for (const [nom, valeur] of Object.entries(attributs)) groupe.setAttribute(nom, valeur);
  return groupe;
}
