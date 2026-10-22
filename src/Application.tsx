import type { CSSProperties } from "react";
import { MotionConfig } from "motion/react";
import { universDe } from "@domain/motivation";
import { PAGE_DEMONSTRATION_DISPONIBLE } from "./demonstration/disponibilite.ts";
import { PageDemonstration } from "./demonstration/PageDemonstration.tsx";
import { lireProfilPrepare } from "./demonstration/profil-prepare.ts";
import { EnTete } from "./en-tete/EnTete.tsx";
import { useNavigation } from "./navigation.ts";
import { PALETTES, Paysage, PersonnageGuide } from "./univers/index.ts";

export function Application() {
  const { ecran: ecranDemande, retourPossible, aller, revenir } = useNavigation();
  const ecran = ecranDemande === "demonstration" && !PAGE_DEMONSTRATION_DISPONIBLE ? "accueil" : ecranDemande;
  const profil = ecran === "demonstration" ? lireProfilPrepare() : undefined;
  const univers = universDe(profil?.univers);
  const palette = PALETTES[univers.cle];
  const habillage = { "--accent": palette.principale, "--accent-fonce": palette.foncee } as CSSProperties;

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
          {ecran === "demonstration" && <PageDemonstration univers={univers} />}
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
