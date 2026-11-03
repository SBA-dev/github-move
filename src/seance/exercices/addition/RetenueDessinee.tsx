import { useLayoutEffect, useRef, useState } from "react";
import type { VueColonne } from "@domain/apprentissage";
import type { CleUnivers } from "@domain/motivation";
import { useMouvementsReduits } from "../../../transitions/mouvements-reduits.ts";
import { dessinDeLaRetenue, PLACE_DU_CHIFFRE_DE_LA_RETENUE } from "./dessins-de-l-addition.ts";

type Rang = VueColonne["rang"];

/** Le saut attend la fin du rebond de la réponse juste (#97), jamais la voix, et dure 400 ms au plus. */
const ATTENTE_DU_REBOND_MS = 350;
const DUREE_DU_SAUT_MS = 350;
const HAUTEUR_DE_L_ARC_EN_PX = 28;

type Props = {
  readonly retenue: number;
  readonly univers: CleUnivers;
  readonly couleur: VueColonne["couleur"];
  /** La colonne dont le chiffre vient d'être écrit ; absente quand la retenue n'a pas à sauter. */
  readonly depart: Rang | undefined;
};

/** Le dessin de la maison de départ, d'où la retenue s'élance. */
function maisonDeDepart(retenue: HTMLElement, depart: Rang): Element | null | undefined {
  return retenue.closest('[data-testid="colonnes"]')?.querySelector(`[data-testid="colonne"][data-rang="${depart}"] [data-testid="dessin-de-la-maison"]`);
}

function sauterDepuis(retenue: HTMLElement, maison: Element): Animation {
  const arrivee = retenue.getBoundingClientRect();
  const depart = maison.getBoundingClientRect();
  const dx = depart.left + depart.width / 2 - (arrivee.left + arrivee.width / 2);
  const dy = depart.top + depart.height / 2 - (arrivee.top + arrivee.height / 2);
  return retenue.animate([
    { translate: `${dx}px ${dy}px`, scale: 0.8 },
    { translate: `${dx / 2}px ${dy / 2 - HAUTEUR_DE_L_ARC_EN_PX}px`, scale: 1.15, offset: 0.5 },
    { translate: "0px 0px", scale: 1 },
  ], { duration: DUREE_DU_SAUT_MS, delay: ATTENTE_DU_REBOND_MS, easing: "ease-in-out", fill: "backwards" });
}

/** La retenue : l'objet de l'univers, le chiffre écrit par-dessus en texte. Elle saute de la maison de départ à la maison d'arrivée, sauf mouvements réduits. */
export function RetenueDessinee({ retenue, univers, couleur, depart }: Props) {
  const mouvementsReduits = useMouvementsReduits();
  const saute = depart !== undefined && !mouvementsReduits;
  const ref = useRef<HTMLSpanElement>(null);
  const [saut, setSaut] = useState<"en-cours" | "fini">("en-cours");
  const place = PLACE_DU_CHIFFRE_DE_LA_RETENUE[univers];

  useLayoutEffect(() => {
    const element = ref.current;
    const maison = element === null || depart === undefined ? undefined : maisonDeDepart(element, depart);
    if (!saute || element === null || !maison) {
      setSaut("fini");
      return;
    }
    const animation = sauterDepuis(element, maison);
    void animation.finished.then(() => setSaut("fini"), () => undefined);
    return () => animation.cancel();
  }, [saute, depart]);

  return (
    <span
      ref={ref}
      className="retenue"
      data-testid="retenue"
      data-univers={univers}
      data-couleur={couleur}
      data-mouvement={saute ? "saute" : "aucun"}
      data-depart={depart}
      data-saut={saute ? saut : undefined}
      role="img"
      aria-label={`Retenue ${retenue}`}
    >
      <svg
        className="dessin-de-la-retenue"
        data-testid="dessin-de-la-retenue"
        viewBox="0 0 200 200"
        aria-hidden="true"
        focusable="false"
        dangerouslySetInnerHTML={{ __html: dessinDeLaRetenue(univers, couleur) }}
      />
      <span className="chiffre-de-la-retenue" style={{ left: `${place.x}%`, top: `${place.y}%` }}>{retenue}</span>
    </span>
  );
}
