import { type CSSProperties, Suspense, useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import { universDe } from "@domain/motivation";
import { chargerProfilPrepare, PAGE_DEMONSTRATION_DISPONIBLE, PageDemonstration } from "./demonstration/disponibilite.ts";
import type { ProfilPrepare } from "./demonstration/profil-prepare.ts";
import { EnTete } from "./en-tete/EnTete.tsx";
import { AideEcranDAccueil } from "./installation/index.ts";
import { useNavigation } from "./navigation.ts";
import { useVoix } from "./voix/index.ts";
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

export function Application() {
  const { ecran: ecranDemande, retourPossible, aller, revenir } = useNavigation();
  const ecran = ecranDemande === "demonstration" && !PAGE_DEMONSTRATION_DISPONIBLE ? "accueil" : ecranDemande;
  const { profil, charge: profilCharge } = useProfilPrepare(ecran === "demonstration");
  const univers = universDe(profil?.univers);
  const palette = PALETTES[univers.cle];
  const voix = useVoix(univers.personnageGuide);
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
          onEspaceParent={() => aller("espace-parent")}
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
          {ecran === "demonstration" && PageDemonstration && profilCharge && (
            <Suspense fallback={null}>
              <PageDemonstration univers={univers} voix={voix} />
            </Suspense>
          )}
          {ecran === "espace-parent" && (
            <section>
              <h2>Espace parent</h2>
              <p>Bientôt disponible.</p>
            </section>
          )}
        </main>
      </div>
    </MotionConfig>
  );
}
