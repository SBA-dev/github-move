import { PageLegale } from "./PageLegale.tsx";
import { IDENTITE_DE_L_EDITEUR } from "./identite-de-l-editeur.ts";

type Props = {
  readonly libelleDuRetour: string;
  readonly onRetour: () => void;
};

const { editeur, adresseDeContact } = IDENTITE_DE_L_EDITEUR;

export function PolitiqueDeConfidentialite({ libelleDuRetour, onRetour }: Props) {
  return (
    <PageLegale titre="Politique de confidentialité" libelleDuRetour={libelleDuRetour} onRetour={onRetour}>
      <section aria-labelledby="responsable">
        <h2 id="responsable">Qui s'occupe de tes données</h2>
        <p>Le responsable du traitement est l'éditeur de Savanturier : {editeur}.</p>
      </section>
      <section aria-labelledby="donnees-gardees">
        <h2 id="donnees-gardees">Les données gardées</h2>
        <ul>
          <li>Le compte du parent : son adresse e-mail et son mot de passe, gardé de façon sécurisée par Supabase Auth.</li>
          <li>Les profils des enfants : un prénom ou un pseudo, la classe et les réglages.</li>
          <li>Les séances, les résultats, les records et le test de départ.</li>
          <li>La file de révision de chaque enfant et ses séances de révision.</li>
          <li>Les leçons personnelles que le parent écrit pour son enfant.</li>
          <li>Aucune voix n'est enregistrée pendant la beta.</li>
        </ul>
        <p>Seul le parent a un compte. L'enfant n'a ni adresse e-mail, ni mot de passe, ni date de naissance.</p>
      </section>
      <section aria-labelledby="finalite">
        <h2 id="finalite">Pourquoi ces données</h2>
        <p>Elles servent à l'apprentissage de l'enfant et au suivi par ses parents. Rien d'autre.</p>
      </section>
      <section aria-labelledby="hebergement">
        <h2 id="hebergement">Où sont les données</h2>
        <p>
          Les données sont hébergées dans l'Union européenne, en Irlande, par un prestataire américain. Le site est hébergé par
          alwaysdata, en France. La base de données et les fonctions sont hébergées par Supabase Inc., société américaine, dans la région
          Irlande (eu-west-1).
        </p>
        <p>
          alwaysdata et Supabase gardent des journaux techniques, qui contiennent des adresses IP. Savanturier n'utilise aucun traceur
          et aucun service d'analyse. Aucun e-mail n'est envoyé pendant la beta.
        </p>
      </section>
      <section aria-labelledby="duree">
        <h2 id="duree">Combien de temps</h2>
        <p>
          Les données sont gardées tant que le compte existe. Des sauvegardes manuelles sont faites avant chaque mise à jour. Elles sont
          gardées 30 jours puis effacées, y compris après une demande de suppression.
        </p>
      </section>
      <section aria-labelledby="droits">
        <h2 id="droits">Tes droits</h2>
        <p>
          Le parent peut demander l'accès à ses données et à celles de son enfant, leur rectification, leur export et leur suppression.
        </p>
        <p>
          <strong>Demande de suppression des données :</strong> envoie un e-mail à{" "}
          <a href={`mailto:${adresseDeContact}`}>{adresseDeContact}</a> depuis l'adresse e-mail de ton compte. La demande est traitée sous
          7 jours, et une réponse écrite te confirme que c'est fait.
        </p>
      </section>
      <section aria-labelledby="appareil">
        <h2 id="appareil">Ce qui reste sur l'appareil</h2>
        <p>
          Le navigateur garde sur l'appareil le réglage Son ou Muet, la voix choisie et les leçons pour jouer sans réseau. Il garde aussi
          la liste des profils du parent connecté (prénom ou pseudo, classe et réglages), ainsi que les séances, les tests de départ et
          les séances de révision qui ne sont pas encore envoyés.
        </p>
        <p>
          En se déconnectant, le parent efface de l'appareil la liste des profils, ainsi que les séances, les tests de départ et les séances de révision pas encore envoyés. Le réglage Son ou Muet et la voix choisie restent. Pour tout effacer, supprime les données du site dans les réglages
          du navigateur, ou désinstalle l'application de l'écran d'accueil.
        </p>
      </section>
    </PageLegale>
  );
}
