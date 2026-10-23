import type { ProfilEnfant } from "@domain/famille";
import { universDe } from "@domain/motivation";
import { PersonnageGuide } from "../univers/index.ts";
import { InvitationDuPremierProfil } from "./InvitationDuPremierProfil.tsx";
import { classeEtUnivers } from "./libelle-du-profil.ts";
import type { EtatDesProfils } from "./profils/useProfilsDuParent.ts";
import type { Voix } from "../voix/index.ts";

type Props = {
  readonly etat: EtatDesProfils;
  readonly voix: Voix;
  readonly onChoisir: (profil: ProfilEnfant) => void;
  /** Ajouter un enfant se fait dans l'espace parent : le contrôle parental est demandé. */
  readonly onAjouterUnEnfant: () => void;
};

function Message({ etat }: { readonly etat: Exclude<EtatDesProfils, { type: "charges" }> }) {
  return etat.type === "chargement"
    ? <p role="status">Chargement des profils…</p>
    : <p role="status">Les profils ne sont pas encore sur cet appareil. Connecte-toi une première fois avec du réseau.</p>;
}

/** « Qui joue ? » : les profils du parent connecté, dans l'ordre de création, en grandes cibles. */
export function QuiJoue({ etat, voix, onChoisir, onAjouterUnEnfant }: Props) {
  const profils = etat.type === "charges" ? etat.profils : [];
  return (
    <section className="qui-joue" aria-labelledby="titre-qui-joue" data-testid="qui-joue">
      <h2 id="titre-qui-joue">Qui joue aujourd'hui ?</h2>
      {etat.type !== "charges" && <Message etat={etat} />}
      {etat.type === "charges" && profils.length === 0 && <InvitationDuPremierProfil voix={voix} />}
      {profils.length > 0 && (
        <ul className="profils-a-choisir">
          {profils.map((profil) => (
            <li key={profil.id.valeur}>
              <button type="button" className="profil-a-choisir" data-testid="profil-a-choisir" onClick={() => onChoisir(profil)}>
                <PersonnageGuide univers={universDe(profil.univers)} humeur="content" />
                <span className="prenom">{profil.prenom.valeur}</span>
                <span className="classe-et-univers">{classeEtUnivers(profil)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="secondaire" onClick={onAjouterUnEnfant}>+ Ajouter un enfant</button>
    </section>
  );
}
