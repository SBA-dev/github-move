# Effets sonores

Les effets sonores de l'application de l'enfant sont dans `public/sons/`. Ils ont été choisis par le PO le 2026-10-25, à l'écoute de 27 candidats (story #97, épopée #95). Ils sont branchés par #97 : jusque-là, aucun écran ne les joue et le service worker ne les met pas en cache.

Tous viennent des packs de **Kenney** (kenney.nl), sous licence **CC0 1.0** (domaine public : usage libre, même commercial, sans attribution obligatoire). Les licences des packs sont recopiées dans `public/sons/LICENCE-*.txt`. Les fichiers sont convertis en MP3 mono 128 kbit/s, sans autre retouche.

| Fichier | Événement (skill `gamification`, section 3) | Fichier d'origine | Pack | Récupéré depuis |
|---|---|---|---|---|
| `reponse-juste.mp3` | Réponse juste | `powerUp7` | [Digital Audio](https://kenney.nl/assets/digital-audio) | [S3M1TR4SH/asset-library](https://github.com/S3M1TR4SH/asset-library) (`audio/sfx/kenney-digital-audio/combo.ogg`) |
| `reponse-fausse.mp3` | Réponse fausse | `question_002` | [Interface Sounds](https://kenney.nl/assets/interface-sounds) | [Calinou/kenney-interface-sounds](https://github.com/Calinou/kenney-interface-sounds) |
| `point-du-recipient.mp3` | Point dans le récipient | `drop_002` | Interface Sounds | Calinou/kenney-interface-sounds |
| `texte-complet.mp3` | Texte complet, dernière étiquette d'un `ordre` | `confirmation_004` | Interface Sounds | Calinou/kenney-interface-sounds |
| `seance-terminee.mp3` | Séance terminée | `jingles_PIZZI07` | [Music Jingles](https://kenney.nl/assets/music-jingles) | S3M1TR4SH/asset-library (`audio/music/kenney-music-jingles/pizzicato.ogg`) |
| `grande-victoire.mp3` | Leçon acquise, badge, record de fluence | `jingles_HIT15` | Music Jingles | S3M1TR4SH/asset-library (`audio/music/kenney-music-jingles/hit.ogg`) |
| `decouverte.mp3` | Nouvel objet de la cabane, nouvel épisode | `maximize_004` | Interface Sounds | Calinou/kenney-interface-sounds |
| `bouton-touche.mp3` | Bouton touché (#96) | `toggle_001` | Interface Sounds | Calinou/kenney-interface-sounds |

Pour ajouter un son : licence CC0 ou équivalente vérifiée, validation du PO à l'écoute, puis une ligne dans ce tableau.
