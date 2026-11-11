import type { Allure } from "./allure.ts";
import type { ReglageDePhrase } from "./reglage-de-phrase.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

export type LectureDemandee = {
  readonly voix: VoixDisponible | undefined;
  readonly langue: string;
  readonly allure?: Allure;
  readonly phrases: readonly ReglageDePhrase[];
  readonly texteEnregistreDeRemplacement?: string;
  readonly onMot?: (phrase: number, position: number) => void;
};

export interface LecteurAVoixHaute {
  lire(lecture: LectureDemandee): Promise<void>;
  arreter(): void;
}
