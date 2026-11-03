import type { Point } from "../maisons/groupe-sous-le-doigt.ts";
import { useGlisserUneEtiquette } from "../etiquettes/useGlisserUneEtiquette.ts";

type Props = {
  readonly chiffre: string;
  readonly choisi: boolean;
  readonly onToucher: () => void;
  readonly onSurvol: (point: Point | undefined) => void;
  readonly onLacher: (point: Point) => void;
};

/** Un chiffre à poser : il se choisit en le touchant, ou suit le doigt (ou la souris) jusqu'à une maison, puis revient à sa place. */
export function ChiffreAPoser({ chiffre, choisi, onToucher, onSurvol, onLacher }: Props) {
  const glisser = useGlisserUneEtiquette<HTMLButtonElement>({ glissable: true, onSurvol, onLacher });
  return (
    <button
      ref={glisser.ref}
      type="button"
      className="etiquette chiffre-a-poser"
      data-testid="chiffre-a-poser"
      data-etat={glisser.etat}
      aria-pressed={choisi}
      {...glisser.attributsDuGeste}
      onClick={() => glisser.estUnToucher() && onToucher()}
    >
      {chiffre}
    </button>
  );
}
