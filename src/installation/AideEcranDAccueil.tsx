import { aideEcranDAccueilNecessaire } from "./aide-ecran-d-accueil.ts";

export function AideEcranDAccueil() {
  const affichageInstalle = window.matchMedia("(display-mode: standalone)").matches;
  if (!aideEcranDAccueilNecessaire(navigator, affichageInstalle)) return null;
  return (
    <section className="aide-ecran-d-accueil" aria-label="Ajouter Savanturier à l'écran d'accueil">
      <p>
        Pour installer Savanturier : touche <strong>Partager</strong>, puis <strong>Sur l'écran d'accueil</strong>.
      </p>
    </section>
  );
}
