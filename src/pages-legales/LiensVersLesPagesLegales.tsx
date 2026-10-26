import type { PageLegale } from "./pages.ts";
import { CHEMINS_DES_PAGES_LEGALES } from "./pages.ts";

type Props = {
  readonly onOuvrir: (page: PageLegale) => void;
};

const LIBELLES: Readonly<Record<PageLegale, string>> = {
  "politique-de-confidentialite": "Politique de confidentialité",
  "mentions-legales": "Mentions légales",
};

export function LiensVersLesPagesLegales({ onOuvrir }: Props) {
  return (
    <nav className="liens-legaux" aria-label="Informations légales">
      {(Object.keys(LIBELLES) as PageLegale[]).map((page) => (
        <a
          key={page}
          href={CHEMINS_DES_PAGES_LEGALES[page]}
          onClick={(evenement) => {
            evenement.preventDefault();
            onOuvrir(page);
          }}
        >
          {LIBELLES[page]}
        </a>
      ))}
    </nav>
  );
}
