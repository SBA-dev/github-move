# Critères d'acceptance : issue #163, une réponse fausse animée par le personnage guide

Scénarios : `features/163-reponse-fausse-animee.feature` (`@issue-163`).
Modèle : `docs/stories/163/domain-model.md` (questions 163.1 à 163.12, 163.19 à 163.21).
État : **cadrage tranché**. Le PO a retenu le 2026-11-05 toutes les recommandations de 163.1 à 163.18
(« 163 reco tout », [annonce du responsable](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)), puis le même jour 163.19 à 163.21 posées
avec la planche de Coach Léo (« 163a reco tout », [annonce du responsable](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672618059)). Plus aucun scénario n'est tagué
`@a-valider` ; le détail est dans la section « Décisions ».

Livraisons (163.11) : `@livraison-163a` (mécanisme et Coach Léo), puis `@livraison-163b` (Lili), `@livraison-163c`
(Noisette), `@livraison-163d` (Lumi), `@livraison-163e` (Agent Max), `@livraison-163f` (Capitaine Sam). Les cinq
derniers tags ne portent que sur les lignes d'`Exemples` du plan « chaque personnage guide a sa scène », sauf
`@livraison-163f`, qui porte aussi le scénario R7 des mouvements réduits activés pendant la scène de Capitaine Sam.
Sélection des scénarios de 163a : `@issue-163 and not (@livraison-163b or @livraison-163c or @livraison-163d or
@livraison-163e or @livraison-163f)`.
La tenue portée dans les scènes vient de la livraison 106h de #106, mergée : le scénario de la tenue portée n'a
plus de tag `@depend-de-106`.

## Objectif

En tant qu'**enfant**, quand je me trompe, je veux que mon **personnage guide** réagisse par une petite **scène de
réponse fausse** drôle et gentille, afin de comprendre que ce n'est pas grave et d'avoir envie de réessayer.

Besoins nourris (skill `gamification`, section 1) :
- **lien** : c'est son personnage guide qui dédramatise, avec lui ;
- **compétence** : l'erreur reste une étape (encouragement, aide, nouvelle chance), jamais une sanction.

Déclencheur métier : la **réponse fausse** (Apprentissage, `ResultatDeReponse` = `"fausse"`), la première de la
séance (163.1 B). Garde-fous (section 5) : la scène n'est jamais plus attrayante que la bonne réponse (une fois par
séance, courte, ni confettis, ni cri de victoire, ni musique, ni son à elle) ; aucun hasard ; rien n'est enregistré ;
elle ne retient jamais l'enfant.

## Règles et exemples

| # | Règle | Exemples clés | Scénarios |
|---|---|---|---|
| R1 | À la première réponse fausse de la séance, le personnage guide joue sa scène de réponse fausse, en plus du son « réponse fausse » et de l'encouragement ; la même question reste posée | Léa répond « 8 » à « Combien font 3 + 4 ? » : son doux, encouragement, Coach Léo et son ballon, puis il réfléchit et la question attend | 7 |
| R2 | Une seule scène par séance ; les réponses fausses suivantes gardent le retour de #97 | 2e réponse fausse à « poule » : Coach Léo réfléchit, sans scène ; scène qui n'a pas pu être chargée : comptée comme jouée ; nouvelle séance (terminée, quittée, exercice joué seul) : la scène revient ; exercice joué seul : une scène au plus ; « Je ne sais pas » ne la consomme pas | 6 (dont 1 plan, 3 exemples) |
| R3 | La scène ne retient jamais l'enfant : réponses, clavier et boutons dès la première image ; une réponse ou un bouton l'arrête ; un toucher hors des boutons ne fait rien | « 7 » pendant la scène : réussie tout de suite ; « 9 » pendant la scène : prise tout de suite, retour de #97 sans rejouer la scène ; en dictée, la lettre « t » l'arrête ; « Je ne sais pas », « Réécouter » l'arrêtent | 8 |
| R4 | Elle ne change rien à l'apprentissage : erreur comptée, étoiles, avancement, parcours | 0 question réussie sur 15 après « on » ; 1 erreur = 2 étoiles en « Sports » comme en « Danse » | 2 (dont 1 plan, 2 exemples) |
| R5 | Chaque personnage guide a sa scène, douce et sans danger, avec la tenue portée ; c'est celle de l'univers du profil au moment de la réponse | Lili vacille à peine et fait une révérence ; la noisette rebondit à côté de Noisette ; Coach Léo porte « une écharpe rayée » | 3 (dont 1 plan, 6 exemples) |
| R6 | Jamais plus attrayante que la bonne réponse : courte, sans confettis, sans cri de victoire, sans musique, sans son à elle | un seul « réponse fausse » entendu, aucun confetti | 2 |
| R7 | Accessibilité : image fixe en mouvements réduits, Muet (effet sonore sans parole, 97.2), une seule annonce, mode dys, bulles écrites cachées sur un petit dessin, 360 px, 44 px | image fixe souriant pouce levé, sans bulle écrite ; bulles écrites en mode dys ; lecteurs d'écran : l'encouragement une fois, jamais « oh ! » ; boîte à jetons (dessin de 80 px) : scène sans bulle écrite ; mouvements réduits activés pendant la scène de Capitaine Sam : image fixe sans eau, sans gouttes, sans bulle écrite | 7 |
| R8 | Écrans : séance d'une leçon (tous types), révision, défi, grand défi ; jamais pendant le chrono d'une fluence, après « Je ne sais pas », au test de départ, ni avec l'addition posée à 360 px | bulles, classer, ordre ; dictée : « chas », la lettre « s » en rouge ; « lit » en révision ; « 4 » au défi ; fluence : son seul | 9 (dont 1 plan, 3 exemples) |

