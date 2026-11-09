# Critères d'acceptance : story #192, exercice « horloge » : placer les aiguilles (suite de #190)

Scénarios : `features/192-horloge-placer.feature`. Modèle : `docs/stories/190/domain-model.md`.

Origine : la story #190 a été **découpée** à la validation du PO le 2026-11-09 (décision #190.31). #190 livre le type d'exercice `horloge`, la validation des leçons et le mode **lire** (`features/190-horloge.feature`, `docs/stories/190/acceptance.md`) ; #192 livre le mode **placer**. Les scénarios ci-dessous ont été validés avec #190 et déplacés tels quels, sauf mention contraire.

Tags :
- `@issue-192 @wip @depend-de-190` sur la fonctionnalité : #192 ne commence son code qu'une fois #190 mergée ; `@depend-de-190` est retiré au début de la livraison de #192, `@wip` par l'e2e-tester à la livraison ;
- `@a-valider` sur un seul plan, qui illustre la partie de la décision #190.10 à confirmer par le PO ;
- aucun `@acces` : la story n'ajoute aucune donnée ni aucun droit (les positions des aiguilles sont des réponses de séance, couvertes par la RLS des séances, l'export et la suppression d'un profil, #14). Rien n'est envoyé à l'IA.

## Objectif

En tant qu'**enfant**, je veux tourner moi-même les aiguilles d'une horloge pour montrer une heure donnée, afin d'apprendre à positionner les aiguilles comme en classe (programme du CP au CM2).

