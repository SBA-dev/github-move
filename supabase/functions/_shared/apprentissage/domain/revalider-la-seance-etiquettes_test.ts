import { assertEquals, assertThrows } from "@std/assert";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { leconDeClasserLesSons, leconDOrdreDuMot, seanceCommencee } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { SeanceIncoherente } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";

const fin = new Date("2026-10-24T10:30:00Z");

Deno.test("rejouer un classer posé dans le désordre, avec une erreur, redonne le fait de la séance d'origine", () => {
  const seance = seanceCommencee(leconDeClasserLesSons(), hasardFixe(0, 0));
  seance.repondre(Reponse.placement("savon", "g-on"));
  seance.repondre(Reponse.placement("loup", "g-on"));
  seance.repondre(Reponse.placement("loup", "g-ou"));
  seance.repondre(Reponse.placement("pont", "g-on"));
  const fait = seance.terminer(fin);

  assertEquals(revaliderLaSeance(leconDeClasserLesSons(), seance.aEnregistrer()), fait);
});

Deno.test("rejouer un ordre dont les étiquettes ont été mélangées redonne le fait de la séance d'origine", () => {
  const seance = seanceCommencee(leconDOrdreDuMot(), hasardFixe(0, 0));
  seance.repondre(Reponse.placement("mi"));
  seance.repondre(Reponse.placement("do"));
  seance.repondre(Reponse.placement("mi"));
  seance.repondre(Reponse.placement("no"));
  const fait = seance.terminer(fin);

  assertEquals(revaliderLaSeance(leconDOrdreDuMot(), seance.aEnregistrer()), fait);
});

Deno.test("le placement d'une étiquette inconnue rend la séance incohérente", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("loup", "g-ou"));
  seance.repondre(Reponse.placement("pont", "g-on"));
  seance.repondre(Reponse.placement("savon", "g-on"));
  seance.terminer(fin);
  const envoi = seance.aEnregistrer();
  const avecUneEtiquetteInconnue = {
    ...envoi,
    reponses: [[Reponse.placement("tigre", "g-ou")], ...envoi.reponses.slice(1)],
  };

  assertThrows(() => revaliderLaSeance(leconDeClasserLesSons(), avecUneEtiquetteInconnue), SeanceIncoherente);
});

Deno.test("le placement d'une autre étiquette rangé sous la question d'une étiquette rend la séance incohérente", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("loup", "g-ou"));
  seance.repondre(Reponse.placement("pont", "g-on"));
  seance.repondre(Reponse.placement("savon", "g-on"));
  seance.terminer(fin);
  const envoi = seance.aEnregistrer();
  const reponsesRangeesSousLaMauvaiseQuestion = [
    [Reponse.placement("pont", "g-on"), Reponse.placement("loup", "g-ou")],
    [],
    ...envoi.reponses.slice(2),
  ];

  assertThrows(
    () => revaliderLaSeance(leconDeClasserLesSons(), { ...envoi, reponses: reponsesRangeesSousLaMauvaiseQuestion }),
    SeanceIncoherente,
  );
});
