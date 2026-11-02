import { feteDeLaQueteAccomplie } from "@domain/motivation";

type Props = { readonly prenom: string; readonly accomplie: boolean };

/** L'encart de fin de séance : la quête du jour que la séance vient d'accomplir. Vide, il disparaît ; il n'a aucune animation (les confettis sont ceux de la fin). */
export function AnnonceDeLaQueteAccomplie({ prenom, accomplie }: Props) {
  return (
    <div className="pour-la-quete" role="status" data-testid="annonce-de-la-quete-accomplie">
      {accomplie && <p>{feteDeLaQueteAccomplie(prenom)}</p>}
    </div>
  );
}
