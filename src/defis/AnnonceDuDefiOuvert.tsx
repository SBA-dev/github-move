import type { Defi, GrandDefi } from "@domain/apprentissage";
import { annonceDuDefiOuvertPour } from "@domain/motivation";

type Props = { readonly defi: Defi | GrandDefi | undefined };

/** L'encart de fin de séance : le défi (ou le grand défi) que la séance vient d'ouvrir. Vide, il disparaît ; il n'est pas lu à voix haute (le personnage guide le propose), mais annoncé aux lecteurs d'écran. */
export function AnnonceDuDefiOuvert({ defi }: Props) {
  return (
    <div className="pour-le-defi" role="status" data-testid="annonce-du-defi-ouvert">
      {defi && <p>{annonceDuDefiOuvertPour(defi)}</p>}
    </div>
  );
}
