import { createContext, useContext } from "react";
import { syllabesDuTexte } from "@domain/voix";

/** Le mode dys du profil en cours, jamais une préférence de l'appareil. */
const ModeDysContexte = createContext(false);

export const ModeDys = ModeDysContexte.Provider;

export function useModeDys(): boolean {
  return useContext(ModeDysContexte);
}

/** Un texte affiché tel quel ; en mode dys, les syllabes des mots de plus de trois lettres sont en couleurs alternées. */
export function TexteEnSyllabes({ texte }: { readonly texte: string }) {
  const modeDys = useModeDys();
  if (!modeDys) return <>{texte}</>;
  return (
    <>
      {syllabesDuTexte(texte).map(({ texte: segment, syllabes }, i) =>
        syllabes && syllabes.length > 1
          ? (
            <span key={i} className="mot-en-syllabes" data-testid="mot-en-syllabes">
              {syllabes.map((syllabe, rang) => (
                <span key={rang} className="syllabe" data-parite={rang % 2}>{syllabe}</span>
              ))}
            </span>
          )
          : segment
      )}
    </>
  );
}
