import { type CSSProperties, Suspense, useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import type { EtatDeLEspaceParent } from "@domain/famille";
import { universDe } from "@domain/motivation";
import { chargerProfilPrepare, PAGE_DEMONSTRATION_DISPONIBLE, PageDemonstration } from "./demonstration/disponibilite.ts";
import type { ProfilPrepare } from "./demonstration/profil-prepare.ts";
import { EnTete } from "./en-tete/EnTete.tsx";
import { ControleParental, EspaceParent, useAccesALEspaceParent } from "./famille/index.ts";
import { AideEcranDAccueil } from "./installation/index.ts";
import { type Ecran, useNavigation } from "./navigation.ts";
import { ChoixDeLaVoix, useVoix } from "./voix/index.ts";
import { PALETTES, Paysage, PersonnageGuide } from "./univers/index.ts";

type Habillage = CSSProperties & { readonly "--accent": string; readonly "--accent-fonce": string };

function useProfilPrepare(actif: boolean) {
  const [profil, setProfil] = useState<ProfilPrepare | undefined>();
  const [charge, setCharge] = useState(false);
  useEffect(() => {
    if (!actif || !chargerProfilPrepare) return;
    let annule = false;
    chargerProfilPrepare().then((profilLu) => {
      if (annule) return;
      setProfil(profilLu);
      setCharge(true);
    });
    return () => {
      annule = true;
    };
  }, [actif]);
  return { profil: actif ? profil : undefined, charge: actif && charge };
}

function ecranAffiche(demande: Ecran, espaceParent: EtatDeLEspaceParent["type"]): Ecran {
  if (demande === "demonstration" && !PAGE_DEMONSTRATION_DISPONIBLE) return "accueil";
  if (demande === "espace-parent" && espaceParent === "ferme") return "accueil";
  return demande;
}

export function Application() {
  const { ecran: ecranDemande, retourPossible, aller, remplacer, revenir } = useNavigation();
  const acces = useAccesALEspaceParent();
  const ecran = ecranAffiche(ecranDemande, acces.etat.type);
  const surLaDemonstration = ecran === "demonstration";
  const { profil: profilEnCours, charge: profilCharge } = useProfilPrepare(
    surLaDemonstration || ecran === "espace-parent",
  );
  const profil = surLaDemonstration ? profilEnCours : undefined;
  const univers = universDe(profil?.univers);
  const palette = PALETTES[univers.cle];
  const voix = useVoix(universDe(profilEnCours?.univers).personnageGuide);
  const { etat: etatEspaceParent, quitter: fermerEspaceParent } = acces;
  useEffect(() => {
    if (ecranDemande !== "espace-parent") fermerEspaceParent();
  }, [ecranDemande, fermerEspaceParent]);
  useEffect(() => {
    if (ecran !== ecranDemande) remplacer(ecran);
  }, [ecran, ecranDemande, remplacer]);
  const habillage: Habillage = { "--accent": palette.principale, "--accent-fonce": palette.foncee };

  return (
    <MotionConfig reducedMotion="user">
      <div className="application" style={habillage} data-univers={univers.cle}>
        <Paysage univers={univers.cle} />
        <EnTete
          surAccueil={ecran === "accueil"}
          enfant={profil}
          son={voix.son}
          retourPossible={retourPossible}
          onBasculerLeSon={voix.basculerLeSon}
          onAccueil={() => aller("accueil")}
          onRetour={revenir}
          onEspaceParent={() => {
            acces.demanderLEntree();
            aller("espace-parent");
          }}
        />
        <main className="ecran">
          <div role="status" className="voix-bloquee">
            {voix.nomDuPersonnageGuideDeLaVoixBloquee &&
              `La voix de ${voix.nomDuPersonnageGuideDeLaVoixBloquee} est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte.`}
          </div>
          {ecran === "accueil" && (
            <>
              <p>Réviser le programme du CP au CM2, en jouant.</p>
              <PersonnageGuide univers={univers} humeur="content" />
              <AideEcranDAccueil />
            </>
          )}
          {surLaDemonstration && PageDemonstration && profilCharge && (
            <Suspense fallback={null}>
              <PageDemonstration univers={univers} voix={voix} />
            </Suspense>
          )}
          {ecran === "espace-parent" && etatEspaceParent.type === "questionPosee" && (
            <ControleParental
              enonce={etatEspaceParent.enonce}
              onReponse={acces.repondre}
              onRenoncer={() => (retourPossible ? revenir() : remplacer("accueil"))}
            />
          )}
          {ecran === "espace-parent" && etatEspaceParent.type === "ouvert" && (
            <EspaceParent
              onQuitter={() => {
                fermerEspaceParent();
                remplacer("accueil");
              }}
            >
              <ChoixDeLaVoix voix={voix} />
            </EspaceParent>
          )}
        </main>
      </div>
    </MotionConfig>
  );
}
