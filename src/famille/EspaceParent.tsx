import { type ReactNode, useEffect, useRef } from "react";
import { LiensVersLesPagesLegales, type PageLegale } from "../pages-legales/index.ts";

type Props = {
  readonly onQuitter: () => void;
  readonly onSeDeconnecter: () => void;
  readonly deconnexionEchouee: boolean;
  readonly onOuvrirUnePageLegale: (page: PageLegale) => void;
  readonly children?: ReactNode;
};

export function EspaceParent({ onQuitter, onSeDeconnecter, deconnexionEchouee, onOuvrirUnePageLegale, children }: Props) {
  const titre = useRef<HTMLHeadingElement>(null);
  useEffect(() => titre.current?.focus(), []);

  return (
    <section className="espace-parent">
      <h2 ref={titre} tabIndex={-1}>Espace parent</h2>
      {children}
      <LiensVersLesPagesLegales onOuvrir={onOuvrirUnePageLegale} />
      <button type="button" onClick={onQuitter}>Quitter l'espace parent</button>
      <button type="button" onClick={onSeDeconnecter}>Se déconnecter</button>
      {deconnexionEchouee && <p role="alert">La déconnexion n'a pas abouti. Réessaie dans un instant.</p>}
    </section>
  );
}
