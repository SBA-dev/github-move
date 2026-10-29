# Journal de #136 : corrections issues du diagnostic de la non-régression du 29/10

Branche de base : `main` (`439d4a2`). Branche : `fix/136-non-regression`.
Contenu décidé dans l'issue (A à E, réponse du PO « À, b, c, d, e ») : pas de domaine, pas de critères, pas de validation n°1.
Navigateur : config temporaire non commitée `playwright.local.config.ts` (`executablePath` vers chromium 1243), exclue par `.git/info/exclude`.

## 2026-10-29

- 17:50 UTC : démarrage, commentaire « Avancement » sur #136.
- 17:58 UTC : **A, RED**. Le test qui exige la correction existe déjà : `features/11-profil-enfant.feature:137`. Rouge sur `telephone`, 1 worker :
  attendu « Coach Léo Tom CM1 · Sports », obtenu « Tom CM1 · Sports ». Le front n'a pas de tests unitaires de composants : le scénario sert de test de caractérisation, il n'est pas modifié.
