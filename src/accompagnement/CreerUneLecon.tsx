import { type FormEvent, useId, useState } from "react";
import { libelleDuType, type Matiere, Niveau, toutesLesMatieres } from "@domain/catalogue";
import type { ProfilEnfant } from "@domain/famille";
import {
  AucuneCitationDansLaSection,
  AucuneSectionDuProgramme,
  LeconImpossibleAPreparer,
  type LeconPreparee,
  preparerUneLeconPersonnelle,
  TexteTropCourt,
  TexteTropLong,
} from "@domain/accompagnement";
import { chargerLesSectionsDuProgramme } from "../seance/bibliotheque.ts";
import { EcritureDeLeconRefusee, leconsPersonnellesEcritesParLesEdgeFunctions } from "./ecriture-des-lecons-personnelles.ts";
import { AUCUN_ENFANT, messageApresEnregistrement, PREPARATION_IMPOSSIBLE, PROGRAMME_INDISPONIBLE } from "./textes-des-lecons-personnelles.ts";

const JE_NE_SAIS_PAS = "Je ne sais pas";

type Props = {
  readonly profils: readonly ProfilEnfant[];
};

type Apercu = { readonly preparee: LeconPreparee; readonly demande: { readonly profil: ProfilEnfant; readonly texte: string; readonly classe: string; readonly matiere: string } };

function messageDeLErreur(erreur: unknown): string {
  const metier = erreur instanceof TexteTropCourt || erreur instanceof TexteTropLong || erreur instanceof LeconImpossibleAPreparer ||
    erreur instanceof AucuneSectionDuProgramme || erreur instanceof AucuneCitationDansLaSection;
  return metier && erreur instanceof Error ? erreur.message : PREPARATION_IMPOSSIBLE;
}

