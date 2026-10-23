type Props = { readonly onQuitter: () => void };

export function EspaceParent({ onQuitter }: Props) {
  return (
    <section className="espace-parent">
      <h2>Espace parent</h2>
      <button type="button" onClick={onQuitter}>Quitter l'espace parent</button>
    </section>
  );
}
