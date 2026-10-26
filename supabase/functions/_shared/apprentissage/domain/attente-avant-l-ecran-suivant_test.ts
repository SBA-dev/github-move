import { assertEquals } from "@std/assert";
import { attenteAvantLEcranSuivant, DUREE_D_AFFICHAGE_SANS_VOIX_MS } from "./attente-avant-l-ecran-suivant.ts";

Deno.test("quand la parole est entendue, l'écran suivant n'attend rien de plus", () => {
  assertEquals(attenteAvantLEcranSuivant({ entendue: true, seanceTerminee: false }), { genre: "aucune" });
});

Deno.test("quand la parole est entendue à la fin de la séance, l'écran suivant n'attend rien de plus", () => {
  assertEquals(attenteAvantLEcranSuivant({ entendue: true, seanceTerminee: true }), { genre: "aucune" });
});

Deno.test("sans voix, la fin de la séance attend que l'enfant continue", () => {
  assertEquals(attenteAvantLEcranSuivant({ entendue: false, seanceTerminee: true }), { genre: "enfantQuiContinue" });
});

Deno.test("sans voix, entre deux questions, le message reste affiché pendant 2 secondes", () => {
  assertEquals(attenteAvantLEcranSuivant({ entendue: false, seanceTerminee: false }), {
    genre: "dureeDAffichageSansVoix",
    millisecondes: 2000,
  });
});

Deno.test("la durée d'affichage sans voix est de 2 secondes", () => {
  assertEquals(DUREE_D_AFFICHAGE_SANS_VOIX_MS, 2000);
});
