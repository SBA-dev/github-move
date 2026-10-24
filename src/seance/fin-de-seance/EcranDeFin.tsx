import { useEffect, useRef, useState } from "react";
import { leconSuivanteDansLeParcours, type Seance } from "@domain/apprentissage";
import { Niveau, pageDeLaLecon } from "@domain/catalogue";
import { chargerToutesLesLecons } from "../bibliotheque.ts";
import { EtoilesDessinees } from "./EtoilesDessinees.tsx";
import { Etincelles } from "./Etincelles.tsx";
import { lireLesMeilleuresEtoilesDuProfil } from "./meilleures-etoiles-du-profil.ts";
import { etoilesSurTrois } from "./texte-des-etoiles.ts";
import { useSauvegardeDeLaSeance } from "./useSauvegardeDeLaSeance.ts";

type Suivante = { readonly id: string; readonly titre: string };

type Props = {
  readonly seance: Seance;
  /** Niveau du profil en cours : la leçon suivante se cherche dans le parcours de ce niveau. */
  readonly niveau: string;
  /** Fait dire au personnage guide ses paroles de fin. */
  readonly onDireLaFin: (etoiles: number) => void;
  readonly onRejouer: () => void;
  readonly onLeconSuivante: (leconId: string) => void;
  readonly onAccueil: () => void;
};

function useLeconSuivante(seance: Seance, niveau: string): Suivante | undefined {
  const [suivante, setSuivante] = useState<Suivante | undefined>();
  const { enfant, lecon: leconId } = seance;
  useEffect(() => {
    let annule = false;
    void Promise.all([chargerToutesLesLecons(), lireLesMeilleuresEtoilesDuProfil(enfant)]).then(([lecons, meilleuresEtoiles]) => {
      const entrees = { lecons, niveau: Niveau.de(niveau), meilleuresEtoiles };
      const idSuivante = leconSuivanteDansLeParcours(entrees, leconId);
      const prochaine = lecons.find((lecon) => lecon.id === idSuivante);
      if (!annule && prochaine) setSuivante({ id: prochaine.id, titre: pageDeLaLecon(prochaine).titre });
    }).catch(() => undefined);
    return () => {
      annule = true;
    };
  }, [enfant, leconId, niveau]);
  return suivante;
}

/** La fin de la séance : étoiles gagnées (dessinées et écrites), paroles du personnage guide, et la suite à choisir. */
export function EcranDeFin({ seance, niveau, onDireLaFin, onRejouer, onLeconSuivante, onAccueil }: Props) {
  const etoiles = seance.etoiles().nombre;
  const message = useSauvegardeDeLaSeance(seance);
  const suivante = useLeconSuivante(seance, niveau);
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
