import { useEffect, useRef, useState } from "react";
import type { FileDeRevision } from "@domain/apprentissage";
import type { Lecon, Niveau } from "@domain/catalogue";
import type { ProfilEnCours } from "@domain/famille";
import type { Univers } from "@domain/motivation";
import { niveauDuProfil } from "../parcours/niveau-du-profil.ts";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { useToutesLesLecons } from "../test-de-depart/useToutesLesLecons.ts";
import { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import type { Voix } from "../voix/index.ts";
import { commencerLaRevision, type RevisionCommencee } from "./commencer-la-revision.ts";
import { DeroulementDeLaRevision } from "./DeroulementDeLaRevision.tsx";
import { FinDeLaRevision } from "./FinDeLaRevision.tsx";
import { useFileDeRevision } from "./useFileDeRevision.ts";

type Props = {
  readonly profil: ProfilEnCours;
  readonly univers: Univers;
  readonly voix: Voix;
  /** « Accueil » à la fin, ou rien à réviser : retour à l'accueil de l'enfant. */
  readonly onAccueil: () => void;
};

export function EcranDeRevision(props: Props) {
  const lecons = useToutesLesLecons();
  const file = useFileDeRevision(props.profil.id);
  if (lecons === undefined || file === undefined) return <p role="status">Chargement de la révision…</p>;
  return <RevisionChargee lecons={lecons} file={file} niveau={niveauDuProfil(props.profil.niveau)} {...props} />;
}

type PropsChargees = Props & {
  readonly lecons: readonly Lecon[];
  readonly file: FileDeRevision | null;
  readonly niveau: Niveau | undefined;
};

function RevisionChargee({ lecons, file, niveau, profil, univers, voix, onAccueil }: PropsChargees) {
  const personnage = usePersonnageQuiParle(voix);
  const [revision] = useState<RevisionCommencee | undefined>(() =>
    file && niveau
      ? commencerLaRevision({ file, jour: jourDuNavigateur(new Date()), enfant: profil.id, lecons, niveau })
      : undefined
  );
  const [fini, setFini] = useState(false);
  const sortie = useRef(false);
  /** Un double toucher ne doit pas quitter deux écrans. */
  const retournerALAccueil = () => {
    if (sortie.current) return;
    sortie.current = true;
    onAccueil();
  };
  useEffect(() => {
    if (!revision) retournerALAccueil();
  });
  if (!revision) return null;

  return (
    <section className="seance revision" aria-labelledby="titre-de-la-revision">
      <div className="entete-de-seance">
        <div>
          <h2 id="titre-de-la-revision">Je révise mes erreurs</h2>
          <p data-testid="sous-titre-de-la-revision">Révision</p>
        </div>
      </div>
      {fini
        ? (
          <FinDeLaRevision
            seance={revision.seance}
            prenom={profil.prenom}
            personnage={personnage}
            univers={univers}
            onAccueil={retournerALAccueil}
          />
        )
        : (
          <DeroulementDeLaRevision
            seance={revision.seance}
            boites={revision.boites}
            nombreDeQuestions={revision.seance.resultats().length}
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
