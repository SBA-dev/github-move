export function attendre(millisecondes: number): Promise<void> {
  return new Promise((fin) => setTimeout(fin, millisecondes));
}
