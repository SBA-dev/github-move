export function accorder(nombre: number, singulier: string): string {
  return `${nombre} ${singulier}${nombre > 1 ? "s" : ""}`;
}
