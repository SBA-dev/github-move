import { useId, useState } from "react";
import { enfantSuivi, type ProfilSuivi } from "@domain/accompagnement";
import { ProfilEnfantId } from "@domain/famille";
import type { ProfilEnfant } from "@domain/famille";
import type { EtatDesProfils } from "../famille/profils/useProfilsDuParent.ts";
import { CarteDesCompetences } from "./CarteDesCompetences.tsx";
import { LeconsJouees } from "./LeconsJouees.tsx";
import { useSuiviDeLEnfant } from "./useSuiviDeLEnfant.ts";

type Props = { readonly etat: EtatDesProfils };

const MESSAGE_SANS_RESEAU = "Le suivi a besoin d'Internet. Réessaie dans un instant.";

function enProfilSuivi(profil: ProfilEnfant): ProfilSuivi {
  return { id: profil.id, prenom: profil.prenom.valeur, niveau: profil.niveau };
}

function libelleDeLEnfant(profil: ProfilSuivi): string {
  return `${profil.prenom} · ${profil.niveau.valeur}`;
}

function SuiviDeLEnfant({ enfant }: { readonly enfant: ProfilSuivi }) {
  const etat = useSuiviDeLEnfant(enfant.id.valeur, enfant.prenom, enfant.niveau.valeur);
  if (etat.type === "chargement") return <p role="status">Chargement du suivi…</p>;
  if (etat.type === "indisponible") return <p role="status">{MESSAGE_SANS_RESEAU}</p>;
  const { chiffres, carte, leconsJouees } = etat.suivi;
  return (
    <>
      <dl className="chiffres-du-suivi" data-testid="chiffres-du-suivi">
        <div data-testid="chiffre">
          <dt>leçons réussies</dt>
          <dd>{chiffres.leconsReussies}</dd>
        </div>
        <div data-testid="chiffre">
          <dt>étoiles</dt>
          <dd>{chiffres.etoiles}</dd>
        </div>
        <div data-testid="chiffre">
          <dt>séances jouées</dt>
          <dd>{chiffres.seancesJouees}</dd>
        </div>
        <div data-testid="chiffre">
          <dt>erreurs corrigées pour de bon</dt>
          <dd>{chiffres.erreursCorrigeesPourDeBon}</dd>
        </div>
      </dl>
      <CarteDesCompetences carte={carte} />
      <LeconsJouees tableau={leconsJouees} />
    </>
  );
}

/** La section « Suivi » de l'espace parent : un seul enfant à la fois, le premier par ordre de création tant que le parent n'en choisit pas un autre. */
export function SuiviDeLEspaceParent({ etat }: Props) {
  const titre = useId();
  const [choix, setChoix] = useState<string | undefined>();
  const profils = etat.type === "charges" ? etat.profils.map(enProfilSuivi) : [];
  const enfant = enfantSuivi(profils, choix === undefined ? undefined : ProfilEnfantId.de(choix));

  return (
    <section className="suivi-de-l-espace-parent" aria-labelledby={titre} data-testid="suivi-de-l-espace-parent">
      <h3 id={titre}>Suivi</h3>
      {etat.type === "chargement" && <p role="status">Chargement du suivi…</p>}
      {etat.type === "indisponible" && <p role="status">{MESSAGE_SANS_RESEAU}</p>}
      {etat.type === "charges" && enfant === undefined && (
        <p>Aucun profil pour l'instant. Crée-en un dans la partie Profils.</p>
      )}
      {enfant && (
        <>
          <ul className="choix-de-l-enfant-suivi" aria-label="Choisir l'enfant" data-testid="choix-de-l-enfant-suivi">
            {profils.map((profil) => (
              <li key={profil.id.valeur}>
                <button
                  type="button"
                  className="secondaire"
                  aria-pressed={profil.id.valeur === enfant.id.valeur}
                  onClick={() => setChoix(profil.id.valeur)}
                >
                  {libelleDeLEnfant(profil)}
                </button>
              </li>
            ))}
          </ul>
          <h4 data-testid="enfant-suivi">{libelleDeLEnfant(enfant)}</h4>
          <SuiviDeLEnfant key={enfant.id.valeur} enfant={enfant} />
        </>
      )}
    </section>
  );
}
