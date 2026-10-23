import { useEffect, useRef } from "react";

type Props = { readonly onQuitter: () => void };

export function EspaceParent({ onQuitter }: Props) {
  const titre = useRef<HTMLHeadingElement>(null);
  useEffect(() => titre.current?.focus(), []);

  return (
    <section className="espace-parent">
      <h2 ref={titre} tabIndex={-1}>Espace parent</h2>
      <button type="button" onClick={onQuitter}>Quitter l'espace parent</button>
    </section>
  );
}
