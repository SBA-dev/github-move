export type Ecran =
  | "connexion"
  | "qui-joue"
  | "controle-parental"
  | "espace-parent"
  | "accueil-de-l-enfant"
  | "parcours"
  | "toutes-les-lecons"
  | "medailles"
  | "test-de-depart"
  | "page-de-la-lecon"
  | "seance";

const PUBLIC_DE_L_ECRAN: Readonly<Record<Ecran, "parent" | "enfant">> = {
  "connexion": "parent",
  "qui-joue": "parent",
  "controle-parental": "parent",
  "espace-parent": "parent",
  "accueil-de-l-enfant": "enfant",
  "parcours": "enfant",
  "toutes-les-lecons": "enfant",
  "medailles": "enfant",
  "test-de-depart": "enfant",
  "page-de-la-lecon": "enfant",
  "seance": "enfant",
};

export function estUnEcranDuParent(ecran: Ecran): boolean {
  return PUBLIC_DE_L_ECRAN[ecran] === "parent";
}
