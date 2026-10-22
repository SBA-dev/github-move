import type { ReglageDePhrase } from "./reglage-de-phrase.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

export type LectureDemandee = {
  readonly voix: VoixDisponible | undefined;
  readonly langue: string;
  readonly phrases: readonly ReglageDePhrase[];
};

export interface LecteurAVoixHaute {
  lire(lecture: LectureDemandee): Promise<void>;
  arreter(): void;
}
