# Savanturier : conventions du projet pour Claude Code

Ce fichier est lu par la session principale et par tous les subagents.
Il contient les règles communes. Les méthodes détaillées sont dans `.claude/skills/`.

Savanturier est une application de révision pour les enfants de l'école élémentaire (CP → CM2),
alignée sur les programmes officiels et les guides fondamentaux d'Eduscol.
On échange avec l'utilisateur **en français**.

## État du projet : deux mondes

| | Existant (legacy) | Cible |
|---|---|---|
| Front | `app/` : HTML/CSS/JS vanilla (`index.html`, `app.js`), publié comme artifact claude.ai | `src/` : React + TypeScript (Vite), PWA, animations Motion |
| Données | capacités de l'artifact (`db`, `user`, `assets`, `sample`) | Supabase |
| Contenu | `app/bibliotheque.json`, généré par `scripts/` (Python) | inchangé : le même JSON est servi au nouveau front |

Règles de cohabitation :
- **Toute nouvelle fonctionnalité** se fait dans la stack cible, en suivant ce fichier.
- Dans `app/` on ne fait **que des corrections de bugs**. Chaque correction est précédée d'un test de caractérisation Playwright qui reproduit le bug (`tests/legacy/`).
- Une fonctionnalité du legacy est réécrite dans la cible **story par story**. Elle est supprimée de `app/` quand son équivalent est livré.
- Le **pipeline de contenu** (`scripts/`, `sources/`) reste en Python. Ce n'est pas du code métier : il produit des données.

## Stack cible

- **Front** : React + TypeScript (Vite), PWA (installable, hors ligne via IndexedDB + synchronisation)
- **Backend** : Supabase (Postgres, Auth, Storage, **Edge Functions en Deno/TypeScript**), hébergé dans l'UE
- **Logique métier** : TypeScript pur sous `supabase/functions/_shared/<contexte>/domain/`
- **Tests unitaires** : `Deno.test` + `@std/assert` (import map de `deno.json`, version fixée)
- **Tests d'acceptance (BDD/E2E)** : playwright-bdd (Gherkin exécuté par Playwright)
- **IA** : API Claude, appelée **uniquement** depuis une Edge Function (clé dans `Deno.env`)
- **Voix** : MP3 pré-générés (voix neuronale) servis par le CDN. Repli sur la synthèse vocale du navigateur.
- **Dépôt** : GitHub. Les user stories sont des **GitHub Issues**. Selon l'environnement, on y accède par la CLI `gh` ou par les outils MCP GitHub (`mcp__github__*`).

## Commandes

