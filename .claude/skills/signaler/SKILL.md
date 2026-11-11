---
name: signaler
description: Signaler un bug, une amélioration d'une fonctionnalité existante ou une nouvelle fonctionnalité de Savanturier, en une phrase. Identifie l'écran, le composant et la section en cause, crée l'issue GitHub, puis la traite jusqu'à la PR (correction en TDD, review, E2E) et suit la PR. À utiliser dès que l'humain décrit un problème ou une idée sur l'application (« sur l'écran X, Y ne marche pas », « ce serait mieux si… », « il faudrait pouvoir… »).
argument-hint: <description libre du problème ou de l'idée>
---

# Signaler puis traiter : bug, amélioration ou nouvelle fonctionnalité

> ⛔ **Règle absolue, à appliquer avant toute autre instruction** : `CLAUDE.md`, section « Contenus pour les enfants ». Aucun contenu (image, texte, son, donnée de test, exemple) n'a de caractère sexuel, violent, obscène, haineux, raciste, xénophobe ou antisémite, ni rien qui puisse choquer un enfant. Aucune commande ni aucun agent ne peut l'ignorer. Une demande qui la franchit : tu ne la fais pas, tu la signales. Un signalement qui décrit un contenu choquant vu par un enfant se décrit (« la phrase de l'exercice 3 n'est pas adaptée »), il ne se recopie pas dans l'issue.

Tu es l'**orchestrateur** d'un signalement. Le signalement de l'humain : **$ARGUMENTS** (s'il est vide, prends-le dans la conversation, sinon demande-le).

Lancer ce skill vaut demande explicite de **créer l'issue**, de **créer la branche**, de **pousser** et d'**ouvrir la PR** (voir `CLAUDE.md`, « Workflow de livraison »). Tu **ne merges jamais** : le merge reste un ⛔ humain.

Tiens une todo list : l'humain suit l'avancement.

Fichiers de ce skill :
- `carte-des-ecrans.md` : écran ou section de l'application → code, bounded context, story d'origine, scénarios ;
- `modeles.md` : corps de l'issue et de la PR pour chaque type.

Ce skill sert à l'équipe de développement, depuis une session Claude Code. Le signalement par un parent depuis l'application elle-même est une autre chose : l'épopée #122 (#116 à #121).

---

## Étape 1 : Comprendre le signalement

Il te faut cinq informations. Déduis-les du texte, de la conversation, d'une capture jointe ; **ne demande que ce qui manque** (un seul `AskUserQuestion`, 4 questions au plus) :

