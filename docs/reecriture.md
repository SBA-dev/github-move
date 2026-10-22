# Réécriture de l'application (React + Supabase)

Objectif : refaire toute l'application actuelle (`app/`) dans la stack cible (décisions 0001 à 0003), sans perdre de fonctionnalité. Seul le temps d'écran n'est pas repris (décision 0005).
Les nouvelles fonctionnalités viendront ensuite des issues GitHub écrites par le PO.

## Méthode de non-régression

1. Pour chaque story, les scénarios Gherkin sont écrits à partir du comportement **actuel** de `app/` (lecture du code et essais). Ils sont vérifiés sur l'application actuelle quand c'est possible (tests de caractérisation dans `tests/legacy/`).
2. Les mêmes scénarios, au vert sur la nouvelle application, prouvent la non-régression.
3. Les règles métier sont développées en TDD (`Deno.test`) dans `supabase/functions/_shared/<contexte>/domain/`.
4. Une fonctionnalité est retirée de `app/` seulement quand son équivalent est livré. La bascule finale a lieu quand tout est livré.

## Environnement

- Projet Supabase de développement : `savanturier-dev`, région Francfort, offre gratuite.
- Secrets de l'environnement cloud : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (tests uniquement), `SUPABASE_ACCESS_TOKEN` (CLI), `SUPABASE_DB_PASSWORD`. Ils ne sont visibles que dans une session démarrée après leur ajout.
- Réseau autorisé : `supabase.com`, `*.supabase.co`.
- Première vérification à faire : `npx supabase link`, puis appliquer une migration vide et la retirer.

## Lots et stories

Chaque story devient une issue GitHub avec le label `reecriture`.

| Lot | Stories |
|---|---|
| 1. Socle | Connexion du parent · Design, univers et personnage guide · Voix (lecture à voix haute) · PWA installable |
| 2. Famille | Créer et modifier un profil enfant · Inviter un second parent (rattachement par lien) · Réglages (mode dys, tout lire, parcours libre, clavier, langue du parent) · Contrôle parental de l'espace parent · Supprimer un profil et ses données |
| 3. Jouer une leçon | Étapes lues puis exercices · Exercices à choix (bulles, lecture, écoute) · Classer, ordre, trous · Dictée, conjugaison · Calcul, fluence, addition posée · Boîte, barres · Mémoriser une poésie · Aide et « Je ne sais pas » · Étoiles et écran de fin |
| 4. Parcours | Parcours par matière et verrous · Parcours libre et leçons des classes d'avant · Test de départ · Révisions des erreurs · Écran « Aujourd'hui » |
| 5. Motivation | Série · Badges et compétences · Cabane · Épisodes de l'histoire |
| 6. Accompagnement | Suivi et carte des compétences · Rapport de la semaine · Devoirs (leçon à faire) · Mots de la semaine · Enregistrements de lecture · Leçons personnelles (générateurs locaux, puis IA texte et photo) · Audio des poésies · Traduction des consignes pour le parent |
| 7. Bascule | Hors ligne et synchronisation · Mise en ligne · Retrait de `app/` |

## Décisions de démarrage

Toutes confirmées par le PO le 2026-10-22.

| # | Sujet | Proposition | Statut |
|---|---|---|---|
| 1 | Qui écrit les stories de la réécriture | Claude crée les issues (label `reecriture`) à partir du code actuel | **confirmé** |
| 2 | Validation des scénarios | Par lot (5 à 6 validations) plutôt qu'à chaque story | **confirmé** |
| 3 | Base Supabase | Projet de dev gratuit à Francfort | **confirmé** |
| 4 | Branches et PR | Une branche et une PR par story (`feature/<n>-…`), avec `main` comme base. `main` est créée. La définir comme branche par défaut se fait dans les réglages GitHub, par le PO | **confirmé** |
| 5 | Connexion et accès des parents | Connexion par lien magique reçu par e-mail. Un parent ne voit que les enfants auxquels il est rattaché. Un enfant peut avoir deux parents : le second se rattache par un lien d'invitation communiqué par le premier. La question de multiplication reste à l'entrée de l'espace parent | **confirmé** (questions de détail dans le glossaire) |
| 6 | Services payants | Plus tard : clé API Claude (leçons personnelles par IA) et voix neuronale. En attendant : générateurs locaux et voix du navigateur | **confirmé** |
| 7 | Données existantes | Pas de migration : on repart de zéro | **confirmé** |
| 8 | Design | Univers visuel actuel (« Monde vivant », 6 univers), animé comme la maquette de l'option 1 | **confirmé** |
