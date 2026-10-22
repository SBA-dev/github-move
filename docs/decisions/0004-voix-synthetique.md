# 0004 : Voix de synthèse pour les poésies et les chansons

**Statut** : Acceptée · 2026-10-22

## Contexte

On a essayé de remplacer la voix de synthèse par de vrais enregistrements, découpés vers par vers, pour aider l'enfant à apprendre une poésie ou une chanson (essai avec « Au clair de la lune »). Les seuls enregistrements libres trouvés étaient instrumentaux, sans paroles, ce qui ne répond pas au besoin. Les sources possibles (Wikimedia Commons, Gallica, Eduscol) étaient en partie inaccessibles.

## Décision

Les poésies et les chansons sont **lues par la voix de synthèse**, vers par vers. Dans la stack cible, ce sont des MP3 générés une seule fois avec une voix neuronale, servis par le CDN, avec un repli sur la voix du navigateur. Un parent peut toujours ajouter son propre enregistrement à une leçon personnelle.

## Conséquences

- La même voix est utilisée partout, disponible hors ligne et sans droits d'auteur à gérer.
- Les mélodies des chansons ne sont pas chantées.
