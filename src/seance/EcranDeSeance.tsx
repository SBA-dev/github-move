import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChoixDeSeance,
  consigneAffichee,
  type Defi,
  type GrandDefi,
  exerciceDemandeLeSon,
  ExerciceIntrouvable,
  LeconSansExercice,
  messageDeLaDicteeSansVoix,
  Seance,
} from "@domain/apprentissage";
import { type Exercice, type Lecon, Niveau, pageDeLaLecon } from "@domain/catalogue";
import type { ValeurDuClavierDesDictees } from "@domain/famille";
import type { MeilleuresEtoilesDuProfil, Univers } from "@domain/motivation";
import { lireLaQueteAvantLaSeance, type QueteLueAvantLaSeance } from "../accueil/lire-la-quete-du-jour.ts";
import { lireLeNombreDeSeancesAvantLaSeance } from "../histoire/nombre-de-seances-avant-la-seance.ts";
import { TexteEnSyllabes, useModeDys } from "../reglages/index.ts";
import { ContexteDuRetour, EtincellesDuTexteComplet } from "../retours/index.ts";
import { TexteSurligne } from "./TexteSurligne.tsx";
import { laVoixNeLitPas, type Voix } from "../voix/index.ts";
import { BoutonReecouter } from "./BoutonReecouter.tsx";
import { BulleDuPersonnageGuide } from "./BulleDuPersonnageGuide.tsx";
import { questionAfficheeDansLaBulle } from "./questionDeLaBulle.ts";
import { PersonnageGuideEtSaScene } from "./PersonnageGuideEtSaScene.tsx";
import { EcranDeFin } from "./fin-de-seance/EcranDeFin.tsx";
import { lireLesMeilleuresEtoilesAvantLaSeance } from "./fin-de-seance/meilleures-etoiles-du-profil-lues.ts";
import { useFaciliteDeLaSeance } from "./difficulte/useFaciliteDeLaSeance.ts";
import { EmplacementDeLaBarreDAction } from "./exercices/ActionDeLExercice.tsx";
import { PauseDeLaSeance } from "./exercices/PauseDeLaSeance.ts";
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
import { BarreDuHautDeSeance } from "./BarreDuHautDeSeance.tsx";
import { FeuilleDePause } from "./FeuilleDePause.tsx";
import { useGardeDuRetour } from "../navigation.ts";
import { useDeroulementDeSeance } from "./useDeroulementDeSeance.ts";
import { usePauseDeLaSeance } from "./usePauseDeLaSeance.ts";
import { useLecon } from "./useLecon.ts";
import { useSceneDeReponseFausse } from "./useSceneDeReponseFausse.ts";

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
  /** Pendant les questions, la barre du haut de la séance remplace l'en-tête de l'application ; à la fin de la séance, l'en-tête revient. */
  readonly onBarreDuHautAffichee: (affichee: boolean) => void;
  readonly onLireLEpisode: (numero: number) => void;
  readonly onLeconSuivante: (leconId: string) => void;
  readonly onToutesLesLecons: () => void;
  /** L'enfant choisit de relever le défi que la séance vient d'ouvrir. */
  readonly onReleverLeDefi: (defi: Defi | GrandDefi) => void;
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
  const chargee = useLecon(leconId, reste.profilId);
  if (chargee.type === "chargement") return <p className="etiquette-sur-le-decor">Chargement de la leçon…</p>;
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
  if (facilite === undefined) return <p className="etiquette-sur-le-decor">Chargement de la leçon…</p>;
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
  const [nombreDeSeancesAvant] = useState(() => lireLeNombreDeSeancesAvantLaSeance(profilId));
  const [queteAvant] = useState(() => lireLaQueteAvantLaSeance(profilId, niveau));
  if (!seance) return <JeuIntrouvable onRetour={reste.onRetour} />;
  return (
    <SeanceEnCours
      seance={seance}
      lecon={lecon}
      niveau={niveau}
      meilleuresEtoilesAvant={meilleuresEtoilesAvant}
      nombreDeSeancesAvant={nombreDeSeancesAvant}
      queteAvant={queteAvant}
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
  readonly nombreDeSeancesAvant: Promise<number | undefined>;
  readonly queteAvant: Promise<QueteLueAvantLaSeance | undefined>;
};

