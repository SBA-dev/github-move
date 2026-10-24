import { useEffect, useRef, useState } from "react";
import { CARACTERES_SPECIAUX_ACCEPTES, ReglesDuMotDePasse } from "@domain/famille";

type Props = { readonly id: string; readonly motDePasse: string };

type Verification = ReturnType<typeof ReglesDuMotDePasse.verifier>[number];

function annonceDesChangements(avant: readonly Verification[], apres: readonly Verification[]): string {
  return apres
    .filter(({ regle, respectee }) => avant.find((ancienne) => ancienne.regle === regle)?.respectee !== respectee)
    .map(({ libelle, respectee }) => `${libelle} : ${respectee ? "au vert" : "à faire"}`)
    .join(". ");
}

export function ListeDesReglesDuMotDePasse({ id, motDePasse }: Props) {
  const regles = ReglesDuMotDePasse.verifier(motDePasse);
  const precedentes = useRef(regles);
  const [annonce, setAnnonce] = useState("");

  useEffect(() => {
    const reglesActuelles = ReglesDuMotDePasse.verifier(motDePasse);
    setAnnonce(annonceDesChangements(precedentes.current, reglesActuelles));
    precedentes.current = reglesActuelles;
  }, [motDePasse]);

  return (
    <div id={id} className="regles-du-mot-de-passe">
      <p>Ton mot de passe doit avoir :</p>
      <ul>
        {regles.map(({ regle, libelle, respectee }) => (
          <li key={regle} data-regle={regle} data-respectee={respectee} className={respectee ? "respectee" : undefined}>
            <span aria-hidden="true">{respectee ? "✓" : "○"}</span> {libelle}
            <span className="visuellement-cache">{respectee ? " : au vert" : " : à faire"}</span>
            {regle === "unCaractereSpecial" && (
              <span className="caracteres-acceptes">
                {" "}: {[...CARACTERES_SPECIAUX_ACCEPTES].join(" ")}
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="visuellement-cache" aria-live="polite" data-testid="annonce-des-regles">{annonce}</p>
    </div>
  );
}
