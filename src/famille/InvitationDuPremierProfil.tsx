import { HUMEUR_PAR_DEFAUT, type Humeur, inviterACreerLePremierProfil, universDe } from "@domain/motivation";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import type { ParoleADire } from "../seance/usePersonnageQuiParle.ts";
import { PersonnageGuide } from "../univers/index.ts";

/** Chez le parent (« Qui joue ? », espace parent), l'invitation est seulement affichée : le parent la lit lui-même, aucune voix ne la lit. */
export function InvitationAffichee() {
  return (
    <Invitation parole={{ texte: inviterACreerLePremierProfil(), nature: "invitation" }} humeur={HUMEUR_PAR_DEFAUT} />
  );
}

type PropsInvitation = {
  readonly parole: ParoleADire | undefined;
  readonly rangDuMotPrononce?: number;
  readonly humeur: Humeur;
};

function Invitation({ parole, rangDuMotPrononce, humeur }: PropsInvitation) {
  return (
    <div className="guide-et-parole">
      <PersonnageGuide univers={universDe(undefined)} humeur={humeur} />
      <BulleDuPersonnageGuide texte={parole?.texte} nature={parole?.nature} rangDuMotPrononce={rangDuMotPrononce} />
    </div>
  );
}
