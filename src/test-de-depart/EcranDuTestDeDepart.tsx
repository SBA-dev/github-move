import { useEffect, useRef, useState } from "react";
import { planDuTestDeDepart, type PlanDuTestDeDepart, TestDeDepart, tireurAuHasard } from "@domain/apprentissage";
import type { Lecon, Niveau } from "@domain/catalogue";
import type { ProfilEnCours } from "@domain/famille";
import type { Univers } from "@domain/motivation";
import { niveauDuProfil } from "../parcours/niveau-du-profil.ts";
import { generateurIdDuNavigateur } from "../seance/generateur-id-navigateur.ts";
import { hasardDuNavigateur } from "../seance/hasard-navigateur.ts";
import { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import type { Voix } from "../voix/index.ts";
import { DeroulementDuTestDeDepart } from "./DeroulementDuTestDeDepart.tsx";
import { FinDuTestDeDepart } from "./FinDuTestDeDepart.tsx";
import { PropositionDuTestDeDepart } from "./PropositionDuTestDeDepart.tsx";
import { useToutesLesLecons } from "./useToutesLesLecons.ts";

type Props = {
  readonly profil: ProfilEnCours;
  readonly univers: Univers;
  readonly voix: Voix;
  /** « Plus tard », ou une bibliothèque qui ne donne aucune question : retour à l'accueil de l'enfant. */
  readonly onPlusTard: () => void;
  readonly onVoirMonParcours: () => void;
};

export function EcranDuTestDeDepart(props: Props) {
  const lecons = useToutesLesLecons();
  if (lecons === undefined) return <p role="status">Chargement du test de départ…</p>;
  return <TestDeDepartCharge lecons={lecons} niveau={niveauDuProfil(props.profil.niveau)} {...props} />;
}

type Phase =
  | { readonly type: "proposition" }
  | { readonly type: "enCours"; readonly test: TestDeDepart }
  | { readonly type: "fini"; readonly test: TestDeDepart };

type PropsChargees = Props & { readonly lecons: readonly Lecon[]; readonly niveau: Niveau | undefined };

function TestDeDepartCharge({ lecons, niveau, profil, univers, voix, onPlusTard, onVoirMonParcours }: PropsChargees) {
  const personnage = usePersonnageQuiParle(voix);
  const [plan] = useState<PlanDuTestDeDepart>(() => niveau ? planDuTestDeDepart(lecons, niveau, hasardDuNavigateur) : []);
  const [phase, setPhase] = useState<Phase>({ type: "proposition" });
  const sansQuestion = niveau === undefined || plan.length === 0;
  const sortie = useRef(false);
  /** Un double toucher ne doit pas quitter deux écrans. */
  const quitterUneFois = (destination: () => void) => () => {
    if (sortie.current) return;
    sortie.current = true;
    destination();
  };
  const plusTard = quitterUneFois(onPlusTard);
  useEffect(() => {
    if (sansQuestion) plusTard();
  });
  if (sansQuestion) return null;

  const commencer = () =>
    setPhase({
      type: "enCours",
      test: TestDeDepart.commencer({
        generateurId: generateurIdDuNavigateur,
        enfant: profil.id,
        niveau,
        lecons,
        plan,
        tireur: tireurAuHasard(hasardDuNavigateur),
      }),
    });

  return (
    <section className="seance test-de-depart" aria-labelledby="titre-du-test-de-depart">
      <div className="entete-de-seance">
        <div>
          <h2 id="titre-du-test-de-depart">Mon test de départ</h2>
          <p data-testid="sous-titre-du-test-de-depart">Pour savoir où commencer</p>
        </div>
      </div>
      {phase.type === "proposition" && (
        <PropositionDuTestDeDepart
          prenom={profil.prenom}
          personnage={personnage}
          univers={univers}
          onAccepter={commencer}
          onPlusTard={plusTard}
        />
      )}
      {phase.type === "enCours" && (
        <DeroulementDuTestDeDepart
          test={phase.test}
          nombreDeQuestions={plan.length}
          personnage={personnage}
          univers={univers}
          personnageGuide={univers.personnageGuide}
          voix={voix}
          toutLireAVoixHaute={profil.reglages.toutLireAVoixHaute}
          onFini={() => setPhase({ type: "fini", test: phase.test })}
        />
      )}
      {phase.type === "fini" && (
        <FinDuTestDeDepart
          test={phase.test}
          prenom={profil.prenom}
          lecons={lecons}
          niveau={niveau}
          personnage={personnage}
          univers={univers}
          onVoirMonParcours={quitterUneFois(onVoirMonParcours)}
        />
      )}
    </section>
  );
}
