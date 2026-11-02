import type { DefiReleve } from "@domain/apprentissage";
import { lignesDesDefisReleves, TITRE_DES_DEFIS_RELEVES } from "@domain/motivation";

type Props = { readonly defis: readonly DefiReleve[]; readonly onEcouter: () => Promise<void> };

/** Les défis relevés du profil, un par ligne, chacun une seule fois. Rien à toucher : la section se lit, elle n'ouvre rien. */
export function SectionDesDefisReleves({ defis, onEcouter }: Props) {
  return (
    <section
      className="section-des-medailles section-des-defis-releves"
      aria-labelledby="titre-des-defis-releves"
      data-testid="section-des-defis-releves"
    >
      <h2 id="titre-des-defis-releves">{TITRE_DES_DEFIS_RELEVES}</h2>
      <button type="button" className="secondaire" onClick={onEcouter}>Écouter</button>
      <ul className="lignes-de-defi-releve">
        {lignesDesDefisReleves(defis).map((ligne) => <li key={ligne} data-testid="ligne-de-defi-releve">{ligne}</li>)}
      </ul>
    </section>
  );
}
