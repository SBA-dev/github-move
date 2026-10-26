import { PageLegale } from "./PageLegale.tsx";
import { IDENTITE_DE_L_EDITEUR } from "./identite-de-l-editeur.ts";

type Props = {
  readonly libelleDuRetour: string;
  readonly onRetour: () => void;
};

const { editeur, directeurDePublication, adresseDeContact } = IDENTITE_DE_L_EDITEUR;

export function MentionsLegales({ libelleDuRetour, onRetour }: Props) {
  return (
    <PageLegale titre="Mentions légales" libelleDuRetour={libelleDuRetour} onRetour={onRetour}>
      <section aria-labelledby="editeur">
        <h2 id="editeur">Éditeur</h2>
        <p>Savanturier est édité par {editeur}.</p>
        <p>Directeur de la publication : {directeurDePublication}.</p>
        <p>
          Contact : <a href={`mailto:${adresseDeContact}`}>{adresseDeContact}</a>
        </p>
      </section>
      <section aria-labelledby="hebergeur-du-site">
        <h2 id="hebergeur-du-site">Hébergeur du site</h2>
        <p>alwaysdata SARL, Paris, France.</p>
      </section>
      <section aria-labelledby="hebergeur-des-donnees">
        <h2 id="hebergeur-des-donnees">Hébergeur des données</h2>
        <p>Supabase, région Irlande (eu-west-1).</p>
      </section>
    </PageLegale>
  );
}
