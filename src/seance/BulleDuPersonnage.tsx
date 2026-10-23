import type { ReactNode } from "react";

type Props = { readonly modeDys: boolean; readonly children?: ReactNode };

export function BulleDuPersonnage({ modeDys, children }: Props) {
  return (
    <div className="bulle" data-testid="parole" data-dys={modeDys ? "true" : undefined}>
      {children}
    </div>
  );
}
