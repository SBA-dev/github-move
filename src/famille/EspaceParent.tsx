import { type ReactNode, useEffect, useRef } from "react";

type Props = { readonly onQuitter: () => void; readonly children?: ReactNode };

export function EspaceParent({ onQuitter, children }: Props) {
  const titre = useRef<HTMLHeadingElement>(null);
  useEffect(() => titre.current?.focus(), []);

  return (
    <section className="espace-parent">
      <h2 ref={titre} tabIndex={-1}>Espace parent</h2>
      {children}
      <button type="button" onClick={onQuitter}>Quitter l'espace parent</button>
    </section>
  );
}
