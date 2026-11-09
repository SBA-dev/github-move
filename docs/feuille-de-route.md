# Feuille de route

Mise à jour : 2026-11-09 (fin de la vague 1 du graphe). On la met à jour à la fin de chaque session de travail.

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

### Nouvelle application (cible) : en ligne

- **La beta est en ligne** (#45) dans le projet de production `saventurier-prod` (Supabase en Irlande, front chez alwaysdata). Procédure : `docs/publication.md`.
- **Version en ligne : `main` `5d690d3`**, publiée le 07/11 : la beta complète (lots 1 à 5) et l'épopée #95 « leçons plus ludiques » (univers, personnages guides qui évoluent, quête du jour, défis et grand défi, célébrations de l'univers, réponse fausse animée, musiques).
- Livré par la vague 1 du graphe (24/10 → 09/11, coordination #64) : voir `docs/graphe/stories.md` (section « Livrées ») et les mesures dans `docs/graphe/nombre-d-equipes.md`.
- Décisions : `docs/decisions/` jusqu'à 0042 ; prochain numéro libre : **0043**.
- Développement contre le projet en ligne `savanturier-dev` (décision 0010), plan Pro depuis le 03/11 ; parents de test E2E réutilisés (décision 0040).
- Non-régression complète **de nuit** (tâche planifiée, 01:13 heure de Paris), en trois lots sur un cycle de 6 nuits (« nr. 4 », 06/11), si `main` a changé ; avant la PR d'une story, seulement les scénarios qu'elle touche (PO, 28/10 et 04/11) ; en entier avant chaque publication.

## Prochaines étapes

> **Vague 1 en clôture** (« Clôture A », 09/11) : #173 (musique des célébrations de Sports et de Police) est la dernière équipe en cours ; l'issue #64 se ferme à son merge. Vague 2 proposée à **2 équipes** (`docs/graphe/nombre-d-equipes.md`).

### Ce qui reste au PO

- **Changer le mot de passe de la base de production** (apparu sur une capture d'écran le 07/11).
- Contrôle manuel sur tablette et téléphone réels (M1).
- Créer le parent de test de production et son profil, puis ajouter `PARENT_DE_TEST_PRODUCTION_*` à l'environnement de publication : 6 scénarios `@production` et V10 en dépendent.
- Ligne du journal des publications du 07/11 (hors du dépôt).
- Effacer la sauvegarde du 07/11 le 07/12 (garde de 30 jours).
- Restauration d'essai avant d'inviter les familles ; tâche « garder actif » (45.31) ; connecteur GitHub pour la tâche de nuit.

### Candidates pour la vague 2 (dépendances à relever, puis lancement sur demande du PO)

- Épopée #95, suite : #182 (voix en MP3 pré-générés), #183 (écran de séance), #184 (en-tête et dock hors séance).
- Vérifications des saisies du parent : #103, #104 (règle absolue sur les contenus pour les enfants).
- Famille et accompagnement : #13, #14, #38 (cadrées), puis #35, #36, #37, #42, #43, #40, #41.
- Épopée #122 (retours depuis l'application) : #116 à #121.
- Outillage E2E : #86, #87.
- Après la beta : #44 (hors ligne), puis #46 (retrait de `app/`).

### Règles et documents à mettre à jour (relevés pendant la vague 1, à faire en début de vague 2)

- `CLAUDE.md` et `.claude/commands/equipe.md` : nouvelle règle de non-régression (une décision à écrire) ; contournement Playwright/Chromium (dossier `pw/` et `PLAYWRIGHT_BROWSERS_PATH`) ; relancer `bddgen` après chaque changement d'un step ; hooks E2E toujours tagués ; « VERROU merge accordé » **et** tableau à jour avant de merger ; écran commun → chercher les assertions de liste exacte dans tous les `.feature` ; délais longs pour toute story qui joue une séance complète ; port 5173 libre avant un long run ; conteneur lent → session neuve ; une réponse du PO n'est valable que relayée par le responsable sur l'issue de coordination ; passation du responsable : archiver l'ancienne session tout de suite ; une validation de planche ne vaut que pour des planches publiées.
- Skill `gamification` : « une célébration ne retient jamais l'enfant : 1,5 s au plus », avec l'écart de 3 s pour la célébration de l'univers (décision 0039) ; corriger « avance d'une étape à chaque leçon réussie » (#99.11).
- `docs/publication.md` : test de l'environnement qui vérifie que WebDAV vise `www/` ; contournement du navigateur pour les scénarios `@production` ; jeton Supabase avec droits d'écriture. (La sauvegarde sans Docker y est ajoutée.)
- Décision 0033 (point 5) et `docs/decisions/README.md` décrivent encore `data-dessin`, retiré par #161.
- Tâche de nuit : accès à GitHub, à désactiver à la fin du développement.

### Dettes techniques relevées pendant la vague 1

- Front (`src/`) : aucun outil de test unitaire ; l'orchestration de la fin de séance (bug de 106.53) n'est testée qu'en E2E.
- Steps E2E : course « lire le journal, puis terminer la lecture » dans `boite-et-barres.steps.ts:343` et `cabane.steps.ts:130` ; scénarios de #96 instables sous charge.
- Dessins : deux copies du tracé de l'écusson de police (#158) ; jambes et tête de Capitaine Sam à mettre dans `commun/` (106f) ; formes en double SVG/TSX (#127, #131).
- `useReducedMotion()` de Motion lu seulement au montage ; tenue portée à effacer à la suppression d'un profil (#102, #14).
- #100 : magasins IndexedDB copiés, défi affiché « ouvert » avant synchronisation ; #101 : fête perdue sur réseau très lent.
- #128 : record d'un autre exercice affiché un instant, SVG mal formé non détecté au build ; `@issue-128` jamais joué sur `tablette`.
- #137, #140, #126, #98, #131 : détails dans le journal de chaque story (`docs/stories/<n>/journal.md`) et dans l'historique du corps de #64.

### Contenu : lecture et écriture au CP (commencé, pas encore livré)

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

### Fait avant la réécriture

- [x] Réglage « temps d'écran » et écran de pause retirés de `app/` (décision 0005).

## Environnement

- Projet de développement `savanturier-dev` (référence `cxptcwkegwhdmhqjxttv`, Irlande) : variables `SUPABASE_*` dans l'environnement cloud par défaut, migrations par l'API de gestion (pas de Docker dans le conteneur).
- Projet de production `saventurier-prod` : environnement cloud séparé, réservé aux sessions de publication (`docs/publication.md`, § 2.3).