Total : 8 règles, 44 scénarios (dont 4 plans), 54 cas une fois les exemples déroulés. Huit règles, c'est plus que
les 6 conseillés par le skill `bdd-gherkin` : le découpage par livraison (163.11) répond à cette taille, car R5 est
la seule règle qui grandit d'une livraison à l'autre.

Note sur la dictée (163.15 A) : un mot dicté est corrigé quand sa dernière case est remplie, et une case s'allume
sans juger la lettre (#19, #128). « La première lettre fausse de la séance » fait donc jouer la scène au moment où le
mot est corrigé et où la lettre fausse est montrée en rouge ; la lettre suivante écrite (le début juste est gardé)
est prise tout de suite et arrête la scène.

Note sur les bulles écrites (163.21 A) : elles ne sont montrées que si le dessin du personnage guide mesure au moins
100 px. En dessous (80 px dans la boîte à jetons), la scène se joue sans bulle écrite ; l'encouragement et l'aide,
eux, restent dans la bulle du personnage guide. C'est de l'affichage, sans effet sur le domaine.

Note sur le Muet : le Muet coupe la parole, pas les effets sonores (décision 97.2). En Muet, Léa entend donc encore
« réponse fausse » ; la scène, elle, n'ajoute aucun son, en Muet comme sans Muet.

## Scénarios, par règle

**R1. Première réponse fausse de la séance : la scène, en plus du retour de #97**
- À la première réponse fausse de la séance, Coach Léo joue sa scène de réponse fausse et encourage Léa (163.1, 163.3, 163.7)
- La scène de réponse fausse n'affiche aucun titre : l'aide reste la seule chose à lire (163.3)
- La scène de réponse fausse n'est jamais punitive : Coach Léo finit souriant, sans croix ni rouge plein écran
- À la fin de sa scène de réponse fausse, Coach Léo reprend sa place et la même question attend Léa (163.13 : il réfléchit)
- Après la scène de réponse fausse, la bonne réponse garde tout son retour
- Sans réseau, Coach Léo joue quand même sa scène de réponse fausse
- Quand la scène de réponse fausse ne peut pas être chargée, Coach Léo réfléchit comme avant et la nouvelle chance n'attend pas (163.19)

**R2. Une seule scène par séance**
- À la deuxième réponse fausse à la même question, Coach Léo encourage sans rejouer sa scène (163.1)
- Une réponse fausse à une autre question de la même séance ne rejoue pas la scène (163.1)
- Quand la scène de réponse fausse n'a pas pu être chargée, la réponse fausse suivante de la même séance ne la fait pas jouer non plus (163.19)
- Plan : Dans une nouvelle séance, la première réponse fausse fait de nouveau jouer la scène, après une séance terminée / une séance quittée avant la fin / l'exercice « Le mot bien écrit » joué seul (163.1, 163.14, 163.17)
- Dans un exercice joué seul, la scène n'est jouée qu'une fois, comme dans une séance complète (163.17)
- « Je ne sais pas » ne fait pas jouer la scène et ne la consomme pas : la première réponse fausse qui suit la fait jouer (163.1, 163.6)

**R3. La scène ne retient jamais l'enfant**
- Pendant la scène de réponse fausse, la question et ses choix restent visibles
- Une bonne réponse donnée pendant la scène de réponse fausse est prise tout de suite et l'arrête
- Une autre réponse fausse donnée pendant la scène de réponse fausse est prise tout de suite, l'arrête et garde le retour habituel sans rejouer la scène (163.18)
- En dictée, la lettre écrite pendant la scène de réponse fausse est prise tout de suite et l'arrête (163.15)
- Pendant la scène de réponse fausse, le clavier n'est jamais bloqué
- Pendant la scène de réponse fausse, « Je ne sais pas » agit tout de suite et l'arrête
- Pendant la scène de réponse fausse, demander à réécouter la question l'arrête
- Toucher l'écran en dehors des boutons pendant la scène de réponse fausse ne change rien

**R4. Rien ne change à l'apprentissage**
- Une réponse fausse avec la scène ne fait voler aucun point et ne change pas l'avancement de la séance
- Plan : Dans l'univers « Sports » / « Danse », une séance avec une erreur donne les mêmes étoiles

**R5. Une scène par personnage guide, tenue portée, univers du moment**
- Plan : Dans l'univers « <univers> », <personnage guide> joue sa scène de réponse fausse, puis la même question reste posée (163.4, 163.5, 163.11) : Coach Léo (163a), Lili (163b), Noisette (163c), Lumi (163d), Agent Max (163e), Capitaine Sam (163f)
- Un enfant passé dans l'univers « Sports » voit Coach Léo jouer la scène de réponse fausse
- Pendant la scène de réponse fausse, Coach Léo porte la tenue choisie par Léa (163.8)

**R6. Jamais plus attrayante que la bonne réponse**
- La scène de réponse fausse est plus courte qu'une célébration de l'univers (163.2)
- La scène de réponse fausse n'a ni confettis, ni cri de victoire, ni musique, ni son à elle

**R7. Accessibilité**
- Avec les mouvements réduits, Léa voit l'image fixe de la scène de réponse fausse, et l'encouragement est dit (163.16 : aucune bulle écrite)
- En Muet, la scène de réponse fausse se joue sans aucune parole, et seul « réponse fausse » se fait entendre
- Les lecteurs d'écran annoncent une seule fois l'encouragement, sans lire la scène de réponse fausse (163.3)
- Avec le mode dys, l'encouragement et les bulles écrites de la scène de réponse fausse s'affichent en mode dys (163.16)
- Dans la boîte à jetons, où le dessin de Coach Léo est petit, la scène de réponse fausse se joue sans bulle écrite (163.21)
- À 360 px, la scène de réponse fausse tient à la place du personnage guide, et les choix restent assez grands (163.7)
- Quand les mouvements réduits s'activent pendant la scène de réponse fausse de Capitaine Sam, l'image fixe ne garde rien de la scène en mouvement (163.16, review de 163f ; `@livraison-163f`)

**R8. Écrans concernés et non concernés**
- Plan : Dans un exercice bulles / classer / ordre, la première réponse fausse de la séance fait jouer la scène de réponse fausse (163.6)
- En dictée, la première lettre fausse de la séance fait jouer la scène de réponse fausse quand le mot est corrigé (163.6, 163.15)
- En séance de révision, la première réponse fausse fait jouer la scène de réponse fausse (163.6)
- Pendant un défi, la première réponse fausse fait jouer la scène de réponse fausse (163.6)
- Pendant le grand défi, la première réponse fausse fait jouer la scène de réponse fausse (163.6)
- Pendant le chrono d'une fluence, une réponse fausse ne fait entendre que « réponse fausse », sans scène (97.10, 163.6)
- « Je ne sais pas » ne fait pas jouer la scène de réponse fausse (97.11, 163.6)
- Au test de départ, une réponse fausse garde l'encouragement, sans scène de réponse fausse (163.6)
- Avec l'addition posée sur un écran de 360 px, Coach Léo réfléchit sans jouer de scène de réponse fausse (163.7)

## Règle absolue sur les contenus

Les scènes décrites dans les scénarios sont celles proposées par le modèle (« Règle absolue, scène par scène ») :
le personnage guide reste d'aplomb et souriant, seuls des objets doux bougent autour de lui sans le toucher (ballon,
noisette dans l'herbe, bulles pastel, casquette rapportée par le chiot, gouttes d'eau bleu clair). Aucune chute, aucun
choc, aucune étoile à cinq branches. Aucun synonyme interdit d'« Erreur » (glossaire) n'apparaît dans les scénarios.

