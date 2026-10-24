export function etoilesSurTrois(nombre: number): string {
  return `${nombre} étoile${nombre > 1 ? "s" : ""} sur 3`;
}

export function meilleuresEtoilesSurTrois(nombre: number): string {
  return `Tes meilleures étoiles : ${nombre} sur 3`;
}
