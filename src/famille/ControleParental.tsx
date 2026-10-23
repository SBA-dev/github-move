import { type FormEvent, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { ResultatDeLaReponse } from "@domain/famille";

type Props = {
  readonly enonce: string;
  readonly onReponse: (saisie: string) => ResultatDeLaReponse;
  readonly onRenoncer: () => void;
};

export function ControleParental({ enonce, onReponse, onRenoncer }: Props) {
  const [saisie, setSaisie] = useState("");
  const [refuse, setRefuse] = useState(false);

  const champ = useRef<HTMLInputElement>(null);
  useEffect(() => champ.current?.focus(), []);

  const valider = (evenement: FormEvent) => {
    evenement.preventDefault();
    flushSync(() => setRefuse(false));
    const resultat = onReponse(saisie);
    setRefuse(resultat === "refuse");
    setSaisie("");
  };

  return (
    <section className="controle-parental" aria-labelledby="question-controle-parental">
      <form onSubmit={valider}>
        <p id="question-controle-parental" className="consigne">Question pour un adulte : {enonce}</p>
        <input
          ref={champ}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-labelledby="question-controle-parental"
          value={saisie}
          onChange={(evenement) => setSaisie(evenement.target.value)}
        />
        <div className="actions">
          <button type="submit">Entrer</button>
          <button type="button" onClick={onRenoncer}>Renoncer</button>
        </div>
      </form>
      <div role="status">{refuse && "Ce n'est pas la bonne réponse."}</div>
    </section>
  );
}
