import { parentConnecte } from "../famille/profils/lecture-des-profils-supabase.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { lireLeResultatDuTestDeDepart } from "./lecture-du-resultat-du-test-de-depart-supabase.ts";
import { attendreLesEnvoisDesTestsDeDepart } from "./sauvegarde-du-test-de-depart.ts";
import { TestsDeDepartGardesSurLAppareil } from "./tests-de-depart-gardes-sur-l-appareil.ts";
import { testDeDepartFaitPendantLUtilisation } from "./tests-de-depart-faits-pendant-l-utilisation.ts";

export type EtatDuTestDeDepart = {
  readonly fait: boolean;
  readonly leconsReussies: ReadonlySet<string>;
};

async function leconsDesTestsGardes(profil: string): Promise<ReadonlySet<string> | undefined> {
  const parent = await parentConnecte();
  if (parent === undefined) return undefined;
  const gardes = (await new TestsDeDepartGardesSurLAppareil().lire(parent)).filter(({ corps }) => corps.enfant === profil);
  return gardes.length === 0 ? undefined : new Set(gardes.flatMap(({ leconsReussies }) => leconsReussies));
}

/**
 * Le test de départ du profil : ce que le serveur a enregistré (lecture sous RLS), complété par les tests faits dans ce navigateur
 * ou gardés sur l'appareil. Sans réseau, seuls ces derniers sont connus : le test n'est alors « fait » que s'il l'a été ici.
 */
export async function lireLEtatDuTestDeDepart(profil: string): Promise<EtatDuTestDeDepart> {
  if (reseauDisponible()) await attendreLesEnvoisDesTestsDeDepart();
  const resultats = await Promise.all([
    lireLeResultatDuTestDeDepart(profil),
    leconsDesTestsGardes(profil),
    Promise.resolve(testDeDepartFaitPendantLUtilisation(profil)),
  ]);
  const connus = resultats.filter((lecons): lecons is ReadonlySet<string> => lecons !== undefined);
  return { fait: connus.length > 0, leconsReussies: new Set(connus.flatMap((lecons) => [...lecons])) };
}
