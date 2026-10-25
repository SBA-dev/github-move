import {
  type EtatDeLaCabane,
  libelleDuPalier,
  libelleLuDuPalier,
  PALIERS_DE_LA_CABANE,
  phraseDeLEtat,
  titreDeLaSection,
} from "@domain/motivation";
import { DessinDeLaCabane } from "./DessinDeLaCabane.tsx";

type Props = { readonly cabane: EtatDeLaCabane; readonly onEcouter: () => Promise<void> };

/** La cabane de Noisette : le dessin, la phrase de l'état et un palier par pastille (non cliquable). */
export function SectionDeLaCabane({ cabane, onEcouter }: Props) {
  return (
    <section className="section-des-medailles section-de-la-cabane" aria-labelledby="titre-de-la-cabane">
      <h2 id="titre-de-la-cabane">{titreDeLaSection()}</h2>
      <button type="button" className="secondaire" onClick={onEcouter}>Écouter</button>
      <DessinDeLaCabane cabane={cabane} />
      <p className="phrase-de-la-cabane" data-testid="phrase-de-la-cabane">{phraseDeLEtat(cabane)}</p>
      <ul className="pastilles-de-la-cabane">
        {PALIERS_DE_LA_CABANE.map((palier, rang) => {
          const atteint = rang < cabane.objetsRecus.length;
          const libelle = libelleDuPalier(palier, atteint);
          const libelleLu = libelleLuDuPalier(palier, atteint);
          return (
            <li
              key={palier.objet.cle}
              className="pastille-de-la-cabane"
              data-testid="pastille-de-la-cabane"
              data-atteint={atteint}
            >
              {libelleLu === libelle ? libelle : (
                <>
                  <span className="visuellement-cache">{libelleLu}</span>
                  <span aria-hidden="true">{libelle}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
