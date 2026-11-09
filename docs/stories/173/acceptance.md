# Critères d'acceptance de la story #173 : une musique pour les célébrations de Sports et de Police

## Objectif

En tant qu'enfant de l'univers « Sports » ou « Police », je veux entendre la musique de mon univers quand Coach Léo
ou Agent Max fête ma victoire, afin de reconnaître le monde que j'ai choisi, comme les enfants des quatre autres
univers (#166).

Choix du PO à l'écoute (annonce [Responsable] sur #64, mot pour mot « 173 Sports C, Police B », détail dans
`ecoute.md`) : Sports reçoit le jingle steel-drum, Police le jingle cordes pincées. Les deux remplacent
« grande victoire » dans la célébration de l'univers. Plus aucun univers ne garde « grande victoire » pour sa
célébration de l'univers ; la question 173.2 (conduite si le PO ne retient rien) est sans objet.

Aucune règle nouvelle : on applique à Sports et à Police les règles de #106 et #166 (106.12, 106.46, 97.2, 97.13,
106.11). Les scénarios touchés portent le tag `@issue-173`.

## Règles

| Règle | Scénarios (tag `@issue-173`) |
|---|---|
| R1. Un univers qui a sa musique de célébration la fait entendre à la place de « grande victoire », avant la parole du personnage guide (règle de #166, étendue à Sports et Police) | `features/166-musiques-des-univers.feature` : Plan « Au premier défi relevé dans l'univers « <univers> », <musique> se fait entendre à la place de « grande victoire » », nouveau bloc d'exemples Sports (Coach Léo) et Police (Agent Max) |
| R1 (même règle, vue par #106) | `features/106-celebration-de-l-univers.feature` : « Au premier défi relevé, Coach Léo marque un but et le fête, puis félicite Léa » ; « Au premier défi relevé dans l'univers « Police », Agent Max retrouve un chiot perdu et le fête, puis félicite Léa » |
| R2. La célébration de l'univers ne retient jamais l'enfant ; les boutons arrêtent sa musique (106, inchangée) | même fichier : « Toucher l'écran en dehors des boutons pendant la célébration de l'univers ne change rien » ; « Pendant la célébration de l'univers, toucher « Mon parcours » y mène tout de suite et arrête la musique » |
| R3. La musique de la célébration est un effet sonore : le Muet ne la coupe pas, un écran du parent l'arrête (97.2, 97.13, 106.11, inchangée) | même fichier : « En Muet, la musique de la célébration de l'univers se fait entendre, sans parole » ; « En arrivant sur un écran du parent, la musique de la célébration de l'univers s'arrête » |

Ces scénarios de #106 ne changent pas d'étape : « la musique de la célébration de Coach Léo » (et d'Agent Max)
désignait jusqu'ici « grande victoire » ; elle désigne désormais la musique choisie par le PO (définition mise à jour
dans l'en-tête du fichier). Ils sont tagués pour pouvoir être ciblés.

Retiré : la règle de #166 « Un univers pour lequel le PO n'a retenu aucune musique garde « grande victoire » pour sa
célébration de l'univers » et son Plan (exemples Sports et Police), qui n'ont plus d'exemple.

Inchangés, vérifiés : « grande victoire » reste voulu quand aucune célébration de l'univers n'est jouée (leçon acquise,
record de fluence, `features/97-retours-animes-et-sonores.feature`, `features/128-claviers.feature`) ; les scénarios
de #100, #102 et #137 qui citent une musique de célébration le font avec Noisette.

## Hors périmètre

- Toute autre musique, tout autre son, toute autre célébration.
- Un réglage pour couper les effets sonores (97.2).

## Questions ouvertes

Aucune.
