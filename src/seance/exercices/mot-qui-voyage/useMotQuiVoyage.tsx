import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMouvementsReduits } from "../../../transitions/mouvements-reduits.ts";
import { MotQuiVoyage, type Trajet } from "./MotQuiVoyage.tsx";

/** Le mot qu'un enfant vient de choisir, et d'où il part : le centre de sa bulle. */
export type DepartDuMot = { readonly texte: string; readonly centre: { readonly x: number; readonly y: number } };

type Arrivee = { readonly rang: number; readonly mot: string; readonly etape: "en-route" | "eclat" };

const DUREE_DE_L_ECLAT_MS = 400;

const estVisible = (place: DOMRect) => place.bottom > 0 && place.top < window.innerHeight;

const centreDe = (place: DOMRect) => ({ x: place.left + place.width / 2, y: place.top + place.height / 2 });

/**
 * Le mot juste rejoint sa place (un trou, une ligne du tableau), puis la place s'illumine un court instant.
 * `mots` dit, place par place, le mot écrit (ou rien tant qu'elle est vide) ; une place qui vient de recevoir le mot choisi
 * le reçoit en chemin. Avec les mouvements réduits, ou si la place est hors de l'écran, le mot apparaît sans voyager.
 */
export function useMotQuiVoyage(mots: readonly (string | undefined)[], depart: DepartDuMot | undefined) {
  const mouvementsReduits = useMouvementsReduits();
  const places = useRef<Array<HTMLElement | null>>([]);
  const [vus, setVus] = useState(mots);
  const [arrivee, setArrivee] = useState<Arrivee | undefined>();
  const [trajet, setTrajet] = useState<Trajet | undefined>();

  if (vus.length !== mots.length || vus.some((mot, rang) => mot !== mots[rang])) {
    setVus(mots);
    const rang = mots.findIndex((mot, r) => mot !== undefined && vus[r] === undefined);
    const mot = mots[rang];
    const nouvelleArrivee = vus.length === mots.length && mot !== undefined && mot === depart?.texte && !mouvementsReduits;
    setArrivee(nouvelleArrivee ? { rang, mot, etape: "en-route" } : undefined);
  }

  useLayoutEffect(() => {
    if (arrivee?.etape !== "en-route" || depart === undefined) return;
    const place = places.current[arrivee.rang]?.getBoundingClientRect();
    if (place === undefined || !estVisible(place)) {
      setArrivee({ ...arrivee, etape: "eclat" });
      return;
    }
    const rang = arrivee.rang;
    setTrajet({ mot: arrivee.mot, de: depart.centre, versLaPlace: () => centreDe(places.current[rang]?.getBoundingClientRect() ?? place) });
  }, [arrivee, depart]);

  useEffect(() => {
    if (arrivee?.etape !== "eclat") return;
    const minuteur = setTimeout(() => setArrivee(undefined), DUREE_DE_L_ECLAT_MS);
    return () => clearTimeout(minuteur);
  }, [arrivee]);

  const surArrivee = useCallback(() => {
    setTrajet(undefined);
    setArrivee((en) => (en === undefined ? en : { ...en, etape: "eclat" }));
  }, []);

  const voyage: ReactNode = trajet && <MotQuiVoyage trajet={trajet} onArrivee={surArrivee} />;
  return {
    voyage,
    /** À poser sur l'élément de chaque place pour que le mot sache où arriver. */
    refDeLaPlace: (rang: number) => (element: HTMLElement | null) => {
      places.current[rang] = element;
    },
    enRoute: (rang: number) => arrivee?.rang === rang && arrivee.etape === "en-route",
    eclat: (rang: number) => arrivee?.rang === rang && arrivee.etape === "eclat",
  };
}
