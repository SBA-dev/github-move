# Journal de la story #182 : la voix de l'application en MP3 pré-générés (Piper, voix « tom »)

Équipe lancée par le responsable des équipes (vague 2, issue de coordination #193).
Branche : `feature/182-voix-mp3-piper`, partie de `main` (`aa75d97`). Base : `main`. Décision réservée : 0043.

## 2026-11-09

- 23:55 UTC : démarrage. Lecture de #182, de #193, des décisions 0004 et 0008, du code de `src/voix/` et de `_shared/voix/domain/`.
- 23:55 UTC : essai réseau. `pypi.org` joignable (paquet `piper-tts`, l'outil Piper). **`git.bksp.space` refusé** par le proxy (403 au CONNECT, refus de politique) : le modèle `fr_FR-tom-medium` ne peut pas être téléchargé depuis la source de l'issue. ESCALADE au PO via le responsable. On ne prend le modèle d'aucune autre source.
