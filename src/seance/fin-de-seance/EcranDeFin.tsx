import { useEffect, useRef, useState } from "react";
import type { Seance } from "@domain/apprentissage";
import { leconSuivante, pageDeLaLecon } from "@domain/catalogue";
import { chargerToutesLesLecons } from "../bibliotheque.ts";
import { EtoilesDessinees } from "./EtoilesDessinees.tsx";
import { Etincelles } from "./Etincelles.tsx";
import { etoilesSurTrois } from "./texte-des-etoiles.ts";
import { useSauvegardeDeLaSeance } from "./useSauvegardeDeLaSeance.ts";

type Suivante = { readonly id: string; readonly titre: string };

type Props = {
  readonly seance: Seance;
  /** Fait dire au personnage guide ses paroles de fin. */
  readonly onDireLaFin: (etoiles: number) => void;
  readonly onRejouer: () => void;
  readonly onLeconSuivante: (leconId: string) => void;
  readonly onAccueil: () => void;
};

function useLeconSuivante(leconId: string): Suivante | undefined {
  const [suivante, setSuivante] = useState<Suivante | undefined>();
  useEffect(() => {
    let annule = false;
    void chargerToutesLesLecons().then((lecons) => {
      const courante = lecons.find((lecon) => lecon.id === leconId);
      const prochaine = courante && leconSuivante(lecons, courante);
      if (!annule && prochaine) setSuivante({ id: prochaine.id, titre: pageDeLaLecon(prochaine).titre });
    });
    return () => {
      annule = true;
    };
  }, [leconId]);
  return suivante;
}

/** La fin de la séance : étoiles gagnées (dessinées et écrites), paroles du personnage guide, et la suite à choisir. */
export function EcranDeFin({ seance, onDireLaFin, onRejouer, onLeconSuivante, onAccueil }: Props) {
  const etoiles = seance.etoiles().nombre;
  const message = useSauvegardeDeLaSeance(seance);
  const suivante = useLeconSuivante(seance.lecon);
  const accueil = useRef<HTMLButtonElement>(null);
  const dite = useRef(false);
  useEffect(() => {
    accueil.current?.focus();
    if (dite.current) return;
    dite.current = true;
    onDireLaFin(etoiles);
  }, [etoiles, onDireLaFin]);

  return (
    <div className="fin-de-seance" data-testid="fin-de-seance">
      <Etincelles />
      <EtoilesDessinees nombre={etoiles} />
      <p className="etoiles-gagnees" data-testid="etoiles-gagnees">{etoilesSurTrois(etoiles)}</p>
      {suivante && <p data-testid="ensuite">Ensuite : {suivante.titre}</p>}
      <div className="actions-de-fin">
        {suivante && <button type="button" onClick={() => onLeconSuivante(suivante.id)}>Leçon suivante</button>}
        <button type="button" ref={accueil} onClick={onAccueil}>Accueil</button>
        <button type="button" onClick={onRejouer}>Rejouer</button>
      </div>
      <p className="message-erreur" role="status" data-testid="sauvegarde">{message}</p>
    </div>
  );
}
