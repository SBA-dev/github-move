import { assert, assertEquals } from "@std/assert";
import { HeureDeLHorloge, PrecisionDeLHeure } from "../../catalogue/domain/index.ts";
import { heuresProposees } from "./choix-d-heures.ts";

function proposer(heure: string, precision: string): HeureDeLHorloge[] {
  return heuresProposees(HeureDeLHorloge.lire(heure), PrecisionDeLHeure.lire(precision));
}

function ecritures(heures: readonly HeureDeLHorloge[]): string[] {
  return heures.map((heure) => heure.ecriture());
}

const CAS = [
  ["3:00", "heure"],
  ["12:00", "heure"],
  ["3:30", "demi-heure"],
  ["3:45", "quart-d-heure"],
  ["14:15", "quart-d-heure"],
  ["7:35", "cinq-minutes"],
  ["6:18", "minute"],
] as const;

Deno.test("trois heures sont proposées, dont la bonne réponse", () => {
  for (const [heure, precision] of CAS) {
    const proposees = proposer(heure, precision);

    assertEquals(proposees.length, 3, `${heure} ${precision}`);
    assert(proposees.some((p) => p.egale(HeureDeLHorloge.lire(heure))), `${heure} ${precision}`);
  }
});

Deno.test("les heures proposées sont toutes différentes sur le cadran", () => {
  for (const [heure, precision] of CAS) {
    const proposees = proposer(heure, precision);

    const positions = new Set(proposees.map((p) => p.surLeCadran()));
    assertEquals(positions.size, proposees.length, `${heure} ${precision}`);
  }
});

Deno.test("les heures proposées respectent la précision de l'exercice", () => {
  for (const [heure, precision] of CAS) {
    const exigee = PrecisionDeLHeure.lire(precision);

    assert(proposer(heure, precision).every((p) => exigee.respectee(p)), `${heure} ${precision}`);
  }
});

Deno.test("les heures entières proposées au CP restent des heures entières", () => {
  const proposees = proposer("3:00", "heure");

  assert(proposees.every((p) => p.minutes === 0 && p.secondes === 0));
});

Deno.test("3 h est proposée avec « 12 h 15 », où les aiguilles sont lues à l'envers", () => {
  assert(ecritures(proposer("3:00", "quart-d-heure")).includes("12 h 15"));
});

Deno.test("3 h 45 est proposée avec « 4 h 45 », l'heure d'à côté", () => {
  assert(ecritures(proposer("3:45", "quart-d-heure")).includes("4 h 45"));
});

Deno.test("les mêmes heures sont proposées à chaque fois pour la même question", () => {
  assertEquals(ecritures(proposer("3:45", "quart-d-heure")), ecritures(proposer("3:45", "quart-d-heure")));
});

Deno.test("3 h à la précision heure est proposée avec « 12 h », le chiffre montré par la grande aiguille", () => {
  assert(ecritures(proposer("3:00", "heure")).includes("12 h"));
});

Deno.test("12 h à la précision heure est proposée avec trois heures différentes", () => {
  const proposees = ecritures(proposer("12:00", "heure"));

  assertEquals(new Set(proposees).size, 3);
});
