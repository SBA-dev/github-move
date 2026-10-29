import { useEffect, useRef, useState } from "react";
import { AucuneQuestionPourLeDefi, type Defi, type DefiReleve } from "@domain/apprentissage";
import { type Lecon, libelleCourtDe, type Niveau } from "@domain/catalogue";
import type { ProfilEnCours } from "@domain/famille";
import { nomDuDefi, parolesDeDebutDeDefi, type Univers } from "@domain/motivation";
import { niveauDuProfil } from "../parcours/niveau-du-profil.ts";
import { DeroulementDeLaRevision as DeroulementDesQuestions } from "../revision/DeroulementDeLaRevision.tsx";
import { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import { useToutesLesLecons } from "../test-de-depart/useToutesLesLecons.ts";
import type { Voix } from "../voix/index.ts";
import { commencerLeDefi, type DefiCommence } from "./commencer-le-defi.ts";
import { FinDuDefi } from "./FinDuDefi.tsx";
import { lireLesDefisReleves } from "./lire-les-defis-releves.ts";

type Props = {
  readonly profil: ProfilEnCours;
  readonly defi: Defi;
  readonly univers: Univers;
  readonly voix: Voix;
  /** « Mon parcours » à la fin, « Quitter le défi » en cours, ou rien à jouer : retour à la carte de la matière. */
  readonly onMonParcours: () => void;
  readonly onAccueil: () => void;
};

/**
 * Le défi d'une partie du parcours : il se joue comme une séance de révision (mêmes questions, même aide, même nouvelle chance),
 * sans vie, sans temps limité et sans compte des erreurs. Le quitter ne perd rien.
 */
export function EcranDeDefi(props: Props) {
  const lecons = useToutesLesLecons();
  if (lecons === undefined) return <p role="status">Chargement du défi…</p>;
  return <DefiCharge lecons={lecons} niveau={niveauDuProfil(props.profil.niveau)} {...props} />;
}

function commencer(defi: Defi, enfant: string, lecons: readonly Lecon[], niveau: Niveau | undefined): DefiCommence | undefined {
  if (!niveau) return undefined;
  try {
    return commencerLeDefi({ defi, enfant, lecons, niveau });
  } catch (erreur) {
    if (erreur instanceof AucuneQuestionPourLeDefi) return undefined;
    throw erreur;
  }
}

function DefiCharge(
  { lecons, niveau, defi, profil, univers, voix, onMonParcours, onAccueil }: Props & { readonly lecons: readonly Lecon[]; readonly niveau: Niveau | undefined },
) {
  const personnage = usePersonnageQuiParle(voix);
  const [commence] = useState(() => commencer(defi, profil.id, lecons, niveau));
  const [relevesAvant] = useState<Promise<readonly DefiReleve[]>>(() => lireLesDefisReleves(profil.id));
  const [fini, setFini] = useState(false);
  const sortie = useRef(false);
  /** Un double toucher ne doit pas quitter deux écrans. */
  const retourner = (quitter: () => void) => () => {
    if (sortie.current) return;
    sortie.current = true;
    quitter();
  };
  useEffect(() => {
    if (!commence) retourner(onMonParcours)();
  }, [commence, onMonParcours]);
  if (!commence) return null;

  return (
    <section className="seance revision defi" aria-labelledby="titre-du-defi" data-testid="ecran-du-defi">
      <div className="entete-de-seance">
        <div>
          <h2 id="titre-du-defi">{nomDuDefi(defi.numero)}</h2>
          <p data-testid="sous-titre-du-defi">{libelleCourtDe(defi.matiere.code)}</p>
        </div>
        {!fini && (
          <button type="button" className="secondaire" data-testid="quitter-le-defi" onClick={retourner(onMonParcours)}>
            Quitter le défi
          </button>
        )}
      </div>
      {fini
        ? (
          <FinDuDefi
            seance={commence.seance}
            prenom={profil.prenom}
            personnage={personnage}
            univers={univers}
            relevesAvant={relevesAvant}
            onMonParcours={retourner(onMonParcours)}
            onAccueil={retourner(onAccueil)}
          />
        )
        : (
          <DeroulementDesQuestions
            seance={commence.seance}
            parolesDeDebut={parolesDeDebutDeDefi({ nombreDeLecons: defi.lecons.length })}
            libelleDeLAvancement="Avancement du défi"
            boites={commence.boites}
            textes={commence.textes}
            nombreDeQuestions={commence.nombreDeQuestions}
            personnage={personnage}
            univers={univers}
            voix={voix}
            toutLireAVoixHaute={profil.reglages.toutLireAVoixHaute}
            onFini={() => setFini(true)}
          />
        )}
    </section>
  );
}
