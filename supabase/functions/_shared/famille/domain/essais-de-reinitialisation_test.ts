import { assert, assertEquals, assertThrows } from "@std/assert";
import { AdresseEmail } from "./adresse-email.ts";
import { TropDEssaisDeReinitialisation } from "./erreurs.ts";
import { EssaisDeReinitialisation } from "./essais-de-reinitialisation.ts";

const debut = new Date("2026-10-24T10:00:00Z");

function plusDeMinutes(instant: Date, minutes: number): Date {
  return new Date(instant.getTime() + minutes * 60_000);
}

function plusDHeures(instant: Date, heures: number): Date {
  return plusDeMinutes(instant, heures * 60);
}

function essaisApres(ratesAuxInstants: Date[]): EssaisDeReinitialisation {
  const essais = EssaisDeReinitialisation.nouveaux(AdresseEmail.de("parent@exemple.fr"));
  for (const instant of ratesAuxInstants) essais.enregistrerUnEssaiRate(instant);
  return essais;
}

function quatreRatesALaFois(): Date[] {
  return [0, 1, 2, 3].map((minutes) => plusDeMinutes(debut, minutes));
}

function cinqRatesALaFois(): Date[] {
  return [0, 1, 2, 3, 4].map((minutes) => plusDeMinutes(debut, minutes));
}

Deno.test("la réinitialisation reste ouverte après quatre essais ratés", () => {
  const essais = essaisApres(quatreRatesALaFois());

  essais.verifierQueLaReinitialisationEstOuverte(plusDeMinutes(debut, 5));
});

Deno.test("le cinquième essai raté bloque la réinitialisation", () => {
  const essais = essaisApres(cinqRatesALaFois());

  assertThrows(
    () => essais.verifierQueLaReinitialisationEstOuverte(plusDeMinutes(debut, 5)),
    TropDEssaisDeReinitialisation,
    "Trop d'essais. Réessaie dans une heure.",
  );
});

Deno.test("la réinitialisation est encore bloquée 59 minutes après le cinquième essai raté", () => {
  const essais = essaisApres(cinqRatesALaFois());

  assertThrows(
    () => essais.verifierQueLaReinitialisationEstOuverte(plusDeMinutes(debut, 4 + 59)),
    TropDEssaisDeReinitialisation,
  );
});

Deno.test("la réinitialisation rouvre 61 minutes après le cinquième essai raté", () => {
  const essais = essaisApres(cinqRatesALaFois());

  essais.verifierQueLaReinitialisationEstOuverte(plusDeMinutes(debut, 4 + 61));
});

Deno.test("un essai raté après la fin du blocage est le premier d'une nouvelle série", () => {
  const essais = essaisApres(cinqRatesALaFois());
  const apresLeBlocage = plusDeMinutes(debut, 4 + 61);

  essais.enregistrerUnEssaiRate(apresLeBlocage);

  assertEquals(essais.essaisRates, 1);
});

Deno.test("une réussite remet le compteur d'essais ratés à zéro", () => {
  const essais = essaisApres(quatreRatesALaFois());

  essais.enregistrerUneReussite();
  essais.enregistrerUnEssaiRate(plusDeMinutes(debut, 10));

  assertEquals(essais.essaisRates, 1);
});

Deno.test("un essai pendant le blocage ne prolonge pas le blocage", () => {
  const essais = essaisApres(cinqRatesALaFois());
  const finDuBlocage = essais.bloqueJusquA;

  assertThrows(
    () => essais.verifierQueLaReinitialisationEstOuverte(plusDeMinutes(debut, 30)),
    TropDEssaisDeReinitialisation,
  );

  assertEquals(essais.bloqueJusquA, finDuBlocage);
  assertEquals(finDuBlocage, plusDeMinutes(debut, 4 + 60));
});

Deno.test("quatre essais ratés il y a 23 heures comptent encore", () => {
  const essais = essaisApres(quatreRatesALaFois());

  essais.enregistrerUnEssaiRate(plusDHeures(debut, 23 + 1));

  assertEquals(essais.essaisRates, 5);
  assertThrows(
    () => essais.verifierQueLaReinitialisationEstOuverte(plusDHeures(debut, 24)),
    TropDEssaisDeReinitialisation,
  );
});

Deno.test("quatre essais ratés il y a 25 heures sont oubliés", () => {
  const essais = essaisApres(quatreRatesALaFois());

  essais.enregistrerUnEssaiRate(plusDHeures(debut, 25 + 1));

  assertEquals(essais.essaisRates, 1);
  essais.verifierQueLaReinitialisationEstOuverte(plusDHeures(debut, 26));
});

Deno.test("des essais ratés sont oubliés 24 heures après le dernier raté", () => {
  const essais = essaisApres(quatreRatesALaFois());
  const dernierRate = plusDeMinutes(debut, 3);

  assert(!essais.estOublie(plusDHeures(dernierRate, 23)));
  assert(essais.estOublie(plusDHeures(dernierRate, 24)));
});

Deno.test("une adresse sans aucun essai raté est oubliée", () => {
  const essais = EssaisDeReinitialisation.nouveaux(AdresseEmail.de("parent@exemple.fr"));

  assert(essais.estOublie(debut));
});

Deno.test("des essais restent à retenir pendant le blocage", () => {
  const essais = essaisApres(cinqRatesALaFois());

  assert(!essais.estOublie(plusDeMinutes(debut, 30)));
  assert(essais.estOublie(plusDeMinutes(debut, 4 + 60)));
});

Deno.test("des essais reconstitués gardent leur compteur et leur blocage", () => {
  const dernierRate = plusDeMinutes(debut, 4);
  const essais = EssaisDeReinitialisation.reconstituer(
    AdresseEmail.de("Parent@Exemple.fr"),
    5,
    dernierRate,
    plusDeMinutes(dernierRate, 60),
  );

  assert(essais.adresse.estLaMemeQue(AdresseEmail.de("parent@exemple.fr")));
  assertThrows(
    () => essais.verifierQueLaReinitialisationEstOuverte(plusDeMinutes(debut, 30)),
    TropDEssaisDeReinitialisation,
  );
});
