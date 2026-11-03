import { useId } from "react";
import { useReducedMotion } from "motion/react";
import type { BoiteEnCours, BoiteOuverte } from "@domain/apprentissage";
import type { ItemDeBoite } from "@domain/catalogue";
import { useUnivers } from "../../../univers/index.ts";
import { ReponseAuCalcul } from "../ReponseAuCalcul.tsx";
import { DESSINS_DES_BOITES } from "./dessins/boites.tsx";
import { nombreDeRangees, RangeesDeJetons } from "./RangeesDeJetons.tsx";

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

const RANGEES_MAXIMUM_A_TAILLE_NORMALE = 4;

export function BoiteAJetons({ boite, item, phrasesDites, ouverte, ...reponse }: Props) {
  const mouvementsReduits = useReducedMotion() ?? false;
  const univers = useUnivers();
  const p = useId();
  const deroulee = phrasesDites >= boite.deroulement.length;
  const etat = ouverte !== undefined || !deroulee ? "ouverte" : "fermee";
  const dessin = DESSINS_DES_BOITES[univers];
  const rangees = item === undefined ? 0 : nombreDeRangees(item.a) + (item.sens === "retrait" ? 0 : nombreDeRangees(item.b));
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
        data-univers={univers}
        data-serree={rangees > RANGEES_MAXIMUM_A_TAILLE_NORMALE ? "true" : undefined}
        role="img"
        aria-label={libelleDeLaBoite(etat, ouverte)}
      >
        <svg className="dessin-de-la-boite" data-testid="dessin-de-la-boite" viewBox="0 0 288 250" aria-hidden="true" focusable="false">
          {etat === "fermee" ? dessin.fermee(p) : dessin.ouverteDerriere(p)}
        </svg>
        {etat === "ouverte" && (
          <>
            <div className="contenu-de-la-boite">
              {ouverte !== undefined
                ? <RangeesDeJetons nombre={ouverte.jetons} mouvement="pose" />
                : item && <JetonsDuDeroule item={item} phrasesDites={phrasesDites} />}
            </div>
            <svg className="rebord-de-la-boite" viewBox="0 0 288 250" aria-hidden="true" focusable="false">
              {dessin.ouverteDevant(p)}
            </svg>
          </>
        )}
      </div>
      {deroulee && <ReponseAuCalcul calcul={boite} reussi={ouverte !== undefined} {...reponse} />}
    </div>
  );
}

const PHRASE_DES_JETONS_AJOUTES_OU_RETIRES = 2;

/** Les jetons du déroulé : les premiers tombent dans la boîte, puis on en ajoute (ils tombent à part) ou on en retire (ils pâlissent). */
function JetonsDuDeroule({ item: { a, sens, b }, phrasesDites }: { readonly item: ItemDeBoite; readonly phrasesDites: number }) {
  if (phrasesDites === 0) return null;
  const secondeEtape = phrasesDites >= PHRASE_DES_JETONS_AJOUTES_OU_RETIRES;
  return (
    <>
      <RangeesDeJetons nombre={a} mouvement="tombe" sortants={secondeEtape && sens === "retrait" ? b : 0} />
      {secondeEtape && sens !== "retrait" && <RangeesDeJetons nombre={b} mouvement="tombe" nouveaux />}
    </>
  );
}

function libelleDeLaBoite(etat: "ouverte" | "fermee", ouverte: BoiteOuverte | undefined): string {
  if (ouverte !== undefined) return `Boîte ouverte : ${ouverte.jetons} jetons`;
  return etat === "ouverte" ? "Boîte ouverte" : "Boîte fermée";
}
