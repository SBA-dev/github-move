import type { EtapeDeLecon } from "../../catalogue/domain/index.ts";

export function texteALireDeLEtape(etape: EtapeDeLecon): string[] {
  if (etape.exemples.length === 0) return [etape.texte];
  return [etape.texte, etape.exemples.join(". ")];
}
