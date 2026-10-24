import type { CodeDeNiveau } from "../../catalogue/domain/index.ts";
import type { ReglageDuClavier } from "./clavier-propose.ts";

export type ProfilDeSeance = Readonly<{ clavierDesDictees: ReglageDuClavier; niveau: CodeDeNiveau }>;

export const PROFIL_DE_SEANCE_PAR_DEFAUT: ProfilDeSeance = { clavierDesDictees: "automatique", niveau: "CP" };
