import { type CSSProperties, Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { type AvanceeDansLeParcours, avanceeDansLeParcours, type LeconDuParcours, type Parcours } from "@domain/apprentissage";
import type { Univers } from "@domain/motivation";
import { mouvementsReduits } from "../transitions/index.ts";
import { FinDuDessin } from "./FinDuDessin.tsx";
import { type Marche, GuideSurLeDessin } from "./GuideSurLeDessin.tsx";
import { TraceDuParcours } from "./TraceDuParcours.tsx";
import { centreDeLaLeconEnPourcent } from "./geometrie-du-dessin.ts";
import { annonceDeLArriveeDuPersonnageGuide, NOM_DE_LA_FIN_DU_DESSIN } from "./textes-du-parcours.ts";
import { useMesuresDuDessin } from "./useMesuresDuDessin.ts";

type Props = {
  readonly parcours: Parcours;
  readonly univers: Univers;
  /** La prochaine leçon que l'enfant avait vue la dernière fois, si on la connaît. */
  readonly prochaineLeconConnue: string | undefined;
  readonly onMemoriserLaProchaineLecon: (leconId: string | undefined) => void;
  /** Le bouton d'une leçon du parcours. */
  readonly renduDeLaLecon: (lecon: LeconDuParcours) => ReactNode;
  /** Ce qui se pose juste après une leçon (le repère d'un défi), sur le dessin comme dans la liste ordonnée ; ce n'est jamais un arrêt du personnage guide. */
  readonly renduApresLaLecon: (lecon: LeconDuParcours) => ReactNode;
};

function marcheDe(avancee: AvanceeDansLeParcours | undefined, parcours: Parcours): Marche | undefined {
  if (!avancee) return undefined;
  const indexDAffichageDe = (leconId: string) => parcours.lecons.findIndex((lecon) => lecon.lecon === leconId);
  return {
    depuis: indexDAffichageDe(avancee.depuis),
    jusqua: avancee.jusqua.genre === "lecon" ? indexDAffichageDe(avancee.jusqua.lecon) : parcours.lecons.length,
  };
}

function emplacementDe(parcours: Parcours): number {
  const indexDAffichage = parcours.lecons.findIndex((lecon) => lecon.lecon === parcours.prochaineLecon);
  return indexDAffichage === -1 ? parcours.lecons.length : indexDAffichage;
}

type StyleDeLaLecon = CSSProperties & { readonly "--centre": number };

const styleDeLaLecon = (indexDAffichage: number): StyleDeLaLecon => ({ "--centre": centreDeLaLeconEnPourcent(indexDAffichage) });

/** La page s'ouvre sur la prochaine leçon, ou sur la fin du dessin quand la matière est réussie. */
function defilerJusqua(dessin: HTMLElement | null, arret: number, nombreDeLecons: number): void {
  const arrivee = arret === nombreDeLecons ? dessin?.querySelector('[data-testid="fin-du-dessin"]') : dessin?.querySelectorAll("ol > li[data-lecon]")[arret];
  arrivee?.scrollIntoView({ block: "center", behavior: mouvementsReduits() ? "auto" : "smooth" });
}

/**
 * Le parcours d'une matière dessiné dans le paysage de l'univers : un sentier qui serpente de leçon en leçon jusqu'à un fanion.
 * Le dessin est décoratif ; les leçons restent une liste ordonnée de boutons, dans l'ordre du parcours.
 * Le personnage guide se tient sur la prochaine leçon. Quand elle a avancé depuis la dernière fois, il marche jusqu'à elle, une seule fois.
 */
export function DessinDuParcours({ parcours, univers, prochaineLeconConnue, onMemoriserLaProchaineLecon, renduDeLaLecon, renduApresLaLecon }: Props) {
  const dessin = useRef<HTMLDivElement>(null);
  const mesures = useMesuresDuDessin(dessin);
  const [marche] = useState(() => (mouvementsReduits() ? undefined : marcheDe(avanceeDansLeParcours(prochaineLeconConnue, parcours), parcours)));
  const [annonce, setAnnonce] = useState("");
  const apresLaLecon = (lecon: LeconDuParcours) => {
    const apres = renduApresLaLecon(lecon);
    return apres && <li className="apres-la-lecon">{apres}</li>;
  };
  const arret = emplacementDe(parcours);
  const noms = [...parcours.lecons.map((lecon) => String(lecon.place)), NOM_DE_LA_FIN_DU_DESSIN];
  const { prochaineLecon } = parcours;
  useEffect(() => onMemoriserLaProchaineLecon(prochaineLecon), [prochaineLecon, onMemoriserLaProchaineLecon]);
  useEffect(() => defilerJusqua(dessin.current, arret, parcours.lecons.length), [prochaineLecon]);
  return (
    <div className="dessin-du-parcours" data-testid="dessin-du-parcours" ref={dessin}>
      {mesures && <TraceDuParcours mesures={mesures} />}
      <ol className="lecons-du-dessin">
        {parcours.lecons.map((lecon, indexDAffichage) => (
          <Fragment key={lecon.lecon}>
            <li data-lecon={lecon.lecon} style={styleDeLaLecon(indexDAffichage)}>
              {renduDeLaLecon(lecon)}
            </li>
            {apresLaLecon(lecon)}
          </Fragment>
        ))}
      </ol>
      <FinDuDessin univers={univers.cle} />
      {mesures && (
        <GuideSurLeDessin
          univers={univers}
          emplacements={mesures.emplacements}
          noms={noms}
          arret={arret}
          marche={marche}
          onArrivee={() => setAnnonce(annonceDeLArriveeDuPersonnageGuide(univers.personnageGuide.nom, noms[arret] ?? ""))}
        />
      )}
      <p className="visuellement-cache" aria-live="polite" data-testid="annonce-de-la-marche">{annonce}</p>
    </div>
  );
}
