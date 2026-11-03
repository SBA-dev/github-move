type Props = {
  readonly contenu: string;
  readonly identifiant: "dessin-de-la-case" | "dessin-du-cristal" | "dessin-de-la-marque";
};

/**
 * Un dessin d'univers : décor pour les yeux, jamais annoncé.
 * `dangerouslySetInnerHTML` ne reçoit que des SVG statiques du dépôt, empaquetés au build : jamais une donnée d'un parent ou de l'IA.
 */
export function DessinDeLUnivers({ contenu, identifiant }: Props) {
  return (
    <svg
      className={identifiant}
      data-testid={identifiant}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: contenu }}
    />
  );
}
