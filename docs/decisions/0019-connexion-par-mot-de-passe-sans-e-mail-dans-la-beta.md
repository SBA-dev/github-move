# 0019 : Connexion par mot de passe, sans aucun e-mail, dans la beta

**Statut** : Acceptée · 2026-10-24 (décisions du PO dans l'issue #72, n°1 à 11, puis validation n°1 de #72 : « OK aux propositions », `docs/stories/72/journal.md`). Complète 0011 sans la modifier ; fait une exception à 0009 pour l'inscription du parent et la réinitialisation du mot de passe.

## Contexte

La connexion du parent livrée par #5 ne passe que par un lien de connexion ou un code de connexion envoyés par e-mail. Sur le projet de développement, les e-mails vont dans une boîte de test (0011) qui n'accepte que les adresses en `@exemple.test` : avec sa vraie adresse, le PO ne peut pas se connecter. Le fournisseur d'e-mails européen n'arrive qu'avec la mise en ligne (#45).

Le PO décide qu'**aucun e-mail n'est envoyé dans la beta** et que la connexion se fait par **mot de passe**, qui reste après la mise en ligne. Sans e-mail, un parent qui oublie son mot de passe n'a aucun moyen classique de le réinitialiser.

## Décision

1. **Connexion et inscription du parent par adresse e-mail et mot de passe du parent** (Supabase Auth). La confirmation de l'adresse par e-mail est désactivée sur le projet de développement, et le parent est créé avec une adresse déjà confirmée : aucune inscription n'appelle le hook « Send Email » (0011).
2. **Le lien de connexion et le code de connexion ne sont plus proposés par l'écran** pendant la beta. Leur domaine, leur infrastructure et le hook de 0011 restent en place ; leurs scénarios portent le tag `@hors-beta`, exclu des commandes de `CLAUDE.md`, et ne sont pas supprimés.
3. **Règles du mot de passe** dans le domaine `famille` : au moins 8 caractères, une majuscule, une minuscule (majuscules et minuscules d'Unicode, accentuées comprises), un caractère spécial parmi `& # { } ( ) [ ] $ € % @ ! ?` ; les chiffres et les autres signes sont permis sans compter ; **64 caractères au plus** ; espaces au début et à la fin gardés. Elles sont importées par le front pour la liste qui passe au vert (la longueur maximale n'y figure pas, elle n'apparaît que comme refus) et **revérifiées par le serveur** avec le même code.
   - **Inscription par une Edge Function** (`inscrire-le-parent`) : Supabase Auth ne sait pas exprimer exactement ces règles (sa liste de signes n'a pas `€` et il exige un chiffre). L'Edge Function valide l'entrée, appelle le cas d'usage `InscrireLeParent` du domaine `famille`, qui revérifie les règles puis **crée le parent par l'API d'administration** de Supabase Auth, avec une adresse déjà confirmée, sans aucun e-mail.
   - Les **inscriptions directes** à Supabase Auth (`signUp` public) sont **fermées** dans la configuration : un parent ne peut être créé que par cette Edge Function. L'API d'administration n'est pas concernée par cette fermeture.
   - Une fois le parent créé, le **navigateur ouvre la connexion** avec `signInWithPassword`, comme pour une connexion ordinaire ; l'Edge Function ne renvoie aucune session.
   - La confirmation du mot de passe (deuxième saisie) est vérifiée dans le navigateur et n'est pas envoyée au serveur.
   - À la réinitialisation, l'autre Edge Function revérifie les mêmes règles.
   - Supabase Auth refuse au-delà de 72 octets : un mot de passe de moins de 64 caractères chargé de `€` ou d'accents peut être refusé par lui ; l'ACL traduit ce refus par le même message que la longueur maximale.
4. **Réinitialisation du mot de passe de la beta, par le prénom d'un enfant rattaché** :
   - en une seule étape, le parent donne son adresse e-mail, le prénom d'un des enfants auxquels il est rattaché, un nouveau mot de passe et sa confirmation ; il reçoit une seule réponse et, si elle est bonne, il est connecté ;
   - le prénom est comparé sans casse, sans accents et sans espaces autour ; rien d'autre n'est normalisé (tirets, espaces intérieurs, apostrophes, ligatures) ;
   - elle passe par une **Edge Function** qui valide l'entrée, appelle le cas d'usage du domaine `famille`, et change le mot de passe par l'**API d'administration** de Supabase Auth ;
   - après la réinitialisation, le navigateur se connecte avec le nouveau mot de passe puis **ferme les autres connexions du parent** avec son propre JWT (`signOut` limité aux autres connexions), sans `service_role`.
5. **Usage de `service_role`** (clé lue dans `Deno.env`, jamais dans le front) : c'est une **exception à 0009** (« jamais de `service_role` ») pour les deux Edge Functions d'un appelant **non connecté**, qui n'a pas de JWT ; créer un utilisateur sans la route publique et changer le mot de passe d'un autre utilisateur ne sont possibles qu'avec l'API d'administration. Il est limité à :
   - inscription : créer le parent ;
   - réinitialisation : trouver le parent d'une adresse, lire **seulement les prénoms** des enfants qui lui sont rattachés, changer son mot de passe, lire et écrire les essais de réinitialisation.
6. **Garde-fous de la réinitialisation** :
   - **blocage** après 5 essais de réinitialisation ratés pour une même adresse, pendant 1 heure à partir du 5ᵉ raté, compté côté serveur, même pour une adresse inconnue ; pendant le blocage, même un prénom juste est refusé, avec le message fixe « Trop d'essais. Réessaie dans une heure. » ; un essai pendant le blocage ne compte pas et ne le prolonge pas ; le blocage n'empêche pas la connexion avec le bon mot de passe ;
   - une réinitialisation réussie remet le compteur à zéro ; les ratés **s'oublient 24 heures après le dernier raté** (un seul instant retenu, pas de liste d'instants) ;
   - une entrée invalide (adresse mal formée, prénom vide, mot de passe non conforme, confirmation différente) est refusée avant le cas d'usage ou à sa première étape, **sans compter de raté** ;
   - **un seul message**, « Ces informations ne correspondent pas. », que l'adresse existe ou non, que le prénom soit faux ou que le parent n'ait aucun enfant ; le prénom attendu n'est jamais dit ;
   - le blocage est vérifié **avant** toute lecture des prénoms ;
   - un parent **sans profil enfant** ne peut pas réinitialiser ainsi ;
   - les essais sont gardés dans une table sous RLS **sans aucune policy** pour `anon` et `authenticated`, **sans le prénom saisi**, et effacés **au plus tard 24 heures après le dernier raté** ; ni le prénom ni le mot de passe ne sont journalisés.
7. **Pas de limite d'essais de connexion propre à l'application** dans la beta : seule la limite de Supabase Auth s'applique.
8. **Fin de vie** : la réinitialisation par prénom d'enfant est **retirée par #45** (mise en ligne), qui la remplace par la réinitialisation par e-mail et rétablit l'e-mail (lien de connexion). Le mot de passe du parent reste. #45 décide alors d'une limite d'essais de connexion.

## Risque accepté

Le prénom d'un enfant est un **secret faible** : un proche, un camarade de classe, ou quiconque voit un réseau social de la famille peut le connaître ; les prénoms courants se devinent. Une personne qui connaît l'adresse e-mail d'un parent et le prénom d'un de ses enfants peut prendre la main sur sa connexion, voir les profils de ses enfants et les modifier ou les supprimer.

Le PO accepte ce risque **pour la beta seulement** parce que :
- la beta sert aux tests du PO et de quelques familles connues, pas au public ;
- le blocage limite à 5 essais par heure et par adresse les prénoms qu'on peut tenter ;
- aucune réponse ne dit si une adresse a un compte, ni quel prénom est attendu, à l'écran de réinitialisation ;
- la fonctionnalité a une date de fin : #45, avant toute ouverture au public.

Limites connues :
- l'écran d'inscription, lui, dit qu'une adresse est déjà utilisée (décision de l'issue) ; le secret de l'existence d'une adresse n'est donc pas complet ;
- l'inscription par l'API d'administration ne profite plus de la limite de demandes de Supabase Auth sur `signUp` : sans limite propre, n'importe qui peut créer des parents en nombre (question ouverte n°1 du modèle de #72, proposition : rien pour la beta, à décider par #45).

## Options écartées

- **Garder le lien et le code de connexion par e-mail** : impossible avec une vraie adresse avant le choix du fournisseur (#45).
- **Fournisseur d'e-mails dès la beta** : demande un compte et un sous-traitant RGPD tout de suite ; refusé par le PO (aucun e-mail dans la beta).
- **Pas de « Mot de passe oublié » avant #45** : un parent qui l'oublie perd l'accès aux profils de ses enfants ; refusé par le PO (réponse n°6).
- **Réinitialisation faite à la main par l'équipe** : demande une personne disponible et un moyen de prouver qui est le parent, sans meilleure garantie.
- **Question secrète choisie par le parent** : une donnée de plus à garder, à faire saisir à l'inscription, et qui disparaîtrait avec #45.
- **Inscription par `signUp` depuis le navigateur, le serveur ne vérifiant que la longueur de 8** (réglage de Supabase Auth) : les trois autres règles ne seraient vérifiées que dans le navigateur, contournables par un appel direct ; refusé par le PO (validation n°1 de #72, n°6).
- **Fermer les autres connexions par l'API d'administration** : demanderait un usage de plus de `service_role` ; le navigateur le fait avec le JWT du parent qui vient de se connecter.
- **Fonction Postgres `security definer` appelée sans connexion** (comme 0009, n°3) : elle ne peut pas changer un mot de passe de Supabase Auth proprement ; l'API d'administration reste nécessaire.

## Conséquences

- Le port `ServiceDeConnexion` gagne l'inscription, la connexion par mot de passe, la réinitialisation et la fermeture des autres connexions ; de nouveaux ports serveur portent la création du parent, les essais, la recherche du parent, la lecture des prénoms et le changement du mot de passe (modèle de #72).
- `supabase/config.toml` : inscriptions publiques fermées, confirmations désactivées, longueur minimale du mot de passe à 8 (au lieu de 6). Pousser cette configuration modifie le projet partagé : il faut une permission de l'outil (comme 0011).
- La clé `service_role` devient un secret des Edge Functions d'inscription et de réinitialisation, réglé sur le projet ; elle n'est jamais dans le front.
- Fermer les inscriptions publiques ferme aussi la création d'un parent par le lien de connexion de #5 (`signInWithOtp` qui crée l'utilisateur) : sans effet dans la beta, où il n'est plus proposé ; #45 en tiendra compte s'il rétablit le lien de connexion.
- Les scénarios de #72 ne portent pas le tag `@envoi-email` : ils ne consomment aucun e-mail du quota horaire.
- #13 (second parent) : le parent invité s'inscrit par mot de passe (Edge Function d'inscription) en suivant le lien d'invitation partagé par le premier parent ; il peut réinitialiser son mot de passe avec le prénom d'un enfant auquel il est rattaché.
- #14 (suppression d'un profil) : les essais de réinitialisation ne gardent aucun prénom ; rien de plus à effacer.
- #45 : retirer la réinitialisation par prénom, son Edge Function et sa table ; garder `service_role` pour l'inscription ou revenir à une autre façon d'inscrire ; décider d'une limite d'inscriptions et d'essais de connexion ; remplacer cette décision par une nouvelle.

## Précision (revue n°1)

- L'essai de réinitialisation est **réservé avant toute lecture du prénom** (compté puis enregistré avec contrôle de version) ; la reprise en cas d'essais simultanés (5 tentatives) est dans le cas d'usage, qui lève `ServiceDeConnexionIndisponible` ensuite (503 côté HTTP). Le navigateur ne traduit en `AdresseOuMotDePasseIncorrect` que le refus 400 `invalid_credentials` ; 429, 5xx et erreurs réseau deviennent `ServiceDeConnexionIndisponible`.
- Une réinitialisation réussie remet le compteur à zéro, y compris les ratés comptés par des requêtes simultanées ; si l'enregistrement de cette remise à zéro échoue après le changement du mot de passe, le parent n'en voit pas l'erreur (son mot de passe est changé) et le compteur s'oublie de lui-même.
