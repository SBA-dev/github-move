type Props = {
  readonly inactif: boolean;
  readonly onReecouter: () => void;
};

/** Le seul bouton qui redit ce qui est dit dans la bulle : la consigne, ou la phrase du personnage guide quand il réagit. */
export function BoutonReecouter({ inactif, onReecouter }: Props) {
  return (
    <button type="button" className="reecouter reecouter-rond" aria-label="Réécouter" aria-disabled={inactif ? true : undefined} onClick={onReecouter}>
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}
