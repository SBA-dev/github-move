import { assert, assertInstanceOf, assertThrows } from "@std/assert";
import { leconDeClasserLesSons, leconDOrdreDuMot, seanceCommencee } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { SeanceIncoherente, TirageInvalide } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";
import type { SeanceTermineeAEnregistrer } from "./seance-terminee-a-enregistrer.ts";

const fin = new Date("2026-10-24T10:30:00Z");

function classerTermine(): SeanceTermineeAEnregistrer {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("loup", "g-ou"));
  seance.repondre(Reponse.placement("pont", "g-on"));
  seance.repondre(Reponse.placement("savon", "g-on"));
  seance.terminer(fin);
  return seance.aEnregistrer();
}

function ordreTermine(): SeanceTermineeAEnregistrer {
  const seance = seanceCommencee(leconDOrdreDuMot());
  seance.repondre(Reponse.placement("do"));
  seance.repondre(Reponse.placement("mi"));
  seance.repondre(Reponse.placement("no"));
  seance.terminer(fin);
  return seance.aEnregistrer();
}

function avecLePlateau(envoi: SeanceTermineeAEnregistrer, plateau: string[]): SeanceTermineeAEnregistrer {
  return { ...envoi, tirages: [plateau] };
}

function assertTirageInvalide(lecon: Parameters<typeof revaliderLaSeance>[0], envoi: SeanceTermineeAEnregistrer) {
  const erreur = assertThrows(() => revaliderLaSeance(lecon, envoi), SeanceIncoherente);
  assertInstanceOf(erreur.cause, TirageInvalide);
}

Deno.test("un plateau de classer avec une étiquette en trop est un tirage invalide", () => {
  const envoi = avecLePlateau(classerTermine(), ["loup", "pont", "savon", "tigre"]);

  assertTirageInvalide(leconDeClasserLesSons(), envoi);
});

Deno.test("un plateau de classer auquel il manque une étiquette est un tirage invalide", () => {
  const envoi = avecLePlateau(classerTermine(), ["loup", "pont"]);

  assertTirageInvalide(leconDeClasserLesSons(), envoi);
});

Deno.test("un plateau de classer avec un doublon en trop est un tirage invalide", () => {
  const envoi = avecLePlateau(classerTermine(), ["loup", "loup", "pont", "savon"]);

  assertTirageInvalide(leconDeClasserLesSons(), envoi);
});

Deno.test("un plateau de classer avec une étiquette étrangère à la place d'une autre est un tirage invalide", () => {
  const envoi = avecLePlateau(classerTermine(), ["loup", "pont", "tigre"]);

  assertTirageInvalide(leconDeClasserLesSons(), envoi);
});

Deno.test("un plateau de classer qui fusionne deux étiquettes en une seule est un tirage invalide", () => {
  const envoi = avecLePlateau(classerTermine(), ["loup\npont", "savon"]);

  assertTirageInvalide(leconDeClasserLesSons(), envoi);
});

Deno.test("un plateau d'ordre qui fusionne deux étiquettes en une seule est un tirage invalide", () => {
  const envoi = avecLePlateau(ordreTermine(), ["do\nmi", "no"]);

  assertTirageInvalide(leconDOrdreDuMot(), envoi);
});

Deno.test("un plateau d'ordre avec les mêmes étiquettes dans un autre ordre est accepté", () => {
  const envoi = avecLePlateau(ordreTermine(), ["no", "do", "mi"]);

  assert(revaliderLaSeance(leconDOrdreDuMot(), envoi));
});
