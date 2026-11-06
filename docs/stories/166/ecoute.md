# Écoute des musiques des célébrations (#166)

Page d'écoute publiée pour le PO le 2026-11-06 : https://claude.ai/artifact/VCPoDDbFbEc5kLWvQHahsN (privée, compte du PO).

**Source** (réponse du PO « sons C », annonce [Responsable] 6673145978 sur #64) : pack **Music Jingles** de Kenney (https://kenney.nl/assets/music-jingles), licence **CC0 1.0**, récupéré sur le miroir GitHub [`Boyquotes/kenney-music-jingles-for-godot`](https://github.com/Boyquotes/kenney-music-jingles-for-godot) (commit `1312c1a`, fichier `LICENSE` = CC0 1.0 Universal). Les 85 jingles du pack y sont, renommés `jingles_<famille>_<i>.ogg` ; l'indice `i` est celui du pack d'origine (`jingles_<FAMILLE><ii>`), vérifié par les durées de `hit_15` (= `jingles_HIT15`, « grande victoire ») et `pizzi_7` (= `jingles_PIZZI07`, « séance terminée »). Le miroir déjà utilisé pour #97 (`S3M1TR4SH/asset-library`) n'a que 4 jingles de ce pack.

**Présélection** (l'équipe ne peut pas écouter) : jingles de 0,75 s au moins ; ligne mélodique qui monte ou reste stable (note dominante du dernier tiers comparée au premier, par FFT) pour écarter les fins descendantes ; aucun des 8 sons actuels ; une famille d'instruments par univers quand c'est possible. Ce sont tous des jingles musicaux (aucune sirène, alarme, cri ni bruit d'arme). L'écoute du PO reste le seul filtre du caractère joyeux.

Conversion : `ffmpeg -ac 1 -b:a 128k -ar 44100` (MP3 mono 128 kbit/s), sans autre retouche.

| Univers | Lettre | Fichier d'origine | Instrument | Durée | Poids MP3 |
|---|---|---|---|---|---|
| Sports | A | `jingles_HIT11` | cuivres d'orchestre | 0.99 s | 16.3 Ko |
| Sports | B | `jingles_HIT10` | cuivres d'orchestre | 0.78 s | 13.0 Ko |
| Sports | C | `jingles_NES12` | console 8 bits | 0.89 s | 14.7 Ko |
| Danse | A | `jingles_SAX02` | saxophone | 0.91 s | 15.1 Ko |
| Danse | B | `jingles_SAX12` | saxophone | 0.89 s | 14.7 Ko |
| Danse | C | `jingles_SAX03` | saxophone | 1.15 s | 18.9 Ko |
| Animaux de la forêt | A | `jingles_PIZZI02` | cordes pincées | 0.99 s | 16.3 Ko |
| Animaux de la forêt | B | `jingles_PIZZI12` | cordes pincées | 1.04 s | 17.2 Ko |
| Animaux de la forêt | C | `jingles_PIZZI10` | cordes pincées | 0.84 s | 13.8 Ko |
| Princesses et fées | A | `jingles_STEEL02` | steel-drum | 1.44 s | 23.4 Ko |
| Princesses et fées | B | `jingles_STEEL12` | steel-drum | 1.31 s | 21.4 Ko |
| Princesses et fées | C | `jingles_STEEL13` | steel-drum | 1.10 s | 18.0 Ko |
| Police | A | `jingles_NES13` | console 8 bits | 1.10 s | 18.0 Ko |
| Police | B | `jingles_NES05` | console 8 bits | 0.94 s | 15.5 Ko |
| Police | C | `jingles_NES06` | console 8 bits | 0.84 s | 13.8 Ko |
| Pompiers | A | `jingles_STEEL10` | steel-drum | 0.94 s | 15.5 Ko |
| Pompiers | B | `jingles_PIZZI15` | cordes pincées | 0.86 s | 14.3 Ko |
| Pompiers | C | `jingles_STEEL06` | steel-drum | 1.41 s | 23.0 Ko |

Réponse attendue du PO : « 166 Sports B, Danse A, … » (ou « aucun » pour un univers, 166.4).
