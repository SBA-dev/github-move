import { type ReactNode, useEffect, useRef } from "react";

type Props = {
  readonly onQuitter: () => void;
  readonly onSeDeconnecter: () => void;
  readonly deconnexionEchouee: boolean;
  readonly children?: ReactNode;
};

export function EspaceParent({ onQuitter, onSeDeconnecter, deconnexionEchouee, children }: Props) {
  const titre = useRef<HTMLHeadingElement>(null);
  useEffect(() => titre.current?.focus(), []);

  return (
    <section className="espace-parent">
      <h2 ref={titre} tabIndex={-1}>Espace parent</h2>
      {children}
      <button type="button" onClick={onQuitter}>Quitter l'espace parent</button>
      <button type="button" onClick={onSeDeconnecter}>Se déconnecter</button>
      {deconnexionEchouee && <p role="alert">La déconnexion n'a pas abouti. Réessaie dans un instant.</p>}
    </section>
  );
}
