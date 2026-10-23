import { useEffect } from "react";
import { inviterACreerLePremierProfil, universDe } from "@domain/motivation";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import { PersonnageGuide } from "../univers/index.ts";
import type { Voix } from "../voix/index.ts";

/** Noisette invite le parent à créer le premier profil enfant dans l'espace parent, et le lui lit à voix haute. */
export function InvitationDuPremierProfil({ voix }: { readonly voix: Voix }) {
  const { parole, rangDuMotPrononce, humeur, dire, faireSilence } = usePersonnageQuiParle(voix);
  useEffect(() => {
    void dire({ texte: inviterACreerLePremierProfil(), nature: "invitation" });
    return faireSilence;
  }, [dire, faireSilence]);

  return (
    <div className="guide-et-parole">
      <PersonnageGuide univers={universDe(undefined)} humeur={humeur} />
      <BulleDuPersonnageGuide texte={parole?.texte} nature={parole?.nature} rangDuMotPrononce={rangDuMotPrononce} />
    </div>
  );
}
