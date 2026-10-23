import { useEffect } from "react";
import { HUMEUR_PAR_DEFAUT, type Humeur, inviterACreerLePremierProfil, universDe } from "@domain/motivation";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import { type ParoleADire, usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import { PersonnageGuide } from "../univers/index.ts";
import type { Voix } from "../voix/index.ts";

/** Noisette invite le parent à créer le premier profil enfant dans l'espace parent, et le lui lit à voix haute. */
export function InvitationDuPremierProfil({ voix }: { readonly voix: Voix }) {
  const { parole, rangDuMotPrononce, humeur, dire, faireSilence } = usePersonnageQuiParle(voix);
  useEffect(() => {
    void dire({ texte: inviterACreerLePremierProfil(), nature: "invitation" });
    return faireSilence;
  }, [dire, faireSilence]);

  return <Invitation parole={parole} rangDuMotPrononce={rangDuMotPrononce} humeur={humeur} />;
}

/** Dans l'espace parent, l'invitation est seulement affichée : le parent la lit lui-même et l'essai de voix reste entendu. */
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
