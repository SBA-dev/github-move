# Feuille de route

Mise à jour : 2026-10-22. On la met à jour à la fin de chaque session de travail.

## Où en est le projet

### Application actuelle (`app/`, legacy)

L'application fonctionne et est publiée comme artifact claude.ai. Elle comprend :
- **Leçons et exercices** : 14 types d'exercices, leçons lues à voix haute, mode dys.
- **Parcours de l'enfant** : parcours par matière avec réglage « parcours libre », test de départ, révisions des erreurs.
- **Motivation** : série, badges, cabane, épisodes.
- **Espace parent** : suivi, rapport de la semaine, devoirs, mots de la semaine, enregistrements de lecture, leçons personnelles (texte ou photo).

### Contenu (`app/bibliotheque.json`)

265 leçons :

| Matière | CP | CE1 | CE2 | CM1 | CM2 |
|---|---|---|---|---|---|
| Français | 21 | 20 | 18 | 20 | 20 |
| Maths | 31 | 17 | 19 | 21 | 18 |

À ces leçons s'ajoutent sciences (21), histoire et géographie (21), anglais (16) et EMC (2).

- Couverture des programmes : français 85 sections sur 90 (seule l'écriture manuscrite manque), maths 86 sur 89.
- Les **maths du CP** suivent le guide fondamental « nombres, calcul et résolution de problèmes au CP » : 22 leçons appuyées sur le guide, avec les types `boite` et `barres`.
- Les 8 guides fondamentaux d'Eduscol sont dans `sources/guides/`, leur texte extrait dans `sources/texte/guides/`.

### Nouvelle application (cible)

- Décisions prises : voir `docs/decisions/` (React PWA, Supabase, domaine partagé hors ligne, voix de synthèse, pas de temps d'écran, méthode).
- Méthode en place : `CLAUDE.md`, 6 subagents, commande `/feature`, 4 skills.
- Domaine : glossaire et context map initiaux, validés par le PO (`docs/domain/`).
- **Aucun code de la cible n'existe encore.**

## Prochaines étapes

> **Chantier en cours : la réécriture complète en React + Supabase.** Plan, lots et décisions de démarrage dans `docs/reecriture.md`.

### Première beta (périmètre validé par le PO le 2026-10-23)

Un parent installe Savanturier, crée le profil de son enfant ; l'enfant joue des leçons, avance dans son parcours et est motivé par la série et les badges. **En ligne seulement** : le hors ligne vient après la beta.

| Lot | Stories | Dans la beta |
|---|---|---|
| 1. Socle | #5 à #8 | oui |
| 2. Famille | #10 à #15 | oui |
| 3. Jouer une leçon | #16 à #24 | oui |
| 4. Parcours | #25 à #29 | oui |
| 5. Motivation | #30 à #33 | oui |
| 6. Accompagnement | #34 à #43 | non, après la beta |
| 7. Bascule | #45 mise en ligne | oui ; #44 hors ligne et #46 retrait de `app/` après la beta |

Avant la beta, l'application actuelle (`app/`) reste celle que les familles utilisent.

### 1. Préparer le terrain de la nouvelle application

- [x] Deno, pytest et les dépendances npm (dont la CLI Supabase) sont installés à chaque session cloud par `.claude/hooks/session-start.sh`.
- [ ] **Docker** pour `supabase start` : absent du conteneur cloud. À lancer en local, ou à fournir par l'environnement, avant la première story qui touche la base.
- [x] Branche **`main`** créée et définie comme branche par défaut.
- [x] Squelette créé et vérifié :
  - Vite + React 19 + TypeScript strict + Motion, alias `@domain/<contexte>` ;
  - `deno.json` ;
  - `supabase/` (config initialisée, `migrations/`, `functions/_shared/`, `seed.sql`) ;
  - `features/` avec un scénario de socle vert sur tablette et téléphone ;
  - `playwright.config.ts` (playwright-bdd) et `playwright.legacy.config.ts` ;
  - `.env.example` et `.gitignore`.
- [x] Test de contrat de `app/bibliotheque.json` (`scripts/tests/test_bibliotheque.py`, 1 326 cas). Il a révélé 3 paires de leçons de maths du CP avec le même ordre : c'est corrigé.
- [ ] Compléter `tests/legacy/` avec les scripts de vérification utilisés jusqu'ici (parcours des 265 leçons, profils, révisions, espace parent). Deux premiers tests de caractérisation y sont déjà.
- [x] Lot 1 (Socle) : issues #5 (connexion du parent), #6 (univers et personnage guide), #7 (voix), #8 (PWA installable), label `reecriture`.
  - Modèles de domaine (#5 à #7) et critères d'acceptance (#5 à #8) écrits, glossaire et context map complétés.
  - Scénarios **validés par le PO** (`docs/stories/lot-1-decisions.md`, décision 0007). Questions restantes non bloquantes dans `docs/stories/<n>/acceptance.md`.
  - **#6 livrée sur la branche** : domaine `motivation` (40 tests Deno), front (paysages, personnages guides SVG animés avec Motion, en-tête, page `/demonstration` réservée aux tests), review approuvée, E2E 82/82. PR pas encore ouverte.
  - **#7 livrée sur la branche** : sous-domaine `voix` (103 tests Deno au total), lecture à voix haute des consignes avec le caractère de chaque personnage guide, surlignage du mot prononcé, Son/Muet mémorisé sur l'appareil, voix bloquée signalée une fois ; décision 0008 ; deux reviews (la première À CORRIGER) ; E2E 140/140 avec #6 et le socle. PR pas encore ouverte.
  - À reprendre plus tard (non bloquant, voir `docs/stories/7/journal.md`) : consignes avec balises à attributs, coupure de Chrome après 15 s de lecture, blocage silencieux sur iOS, entités HTML numériques, message « Réécouter » hors de la page de la consigne.
  - **#8 livrée sur la branche** : manifeste, icônes, service worker (coquille et bibliothèque hors ligne, nouvelle version au lancement suivant), aide iPad/iPhone ; E2E sur le build de production (`playwright.pwa.config.ts`) 28/28 ; deux reviews (la première À CORRIGER).
  - **PR du lot 1 ouverte** (#6, #7, #8) : https://github.com/SBA-dev/github-move/pull/9, en attente du merge par le PO.
  - À reprendre plus tard pour la PWA : fichier chargé à la demande après activation d'une nouvelle version (à traiter avant le premier écran `lazy` en production), délai maximal du réseau d'abord, tests de la réponse en erreur, exemples iPhone et Mac de bureau.
  - **#5 commencée** sur `feature/5-connexion-du-parent` (partie de la branche du lot 1) : domaine `famille` (adresse e-mail, code de connexion, demander un lien, ouvrir la connexion avec le code, se déconnecter), 128 tests Deno au total.
  - Pour finir #5 : ajouter `SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SUPABASE_ACCESS_TOKEN` à l'environnement cloud (seul `SUPABASE_DB_PASSWORD` est présent), puis ouvrir une nouvelle session ; puis adaptateur Supabase Auth, écran de connexion, E2E. Après le merge de la PR #9, remettre la branche sur `main`.
  - À retirer plus tard : la page `/demonstration` et le profil préparé en `localStorage` (lots 2 et 3).
  - Première vérification Supabase (`npx supabase link`) non faite : les secrets `SUPABASE_*` n'étaient pas présents dans la session.
- [x] Lot 2 (Famille) : issues écrites, label `reecriture`. Ordre proposé : #10 contrôle parental de l'espace parent, #11 créer et modifier un profil enfant (et « Qui joue ? »), #12 réglages, #13 inviter un second parent, #14 supprimer un profil et ses données (et export), #15 choix de la voix sur l'appareil. Ces stories touchent la base : elles demandent Supabase (secrets et Docker).
  - Modèles (#10 à #15) et scénarios écrits sur `feature/lot-2-modele-et-scenarios` : 35 règles, 150 scénarios. Scénarios **validés par le PO** (`docs/stories/lot-2-decisions.md`, décision 0009). #10 (contrôle parental) : domaine et écran faits sur `feature/10-controle-parental`, review approuvée, E2E à exécuter avec #5 et #11. #15 (choix de la voix) : livrée sur `feature/15-choix-de-la-voix`, deux reviews (la première À CORRIGER), E2E 31/32 (le scénario de la déconnexion attend #5) ; #11 à #14 demandent Supabase (secrets et Docker).
- [x] Lots 3 à 7 : issues écrites (label `reecriture`), à partir du comportement actuel de `app/` :
  - lot 3 (Jouer une leçon) : #16 à #24 ;
  - lot 4 (Parcours) : #25 à #29 ;
  - lot 5 (Motivation) : #30 à #33 ;
  - lot 6 (Accompagnement) : #34 à #43 (leçons personnelles découpées en #39, #40, #41) ;
  - lot 7 (Bascule) : #44 à #46.
  Chaque issue relève les défauts du legacy et ses questions ouvertes, à trancher à la validation des scénarios de son lot.

### 2. Contenu : lecture et écriture au CP (commencé, pas encore livré)

On suit le guide fondamental « Pour enseigner la lecture et l'écriture au CP ».

**Nouveau type d'exercice `decodage`**, avec deux modes :
- *lire* : l'enfant lit à voix haute, puis écoute la bonne lecture pour se corriger ;
- *entendre* : l'enfant entend une syllabe ou un mot et le choisit.

**Environ 23 leçons, dans l'ordre des graphèmes du guide** :
1. a, é, i, o, u
2. l
3. r
4. f
5. j
6. ou
7. e, eu
8. syllabes CVC et CCV, lettres muettes
9. v, ch
10. p, t
11. b, d
12. m, n, gn
13. z, s, ss
14. es
15. c, k, qu, g, gu
16. an, en
17. on, in, un
18. oi, oin
19. au, eau, è, ê
20. ai, ei, er, ez, et
21. ph, h, c, ç, g
22. ill, il, y, tion
23. consonnes doubles

**Chaque leçon** enchaîne syllabes, mots, phrase ou texte, puis dictée. Elle n'utilise que des mots **décodables** avec les graphèmes déjà vus. Elle cite le guide avec `guide=("cp-lecture", passage)`.

**Ensuite :**
- retirer `fr-cp-sons-ou-on-an`, `fr-cp-syllabes` et `fr-cp-voix-haute` ;
- placer les autres leçons de français du CP après la progression de décodage ;
- puis faire la lecture au CE1.

### 3. Fait récemment

- [x] Réglage « temps d'écran » et écran de pause retirés de `app/` (décision 0005).

## Reprise dans une nouvelle session (Supabase configuré)

Le PO a ajouté les variables `SUPABASE_URL`, `SUPABASE_PROJECT_REF`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` et `SUPABASE_ACCESS_TOKEN` à l'environnement cloud (`SUPABASE_DB_PASSWORD` y était déjà). Projet de développement : `savanturier-dev`, référence `cxptcwkegwhdmhqjxttv`, région Irlande (`eu-west-1`).

À faire en premier :
1. [x] Variables présentes (vérifié le 2026-10-23, sans afficher les valeurs).
2. [x] `npx supabase link` réussi. Réseau : l'API HTTPS du projet répond, mais pas Postgres en direct (ports 5432 et 6543 fermés). [x] Migration vide de vérification appliquée par l'API de gestion, puis retirée (2026-10-23) : la chaîne de migration fonctionne depuis le conteneur cloud. Règle d'autorisation dans `.claude/settings.json`.
3. [x] Le PO a choisi les tests contre le projet en ligne `savanturier-dev` : décision 0010. Le projet est en `eu-west-1` (Irlande) : le PO garde l'Irlande, la doc est corrigée.
4. Reprendre #5 (adaptateur Supabase Auth, écran de connexion, E2E), puis #11 à #14.

Branches en cours, chacune partie de la précédente, rien n'est mergé dans `main` : `claude/stoic-faraday-0qy6ez` (lot 1, PR #9) → `feature/5-connexion-du-parent` → `feature/lot-2-modele-et-scenarios` → `feature/10-controle-parental` → `feature/15-choix-de-la-voix`. À part, partie de `main` : `chore/tests-legacy` (339 tests de caractérisation).

## Point d'arrêt du 2026-10-23 (après-midi)

- Mergé dans `main` : lot 1, #5 (connexion du parent), modèles et scénarios du lot 2, #10 (contrôle parental), #15 (choix de la voix), modèles et scénarios du lot 3 validés par le PO (« OK pour tout », décisions 0012 et 0013).
- En cours : **#16** sur `feature/16-etapes-puis-exercices` (poussée). Domaine (6 cycles, 333 tests) et câblage faits. Reste : review, E2E (les scénarios qui exigent de répondre dépendent de #17), PR. Puis #17 → #23 → #24 (première leçon jouable de bout en bout).
- Beta immédiate : l'application actuelle publiée (https://claude.ai/artifact/K6kBG7pBSBhiUoBmocH4tm), identique à `app/` sur `main`.
- Connu : le scénario PWA « Une nouvelle version s'applique au lancement suivant » échoue sur `main` (le step ouvre `/demonstration`, absente du build de production) ; certains agents ont reçu une erreur d'API (modèle refusé pour l'organisation) : forcer un autre modèle.
