# Modèles : issue et PR

Langage ubiquitaire exact, en français. Aucun secret, aucune donnée d'enfant réelle, aucun contenu interdit (on décrit, on ne recopie pas). Supprime les sections vides plutôt que d'écrire « néant ».

## Issue : bug

Titre : `<Écran ou section> : <ce qui ne va pas> (bug)`

```markdown
Contexte : **<bounded context>** (<écran ou section>, livré par #<story d'origine>). Signalé le <AAAA-MM-JJ> <sur l'application publiée | en développement>.

## Où
- Écran : <écran> (`<route>`), section : <section>
- Composant : `<src/…/Composant.tsx>`
- Règle en jeu : `<supabase/functions/_shared/<contexte>/domain/…>` (si une règle est en cause)
- Scénario d'origine : `features/<n>-<slug>.feature`, « <titre du scénario> »

## Ce qui se passe
- <étapes pour reproduire, appareil, classe et matière du profil>
- <ce qu'on voit ou entend>

## Ce qui est attendu
- <comportement écrit dans le scénario ou l'issue d'origine>

## Cause (lue dans le code)
- <fonction, condition, fichier : ligne> — ou « Pistes » si ce n'est pas vérifié

## Correction prévue
- Test qui reproduit le bug : <unitaire Deno | scénario de non-régression `@issue-<n>` | pytest | caractérisation legacy>
- Correction : <fichiers>

Signalé avec le skill `signaler`.
```

## Issue : amélioration

Titre : `<Écran ou section> : <ce qu'on veut changer>`

```markdown
Contexte : **<bounded context>** (<écran ou section>, livré par #<story d'origine>).

## Aujourd'hui
- <comportement actuel, avec le scénario qui le décrit>

## Souhaité
En tant que **<parent | enfant>**, je veux <…> afin de <…>.

## Où
- Composant : `<src/…>` ; règle : `<…/domain/…>`
- Scénario(s) à modifier : `features/<n>-<slug>.feature`, « <titre> »

## Critères
- <règle 1, avec un exemple>
- <règle 2>

## Questions ouvertes pour le PO
1. <…>

Signalé avec le skill `signaler`.
```

## Issue : nouvelle fonctionnalité

Titre : `<Ce que la fonctionnalité permet>` (comme une story)

```markdown
Contexte : **<bounded context pressenti>**, à confirmer par `domain-modeler`.

## Story
En tant que **<parent | enfant>**, je veux <…> afin de <…>.

## Où dans l'application
- <écran existant à compléter, ou nouvel écran>

## Pistes de critères
- <…>

## Dépendances
- <stories ouvertes dont elle dépend, ou « aucune »>

## Questions ouvertes pour le PO
1. <…>

Signalé avec le skill `signaler`. Livraison : `/feature <n>`.
```

## PR (bug, bug de contenu, petite amélioration)

Titre : `fix(#<n>): <résumé>` ou `feat(#<n>): <résumé>` (`content: … (#<n>)` pour une leçon).

```markdown
Closes #<n>

## Signalement
<type> sur <écran ou section> (`<composant>`), contexte <bounded context>.

## Cause / changement
- <cause du bug, ou comportement livré>

## Tests
- Test qui échouait avant la correction : `<fichier>` (<commit test(#n)>)
- Unitaires : `deno test --permit-no-files supabase/functions/` <vert>
- Typecheck du front : <OK>
- E2E du périmètre (`telephone`) : <X/X verts, tags lancés>
- <pytest / legacy si concerné>

## Scénarios modifiés
- <scénario remplacé ou ajouté, et pourquoi> (amélioration)

## Review automatique
<verdict de mr-reviewer, non bloquants restants>

## Points d'attention
- <…>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
