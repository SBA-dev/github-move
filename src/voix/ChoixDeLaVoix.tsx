import { ChoixDeVoix, voixFrancaisesTriees, voixMontreeCommeChoisie, voixProposees } from "@domain/voix";
import type { Voix } from "./useVoix.ts";

type Props = { readonly voix: Voix };

type LigneDeVoix = {
  readonly id: string;
  readonly nom: string;
  readonly choix: ChoixDeVoix;
  readonly mention: string | undefined;
  readonly choisie: boolean;
};

function lignesDeVoix(voix: Voix): LigneDeVoix[] {
  const montreeCommeChoisie = voixMontreeCommeChoisie(voix.voixDisponibles, voix.choixDeVoix);
  const nomDeLaVoixChoisie = montreeCommeChoisie === "automatique" ? "" : montreeCommeChoisie.nom;
  return voixProposees(voix.voixDisponibles).map((proposee, rang) => ({
    id: rang === 0 ? "voix-automatique" : `voix-${rang - 1}`,
    nom: proposee.nom,
    choix: ChoixDeVoix.imposee(proposee.nomDeLaVoix),
    mention: proposee.mention,
    choisie: proposee.nomDeLaVoix === nomDeLaVoixChoisie,
  }));
}

function Avertissement({ voix }: Props) {
  if (voixFrancaisesTriees(voix.voixDisponibles).length > 0) return null;
  return (
    <p className="avertissement-de-voix">
      {voix.syntheseVocalePresente
        ? "Aucune voix française trouvée sur cet appareil : installe-en une (voir ci-dessous), puis recharge la page."
        : "Ce navigateur ne sait pas lire à voix haute."}
    </p>
  );
}

function ConseilsDInstallation() {
  return (
    <div className="conseils-de-voix">
      <p>
        <strong>Pour des voix plus naturelles :</strong>
      </p>
      <p>
        • <strong>iPad / iPhone</strong> : Réglages › Accessibilité › Contenu énoncé › Voix › Français › télécharger «
        Amélie (Premium) » ou « Audrey (améliorée) ».
      </p>
      <p>
        • <strong>Tablette Android</strong> : Paramètres › Accessibilité › Synthèse vocale › moteur Google › installer
        les voix françaises « haute qualité ».
      </p>
      <p>
        • <strong>Ordinateur</strong> : le navigateur Microsoft Edge propose des voix « Natural » très réalistes (Denise,
        Eloise, Henri…) ; Chrome propose « Google français ».
      </p>
    </div>
  );
}

export function ChoixDeLaVoix({ voix }: Props) {
  const choisir = (choix: ChoixDeVoix) =>
    choix.type === "automatique" ? voix.revenirALaVoixAutomatique() : voix.imposerUneVoix(choix.nomDeLaVoix);

  return (
    <section className="choix-de-voix" aria-labelledby="titre-choix-de-voix" data-testid="choix-de-voix">
      <h3 id="titre-choix-de-voix">La voix des personnages guides</h3>
      <p>
        L'application utilise les voix installées sur cet appareil. Elle choisit automatiquement la plus naturelle, puis
        chaque personnage guide lui donne son caractère (plus aiguë pour l'écureuil, plus grave pour le capitaine
        pompier…). Tu peux aussi imposer une voix.
      </p>
      <div role="radiogroup" aria-labelledby="titre-choix-de-voix" className="liste-de-voix">
        {lignesDeVoix(voix).map((ligne) => (
          <div className="ligne-de-voix" key={ligne.id} data-testid="voix">
            <input
              type="radio"
              name="voix"
              id={ligne.id}
              checked={ligne.choisie}
              aria-describedby={ligne.mention ? `${ligne.id}-mention` : undefined}
              onChange={() => choisir(ligne.choix)}
            />
            <span className="nom-et-mention-de-voix">
              <label htmlFor={ligne.id}>{ligne.nom}</label>
              {ligne.mention && (
                <span id={`${ligne.id}-mention`} className="mention-de-voix" data-testid="mention-de-voix">
                  {ligne.mention}
                </span>
              )}
            </span>
            <button
              type="button"
              aria-label={`Écouter la voix ${ligne.nom}`}
              onClick={() => voix.essayerUneVoix(ligne.choix)}
            >
              Écouter
            </button>
          </div>
        ))}
      </div>
      <Avertissement voix={voix} />
      <ConseilsDInstallation />
    </section>
  );
}
