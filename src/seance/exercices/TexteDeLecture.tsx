import { motsDeLaConsigne, phrasesDesMotsAffiches, type SegmentDeConsigne } from "@domain/voix";
import { Parchemin } from "../parchemin/Parchemin.tsx";
import type { LectureDuTexte } from "../parchemin/LectureDuTexte.ts";
import { useDeroulementDuParchemin } from "../parchemin/useDeroulementDuParchemin.ts";
import { SegmentSurligne } from "../TexteSurligne.tsx";

type Props = {
  readonly titre: string | undefined;
  readonly texte: string;
  readonly rangDuMotPrononce: number | undefined;
  readonly lecture: LectureDuTexte;
  /** L'enfant a dit « J'ai écouté », ou la question est posée : plus rien à dévoiler. */
  readonly texteEcoute: boolean;
  /** Muet, voix bloquée ou absente : le texte est lu par l'enfant seul. */
  readonly voixCoupee: boolean;
};

type Phrase = { readonly rang: number; readonly segments: SegmentDeConsigne[] };

/** Les segments du texte rangés par phrase ; un bout de texte sans mot suit le mot qui le précède. */
function phrasesDuTexte(texte: string): Phrase[] {
  const rangsDePhrase = phrasesDesMotsAffiches(texte);
  const phrases: Phrase[] = [];
  for (const segment of motsDeLaConsigne(texte)) {
    const rang = segment.rang === undefined ? phrases.at(-1)?.rang ?? 0 : rangsDePhrase[segment.rang] ?? 0;
    const derniere = phrases.at(-1);
    if (derniere?.rang === rang) derniere.segments.push(segment);
    else phrases.push({ rang, segments: [segment] });
  }
  return phrases;
}

export function TexteDeLecture({ titre, texte, rangDuMotPrononce, lecture, texteEcoute, voixCoupee }: Props) {
  const rangsDePhrase = phrasesDesMotsAffiches(texte);
  const phraseLue = rangDuMotPrononce === undefined ? undefined : rangsDePhrase[rangDuMotPrononce];
  const { deroule, devoilee } = useDeroulementDuParchemin({
    rangCommence: phraseLue,
    texteEnLecture: lecture === "en-cours",
    toutOuvrir: lecture === "finie" || texteEcoute || voixCoupee,
  });
  return (
    <Parchemin deroule={deroule}>
      <article className="texte-de-lecture" data-testid="texte-de-lecture">
        {titre && <h3>{titre}</h3>}
        <p>
          {phrasesDuTexte(texte).map(({ rang, segments }) => (
            <span key={rang} className="phrase" data-testid="phrase" data-devoilee={devoilee(rang) ? "oui" : "non"}>
              {segments.map((segment, i) => <SegmentSurligne key={i} segment={segment} rangDuMotPrononce={rangDuMotPrononce} />)}
            </span>
          ))}
        </p>
      </article>
    </Parchemin>
  );
}
