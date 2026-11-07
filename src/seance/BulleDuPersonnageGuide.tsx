import { TexteSurligne } from "./TexteSurligne.tsx";
import type { NatureDeParole } from "./usePersonnageQuiParle.ts";

type Props = {
  readonly texte: string | undefined;
  readonly nature: NatureDeParole | undefined;
  readonly rangDuMotPrononce: number | undefined;
  /** Pendant une question la bulle n'est plus dessinée (la consigne ou la question est déjà à l'écran) mais reste lue par les lecteurs d'écran. */
  readonly cachee?: boolean;
};

/** La dictée dit le mot sans l'afficher : les mots prononcés ne correspondent pas à ceux de la bulle, rien n'est surligné. */
export function BulleDuPersonnageGuide({ texte, nature, rangDuMotPrononce, cachee = false }: Props) {
  const rangASurligner = nature === "dictee" ? undefined : rangDuMotPrononce;
  return (
    <div className="bulle" aria-live="polite" data-testid="parole" data-nature={nature} data-cachee={cachee ? "true" : undefined}>
      {texte !== undefined && <TexteSurligne texte={texte} rangDuMotPrononce={rangASurligner} />}
    </div>
  );
}