/** L'onglet « Créer une leçon » : l'aperçu est calculé ici par le domaine, sans réseau ; seul l'enregistrement passe par le serveur. */
export function CreerUneLecon({ profils }: Props) {
  const identifiant = useId();
  const [enfantChoisi, setEnfantChoisi] = useState<string | undefined>();
  const [classeChoisie, setClasseChoisie] = useState<string | undefined>();
  const [matiere, setMatiere] = useState("");
  const [texte, setTexte] = useState("");
  const [apercu, setApercu] = useState<Apercu | undefined>();
  const [erreur, setErreur] = useState<string | undefined>();
  const [confirmation, setConfirmation] = useState<string | undefined>();
  const [enCours, setEnCours] = useState(false);

  const enfant = profils.find(({ id }) => id.valeur === enfantChoisi) ?? profils[0];
  if (enfant === undefined) return <p>{AUCUN_ENFANT}</p>;
  const classe = classeChoisie ?? enfant.niveau.valeur;

  const modifier = (changement: () => void) => {
    changement();
    setApercu(undefined);
    setErreur(undefined);
    setConfirmation(undefined);
  };

  const preparer = async (evenement: FormEvent) => {
    evenement.preventDefault();
    setApercu(undefined);
    setErreur(undefined);
    setConfirmation(undefined);
    setEnCours(true);
    try {
      const sections = await chargerLesSectionsDuProgramme();
      if (sections === undefined) {
        setErreur(PROGRAMME_INDISPONIBLE);
        return;
      }
      const choisie: Matiere | undefined = toutesLesMatieres().find(({ code }) => code === matiere);
      const preparee = preparerUneLeconPersonnelle({ texte, niveau: Niveau.de(classe), ...(choisie ? { matiere: choisie } : {}) }, [
        ...sections,
      ]);
      setApercu({ preparee, demande: { profil: enfant, texte, classe, matiere } });
    } catch (cause) {
      setErreur(messageDeLErreur(cause));
    } finally {
      setEnCours(false);
    }
  };

  const enregistrer = async () => {
    if (apercu === undefined) return;
    const { profil, texte: texteDemande, classe: niveau, matiere: matiereDemandee } = apercu.demande;
    setErreur(undefined);
    setEnCours(true);
    try {
      await leconsPersonnellesEcritesParLesEdgeFunctions.creer({
        profil: profil.id.valeur,
        texte: texteDemande,
        niveau,
        ...(matiereDemandee === "" ? {} : { matiere: matiereDemandee }),
      });
      setApercu(undefined);
      setConfirmation(messageApresEnregistrement(profil.prenom.valeur));
    } catch (cause) {
      setErreur(cause instanceof EcritureDeLeconRefusee ? cause.message : PREPARATION_IMPOSSIBLE);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="creer-une-lecon">
      <form className="formulaire-de-lecon" aria-label="Créer une leçon" onSubmit={preparer} noValidate>
        {profils.length > 1
          ? (
            <>
              <label htmlFor={`${identifiant}-enfant`}>Enfant</label>
              <select
                id={`${identifiant}-enfant`}
                value={enfant.id.valeur}
                onChange={(evenement) =>
                  modifier(() => {
                    setEnfantChoisi(evenement.target.value);
                    setClasseChoisie(undefined);
                  })}
              >
                {profils.map(({ id, prenom }) => <option key={id.valeur} value={id.valeur}>{prenom.valeur}</option>)}
              </select>
            </>
          )
          : <p>Pour {enfant.prenom.valeur}</p>}
        <label htmlFor={`${identifiant}-classe`}>Classe</label>
        <select
          id={`${identifiant}-classe`}
          value={classe}
          onChange={(evenement) => modifier(() => setClasseChoisie(evenement.target.value))}
        >
          {Niveau.tous().map(({ valeur }) => <option key={valeur} value={valeur}>{valeur}</option>)}
        </select>
        <label htmlFor={`${identifiant}-matiere`}>Matière</label>
        <select id={`${identifiant}-matiere`} value={matiere} onChange={(evenement) => modifier(() => setMatiere(evenement.target.value))}>
          <option value="">{JE_NE_SAIS_PAS}</option>
          {toutesLesMatieres().map(({ code, libelle }) => <option key={code} value={code}>{libelle}</option>)}
        </select>
        <label htmlFor={`${identifiant}-texte`}>Texte</label>
        <textarea
          id={`${identifiant}-texte`}
          rows={6}
          placeholder="Exemple : maison, poisson, garçon, leçon, ballon"
          value={texte}
          onChange={(evenement) => modifier(() => setTexte(evenement.target.value))}
        />
        <button type="submit" disabled={enCours}>Préparer la leçon</button>
      </form>
      {erreur && <p role="alert" className="message-erreur">{erreur}</p>}
      {confirmation && (
        <p role="status" className="confirmation" data-testid="lecon-enregistree">
          <strong>Enregistrée ✓</strong> {confirmation}
        </p>
      )}
      {apercu && <ApercuDeLaLecon apercu={apercu} enCours={enCours} onEnregistrer={enregistrer} />}
    </div>
  );
}

type PropsApercu = { readonly apercu: Apercu; readonly enCours: boolean; readonly onEnregistrer: () => void };

function ApercuDeLaLecon({ apercu: { preparee, demande }, enCours, onEnregistrer }: PropsApercu) {
  const { lecon, section, ecartes } = preparee;
  return (
    <section className="apercu-de-la-lecon" aria-label="Aperçu de la leçon" data-testid="apercu-de-la-lecon">
      <h4 data-testid="titre-de-l-apercu">{lecon.titre}</h4>
      <p data-testid="niveau-et-matiere-de-l-apercu">{lecon.niveau.valeur} · {lecon.matiere.libelle} · préparée sans IA</p>
      <p data-testid="section-de-l-apercu">{section.domaine} : {section.section}</p>
      <blockquote data-testid="citation-de-l-apercu">{lecon.programme.citation}</blockquote>
      {ecartes.length > 0 && <p data-testid="mots-ecartes">Mots écartés : {ecartes.join(", ")}</p>}
      <ul className="exercices-de-l-apercu" aria-label="Exercices de la leçon">
        {lecon.exercices.map((exercice, rang) => (
          <li key={rang} data-testid="exercice-de-l-apercu">
            <span className="libelle-du-type">{libelleDuType(exercice.type)}</span> <span className="intitule">{exercice.titre}</span>
          </li>
        ))}
      </ul>
      <button type="button" disabled={enCours} onClick={onEnregistrer}>Enregistrer pour {demande.profil.prenom.valeur}</button>
    </section>
  );
}