## Hors périmètre

- Une scène pour la **bonne réponse** ou pour « Je ne sais pas ».
- Plusieurs scènes ou variantes par personnage guide (le modèle n'en prévoit qu'une).
- Tout changement des encouragements, des aides, des effets sonores ou de l'humeur de #97.
- Toute donnée enregistrée ou envoyée au serveur : « scène déjà jouée » vit le temps de l'écran de la séance.
- Les écrans du parent, « Qui joue ? », la fin de la séance.

## Questions ouvertes

Aucune.

## Décisions

Les questions 163.1 à 163.18 sont tranchées le 2026-11-05 par le PO : « 163 reco tout » ([annonce du responsable](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)).
Pour 163.1, la recommandation était B : c'est B qui est retenu.
163.19 à 163.21, posées avec la planche de Coach Léo ([question](https://github.com/SBA-dev/github-move/issues/163#issuecomment-6672196226)), sont tranchées le même jour : « 163a reco tout » ([annonce du responsable](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672618059)).

- **163.1** Quand jouer la scène ? Tranchée le 2026-11-05 (reco B retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : une fois par séance, à la première réponse fausse.
- **163.2** Durée. Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : 1,5 s au plus, plus court qu'une célébration de l'univers.
- **163.3** Encouragement. Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : la scène s'ajoute à l'encouragement, sans titre ; une seule annonce, la bulle.
- **163.4** Capitaine Sam. Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : une scène, maquette et planche validées avant le câblage.
- **163.5** Règle absolue, scène par scène. Tranchée le 2026-11-05 (recos retenues, 163.5c A, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : les scènes décrites dans le plan de R5.
- **163.6** Écrans. Tranchée le 2026-11-05 (reco retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : séance d'une leçon (tous types, dictée comprise), révision, défi, grand défi ; pas pendant le chrono d'une fluence, après « Je ne sais pas », au test de départ.
- **163.7** Place. Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : à la place du dessin du personnage guide ; pas de scène avec l'addition posée sur téléphone.
- **163.8** Tenue. Tranchée le 2026-11-05 (reco retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : la tenue portée (scénario sans dépendance : 106h est mergée).
- **163.9** Nom. Tranchée le 2026-11-05 (reco retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : « scène de réponse fausse ».
- **163.10** Moteur. Tranchée le 2026-11-05 (reco retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : une nouvelle décision (hors scénarios).
- **163.11** Découpage. Tranchée le 2026-11-05 (reco retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : 163a, puis 163b à 163f.
- **163.12** Planche. Tranchée le 2026-11-05 (reco retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : avant le câblage (hors scénarios).
- **163.13** Humeur après la scène. Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : `reflechit`.
- **163.14** Nouvelle séance. Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : la scène est rejouée à chaque séance, même le même jour, même quittée puis recommencée.
- **163.15** Dictée. Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : la scène à la première lettre fausse de la séance ; la lettre suivante l'arrête.
- **163.16** Bulles écrites. Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : en mode dys, police du mode dys ; aucune sur l'image fixe.
- **163.17** Exercice joué seul. Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : c'est une séance, une scène au plus.
- **163.18** Réponse fausse pendant la scène. Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)) : prise tout de suite, arrête la scène, retour de #97 sans rejouer la scène.
- **163.19** Scène qui ne se charge pas. Tranchée le 2026-11-05 (reco A retenue, « 163a reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672618059)) : elle compte comme jouée pour la séance ; la réponse fausse suivante de la même séance ne fait pas jouer de scène.
- **163.20** Planche de Coach Léo. Tranchée le 2026-11-05 (reco A retenue, « 163a reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672618059)) : planche validée telle quelle (`docs/maquettes/reponse-fausse-coach-leo.html`, `docs/stories/163/captures/163a-coach-leo-*.png`) ; hors scénarios.
- **163.21** Bulle « oh ! » aux petites tailles. Tranchée le 2026-11-05 (reco A retenue, « 163a reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672618059)) : les bulles écrites sont cachées quand le dessin du personnage guide mesure moins de 100 px (boîte à jetons, 80 px).

Énoncés et options des questions, pour mémoire (163.1 à 163.12 et 163.19 : `docs/stories/163/domain-model.md`) :

**163.13 Après la scène, quelle humeur montre le dessin du personnage guide ?** La scène finit souriante, le pouce
levé ; puis le dessin fixe revient, et la même question reste posée.
**Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)).**
- **Reco A (retenue)** : l'humeur `reflechit` de #97 (il penche la tête), jusqu'à la réponse suivante. Raison : rien ne change
  au retour de #97 après la scène, et l'humeur invite à regarder encore la question.
- B : l'humeur `content`, le personnage guide souriant, dans le prolongement de la fin de la scène.

**163.14 Une nouvelle séance rejoue-t-elle la scène ?** Avec 163.1 B, « scène déjà jouée » n'est gardée que le temps
de l'écran de la séance. Exemple : Léa voit la scène dans la séance de « Les sons ou, on, an », la termine, puis
commence une séance de révision et s'y trompe.
**Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)).**
- **Reco A (retenue)** : oui, à la première réponse fausse de **chaque** séance, même le même jour, même pour une séance
  quittée puis recommencée. Raison : rien n'est enregistré (minimisation), et quitter une séance pour revoir une
  scène de 1,5 s n'a pas d'intérêt pour l'enfant.
- B : une fois par jour et par profil (il faudrait garder une date sur l'appareil).

**163.15 Dictée : la scène à la première lettre fausse ?** En dictée, une réponse fausse est une lettre fausse
(`Seance.taper`). Précision : voir « Note sur la dictée » (le mot est corrigé à sa dernière case).
**Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)).**
- **Reco A (retenue)** : oui, à la première lettre fausse de la séance ; la lettre suivante tapée arrête la scène comme une
  réponse. Scénarios de dictée : R3 et R8.
