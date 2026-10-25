import { useEffect, useRef, useState } from "react";
import {
  ChoixDeSeance,
  exerciceDemandeLeSon,
  ExerciceIntrouvable,
  LeconSansExercice,
  messageDeLaDicteeSansVoix,
  Seance,
} from "@domain/apprentissage";
import { type Exercice, type Lecon, Niveau, pageDeLaLecon } from "@domain/catalogue";
import type { ValeurDuClavierDesDictees } from "@domain/famille";
import type { MeilleuresEtoilesDuProfil, Univers } from "@domain/motivation";
import { TexteEnSyllabes } from "../reglages/index.ts";
import { PersonnageGuide } from "../univers/index.ts";
import type { Voix } from "../voix/index.ts";
import { BulleDuPersonnageGuide } from "./BulleDuPersonnageGuide.tsx";
import { EcranDeFin } from "./fin-de-seance/EcranDeFin.tsx";
import { lireLesMeilleuresEtoilesAvantLaSeance } from "./fin-de-seance/meilleures-etoiles-pour-la-cabane.ts";
import { useFaciliteDeLaSeance } from "./difficulte/useFaciliteDeLaSeance.ts";
import { ExerciceDAdditionPosee } from "./exercices/addition/ExerciceDAdditionPosee.tsx";
import { ExerciceAChoix } from "./exercices/ExerciceAChoix.tsx";
import { ExerciceAEtiquettes } from "./exercices/ExerciceAEtiquettes.tsx";
import { BoiteAJetons } from "./exercices/boite/BoiteAJetons.tsx";
import { SchemaDuProbleme } from "./exercices/schema/SchemaDuProbleme.tsx";
import { ExerciceDeCalcul } from "./exercices/ExerciceDeCalcul.tsx";
import { ExerciceDeDictee } from "./exercices/ExerciceDeDictee.tsx";
import { ExerciceDeFluence } from "./exercices/fluence/ExerciceDeFluence.tsx";
import { ExerciceDeMemorisation } from "./exercices/ExerciceDeMemorisation.tsx";
import { etatDeLaVoix } from "./etat-de-la-voix.ts";
import { generateurIdDuNavigateur } from "./generateur-id-navigateur.ts";
import { hasardDuNavigateur } from "./hasard-navigateur.ts";
import { horlogeDuNavigateur } from "./horloge.ts";
import { RecipientDeProgression } from "./RecipientDeProgression.tsx";
import { useDeroulementDeSeance } from "./useDeroulementDeSeance.ts";
import { useLecon } from "./useLecon.ts";

type Props = {
  readonly leconId: string;
  /** Sans position : la séance complète ; avec une position : un seul exercice. */
  readonly exercice: number | undefined;
  /** Identifiant du profil enfant en cours : la séance lui appartient. */
  readonly profilId: string;
  readonly prenom: string;
  /** Niveau du profil en cours : la fin de séance propose la leçon suivante de son parcours ; en « automatique », il décide du clavier des dictées. */
  readonly niveau: string;
  readonly univers: Univers;
  readonly voix: Voix;
  /** Réglage du profil en cours : les choix proposés sont lus après la question. */
  readonly toutLireAVoixHaute: boolean;
  /** Réglage du profil en cours : le clavier proposé pour écrire les mots dictés. */
  readonly clavierDesDictees: ValeurDuClavierDesDictees;
  readonly onRetour: () => void;
  readonly onLeconSuivante: (leconId: string) => void;
  readonly onAccueil: () => void;
};

function commencerLaSeance(
  profilId: string,
  lecon: Lecon,
  exercice: number | undefined,
  facilite: number,
  clavierDesDictees: ValeurDuClavierDesDictees,
  niveau: string,
): Seance | undefined {
  const choix = exercice === undefined ? ChoixDeSeance.complete() : ChoixDeSeance.unExercice(exercice);
  const profil = { clavierDesDictees, niveau: Niveau.de(niveau).valeur };
  try {
    return Seance.commencer(generateurIdDuNavigateur, hasardDuNavigateur, profilId, lecon, choix, facilite, profil);
  } catch (erreur) {
    if (erreur instanceof ExerciceIntrouvable || erreur instanceof LeconSansExercice) return undefined;
    throw erreur;
  }
}

export function EcranDeSeance({ leconId, ...reste }: Props) {
  const chargee = useLecon(leconId);
  if (chargee.type === "chargement") return <p>Chargement de la leçon…</p>;
  if (chargee.type === "introuvable") return <JeuIntrouvable onRetour={reste.onRetour} />;
  return <SeanceDeLaLecon lecon={chargee.lecon} {...reste} />;
}

