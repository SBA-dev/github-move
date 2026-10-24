import { type CodeDeNiveau, type Lecon, lireLecon } from "../../catalogue/domain/index.ts";
import { ChoixDeSeance } from "../domain/choix-de-seance.ts";
import type { Hasard } from "../domain/hasard.ts";
import type { QuestionDeDictee } from "../domain/question-de-dictee.ts";
import { Seance } from "../domain/seance.ts";
import { generateurIdFixe } from "./generateur-id-fixe.ts";
import { hasardSansMelange } from "./hasard-fixe.ts";

const programme = { section: "c2-test", citation: "Citation de test." };

type MotDicte = { mot: string; phrase?: string };

type ReglageDuClavier = "automatique" | "lettresDuMot" | "clavierComplet";

export function profilDeDictee(clavierDesDictees: ReglageDuClavier, niveau: CodeDeNiveau) {
  return { clavierDesDictees, niveau };
}

function leconDeDictee(id: string, mots: MotDicte[], consigne = "Écoute bien et écris le mot que tu entends."): Lecon {
  return lireLecon({
    id,
    matiere: "francais",
    niveau: "CP",
    titre: "Dictée de test",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [{ type: "dictee", consigne, mots }],
  });
}

export function leconDeDicteeDuChat(): Lecon {
  return leconDeDictee("fr-cp-dictee-chat", [{ mot: "chat", phrase: "Le chat dort sur le lit." }]);
}

export function leconDeDicteeDeChatEtLapin(): Lecon {
  return leconDeDictee("fr-cp-dictee-chat-lapin", [
    { mot: "chat", phrase: "Le chat dort sur le lit." },
    { mot: "lapin" },
  ]);
}

export function leconDeDicteeAvecSaPropreConsigne(consigne: string): Lecon {
  return leconDeDictee("fr-cp-dictee-consigne", [{ mot: "chat" }], consigne);
}

export function leconDeDicteeDuLapin(): Lecon {
  return leconDeDictee("fr-cp-dictee-lapin", [{ mot: "lapin" }]);
}

export function leconDeDicteeDeSouris(): Lecon {
  return leconDeDictee("fr-cp-dictee-souris", [{ mot: "souris" }]);
}

export function leconDeDicteeDArcEnCiel(): Lecon {
  return leconDeDictee("fr-cp-dictee-arc-en-ciel", [{ mot: "arc-en-ciel" }]);
}

export function leconDeDicteeDeParis(): Lecon {
  return leconDeDictee("fr-cp-dictee-paris", [{ mot: "Paris" }]);
}

export function leconDeDicteeDAujourdhui(): Lecon {
  return leconDeDictee("fr-cp-dictee-aujourdhui", [{ mot: "aujourd'hui" }]);
}

export function seanceDeDictee(
  lecon: Lecon,
  profil = profilDeDictee("lettresDuMot", "CP"),
  hasard: Hasard = hasardSansMelange(),
): Seance {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasard,
    "profil-lea",
    lecon,
    ChoixDeSeance.complete(),
    profil,
  );
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  seance.retirerFaits();
  return seance;
}

export function ecrire(seance: Seance, lettres: string) {
  let resultat;
  for (const lettre of lettres) resultat = seance.taper(lettre);
  return resultat;
}

export function affichageDesCases(question: QuestionDeDictee): string {
  return question.cases().map((une) => {
    if (une.genre === "dejaEcrit") return une.caractere;
    return une.lettre ?? "_";
  }).join("");
}
