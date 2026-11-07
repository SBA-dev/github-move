import { syllabesDuMot } from "./syllabes.ts";

export class InstantsDesMots {
  private constructor(readonly debutsMs: readonly number[]) {}

  static de(phrase: string, dureeMs: number, rythme: number): InstantsDesMots {
    const poids = phrase.split(/\s+/).filter((mot) => mot !== "").map((mot) => syllabesDuMot(mot).length);
    const total = poids.reduce((somme, p) => somme + p, 0);
    const dureeEffectiveMs = dureeMs / rythme;
    let poidsPrecedents = 0;
    const debutsMs = poids.map((p) => {
      const debut = (poidsPrecedents / total) * dureeEffectiveMs;
      poidsPrecedents += p;
      return debut;
    });
    return new InstantsDesMots(debutsMs);
  }
}
