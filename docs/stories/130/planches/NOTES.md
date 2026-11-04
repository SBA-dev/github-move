# Notes de l'illustrateur pour le câblage de #130 (petit train)

Planche : `ordre-petit-train.png` (et `-x2.png`). Sources : `sources/tete-<univers>.svg`, `sources/wagon-<univers>.svg` (12 fichiers). Régénération : `node docs/stories/130/planches/generer-les-planches.mjs`. Contrôles : `controle/contraste.txt`, `controle/train-<univers>.png`.

## Tête (locomotive)
- SVG de taille fixe, `viewBox="0 0 150 110"` (150 × 110 px), même taille dans les 6 univers. Elle regarde à gauche, cabine à droite, attelage à droite. `aria-hidden="true"`, aucun visage (la fenêtre est un carré clair).
- Un seul `<li>` en tête de la première ligne, hors de la liste lue (les lecteurs d'écran commencent au premier wagon).

## Wagon extensible : une seule image découpée en 9 (`border-image`)
- `viewBox="0 0 120 110"`, `width="120" height="110"` présents (obligatoires pour `border-image`).
- Découpe : haut 28, droite 34, bas 30, gauche 34. Le décor n'est que dans les 4 coins (toit, roues, attelages) ; les bords et le centre sont unis, donc étirables dans les deux sens (largeur d'un vers, hauteur de trois lignes en mode dys).
- CSS (testé dans la planche, Chromium) : `box-sizing: border-box; min-width: 104px; min-height: 110px; border-style: solid; border-width: 28px 34px 30px 34px; border-image-source: var(--wagon); border-image-slice: 28 34 30 34 fill; border-image-width: 28px 34px 30px 34px; border-image-repeat: stretch; padding: 0 2px; display: grid; place-items: center;` Le texte est dans la case centrale ; la plaque claire déborde de 4 px, le texte garde donc toute la plaque.
- Un vers long : `flex: 1 1 100%` sur le wagon (il occupe la ligne, la tête reste seule sur la sienne ; `.train { display:flex; flex-wrap:wrap; gap:0 }`, les attelages se touchent).
- `--wagon` (et la tête) est choisi par la clé d'univers, table `Record<CleUnivers, …>` ; repli sur `animaux`. Importer les SVG comme URL (`?url`) ; ne pas les mettre en ligne dans un style entre guillemets doubles (le test de la planche a échoué là-dessus).
- Couches (de bas en haut) : roues, corps (dégradé vertical, identique sur toute la largeur), châssis et attelages, toit, décor de coin, plaque. Le texte, lui, est du HTML par-dessus la plaque (inv. 98-18).
- Places libres : pas dessinées en wagon, `.place` existant en pointillés (44 px minimum).
- « Je ne sais pas » : l'étiquette à côté du train porte le signal existant (`data-brille`, fond `--surbrillance-fond`, anneau `--surbrillance`). Aucun dessin du train n'est jaune brillant ni étoilé.
- Mouvements réduits : le dessin est statique ; l'à-coup du cran d'avance (#130.2) est un `transform: translateX` du train entier, jamais des roues qui tournent.

## Palette par univers (voir `generer-les-planches.mjs`, objet `P`)
| Univers | Corps (haut → bas) | Contour | Plaque | Toit | Châssis |
|---|---|---|---|---|---|
| animaux | #D9A55B → #B97F3E | #6B4423 | #FFF3DF | #4FB37A | #7A4B1F |
| princesse | #E2B4F0 → #C48BDC | #7E56BC | #FBF1FF | #FFC93C | #E0A92B |
| sports | #4F8BE6 → #2F6FCF | #164BA8 | #F1F8FF | #FFFFFF | #E8604C |
| police | #6F8BE6 → #5470DA | #1F2F82 | #F3F6FF | #2B43A8 | #F3F6FF |
| pompier | #E0523A → #C2341B | #6E1708 | #FFF1E6 | #A8281A | #FFC93C |
| danse | #EBA6DA → #D68BC8 | #7A35C8 | #FFF0F8 | #B96FCB | #FFFFFF |

Texte de l'étiquette : `#1B1530` sur la plaque, 15,9:1 à 16,4:1 (seuil 4,5:1). Roues : #3A2F45 avec une jante #F4EFE6 (visible sur fond sombre).

## Vérifications faites
Règle absolue relue sur les 12 dessins, à 1x, 0,5x et 0,3x, fonds clair et sombre : aucune arme, flamme, fumée, étoile, chiffre, lettre, visage, personnage, lampe ni gyrophare. Les « notes de musique » (Danse) sont des notes de musique, pas des étoiles ; le fanion de Sports est un triangle uni.
