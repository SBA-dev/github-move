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

### 1. Préparer le terrain de la nouvelle application

- [ ] Installer **Deno** et la **CLI Supabase** dans l'environnement (script de configuration de l'environnement cloud).
- [ ] Créer une branche **`main`** et en faire la branche par défaut du dépôt.
- [ ] Créer le squelette :
  - `package.json`, Vite + React + TypeScript, alias `@domain` ;
  - `deno.json` ;
  - `supabase/` (config, `functions/_shared/`) ;
  - `features/` ;
  - `playwright.config.ts` et `playwright.legacy.config.ts`.
- [ ] Mettre en place un test de schéma de `app/bibliotheque.json` et un premier test pytest du pipeline (`scripts/tests/`).
- [ ] Reprendre dans `tests/legacy/` les scripts Playwright de vérification utilisés jusqu'ici. Ils parcourent les 265 leçons sans erreur, et ne sont pas encore dans le dépôt.
- [ ] Écrire les premières issues GitHub. Ordre proposé :
  1. Compte famille et profil enfant
  2. Jouer une leçon et gagner des étoiles
  3. Parcours et verrous
  4. Motivation
  5. Accompagnement

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

### 3. En attente d'une décision du PO

- [ ] Retirer le réglage « temps d'écran » et l'écran de pause de `app/` (voir décision 0005).
