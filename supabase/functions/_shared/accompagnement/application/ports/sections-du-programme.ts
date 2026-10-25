import type { SectionDuProgramme } from "../../../catalogue/domain/index.ts";

export interface SectionsDuProgramme {
  toutes(): Promise<SectionDuProgramme[]>;
}
