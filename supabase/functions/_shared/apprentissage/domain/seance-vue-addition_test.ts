import { assertEquals } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconLesDoublesAuCP } from "../test_utils/lecons-de-calcul.ts";
import {
  leconPoserUneAdditionEnColonnesAuCP,
  POSITION_DE_LA_LECON_EN_ACTION,
} from "../test_utils/lecons-d-addition.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

function additionEnAction(): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    leconPoserUneAdditionEnColonnesAuCP(),
    ChoixDeSeance.unExercice(POSITION_DE_LA_LECON_EN_ACTION),
  );
}

function additionEnCours(seance: Seance) {
  const addition = seance.additionEnCours();
  if (!addition) throw new Error("Aucune addition en cours");
  return addition;
}

function colonne(seance: Seance, rang: string) {
  const trouvee = additionEnCours(seance).colonnes.find((candidate) => candidate.rang === rang);
  if (!trouvee) throw new Error(`Aucune colonne ${rang}`);
  return trouvee;
}

function poser45Plus37(seance: Seance): void {
  seance.repondre(Reponse.placement("4", "dizaines"));
  seance.repondre(Reponse.placement("5", "unites"));
  seance.repondre(Reponse.placement("3", "dizaines"));
  seance.repondre(Reponse.placement("7", "unites"));
}

function calculerLesUnites(seance: Seance): void {
  poser45Plus37(seance);
  seance.repondre(Reponse.choix("12"));
}

Deno.test("au début d'une addition posée, la séance donne la consigne de l'étape poser et le nombre à ranger", () => {
  const seance = additionEnAction();

  const addition = additionEnCours(seance);

  assertEquals([addition.nombres, addition.etape, addition.consigne, addition.invite], [
    [45, 37],
    "poser",
    "Pose l'addition 45 + 37 : range chaque chiffre dans sa maison. " +
    "Le chiffre des unités va toujours dans la maison bleue, tout à droite.",
    "Range le nombre 45",
  ]);
});

Deno.test("à poser, la séance dit quel nombre et quels chiffres sont à ranger", () => {
  const seance = additionEnAction();

  const addition = additionEnCours(seance);

  assertEquals([addition.nombreAPoser, [...(addition.chiffresAPoser ?? [])].sort()], [45, ["4", "5"]]);
});

Deno.test("un chiffre bien rangé apparaît dans sa colonne", () => {
  const seance = additionEnAction();

  seance.repondre(Reponse.placement("5", "unites"));

  assertEquals(
    [
      colonne(seance, "unites").chiffresPoses,
      colonne(seance, "unites").couleur,
      colonne(seance, "dizaines").chiffresPoses,
    ],
    [["5"], "bleue", []],
  );
});

Deno.test("après une pose fausse, la séance rend l'aide de rang du chiffre", () => {
  const seance = additionEnAction();

  seance.repondre(Reponse.placement("4", "unites"));

  assertEquals(
    seance.aideApresLaDerniereErreur(),
    "Dans 45, le 4 est le chiffre des dizaines : il va dans la maison rose.",
  );
});

Deno.test("une fois les chiffres posés, la séance demande la colonne des unités sans mention de retenue", () => {
  const seance = additionEnAction();

  poser45Plus37(seance);

  const addition = additionEnCours(seance);
  assertEquals([addition.etape, addition.colonneEnCours, addition.calcul?.phrase], [
    "calculer",
    "unites",
    "Maison des Unités : combien font 5 + 7 ?",
  ]);
});

Deno.test("une colonne calculée avec retenue fait dire à la séance que la dizaine monte en retenue", () => {
  const seance = additionEnAction();

  calculerLesUnites(seance);

  assertEquals(
    seance.additionApresLaDerniereReponse()?.parole,
    "12, c'est 1 dizaine et 2 unités ! J'écris 2, et 1 monte en retenue.",
  );
});

Deno.test("la retenue est visible en haut de la colonne suivante, dont la phrase la mentionne", () => {
  const seance = additionEnAction();

  calculerLesUnites(seance);

  assertEquals(
    [colonne(seance, "dizaines").retenue, additionEnCours(seance).calcul?.phrase],
    [1, "Maison des Dizaines, sans oublier la retenue : combien font 1 + 4 + 3 ?"],
  );
});

Deno.test("le chiffre écrit sous la colonne calculée est visible", () => {
  const seance = additionEnAction();

  calculerLesUnites(seance);

  assertEquals(colonne(seance, "unites").chiffreEcrit, "2");
});

Deno.test("après une retenue oubliée, la séance rend l'aide de la retenue", () => {
  const seance = additionEnAction();
  calculerLesUnites(seance);

  seance.repondre(Reponse.choix("7"));

  assertEquals(seance.aideApresLaDerniereErreur(), "Tu as oublié la retenue, tout en haut de la maison !");
});

Deno.test("après une autre erreur de calcul, la séance invite à compter doucement", () => {
  const seance = additionEnAction();
  poser45Plus37(seance);

  seance.repondre(Reponse.choix("11"));

  assertEquals(seance.aideApresLaDerniereErreur(), "Compte doucement : 5 + 7.");
});

Deno.test("à la fin de l'addition, la séance dit « 45 + 37 = 82. » et montre le résultat 82", () => {
  const seance = additionEnAction();
  calculerLesUnites(seance);

  seance.repondre(Reponse.choix("8"));

  const addition = seance.additionApresLaDerniereReponse();
  assertEquals([addition?.parole, addition?.resultatEcrit], ["45 + 37 = 82.", "82"]);
});

Deno.test("pour un calcul avec choix, la séance dit quels choix sont déjà écartés", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    leconLesDoublesAuCP(),
    ChoixDeSeance.complete(),
  );
  seance.repondre(Reponse.choix("5"));

  const mode = seance.calculEnCours()?.mode;

  assertEquals(mode?.genre === "choix" ? mode.ecartes : undefined, ["5"]);
});

Deno.test("une réponse fausse ne répète pas la parole de la colonne précédente", () => {
  const seance = additionEnAction();
  calculerLesUnites(seance);

  seance.repondre(Reponse.choix("9"));

  const addition = seance.additionApresLaDerniereReponse();
  assertEquals([addition?.parole, seance.aideApresLaDerniereErreur()], [
    undefined,
    "Compte doucement : 1 + 4 + 3.",
  ]);
});