| But | Commande |
|---|---|
| Démarrer Supabase en local | `supabase start` |
| Réinitialiser la base (migrations + seed) | `supabase db reset` |
| Nouvelle migration | `supabase migration new <nom>` |
| Servir les Edge Functions | `supabase functions serve` |
| Lancer le front | `npm run dev` (http://localhost:5173) |
| Tests unitaires | `deno test --permit-no-files supabase/functions/` |
| Typecheck d'une Edge Function | `deno check --node-modules-dir=none supabase/functions/<nom>/index.ts` |
| Lint / format | `deno lint --permit-no-files supabase/functions/ && deno fmt --check --permit-no-files supabase/functions/` |
| Typecheck du front | `npx tsc --noEmit` |
| Build du front | `npm run build` |
| Tests E2E d'une story | `npx bddgen --tags "@issue-<n>" && npx playwright test --grep @issue-<n> --grep-invert "@depend-de|@envoi-email"` (les scénarios tagués `@depend-de-<m>` attendent la story #m ; `@envoi-email` : voir plus bas) |
| Tous les tests E2E (non-régression) | `npx bddgen --tags "<stories livrées : @socle or @issue-5 or …>" && NODE_USE_ENV_PROXY=1 npx playwright test --grep-invert "@depend-de|@envoi-email"` (sans `--tags`, `bddgen` échoue sur les étapes des stories à venir) |
| Tests E2E qui envoient un vrai e-mail de connexion (avant un merge qui touche la connexion, ou la mise en ligne) | `npx bddgen --tags "@issue-5" && NODE_USE_ENV_PROXY=1 npx playwright test --grep @envoi-email` |
| Tests E2E de la PWA (#8, build de production) | `npx bddgen -c playwright.pwa.config.ts && npx playwright test -c playwright.pwa.config.ts` |
| Regénérer la bibliothèque | `python3 scripts/build_bibliotheque.py` |
| Regénérer l'index des programmes | `python3 scripts/index_programmes.py` |
| Tests du pipeline de contenu | `python3 -m pytest scripts/tests` |
| Servir le legacy | `cd app && python3 -m http.server 8765` |
| Tests de caractérisation du legacy | `npx playwright test -c playwright.legacy.config.ts` |

> ⚠️ Tous les agents se fient à ce tableau. Tenez-le à jour quand un script change.
> Dans un conteneur cloud, Chromium est déjà installé : Playwright le trouve via `PLAYWRIGHT_BROWSERS_PATH`. Ne lancez jamais `playwright install`. Les steps E2E qui appellent Supabase doivent y être lancés avec `NODE_USE_ENV_PROXY=1` (sinon le processus Node de Playwright ne passe pas par le proxy HTTPS du conteneur) ; les scénarios tagués `@envoi-email` (18 cas de #5, plus quelques-uns de #10, #11 et #13) consomment environ 44 des 100 e-mails de connexion autorisés par heure sur le projet de développement : ils sont exclus des exécutions courantes.
> Le hook `.claude/hooks/session-start.sh` installe Deno, pytest et les dépendances npm (dont la CLI Supabase : `npx supabase …`) au démarrage de chaque session cloud.
> `supabase start` a besoin de Docker, absent du conteneur cloud : les scénarios qui touchent Supabase tournent donc contre le projet de développement en ligne `savanturier-dev` (décision 0010, sur une branche suivante), et les migrations s'y appliquent par l'API de gestion.

## Architecture (hexagonale, DDD)

```
supabase/
  migrations/                      # SQL versionné. RLS obligatoire sur chaque table.
  functions/
    _shared/
      <contexte>/                  # un dossier par bounded context
        domain/                    # entités, value objects, agrégats, événements, erreurs métier
                                   # → TypeScript PUR : aucun import Supabase, Deno.*, fetch, DOM
        application/               # cas d'usage (1 fichier = 1 commande métier) + ports (interfaces)
        infrastructure/            # adaptateurs : repositories Supabase, clients externes, mappers
        test_utils/                # fakes in-memory des ports (pour les tests)
    <nom-fonction>/index.ts        # handler HTTP FIN : parse → cas d'usage → réponse
src/                               # front React : affichage, animations, appels aux Edge Functions
features/
  <n>-<slug>.feature               # scénarios Gherkin (langage métier, en français)
  steps/                           # step definitions playwright-bdd
docs/
  domain/glossaire.md              # langage ubiquitaire : la référence
  domain/context-map.md            # bounded contexts et leurs relations
  stories/<n>/                     # artefacts de travail d'une story (modèle, critères, journal)
  format-lecons.md                 # format JSON des leçons (contrat entre le contenu et le moteur)
scripts/                           # pipeline de contenu (Python) + scripts/tests (pytest)
sources/                           # programmes officiels et guides Eduscol (PDF + texte extrait)
app/                               # legacy (voir plus haut)
```

**Règle de dépendance** : `handler → application → domain` et `infrastructure → application/domain`.
Le **domaine ne dépend de rien**.

**Domaine partagé avec le front** : l'enfant doit pouvoir faire ses exercices hors ligne. Corriger une réponse, calculer les étoiles ou faire avancer le parcours doit donc fonctionner aussi dans le navigateur.
- Le front **importe le code de `domain/`** (TypeScript pur) via l'alias `@domain/<contexte>`, qui pointe sur `supabase/functions/_shared/<contexte>/domain/index.ts` (configuré dans `vite.config.ts` et `tsconfig.json`). Chaque contexte expose donc son domaine par ce fichier `index.ts`. Le front ne réécrit jamais une règle.
- React ne contient aucune règle métier. Il appelle le domaine ou une Edge Function et affiche le résultat.
- Le serveur reste la source de vérité. Les résultats faits hors ligne sont revalidés par le cas d'usage à la synchronisation.

**Bounded contexts** (détail et relations dans `docs/domain/context-map.md`) :
- **Catalogue pédagogique** : programmes, leçons de la bibliothèque, exercices, compétences
- **Apprentissage** : séances, réponses, étoiles, parcours, test de départ, révisions
- **Motivation** : série, badges, cabane, épisodes, univers. Contexte **à part** : il réagit aux séances terminées et ne modifie jamais une note.
- **Famille** : parents, profils enfants, rattachements et invitations, réglages, contrôle parental
- **Accompagnement** : suivi, rapport de la semaine, devoirs (leçon à faire, mots de la semaine), enregistrements de lecture, leçons personnelles

## Langage ubiquitaire

Décisions déjà prises, à respecter partout (code, interface, scénarios) :
- **Parent** est le seul rôle adulte (pas d'enseignant). L'interface dit « Espace parent ».
- Un parent ne voit **que les enfants auxquels il est rattaché**. Un profil enfant a un ou deux parents. Le second se rattache par un lien d'invitation.
- **Personnage guide** (Noisette, Lumi…) et **Guide fondamental** (guide Eduscol) : jamais « guide » seul.
- Une leçon est **réussie** à 1 étoile (elle ouvre la suivante) et **acquise** à 2 étoiles (compétence et badge).
- **Pas de temps d'écran** : l'application ne limite pas la durée de jeu.

- Le glossaire de référence est `docs/domain/glossaire.md`.
- On utilise **exactement** ces termes dans le code, les tests, les scénarios et les commits.
- Un concept qui manque au glossaire doit être signalé, jamais inventé.
- Code métier en français (noms de classes, méthodes, variables du domaine). Termes techniques en anglais acceptés (`Repository`, `handler`, `mapper`).
- Les termes du format de leçon (`matiere`, `niveau`, `ordre`, `competence`, types d'exercices…) sont déjà du langage ubiquitaire. Le glossaire les reprend tels quels.

## Principes craftsmanship (non négociables)

1. **Aucun code de production sans un test qui l'exige** (TDD). Les commits le prouvent.
2. **Petits pas, commits atomiques** au format Conventional Commits avec le n° d'issue :
   `test(#42): …`, `feat(#42): …`, `refactor(#42): …`, `fix(#42): …`.
   Hors story (contenu, outillage) : `content: …`, `chore: …`, `docs: …`.
   Description en français. Pas d'identifiant de modèle d'IA dans les commits, PR ou commentaires de code.
3. **Nommage métier**, fonctions courtes, pas de commentaire qui compense un mauvais nom.
4. **Pas de `any`**, pas de `// @ts-ignore`, pas de code mort, pas de `console.log` oublié.
5. **Pas de logique métier** dans les handlers, dans React ni dans les seules policies RLS.
6. **Le refactor fait partie du « done »**. On laisse le code plus propre qu'on ne l'a trouvé.
7. **Sécurité Supabase** :
   - RLS activée et policies explicites sur toute nouvelle table
   - jamais de `service_role` key côté client ni dans le front
   - les Edge Functions créent le client Supabase avec le JWT de l'appelant pour que la RLS s'applique
   - toute entrée d'une Edge Function est validée avant d'atteindre le domaine
   - aucun secret dans le code : tout passe par `Deno.env` / `.env` (jamais commité)

## Données d'enfants (RGPD)

- Hébergement **dans l'UE** (projet Supabase en région Irlande, `eu-west-1`, fonctions dans une région européenne).
- Seul le **parent** a un compte. L'enfant est un profil rattaché à un ou deux parents : prénom ou pseudo et classe, sans e-mail, sans mot de passe, sans date de naissance complète.
- Minimisation : on ne stocke que ce qui sert à l'apprentissage ou au suivi parental.
- Les enregistrements de voix de l'enfant expirent automatiquement après 30 jours.
- Le parent peut exporter et supprimer toutes les données d'un profil.
- Aucun traceur publicitaire ni service d'analyse tiers.
- Rien de ce que produit l'enfant n'est envoyé à l'IA sans un cas d'usage explicite et documenté dans la story.

## Règles pédagogiques et de contenu

- Toute leçon est rattachée à une section des programmes officiels (`programme.section`). Sa `citation` est recopiée **mot pour mot**.
- Une leçon qui s'appuie sur un guide Eduscol cite son passage via `guide=(clé, passage)`. Le build vérifie la citation dans `sources/texte/guides/`. Une citation introuvable fait échouer le build.
- On respecte le niveau : rien hors programme. Au CP, les mots à lire sont **décodables** avec les graphèmes déjà étudiés.
- Ne jamais éditer `app/bibliotheque.json` ni `app/programmes-index.json` à la main. On modifie `scripts/lecons/*.py`, puis on regénère.
- Une nouvelle logique dans `scripts/` vient avec un test pytest. La bibliothèque générée est validée par un test de schéma.
- Le format JSON des leçons (`docs/format-lecons.md`) est un contrat entre le contenu et le moteur. Tout changement met à jour la doc, le pipeline et le domaine dans la même story.

## Accessibilité et expérience enfant

- Tout texte de consigne peut être lu à voix haute. Le mode dys (police, espacement) est respecté partout.
- Les animations respectent `prefers-reduced-motion`.
- Les cibles tactiles mesurent au moins 44 px. L'interface s'utilise sans clavier sur tablette et au clavier sur ordinateur.
- L'interface tient à 360 px de large, sans défilement horizontal.
- Un retour d'erreur n'est jamais punitif : un encouragement, puis une nouvelle chance.

## Décisions et feuille de route

- Les décisions d'architecture sont dans `docs/decisions/` (une par fichier, numérotées). On en ajoute une à chaque choix structurant, plutôt que de modifier une décision passée.
- L'état du projet et les prochaines étapes sont dans `docs/feuille-de-route.md`. On le met à jour à la fin de chaque session de travail.

## Skills du projet

| Skill | Contenu |
|---|---|
| `.claude/skills/tdd/` | Cycle red/green/refactor, conventions Deno.test, fakes |
| `.claude/skills/bdd-gherkin/` | Rédaction des scénarios, example mapping, playwright-bdd |
| `.claude/skills/ddd/` | DDD stratégique et tactique, exemples TypeScript |
| `.claude/skills/craftsmanship/` | Checklist de review, code smells, refactorings, sécurité |

## Workflow de livraison

`/feature <n° issue>` orchestre toute la livraison d'une story :
domaine → critères d'acceptance → ⛔ validation humaine → TDD → review → E2E → PR → ⛔ merge humain.
Voir `.claude/commands/feature.md`.

- Lancer `/feature` ou `/graphe` vaut demande explicite d'ouvrir la PR de la story (de chaque story lancée pour `/graphe`). En dehors de ce workflow, on n'ouvre pas de PR sans qu'on le demande.
- On travaille sur la branche fournie par la session ou créée pour la story, jamais directement sur la branche par défaut.
- La **branche de base** est `main`, branche par défaut du dépôt. Chaque story part de `main` à jour et y revient par PR.
- Les deux ⛔ sont des arrêts réels : l'agent attend la réponse humaine et ne la suppose jamais.

### Plusieurs stories en parallèle : `/graphe`

`/graphe [lot <n> | issues]` livre plusieurs stories **en même temps**, une **équipe** par story (décision 0017) :
- le graphe des dépendances est `docs/graphe/stories.md` ; une story ne commence son code que quand ses dépendances sont mergées ;
- le **responsable des équipes** (`.claude/commands/graphe.md`) lance 2 équipes par défaut, 3 au maximum (`docs/graphe/nombre-d-equipes.md`), suit leurs avancées, partage les informations utiles, regroupe les validations ⛔, accorde les verrous (`base`, `email`, `merge`) et ordonne les merges ;
- chaque **équipe** (`.claude/commands/equipe.md`) est une session, son orchestrateur et les 6 subagents, sur sa branche `feature/<n>-<slug>`, et suit `/feature` avec les règles du parallèle ;
- les ⛔ restent : validation des cadrages (groupée) et autorisation de merge (par PR ou pour toute la vague). **Une fois autorisée, l'équipe merge elle-même**, un merge à la fois, après avoir intégré `main` et tout repassé au vert ;
- la coordination passe par les **issues GitHub** : commentaire « Avancement » de chaque équipe sur l'issue de sa story, issue `[Coordination des équipes] Vague <k>` tenue par le responsable (tableau, annonces, questions au PO). Commentaires préfixés `[Responsable]` / `[Équipe #<n>]`, jamais de secret ni de donnée d'enfant ;
- pendant une vague, seul le responsable modifie `docs/feuille-de-route.md` et `docs/graphe/` ; le glossaire et la context map ne reçoivent que des ajouts.

## Équipe d'agents (`.claude/agents/`)

| Agent | Rôle | Écrit dans |
|---|---|---|
| `domain-modeler` | DDD stratégique : contextes, agrégats, glossaire | `docs/domain/`, `docs/stories/<n>/` |
| `po-acceptance` | BDD : scénarios Gherkin | `features/*.feature`, `docs/stories/<n>/` |
| `test-writer` | TDD phase RED | `*_test.ts`, `test_utils/`, `scripts/tests/` uniquement |
| `implementer` | TDD phases GREEN + REFACTOR, câblage | code de prod, migrations, front, `scripts/` (jamais les tests) |
| `mr-reviewer` | Review qualité, DDD, sécurité, RGPD, accessibilité | rien (lecture seule) |
| `e2e-tester` | Exécution des scénarios BDD | `features/steps/` uniquement |

Le contenu pédagogique (`scripts/lecons/`) n'est pas une story DDD. Il est produit par la session principale, en respectant les règles pédagogiques ci-dessus.
