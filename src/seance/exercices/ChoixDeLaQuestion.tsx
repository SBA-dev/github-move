import { type KeyboardEvent, type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRetourDe } from "../../retours/index.ts";
import { TexteEnSyllabes, useModeDys } from "../../reglages/index.ts";
import { useMouvementsReduits } from "../../transitions/mouvements-reduits.ts";
import { useUnivers } from "../../univers/index.ts";
import { useLectureEnCours } from "../../voix/index.ts";
import { DessinDeLaBulle } from "./bulles-de-choix/DessinDeLaBulle.tsx";

type Props = {
  /** Tous les choix, dans l'ordre d'affichage. */
  readonly textes: readonly string[];
  /** Les choix déjà écartés : grisés, ils ne répondent plus. */
  readonly ecartes: readonly string[];
  /** Les choix encore possibles. */
  readonly possibles: readonly string[];
  /** Le choix qui brille : la bonne réponse montrée par « Je ne sais pas ». */
  readonly reponseQuiBrille: string | undefined;
  /** La question est réussie : on la félicite avant de passer à la suivante. */
  readonly reussie: boolean;
  readonly bulleEclatee: string | undefined;
  /** Les bulles de ce genre de question flottent doucement (bulles, écoute), quand rien ne se dit et que l'enfant n'a pas répondu. */
  readonly flottantes: boolean;
  /** Le mot juste quitte sa bulle pour rejoindre sa place (trou, ligne du tableau). */
  readonly motQuiPart: boolean;
  readonly onChoisir: (texte: string, bulle: HTMLElement) => void;
};

const LARGEUR_COMMUNE = "--largeur-des-bulles";
const SENS_DES_FLECHES: Readonly<Record<string, 1 | -1>> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/** Toutes les bulles d'une question ont la largeur du choix le plus long, sans dépasser l'écran. */
function accorderLesLargeurs(conteneur: HTMLElement) {
  conteneur.style.removeProperty(LARGEUR_COMMUNE);
  const plusLarge = Math.max(...[...conteneur.querySelectorAll<HTMLElement>(":scope > button")].map((bulle) => bulle.offsetWidth));
  conteneur.style.setProperty(LARGEUR_COMMUNE, `${Math.min(plusLarge + 1, conteneur.clientWidth)}px`);
}

function passerALaBulleVoisine(evenement: KeyboardEvent<HTMLElement>) {
  const sens = SENS_DES_FLECHES[evenement.key];
  if (sens === undefined) return;
  const bulles = [...evenement.currentTarget.querySelectorAll<HTMLButtonElement>('[data-testid="choix"]')];
  const rang = bulles.findIndex((bulle) => bulle === document.activeElement);
  if (rang < 0) return;
  evenement.preventDefault();
  const possible = (bulle: HTMLButtonElement) => bulle.getAttribute("aria-disabled") !== "true";
  const voisines = sens > 0 ? bulles.slice(rang + 1) : bulles.slice(0, rang).reverse();
  voisines.find(possible)?.focus();
}

