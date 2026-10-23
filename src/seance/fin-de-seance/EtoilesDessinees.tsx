const ETOILES_POSSIBLES = [1, 2, 3] as const;
const POINTS_DE_L_ETOILE = "12,2 15,9 22,9.5 16.5,14 18.5,21.5 12,17.5 5.5,21.5 7.5,14 2,9.5 9,9";

/** Trois étoiles dessinées, les gagnées allumées. Décoratif : le texte voisin dit la même chose. */
export function EtoilesDessinees({ nombre }: { readonly nombre: number }) {
  return (
    <div className="etoiles-dessinees" aria-hidden="true" data-testid="etoiles-dessinees">
      {ETOILES_POSSIBLES.map((rang) => (
        <svg key={rang} viewBox="0 0 24 24" data-testid="etoile" data-allumee={rang <= nombre ? "true" : "false"}>
          <polygon points={POINTS_DE_L_ETOILE} />
        </svg>
      ))}
    </div>
  );
}