Besoins nourris (skill `gamification`) : **compétence** (la réussite se voit sur le cadran) et **autonomie** (il tourne lui-même les aiguilles, au doigt, au clavier ou avec « + » / « − »). Pas de temps limité, pas de pénalité, mêmes étoiles que les autres exercices, une erreur n'est jamais punitive.

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Au CP, une heure à placer est une heure entière de 1 h à 12 h | Plan « Au CP, un exercice horloge à placer à « <heure> » <résultat> dans le parcours » : 1:00 et 12:00 oui, 13:00 et 0:00 non (D17) |
| R2 | Mode placer : l'enfant tourne les aiguilles puis valide ; juste si la grande aiguille est sur les minutes attendues et si les aiguilles sont cohérentes | « Au début d'une question à placer, les aiguilles montrent 12 h » (D23) · « Quand l'heure à placer est midi, les aiguilles montrent 6 h au début » (D23) · Plan « Au <niveau>, les aiguilles placées sur <heure> réussissent la question » : CP 3 h, 12 h ; CE1 3 h 30, 3 h 15 · Plan « Pour 3 h 30, la grande aiguille sur le 6 et la petite <place> ne sont pas cohérentes » : sur le 3, sur le 4, aux trois quarts du chemin (D3, D7, D33) · « Des aiguilles qui montrent 3 h 15 ne réussissent pas « 3 h 30 » » · « À partir du CE2, la petite aiguille avance d'elle-même quand la grande tourne » (D3) · Plan « À partir du CE2, au <niveau>, les aiguilles placées sur <heure> réussissent la question » : CE2 6 h 18, 10 h 35 ; CM1 4 h 40 (D3, D9) · « Au CM2, à la précision seconde, l'horloge a une aiguille des secondes à placer aussi » (D4, D10) · « Sans la précision seconde, l'horloge n'a pas d'aiguille des secondes » (D4) · Plan « Au <niveau>, la grande aiguille lâchée <où> se pose <où> » : CE1 après le 3 → sur le 3, avant le 6 → sur le 6 ; CE2 → trait de 18 (D2) · « Au CP, la grande aiguille revient toujours sur le 12 » (D2, D24) |
| R3 | Les aiguilles se tournent au doigt, au clavier (flèches) et avec « + » / « − » ; chaque mouvement avance l'aiguille choisie d'un pas de la précision de l'heure ; l'heure placée est annoncée aux lecteurs d'écran | « Sur tablette, Tom tourne les aiguilles au doigt et valide » · Plan « Au CE1, « <bouton> » de la grande aiguille la fait passer du 12 <à où> » : + → 3, − → 9 (D2, D25) · « Au CE1, « + » de la petite aiguille l'avance d'un quart du chemin vers le chiffre suivant » (D3, D25) · Plan « Au clavier, la flèche <flèche> fait passer la grande aiguille du 12 <à où> » : droite, haut → 3 ; gauche, bas → 9 (D25) · « Au clavier seulement, Tom place les aiguilles et réussit la question » · « L'heure placée est annoncée aux lecteurs d'écran, sans être écrite à l'écran » (D19, D26) |
| R4 | Une réponse fausse coûte une erreur, jamais une punition : encouragement, aide, nouvelle chance avec ce que l'enfant a placé ; « Je ne sais pas » montre la bonne heure une fois par question, puis l'enfant place lui-même les aiguilles ; une question ratée revient en révision | « Après une erreur en mode placer, les aiguilles restent où Tom les a mises, sans montrer la bonne heure » (D6) · « Après une erreur, les aiguilles placées sur 3 h 30 réussissent encore la question » · « Avec une erreur dans l'exercice horloge à placer, Léa gagne 2 étoiles » · « « Je ne sais pas » est proposé dans un exercice horloge à placer » · « En mode placer, « Je ne sais pas » montre la bonne heure, puis Tom place lui-même les aiguilles » (D18, D28) · « Après « Je ne sais pas » en mode placer, il n'est plus proposé pour cette question » · « Une question d'horloge à placer ratée revient en séance de révision, dans le même mode » (D15) |
| R5 | L'heure à placer est écrite et lue à voix haute ; 360 px, cibles de 44 px, sans réseau, mouvements réduits | Plan « Sans consigne, l'heure à placer <écriture> est écrite et dite « <heure dite> » » : 3 h / trois heures, 12 h / midi, 3 h 30 / trois heures et demie, 3 h 15 / trois heures et quart (D10) · Plan « À partir du CE2, au <niveau>, l'heure à placer <écriture> est dite « <heure dite> » » : CE2 6 h 18 / six heures dix-huit, 10 h 35 / dix heures trente-cinq ; CM1 4 h 40 / cinq heures moins vingt (D10, **nouveau, `@a-valider`**) · « Avec sa propre consigne, l'exercice à placer lit la consigne puis l'heure dite » (D29) · « Léa peut réécouter l'heure à placer » · « À 360 px, l'horloge à placer et ses commandes tiennent dans la largeur de l'écran » · « Les boutons « + » et « − » et chaque aiguille se touchent du doigt sur au moins 44 px » · « Avec les mouvements réduits, l'aiguille saute à sa place sans tourner » · « Avec les mouvements réduits, « Je ne sais pas » montre la bonne heure sans faire tourner les aiguilles » (D18) · « Sans réseau, les aiguilles placées sont corrigées et la séance continue » |

Au total : **5 règles, 34 scénarios** (dont 9 plans de scénario), soit **55 cas** joués par projet. « Dn » renvoie à la décision #190.n.

Provenance : **33 scénarios** viennent de la version validée de #190 (son plan des heures à placer au CP, ses anciennes R3 et R4 sauf le scénario des lecteurs d'écran en mode lire, et les scénarios « placer » de ses anciennes R5 et R6). Deux plans de #190 ont été scindés : la ligne « mode placer » du plan « Je ne sais pas est proposé » et celle du plan « À 360 px » deviennent ici deux scénarios simples. Un seul scénario est **nouveau** : le plan de l'heure dite à partir du CE2 (D10, partie à confirmer par le PO).

### Exemples aux bornes

