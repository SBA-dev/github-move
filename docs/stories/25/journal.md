# Journal de la story #25 : Parcours par matière et verrous

Équipe lancée par le responsable (`/graphe`, vague 1, issue de coordination #64).
Branche de base : `main`. Branche de travail : `feature/25-parcours-par-matiere-et-verrous`.

## 2026-10-24

- 12:40 UTC : démarrage. Story voisine : #20 (ne pas toucher à ses agrégats). Aucune dépendance ouverte.
- 12:40 UTC : la table `resultats_des_lecons` (#24) porte `meilleures_etoiles` par profil et par leçon : a priori
  suffisante pour la progression, à confirmer par `domain-modeler`. Sans nouvelle migration, pas de verrou `base`.
- 12:50 UTC : étape 1 faite (`domain-modeler`) : parcours = service de domaine pur (`apprentissage/domain/parcours.ts`),
  pas d'agrégat, pas d'événement, **pas de migration** (`resultats_des_lecons` suffit, lecture front sous RLS).
- 13:05 UTC : étape 2 faite (`po-acceptance`) : 8 règles, 32 scénarios dont 16 `@a-valider`, 16 questions ouvertes.
  Conflit relevé : la règle « Leçon suivante » du parcours rend faux deux scénarios de #24 (question 2).
  CADRAGE PRÊT publié sur #25 ; attente de l'annonce du responsable.
- 13:07 UTC : annonce du responsable (#64) : OK du PO. #25.1 = b, **aucun verrou** (toutes les leçons ouvertes, la
  prochaine leçon seulement mise en avant) ; #25.12 = a, les leçons de CE2 réussies restent visibles pour l'enfant
  redescendu en CE1 (endroit non précisé) ; reco de l'équipe pour toutes les autres questions. Reprise du cadrage.
- 13:15 UTC : À SAVOIR (#64) : après la migration de #20, `seances_terminees.etoiles` peut valoir `null`. Sans effet :
  le parcours ne lit que `resultats_des_lecons`, inchangée.
- 13:30 UTC : critères révisés (`po-acceptance`) : 8 règles, 36 scénarios dont 7 `@a-valider` (N1, N4, N7-N10). R3
  remplacée par une règle positive (toute leçon montrée s'ouvre) : acceptée, elle traduit la réponse 25.1.
  CADRAGE PRÊT mis à jour (questions N1-N11). TDD lancé sur ce qui ne dépend d'aucune question.

### Comportements TDD (ordre prévu)

Indépendants des questions N :
1. `parcoursDeLaMatiere` : leçons de la matière et du niveau de l'enfant, triées par `ordre` puis par identifiant, avec leur place (1, 2…).
2. État des leçons : réussie (meilleures étoiles), prochaine (première non réussie), à découvrir (les autres non réussies).
3. Parcours entièrement réussi : aucune prochaine leçon.
4. Compteur : leçons réussies sur leçons du niveau (les leçons réussies d'un autre niveau ne comptent pas).
5. `matieresDuParcours` : matières qui ont au moins une leçon du niveau, dans l'ordre du Catalogue.
6. `leconSuivanteDansLeParcours` : première leçon d'après non réussie du même parcours ; aucune après la dernière.
En attente d'une réponse : leçons réussies d'une classe au-dessus (N1, N7, N9), repli de la leçon suivante (N4), leçon suivante après une leçon d'une classe au-dessus (N10).
- 13:55 UTC : comportements 1 à 6 verts (786 tests). Cycles : 5 RED/GREEN (2 et 3 groupés), 1 reprise de formatage d'un
  test rouge. Aucun désaccord. Restent en attente des réponses N : N1/N7/N9 (classe au-dessus), N4, N10.
- 14:10 UTC : câblage du front (écran « Mon parcours », bouton de l'accueil, leçon suivante de fin de séance, étoiles
  gagnées gardées en mémoire et fusionnées par `Etoiles.meilleureQue`). Ancienne règle `leconSuivante` du Catalogue
  retirée (test par `test-writer`, code par `implementer`). Relevé : une leçon jouée hors du niveau de l'enfant
  renvoie aujourd'hui la première leçon non réussie du parcours ; à corriger par un test dès la réponse à N10.
  Dette signalée : après un rechargement sans réseau, une séance gardée dans IndexedDB n'apparaît pas dans le parcours
  (relève de #44, réponse 25.6).
- 14:25 UTC : review n°1 (`mr-reviewer`) : **APPROUVÉ**, 0 bloquant, 13 non bloquants. Retenus pour un passage après
  l'E2E : fusion des étoiles serveur/mémoire extraite dans le domaine avec un test (n°1) ; page de la leçon sur la
  même source (n°2) ; matière choisie remise à zéro au changement d'enfant et à la déconnexion (n°4) ; `catch` vide
  de la fin de séance (n°5) ; prédicat « du parcours » dupliqué (n°7) ; « sans verrou » dans un nom de test (n°9) ;
  nom de fichier `useEntreesDuParcours.ts` (n°10).
- 14:45 UTC : E2E cycle 1 (`e2e-tester`) : **34/34 scénarios non `@a-valider` verts** (68 cas, tablette et
  téléphone) ; non-régression #24 : 56/56. Contournement Chromium 1194 → 1243 par liens dans le scratchpad (annonce du
  responsable). Note : un commit de journal (`git commit -a`, 9c38fe7) a embarqué par erreur une partie des steps en
  cours d'écriture ; complétée par le commit des steps, sans effet. Point d'attention : hors ligne, « Chargement du
  parcours… » dure environ 8 s (la lecture des étoiles échoue lentement) ; à corriger avec les non bloquants.
- 15:05 UTC : corrections des non bloquants (fusion `meilleuresEtoilesReunies` en TDD, page de la leçon, remise à zéro,
  `catch`, prédicat, nom de fichier, parcours hors ligne sans attente). Review du delta (cycle 2) : **APPROUVÉ**.
  Petits non bloquants gardés pour le passage N : commentaire « de cet appareil », page de la leçon hors ligne
  (`reseauDisponible`), noms `a`/`b`, emplacement de `reseau-disponible.ts` et import direct de `niveau-du-profil.ts`.
- 15:25 UTC : annonce du responsable (#64) : PO « reco partout » sur N1-N11. N3 : l'équipe corrige dans sa PR
  `CLAUDE.md`, la ligne `ordre` de `docs/format-lecons.md`, le glossaire et la context map par ajouts ; le responsable
  fait la feuille de route, le graphe, l'issue #26, la story Famille (N2) et le titre de l'issue (N5).
  Comportements TDD ajoutés : 7. repli de la leçon suivante sur la leçon juste après (N4) ; 8. aucune leçon suivante
  après une leçon hors du parcours de l'enfant (N10) ; 9. comparaison de niveaux (Catalogue) ; 10. leçons réussies
  d'une classe au-dessus, hors compteur, jamais prochaine (N1, N7).
- 15:45 UTC : MAIN A BOUGÉ (#19 mergée). E2E cycle 2 interrompu (rendu obsolète). Intégration de `main` (merge
  3e12850) : conflits `apprentissage/domain/index.ts` et `src/styles.css` (deux ajouts gardés) ; prop `niveau`
  ajoutée des deux côtés dans `Application.tsx`/`EcranDeSeance.tsx` (dédoublonnée). 947 tests Deno, 1404 pytest,
  tsc et build verts.
- 16:05 UTC : bloc « Déjà réussies en <niveau> » câblé ; derniers non bloquants traités. Scénarios validés : `@a-valider`
  retirés, fichier renommé `features/25-parcours-par-matiere.feature` (N5 ; le `git mv` a été embarqué par le commit
  feat 6414056 lancé en parallèle, sans changement de contenu), titre d'un scénario de #24 renommé (N6).
- 16:20 UTC : review du delta final (cycle 3, merge de `main` compris) : **APPROUVÉ**, 0 bloquant. Non bloquants
  laissés : formatage d'un import dans `MonParcours.tsx`, regroupement par niveau fait dans React (présentation),
  pas de step pour la page de la leçon hors ligne, commit 6414056 qui contient aussi le `git mv`.
- 16:25 UTC : MAIN A BOUGÉ (PR #70, `main` = 61d6fc4, 17 fichiers). À intégrer après l'E2E en cours, avant
  `PRÊTE À MERGER`.
- 17:05 UTC : E2E cycle 3 (`e2e-tester`) : #25 35/36 (9 échecs de concurrence avec #20 repassés à la relance ; un step
  corrigé) ; non-régression 847/850 (2 = le KO de #25, 1 = #10 hors ligne, repassé à la relance : concurrence).
  **KO réel** : « Après une leçon réussie d'une classe au-dessus, aucune leçon suivante n'est proposée » — l'écran de
  fin garde le niveau du profil lu au choix de l'enfant ; changé sur un autre appareil, il est périmé (le parcours,
  lui, relit le profil). Bug de câblage du front, pas du domaine : le scénario E2E sert de test rouge (pas de harnais
  de test front). Chargement du parcours hors ligne : 88-178 ms (au lieu d'environ 8 s).
  Intégration de `main` = 61d6fc4 (merge a41bb5d, sans conflit) : 949 tests Deno, tsc, lint, fmt verts.
- 17:30 UTC : review du correctif (cycle 4) : **À CORRIGER**. Le KO du cycle 3 venait de la mise en place du scénario
  (le changement de niveau rechargeait la page de Léa, qui jouait ensuite avec le profil préparé) et l'assertion
  négative passait trop tôt : le vert de 303a05d était un faux positif, et ce code n'était exigé par aucun test.
  303a05d annulé (ccf15d1). Steps à corriger par `e2e-tester` (rechoisir Léa, assertion stable).
  Dette notée (non demandée par la story) : un niveau changé sur un autre appareil n'est vu qu'au prochain
  « Qui joue ? » ; si besoin, à traiter à une seule source (`profilEnCours` rafraîchi), dans une autre story.
  `main` a137f42 (PR #71, outillage) déjà intégré.
- 17:50 UTC : MAIN A BOUGÉ : #20 mergée (9115411). À intégrer après le cycle E2E en cours (conflit probable sur la
  condition `@issue-20`/`@issue-25` du step « profil enfant préparé ») ; `SUFFIXE_E2E` disponible ensuite.
- 18:30 UTC : E2E cycle 4 : steps corrigés (Léa rechoisie après le changement de niveau ; assertion négative sur un
  écran stable) ; preuve rouge avec la seule assertion renforcée, vert avec les deux ; #24 et #25 verts ; `@wip` retiré.
  Intégration de `main` = 9115411 (#20) : merge 1468cf8, conflits dans `EcranDeFin.tsx`, `useSauvegardeDeLaSeance.ts`
  (étoiles retenues seulement pour une séance notée), `styles.css`, `domain/index.ts`. 1159 tests Deno, 1404 pytest,
  lint, fmt, tsc, build verts. PR ouverte en brouillon.
- 18:50 UTC : review du delta (cycle 5) : **À CORRIGER** (2e cycle KO). Bloquant : `waitForLoadState("networkidle")`
  ne protège pas l'assertion négative dans la SPA (état déjà atteint). Correction côté steps à faire par
  `e2e-tester` après le passage E2E en cours. Non bloquant à remonter au PO : aucun scénario ne vérifie qu'une
  séance de fluence seule (#20) n'ouvre pas la leçon suivante du parcours (la condition existe dans
  `useSauvegardeDeLaSeance.ts`, issue de la résolution du merge).
