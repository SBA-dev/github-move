import { assertEquals } from "@std/assert";
import { SeancesTermineesDuProfil } from "./seances-terminees-du-profil.ts";

Deno.test("sans aucune séance terminée, le profil en compte 0", () => {
  assertEquals(SeancesTermineesDuProfil.reunir().nombre(), 0);
});

Deno.test("une séance gardée sur l'appareil déjà arrivée au serveur n'est comptée qu'une fois", () => {
  const seancesLues = ["seance-1", "seance-2"];
  const seancesGardeesSurLAppareil = ["seance-2", "seance-3"];

  const seances = SeancesTermineesDuProfil.reunir(seancesLues, seancesGardeesSurLAppareil);

  assertEquals(seances.nombre(), 3);
});

Deno.test("les séances de révision terminées comptent comme les autres séances", () => {
  const seancesLues = ["seance-1"];
  const seancesDeRevisionLues = ["revision-1", "revision-2"];

  const seances = SeancesTermineesDuProfil.reunir(seancesLues, seancesDeRevisionLues);

  assertEquals(seances.nombre(), 3);
});

Deno.test("une séance refusée, absente des sources fournies, ne compte pas", () => {
  const seancesLues = ["seance-1"];
  const seancesGardeesSurLAppareil = ["seance-2"];

  const seances = SeancesTermineesDuProfil.reunir(seancesLues, seancesGardeesSurLAppareil);

  assertEquals(seances.nombre(), 2);
});
