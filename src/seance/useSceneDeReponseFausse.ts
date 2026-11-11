import { useEffect, useRef, useState } from "react";
import { type CleUnivers, type SceneDeReponseFausse, sceneDeReponseFausse, sceneJoueeDansLaSeanceApres } from "@domain/motivation";
import type { ParoleADire } from "./usePersonnageQuiParle.ts";

/** Sous cette largeur le dessin du personnage guide est « en petit » (40 px avec l'addition posée) : pas de scène (163.7). */
const LARGEUR_DU_PERSONNAGE_EN_PETIT_PX = 60;
/** Sous cette largeur la bulle écrite de la scène serait illisible, 80 px dans la boîte à jetons (163.21). */
const LARGEUR_MINIMALE_DE_LA_BULLE_ECRITE_PX = 100;

/** Les éléments sur lesquels l'enfant agit : un toucher ailleurs ne change rien. */
const ELEMENTS_QUI_AGISSENT = "button, a[href], input, select, textarea, [role='button'], [draggable='true']";

const estUneToucheQuiAgit = (e: KeyboardEvent) => !e.ctrlKey && !e.metaKey && !e.altKey && (e.key.length === 1 || e.key === "Enter" || e.key === "Backspace");

type Options = {
  /** La dernière parole du personnage guide : un encouragement est une réponse fausse qui vient d'être montrée. */
  readonly parole: ParoleADire | undefined;
  readonly cleUnivers: CleUnivers;
  readonly dansLeTestDeDepart?: boolean;
  readonly pendantLeChronoDUneFluence?: boolean;
};

type SceneEnCours = { readonly scene: SceneDeReponseFausse; readonly avecBulleEcrite: boolean };

const largeurDuDessin = (zone: HTMLElement | null) => zone?.firstElementChild?.getBoundingClientRect().width ?? 0;

/**
 * La scène de réponse fausse du personnage guide : elle se joue à la première réponse fausse de la séance, à la place de son dessin.
 * Le domaine décide si elle se joue et laquelle ; ici on fournit les faits (la taille du dessin, l'écran) et on tient la mémoire « déjà jouée »
 * le temps de l'écran de la séance : rien n'est enregistré. Elle s'arrête quand elle finit, ou dès que l'enfant agit sur un bouton (au relâché, pour que le dessin ne déplace pas le bouton sous son doigt) ou une touche.
 * Elle se joue à côté de la réaction de la réponse fausse (son, encouragement, humeur), sans la changer.
 */
export function useSceneDeReponseFausse({ parole, cleUnivers, dansLeTestDeDepart = false, pendantLeChronoDUneFluence = false }: Options) {
  const zoneDuPersonnageGuide = useRef<HTMLDivElement>(null);
  const derniereParole = useRef(parole);
  const [jouee, setJouee] = useState(false);
  const [enCours, setEnCours] = useState<SceneEnCours | undefined>();

  useEffect(() => {
    if (parole === derniereParole.current) return;
    derniereParole.current = parole;
    if (parole?.nature !== "encouragement") return;
    const largeur = largeurDuDessin(zoneDuPersonnageGuide.current);
    const scene = sceneDeReponseFausse(
      { sceneDejaJoueeDansLaSeance: jouee, pendantLeChronoDUneFluence, dansLeTestDeDepart, personnageGuideEnPetit: largeur < LARGEUR_DU_PERSONNAGE_EN_PETIT_PX },
      cleUnivers,
    );
    setJouee(sceneJoueeDansLaSeanceApres(jouee, scene));
    setEnCours(scene && { scene, avecBulleEcrite: largeur >= LARGEUR_MINIMALE_DE_LA_BULLE_ECRITE_PX });
  }, [parole, jouee, cleUnivers, dansLeTestDeDepart, pendantLeChronoDUneFluence]);

  const estEnCours = enCours !== undefined;
  useEffect(() => {
    if (!estEnCours) return;
    const arreter = () => setEnCours(undefined);
    const surUnToucher = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest(ELEMENTS_QUI_AGISSENT)) arreter();
    };
    const surUneTouche = (e: KeyboardEvent) => {
      if (estUneToucheQuiAgit(e)) arreter();
    };
    document.addEventListener("pointerup", surUnToucher, true);
    document.addEventListener("keydown", surUneTouche, true);
    return () => {
      document.removeEventListener("pointerup", surUnToucher, true);
      document.removeEventListener("keydown", surUneTouche, true);
    };
  }, [estEnCours]);

  return { zoneDuPersonnageGuide, enCours, jouee, terminer: () => setEnCours(undefined) };
}
