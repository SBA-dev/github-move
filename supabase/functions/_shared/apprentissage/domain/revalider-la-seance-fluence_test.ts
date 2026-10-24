import { assertThrows } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDUneSeuleFluenceAuCP } from "../test_utils/lecons-de-fluence.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { SeanceIncoherente } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";
import { Seance } from "./seance.ts";

const debut = new Date("2026-10-23T10:00:00Z");
const fin = new Date("2026-10-23T10:30:00Z");

Deno.test("une fluence de 45 secondes qui compte plus de 3 réponses par seconde est incohérente", () => {
  const lecon = leconDUneSeuleFluenceAuCP();
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-lea",
    lecon,
    ChoixDeSeance.complete(),
  );
  seance.demarrerLaFluence(debut);
  for (let i = 0; i < 136; i++) seance.repondre(Reponse.nombre(20), debut);
  seance.finirLaFluence(new Date(debut.getTime() + 45_000));
  seance.terminer(fin);

  assertThrows(() => revaliderLaSeance(lecon, seance.aEnregistrer()), SeanceIncoherente);
});
