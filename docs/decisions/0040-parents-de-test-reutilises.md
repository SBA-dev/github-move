# 0040 : Les parents des tests E2E ont des adresses stables, sont réutilisés et remis à zéro, pour rester sous le quota MAU de Supabase

**Statut** : Acceptée · 2026-11-03 (story #146, réponses du PO aux questions 146.1 à 146.4, « 146 reco tout »)

## Contexte

Le 2026-11-03, le projet `savanturier-dev` dépasse le quota MAU du plan Free : 55 619 pour 50 000, soit environ 4 600 MAU par jour. Le projet ne compte pourtant qu'environ 140 utilisateurs Auth.

Supabase compte comme MAU tout utilisateur qui se connecte dans le cycle, même s'il est supprimé ensuite. Chaque parent de test recréé compte donc de nouveau.

Trois causes se cumulent :
- le suffixe des adresses de test contient un jeton aléatoire tiré à chaque lancement ;
- chaque parent est supprimé à la fin du scénario, puis recréé (nouvel identifiant) au scénario suivant ;
- chaque recherche d'un parent liste tous les utilisateurs du projet.

## Décision

1. **Suffixe stable** : `<équipe>-<projet><parallelIndex>`, par exemple `paul+146-telephone0@exemple.test`.
   - L'équipe est la valeur de `E2E_EQUIPE`, sinon le n° de la branche `feature/<n>-…`, sinon `local`.
   - La valeur est limitée à `[a-z0-9-]`.
   - Le calcul est un module pur, `features/support/parents-de-test.ts`.
2. **Parents réutilisés** : un parent existant n'est plus supprimé.
   - Au début du scénario, il est remis à zéro : mot de passe du scénario (ou valeur aléatoire si le scénario n'en donne pas), e-mail confirmé.
   - À la fin, ses données sont effacées : profils enfants et données en cascade, boîte de test, essais de réinitialisation.
3. **Recherche par adresse** : l'API d'administration est interrogée avec un filtre sur l'adresse, avec contrôle exact. La correspondance adresse → identifiant est gardée en cache le temps du worker. La liste complète des utilisateurs disparaît. Un 422 à la création (adresse déjà prise) fait parcourir une fois la liste paginée (`per_page=1000`), en filet de sécurité si l'API ignorait le filtre.
4. **Adresses « libres »** : les scénarios « aucun parent n'utilise l'adresse … » qui réussissent une vraie inscription (#72, #73) utilisent `prenom.libre+<suffixe>@exemple.test`, supprimée en fin de scénario.
   - Une inscription réussie crée forcément un utilisateur Auth, donc 1 MAU.
   - Il faut une adresse libre au scénario suivant, donc supprimer ce parent.
   - Avec l'adresse du parent réutilisé, cette suppression supprimerait aussi le parent réutilisé, recréé au scénario suivant : 2 MAU au lieu d'1.
   - D'où une adresse distincte, dont la suppression ne touche pas les parents réutilisés.

## Plafond

La constante `PLAFOND_DES_PARENTS_DE_TEST` de `features/support/parents-de-test.ts` donne le nombre maximal d'adresses de test par mois :
15 équipes actives × 2 projets × 3 workers × 5 adresses = **450**.
Un test garde ce total sous 500.

S'y ajoute le coût accepté par le PO (146.1 A) des vraies inscriptions de #72 et #73 :
- au plus 20 MAU par non-régression complète (2 projets) ;
- environ 10 MAU par lancement de `@issue-72`.

## Options écartées

- **Purger les anciens utilisateurs** (146.3) : suppression en masse sur un projet partagé pendant que d'autres équipes testent.
- **Rendre `E2E_EQUIPE` obligatoire** : il faudrait changer les commandes des équipes en cours. Le n° de branche suffit.
- **Éviter toute inscription réelle** : un scénario d'inscription réussie crée un utilisateur, quoi qu'on fasse côté support.

## Conséquences

- Les anciens utilisateurs à suffixe aléatoire (environ 130) ne sont pas purgés (146.3). Ils ne comptent plus s'ils ne se connectent pas.
- Deux équipes ne doivent pas forcer la même `E2E_EQUIPE`, sinon leurs scénarios se marchent dessus.
- Un worker mort en cours de scénario laisse des données ; le scénario suivant du même suffixe les efface au début.
- Le compteur d'utilisateurs Auth reste stable d'un lancement à l'autre.
- Le module est testé par `deno test features/support/parents-de-test_test.ts`. Le reste est vérifié par les E2E.
