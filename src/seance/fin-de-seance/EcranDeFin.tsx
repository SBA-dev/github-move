import { useEffect, useRef, useState } from "react";
import { leconSuivanteDansLeParcours, type Seance } from "@domain/apprentissage";
import { pageDeLaLecon } from "@domain/catalogue";
import { lireLeNiveauDuProfil } from "../../famille/index.ts";
import { niveauDuProfil } from "../../parcours/index.ts";
import { reseauDisponible } from "../../reseau/reseau-disponible.ts";
import { chargerToutesLesLecons } from "../bibliotheque.ts";
import { EtoilesDessinees } from "./EtoilesDessinees.tsx";
import { Etincelles } from "./Etincelles.tsx";
import { lireLesMeilleuresEtoilesDuProfil } from "./meilleures-etoiles-du-profil.ts";
import { etoilesSurTrois } from "./texte-des-etoiles.ts";
import { useSauvegardeDeLaSeance } from "./useSauvegardeDeLaSeance.ts";

type Suivante = { readonly id: string; readonly titre: string };

type Props = {
  readonly seance: Seance;
  /** Niveau connu du profil en cours : repli quand le serveur est injoignable. La leçon suivante se cherche dans le parcours du niveau à jour. */
  readonly niveau: string;
  /** Fait dire au personnage guide ses paroles de fin. */
  readonly onDireLaFin: (etoiles: number) => void;
  readonly onRejouer: () => void;
  readonly onLeconSuivante: (leconId: string) => void;
  readonly onAccueil: () => void;
};

/** Sans bibliothèque (hors ligne, pas encore en cache), l'écran de fin reste valable : il n'annonce simplement pas de leçon suivante. */
function bibliothequeIndisponible(): void {}

/** Le niveau à jour (un parent a pu le changer ailleurs), sinon celui gardé en mémoire. */
async function niveauActuel(profil: string, niveauConnu: string): Promise<string> {
  if (!reseauDisponible()) return niveauConnu;
  return await lireLeNiveauDuProfil(profil).then((lu) => lu ?? niveauConnu, () => niveauConnu);
}

function useLeconSuivante(seance: Seance, niveau: string): Suivante | undefined {
  const [suivante, setSuivante] = useState<Suivante | undefined>();
  const { enfant, lecon: leconId } = seance;
  useEffect(() => {
    let annule = false;
    void (async () => {
      const niveauDeLEnfant = niveauDuProfil(await niveauActuel(enfant, niveau));
      if (!niveauDeLEnfant) return;
      const [lecons, meilleuresEtoiles] = await Promise.all([chargerToutesLesLecons(), lireLesMeilleuresEtoilesDuProfil(enfant)]);
      const idSuivante = leconSuivanteDansLeParcours({ lecons, niveau: niveauDeLEnfant, meilleuresEtoiles }, leconId);
      const prochaine = lecons.find((lecon) => lecon.id === idSuivante);
      if (!annule && prochaine) setSuivante({ id: prochaine.id, titre: pageDeLaLecon(prochaine).titre });
    })().catch(bibliothequeIndisponible);
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
