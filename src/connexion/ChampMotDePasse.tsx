import { useState } from "react";

type Props = {
  readonly id: string;
  readonly libelle: string;
  readonly valeur: string;
  readonly autoComplete: "current-password" | "new-password";
  readonly onChange: (valeur: string) => void;
  readonly decritPar?: string;
};

export function ChampMotDePasse({ id, libelle, valeur, autoComplete, onChange, decritPar }: Props) {
  const [affiche, setAffiche] = useState(false);
  return (
    <div className="champ-mot-de-passe">
      <label htmlFor={id}>{libelle}</label>
      <div className="champ-mot-de-passe-saisie">
        <input
          id={id}
          type={affiche ? "text" : "password"}
          autoComplete={autoComplete}
          aria-describedby={decritPar}
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="secondaire"
          aria-pressed={affiche}
          onClick={() => setAffiche(!affiche)}
        >
          Afficher le mot de passe
        </button>
      </div>
    </div>
  );
}
