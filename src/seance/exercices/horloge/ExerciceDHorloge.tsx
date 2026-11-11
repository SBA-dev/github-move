import type { HorlogeEnCours } from "@domain/apprentissage";
import type { HeureDeLHorloge } from "@domain/catalogue";
import { ChoixDeLaQuestion } from "../ChoixDeLaQuestion.tsx";
import { CadranDHorloge } from "./CadranDHorloge.tsx";
import { ClavierDeLHeure } from "./ClavierDeLHeure.tsx";

type Props = {
  readonly horloge: HorlogeEnCours;
  /** L'heure que montre l'horloge. */
  readonly heure: HeureDeLHorloge;
  readonly avecSecondes: boolean;
  /** La question est réussie : on la félicite avant de passer à la suivante. */
  readonly reussie: boolean;
  readonly onChoisir: (texte: string) => void;
  /** Rend `false` si l'heure écrite est impossible. */
  readonly onValider: (heures: number, minutes: number, secondes: number) => boolean;
  readonly onJeNeSaisPas: () => void;
};

/** Une horloge à aiguilles à lire : l'heure n'est écrite ni à côté, ni dans le libellé, avant que l'enfant ait répondu. */
export function ExerciceDHorloge({ horloge, heure, avecSecondes, reussie, onChoisir, onValider, onJeNeSaisPas }: Props) {
  const { mode } = horloge;
  const heureConnue = !horloge.jeNeSaisPasPropose;
  const libelle = heureConnue ? `Horloge à aiguilles : ${heure.ecriture()}` : "Horloge à aiguilles";
  return (
    <div className="horloge-a-lire" data-testid="exercice-horloge" data-mode={mode.genre}>
      <CadranDHorloge heure={heure} avecSecondes={avecSecondes} libelle={libelle} />
      {reussie && mode.genre === "clavierDeCristaux" && (
        <output className="affichage-digital" data-testid="affichage-digital">
          {heure.affichageDigital()}
        </output>
      )}
      {mode.genre === "choix"
        ? (
          <ChoixDeLaQuestion
            textes={mode.choix}
            ecartes={mode.ecartes}
            possibles={mode.choix.filter((texte) => !mode.ecartes.includes(texte))}
            reponseQuiBrille={horloge.jeNeSaisPasPropose ? undefined : mode.choix.find((texte) => !mode.ecartes.includes(texte))}
            reussie={reussie}
            bulleEclatee={undefined}
            flottantes={false}
            motQuiPart={false}
            onChoisir={onChoisir}
          />
        )
        : (
          <ClavierDeLHeure
            champs={mode.champs}
            onValider={onValider}
            chiffresQuiBrillent={reussie ? [] : [...(horloge.reponseATaper ?? "")]}
            desactive={reussie}
          />
        )}
      {horloge.jeNeSaisPasPropose && !reussie && (
        <button type="button" className="je-ne-sais-pas" data-testid="je-ne-sais-pas" onClick={onJeNeSaisPas}>
          Je ne sais pas
        </button>
      )}
    </div>
  );
}
