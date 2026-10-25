import type { SectionDuProgramme } from "../../catalogue/domain/index.ts";
import type { SectionsDuProgramme } from "../application/ports/sections-du-programme.ts";

export class SectionsDuProgrammeEnMemoire implements SectionsDuProgramme {
  constructor(private readonly sections: SectionDuProgramme[]) {}

  toutes(): Promise<SectionDuProgramme[]> {
    return Promise.resolve(this.sections);
  }
}
