export function nombreDeTrous(texte: string): number {
  return texte.match(/\[[^\]]*\]/g)?.length ?? 0;
}
