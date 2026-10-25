type Props = {
  readonly nombre: number;
  /** Tous ces jetons viennent d'entrer dans la boîte. */
  readonly nouveaux?: boolean;
  /** Les derniers jetons qui sortent de la boîte. */
  readonly sortants?: number;
};

const JETONS_PAR_RANGEE = 5;

/** Des jetons rangés par 5, le cinquième de chaque rangée marqué. */
export function RangeesDeJetons({ nombre, nouveaux = false, sortants = 0 }: Props) {
  const rangees = Array.from({ length: Math.ceil(nombre / JETONS_PAR_RANGEE) }, (_, rang) => rang);
  const etatDuJeton = (rang: number) =>
    nouveaux ? "nouveau" : rang >= nombre - sortants ? "sortant" : undefined;
  return (
    <div className="jetons" data-testid="jetons" data-nombre={nombre}>
      {rangees.map((rangee) => (
        <div key={rangee} className="rangee-de-jetons" data-testid="rangee-de-jetons">
          {Array.from(
            { length: Math.min(JETONS_PAR_RANGEE, nombre - rangee * JETONS_PAR_RANGEE) },
            (_, place) => {
              const rang = rangee * JETONS_PAR_RANGEE + place;
              return (
                <span
                  key={rang}
                  className="jeton"
                  data-testid="jeton"
                  data-cinquieme={place === JETONS_PAR_RANGEE - 1 ? "true" : undefined}
                  data-etat={etatDuJeton(rang)}
                />
              );
            },
          )}
        </div>
      ))}
    </div>
  );
}
