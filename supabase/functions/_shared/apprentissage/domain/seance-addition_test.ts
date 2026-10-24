import { assertEquals, assertInstanceOf, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import {
  leconPoserUneAdditionEnColonnesAuCP,
  POSITION_DE_LA_LECON_EN_ACTION,
  POSITION_DE_POSER_COMME_UN_CHAMPION,
  POSITION_DU_CALCUL_AVEC_RETENUE,
} from "../test_utils/lecons-d-addition.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { SeanceIncoherente, TirageHorsDuGenerateur } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";
import { Seance } from "./seance.ts";

const fin = new Date("2026-10-24T10:30:00Z");

function commencer(lecon: Lecon, position: number): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    lecon,
    ChoixDeSeance.unExercice(position),
  );
}

function seanceDe(position: number): Seance {
  return commencer(leconPoserUneAdditionEnColonnesAuCP(), position);
}

function poser45Plus37(seance: Seance): void {
  seance.repondre(Reponse.placement("4", "dizaines"));
  seance.repondre(Reponse.placement("5", "unites"));
  seance.repondre(Reponse.placement("3", "dizaines"));
  seance.repondre(Reponse.placement("7", "unites"));
}

function jouerTroisAdditionsTirees(seance: Seance): void {
  for (let addition = 0; addition < 3; addition++) {
    seance.repondre(Reponse.choix("18"));
    seance.repondre(Reponse.choix("11"));
    seance.repondre(Reponse.choix("1"));
  }
}

function seanceTerminee45Plus37AvecDesFautes(): Seance {
  const seance = seanceDe(POSITION_DE_LA_LECON_EN_ACTION);
  seance.repondre(Reponse.placement("4", "unites"));
  seance.repondre(Reponse.placement("4", "dizaines"));
  seance.repondre(Reponse.placement("5", "unites"));
  seance.repondre(Reponse.placement("3", "dizaines"));
  seance.direJeNeSaisPas("7");
  seance.repondre(Reponse.placement("7", "unites"));
  seance.repondre(Reponse.choix("11"));
  seance.repondre(Reponse.choix("12"));
  seance.repondre(Reponse.choix("8"));
  return seance;
}

Deno.test("l'avancement de « La leçon en action : 45 + 37 » compte 6 questions : 4 chiffres à poser et 2 colonnes à calculer", () => {
  const seance = seanceDe(POSITION_DE_LA_LECON_EN_ACTION);

  assertEquals(seance.avancement().total, 6);
  assertEquals(seance.avancement().questionsReussies, 0);
});

Deno.test("chaque chiffre posé dans sa colonne fait avancer l'addition d'une question", () => {
  const seance = seanceDe(POSITION_DE_LA_LECON_EN_ACTION);

  poser45Plus37(seance);

  assertEquals(seance.avancement().questionsReussies, 4);
  assertEquals(seance.estFinie(), false);
});

Deno.test("une fois les chiffres posés, la colonne des unités se calcule et une bonne réponse compte une question", () => {
  const seance = seanceDe(POSITION_DE_LA_LECON_EN_ACTION);
  poser45Plus37(seance);

  const resultat = seance.repondre(Reponse.choix("12"));

  assertEquals(resultat, "juste");
  assertEquals(seance.avancement().questionsReussies, 5);
});

Deno.test("l'exercice d'addition est fini quand toutes les colonnes sont calculées", () => {
  const seance = seanceDe(POSITION_DE_LA_LECON_EN_ACTION);
  poser45Plus37(seance);
  seance.repondre(Reponse.choix("12"));

  seance.repondre(Reponse.choix("8"));

  assertEquals(seance.estFinie(), true);
});

Deno.test("sans étape poser, les nombres sont déjà posés : l'exercice de « Poser comme un champion » compte 12 chiffres", () => {
  const seance = seanceDe(POSITION_DE_POSER_COMME_UN_CHAMPION);

  assertEquals(seance.avancement().total, 12);
});

Deno.test("sans étape calculer, l'addition est finie quand tous ses chiffres sont posés", () => {
  const seance = seanceDe(POSITION_DE_POSER_COMME_UN_CHAMPION);
  const chiffres = [
    ["2", "dizaines"],
    ["8", "unites"],
    ["8", "unites"],
    ["5", "dizaines"],
    ["6", "unites"],
    ["6", "dizaines"],
    ["3", "unites"],
    ["9", "unites"],
    ["3", "dizaines"],
    ["4", "unites"],
    ["5", "dizaines"],
    ["2", "unites"],
  ] as const;

  chiffres.forEach(([chiffre, colonne]) => seance.repondre(Reponse.placement(chiffre, colonne)));

  assertEquals(seance.estFinie(), true);
});

Deno.test("avec une addition tirée sans étape poser, l'avancement compte une colonne par colonne de chaque tirage", () => {
  const seance = seanceDe(POSITION_DU_CALCUL_AVEC_RETENUE);

  assertEquals(seance.avancement().total, 9);
});

