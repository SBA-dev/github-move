# Critères d'acceptance : story #190, exercice « horloge » (lire l'heure, placer les aiguilles)

Scénarios : `features/190-horloge.feature`. Modèle : `docs/stories/190/domain-model.md` (questions #190.1 à #190.22).

État : **à valider par le PO**. Tags :
- `@issue-190 @wip` sur la fonctionnalité ;
- `@a-valider` sur chaque scénario qui suit la recommandation d'une question pas encore tranchée ; un commentaire `# Question n` au-dessus renvoie à la liste ci-dessous ;
- aucun `@acces` : la story n'ajoute aucune donnée ni aucun droit (voir « Droits d'accès ») ;
- aucun `@depend-de-…`.

## Objectif

En tant qu'**enfant**, je veux voir une horloge à aiguilles et dire l'heure qu'elle montre, ou tourner moi-même ses aiguilles pour montrer une heure donnée, afin d'apprendre à lire l'heure comme en classe (programme du CP au CM2 : lire l'heure sur une horloge à aiguilles, positionner les aiguilles).

Besoins nourris (skill `gamification`) : **compétence** (l'enfant manipule une vraie horloge, la réussite se voit sur le cadran) et **autonomie** (il tourne lui-même les aiguilles, au doigt, au clavier ou avec « + » / « − »). Aucun garde-fou franchi : pas de temps limité, pas de pénalité, mêmes étoiles que les autres exercices, une erreur n'est jamais punitive.

Contenus pour les enfants : les exemples ne parlent que de moments ordinaires de la journée (le début de la classe, l'après-midi). Aucune heure réelle de l'enfant n'est demandée.

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Une leçon dont l'exercice horloge est mal formé n'est jamais proposée ; chaque heure respecte la précision de l'heure de l'exercice, ou à défaut celle du niveau, qui ne dépasse pas le programme | Plan « Au <niveau>, un exercice horloge à « <heure> » <précision> <résultat> dans le parcours » : 12 exemples, CP 3:00 oui / 3:30 non, CE1 3:30 et 9:45 oui / 3:10 non, même à la précision minute, CE2 6:18 oui, 3:00 à la précision heure oui, 3:30 à la précision heure non, CM1 4:41 oui / 4:41:10 non, CM2 6:18:20 à la précision seconde oui (Q9) · Plan « Une leçon dont l'exercice horloge <défaut> n'est pas proposée » : 7 exemples (mode « regarder », sans mode, aucune heure, 25:00, 3:60, « 3 h 30 », précision « dix minutes ») · « Une leçon dont l'exercice horloge demande deux heures égales sur le cadran n'est pas proposée » (Q30) · Plan « Au CP, un exercice horloge à placer à « <heure> » <résultat> dans le parcours » : 1:00 et 12:00 oui, 13:00 et 0:00 non (Q17) |
| R2 | Mode lire : l'horloge montre une heure ; au CP l'enfant choisit parmi trois heures toutes différentes sur le cadran, à partir du CE1 il l'écrit au clavier de cristaux ; une heure égale sur le cadran est juste, sauf si un moment de la journée est demandé ; l'heure n'est jamais écrite pendant la question | « Au CP, l'horloge montre 3 h et Léa choisit parmi trois heures entières, toutes différentes » (Q1, Q11) · Plan « Au CP, la réponse « <réponse> » à l'horloge qui montre <heure montrée> est juste » : 3 h, 9 h, 12 h (Q10) · « Au CE1, Tom écrit l'heure montrée au clavier de cristaux » (Q1) · « Sans moment de la journée, « 14 h 15 » est juste pour l'horloge qui montre 2 h 15 » (Q8, Q10) · « Quand c'est l'après-midi, « 3 h » n'est pas la bonne réponse et l'aide de l'heure est lue » (Q8) · « Une heure impossible ne peut pas être validée » (Q1) · « Pendant la question, l'heure n'est écrite nulle part à côté de l'horloge » (Q5) · « Après la bonne réponse, au CE1, l'affichage digital est montré à côté de l'horloge » (Q5) |
| R3 | Mode placer : l'enfant tourne les aiguilles puis valide ; juste si la grande aiguille est sur les minutes attendues et si les aiguilles sont cohérentes | « Au début d'une question à placer, les aiguilles montrent 12 h » (Q23) · « Quand l'heure à placer est midi, les aiguilles montrent 6 h au début » (Q23) · Plan « Au <niveau>, les aiguilles placées sur <heure> réussissent la question » : CP 3 h, 12 h ; CE1 3 h 30, 3 h 15 · Plan « Pour 3 h 30, la grande aiguille sur le 6 et la petite <place> ne sont pas cohérentes » : sur le 3, sur le 4, aux trois quarts du chemin (Q3, Q7, Q33) · « Des aiguilles qui montrent 3 h 15 ne réussissent pas « 3 h 30 » » · « À partir du CE2, la petite aiguille avance d'elle-même quand la grande tourne » (Q3) · Plan « À partir du CE2, au <niveau>, les aiguilles placées sur <heure> réussissent la question » : CE2 6 h 18, 10 h 35 ; CM1 4 h 40 (Q3, Q9) · « Au CM2, à la précision seconde, l'horloge a une aiguille des secondes à placer aussi » (Q4, Q10) · « Sans la précision seconde, l'horloge n'a pas d'aiguille des secondes » (Q4) · Plan « Au <niveau>, la grande aiguille lâchée <où> se pose <où> » : CE1 après le 3 → sur le 3, avant le 6 → sur le 6 ; CE2 → trait de 18 (Q2) · « Au CP, la grande aiguille revient toujours sur le 12 » (Q2, Q24) |
| R4 | Les aiguilles se tournent au doigt, au clavier (flèches) et avec « + » / « − » ; chaque mouvement avance l'aiguille choisie d'un pas de la précision de l'heure ; l'heure placée est annoncée aux lecteurs d'écran | « Sur tablette, Tom tourne les aiguilles au doigt et valide » · Plan « Au CE1, « <bouton> » de la grande aiguille la fait passer du 12 <à où> » : + → 3, − → 9 (Q2, Q25) · « Au CE1, « + » de la petite aiguille l'avance d'un quart du chemin vers le chiffre suivant » (Q3, Q25) · Plan « Au clavier, la flèche <flèche> fait passer la grande aiguille du 12 <à où> » : droite, haut → 3 ; gauche, bas → 9 (Q25) · « Au clavier seulement, Tom place les aiguilles et réussit la question » · « L'heure placée est annoncée aux lecteurs d'écran, sans être écrite à l'écran » (Q19, Q26) · « En mode lire, les lecteurs d'écran nomment l'horloge sans dire l'heure qu'elle montre » (Q27) |
| R5 | Une réponse fausse coûte une erreur, jamais une punition : encouragement, aide, nouvelle chance avec ce que l'enfant a placé ; « Je ne sais pas » montre la bonne heure une fois par question, puis l'enfant la donne lui-même ; une question ratée revient en révision | « Après une erreur au CP, le mauvais choix est écarté et l'aide de l'heure est lue » · « Sans aide de l'heure, le personnage guide lit l'aide par défaut de l'horloge » · « Après une erreur en mode placer, les aiguilles restent où Tom les a mises, sans montrer la bonne heure » (Q6) · « Après une erreur, les aiguilles placées sur 3 h 30 réussissent encore la question » · « Avec une erreur dans l'exercice horloge, Léa gagne 2 étoiles » · Plan « « Je ne sais pas » est proposé dans un exercice horloge (<cas>) » : lire avec choix, lire au clavier de cristaux, placer · « En mode lire avec les choix, « Je ne sais pas » ne laisse que la bonne heure, qui brille » · « En mode lire au clavier de cristaux, « Je ne sais pas » dit l'heure à taper » (Q1) · « En mode placer, « Je ne sais pas » montre la bonne heure, puis Tom place lui-même les aiguilles » (Q18, Q28) · « Après « Je ne sais pas », il n'est plus proposé pour cette question » · « Une question d'horloge ratée revient en séance de révision, dans le même mode » (Q15) |
| R6 | La consigne et l'heure à placer sont lues à voix haute, jamais l'heure à lire ; 360 px, cibles de 44 px, mode dys, sans réseau, mouvements réduits | Plan « Sans consigne, l'heure à placer <écriture> est écrite et dite « <heure dite> » » : 3 h / trois heures, 12 h / midi, 3 h 30 / trois heures et demie, 3 h 15 / trois heures et quart (Q10) · « Avec sa propre consigne, l'exercice à placer lit la consigne puis l'heure dite » (Q29) · « En mode lire, la consigne est lue mais pas l'heure montrée » · « Léa peut réécouter l'heure à placer » · « Avec « tout lire à voix haute », les heures proposées sont lues comme des heures dites » (Q10) · Plan « À 360 px, l'horloge à <mode> et ses commandes tiennent dans la largeur de l'écran » : lire avec choix, lire au clavier de cristaux, placer · « Les boutons « + » et « − » et chaque aiguille se touchent du doigt sur au moins 44 px » · « En mode dys, la consigne et les heures proposées s'affichent en mode dys » · « Avec les mouvements réduits, l'aiguille saute à sa place sans tourner » · « Avec les mouvements réduits, « Je ne sais pas » montre la bonne heure sans faire tourner les aiguilles » (Q18) · « Sans réseau, les aiguilles placées sont corrigées et la séance continue » |

Au total : **6 règles, 52 scénarios** (dont 13 plans de scénario), soit **94 cas** joués par projet. **34 scénarios** portent `@a-valider`.

### Exemples aux bornes

| Cas | Exemple |
|---|---|
| Plus petite et plus grande heure du CP | 1:00 et 12:00 acceptées ; 13:00 et 0:00 refusées (Q17) |
| Heure invalide | 25:00, 3:60, « 3 h 30 » (pas l'écriture « H:MM ») |
| Précision juste au-dessus du niveau | CE1 3:10 refusée, même si l'exercice écrit « précision minute » (Q9) |
| Précision plus grossière que le niveau | CE2 3:00 à la précision heure acceptée ; 3:30 à la précision heure refusée |
| Secondes | CM1 4:41:10 refusée ; CM2 6:18:20 à la précision seconde acceptée (Q4) |
| Égales sur le cadran | 3:00 et 15:00 dans le même exercice refusées (Q30) ; « 14 h 15 » écrit pour 2 h 15 juste sans moment (Q8) |
| Cohérence | 3 h 30 : petite à mi-chemin juste ; pile sur le 3, sur le 4, aux trois quarts du chemin fausses (Q7) |
| Aimantation | CE1 : la grande aiguille ne se pose que sur 12, 3, 6, 9 ; CP : seulement sur le 12 (Q2, Q24) |
| Départ des aiguilles | 12 h ; 6 h si l'heure à placer est midi (Q23) |

### Rejet au build (pipeline de contenu, vérifié par pytest, pas par un scénario)

Les mêmes défauts que dans R1 font **échouer** `scripts/build_bibliotheque.py`, avec un message qui nomme la leçon et la raison. Le domaine (`lireHorloge`, `LeconMalFormee`) les refuse aussi, ce qui écarte la leçon côté navigateur (c'est ce que les scénarios observent : la leçon n'apparaît pas dans le parcours).

| Défaut | Raison attendue dans le message |
|---|---|
| `mode` absent ou autre que `lire` / `placer` | mode de l'horloge inconnu |
| `items` absent ou vide | aucune heure |
| `heure` hors bornes (25:00, 3:60) ou mal écrite (« 3 h 30 ») | heure invalide |
| `precision` inconnue (« dix minutes ») | précision de l'heure inconnue |
| heure qui ne respecte pas la précision (3:30 à la précision heure ; 3:10 au CE1) | heure qui ne respecte pas la précision |
| précision plus fine que le niveau (minute au CE1) | précision au-delà du programme du niveau (Q9) |
| heure > 12 ou 0:00 en mode placer au CP | heure hors du programme du CP (Q17) |
| deux heures égales sur le cadran dans un exercice | heures en double sur le cadran (Q30) |

## Droits d'accès

Aucun scénario `@acces` : la story n'ajoute ni table, ni donnée, ni droit. Les réponses d'horloge (choix, heure écrite, position des aiguilles) sont des réponses de séance comme les autres, déjà couvertes par la RLS des séances, l'export et la suppression d'un profil (#14). Rien n'est envoyé à l'IA.

## Hors périmètre

- Durées entre deux instants affichés sur deux horloges (CE2, CM1, CM2) : story à part (Q16).
- Test de départ : aucune question d'horloge (Q14, reco non) ; aucun scénario, comme pour la boîte à jetons.
- Générateur d'heures tirées au hasard (Q12).
- Contenu : ajout d'exercices `horloge` aux leçons de la bibliothèque (Q22), produit par la session principale.
- Dessin du cadran et des aiguilles : validé sur planche (skill `illustration`), aucun scénario ne lit un tracé.

## Questions ouvertes

Liste fusionnée : 1 à 22 reprennent les questions du modèle (même numéro, #190.n) ; 23 à 34 viennent des critères.

1. **Mode lire : choisir ou écrire ?** Reco : **choix au CP, clavier de cristaux à partir du CE1**, comme le mode de réponse des calculs.
2. **Mode placer : aiguilles aimantées ou tour libre ?** Reco : **aimantées au pas de la précision de l'heure** (au doigt, une tolérance libre serait délicate).
3. **La petite aiguille suit-elle la grande ?** Reco du modèle : **séparées au CP et au CE1** (placer la petite aiguille entre le 3 et le 4 est ce qu'on apprend), **liées à partir du CE2** (lecture des critères : le modèle dit « B au CP et au CE1 » sans dire la suite ; les scénarios prennent « liées » à partir du CE2, à confirmer).
4. **Aiguille des secondes au CM2 dès cette story ?** Reco (des critères, le modèle n'en donne pas) : **oui, seulement pour un exercice à la précision seconde** ; ailleurs, pas d'aiguille des secondes.
5. **Affichage digital (« 14 : 15 ») à partir du CE1 ?** Reco : **jamais pendant la question** (il donnerait la réponse), **montré après la bonne réponse**.
6. **Que montre l'horloge après une réponse fausse ?** Reco : **les aiguilles de l'enfant restent, l'aide est lue, nouvelle chance** ; la bonne heure n'est montrée qu'après « Je ne sais pas ». Cela s'écarte du texte de l'issue (« l'horloge montre l'heure placée par l'enfant et la bonne heure »).
7. **Tolérance de la petite aiguille (aiguilles séparées).** Reco : avec l'aimantation (Q2), **la petite aiguille se pose aussi au pas de la précision et la cohérence est exacte** (à 3 h 30, à mi-chemin ; pile sur le 3 ou aux trois quarts du chemin, c'est faux).
8. **Moment de la journée** (`moment`, CE1). Reco : sans moment, une heure égale sur le cadran est juste (« 14 h 15 » pour 2 h 15) et les choix ne proposent jamais 3 h et 15 h ensemble ; avec un moment, il est **dit après la consigne** (« Quelle heure est-il ? C'est l'après-midi. ») et seule l'heure de ce moment est juste. Formulation à confirmer.
9. **Précision par défaut et limites.** Reco des critères : CP heure, CE1 quart d'heure, **CE2 minute** (cinq minutes reste possible comme précision écrite dans l'exercice), CM1 minute, CM2 seconde ; une précision **plus fine** que le niveau fait échouer le build, une **plus grossière** est permise.
10. **Écriture et heure dite.** Reco (des critères, le modèle n'en donne pas) : écrite « 3 h », « 12 h », « 3 h 30 », « 6 h 18 min 20 s » ; dite « trois heures », « **midi** » pour 12:00, « trois heures et demie », « trois heures et quart », « six heures dix-huit » ; les choix lus de même ; au clavier de cristaux, « 14 h 15 » et « 2 h 15 » sont la même réponse sans moment. Au CE2, « sept heures quarante-cinq » ou « huit heures moins le quart » : à trancher.
11. **Distracteurs calculés ou écrits dans le JSON ?** Reco : **calculés** (aiguilles inversées, heure d'à côté, chiffre montré par la grande aiguille, minutes voisines), tous à la précision du niveau et différents sur le cadran.
12. **Générateur d'heures dès cette story ?** Reco (des critères) : **non**, heures écrites seulement ; story à part si besoin.
13. **Mode par exercice ou par item ?** Reco : **par exercice** (une leçon peut avoir deux exercices `horloge`).
14. **Test de départ.** Reco : **non** dans cette story.
15. **Révision.** Reco : **oui**, une question ratée revient dans le même mode.
16. **Durées entre deux instants affichés.** Reco : **hors story**, story à part.
17. **Heures permises.** Reco (des critères) : au CP en mode placer, **de 1 h à 12 h** ; 0:00 (minuit) **refusé** partout dans cette story (le programme ne le cite pas).
18. **« Je ne sais pas » en mode placer.** Reco : les aiguilles **tournent jusqu'à la bonne heure, puis reviennent** où l'enfant les avait mises, et il les place lui-même.
19. **Heure placée écrite sous l'horloge pendant qu'on tourne ?** Reco : **non**, seulement l'annonce aux lecteurs d'écran.
20. **Nom « Horloge » dans le code.** Reco : renommer le type technique du front (par exemple `SourceDuTemps`) ; « horloge » ne désigne plus que l'horloge à aiguilles.
21. **« Mode » deux fois** (mode de l'horloge, mode de réponse). Reco (des critères) : garder **Mode de l'horloge** dans le domaine et le format ; le mot « mode » n'est jamais montré à l'enfant.
22. **Contenu.** Reco (des critères) : les quatre leçons sur l'heure (`ma-cp-heures`, `ma-ce1-heure-demi`, `ma-ce1-quarts-heure-durees`, `ma-ce2-heure-durees`) reçoivent des exercices `horloge` dans la même PR ; les leçons de durées plus tard, avec Q16.
23. **Position de départ des aiguilles en mode placer.** Reco : **12 h** (les deux aiguilles sur le 12), et **6 h** quand l'heure à placer est égale sur le cadran à 12 h, pour que valider sans rien toucher ne soit jamais juste.
24. **Au CP, la grande aiguille.** Avec l'aimantation à l'heure (Q2), la grande aiguille ne peut se poser que sur le 12 : l'enfant du CP ne place en fait que la petite aiguille. Reco : **oui, c'est voulu** (heures entières seulement) ; sinon, au CP, la grande aiguille ne serait pas déplaçable du tout.
25. **Pas des boutons « + » / « − » et des flèches.** Reco : un appui avance **l'aiguille choisie d'un pas de la précision de l'heure** (au CE1 : la grande d'un quart d'heure, du 12 au 3 ; la petite d'un quart du chemin entre deux chiffres) ; flèches **droite et haut** dans le sens des aiguilles d'une montre, **gauche et bas** dans l'autre sens ; chaque aiguille a ses deux boutons.
26. **Texte de l'annonce de l'heure placée.** Reco : « **Les aiguilles montrent 3 h 30.** », calculé par le domaine (heures données par le chiffre que la petite aiguille a passé, minutes par la grande), après chaque mouvement, sans juger la réponse. Avec des aiguilles séparées et pas cohérentes, faut-il annoncer chaque aiguille (« petite aiguille sur le 3, grande aiguille sur le 6 ») ?
27. **Lecteur d'écran en mode lire.** Reco : l'horloge est nommée « Horloge à aiguilles » **sans dire l'heure** (sinon il donne la réponse) ; l'heure est annoncée après la bonne réponse ou « Je ne sais pas ».
28. **Après « Je ne sais pas » en mode placer, la bonne heure reste-t-elle visible pendant que l'enfant replace ?** Reco : **non**, comme au clavier de cristaux, l'enfant l'a vue et entendue ; il peut demander à réécouter l'heure.
29. **Exercice à placer avec sa propre consigne.** Reco : la consigne de l'exercice est lue, **puis l'heure dite** (« Montre l'heure du début de la classe. », puis « neuf heures ») ; l'heure est aussi écrite sous la consigne.
30. **Deux heures égales sur le cadran dans un même exercice** (3:00 et 15:00). Reco (proposition du modèle, non numérotée) : **refusé au build** (même question deux fois, même clé de révision).
31. **Taille de la story.** 6 règles, 52 scénarios : c'est la limite haute. Faut-il découper en deux stories, **lire** puis **placer** (placer porte l'essentiel des questions 2, 3, 7, 18, 23 à 26, 28) ? Reco : **découper**, lire d'abord.
32. **Libellé du type d'exercice** (« L'horloge », modèle) et **consigne par défaut en mode lire** (« Quelle heure est-il ? »). Reco : les garder.
33. **Aide quand les aiguilles ne sont pas cohérentes.** Les scénarios lisent l'aide par défaut (« La petite aiguille montre les heures, la grande les minutes. »). Faut-il une aide propre à ce cas (« À 3 h 30, la petite aiguille est entre le 3 et le 4. ») calculée par le domaine ? Reco : **non dans cette story** ; l'auteur de la leçon peut l'écrire dans l'aide de l'heure.
34. **Explication de la réponse après la félicitation** (comme « On ouvre la boîte pour vérifier… »). Reco : **aucune phrase de plus** dans cette story ; seul l'affichage digital est montré après la bonne réponse (Q5).

## Décisions

Aucune pour l'instant.
