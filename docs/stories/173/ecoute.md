# Écoute des musiques de Sports et de Police (#173)

Page d'écoute publiée pour le PO le 2026-11-09 : https://claude.ai/artifact/ULBkZ7v8kLLPaj3qXEfuoA (privée, compte du PO). Elle permet aussi de réécouter « grande victoire » pour comparer, et de répondre « aucun » pour un univers.

**Source** (choix du PO pour #166, « sons C ») : pack **Music Jingles** de Kenney (https://kenney.nl/assets/music-jingles), licence **CC0 1.0**, miroir GitHub [`Boyquotes/kenney-music-jingles-for-godot`](https://github.com/Boyquotes/kenney-music-jingles-for-godot) (commit `1312c1a`, `LICENSE` = CC0 1.0 Universal), le même que pour #166. Fichiers `addons/kenney music jingles/<Famille> jingles/jingles_<famille>_<i>.ogg`, `i` = indice du pack d'origine.

**Exclus** : les sons proposés pour Sports et Police en #166 (HIT11, HIT10, NES12, NES13, NES05, NES06) et les sons déjà utilisés (HIT15, PIZZI07, SAX02, PIZZI12, STEEL13, STEEL06). Le PO n'ayant retenu ni les cuivres ni le 8 bits pour ces univers, la présélection change de famille d'instruments, sauf une fanfare de cuivres courte jamais proposée (HIT03).

**Présélection** (l'équipe ne peut pas écouter) : mêmes critères que #166 (0,75 s au moins ; ligne mélodique qui monte ou reste stable, par FFT du premier et du dernier tiers). Le pack est presque épuisé : hors exclusions, seuls HIT03, SAX13, STEEL00, PIZZI03 et PIZZI13 n'ont jamais été proposés et remplissent ces critères. Le 6e son, SAX12, a été proposé pour Danse en #166 (non retenu), jamais pour Police. Tous sont des jingles musicaux : ni sirène, ni alarme, ni sifflet, ni cri, ni bruit d'arme. L'écoute du PO reste le seul filtre du caractère joyeux.

Conversion : `ffmpeg -ac 1 -b:a 128k -ar 44100` (MP3 mono 128 kbit/s), sans autre retouche.

| Univers | Lettre | Fichier d'origine | Instrument | Durée | Poids MP3 |
|---|---|---|---|---|---|
| Sports | A | `jingles_HIT03` | cuivres d'orchestre (fanfare courte) | 0.78 s | 13.0 Ko |
| Sports | B | `jingles_SAX13` | saxophone | 0.81 s | 13.4 Ko |
| Sports | C | `jingles_STEEL00` | steel-drum | 0.97 s | 15.9 Ko |
| Police | A | `jingles_PIZZI03` | cordes pincées (air d'enquête) | 1.18 s | 19.3 Ko |
| Police | B | `jingles_PIZZI13` | cordes pincées | 0.91 s | 15.1 Ko |
| Police | C | `jingles_SAX12` | saxophone | 0.89 s | 14.7 Ko |

Réponse attendue du PO : « 173 Sports B, Police A » (ou « aucun » pour un univers).
