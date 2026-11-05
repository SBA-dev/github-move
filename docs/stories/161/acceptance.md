# Story #161 : le dessin fixe de Capitaine Sam d'après la maquette de 106f

## Contexte

Capitaine Sam (univers « Pompiers ») est le seul personnage guide resté dans son dessin d'avant la refonte de #96 (réponse 96.5) : il n'est pas dans les dessins redessinés et ne porte pas la marque du dessin validé.
Sa célébration de l'univers (#106, livraison 106f) est dessinée dans le nouveau style, d'après la maquette validée par le PO (#106.42) : `docs/maquettes/capitaine-sam-pompiers.html` et la planche `docs/stories/106/captures/106f-capitaine-sam-tetes.png`. Juste après, la fin du défi montre encore l'ancien dessin fixe.
Le PO a retenu la reco A de #106.43 : le dessin fixe de Capitaine Sam est redessiné d'après cette maquette.

## Objectif

En tant qu'enfant de l'univers « Pompiers », je veux que Capitaine Sam ait le même dessin sur tous mes écrans et dans sa célébration, afin de reconnaître mon personnage guide partout.

## Règle

| Règle | Scénarios |
|---|---|
| Le dessin fixe de Capitaine Sam est le dessin validé de 106f : casque de pompier jaune portant un écusson rouge à goutte d'eau blanche, veste rouge à bandes jaune et argent, pantalon bleu marine, sur le corps de Coach Léo. Aucune étoile à cinq branches n'y figure, à aucune taille (106.34, 106.35). | `features/96-refonte-visuelle.feature` : Plan « Dans l'univers « <univers> », <personnage guide> a <son dessin> » (exemple Pompiers) |

## Scénario modifié

`features/96-refonte-visuelle.feature`, Plan du Scénario « Dans l'univers « <univers> », <personnage guide> a <son dessin> », exemple Pompiers (seule la colonne « son dessin » change, les autres lignes sont réalignées) :

- Avant : `son dessin d'avant la refonte`
- Après : `le dessin validé : casque jaune à écusson rouge et goutte d'eau, veste rouge à bandes et pantalon bleu marine, sans étoile`

Au-dessus du Plan :
- le commentaire de la réponse 96.5 garde son texte et précise « (jusqu'à #161) » après « Capitaine Sam garde son dessin actuel », pour ne pas perdre l'historique ;
- un nouveau commentaire renvoie à #161 et à la reco A de #106.43.

La ligne Police n'est pas touchée ici : #158 la modifie sur sa branche, dans le même Plan. Le conflit (ligne Police, largeur des colonnes, commentaires au-dessus du Plan) se résout à l'intégration en gardant les deux changements.

Aucun tag ajouté : le scénario reste `@issue-96`.

## Ce que vérifiera le step

Le step « <personnage guide> a le dessin validé : … » accepte aussi Capitaine Sam. Il vérifie la marque du dessin validé, puis :

- signes présents : `casque-de-pompier`, `ecusson` (à l'intérieur du casque), `goutte-d-eau` (à l'intérieur de l'écusson), `veste-rouge`, `bandes`, `pantalon` ;
- signes absents : `etoile`.

Le step « Capitaine Sam a son dessin d'avant la refonte » n'est plus utilisé par aucun scénario, ni la référence `features/support/dessin-de-capitaine-sam.json` qu'il compare : ils sont retirés (pas de code mort).

## Scénarios rejoués

Le seul scénario qui inspecte le dessin de Capitaine Sam :

1. Plan « Dans l'univers « <univers> », <personnage guide> a <son dessin> », exemple Pompiers.

Les scénarios qui montrent Capitaine Sam sans inspecter son dessin, rejoués parce que le dessin change de taille et de points d'accroche des tenues (consigne du PO : rejouer #96 et ceux qui montrent Capitaine Sam) :

2. `features/96-refonte-visuelle.feature` : « Sur un écran de 360 px, le personnage guide ne cache ni la consigne ni les choix » (univers Pompiers).
3. `features/96-refonte-visuelle.feature` : Plan « Sur <écran>, Léa voit <personnage guide> dans le paysage de l'univers « <univers> » » (exemples Pompiers : séance de la leçon, séance de révision).
4. `features/102-personnage-guide-evolue.feature` : « Sur un écran de 360 px, le personnage guide habillé ne cache ni la consigne ni les choix » (Capitaine Sam avec « un sac à dos d'explorateur »).
5. `features/11-profil-enfant.feature` : « Après un changement d'univers, Léa joue avec le personnage guide de son nouvel univers ».
6. `features/33-episodes-de-l-histoire.feature` : Plan « Dans l'univers <clé>, <personnage guide> raconte l'histoire de Noisette » (exemple `pompier`), et « Dans l'univers Pompiers, Capitaine Sam annonce l'épisode qui attend l'enfant ».
7. `features/6-univers-et-personnage-guide.feature` : Plan « Dans l'univers « <univers> », le personnage guide est <personnage guide> » (exemple Pompiers), et « Deux univers différents donnent deux paysages et deux couleurs principales différents » (Tom dans l'univers « Pompiers »).
8. `features/106-celebration-de-l-univers.feature` : Plan « Dans l'univers « <univers> », <personnage guide> fête le premier défi relevé à sa façon » (exemple Pompiers), si 106f est mergée avant #161 : la fin du défi montre alors le dessin fixe.

## Hors périmètre

- La scène de la célébration de Capitaine Sam (#106, 106f).
- Tout autre personnage guide (Agent Max : #158).
- Les phrases et la voix de Capitaine Sam.

## Questions ouvertes

**161.1 : un écusson aussi sur la veste ?**
La maquette de 106f ne met l'écusson que sur le casque : le torse porte la bande jaune, le liseré argent et la fermeture, sans écusson. Agent Max (#158) en porte deux (casquette et chemise).
Reco A : un seul écusson, sur le casque, comme la maquette validée. Le dessin fixe et la célébration restent identiques. B : ajouter un écusson sur la veste, ce qui demande une nouvelle validation de la planche.

**161.2 : garde-t-on la lance d'eau que tenait l'ancien dessin ?**
L'ancien dessin fixe tient une lance avec deux gouttes. Dans la maquette de 106f, la lance est un accessoire de la célébration (posée au sol ou tenue pendant le jet). Aucun autre dessin fixe redessiné n'a d'accessoire.
Reco A : pas de lance dans le dessin fixe, comme les autres personnages guides. Elle n'apparaît que dans la célébration. Les mains restent libres pour les tenues. B : garder la lance tenue, comme sur la planche des moments de 106f.

**161.3 : quelle tête de la planche pour chaque humeur ?**
La planche validée montre : face (sourire), ¾ gauche, ¾ droit, joie, surprise, concentration, clin d'œil, hum ?, sans casque. Le dessin fixe a trois humeurs : content, reflechit, applaudit.
Reco A : content → face (sourire), reflechit → concentration (la bouche ondulée, comme la bouche « réfléchit » de Coach Léo), applaudit → joie (bouche ouverte). Toujours de face et avec le casque. B : reflechit → « hum ? », qui peut se lire comme du doute ou de la déception et serait moins encourageant après une erreur.

**161.4 : le casque garde-t-il sa plaque verticale au-dessus de l'écusson ?**
Sur la planche, une plaque jaune verticale monte au-dessus de l'écusson. C'est la crête du casque de pompier, ni flamme ni gyrophare.
Reco A : la garder, comme la maquette validée. Elle ne porte aucun signe.
