import { useEffect, useRef } from "react";

type Props = {
  readonly onQuitter: () => void;
  readonly onSeDeconnecter: () => void;
  readonly deconnexionEchouee: boolean;
};

export function EspaceParent({ onQuitter, onSeDeconnecter, deconnexionEchouee }: Props) {
  const titre = useRef<HTMLHeadingElement>(null);
  useEffect(() => titre.current?.focus(), []);

  return (
    <section className="espace-parent">
      <h2 ref={titre} tabIndex={-1}>Espace parent</h2>
      <button type="button" onClick={onQuitter}>Quitter l'espace parent</button>
      <button type="button" onClick={onSeDeconnecter}>Se déconnecter</button>
      {deconnexionEchouee && <p role="alert">La déconnexion n'a pas abouti. Réessaie dans un instant.</p>}
    </section>
  );
}
