import { expect, test } from "@playwright/test";
import { ouvrirApplicationActuelle } from "./ouvrir.ts";
import {
  bibliotheque,
  jouerJusquALaFin,
  lireDocs,
  ouvrirLeconDepuisToutesLesLecons,
  preparerNavigateur,
  profilEnfant,
  surveillerErreurs,
} from "./outils.ts";

// Chaque leçon de app/bibliotheque.json est jouée en entier, par un enfant de sa classe.
// Les questions à choix sont passées par « Je ne sais pas » ; les autres exercices reçoivent la bonne réponse.
// Toutes les leçons sont jouées sur la tablette. Sur le téléphone, on joue un échantillon fixe :
// la première leçon de chaque type d'exercice et de chaque classe (les autres portent l'étiquette
// @bibliotheque-complete, écartée par le projet « telephone » de playwright.legacy.config.ts).
test.describe.configure({ mode: "parallel" });

const echantillon = new Set<string>();
for (const cle of [...new Set(bibliotheque.flatMap((l) => [l.niveau, ...l.exercices.map((e) => e.type)]))]) {
  const premiere = bibliotheque.find((l) => l.niveau === cle || l.exercices.some((e) => e.type === cle));
  if (premiere) echantillon.add(premiere.id);
}

for (const lecon of bibliotheque) {
  const types = [...new Set(lecon.exercices.map((e) => e.type))].join(", ");
  const tag = echantillon.has(lecon.id) ? [] : ["@bibliotheque-complete"];
  test(`la leçon ${lecon.id} (${lecon.niveau} ; ${types}) se joue jusqu'à l'écran de fin`, { tag }, async ({ page }) => {
    const erreurs = surveillerErreurs(page);
    await preparerNavigateur(page, { docs: profilEnfant("enfant_lea", { niveau: lecon.niveau }) });
    await ouvrirApplicationActuelle(page);
    await ouvrirLeconDepuisToutesLesLecons(page, "Léa", lecon);

    await jouerJusquALaFin(page);

    const etoiles = await page.locator(".medal .big-stars svg.on").count();
    expect(etoiles).toBeGreaterThanOrEqual(1);
    const docs = await lireDocs(page);
    expect(docs[`progres_enfant_lea_${lecon.id}`]).toMatchObject({ lecon: lecon.id, essais: 1, etoiles });
    expect(erreurs).toEqual([]);
  });
}
