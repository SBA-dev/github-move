import { CARACTERES_SPECIAUX_ACCEPTES, ReglesDuMotDePasse } from "@domain/famille";

type Props = { readonly id: string; readonly motDePasse: string };

export function ListeDesReglesDuMotDePasse({ id, motDePasse }: Props) {
  return (
    <div id={id} className="regles-du-mot-de-passe" aria-live="polite">
      <p>Ton mot de passe doit avoir :</p>
      <ul>
        {ReglesDuMotDePasse.verifier(motDePasse).map(({ regle, libelle, respectee }) => (
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
    </div>
  );
}