export function ChoixDeLaQuestion(
  { textes, ecartes, possibles, reponseQuiBrille, reussie, bulleEclatee, flottantes, motQuiPart, onChoisir }: Props,
) {
  const premierPossible = possibles[0];
  const bulleAFocaliser = useRef<HTMLButtonElement>(null);
  const conteneur = useRef<HTMLDivElement>(null);
  const mouvementsReduits = useMouvementsReduits();
  const modeDys = useModeDys();
  const clefDesTextes = textes.join("\u0000");
  const lectureEnCours = useLectureEnCours();
  const repondue = ecartes.length > 0 || reussie || reponseQuiBrille !== undefined;
  const flotte = flottantes && !lectureEnCours && !repondue && !mouvementsReduits;
  useEffect(() => {
    if (!reussie) bulleAFocaliser.current?.focus();
  }, [premierPossible, ecartes.length, reussie]);
  useLayoutEffect(() => {
    const element = conteneur.current;
    if (element === null) return;
    accorderLesLargeurs(element);
    const accorder = () => accorderLesLargeurs(element);
    const observateur = new ResizeObserver(accorder);
    observateur.observe(element);
    let abandonne = false;
    document.fonts.ready.then(() => {
      if (!abandonne) accorder();
    });
    return () => {
      abandonne = true;
      observateur.disconnect();
    };
  }, [clefDesTextes, modeDys]);

  return (
    <div
      ref={conteneur}
      className="choix-de-la-question"
      role="group"
      aria-label="Choix"
      data-testid="choix-de-la-question"
      onKeyDown={passerALaBulleVoisine}
    >
      {textes.map((texte, rang) => (
        <BulleDeChoix
          key={texte}
          texte={texte}
          rang={rang}
          ecarte={ecartes.includes(texte)}
          brille={texte === reponseQuiBrille && !reussie}
          eclatee={texte === bulleEclatee}
          reussie={reussie}
          flotte={flotte}
          motQuiPart={motQuiPart}
          aFocaliser={texte === premierPossible ? bulleAFocaliser : undefined}
          onChoisir={onChoisir}
        />
      ))}
    </div>
  );
}

type PropsDeLaBulle = {
  readonly texte: string;
  readonly rang: number;
  readonly ecarte: boolean;
  readonly brille: boolean;
  readonly eclatee: boolean;
  readonly reussie: boolean;
  readonly flotte: boolean;
  readonly motQuiPart: boolean;
  /** Reçoit le focus quand le choix change : la première bulle encore possible. */
  readonly aFocaliser: RefObject<HTMLButtonElement | null> | undefined;
  readonly onChoisir: (texte: string, bulle: HTMLElement) => void;
};

function BulleDeChoix({ texte, rang, ecarte, brille, eclatee, reussie, flotte, motQuiPart, aFocaliser, onChoisir }: PropsDeLaBulle) {
  const univers = useUnivers();
  const mouvementsReduits = useMouvementsReduits();
  const retour = useRetourDe<HTMLButtonElement>(texte);
  const rebondEnCours = retour.attributs["data-retour"] === "rebond";
  const [rebondVu, setRebondVu] = useState(false);
  useEffect(() => {
    if (rebondEnCours) setRebondVu(true);
  }, [rebondEnCours]);
  useEffect(() => {
    if (!eclatee) setRebondVu(false);
  }, [eclatee]);
  /** La bulle juste s'efface une fois son rebond fini ; avec les mouvements réduits, il n'y a pas de rebond à attendre. */
  const sEfface = eclatee && (mouvementsReduits || (rebondVu && !rebondEnCours));
  return (
    <button
      ref={(bouton) => {
        retour.ref.current = bouton;
        if (aFocaliser) aFocaliser.current = bouton;
      }}
      type="button"
      className="bulle-de-choix"
      data-testid="choix"
      data-univers={univers}
      data-donne-une-reponse="true"
      data-flotte={flotte ? "true" : undefined}
      data-ecarte={ecarte ? "true" : undefined}
      data-brille={brille ? "true" : undefined}
      data-eclatee={sEfface ? "true" : undefined}
      data-vide={eclatee && motQuiPart ? "true" : undefined}
      {...retour.attributs}
      aria-disabled={ecarte || reussie ? true : undefined}
      onClick={(evenement) => onChoisir(texte, evenement.currentTarget)}
    >
      <span className="flottement" data-testid="flottement" style={{ animationDelay: `${-rang}s` }}>
        <DessinDeLaBulle univers={univers} ecarte={ecarte} />
        <span className="texte-de-la-bulle">
          <TexteEnSyllabes texte={texte} />
        </span>
        {brille && <span className="signal-brille" data-testid="signal-brille" data-brille="true" aria-hidden="true" />}
      </span>
    </button>
  );
}
