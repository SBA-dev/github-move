import type { LigneDuTableauDeConjugaison } from "@domain/apprentissage";
import { type DepartDuMot, useMotQuiVoyage } from "./mot-qui-voyage/useMotQuiVoyage.tsx";

type Props = {
  readonly verbe: string;
  readonly temps: string;
  readonly lignes: readonly LigneDuTableauDeConjugaison[];
  /** La forme que l'enfant vient de choisir : si elle est juste, elle voyage de sa bulle jusqu'à sa ligne. */
  readonly motChoisi: DepartDuMot | undefined;
};

/** Le verbe et son temps, puis une ligne par personne : la forme s'écrit quand l'enfant l'a trouvée. */
export function TableauDeConjugaison({ verbe, temps, lignes, motChoisi }: Props) {
  const voyage = useMotQuiVoyage(lignes.map(({ forme }) => forme), motChoisi);
  const rangDeLaPersonneEnCours = lignes.findIndex(({ forme }) => forme === undefined);
  return (
    <section className="tableau-de-conjugaison" data-testid="tableau-de-conjugaison">
      <h3 data-testid="verbe-et-temps">{verbe} · {temps}</h3>
      <ul aria-label="Personnes">
        {lignes.map((ligne, rang) => (
          <li
            key={rang}
            ref={voyage.refDeLaPlace(rang)}
            data-testid="ligne-de-conjugaison"
            data-etat={ligne.forme !== undefined ? "ecrite" : rang === rangDeLaPersonneEnCours ? "en-cours" : "vide"}
            aria-current={rang === rangDeLaPersonneEnCours ? "true" : undefined}
            data-eclat={voyage.eclat(rang) ? "true" : undefined}
          >
            <LigneEcrite ligne={ligne} formeEnRoute={voyage.enRoute(rang)} />
          </li>
        ))}
      </ul>
      {voyage.voyage}
    </section>
  );
}

/** La personne, puis sa forme : la forme reste invisible tant qu'elle voyage vers sa ligne. */
function LigneEcrite({ ligne, formeEnRoute }: { readonly ligne: LigneDuTableauDeConjugaison; readonly formeEnRoute: boolean }) {
  if (ligne.forme === undefined) return <>{ligne.texte}</>;
  return (
    <>
      {ligne.texte.slice(0, ligne.texte.length - ligne.forme.length)}
      <span className="mot-du-trou" data-en-route={formeEnRoute ? "true" : undefined}>{ligne.forme}</span>
    </>
  );
}
