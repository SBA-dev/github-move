import { estTresNaturelle, type VoixDisponible, voixFrancaisesTriees, voixMontreeCommeChoisie } from "@domain/voix";
import type { Voix } from "./useVoix.ts";

type Props = { readonly voix: Voix };

type LigneDeVoix = {
  readonly id: string;
  readonly nom: string;
  readonly nomDeLaVoix: string;
  readonly mention: string | undefined;
  readonly choisie: boolean;
};

const AUTOMATIQUE = "Automatique (recommandé)";

function mentionDeLaVoix(voix: VoixDisponible, rang: number): string | undefined {
  if (estTresNaturelle(voix)) return "très naturelle";
  return rang === 0 ? "la meilleure ici" : undefined;
}

function lignesDeVoix(voix: Voix): LigneDeVoix[] {
  const francaises = voixFrancaisesTriees(voix.voixDisponibles);
  const choisie = voixMontreeCommeChoisie(francaises, voix.choixDeVoix);
  const meilleure = francaises[0];
  return [
    {
      id: "voix-automatique",
      nom: AUTOMATIQUE,
      nomDeLaVoix: "",
      mention: meilleure && `actuellement : ${meilleure.nom}`,
      choisie: choisie === "automatique",
    },
    ...francaises.map((v, rang) => ({
      id: `voix-${rang}`,
      nom: v.nom,
      nomDeLaVoix: v.nom,
      mention: mentionDeLaVoix(v, rang),
      choisie: choisie !== "automatique" && choisie.nom === v.nom,
    })),
  ];
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
  const choisir = (nomDeLaVoix: string) =>
    nomDeLaVoix === "" ? voix.revenirALaVoixAutomatique() : voix.imposerUneVoix(nomDeLaVoix);

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
              onChange={() => choisir(ligne.nomDeLaVoix)}
            />
            <label htmlFor={ligne.id}>{ligne.nom}</label>
            {ligne.mention && (
              <span id={`${ligne.id}-mention`} className="mention-de-voix" data-testid="mention-de-voix">
                {ligne.mention}
              </span>
            )}
            <button
              type="button"
              aria-label={`Écouter la voix ${ligne.nom}`}
              onClick={() => voix.essayerUneVoix(ligne.nomDeLaVoix)}
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
