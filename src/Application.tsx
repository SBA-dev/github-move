import { type CSSProperties, Suspense, useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import { universDe } from "@domain/motivation";
import { chargerProfilPrepare, PAGE_DEMONSTRATION_DISPONIBLE, PageDemonstration } from "./demonstration/disponibilite.ts";
import type { ProfilPrepare } from "./demonstration/profil-prepare.ts";
import { EnTete } from "./en-tete/EnTete.tsx";
import { useNavigation } from "./navigation.ts";
import { PALETTES, Paysage, PersonnageGuide } from "./univers/index.ts";

type Habillage = CSSProperties & { readonly "--accent": string; readonly "--accent-fonce": string };

function useProfilPrepare(actif: boolean) {
  const [profil, setProfil] = useState<ProfilPrepare | undefined>();
  useEffect(() => {
    if (!actif || !chargerProfilPrepare) return;
    let annule = false;
    chargerProfilPrepare().then((profilLu) => {
      if (!annule) setProfil(profilLu);
    });
    return () => {
      annule = true;
    };
  }, [actif]);
  return actif ? profil : undefined;
}

export function Application() {
  const { ecran: ecranDemande, retourPossible, aller, revenir } = useNavigation();
  const ecran = ecranDemande === "demonstration" && !PAGE_DEMONSTRATION_DISPONIBLE ? "accueil" : ecranDemande;
  const profil = useProfilPrepare(ecran === "demonstration");
  const univers = universDe(profil?.univers);
  const palette = PALETTES[univers.cle];
  const habillage: Habillage = { "--accent": palette.principale, "--accent-fonce": palette.foncee };

  return (
    <MotionConfig reducedMotion="user">
      <div className="application" style={habillage} data-univers={univers.cle}>
        <Paysage univers={univers.cle} />
        <EnTete
          surAccueil={ecran === "accueil"}
          enfant={profil}
          retourPossible={retourPossible}
          onAccueil={() => aller("accueil")}
          onRetour={revenir}
          onEspaceParent={() => aller("espace-parent")}
        />
        <main className="ecran">
          {ecran === "accueil" && (
            <>
              <p>Réviser le programme du CP au CM2, en jouant.</p>
              <PersonnageGuide univers={univers} humeur="content" />
            </>
          )}
          {ecran === "demonstration" && PageDemonstration && (
            <Suspense fallback={null}>
              <PageDemonstration univers={univers} />
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
