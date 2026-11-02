import { assertEquals } from "@std/assert";
import { matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import type { CodeDeMatiere } from "../../catalogue/domain/index.ts";
import type { DefiReleve } from "../../apprentissage/domain/index.ts";
import { defiReleveParLaSeance, lignesDesDefisReleves } from "./defis-releves.ts";

function defi(matiere: CodeDeMatiere, niveau: string, numero: number): DefiReleve {
  return { matiere: matiereDeCode(matiere), niveau: Niveau.de(niveau), numero };
}

Deno.test("un défi terminé pour la première fois est annoncé « Défi relevé ! » et fête la grande victoire", () => {
  const issue = defiReleveParLaSeance([], defi("maths", "CE1", 1));

  assertEquals(issue, { annonce: "Défi relevé !", effetSonore: "grandeVictoire" });
});

Deno.test("un défi déjà relevé et rejoué n'est pas annoncé et fait jouer la séance terminée", () => {
  const issue = defiReleveParLaSeance([defi("maths", "CE1", 1)], defi("maths", "CE1", 1));

  assertEquals(issue, { annonce: undefined, effetSonore: "seanceTerminee" });
});

Deno.test("un défi relevé d'une autre matière ne fait pas passer ce défi pour rejoué", () => {
  const issue = defiReleveParLaSeance([defi("francais", "CE1", 1)], defi("maths", "CE1", 1));

  assertEquals(issue.annonce, "Défi relevé !");
});

Deno.test("un défi relevé d'une autre classe ne fait pas passer ce défi pour rejoué", () => {
  const issue = defiReleveParLaSeance([defi("maths", "CE2", 1)], defi("maths", "CE1", 1));

  assertEquals(issue.annonce, "Défi relevé !");
});

Deno.test("un autre numéro de défi relevé ne fait pas passer ce défi pour rejoué", () => {
  const issue = defiReleveParLaSeance([defi("maths", "CE1", 2)], defi("maths", "CE1", 1));

  assertEquals(issue.annonce, "Défi relevé !");
});

Deno.test("la fin d'un défi ne donne ni étoile, ni objet, ni tenue, ni badge, ni épisode", () => {
  const issue = defiReleveParLaSeance([], defi("maths", "CE1", 1));

  assertEquals(Object.keys(issue).sort(), ["annonce", "effetSonore"]);
});

Deno.test("sans défi relevé, la section « Mes défis relevés » n'a aucune ligne", () => {
  assertEquals(lignesDesDefisReleves([]), []);
});

Deno.test("un défi relevé s'écrit « Défi 1 · Maths · CE1 »", () => {
  assertEquals(lignesDesDefisReleves([defi("maths", "CE1", 1)]), ["Défi 1 · Maths · CE1"]);
});

Deno.test("les matières s'écrivent comme sur l'écran du parcours", () => {
  const lignes = lignesDesDefisReleves([defi("histoire", "CM1", 2), defi("emc", "CM1", 1)]);

  assertEquals(lignes, ["Défi 2 · Histoire-géo · CM1", "Défi 1 · Vivre ensemble · CM1"]);
});

Deno.test("un défi relevé et rejoué n'apparaît qu'une seule fois", () => {
  const lignes = lignesDesDefisReleves([defi("maths", "CE1", 1), defi("maths", "CE1", 1)]);

  assertEquals(lignes, ["Défi 1 · Maths · CE1"]);
});

Deno.test("les défis relevés sont rangés par matière, puis classe, puis numéro", () => {
  const lignes = lignesDesDefisReleves([
    defi("maths", "CE1", 2),
    defi("maths", "CE1", 1),
    defi("francais", "CE2", 1),
    defi("maths", "CP", 3),
  ]);

  assertEquals(lignes, [
    "Défi 1 · Français · CE2",
    "Défi 3 · Maths · CP",
    "Défi 1 · Maths · CE1",
    "Défi 2 · Maths · CE1",
  ]);
});