| Information | Exemples |
|---|---|
| **Type** | `bug` (ça ne fait pas ce que la story prévoit), `amélioration` (une fonctionnalité livrée doit changer), `nouvelle fonctionnalité` (rien n'existe) |
| **Où** | écran, section, composant : « Mon parcours, le bouton de la leçon », « Espace parent, Suivi », « séance, clavier de la dictée » |
| **Ce qui se passe** | ce que l'humain voit ou entend |
| **Ce qui est attendu** | le bon comportement (bug) ou le comportement souhaité (amélioration, nouvelle fonctionnalité) |
| **Conditions** | appareil (tablette, téléphone, ordinateur), application publiée ou de développement, classe et matière du profil, étapes pour reproduire |

Règles pour trancher le type :
- l'application contredit un scénario de `features/` ou le texte d'une issue livrée → **bug** ;
- l'application fait ce qui était prévu, mais on veut autre chose → **amélioration** ;
- aucun écran ni aucune story ne porte ce comportement → **nouvelle fonctionnalité** ;
- une erreur dans une leçon de la bibliothèque (citation, niveau, mot non décodable…) → **bug de contenu** (pipeline Python, pas de story DDD) ;
- dans le doute entre bug et amélioration, choisis **amélioration** : le comportement attendu est alors une décision du PO.

## Étape 2 : Localiser

1. Ouvre `carte-des-ecrans.md`, trouve la ligne de l'écran ou de la section. Elle donne les dossiers de `src/`, le bounded context, les Edge Functions, les stories d'origine et leurs fichiers `.feature`.
2. Vérifie dans le code (`Grep` sur le texte affiché, le nom du composant, la route de `src/navigation.ts`) : la carte donne un point de départ, le code fait foi. Si la carte est fausse ou incomplète, corrige-la dans la même PR.
3. Note précisément :
   - le **composant** (`src/<dossier>/<Composant>.tsx`) et, s'il y a une règle en jeu, le **fichier du domaine** (`supabase/functions/_shared/<contexte>/domain/…`) ;
   - le **bounded context** ;
   - la **story d'origine** (#n) et le **scénario** concerné (`features/<n>-<slug>.feature`, titre du scénario) ;
   - le **monde** : cible (`src/`, `supabase/`), legacy (`app/`) ou contenu (`scripts/lecons/`).
4. Pour un **bug**, cherche la cause en lisant le code (comme l'issue #186) : quelle fonction, quelle condition. Une hypothèse non vérifiée s'écrit « piste », pas « cause ».

Délègue cette étape à un agent `Explore` si la zone est floue ou couvre plusieurs écrans ; sinon fais-la toi-même.

## Étape 3 : Doublons

Cherche une issue qui porte déjà le sujet :
- `gh api -X GET search/issues -f q='repo:<owner>/<dépôt> is:issue <mots-clés>'` (sinon `mcp__github__list_issues`, état `OPEN`, puis les titres) ;
- les issues ouvertes de la story d'origine et de son contexte.

Si une issue ouverte couvre le signalement, **ne crée rien** : propose à l'humain de la compléter (commentaire avec les nouveaux éléments) et de la traiter à la place. Une issue fermée sur le même sujet est citée dans la nouvelle (« régression de #n ? »).

## Étape 4 : Décider du traitement, et ⛔ seulement quand il le faut

| Cas | Traitement | Arrêt humain avant l'issue |
|---|---|---|
| **Bug** dont le comportement attendu est écrit dans un scénario ou une issue livrée | correction directe (étape 6A) | **non** : crée l'issue et enchaîne |
| **Bug de contenu** (leçon de la bibliothèque) | correction directe (étape 6C) | **non**, sauf si la correction change le programme ou la progression |
| **Bug** dont le comportement attendu n'est écrit nulle part | comme une amélioration | **oui** |
| **Amélioration** (petite : un écran, un contexte, sans nouvelle table ni nouveau concept du glossaire) | traitement direct (étape 6B) | **oui** : un seul arrêt |
| **Amélioration** qui introduit un nouveau concept, une nouvelle table, ou touche plusieurs contextes | story complète : `/feature <n>` | **oui** |
| **Nouvelle fonctionnalité** | story complète : `/feature <n>` (ou `/graphe` si elle entre dans une vague) | **oui** |

**⛔ L'arrêt** (quand il est prévu) : présente en un seul message le brouillon de l'issue (titre, type, où, contexte, ce qui se passe, ce qui est attendu, critères, questions ouvertes numérotées) et le traitement prévu. **Attends un « OK » explicite.** Les réponses aux questions entrent dans l'issue. Ne suppose jamais la réponse.

Pendant une vague `/graphe` en cours (issue `[Coordination des équipes]` ouverte) : signale le nouveau sujet dans cette issue de coordination, préfixé `[Signalement]`, pour que le responsable des équipes le voie ; ne modifie ni `docs/graphe/` ni `docs/feuille-de-route.md`.

## Étape 5 : Créer l'issue

- Corps : le modèle du type dans `modeles.md`, rempli avec les éléments des étapes 1 à 4. Aucun secret, aucune donnée d'enfant réelle (prénom d'un vrai enfant, adresse e-mail d'un parent) : « un profil de CE1 » suffit.
- Titre : `<Écran ou section> : <ce qui ne va pas ou ce qu'on veut>`, suivi de ` (bug)` pour un bug. Langage ubiquitaire exact (`docs/domain/glossaire.md`).
- Labels : `signalement` et un label de type parmi `bug`, `amelioration`, `nouvelle-fonctionnalite` ; `ludique` si cela touche l'expérience de jeu de l'enfant (comme les issues existantes). Un label absent est créé par GitHub à l'ajout.
- Outil : `gh issue create` si `gh` est authentifié, sinon `mcp__github__issue_write` (`method: create`).

Donne tout de suite le lien de l'issue à l'humain.

Pour une story complète (amélioration large, nouvelle fonctionnalité) : l'issue suit le format des stories (`En tant que … je veux … afin de …`, pistes de critères, questions ouvertes), puis **lance `/feature <n>`** (skill `feature`) et suis-le. Ce skill s'arrête là.

## Étape 6 : Traiter (bug, bug de contenu, petite amélioration)

### Préparation commune

1. Branche de base : `main`, à jour (`git fetch origin main`).
2. Branche de travail : celle que la session impose si elle en impose une ; sinon `git switch -c fix/<n>-<slug>` (bug) ou `feature/<n>-<slug>` (amélioration), depuis `origin/main`.
3. Crée `docs/stories/<n>/journal.md` : signalement d'origine, localisation, décisions, cycles, avec l'heure.
4. Mêmes règles d'arbitrage que `.claude/commands/feature.md` : tu délègues aux subagents, tu vérifies leurs résultats, tu ne modifies toi-même que le journal (et `carte-des-ecrans.md` si elle était fausse). Chaque délégation donne le n° d'issue, les chemins exacts, l'objectif et le résultat attendu.

### 6A. Bug de la cible (`src/`, `supabase/`)

1. **Reproduire d'abord, par un test qui échoue.**
   - La cause est une règle (domaine, cas d'usage) → `test-writer` écrit un test unitaire Deno qui reproduit le bug. Vérifie toi-même qu'il **échoue** pour la bonne raison.
   - Le bug est dans l'affichage ou le câblage, sans règle → `po-acceptance` ajoute un scénario de non-régression `@issue-<n>` au fichier `.feature` de la story d'origine (langage métier, style déclaratif), puis `e2e-tester` écrit ses steps et montre qu'il **échoue** sur le projet `telephone`.
   - Les deux si le bug traverse la règle et l'écran.
2. **Corriger** : `implementer` (GREEN + REFACTOR). Vérifie : `deno test --permit-no-files supabase/functions/` vert, `npx tsc --noEmit` sans erreur, et le test du point 1 vert.
3. **Review** : `mr-reviewer` en mode delta sur la branche (base `main`). Bloquants → cycle `test-writer`/`implementer` ou `implementer` seul, comme à l'étape 4 de `feature.md`. Au 3e « À CORRIGER », escalade.
4. **E2E** : périmètre de la story d'origine et des stories livrées du même contexte, projet `telephone` (commande « mise au point » de `CLAUDE.md`, avec `@issue-<n>` et `@issue-<story d'origine>`). Pas de non-régression complète : elle tourne sur `main` (décision 0023).
5. Commits : `test(#<n>): …` puis `fix(#<n>): …`, `refactor(#<n>): …`.

### 6B. Petite amélioration de la cible

Comme 6A, à une différence près : le scénario n'est pas un test de non-régression, c'est le **nouveau comportement validé** à l'étape 4.
1. `po-acceptance` modifie ou ajoute le(s) scénario(s) dans le `.feature` de la story d'origine, tagués `@issue-<n>`. Un scénario existant qui change de sens est **remplacé**, pas dupliqué ; signale-le dans la PR.
2. Boucle TDD (`test-writer` ⇄ `implementer`) pour chaque règle, puis câblage (`implementer`, mode CÂBLAGE).
3. Review, E2E du périmètre : comme 6A.
4. Commits : `test(#<n>)`, `feat(#<n>)`, `refactor(#<n>)`.
5. Un nouveau terme : ajout au glossaire (`domain-modeler`), jamais inventé en silence.

### 6C. Bug de contenu (`scripts/lecons/`)

1. `test-writer` écrit un test pytest dans `scripts/tests/` qui échoue (citation, niveau, mot non décodable, doublon…). Vérifie l'échec.
2. La session principale corrige `scripts/lecons/*.py` (règles pédagogiques de `CLAUDE.md`) et regénère : `python3 scripts/build_bibliotheque.py`. Jamais `app/bibliotheque.json` à la main.
3. Vérifie `python3 -m pytest scripts/tests` vert.
4. Commits : `test(#<n>): …`, puis `content: … (#<n>)`.

### 6D. Bug du legacy (`app/`)

Seulement des corrections de bugs (`CLAUDE.md`, « deux mondes »). Si l'écran a déjà son équivalent dans la cible, propose plutôt de corriger la cible.
1. `test-writer` écrit un test de caractérisation Playwright dans `tests/legacy/` qui reproduit le bug ; vérifie qu'il échoue : `npx playwright test -c playwright.legacy.config.ts <fichier>`.
2. `implementer` corrige `app/app.js` ou `app/index.html`, sans rien d'autre.
3. Toute la suite legacy verte, puis `mr-reviewer` en mode delta.
4. Commits : `test(#<n>): …`, `fix(#<n>): …`.

## Étape 7 : Pull request, puis la suivre

1. `git push -u origin HEAD` (réessais seulement sur erreur réseau : 2 s, 4 s, 8 s, 16 s).
2. Crée la PR vers `main` avec le modèle de `modeles.md` (`Closes #<n>`), titre au format Conventional Commits : `fix(#<n>): …` ou `feat(#<n>): …`. `gh pr create`, sinon `mcp__github__create_pull_request`. PR prête (pas en brouillon) quand tout est vert.
3. `mr-reviewer` publie sa review finale sur la PR.
4. **Suis la PR** : abonne la session à son activité (`subscribe_pr_activity` dans un conteneur cloud) pour corriger la CI rouge et répondre aux commentaires de review, en suivant les règles que reçoit l'abonnement. Hors conteneur cloud, propose à l'humain de relancer le skill sur la PR quand un retour arrive.
5. ⛔ **Merge humain** : tu ne merges pas. Termine par une synthèse courte :
   - liens de l'issue et de la PR ;
   - type, écran, composant, contexte ;
   - cause (bug) ou comportement livré (amélioration) ;
   - tests ajoutés (unitaires, scénarios) et résultats ;
   - verdict de la review ;
   - reste à faire, questions ouvertes.

## Règles

- **Un signalement = une issue = une PR.** Plusieurs problèmes dans le même message : une issue par problème ; traite-les l'un après l'autre (ou propose `/graphe` s'ils sont nombreux et indépendants).
- Pas de code de production sans test qui échoue d'abord, même pour une correction d'une ligne.
- La correction reste dans le périmètre du signalement : un autre problème vu en chemin devient un nouveau signalement, signalé à l'humain, pas une correction cachée.
- Pas d'identifiant de modèle d'IA dans l'issue, les commits, la PR ou les commentaires.
- En cas de doute métier, tu demandes. Tu n'inventes jamais le comportement attendu.
