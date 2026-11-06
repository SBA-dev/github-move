import { type ComponentType, type RefObject, useLayoutEffect, useRef, useState } from "react";
import type { CleDeTenue, CleUnivers } from "@domain/motivation";
import { useMouvementsReduits } from "../../transitions/mouvements-reduits.ts";
import { DUREE_DE_LA_SCENE_DE_REPONSE_FAUSSE_S } from "./duree-de-la-scene.ts";

type ScenePrete = { jouer(quandTerminee: () => void): () => void; montrerLEtatFinal(): void };

/** Ce que reçoit chaque scène de réponse fausse, dessinée par un personnage guide. */
export type PropsDeLaScene = {
  /** La tenue que porte le personnage guide dans la scène (rien sans tenue). */
  readonly tenue?: CleDeTenue | undefined;
  /** Faux quand le dessin est trop petit pour qu'on y lise la bulle écrite (163.21). */
  readonly avecBulleEcrite: boolean;
  /** La scène est allée jusqu'au bout de ses 1,5 s : le dessin du personnage guide revient. */
  readonly onFinie: () => void;
};

type Props = PropsDeLaScene & {
  readonly univers: CleUnivers;
  readonly Decor: ComponentType<{ readonly racine: RefObject<SVGSVGElement | null>; readonly avecBulleEcrite: boolean }>;
  readonly creerLaScene: (racine: SVGSVGElement, tenue?: CleDeTenue) => ScenePrete;
};

/**
 * La scène de réponse fausse d'un personnage guide : son décor et le moteur commun qui l'anime, à la place du dessin du personnage guide, à sa taille.
 * Dessin décoratif (`aria-hidden`), sans toucher ni focus : la question, les choix et les boutons restent utilisables dès la première image.
 * Aucun son, aucun confetti. Avec les mouvements réduits : l'image fixe de l'état final, sans bulle écrite, pendant le même temps que la scène.
 */
export function SceneAnimeeDeReponseFausse({ univers, Decor, creerLaScene, tenue, avecBulleEcrite, onFinie }: Props) {
  const reduits = useMouvementsReduits();
  const racine = useRef<SVGSVGElement>(null);
  const [terminee, setTerminee] = useState(false);
  const aLaFin = useRef(onFinie);
  useLayoutEffect(() => {
    aLaFin.current = onFinie;
  });

  useLayoutEffect(() => {
    if (!racine.current) return;
    const scene = creerLaScene(racine.current, tenue);
    if (reduits) {
      scene.montrerLEtatFinal();
      const minuterie = setTimeout(() => aLaFin.current(), DUREE_DE_LA_SCENE_DE_REPONSE_FAUSSE_S * 1000);
      return () => clearTimeout(minuterie);
    }
    return scene.jouer(() => {
      setTerminee(true);
      aLaFin.current();
    });
  }, [reduits, creerLaScene, tenue]);

  return (
    <div
      className="personnage-guide scene-de-reponse-fausse"
      aria-hidden="true"
      data-testid="scene-de-reponse-fausse"
      data-scene-de-reponse-fausse={univers}
      {...(tenue === undefined ? {} : { "data-tenue": tenue })}
      data-mouvements={reduits ? "reduits" : "animes"}
      data-etat={reduits || terminee ? "terminee" : "en-cours"}
      data-bulle-ecrite={avecBulleEcrite && !reduits ? "oui" : "non"}
    >
      <Decor racine={racine} avecBulleEcrite={avecBulleEcrite && !reduits} />
    </div>
  );
}
