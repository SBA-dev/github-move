import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "./generateur-id-fixe.ts";
import { ChoixDeSeance } from "../domain/choix-de-seance.ts";
import type { Hasard } from "../domain/hasard.ts";
import { Seance } from "../domain/seance.ts";
import { hasardSansMelange } from "./hasard-fixe.ts";

const programme = { section: "c2-test", citation: "Citation de test." };

const GROUPES_DES_SONS = [{ id: "g-ou", nom: "ou" }, { id: "g-on", nom: "on" }];

function leconAvecUnExercice(id: string, exercice: Record<string, unknown>): Lecon {
  return lireLecon({
    id,
    matiere: "francais",
    niveau: "CP",
    titre: "Leçon de test",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [exercice],
  });
}

export function leconDeClasserLesSons(): Lecon {
  return leconAvecUnExercice("fr-cp-classer", {
    type: "classer",
    groupes: GROUPES_DES_SONS,
    items: [
      { texte: "loup", groupe: "g-ou" },
      { texte: "pont", groupe: "g-on" },
      { texte: "savon", groupe: "g-on" },
    ],
  });
}

export function leconDeClasserAvecUneAide(): Lecon {
  return leconAvecUnExercice("fr-cp-classer-aide", {
    type: "classer",
    groupes: [{ id: "g-mammiferes", nom: "Mammifères" }, { id: "g-poissons", nom: "Poissons" }],
    items: [
      { texte: "baleine", groupe: "g-mammiferes", aide: "La baleine respire avec des poumons." },
      { texte: "thon", groupe: "g-poissons" },
    ],
  });
}

export function leconDOrdreDuMot(): Lecon {
  return leconAvecUnExercice("fr-cp-ordre", {
    type: "ordre",
    elements: ["do", "mi", "no"],
  });
}

export function leconDOrdreAvecDeuxElementsIdentiques(): Lecon {
  return leconAvecUnExercice("ma-cm1-ordre", {
    type: "ordre",
    elements: ["Avancer de 2 cases", "Tourner à droite", "Avancer de 1 case", "Avancer de 1 case"],
  });
}

export function seanceCommencee(lecon: Lecon, hasard: Hasard = hasardSansMelange()): Seance {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasard,
    "profil-lea",
    lecon,
    ChoixDeSeance.complete(),
  );
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  seance.retirerFaits();
  return seance;
}