function JeuIntrouvable({ onRetour }: { readonly onRetour: () => void }) {
  return (
    <section className="seance">
      <h2>Jeu introuvable</h2>
      <p>Ce jeu n'est pas dans la leçon.</p>
      <button type="button" onClick={onRetour}>Retour</button>
    </section>
  );
}

type PropsDeLaLecon = Omit<Props, "leconId"> & { readonly lecon: Lecon };

function SeanceDeLaLecon({ lecon, exercice, profilId, ...reste }: PropsDeLaLecon) {
  const [numeroDeLaPartie, setNumeroDeLaPartie] = useState(0);
  return (
    <UnePartie
      key={numeroDeLaPartie}
      lecon={lecon}
      exercice={exercice}
      profilId={profilId}
      onRejouer={() => setNumeroDeLaPartie((numero) => numero + 1)}
      {...reste}
    />
  );
}

type PropsDUnePartie = PropsDeLaLecon & { readonly onRejouer: () => void };

function UnePartie({ lecon, exercice, profilId, ...reste }: PropsDUnePartie) {
  const facilite = useFaciliteDeLaSeance(profilId, lecon);
  if (facilite === undefined) return <p>Chargement de la leçon…</p>;
  return <PartieCommencee lecon={lecon} exercice={exercice} profilId={profilId} facilite={facilite} {...reste} />;
}

type PropsDeLaPartieCommencee = PropsDUnePartie & { readonly facilite: number };

function PartieCommencee(
  { lecon, exercice, profilId, facilite, clavierDesDictees, niveau, ...reste }: PropsDeLaPartieCommencee,
) {
  const [seance] = useState(() =>
    commencerLaSeance(profilId, lecon, exercice, facilite, clavierDesDictees, niveau)
  );
  const [meilleuresEtoilesAvant] = useState(() => lireLesMeilleuresEtoilesAvantLaSeance(profilId));
  if (!seance) return <JeuIntrouvable onRetour={reste.onRetour} />;
  return (
    <SeanceEnCours
      seance={seance}
      lecon={lecon}
      niveau={niveau}
      meilleuresEtoilesAvant={meilleuresEtoilesAvant}
      {...reste}
    />
  );
}

function estAChoix(exercice: Exercice): boolean {
  return exercice.type === "bulles" || exercice.type === "lecture" || exercice.type === "ecoute" ||
    exercice.type === "trous" || exercice.type === "conjugaison";
}

type PropsEnCours = Omit<PropsDUnePartie, "exercice" | "profilId" | "clavierDesDictees"> & {
  readonly seance: Seance;
  readonly meilleuresEtoilesAvant: Promise<MeilleuresEtoilesDuProfil | undefined>;
};

