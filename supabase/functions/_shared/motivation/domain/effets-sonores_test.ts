import { assertEquals } from "@std/assert";
import {
  effetsSonoresApresUneBonneReponse,
  effetsSonoresDeLaFin,
  effetSonoreDuRecord,
} from "./effets-sonores.ts";

const sansPointGagne = {
  questionsReussiesAvant: 2,
  questionsReussiesApres: 2,
  exerciceComplete: false,
  pendantLeChronoDUneFluence: false,
};

Deno.test("une réponse juste sans point gagné fait jouer seulement l'effet de la réponse juste", () => {
  const effets = effetsSonoresApresUneBonneReponse(sansPointGagne);

  assertEquals(effets, ["reponseJuste"]);
});

Deno.test("un point entré dans le récipient fait jouer le point du récipient après la réponse juste", () => {
  const effets = effetsSonoresApresUneBonneReponse({
    ...sansPointGagne,
    questionsReussiesApres: 3,
  });

  assertEquals(effets, ["reponseJuste", "pointDuRecipient"]);
});

Deno.test("une réponse qui complète l'exercice fait jouer le texte complet à la place de la réponse juste", () => {
  const effets = effetsSonoresApresUneBonneReponse({
    ...sansPointGagne,
    exerciceComplete: true,
  });

  assertEquals(effets, ["texteComplet"]);
});

Deno.test("une réponse qui complète l'exercice et gagne un point fait jouer le texte complet puis le point du récipient", () => {
  const effets = effetsSonoresApresUneBonneReponse({
    ...sansPointGagne,
    questionsReussiesApres: 3,
    exerciceComplete: true,
  });

  assertEquals(effets, ["texteComplet", "pointDuRecipient"]);
});

Deno.test("pendant le chrono d'une fluence, un point gagné ne fait jamais jouer le point du récipient", () => {
  const effets = effetsSonoresApresUneBonneReponse({
    ...sansPointGagne,
    questionsReussiesApres: 3,
    pendantLeChronoDUneFluence: true,
  });

  assertEquals(effets, ["reponseJuste"]);
});

Deno.test("un premier record et un nouveau record font jouer la grande victoire", () => {
  assertEquals(effetSonoreDuRecord("premierRecord"), "grandeVictoire");
  assertEquals(effetSonoreDuRecord("nouveauRecord"), "grandeVictoire");
});

Deno.test("un record inchangé ou l'absence de record ne fait jouer aucun effet", () => {
  assertEquals(effetSonoreDuRecord("recordInchange"), undefined);
  assertEquals(effetSonoreDuRecord("aucunRecord"), undefined);
});

const seanceSansEvenement = {
  fin: "seance",
  leconAcquise: false,
  issueDuRecord: "aucunRecord",
  objetRecu: false,
  episodeOuvert: false,
} as const;

Deno.test("une séance terminée sans leçon acquise, sans objet et sans épisode fait jouer la séance terminée", () => {
  assertEquals(effetsSonoresDeLaFin(seanceSansEvenement), ["seanceTerminee"]);
});

Deno.test("une séance qui rend la leçon acquise fait jouer la grande victoire", () => {
  const effets = effetsSonoresDeLaFin({ ...seanceSansEvenement, leconAcquise: true });

  assertEquals(effets, ["grandeVictoire"]);
});

Deno.test("un nouvel objet de la cabane et un nouvel épisode font jouer la découverte une seule fois", () => {
  const effets = effetsSonoresDeLaFin({
    ...seanceSansEvenement,
    leconAcquise: true,
    objetRecu: true,
    episodeOuvert: true,
  });

  assertEquals(effets, ["grandeVictoire", "decouverte"]);
});

Deno.test("un nouvel épisode seul fait jouer la séance terminée puis la découverte", () => {
  const effets = effetsSonoresDeLaFin({ ...seanceSansEvenement, episodeOuvert: true });

  assertEquals(effets, ["seanceTerminee", "decouverte"]);
});

Deno.test("une séance faite d'une fluence avec un record fait jouer la grande victoire à la place de la séance terminée", () => {
  const effets = effetsSonoresDeLaFin({ ...seanceSansEvenement, issueDuRecord: "nouveauRecord" });

  assertEquals(effets, ["grandeVictoire"]);
});

Deno.test("un test de départ terminé fait jouer seulement la séance terminée", () => {
  const effets = effetsSonoresDeLaFin({
    ...seanceSansEvenement,
    fin: "testDeDepart",
    leconAcquise: true,
    objetRecu: true,
    episodeOuvert: true,
  });

  assertEquals(effets, ["seanceTerminee"]);
});

Deno.test("une séance de révision terminée fait jouer la séance terminée puis la découverte d'un objet", () => {
  const effets = effetsSonoresDeLaFin({
    ...seanceSansEvenement,
    fin: "seanceDeRevision",
    objetRecu: true,
  });

  assertEquals(effets, ["seanceTerminee", "decouverte"]);
});
