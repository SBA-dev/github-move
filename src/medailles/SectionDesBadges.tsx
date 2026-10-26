import {
  type Badge,
  libelleDeLaListeDesBadges,
  phraseSansBadge,
  titreDeLaSectionDesBadges,
} from "@domain/motivation";
import { IconeDeMatiere } from "./IconeDeMatiere.tsx";

type Props = {
  readonly badges: readonly Badge[];
  readonly onEcouter: () => Promise<void>;
  readonly onLireLeBadge: (badge: Badge) => Promise<void>;
};

/** Les badges du profil : une pastille par badge, qui lit son nom au toucher et n'ouvre rien. */
export function SectionDesBadges({ badges, onEcouter, onLireLeBadge }: Props) {
  return (
    <section
      className="section-des-medailles section-des-badges"
      aria-labelledby="titre-des-badges"
      data-testid="section-des-badges"
    >
      <h2 id="titre-des-badges">{titreDeLaSectionDesBadges()}</h2>
      <button type="button" className="secondaire" onClick={onEcouter}>Écouter</button>
      {badges.length === 0 ? <p className="phrase-sans-badge">{phraseSansBadge()}</p> : (
        <ul className="pastilles-de-badge" aria-label={libelleDeLaListeDesBadges(badges)}>
          {badges.map((badge) => (
            <li key={badge.cle}>
              <button
                type="button"
                className="pastille-de-badge"
                data-testid="pastille-de-badge"
                data-matiere={badge.matiere}
                onClick={() => onLireLeBadge(badge)}
              >
                <IconeDeMatiere matiere={badge.matiere} />
                <span>{badge.nom}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
