import type { LigneDuTableauDeConjugaison } from "@domain/apprentissage";

type Props = {
  readonly verbe: string;
  readonly temps: string;
  readonly lignes: readonly LigneDuTableauDeConjugaison[];
};

/** Le verbe et son temps, puis une ligne par personne : la forme s'écrit quand l'enfant l'a trouvée. */
export function TableauDeConjugaison({ verbe, temps, lignes }: Props) {
  const rangDeLaPersonneEnCours = lignes.findIndex(({ forme }) => forme === undefined);
  return (
    <section className="tableau-de-conjugaison" data-testid="tableau-de-conjugaison">
      <h3 data-testid="verbe-et-temps">{verbe} · {temps}</h3>
      <ul aria-label="Personnes">
        {lignes.map((ligne, rang) => (
          <li
            key={rang}
            data-testid="ligne-de-conjugaison"
            data-etat={ligne.forme !== undefined ? "ecrite" : rang === rangDeLaPersonneEnCours ? "en-cours" : "vide"}
            aria-current={rang === rangDeLaPersonneEnCours ? "true" : undefined}
          >
            {ligne.texte}
          </li>
        ))}
      </ul>
    </section>
  );
}
