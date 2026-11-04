# #146 — Parents de test réutilisés (quota MAU) : cadrage

Story d'outillage de test (support E2E). Pas de domaine, pas de migration, pas de `.feature` modifié.
Les critères d'acceptance sont ceux de l'issue (écrits par le PO) ; ce fichier donne le plan et les questions.

## État constaté (2026-11-03)

- `features/steps/fixtures.ts` : suffixe `<projet><parallelIndex>-<JETON_DU_WORKER>`, jeton tiré par `crypto.randomUUID()` à chaque lancement.
- `features/support/famille.ts` `nettoyer()` → `supprimerLesParentsDuSuffixe` : chaque parent du suffixe est supprimé en fin de scénario, puis recréé (nouvel identifiant, donc nouveau MAU) au scénario suivant.
- `features/support/supabase-test.ts` `parentsExistants()` : `GET /auth/v1/admin/users?per_page=1000` à chaque `trouverParent` et à chaque nettoyage.
- Seule table liée à `auth.users` : `rattachements.parent` (cascade). Les autres données du parent sont indexées par adresse : `boite_de_test_emails`, `essais_de_reinitialisation`.
- Adresses des scénarios : `paul`, `claire`, `marie`, `inconnu`, `dupont` `@exemple.test`.
- Le projet compte 140 utilisateurs Auth, dont une bonne part de restes d'anciens suffixes aléatoires. La sonde du 03/11 à ~19:30 UTC répond de nouveau 504 / 40 s sur `admin/users`.

## Plan

1. **Adresse stable** (critères 1, 2) : suffixe `<équipe>-<projet><parallelIndex>`, par exemple `paul+146-telephone0@exemple.test`.
   - `<équipe>` = `E2E_EQUIPE` si défini ; sinon le n° de la branche courante `feature/<n>-…` ; sinon `local` (valeur par défaut documentée). Voir question 146.2.
   - Le calcul (pur) est isolé dans un petit module de `features/support/`, testé d'abord (question 146.4).
2. **Recherche par adresse** (critère 5) : `trouverParent(adresse)` interroge l'API d'administration filtrée sur l'adresse (`?filter=`), avec contrôle exact de l'adresse, et garde la correspondance adresse → identifiant en cache le temps du worker. `parentsExistants()` (liste complète) disparaît.
3. **Parents réutilisés** (critère 3) :
   - fin de scénario : on ne supprime plus l'utilisateur Auth ; on supprime ses profils enfants (rattachements et données en cascade), on vide la boîte de test et les essais de réinitialisation du suffixe ;
   - début de scénario (`preparerUnParent`, `connecterSansEmail`, « est inscrit avec … et le mot de passe du parent … ») : parent trouvé ou créé, puis remis dans un état connu par l'API d'administration (mot de passe du parent remis à la valeur du scénario, ou à une valeur aléatoire si le scénario n'en donne pas ; e-mail confirmé) ;
   - le nettoyage porte sur les adresses que le scénario a réellement utilisées (connues de `Famille`), sans lister tout le projet.
4. **« Parent inconnu »** (critère 4) : voir question 146.1.
5. **Plafond** (critère 6) : constante dans le code et section de la décision 0040 :
   équipes actives du mois × 2 projets × workers (≤ 3) × 5 adresses ≈ 15 × 2 × 3 × 5 = 450 au pire, en pratique ~150.
6. **Documentation** (critère 8) : `docs/decisions/0040-parents-de-test-reutilises.md`, mention de `E2E_EQUIPE` dans `CLAUDE.md` (lignes E2E).
7. **Non-régression** (critère 7) : deux runs complets successifs sous verrou `base`, `E2E_WORKERS=1` sauf accord ; on relève le nombre d'utilisateurs Auth avant, entre et après (un appel `admin/users` par mesure).

Fichiers touchés : `features/steps/fixtures.ts`, `features/support/famille.ts`, `features/support/supabase-test.ts`, `features/support/mot-de-passe.ts` (préparation avec mot de passe sur un parent existant), `features/steps/connexion-par-mot-de-passe.steps.ts` et `features/steps/connexion.steps.ts` (implémentation des étapes « est inscrit avec … » et « aucun parent n'utilise … », sans en changer le sens), nouveau module pur et son test, `docs/decisions/0040-…`, `CLAUDE.md`.

## Questions au PO

- **146.1 Inscriptions réelles.** 10 scénarios par projet (#72 : 2 + 5 exemples + 2 ; #73 : 1) partent de « aucun parent n'utilise l'adresse … » puis **réussissent** une inscription par l'écran : Supabase crée et connecte un nouvel utilisateur, donc 1 MAU, quoi qu'on fasse côté support. Pour que le scénario suivant retrouve une adresse libre, il faut supprimer ce parent en fin de scénario. Coût : ≤ 20 MAU par non-régression complète (2 projets), ~10 par run `@issue-72`/`@issue-73`. Les autres « adresse inconnue » (`inconnu@…`, inscriptions refusées) ne connectent personne : 0 MAU.
  Reco **A** : accepter ce coût résiduel, borné et documenté dans la décision 0040 (le compteur d'utilisateurs Auth reste stable d'un run à l'autre, critère 7). B : autre piste (le scénario ne peut pas réussir une inscription sans créer d'utilisateur).
- **146.2 Valeur de l'équipe.** Reco : `E2E_EQUIPE`, sinon le n° tiré de la branche `feature/<n>-…`, sinon `local`. Ainsi les équipes en cours (#129, #131) sont isolées sans changer leurs commandes. Autre choix : `E2E_EQUIPE` obligatoire dans les commandes de `CLAUDE.md` (et `equipe.md`, que je ne modifie pas).
- **146.3 Restes des anciens suffixes.** ~130 utilisateurs `…+<projet><i>-<jeton>@exemple.test` laissés par des runs interrompus. Ils ne comptent plus comme MAU le mois prochain s'ils ne se connectent pas. Reco : ne pas y toucher dans cette story (pas de suppression en masse sur le projet partagé pendant que d'autres équipes testent).
- **146.4 Test du calcul de suffixe.** Reco : un test `Deno.test` à côté du module pur (`features/support/…_test.ts`), lancé par `deno test features/support/`, ajouté au tableau des commandes. Le reste (appels Supabase) est vérifié par les E2E.
