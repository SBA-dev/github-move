# Effets sonores

Les effets sonores de l'application de l'enfant sont dans `public/sons/`. Les 8 premiers ont été choisis par le PO le 2026-10-25, à l'écoute de 27 candidats (story #97, épopée #95). Les 4 musiques de célébration des univers ont été choisies par le PO le 2026-11-06 (story #166). Les 8 premiers sont branchés par #97 : jusque-là, aucun écran ne les joue et le service worker ne les met pas en cache.

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
| `air-de-saxophone.mp3` | Musique de la célébration de l'univers Danse (#166) | `jingles_SAX02` | [Music Jingles](https://kenney.nl/assets/music-jingles) | [Boyquotes/kenney-music-jingles-for-godot](https://github.com/Boyquotes/kenney-music-jingles-for-godot) (`addons/kenney music jingles/Sax jingles/jingles_sax_2.ogg`, commit 1312c1a, LICENSE CC0 1.0) |
| `air-de-cordes-pincees.mp3` | Musique de la célébration de l'univers Animaux de la forêt (#166) | `jingles_PIZZI12` | [Music Jingles](https://kenney.nl/assets/music-jingles) | [Boyquotes/kenney-music-jingles-for-godot](https://github.com/Boyquotes/kenney-music-jingles-for-godot) (`addons/kenney music jingles/Pizzicato jingles/jingles_pizzi_12.ogg`, commit 1312c1a, LICENSE CC0 1.0) |
| `air-de-steel-drum-court.mp3` | Musique de la célébration de l'univers Princesses et fées (#166) | `jingles_STEEL13` | [Music Jingles](https://kenney.nl/assets/music-jingles) | [Boyquotes/kenney-music-jingles-for-godot](https://github.com/Boyquotes/kenney-music-jingles-for-godot) (`addons/kenney music jingles/Steel jingles/jingles_steel_13.ogg`, commit 1312c1a, LICENSE CC0 1.0) |
| `air-de-steel-drum-long.mp3` | Musique de la célébration de l'univers Pompiers (#166) | `jingles_STEEL06` | [Music Jingles](https://kenney.nl/assets/music-jingles) | [Boyquotes/kenney-music-jingles-for-godot](https://github.com/Boyquotes/kenney-music-jingles-for-godot) (`addons/kenney music jingles/Steel jingles/jingles_steel_6.ogg`, commit 1312c1a, LICENSE CC0 1.0) |

Pour ajouter un son : licence CC0 ou équivalente vérifiée, validation du PO à l'écoute, puis une ligne dans ce tableau.
