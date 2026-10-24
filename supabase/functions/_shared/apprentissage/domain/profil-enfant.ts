import type { CodeDeNiveau } from "../../catalogue/domain/index.ts";
import type { ReglageDuClavier } from "./clavier-propose.ts";

export type ProfilEnfant = Readonly<{ clavierDesDictees: ReglageDuClavier; niveau: CodeDeNiveau }>;

export const PROFIL_ENFANT_PAR_DEFAUT: ProfilEnfant = { clavierDesDictees: "automatique", niveau: "CP" };
