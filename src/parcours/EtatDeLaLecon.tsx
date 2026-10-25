import type { EtatDansLeParcours } from "@domain/apprentissage";
import { libelleDeLEtat } from "./textes-du-parcours.ts";

/** L'état d'une leçon tel que le voit l'enfant ; le lecteur d'écran le lit dans l'annonce de la leçon. */
export function EtatDeLaLecon({ etat }: { readonly etat: EtatDansLeParcours }) {
  return (
    <span className="etat-de-la-lecon" data-testid="etat-de-la-lecon" aria-hidden="true">
      {etat.genre === "reussie" && <span className="etoiles-de-la-lecon">{"★".repeat(etat.etoiles.nombre)} ✓</span>}
      {etat.genre === "reussieAuTestDeDepart" && <span className="etoiles-de-la-lecon">✓ {libelleDeLEtat({ etat })}</span>}
      {etat.genre !== "reussie" && etat.genre !== "reussieAuTestDeDepart" && libelleDeLEtat({ etat })}
    </span>
  );
}
