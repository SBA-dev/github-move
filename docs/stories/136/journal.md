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
