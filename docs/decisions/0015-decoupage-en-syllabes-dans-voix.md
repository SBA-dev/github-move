# 0015 : Le découpage en syllabes du mode dys est dans le domaine Voix

**Statut** : Acceptée · 2026-10-24 (question technique T3 de #12, tranchée par l'orchestrateur)

## Contexte

Le mode dys affiche les mots de plus de trois lettres en syllabes de couleurs alternées (décision n°8 du lot 2). Le découpage est une règle de langue, à garder hors de React (`CLAUDE.md`). Il sert à tous les textes affichés sur les écrans de l'enfant : consignes, paroles du personnage guide, étapes de leçon, questions et choix, quel que soit le contexte qui les produit.

## Décision

1. Le découpage (`syllabesDuMot`, `syllabesDuTexte`) est une fonction pure de `voix/domain/`, publiée par `@domain/voix`, à côté des mots de la consigne (`mots-de-la-consigne.ts`) : Voix possède déjà la façon dont un texte lu est découpé et montré.
2. C'est un port fidèle de `syllables()` et `readable()` du legacy (`app/app.js`), y compris trois comportements discutables, testés et signalés : « y » compte comme une voyelle, l'apostrophe reste collée à la syllabe, le trait d'union sépare les mots.
3. Famille ne fait que porter le réglage « mode dys » du profil ; le front applique le style et appelle le découpage.

## Options écartées

- **Dans Famille** : Famille porte le réglage, pas les règles de lecture d'un texte.
- **Dans Apprentissage ou le Catalogue** : le découpage sert aussi aux paroles de Motivation et à la page de démonstration.

## Conséquences

- Corriger un des trois comportements discutables est une évolution de Voix, avec ses tests, sans toucher aux écrans.
