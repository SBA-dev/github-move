import { HUMEUR_PAR_DEFAUT, inviterACreerLePremierProfil, universDe } from "@domain/motivation";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import { PersonnageGuide } from "../univers/index.ts";

/** Chez le parent (« Qui joue ? », espace parent), l'invitation est seulement affichée : le parent la lit lui-même, aucune voix ne la lit. */
export function InvitationAffichee() {
  return (
    <div className="guide-et-parole">
      <PersonnageGuide univers={universDe(undefined)} humeur={HUMEUR_PAR_DEFAUT} />
      <BulleDuPersonnageGuide texte={inviterACreerLePremierProfil()} nature="invitation" rangDuMotPrononce={undefined} />
    </div>
  );
}
