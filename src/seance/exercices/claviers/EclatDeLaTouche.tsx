const LOSANGES = [
  "M16 9 L26.5 24 L16 39 L5.5 24 Z",
  "M184 21 L191.7 32 L184 43 L176.3 32 Z",
  "M182 161 L192.5 176 L182 191 L171.5 176 Z",
  "M18 159 L25.7 170 L18 181 L10.3 170 Z",
];
const POINTS = [[44, 8], [160, 10], [196, 104], [8, 118]] as const;

/** L'éclat d'une touche touchée : quatre losanges et quatre points turquoise, les mêmes dans tous les univers (docs/stories/128/planches/sources/eclat-touche.svg). */
export function EclatDeLaTouche() {
  return (
    <svg className="eclat-de-la-touche" data-testid="eclat-de-la-touche" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      {LOSANGES.map((trace) => <path key={trace} d={trace} fill="#FFFFFF" stroke="#0B7E91" strokeWidth={3.5} strokeLinejoin="round" />)}
      {POINTS.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={5.5} fill="#FFFFFF" stroke="#0B7E91" strokeWidth={3} />)}
    </svg>
  );
}
