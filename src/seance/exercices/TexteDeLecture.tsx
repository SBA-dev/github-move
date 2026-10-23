import { TexteSurligne } from "../TexteSurligne.tsx";

type Props = {
  readonly titre: string | undefined;
  readonly texte: string;
  readonly rangDuMotPrononce: number | undefined;
};

export function TexteDeLecture({ titre, texte, rangDuMotPrononce }: Props) {
  return (
    <article className="texte-de-lecture" data-testid="texte-de-lecture">
      {titre && <h3>{titre}</h3>}
      <p>
        <TexteSurligne texte={texte} rangDuMotPrononce={rangDuMotPrononce} />
      </p>
    </article>
  );
}
