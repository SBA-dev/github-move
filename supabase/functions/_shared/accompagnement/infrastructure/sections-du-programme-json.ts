import { lireSectionDuProgramme, type SectionDuProgramme } from "../../catalogue/domain/index.ts";
import type { SectionsDuProgramme } from "../application/ports/sections-du-programme.ts";

/** Lit les sections dans l'index des programmes (`programmes-index.json`). */
export class SectionsDuProgrammeJson implements SectionsDuProgramme {
  private readonly sections: SectionDuProgramme[];

  constructor(index: readonly unknown[]) {
    this.sections = index.map(lireSectionDuProgramme);
  }

  toutes(): Promise<SectionDuProgramme[]> {
    return Promise.resolve([...this.sections]);
  }
}
