import { type Serie, texteDeLaPastille } from "@domain/motivation";

/** La série dite à l'enfant : une flamme décorative et le texte, lu par un lecteur d'écran. Elle ne se touche pas. */
export function PastilleDeSerie({ serie }: { readonly serie: Serie }) {
  return (
    <p className="pastille-de-serie" data-testid="pastille-de-serie">
      <span className="flamme-de-la-serie" aria-hidden="true">🔥</span>
      <span className="texte-de-la-serie">{texteDeLaPastille(serie)}</span>
    </p>
  );
}