- B : pas de scène en dictée, pour ne pas distraire l'enfant pendant qu'il écrit un mot.

**163.16 Les bulles écrites du dessin (« oh ! », « pschitt ! ») en mode dys et en mouvements réduits ?**
**Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)).**
- **Reco A (retenue)** : en mode dys, elles s'écrivent en police Andika comme tout texte que l'enfant lit ; l'image fixe des
  mouvements réduits n'en montre aucune (seulement le personnage guide souriant, le pouce levé).
- B : elles gardent leur lettrage dessiné, comme un élément du dessin.

**163.17 Une séance d'un seul exercice (« Je joue seulement l'exercice », « Rejouer ») compte-t-elle comme une
séance ?**
**Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)).**
- **Reco A (retenue)** : oui, une scène au plus dans cette séance, comme dans une séance complète. Les scénarios s'appuient sur
  cette reco (exercice seul, question de test).
- B : non, une seule scène pour tous les exercices joués à la suite sans revenir à l'accueil.

**163.18 Une réponse fausse donnée pendant la scène ?** Exemple : Léa répond « 8 », la scène commence, et elle
touche aussitôt « 9 ».
**Tranchée le 2026-11-05 (reco A retenue, « 163 reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672057084)).**
- **Reco A (retenue)** : la réponse est prise tout de suite et arrête la scène, comme une bonne réponse ; elle reçoit le
  retour de #97 (son « réponse fausse », encouragement, `reflechit`), sans rejouer la scène (163.1 B).
- B : la deuxième réponse fausse attend la fin de la scène (à éviter : la scène retiendrait l'enfant).

**163.20 La planche de Coach Léo est-elle validée ?** (`docs/maquettes/reponse-fausse-coach-leo.html`,
`docs/stories/163/captures/163a-coach-leo-*.png`)
**Tranchée le 2026-11-05 (reco A retenue, « 163a reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672618059)).**
- **Reco A (retenue)** : oui, la planche est validée telle quelle.

**163.21 La bulle écrite « oh ! » aux petites tailles ?** Elle est illisible à 80 px et moins (dessin du personnage
guide dans la boîte à jetons) ; elle n'est jamais lue aux lecteurs d'écran.
**Tranchée le 2026-11-05 (reco A retenue, « 163a reco tout », [annonce](https://github.com/SBA-dev/github-move/issues/64#issuecomment-6672618059)).**
- **Reco A (retenue)** : la cacher quand le dessin du personnage guide mesure moins de 100 px. Scénario : R7.
- B : la garder partout.