| Cas | Exemple |
|---|---|
| Plus petite et plus grande heure du CP | 1:00 et 12:00 acceptées ; 13:00 et 0:00 refusées (D17) |
| Cohérence | 3 h 30 : petite à mi-chemin juste ; pile sur le 3, sur le 4, aux trois quarts du chemin fausses (D7) |
| Aimantation | CE1 : la grande aiguille ne se pose que sur 12, 3, 6, 9 ; CP : seulement sur le 12 (D2, D24) |
| Départ des aiguilles | 12 h ; 6 h si l'heure à placer est midi (D23) |
| Heure dite avec « moins » | CM1 4:40 dite « cinq heures moins vingt » (D10, à confirmer) |

### Rejet au build

Le build (`scripts/build_bibliotheque.py`) refuse, en plus des défauts de #190 : une heure supérieure à 12 en mode placer au CP, avec la raison « heure hors du programme du CP » (D17).

## Hors périmètre

- Tout ce que livre #190 : type `horloge`, validation commune, mode lire.
- Aide calculée quand les aiguilles ne sont pas cohérentes (D33).
- Durées entre deux instants affichés, générateur d'heures, test de départ (D12, D14, D16).

## Questions ouvertes

1. **Heure dite à partir du CE2 (D10).** Choix de l'orchestrateur, d'après le programme du CE2 : les minutes de 40 à 55 se disent avec « moins » (« cinq heures moins vingt », « sept heures moins le quart »), les autres en nombre (« dix heures trente-cinq »). À confirmer par le PO ; le plan qui l'illustre porte `@a-valider`.

## Décisions

Toutes les décisions viennent de la validation de #190 par le PO le 2026-11-09 ; leur texte complet est dans `docs/stories/190/acceptance.md`, section « Décisions ». Celles qui jouent dans #192 :

| # | Décision |
|---|---|
| 2 | Aiguilles aimantées au pas de la précision de l'heure. |
| 3 | Aiguilles séparées au CP et au CE1, liées à partir du CE2. |
| 4 | Aiguille des secondes seulement au CM2, pour un exercice à la précision seconde. |
| 6 | Après une erreur, les aiguilles de l'enfant restent, l'aide est lue, nouvelle chance ; la bonne heure n'est montrée qu'après « Je ne sais pas ». |
| 7 | La petite aiguille se pose au pas de la précision ; la cohérence est exacte. |
| 9 | Précision par défaut : CP heure, CE1 quart d'heure, CE2 et CM1 minute, CM2 seconde. |
| 10 | Heure écrite « 3 h », « 3 h 30 », « 6 h 18 min 20 s » ; dite « trois heures », « midi », « et quart », « et demie » ; à partir du CE2, « moins » de 40 à 55 minutes (à confirmer par le PO). |
| 15 | Une question ratée revient en révision, dans le même mode. |
| 17 | Au CP en mode placer, de 1 h à 12 h ; minuit refusé partout. |
| 18 | « Je ne sais pas » : les aiguilles tournent jusqu'à la bonne heure puis reviennent ; l'enfant les place lui-même (sans tourner avec les mouvements réduits). |
| 19 | L'heure placée n'est pas écrite à l'écran, seulement annoncée aux lecteurs d'écran. |
| 23 | Départ des aiguilles à 12 h, ou à 6 h quand l'heure à placer est égale à 12 h sur le cadran. |
| 24 | Au CP, la grande aiguille ne se pose que sur le 12. |
| 25 | « + » / « − » et flèches avancent l'aiguille choisie d'un pas ; droite et haut dans le sens des aiguilles d'une montre. |
| 26 | Annonce « Les aiguilles montrent 3 h 30. », après chaque mouvement, sans juger la réponse. |
| 28 | Après « Je ne sais pas », la bonne heure ne reste pas affichée ; l'enfant peut réécouter l'heure. |
| 29 | Avec sa propre consigne, la consigne est lue puis l'heure dite ; l'heure est écrite sous la consigne. |
| 31 | Découpage : #192 livre le mode placer, après #190. |
| 33 | Pas d'aide calculée pour des aiguilles pas cohérentes ; l'aide par défaut est lue. |
