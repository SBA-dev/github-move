import { motsDeLaConsigne } from "@domain/voix";
import { TexteEnSyllabes } from "../reglages/index.ts";
import type { Consigne } from "./consigne-preparee.ts";

function motSansPonctuation(jeton: string): string {
  return jeton.match(/[\p{L}\p{N}'’-]+/u)?.[0] ?? "";
}

type Props = { readonly consigne: Consigne; readonly rangDuMotPrononce: number | undefined };

export function ConsigneLue({ consigne, rangDuMotPrononce }: Props) {
  return (
    <p className="consigne" data-testid="consigne" lang={consigne.langue}>
      {motsDeLaConsigne(consigne.texte).map(({ texte, rang }, i) => {
        if (rang === undefined) return texte;
        const prononce = rang === rangDuMotPrononce;
        const proprietes = {
          className: "mot",
          "data-mot": rang,
          "data-prononce": prononce ? "true" : undefined,
          "aria-current": prononce ? ("true" as const) : undefined,
        };
        const mot = <TexteEnSyllabes texte={texte} />;
        return motSansPonctuation(texte) === consigne.motEnGras ? <strong key={i} {...proprietes}>{mot}</strong> : <span key={i} {...proprietes}>{mot}</span>;
      })}
    </p>
  );
}
