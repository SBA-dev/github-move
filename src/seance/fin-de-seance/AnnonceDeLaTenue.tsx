import {
  annonceDeLaTenueRecue,
  type PersonnageGuide as PersonnageGuideDuDomaine,
  type TenueDuPersonnageGuide,
  titreDeLAnnonceDeLaTenue,
  type Univers,
} from "@domain/motivation";
import { PersonnageGuide } from "../../univers/index.ts";

type Props = { readonly univers: Univers; readonly tenue: TenueDuPersonnageGuide | undefined };

/** L'encart de fin de séance : la tenue que le personnage guide vient de recevoir. Vide, il disparaît ; il apparaît sans mouvement. */
export function AnnonceDeLaTenue({ univers, tenue }: Props) {
  const personnage: PersonnageGuideDuDomaine = univers.personnageGuide;
  return (
    <div className="pour-le-personnage-guide" role="status" data-testid="annonce-de-la-tenue">
      {tenue && (
        <>
          <strong>{titreDeLAnnonceDeLaTenue(personnage)}</strong>
          <PersonnageGuide
            univers={univers}
            humeur="content"
            tenue={tenue.cle}
            identifiantDeTest="personnage-guide-de-l-annonce"
          />
          <p>{annonceDeLaTenueRecue(personnage, tenue)}</p>
        </>
      )}
    </div>
  );
}
