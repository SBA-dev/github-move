import { useReducedMotion } from "motion/react";
import type { BoiteEnCours, BoiteOuverte } from "@domain/apprentissage";
import type { ItemDeBoite } from "@domain/catalogue";
import { ReponseAuCalcul } from "../ReponseAuCalcul.tsx";
import { RangeesDeJetons } from "./RangeesDeJetons.tsx";

type Props = {
  readonly boite: BoiteEnCours;
  /** Ce que contient la boîte pendant le déroulé : les jetons mis, puis ceux qu'on remet ou retire. */
  readonly item: ItemDeBoite | undefined;
  /** Le nombre de phrases du déroulé déjà dites : la boîte se ferme après la dernière. */
  readonly phrasesDites: number;
  /** La boîte ouverte après la bonne réponse. */
  readonly ouverte: BoiteOuverte | undefined;
  readonly onChoisir: (texte: string) => void;
  readonly onValider: (nombre: number) => void;
  readonly onJeNeSaisPas: () => void;
};

export function BoiteAJetons({ boite, item, phrasesDites, ouverte, ...reponse }: Props) {
  const mouvementsReduits = useReducedMotion() ?? false;
  const deroulee = phrasesDites >= boite.deroulement.length;
  const etat = ouverte !== undefined || !deroulee ? "ouverte" : "fermee";
  return (
    <div
      className="boite-a-jetons"
      data-testid="boite-a-jetons"
      data-mode={boite.mode.genre}
      data-mouvements-reduits={mouvementsReduits ? "true" : undefined}
    >
      <div
        className="boite"
        data-testid="boite"
        data-etat={etat}
        role="img"
        aria-label={libelleDeLaBoite(etat, ouverte)}
      >
        <div className="contenu-de-la-boite">
          {ouverte !== undefined
            ? <RangeesDeJetons nombre={ouverte.jetons} />
            : !deroulee && item && <JetonsDuDeroule item={item} phrasesDites={phrasesDites} />}
        </div>
      </div>
      {deroulee && <ReponseAuCalcul calcul={boite} reussi={ouverte !== undefined} {...reponse} />}
    </div>
  );
}

function JetonsDuDeroule({ item: { a, sens, b }, phrasesDites }: { readonly item: ItemDeBoite; readonly phrasesDites: number }) {
  if (phrasesDites === 0) return null;
  if (phrasesDites === 1) return <RangeesDeJetons nombre={a} />;
  if (sens === "retrait") return <RangeesDeJetons nombre={a} sortants={b} />;
  return (
    <>
      <RangeesDeJetons nombre={a} />
      <RangeesDeJetons nombre={b} nouveaux />
    </>
  );
}

function libelleDeLaBoite(etat: "ouverte" | "fermee", ouverte: BoiteOuverte | undefined): string {
  if (ouverte !== undefined) return `Boîte ouverte : ${ouverte.jetons} jetons`;
  return etat === "ouverte" ? "Boîte ouverte" : "Boîte fermée";
}
