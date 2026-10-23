import { universDe } from "@domain/motivation";
import { PersonnageGuide } from "../univers/index.ts";
import { INVITATION_DU_PREMIER_PROFIL } from "./invitation-du-premier-profil.ts";

/** Noisette invite le parent à créer le premier profil enfant dans l'espace parent. */
export function InvitationDuPremierProfil() {
  return (
    <div className="guide-et-parole">
      <PersonnageGuide univers={universDe(undefined)} humeur="content" />
      <div className="bulle" data-testid="parole" data-nature="invitation">{INVITATION_DU_PREMIER_PROFIL}</div>
    </div>
  );
}
