# Journal de la story #183 : écran de séance, barre du haut et barre d'action

Équipe lancée par `/graphe`, vague 2 (issue de coordination #193).
Branche de base : `main` (`aa75d97`). Branche : `feature/183-ecran-de-seance-barres`.

## 2026-11-09

- Démarrage. Lecture de #183 (décisions 1 à 7 du PO du 07/11) et de l'ouverture de la vague 2 sur #193.
- Pas de migration attendue. Verrou `base` demandé seulement avant chaque run E2E.
- Étape 1 (domain-modeler) : requête `Seance.aRecuUneReponse()` proposée, ajouts au glossaire (`eec0047`).
- Inventaire des scénarios existants touchés (Explore) : 29 exécutions cassées à coup sûr, d'autres à risque selon l'implémentation (`recipient`, « Valider » dans le clavier, personnage guide qui réagit).
- Étape 2 (po-acceptance) : 7 règles, 23 scénarios (`0d7fa64`), `criteres.md` (`542c41f`) avec 8 à 20 exécutions existantes à réécrire et 16 questions ouvertes (183.1 à 183.16).
- CADRAGE PRÊT publié sur #183. ⛔ n°1 : en attente de l'annonce [Responsable] sur #193.

## 2026-11-11

- ⛔ n°1 : PO « Reco tout » (annonce [Responsable] sur #193). Les 16 recommandations sont retenues.
- `main` intégré (`60cc288`, docs seulement), sans conflit.
- po-acceptance : retrait de `@a-valider`, réécriture des scénarios existants validés (#73, #96, #102, #97, #163, #79, #20), mise à jour du glossaire et de `criteres.md`. Il reste un point pour l'étape E2E : #163:84 et #163:231 utilisent le step « Coach Léo n'apparaît qu'une fois, à sa place, la bulle gardant ses paroles ». Avec 183.11 A, ses paroles restent visibles, mais à la place de la bulle de la consigne : il faudra voir si le step garde son sens.
- TDD, bloc « Apprentissage, première réponse » :
  - cycle 1 : début et `repondre` (`dc65c29` rouge, `e3a3fe3` vert) ;
  - cycle 2 : « Je ne sais pas » (`84ac26f6` rouge, `dae6f53e` vert, lecture des réponses gardées par les questions, sans état nouveau) ;
  - tests qui protègent les règles déjà tenues (étape, fluence démarrée, lettre de dictée) : `8402a3af`.
  - Suite unitaire : 2953 verts.
- Revue intermédiaire du bloc domaine : APPROUVÉ, sans bloquant. Les non-bloquants sont traités par des tests de protection (`1f932110`).
- Câblage, partie 1 : bouton Son partagé (`5dc6ec9f`) ; barre du haut, barre de progression (`data-eclat`) et feuille de pause, avec le geste retour par `useGardeDuRetour` (`d9432386`).
  - Écart : l'implementer a lancé `@issue-16` sur `telephone` sans le verrou `base`. C'était une lecture seule, sans migration, mais contre le projet partagé. Rappel fait : plus aucun run E2E sans le verrou.
  - Dette à voir : l'entrée de garde reste dans l'historique quand on quitte autrement que par Retour.
- Câblage, partie 2 : bulle et bouton « Réécouter » unique (`a47fccd3`), puis correctif pour que le texte de la question reste toujours visible (`e48e0431`). Sans consigne (étapes, dictée, memoriser), le personnage guide reste affiché en permanence, comme avant.
- Câblage, partie 3 : barre d'action par portail (`ActionDeLExercice`), pour tous les types de la séance de leçon (`90655f89`). Révision, défi et test de départ restent inchangés.
- Steps E2E des parties 1 et 2 écrits (`7dd5eb6e`, `630104d5`, `0c25dbe3`), sans run.
- VERROU base demandé, puis accordé par le responsable (#193). Consignes : 1 worker, sonder `admin/users` avant chaque run, rendre le verrou entre deux séries si #182 le demande.
