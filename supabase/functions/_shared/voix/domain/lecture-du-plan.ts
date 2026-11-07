import { InstantsDesMots } from "./instants-des-mots.ts";
import type { LecteurAVoixHaute } from "./lecteur-a-voix-haute.ts";
import type { LecteurDeSonsDePhrases } from "./lecteur-de-sons-de-phrases.ts";
import type { EtapeDeLecture, PlanDeLecture } from "./plan-de-lecture.ts";
import type { ReglageDePhrase } from "./reglage-de-phrase.ts";
import { SonIllisible } from "./erreurs.ts";
import type { Surlignage } from "./surlignage.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

type GroupeDeLecture =
  | Extract<EtapeDeLecture, { type: "voixDeLApplication" }> & {
    readonly reglage: ReglageDePhrase;
    readonly indice: number;
  }
  | { readonly type: "voixDeLAppareil"; readonly phrases: ReglageDePhrase[]; readonly indice: number }
  | { readonly type: "aucune" };

function grouperLesEtapes(etapes: readonly EtapeDeLecture[], reglages: readonly ReglageDePhrase[]): GroupeDeLecture[] {
  const groupes: GroupeDeLecture[] = [];
  etapes.forEach((etape, i) => {
    const reglage = reglages[i];
    const dernier = groupes.at(-1);
    if (!reglage) return;
    if (etape.type === "aucune") groupes.push({ type: "aucune" });
    else if (etape.type === "voixDeLApplication") groupes.push({ ...etape, reglage, indice: i });
    else if (dernier?.type === "voixDeLAppareil") dernier.phrases.push(reglage);
    else groupes.push({ type: "voixDeLAppareil", phrases: [reglage], indice: i });
  });
  return groupes;
}

export type LectureDuPlanDemandee = {
  readonly plan: PlanDeLecture;
  readonly reglages: readonly ReglageDePhrase[];
  readonly langue: string;
  readonly voixDeLAppareil: VoixDisponible | undefined;
  readonly lecteur: LecteurAVoixHaute;
  readonly jouerUnSon: LecteurDeSonsDePhrases["jouer"];
  readonly surligner: Surlignage | undefined;
  readonly interrompue: () => boolean;
};

export type ResultatDeLaLectureDuPlan = "toutDit" | "phraseNonDite" | "interrompue";

export async function lireLePlan(demande: LectureDuPlanDemandee): Promise<ResultatDeLaLectureDuPlan> {
  const { lecteur, surligner } = demande;
  const lireParLAppareil = (phrases: readonly ReglageDePhrase[], premierePhrase: number) =>
    lecteur.lire({
      voix: demande.voixDeLAppareil,
      langue: demande.langue,
      phrases,
      ...(surligner &&
        { onMot: (phrase: number, position: number) => surligner.parPosition(premierePhrase + phrase, position) }),
    });
  const jouerLeSonDePhrase = async (groupe: Extract<GroupeDeLecture, { type: "voixDeLApplication" }>) => {
    try {
      await demande.jouerUnSon(
        groupe.son,
        groupe.rythme,
        InstantsDesMots.de(groupe.reglage.phrase, groupe.son.dureeMs, groupe.rythme),
        surligner && ((rang) => surligner.parRang(groupe.indice, rang)),
      );
    } catch (erreur) {
      if (!(erreur instanceof SonIllisible)) throw erreur;
      await lireParLAppareil([groupe.reglage], groupe.indice);
    }
  };
  let phraseNonDite = false;
  for (const groupe of grouperLesEtapes(demande.plan.etapes, demande.reglages)) {
    if (groupe.type === "aucune") phraseNonDite = true;
    else if (groupe.type === "voixDeLAppareil") await lireParLAppareil(groupe.phrases, groupe.indice);
    else await jouerLeSonDePhrase(groupe);
    if (demande.interrompue()) return "interrompue";
  }
  return phraseNonDite ? "phraseNonDite" : "toutDit";
}
