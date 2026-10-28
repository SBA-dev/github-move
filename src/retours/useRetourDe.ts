import { useContext, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ContexteDuRetour } from "./contexte-du-retour.ts";
import { balancer, rebondir } from "./mouvements-des-retours.ts";

type Mouvement = "rebond" | "balancement";

/**
 * Fait réagir un élément quand la réponse le vise : rebond si elle est juste, balancement si elle est fausse.
 * Avec les mouvements réduits, rien ne bouge ; la réussite reste visible par `data-reussite`.
 */
export function useRetourDe<E extends HTMLElement>(cible: string) {
  const retour = useContext(ContexteDuRetour);
  const ref = useRef<E | null>(null);
  const mouvementsReduits = useReducedMotion();
  const [mouvement, setMouvement] = useState<Mouvement | undefined>();
  const numero = retour?.cible === cible ? retour.numero : undefined;
  const genre = retour?.genre;

  useEffect(() => {
    const element = ref.current;
    if (numero === undefined || genre === undefined || element === null || mouvementsReduits) return;
    setMouvement(genre === "juste" ? "rebond" : "balancement");
    const animation = genre === "juste" ? rebondir(element) : balancer(element);
    void animation.then(() => setMouvement(undefined));
    return () => animation.cancel();
  }, [numero, genre, mouvementsReduits]);

  const attributs = {
    "data-retour": mouvement,
    "data-reussite": numero !== undefined && genre === "juste" ? "true" : undefined,
  } as const;
  return { ref, attributs };
}