function SeanceEnCours(
  { seance, lecon, prenom, niveau, univers, voix, toutLireAVoixHaute, meilleuresEtoilesAvant, nombreDeSeancesAvant, queteAvant, onRetour, onBarreDuHautAffichee, onRejouer, onLireLEpisode, onLeconSuivante, onToutesLesLecons, onReleverLeDefi, onAccueil }: PropsEnCours,
) {
  const pause = usePauseDeLaSeance(voix.couperLaVoix);
  const { ouverte: pauseOuverte, ouvrir: ouvrirLaPause, continuer: continuerLaLecon } = pause;
  const deroulement = useDeroulementDeSeance(seance, lecon, voix, univers.personnageGuide, toutLireAVoixHaute, prenom, pause.attendreLaFin);
  const voixCoupee = laVoixNeLitPas(voix);
  const { commencer, abandonner } = deroulement;
  useEffect(() => {
    void commencer();
    return abandonner;
  }, [commencer, abandonner]);

  const [celebrationDeLUnivers, setCelebrationDeLUnivers] = useState(false);
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
  const consigne = finie || !exerciceDeLaLecon ? undefined : consigneAffichee(exerciceDeLaLecon);
  const laConsigneEstLue = consigne !== undefined && deroulement.parole?.nature === "consigne" && deroulement.parole.texte === consigne;
  // Le chrono n'est pas lisible ici : pendant toute la fluence, aucune scène (aucun encouragement n'y est dit de toute façon).
  const dansUneFluence = exerciceDeLaLecon?.type === "fluence";
  const reponseFausse = useSceneDeReponseFausse({
    parole: deroulement.parole,
    cleUnivers: univers.cle,
    pendantLeChronoDUneFluence: dansUneFluence,
  });
  // Pendant une question, le personnage guide s'efface : la bulle prend toute la largeur. Il n'apparaît que quand il réagit, pendant les étapes de leçon et à la fin.
  const dansUneQuestion = !finie && exerciceDeLaLecon !== undefined;
  const personnageParle = !dansUneQuestion || deroulement.personnageGuideReagit || reponseFausse.enCours !== undefined;
  // Un geste muet montre le personnage guide sans toucher à la mise en page : la consigne et la question restent, la bulle n'affiche pas de parole périmée.
  const personnageMontre = personnageParle || deroulement.gesteMuet;
  const consigneMontree = personnageParle ? undefined : consigne;
  const questionDansLaBulle = consigneMontree === undefined ? undefined : questionAfficheeDansLaBulle(deroulement.parole, exerciceDeLaLecon, schema?.enonce);
  const texteDeLaBulle = consigneMontree === undefined ? deroulement.parole?.texte : questionDansLaBulle;
  const reecouterInactif = figee !== undefined ||
    (deroulement.presentationEnCours && !deroulement.personnageGuideReagit && deroulement.parole?.nature !== "consigne");
  const zoneDeLExercice = useRef<HTMLDivElement>(null);
  const laSeance = useRef<HTMLElement>(null);
  const [emplacementDeLaBarreDAction, setEmplacementDeLaBarreDAction] = useState<HTMLElement | null>(null);
  // L'écran qui arrive glisse (transform) : une barre `position: fixed` dedans le suivrait au lieu de rester au bas de l'écran. Elle est donc posée dans l'application.
  const [racineDeLApplication, setRacineDeLApplication] = useState<Element | null>(null);
  useEffect(() => setRacineDeLApplication(laSeance.current?.closest(".application") ?? null), []);
  const exerciceCommence = exerciceJoue !== undefined;
  const dejaMonte = useRef(false);
  useEffect(() => {
    if (exerciceCommence && dejaMonte.current) zoneDeLExercice.current?.focus();
    dejaMonte.current = true;
  }, [exerciceCommence]);

  const leverLaGarde = useGardeDuRetour(!finie && seance.aRecuUneReponse(), ouvrirLaPause);
  const retournerALaLecon = () => leverLaGarde(onRetour);
  const toucherRetour = () => seance.aRecuUneReponse() ? ouvrirLaPause() : retournerALaLecon();
  useEffect(() => {
    onBarreDuHautAffichee(!finie);
    return () => onBarreDuHautAffichee(false);
  }, [finie, onBarreDuHautAffichee]);

  const continuerApresLaReussite = deroulement.enfantAttendu && (
    <button
      type="button"
      className="continuer-apres-la-reussite"
      autoFocus={!finie}
      onClick={() => {
        deroulement.continuerApresLaReussite();
        if (finie) laSeance.current?.querySelector<HTMLElement>(".actions-de-fin button")?.focus();
      }}
    >
      Continuer
    </button>
  );

  const modeDys = useModeDys();
  const barreDAction = (
    <div className="barre-d-action" data-testid="barre-d-action" data-mode-dys={modeDys ? "true" : undefined} inert={pauseOuverte}>
      <div ref={setEmplacementDeLaBarreDAction} className="emplacement-de-la-barre-d-action" />
      {etape && <button type="button" onClick={() => void deroulement.continuer()}>Continuer</button>}
      {continuerApresLaReussite}
    </div>
  );

  return (
    <ContexteDuRetour.Provider value={deroulement.retour}>
      <EmplacementDeLaBarreDAction.Provider value={emplacementDeLaBarreDAction}>
        <PauseDeLaSeance.Provider value={pauseOuverte}>
          <section ref={laSeance} className="seance" aria-labelledby="titre-de-la-seance">
            <div className="contenu-de-la-seance" inert={pauseOuverte && !finie}>
              {finie
                ? (
                  <div className="entete-de-seance">
                    <button type="button" onClick={retournerALaLecon}>Retour</button>
                    <div>
                      <h2 id="titre-de-la-seance">{titre}</h2>
                      <p data-testid="niveau-et-matiere">{niveauEtMatiere}</p>
                    </div>
                  </div>
                )
                : (
                  <BarreDuHautDeSeance
                    titre={titre}
                    avancement={seance.avancement()}
                    son={voix.son}
                    onRetour={toucherRetour}
                    onBasculerLeSon={voix.basculerLeSon}
                  />
                )}
              {finie
                ? (
                  <>
                    <div className="guide-et-parole">
                      {!celebrationDeLUnivers && (
                        <PersonnageGuideEtSaScene univers={univers} humeur={deroulement.humeur} reponseFausse={reponseFausse} />
                      )}
                      <BulleDuPersonnageGuide
                        texte={deroulement.parole?.texte}
                        nature={deroulement.parole?.nature}
                        rangDuMotPrononce={deroulement.rangDuMotPrononce}
                      />
                    </div>
                    <button type="button" className="reecouter" onClick={deroulement.reecouter}>Réécouter</button>
                    <div className="consigne-de-l-exercice" aria-live="polite" />
                  </>
                )
                : (
                  <div className="guide-et-parole">
                    {personnageMontre && !celebrationDeLUnivers && (
                      <PersonnageGuideEtSaScene univers={univers} humeur={deroulement.humeur} reponseFausse={reponseFausse} />
                    )}
                    <div className="parole-et-reecouter">
                      <div className="texte-de-la-bulle">
                        <div className="consigne-de-l-exercice" aria-live="polite">
                          {consigneMontree !== undefined && (
                            <p className="consigne" data-testid="consigne">
                              <TexteSurligne
                                texte={consigneMontree}
                                rangDuMotPrononce={laConsigneEstLue ? deroulement.rangDuMotPrononce : undefined}
                              />
                            </p>
                          )}
                        </div>
                        <BulleDuPersonnageGuide
                          texte={texteDeLaBulle}
                          nature={deroulement.parole?.nature}
                          rangDuMotPrononce={deroulement.rangDuMotPrononce}
                        />
                      </div>
                      <BoutonReecouter inactif={reecouterInactif} onReecouter={deroulement.reecouter} />
                    </div>
                  </div>
                )}
              {etape && (
                <div className="etape-de-lecon" data-testid="etape-de-lecon">
                  {etape.exemples.length > 0 && (
                    <ul className="exemples" aria-label="Exemples">
                      {etape.exemples.map((exemple, i) => <li key={i} className="pastille" data-testid="exemple"><TexteEnSyllabes texte={exemple} /></li>)}
                    </ul>
                  )}
                </div>
              )}
              <div className="annonce-d-avancement" role="status" data-testid="annonce-d-avancement">
                {deroulement.avancementAnnonce}
              </div>
              {finie && (
                <EcranDeFin
                  seance={seance}
                  univers={univers}
                  niveau={niveau}
                  onDireLaFin={deroulement.direLaFin}
                  meilleuresEtoilesAvant={meilleuresEtoilesAvant}
                  nombreDeSeancesAvant={nombreDeSeancesAvant}
                  queteAvant={queteAvant}
                  prenom={prenom}
                  onRejouer={onRejouer}
                  onLireLEpisode={onLireLEpisode}
                  onLeconSuivante={onLeconSuivante}
                  onToutesLesLecons={onToutesLesLecons}
                  onReleverLeDefi={onReleverLeDefi}
                  onAccueil={onAccueil}
                  onCelebrationDeLUnivers={setCelebrationDeLUnivers}
                />
              )}
              {!finie && position !== undefined && exerciceDeLaLecon && (
                <div ref={zoneDeLExercice} tabIndex={-1} className="exercice-en-cours" data-testid="exercice-en-cours" data-position={position}>
                  <EtincellesDuTexteComplet />
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
                      lectureDuTexte={deroulement.lectureDuTexte}
                      voixCoupee={voixCoupee}
                      sonImpossible={voix.son === "muet" || !voix.voixPresente}
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
                      recordBattu={deroulement.recordBattu}
                      recordDeDepart={deroulement.recordDeDepart}
                      onDemarrer={deroulement.demarrerLaFluence}
                      onValider={(nombre) => void deroulement.repondreParUnNombre(nombre)}
                    />
                  )}
                  {exerciceDeLaLecon.type === "addition" && addition && (
                    <ExerciceDAdditionPosee
                      addition={addition}
                      reussie={figee !== undefined}
                      colonneQuiBrille={deroulement.colonneQuiBrille}
                      departsDesRetenues={deroulement.departsDesRetenues}
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
                      voixCoupee={voixCoupee}
                      felicitationFinie={deroulement.felicitationDuDernierVersFinie}
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
              {finie ? continuerApresLaReussite : racineDeLApplication ? createPortal(barreDAction, racineDeLApplication) : barreDAction}
            </div>
            {pauseOuverte && !finie && <FeuilleDePause onContinuer={continuerLaLecon} onRetourALaLecon={retournerALaLecon} />}
          </section>
        </PauseDeLaSeance.Provider>
      </EmplacementDeLaBarreDAction.Provider>
    </ContexteDuRetour.Provider>
  );
}
