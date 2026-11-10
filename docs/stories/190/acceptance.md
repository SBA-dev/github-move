# Critères d'acceptance : story #190, exercice « horloge » (lire l'heure)

Scénarios : `features/190-horloge.feature`. Modèle : `docs/stories/190/domain-model.md` (questions #190.1 à #190.22).

État : **validé par le PO le 2026-11-09** (toutes les recommandations acceptées, voir « Décisions »). La story est **découpée** (décision #190.31) :
- **#190** (ce fichier) : le type d'exercice `horloge` du format de leçon, la validation des leçons qui l'emploient, et le mode **lire** ;
- **#192** « Exercice horloge : placer les aiguilles (suite de #190) » : le mode **placer**. Scénarios : `features/192-horloge-placer.feature`, critères : `docs/stories/192/acceptance.md`.

Tags :
- `@issue-190 @wip` sur la fonctionnalité (`@wip` est retiré par l'e2e-tester à la livraison, comme pour toute story) ;
- aucun `@a-valider` : toutes les questions sont tranchées ; un commentaire `# Décision #190.n` au-dessus d'un scénario renvoie à la section « Décisions » ;
- aucun `@acces` : la story n'ajoute aucune donnée ni aucun droit (voir « Droits d'accès ») ;
- aucun `@depend-de-…`.

## Objectif

En tant qu'**enfant**, je veux voir une horloge à aiguilles et dire l'heure qu'elle montre, afin d'apprendre à lire l'heure comme en classe (programme du CP au CM2 : lire l'heure sur une horloge à aiguilles).

Besoins nourris (skill `gamification`) : **compétence** (l'enfant lit une vraie horloge, la réussite se voit avec l'affichage digital qui confirme) et **autonomie** (il choisit ou écrit lui-même l'heure). Aucun garde-fou franchi : pas de temps limité, pas de pénalité, mêmes étoiles que les autres exercices, une erreur n'est jamais punitive.

Contenus pour les enfants : les exemples ne parlent que de moments ordinaires de la journée (l'après-midi). Aucune heure réelle de l'enfant n'est demandée.

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Une leçon dont l'exercice horloge est mal formé n'est jamais proposée ; chaque heure respecte la précision de l'heure de l'exercice, ou à défaut celle du niveau, qui ne dépasse pas le programme | Plan « Au <niveau>, un exercice horloge à lire à « <heure> » <précision> <résultat> dans le parcours » : 12 exemples, CP 3:00 oui / 3:30 non, CE1 3:30 et 9:45 oui / 3:10 non, même à la précision minute, CE2 6:18 oui, 3:00 à la précision heure oui, 3:30 à la précision heure non, CM1 4:41 oui / 4:41:10 non, CM2 6:18:20 à la précision seconde oui (D9) · Plan « Une leçon dont l'exercice horloge <défaut> n'est pas proposée » : 8 exemples (mode « regarder », sans mode, aucune heure, 25:00, 3:60, 0:00 (D17), « 3 h 30 », précision « dix minutes ») · « Une leçon dont l'exercice horloge demande deux heures égales sur le cadran n'est pas proposée » (D30) |
| R2 | Mode lire : l'horloge montre une heure ; au CP l'enfant choisit parmi trois heures toutes différentes sur le cadran, à partir du CE1 il l'écrit au clavier de cristaux ; une heure égale sur le cadran est juste, sauf si un moment de la journée est demandé ; l'heure n'est jamais écrite pendant la question | « Au CP, l'horloge montre 3 h et Léa choisit parmi trois heures entières, toutes différentes » (D1, D11) · Plan « Au CP, la réponse « <réponse> » à l'horloge qui montre <heure montrée> est juste » : 3 h, 9 h, 12 h (D10) · « Au CE1, Tom écrit l'heure montrée au clavier de cristaux » (D1) · « Sans moment de la journée, « 14 h 15 » est juste pour l'horloge qui montre 2 h 15 » (D8) · « Quand c'est l'après-midi, « 3 h » n'est pas la bonne réponse et l'aide de l'heure est lue » (D8) · « Une heure impossible ne peut pas être validée » · « Pendant la question, l'heure n'est écrite nulle part à côté de l'horloge » (D5) · « Après la bonne réponse, au CE1, l'affichage digital est montré à côté de l'horloge » (D5) |
| R3 | Une réponse fausse coûte une erreur, jamais une punition : encouragement, aide, nouvelle chance ; « Je ne sais pas » montre la bonne heure une fois par question, puis l'enfant la donne lui-même ; une question ratée revient en révision | « Après une erreur au CP, le mauvais choix est écarté et l'aide de l'heure est lue » · « Sans aide de l'heure, le personnage guide lit l'aide par défaut de l'horloge » · « Avec une erreur dans l'exercice horloge, Léa gagne 2 étoiles » · Plan « « Je ne sais pas » est proposé dans un exercice horloge (<cas>) » : avec les choix, au clavier de cristaux · « En mode lire avec les choix, « Je ne sais pas » ne laisse que la bonne heure, qui brille » · « En mode lire au clavier de cristaux, « Je ne sais pas » dit l'heure à taper » (D1) · « Après « Je ne sais pas », il n'est plus proposé pour cette question » · « Une question d'horloge ratée revient en séance de révision, dans le même mode » (D15) |
| R4 | La consigne est lue à voix haute, jamais l'heure à lire ; 360 px, mode dys, sans réseau | « En mode lire, la consigne est lue mais pas l'heure montrée » · « En mode lire, les lecteurs d'écran nomment l'horloge sans dire l'heure qu'elle montre » (D27) · « Avec « tout lire à voix haute », les heures proposées sont lues comme des heures dites » (D10) · Plan « À 360 px, l'horloge à lire et <commandes> tiennent dans la largeur de l'écran » : les trois choix, le clavier de cristaux · « En mode dys, la consigne et les heures proposées s'affichent en mode dys » · « Sans réseau, la réponse à l'horloge est corrigée et la séance continue » |

Au total : **4 règles, 25 scénarios** (dont 5 plans de scénario), soit **47 cas** joués par projet. « Dn » renvoie à la décision #190.n.

Correspondance avec la version validée (6 règles, 52 scénarios) : R1 et R2 restent R1 et R2 (sans le plan des heures à placer au CP, parti dans #192) ; les parties « lire » de l'ancienne R5 deviennent R3, celles de l'ancienne R6 deviennent R4 ; l'ancienne R4 garde ici son seul scénario « lire » (lecteurs d'écran), placé en R4. Les anciennes R3 et R4 et les scénarios propres au mode placer sont dans #192 (33 scénarios déplacés, voir `docs/stories/192/acceptance.md`). Quatre scénarios qui passaient par le mode placer sont réécrits ici en mode lire : les 2 étoiles avec une erreur, « Je ne sais pas » une seule fois, la révision, le jeu sans réseau. Le plan des défauts reçoit l'exemple « 0:00 » (D17 : minuit refusé partout).

### Exemples aux bornes

| Cas | Exemple |
|---|---|
| Heure invalide | 25:00, 3:60, 0:00 (D17), « 3 h 30 » (pas l'écriture « H:MM ») |
| Précision juste au-dessus du niveau | CE1 3:10 refusée, même si l'exercice écrit « précision minute » (D9) |
| Précision plus grossière que le niveau | CE2 3:00 à la précision heure acceptée ; 3:30 à la précision heure refusée |
| Secondes | CM1 4:41:10 refusée ; CM2 6:18:20 à la précision seconde acceptée (D4, D9) |
| Égales sur le cadran | 3:00 et 15:00 dans le même exercice refusées (D30) ; « 14 h 15 » écrit pour 2 h 15 juste sans moment (D8) |
| Heure impossible au clavier de cristaux | « 2 h 75 » ne peut pas être validée, aucune erreur comptée |

### Rejet au build (pipeline de contenu, vérifié par pytest, pas par un scénario)

Les mêmes défauts que dans R1 font **échouer** `scripts/build_bibliotheque.py`, avec un message qui nomme la leçon et la raison. Le domaine (`lireHorloge`, `LeconMalFormee`) les refuse aussi, ce qui écarte la leçon côté navigateur (c'est ce que les scénarios observent : la leçon n'apparaît pas dans le parcours).

| Défaut | Raison attendue dans le message |
|---|---|
| `mode` absent ou autre que `lire` / `placer` | mode de l'horloge inconnu |
| `items` absent ou vide | aucune heure |
| `heure` hors bornes (25:00, 3:60, 0:00) ou mal écrite (« 3 h 30 ») | heure invalide |
| `precision` inconnue (« dix minutes ») | précision de l'heure inconnue |
| heure qui ne respecte pas la précision (3:30 à la précision heure ; 3:10 au CE1) | heure qui ne respecte pas la précision |
| précision plus fine que le niveau (minute au CE1) | précision au-delà du programme du niveau (D9) |
| deux heures égales sur le cadran dans un exercice | heures en double sur le cadran (D30) |

Le mode `placer` fait partie du format dès #190 (D13, D21), mais son jeu et sa règle propre (au CP, de 1 h à 12 h, D17) sont livrés par #192.

## Droits d'accès

Aucun scénario `@acces` : la story n'ajoute ni table, ni donnée, ni droit. Les réponses d'horloge (choix, heure écrite) sont des réponses de séance comme les autres, déjà couvertes par la RLS des séances, l'export et la suppression d'un profil (#14). Rien n'est envoyé à l'IA.

## Hors périmètre

- Mode **placer** (tourner les aiguilles) : story **#192** (D31).
- Durées entre deux instants affichés sur deux horloges (CE2, CM1, CM2) : story à part (D16).
- Test de départ : aucune question d'horloge (D14) ; aucun scénario, comme pour la boîte à jetons.
- Générateur d'heures tirées au hasard (D12).
- Contenu : ajout d'exercices `horloge` aux leçons de la bibliothèque (D22), produit par la session principale.
- Dessin du cadran et des aiguilles : validé sur planche (skill `illustration`), aucun scénario ne lit un tracé.

## Questions ouvertes

Aucune. Une décision reste **à confirmer par le PO** : la D10 pour les minutes de 40 à 55 à partir du CE2 (choix de l'orchestrateur). Elle ne change aucun scénario de #190 ; dans #192, le plan qui l'illustre porte `@a-valider`.

## Corrections d'exemples

- **2026-11-10, « Avec « tout lire à voix haute », les heures proposées sont lues comme des heures dites »** (R4, D10) : l'exemple attendait au CP, pour 3:00, les choix « 2 h », « 3 h », « 4 h ». La décision 11 (distracteurs calculés, dont le chiffre montré par la grande aiguille) fait proposer « 3 h », « 12 h », « 4 h » (test de domaine « 3 h à la précision heure est proposée avec « 12 h » »). L'exemple devient « les choix sont affichés dans l'ordre « 3 h », « 12 h », « 4 h » » et « Est-ce trois heures, midi, ou quatre heures ? » (12:00 dit « midi », D10). La règle ne change pas. Trouvé par les E2E de #190.

## Décisions

Validées par le PO le 2026-11-09 (« OK » : toutes les recommandations acceptées). 1 à 22 reprennent les questions du modèle (#190.n) ; 23 à 34 viennent des critères. « #192 » signale une décision qui ne joue que dans le mode placer.

| # | Question | Décision |
|---|---|---|
| 1 | Mode lire : choisir ou écrire ? | **Choix au CP, clavier de cristaux à partir du CE1**, comme le mode de réponse des calculs. |
| 2 | Mode placer : aiguilles aimantées ou tour libre ? (#192) | **Aimantées au pas de la précision de l'heure.** |
| 3 | La petite aiguille suit-elle la grande ? (#192) | **Séparées au CP et au CE1, liées à partir du CE2.** |
| 4 | Aiguille des secondes au CM2 ? | **Oui, seulement pour un exercice à la précision seconde** ; ailleurs, pas d'aiguille des secondes. |
| 5 | Affichage digital à partir du CE1 ? | **Jamais pendant la question**, **montré après la bonne réponse**. |
| 6 | Que montre l'horloge après une réponse fausse ? (#192) | **Les aiguilles de l'enfant restent, l'aide est lue, nouvelle chance** ; la bonne heure n'est montrée qu'après « Je ne sais pas » (écart voulu avec le texte de l'issue). |
| 7 | Tolérance de la petite aiguille (#192) | **La petite aiguille se pose au pas de la précision, la cohérence est exacte** (à 3 h 30, à mi-chemin ; pile sur le 3 ou aux trois quarts du chemin, c'est faux). |
| 8 | Moment de la journée (`moment`, CE1) | Sans moment, une heure égale sur le cadran est juste (« 14 h 15 » pour 2 h 15) et les choix ne proposent jamais deux heures égales sur le cadran ; avec un moment, il est **dit après la consigne** (« Quelle heure est-il ? C'est l'après-midi. ») et seule l'heure de ce moment est juste. |
| 9 | Précision par défaut et limites | CP heure, CE1 quart d'heure, **CE2 minute** (cinq minutes reste possible comme précision écrite dans l'exercice), CM1 minute, CM2 seconde ; une précision **plus fine** que le niveau fait échouer le build, une **plus grossière** est permise. |
| 10 | Écriture et heure dite | Écrite « 3 h », « 12 h », « 3 h 30 », « 6 h 18 min 20 s » ; dite « trois heures », « **midi** » pour 12:00, « trois heures et quart », « trois heures et demie » ; les choix lus de même ; au clavier de cristaux, « 14 h 15 » et « 2 h 15 » sont la même réponse sans moment. **À partir du CE2** (programme du CE2 : « sept heures moins le quart », « quatre heures moins vingt ») : les minutes de 40 à 55 se disent avec « moins » (moins vingt, moins le quart, moins dix, moins cinq), 15 et 30 avec « et quart » et « et demie », les autres minutes en nombre (« dix heures trente-cinq », « six heures dix-huit »). Cette dernière partie est un **choix de l'orchestrateur, à confirmer par le PO** (la question n'avait pas de recommandation). |
| 11 | Distracteurs calculés ou écrits dans le JSON ? | **Calculés** (aiguilles inversées, heure d'à côté, chiffre montré par la grande aiguille, minutes voisines), tous à la précision du niveau et différents sur le cadran. |
| 12 | Générateur d'heures dès cette story ? | **Non**, heures écrites seulement ; story à part si besoin. |
| 13 | Mode par exercice ou par item ? | **Par exercice** (une leçon peut avoir deux exercices `horloge`). |
| 14 | Test de départ | **Non** dans cette story. |
| 15 | Révision | **Oui**, une question ratée revient dans le même mode. |
| 16 | Durées entre deux instants affichés | **Hors story**, story à part. |
| 17 | Heures permises | Au CP en mode placer, **de 1 h à 12 h** (#192) ; 0:00 (minuit) **refusé** partout. |
| 18 | « Je ne sais pas » en mode placer (#192) | Les aiguilles **tournent jusqu'à la bonne heure, puis reviennent** où l'enfant les avait mises, et il les place lui-même. |
| 19 | Heure placée écrite sous l'horloge pendant qu'on tourne ? (#192) | **Non**, seulement l'annonce aux lecteurs d'écran. |
| 20 | Nom « Horloge » dans le code | Renommer le type technique du front (par exemple `SourceDuTemps`) ; « horloge » ne désigne plus que l'horloge à aiguilles. |
| 21 | « Mode » deux fois | Garder **Mode de l'horloge** dans le domaine et le format ; le mot « mode » n'est jamais montré à l'enfant. |
| 22 | Contenu | Les quatre leçons sur l'heure (`ma-cp-heures`, `ma-ce1-heure-demi`, `ma-ce1-quarts-heure-durees`, `ma-ce2-heure-durees`) reçoivent des exercices `horloge` dans la même PR (en mode lire pour #190, en mode placer avec #192) ; les leçons de durées plus tard, avec D16. |
| 23 | Position de départ des aiguilles (#192) | **12 h**, et **6 h** quand l'heure à placer est égale sur le cadran à 12 h. |
| 24 | Au CP, la grande aiguille (#192) | **Voulu** : elle ne se pose que sur le 12, l'enfant du CP ne place que la petite aiguille. |
| 25 | Pas des boutons « + » / « − » et des flèches (#192) | Un appui avance **l'aiguille choisie d'un pas de la précision de l'heure** ; flèches **droite et haut** dans le sens des aiguilles d'une montre, **gauche et bas** dans l'autre sens ; chaque aiguille a ses deux boutons. |
| 26 | Texte de l'annonce de l'heure placée (#192) | « **Les aiguilles montrent 3 h 30.** », calculé par le domaine, après chaque mouvement, sans juger la réponse. |
| 27 | Lecteur d'écran en mode lire | L'horloge est nommée « Horloge à aiguilles » **sans dire l'heure** ; l'heure est annoncée après la bonne réponse ou « Je ne sais pas ». |
| 28 | Après « Je ne sais pas » en mode placer, la bonne heure reste-t-elle visible ? (#192) | **Non** ; l'enfant peut demander à réécouter l'heure. |
| 29 | Exercice à placer avec sa propre consigne (#192) | La consigne est lue, **puis l'heure dite** ; l'heure est aussi écrite sous la consigne. |
| 30 | Deux heures égales sur le cadran dans un même exercice | **Refusé au build** (et la leçon n'est pas proposée). |
| 31 | Taille de la story | **Découpée** : #190 livre le type `horloge` et le mode lire ; le mode placer devient **#192**. |
| 32 | Libellé du type d'exercice et consigne par défaut en mode lire | **Gardés** : « L'horloge », « Quelle heure est-il ? ». |
| 33 | Aide quand les aiguilles ne sont pas cohérentes (#192) | **Pas d'aide calculée** : l'aide par défaut est lue ; l'auteur de la leçon peut écrire une aide de l'heure. |
| 34 | Explication de la réponse après la félicitation | **Aucune phrase de plus** ; seul l'affichage digital est montré après la bonne réponse (D5). |
