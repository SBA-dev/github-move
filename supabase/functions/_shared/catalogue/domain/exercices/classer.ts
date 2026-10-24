import { LeconMalFormee } from "../erreurs.ts";
import { enObjet, liste, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";

const CONSIGNE_PAR_DEFAUT = "Range chaque étiquette dans la bonne maison.";
const NOMBRE_MINIMAL_DE_GROUPES = 2;

export type Groupe = Readonly<{ id: string; nom: string }>;

export type EtiquetteAClasser = Readonly<{ texte: string; groupe: string; aide?: string }>;

export type ExerciceClasser = Readonly<{
  type: "classer";
  titre?: string;
  consigne: string;
  groupes: readonly Groupe[];
  items: readonly EtiquetteAClasser[];
}>;

export function lireClasser(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceClasser {
  const groupes = liste(brut.groupes, "les groupes").map(lireGroupe);
  if (groupes.length < NOMBRE_MINIMAL_DE_GROUPES) throw new LeconMalFormee("l'exercice n'a pas assez de groupes");
  const identifiants = new Set(groupes.map((groupe) => groupe.id));
  if (identifiants.size !== groupes.length) throw new LeconMalFormee("deux groupes ont le même identifiant");
  const items = liste(brut.items, "les items").map(lireEtiquette);
  if (items.length === 0) throw new LeconMalFormee("l'exercice n'a aucune étiquette à classer");
  for (const item of items) {
    if (!identifiants.has(item.groupe)) throw new LeconMalFormee(`le groupe « ${item.groupe} » n'existe pas`);
  }
  return Object.freeze({
    type: "classer",
    titre: communs.titre,
    consigne: communs.consigne ?? CONSIGNE_PAR_DEFAUT,
    groupes: Object.freeze(groupes),
    items: Object.freeze(items),
  });
}

function lireGroupe(brut: unknown): Groupe {
  const groupe = enObjet(brut, "un groupe");
  return Object.freeze({
    id: texteRequis(groupe.id, "l'identifiant d'un groupe"),
    nom: texteRequis(groupe.nom, "le nom d'un groupe"),
  });
}

function lireEtiquette(brut: unknown): EtiquetteAClasser {
  const item = enObjet(brut, "une étiquette à classer");
  return Object.freeze({
    texte: texteRequis(item.texte, "le texte d'une étiquette"),
    groupe: texteRequis(item.groupe, "le groupe d'une étiquette"),
    aide: texteFacultatif(item.aide, "l'aide d'une étiquette"),
  });
}