Deno.test("une addition tirée sans étape poser commence directement par le calcul de la colonne des unités", () => {
  const seance = seanceDe(POSITION_DU_CALCUL_AVEC_RETENUE);

  assertEquals(seance.repondre(Reponse.choix("18")), "juste");
});

Deno.test("le tirage de l'addition tirée est gardé pour le serveur, une ligne par addition", () => {
  const seance = seanceDe(POSITION_DU_CALCUL_AVEC_RETENUE);

  assertEquals(seance.exerciceEnCours()!.tirages()[0], ["59 + 59", "59 + 59", "59 + 59"]);
});

Deno.test("un chiffre posé dans la mauvaise colonne coûte une erreur", () => {
  const seance = seanceDe(POSITION_DE_LA_LECON_EN_ACTION);

  const resultat = seance.repondre(Reponse.placement("4", "unites"));

  assertEquals(resultat, "fausse");
  assertEquals(seance.erreurs(), 1);
});

Deno.test("une mauvaise réponse à l'étape calculer coûte une erreur", () => {
  const seance = seanceDe(POSITION_DE_LA_LECON_EN_ACTION);
  poser45Plus37(seance);

  seance.repondre(Reponse.choix("11"));

  assertEquals(seance.erreurs(), 1);
});

Deno.test("« Je ne sais pas » à l'étape poser fait briller la bonne colonne du chiffre choisi", () => {
  const seance = seanceDe(POSITION_DE_LA_LECON_EN_ACTION);

  const aide = seance.direJeNeSaisPas("4");

  assertEquals(aide, {
    aide: "Dans 45, le 4 est le chiffre des dizaines : il va dans la maison rose.",
    bonneReponse: "dizaines",
    maniere: "briller",
  });
});

Deno.test("« Je ne sais pas » à l'étape poser coûte une erreur", () => {
  const seance = seanceDe(POSITION_DE_LA_LECON_EN_ACTION);

  seance.direJeNeSaisPas("4");

  assertEquals(seance.erreurs(), 1);
});

Deno.test("« Je ne sais pas » à l'étape calculer montre la bonne réponse de la colonne", () => {
  const seance = seanceDe(POSITION_DE_LA_LECON_EN_ACTION);
  poser45Plus37(seance);

  const aide = seance.direJeNeSaisPas();

  assertEquals(aide.bonneReponse, "12");
  assertEquals(aide.maniere, "briller");
});

Deno.test("les questions d'une addition posée ont leur propre type : chiffre posé et colonne calculée", () => {
  const seance = seanceTerminee45Plus37AvecDesFautes();

  const fait = seance.terminer(fin);

  assertEquals(fait.parType, {
    chiffre: { reussites: 4, erreurs: 2 },
    colonne: { reussites: 2, erreurs: 1 },
  });
});

Deno.test("les questions ratées d'une addition posée disent si « Je ne sais pas » a été dit", () => {
  const seance = seanceTerminee45Plus37AvecDesFautes();

  const fait = seance.terminer(fin);

  assertEquals(fait.questionsRatees.map(({ erreurs, jeNeSaisPas }) => [erreurs, jeNeSaisPas]), [
    [1, false],
    [1, true],
    [1, false],
  ]);
});

Deno.test("rejouer une addition posée avec une erreur de pose, un « Je ne sais pas » et une retenue redonne le même résultat", () => {
  const lecon = leconPoserUneAdditionEnColonnesAuCP();
  const seance = seanceTerminee45Plus37AvecDesFautes();
  const fait = seance.terminer(fin);

  assertEquals(revaliderLaSeance(lecon, seance.aEnregistrer()), fait);
});

Deno.test("rejouer des additions tirées redonne le même résultat", () => {
  const lecon = leconPoserUneAdditionEnColonnesAuCP();
  const seance = seanceDe(POSITION_DU_CALCUL_AVEC_RETENUE);
  jouerTroisAdditionsTirees(seance);
  const fait = seance.terminer(fin);

  assertEquals(revaliderLaSeance(lecon, seance.aEnregistrer()), fait);
});

Deno.test("le serveur refuse une séance dont une addition tirée sort du générateur", () => {
  const lecon = leconPoserUneAdditionEnColonnesAuCP();
  const seance = seanceDe(POSITION_DU_CALCUL_AVEC_RETENUE);
  jouerTroisAdditionsTirees(seance);
  seance.terminer(fin);
  const envoi = seance.aEnregistrer();
  const horsGenerateur = { ...envoi, tirages: [["30 + 2", "59 + 59", "59 + 59"], ...envoi.tirages.slice(1)] };

  const erreur = assertThrows(() => revaliderLaSeance(lecon, horsGenerateur), SeanceIncoherente);

  assertInstanceOf(erreur.cause, TirageHorsDuGenerateur);
});
