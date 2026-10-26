import { type ReactNode, useEffect, useRef } from "react";

type Props = {
  readonly titre: string;
  readonly libelleDuRetour: string;
  readonly onRetour: () => void;
  readonly children: ReactNode;
};

export function PageLegale({ titre, libelleDuRetour, onRetour, children }: Props) {
  const titreDeLaPage = useRef<HTMLHeadingElement>(null);
  useEffect(() => titreDeLaPage.current?.focus(), []);

  return (
    <article className="page-legale" aria-labelledby="titre-page-legale">
      <h1 id="titre-page-legale" ref={titreDeLaPage} tabIndex={-1}>{titre}</h1>
      {children}
      <button type="button" onClick={onRetour}>{libelleDuRetour}</button>
    </article>
  );
}
