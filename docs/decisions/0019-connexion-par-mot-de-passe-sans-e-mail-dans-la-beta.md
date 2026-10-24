# 0019 : Connexion par mot de passe, sans aucun e-mail, dans la beta

**Statut** : Acceptée · 2026-10-24 (décisions du PO, #72 n°1 à 11). Le point 3 attend la question n°2 du modèle de #72. Complète 0011 sans la modifier ; fait une exception à 0009 pour la seule réinitialisation du mot de passe.

## Contexte

La connexion du parent livrée par #5 ne passe que par un lien de connexion ou un code de connexion envoyés par e-mail. Sur le projet de développement, les e-mails vont dans une boîte de test (0011) qui n'accepte que les adresses en `@exemple.test` : avec sa vraie adresse, le PO ne peut pas se connecter. Le fournisseur d'e-mails européen n'arrive qu'avec la mise en ligne (#45).

Le PO décide qu'**aucun e-mail n'est envoyé dans la beta** et que la connexion se fait par **mot de passe**, qui reste après la mise en ligne. Sans e-mail, un parent qui oublie son mot de passe n'a aucun moyen classique de le réinitialiser.

## Décision

1. **Connexion et inscription du parent par adresse e-mail et mot de passe du parent** (Supabase Auth). La confirmation de l'adresse par e-mail est désactivée sur le projet de développement, sinon l'inscription appelle encore le hook « Send Email » (0011).
2. **Le lien de connexion et le code de connexion ne sont plus proposés par l'écran** pendant la beta. Leur domaine, leur infrastructure et le hook de 0011 restent en place ; leurs scénarios sont marqués hors beta, pas supprimés.
3. **Règles du mot de passe** dans le domaine `famille` (au moins 8 caractères, une majuscule, une minuscule, un caractère spécial parmi `& # { } ( ) [ ] $ € % @ ! ?`), importées par le front pour la liste qui passe au vert, et **revérifiées par le serveur**. Supabase Auth ne sait pas exprimer exactement ces règles : la façon dont le serveur les vérifie à l'inscription (réglage de longueur seul, ou inscription par une Edge Function) est la question n°2 du modèle de #72. À la réinitialisation, l'Edge Function les revérifie toujours.
4. **Réinitialisation du mot de passe de la beta, par le prénom d'un enfant rattaché** :
   - le parent donne son adresse e-mail et le prénom d'un des enfants auxquels il est rattaché, puis choisit un nouveau mot de passe et il est connecté ;
   - elle passe par une **Edge Function** qui valide l'entrée, appelle le cas d'usage du domaine `famille`, et change le mot de passe par l'**API d'administration** de Supabase Auth, avec la clé `service_role` lue dans `Deno.env`. C'est une **exception à 0009** (« jamais de `service_role` ») : l'appelant n'est pas connecté, il n'a pas de JWT, et changer le mot de passe d'un autre utilisateur n'est possible qu'avec l'API d'administration ;
   - l'usage de `service_role` est limité à trois opérations : trouver le parent d'une adresse, lire **seulement les prénoms** des enfants qui lui sont rattachés, changer son mot de passe ; plus la lecture et l'écriture des essais de réinitialisation.
5. **Garde-fous de la réinitialisation** :
   - **blocage** après 5 essais de réinitialisation ratés pour une même adresse, pendant 1 heure, compté côté serveur, même pour une adresse inconnue ; pendant le blocage, même un prénom juste est refusé ; une réinitialisation réussie remet le compteur à zéro ;
   - **un seul message**, « Ces informations ne correspondent pas. », que l'adresse existe ou non, que le prénom soit faux ou que le parent n'ait aucun enfant ; le prénom attendu n'est jamais dit ;
   - le blocage est vérifié **avant** toute lecture des prénoms ;
   - un parent **sans profil enfant** ne peut pas réinitialiser ainsi ;
   - les essais sont gardés dans une table sous RLS **sans aucune policy** pour `anon` et `authenticated`, **sans le prénom saisi** ; ni le prénom ni le mot de passe ne sont journalisés.
6. **Pas de limite d'essais de connexion propre à l'application** dans la beta : seule la limite de Supabase Auth s'applique.
7. **Fin de vie** : la réinitialisation par prénom d'enfant est **retirée par #45** (mise en ligne), qui la remplace par la réinitialisation par e-mail et rétablit l'e-mail (lien de connexion). Le mot de passe du parent reste. #45 décide alors d'une limite d'essais de connexion.

## Risque accepté

Le prénom d'un enfant est un **secret faible** : un proche, un camarade de classe, ou quiconque voit un réseau social de la famille peut le connaître ; les prénoms courants se devinent. Une personne qui connaît l'adresse e-mail d'un parent et le prénom d'un de ses enfants peut prendre la main sur sa connexion, voir les profils de ses enfants et les modifier ou les supprimer.

Le PO accepte ce risque **pour la beta seulement** parce que :
- la beta sert aux tests du PO et de quelques familles connues, pas au public ;
- le blocage limite à 5 essais par heure et par adresse les prénoms qu'on peut tenter ;
- aucune réponse ne dit si une adresse a un compte, ni quel prénom est attendu, à l'écran de réinitialisation ;
- la fonctionnalité a une date de fin : #45, avant toute ouverture au public.

Limite connue : l'écran d'inscription, lui, dit qu'une adresse est déjà utilisée (décision de l'issue) ; le secret de l'existence d'une adresse n'est donc pas complet.

## Options écartées

- **Garder le lien et le code de connexion par e-mail** : impossible avec une vraie adresse avant le choix du fournisseur (#45).
- **Fournisseur d'e-mails dès la beta** : demande un compte et un sous-traitant RGPD tout de suite ; refusé par le PO (aucun e-mail dans la beta).
- **Pas de « Mot de passe oublié » avant #45** : un parent qui l'oublie perd l'accès aux profils de ses enfants ; refusé par le PO (réponse n°6).
- **Réinitialisation faite à la main par l'équipe** : demande une personne disponible et un moyen de prouver qui est le parent, sans meilleure garantie.
- **Question secrète choisie par le parent** : une donnée de plus à garder, à faire saisir à l'inscription, et qui disparaîtrait avec #45.
- **Fonction Postgres `security definer` appelée sans connexion** (comme 0009, n°3) : elle ne peut pas changer un mot de passe de Supabase Auth proprement ; l'API d'administration reste nécessaire.

## Conséquences

- Le port `ServiceDeConnexion` gagne l'inscription, la connexion par mot de passe et la réinitialisation ; de nouveaux ports serveur portent les essais, la recherche du parent, la lecture des prénoms et le changement du mot de passe (modèle de #72).
- `supabase/config.toml` : confirmations désactivées, longueur minimale du mot de passe à 8 (au lieu de 6). Pousser cette configuration modifie le projet partagé : il faut une permission de l'outil (comme 0011).
- La clé `service_role` devient un secret de l'Edge Function de réinitialisation, réglé sur le projet ; elle n'est jamais dans le front.
- Les scénarios de #72 ne portent pas le tag `@envoi-email` : ils ne consomment aucun e-mail du quota horaire.
- #13 (second parent) : le parent invité s'inscrit par mot de passe en suivant le lien d'invitation partagé par le premier parent ; il peut réinitialiser son mot de passe avec le prénom d'un enfant auquel il est rattaché.
- #14 (suppression d'un profil) : les essais de réinitialisation ne gardent aucun prénom ; rien de plus à effacer.
- #45 : retirer la réinitialisation par prénom, son Edge Function, sa table et le secret `service_role` s'il ne sert plus ailleurs ; remplacer cette décision par une nouvelle.