function SeanceEnCours(
  { seance, lecon, prenom, niveau, univers, voix, toutLireAVoixHaute, meilleuresEtoilesAvant, onRetour, onRejouer, onLeconSuivante, onAccueil }: PropsEnCours,
) {
  const deroulement = useDeroulementDeSeance(seance, lecon, voix, univers.personnageGuide, toutLireAVoixHaute, prenom);
  const { commencer, abandonner } = deroulement;
  useEffect(() => {
    void commencer();
    return abandonner;
  }, [commencer, abandonner]);

  const { titre, niveauEtMatiere } = pageDeLaLecon(lecon);
  const etape = seance.etapeDeLeconEnCours();
  const exerciceJoue = seance.exerciceEnCours();
  const { figee } = deroulement;
  const finie = seance.estFinie() && figee === undefined;
  const position = figee?.position ?? exerciceJoue?.position;
  const exerciceDeLaLecon = position === undefined ? undefined : lecon.exercices[position];
  const exerciceAffiche = figee?.exercice ?? exerciceJoue;
  const question = figee === undefined ? exerciceJoue?.questionEnCours() : figee.question;
  const calcul = deroulement.calculFige ?? seance.calculEnCours();
  const boite = deroulement.boiteReussie?.enCours ?? seance.boiteEnCours();
  const schema = deroulement.schemaReussi?.enCours ?? seance.schemaEnCours();
  const fluence = deroulement.fluenceFinie ?? seance.fluenceEnCours(horlogeDuNavigateur.maintenant());
  const addition = deroulement.additionFigee ?? seance.additionEnCours();
  const zoneDeLExercice = useRef<HTMLDivElement>(null);
  const exerciceCommence = exerciceJoue !== undefined;
  const dejaMonte = useRef(false);
  useEffect(() => {
    if (exerciceCommence && dejaMonte.current) zoneDeLExercice.current?.focus();
    dejaMonte.current = true;
  }, [exerciceCommence]);

  return (
    <section className="seance" aria-labelledby="titre-de-la-seance">
      <div className="entete-de-seance">
        <button type="button" onClick={onRetour}>Retour</button>
        <div>
          <h2 id="titre-de-la-seance">{titre}</h2>
          <p data-testid="niveau-et-matiere">{niveauEtMatiere}</p>
        </div>
      </div>
      {!finie && <RecipientDeProgression avancement={seance.avancement()} />}
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={deroulement.humeur} />
        <BulleDuPersonnageGuide
          texte={deroulement.parole?.texte}
          nature={deroulement.parole?.nature}
          rangDuMotPrononce={deroulement.rangDuMotPrononce}
        />
      </div>
      <button type="button" className="reecouter" onClick={deroulement.reecouter} aria-disabled={deroulement.figee !== undefined ? true : undefined}>
        Réécouter
      </button>
      {etape && (
        <div className="etape-de-lecon" data-testid="etape-de-lecon">
          {etape.exemples.length > 0 && (
            <ul className="exemples" aria-label="Exemples">
              {etape.exemples.map((exemple, i) => <li key={i} className="pastille" data-testid="exemple"><TexteEnSyllabes texte={exemple} /></li>)}
            </ul>
          )}
          <button type="button" onClick={() => void deroulement.continuer()}>Continuer</button>
        </div>
      )}
      <div className="annonce-d-avancement" role="status" data-testid="annonce-d-avancement">
        {deroulement.avancementAnnonce}
      </div>
      {finie && (
        <EcranDeFin
          seance={seance}
          niveau={niveau}
          onDireLaFin={deroulement.direLaFin}
          meilleuresEtoilesAvant={meilleuresEtoilesAvant}
          onRejouer={onRejouer}
          onLeconSuivante={onLeconSuivante}
          onAccueil={onAccueil}
        />
      )}
      {!finie && position !== undefined && exerciceDeLaLecon && (
        <div ref={zoneDeLExercice} tabIndex={-1} className="exercice-en-cours" data-testid="exercice-en-cours" data-position={position}>
          {estAChoix(exerciceDeLaLecon) && (
            <ExerciceAChoix
              exercice={exerciceDeLaLecon}
              question={question}
              texteATrous={exerciceAffiche?.texteATrous() ?? []}
              phraseDuTrouEnCours={exerciceAffiche?.questionEnCours()?.enonce}
              tableauDeConjugaison={exerciceAffiche?.tableauDeConjugaison() ?? []}
              choixVisibles={question !== undefined && deroulement.choixVisiblesPour === question}
              reussie={figee !== undefined}
              bulleEclatee={deroulement.bulleEclatee}
              texteEcoute={deroulement.positionDuTexteEcoute === position}
              rangDuMotDuTexte={deroulement.rangDuMotDuTexte}
              sonImpossible={voix.son === "muet" || !voix.syntheseVocalePresente}
              sonCoupe={voix.son === "muet"}
              onChoisir={(texte) => void deroulement.repondre(texte)}
              onRelireLaQuestion={() => void deroulement.relireLaQuestion()}
              onJeNeSaisPas={() => void deroulement.jeNeSaisPas()}
              onEcouterLeMot={() => void deroulement.ecouterLeMot()}
              onJAiEcoute={() => void deroulement.jAiEcoute()}
              onActiverLeSon={voix.basculerLeSon}
            />
          )}
          {exerciceDeLaLecon.type === "calcul" && calcul && (
            <ExerciceDeCalcul
              calcul={calcul}
              reussi={figee !== undefined}
              onRelire={() => deroulement.relireLaPhrase(calcul.phrase)}
              onChoisir={(texte) => void deroulement.choisirUneReponseDeCalcul(texte)}
              onValider={(nombre) => void deroulement.repondreParUnNombre(nombre)}
              onJeNeSaisPas={() => void deroulement.jeNeSaisPasALaQuestion()}
            />
          )}
          {exerciceDeLaLecon.type === "boite" && boite && (
            <BoiteAJetons
              boite={boite}
              item={exerciceDeLaLecon.items[exerciceAffiche?.rangDeLaQuestionEnCours ?? 0]}
              phrasesDites={deroulement.phrasesDitesDeLaQuestion}
              ouverte={deroulement.boiteReussie?.ouverte}
              onChoisir={(texte) => void deroulement.choisirUneReponseDeCalcul(texte)}
              onValider={(nombre) => void deroulement.repondreParUnNombre(nombre)}
              onJeNeSaisPas={() => void deroulement.jeNeSaisPasALaQuestion()}
            />
          )}
          {exerciceDeLaLecon.type === "barres" && schema && (
            <SchemaDuProbleme
              schema={schema}
              resolu={deroulement.schemaReussi?.resolu}
              phrasesDites={deroulement.phrasesDitesDeLaQuestion}
              reussi={deroulement.schemaReussi !== undefined}
              onChoisir={(texte) => void deroulement.choisirUneReponseDeCalcul(texte)}
              onValider={(nombre) => void deroulement.repondreParUnNombre(nombre)}
              onJeNeSaisPas={() => void deroulement.jeNeSaisPasALaQuestion()}
            />
          )}
          {exerciceDeLaLecon.type === "fluence" && fluence && (
            <ExerciceDeFluence
              fluence={fluence}
              onDemarrer={deroulement.demarrerLaFluence}
              onValider={(nombre) => void deroulement.repondreParUnNombre(nombre)}
            />
          )}
          {exerciceDeLaLecon.type === "addition" && addition && (
            <ExerciceDAdditionPosee
              addition={addition}
              reussie={figee !== undefined}
              colonneQuiBrille={deroulement.colonneQuiBrille}
              onPoser={(chiffre, rang) => void deroulement.poserUnChiffre(chiffre, rang)}
              onRelire={deroulement.relireLaPhrase}
              onChoisir={(texte) => void deroulement.choisirUneReponseDeCalcul(texte)}
              onValider={(nombre) => void deroulement.repondreParUnNombre(nombre)}
              onJeNeSaisPas={(chiffre) => void deroulement.jeNeSaisPasDeLAddition(chiffre)}
            />
          )}
          {exerciceDeLaLecon.type === "dictee" && (
            <ExerciceDeDictee
              question={figee?.questionDeDictee ?? seance.questionDeDicteeEnCours()}
              lettresFausses={deroulement.lettresFausses}
              toucheQuiBrille={deroulement.toucheQuiBrille}
              reussie={figee !== undefined}
              messageSansVoix={exerciceDemandeLeSon(exerciceDeLaLecon.type) ? messageDeLaDicteeSansVoix(etatDeLaVoix(voix)) : undefined}
              sonCoupe={voix.son === "muet"}
              onRelire={deroulement.relireLaDictee}
              onReecouterLeMot={() => void deroulement.reecouterLeMot()}
              onEcouterPlusLentement={() => void deroulement.reecouterLeMotPlusLentement()}
              onTaper={(lettre) => void deroulement.taper(lettre)}
              onEffacer={deroulement.effacer}
              onJeNeSaisPas={() => void deroulement.jeNeSaisPasEnDictee()}
              onActiverLeSon={voix.basculerLeSon}
            />
          )}
          {(exerciceDeLaLecon.type === "classer" || exerciceDeLaLecon.type === "ordre") && (
            <ExerciceAEtiquettes
              exercice={exerciceDeLaLecon}
              etiquettesAPlacer={exerciceAffiche?.etiquettesAPlacer() ?? []}
              etiquettesPosees={exerciceAffiche?.etiquettesPosees() ?? []}
              etiquetteViseeParJeNeSaisPas={(choisie) => exerciceAffiche?.etiquetteViseeParJeNeSaisPas(choisie)}
              bonnesReponsesMontrees={deroulement.bonnesReponsesMontrees}
              onPoser={(etiquette, groupe) => void deroulement.placer(etiquette, groupe)}
              onJeNeSaisPas={(etiquette) => void deroulement.jeNeSaisPasDUneEtiquette(etiquette)}
            />
          )}
          {exerciceDeLaLecon.type === "memoriser" && (
            <ExerciceDeMemorisation
              exercice={exerciceDeLaLecon}
              temps={deroulement.tempsDeLaMemorisation(position)}
              versLu={deroulement.versLu}
              exerciceJoue={exerciceAffiche}
              question={question}
              choixVisibles={question !== undefined && deroulement.choixVisiblesPour === question}
              reussie={figee !== undefined}
              bulleEclatee={deroulement.bulleEclatee}
              bonnesReponsesMontrees={deroulement.bonnesReponsesMontrees}
              onJeSuisPret={() => void deroulement.jeSuisPret()}
              onPoser={(etiquette) => void deroulement.placer(etiquette)}
              onChoisir={(texte) => void deroulement.repondre(texte)}
              onRelireLaQuestion={() => void deroulement.relireLaQuestion()}
              onJeNeSaisPasDUneEtiquette={(etiquette) => void deroulement.jeNeSaisPasDUneEtiquette(etiquette)}
              onJeNeSaisPas={() => void deroulement.jeNeSaisPas()}
            />
          )}
        </div>
      )}
    </section>
  );
}
