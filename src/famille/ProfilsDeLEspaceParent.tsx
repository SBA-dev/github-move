import { useId, useState } from "react";
import type { ProfilEnfant } from "@domain/famille";
import { FormulaireDeProfil } from "./FormulaireDeProfil.tsx";
import { InvitationAffichee } from "./InvitationDuPremierProfil.tsx";
import { classeEtUnivers } from "./libelle-du-profil.ts";
import { type DonneesDeProfil, profilsEcritsParLesEdgeFunctions } from "./profils/ecriture-des-profils-supabase.ts";
import type { EtatDesProfils } from "./profils/useProfilsDuParent.ts";

type Props = {
  readonly etat: EtatDesProfils;
  /** À appeler après une écriture : la liste est relue. */
  readonly onModifie: () => void;
};

const NOUVEAU_PROFIL: DonneesDeProfil = { prenom: "", niveau: "CP", univers: "animaux" };

function donneesDe(profil: ProfilEnfant): DonneesDeProfil {
  return { prenom: profil.prenom.valeur, niveau: profil.niveau.valeur, univers: profil.univers };
}

/** La section « Profils » de l'espace parent : liste, création et modification des profils enfants. */
export function ProfilsDeLEspaceParent({ etat, onModifie }: Props) {
  const titre = useId();
  const [enModification, setEnModification] = useState<string | undefined>();
  const [confirmation, setConfirmation] = useState<string | undefined>();
  const profils = etat.type === "charges" ? etat.profils : [];

  const creer = async (donnees: DonneesDeProfil) => {
    setConfirmation(undefined);
    await profilsEcritsParLesEdgeFunctions.creer(donnees);
    setConfirmation(`Le profil de ${donnees.prenom} est créé.`);
    onModifie();
  };

  const modifier = (profil: ProfilEnfant) => async (donnees: DonneesDeProfil) => {
    setConfirmation(undefined);
    await profilsEcritsParLesEdgeFunctions.modifier(profil.id.valeur, donnees);
    setEnModification(undefined);
    setConfirmation(`Le profil de ${donnees.prenom} est enregistré.`);
    onModifie();
  };

  return (
    <section className="profils-de-l-espace-parent" aria-labelledby={titre} data-testid="profils-de-l-espace-parent">
      <h3 id={titre}>Profils</h3>
      {etat.type === "chargement" && <p role="status">Chargement des profils…</p>}
      {etat.type === "indisponible" && <p role="status">Les profils ne sont pas disponibles pour l'instant. Réessaie dans un instant.</p>}
      {etat.type === "charges" && profils.length === 0 && <InvitationAffichee />}
      {profils.length > 0 && (
        <ul className="profils-enfants">
          {profils.map((profil) => (
            <li key={profil.id.valeur} data-testid="profil-enfant">
              <span className="prenom">{profil.prenom.valeur}</span>
              <span className="classe-et-univers">{classeEtUnivers(profil)}</span>
              {enModification === profil.id.valeur
                ? (
                  <FormulaireDeProfil
                    titre={`Modifier ${profil.prenom.valeur}`}
                    valeurInitiale={donneesDe(profil)}
                    libelleDuBouton="Enregistrer"
                    onEnvoyer={modifier(profil)}
                    onAnnuler={() => setEnModification(undefined)}
                  />
                )
                : (
                  <button type="button" className="secondaire" onClick={() => setEnModification(profil.id.valeur)}>
                    Modifier<span className="visuellement-cache"> le profil de {profil.prenom.valeur}</span>
                  </button>
                )}
            </li>
          ))}
        </ul>
      )}
      {confirmation && <p role="status" className="confirmation">{confirmation}</p>}
      <FormulaireDeProfil
        titre="Ajouter un enfant"
        valeurInitiale={NOUVEAU_PROFIL}
        libelleDuBouton="Créer le profil"
        onEnvoyer={creer}
        viderApresEnvoi
      />
    </section>
  );
}
