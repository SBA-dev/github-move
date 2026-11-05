# Critères d'acceptance : issue #163, une réponse fausse animée par le personnage guide

Scénarios : `features/163-reponse-fausse-animee.feature` (`@issue-163`).
Modèle : `docs/stories/163/domain-model.md` (questions 163.1 à 163.12).
État : **cadrage en attente du PO**. Les questions 163.1 à 163.12 ne sont pas tranchées : les scénarios suivent les
recommandations (163.1 B, 163.2 A, 163.3 A, 163.4 A, 163.5 recos, 163.6 reco, 163.7 A, 163.8 reco, 163.11 reco).
Chaque scénario qui dépend d'une question porte le commentaire `# dépend de 163.n` et le tag `@a-valider`.
Les questions nouvelles sont 163.13 à 163.18, plus bas.

Livraisons (163.11) : `@livraison-163a` (mécanisme et Coach Léo), puis `@livraison-163b` (Lili), `@livraison-163c`
(Noisette), `@livraison-163d` (Lumi), `@livraison-163e` (Agent Max), `@livraison-163f` (Capitaine Sam). Les cinq
derniers tags ne portent que sur les lignes d'`Exemples` du plan « chaque personnage guide a sa scène ».
Sélection des scénarios de 163a : `@issue-163 and not (@livraison-163b or @livraison-163c or @livraison-163d or
@livraison-163e or @livraison-163f)`.
Le scénario de la tenue portée est tagué `@depend-de-106` : il attend la livraison 106h de #106 (tenue portée dans
les scènes). La convention du dépôt est `@depend-de-<n° d'issue>` ; 106h n'a pas d'issue à elle, et #106 reste
ouverte jusqu'à 106h. Tout le câblage de #163 attend de toute façon le merge de 106h (modèle, « État »).

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
| R1 | À la première réponse fausse de la séance, le personnage guide joue sa scène de réponse fausse, en plus du son « réponse fausse » et de l'encouragement ; la même question reste posée | Léa répond « 8 » à « Combien font 3 + 4 ? » : son doux, encouragement, Coach Léo et son ballon, puis la question attend | 7 |
| R2 | Une seule scène par séance ; les réponses fausses suivantes gardent le retour de #97 | 2e réponse fausse à « poule » : Coach Léo réfléchit, sans scène ; nouvelle séance : la scène revient ; « Je ne sais pas » ne la consomme pas | 4 |
| R3 | La scène ne retient jamais l'enfant : réponses, clavier et boutons dès la première image ; une réponse ou un bouton l'arrête ; un toucher hors des boutons ne fait rien | « 7 » pendant la scène : réussie tout de suite ; « Je ne sais pas », « Réécouter » l'arrêtent | 6 |
| R4 | Elle ne change rien à l'apprentissage : erreur comptée, étoiles, avancement, parcours | 0 question réussie sur 15 après « on » ; 1 erreur = 2 étoiles en « Sports » comme en « Danse » | 2 (dont 1 plan, 2 exemples) |
| R5 | Chaque personnage guide a sa scène, douce et sans danger, avec la tenue portée ; c'est celle de l'univers du profil au moment de la réponse | Lili vacille à peine et fait une révérence ; la noisette rebondit à côté de Noisette ; Coach Léo porte « une écharpe rayée » | 3 (dont 1 plan, 6 exemples) |
| R6 | Jamais plus attrayante que la bonne réponse : courte, sans confettis, sans cri de victoire, sans musique, sans son à elle | un seul « réponse fausse » entendu, aucun confetti | 2 |
| R7 | Accessibilité : image fixe en mouvements réduits, Muet (effet sonore sans parole, 97.2), une seule annonce, mode dys, 360 px, 44 px | image fixe souriant pouce levé ; lecteurs d'écran : l'encouragement une fois, jamais « oh ! » | 5 |
| R8 | Écrans : séance d'une leçon (tous types), révision, défi, grand défi ; jamais pendant le chrono d'une fluence, après « Je ne sais pas », au test de départ, ni avec l'addition posée à 360 px | bulles, classer, ordre ; « lit » en révision ; « 4 » au défi ; fluence : son seul | 8 (dont 1 plan, 3 exemples) |

Total : 8 règles, 37 scénarios (dont 3 plans), 45 cas une fois les exemples déroulés. Huit règles, c'est plus que
les 6 conseillés par le skill `bdd-gherkin` : le découpage par livraison (163.11) répond à cette taille, car R5 est
la seule règle qui grandit d'une livraison à l'autre.

Note sur le Muet : le Muet coupe la parole, pas les effets sonores (décision 97.2). En Muet, Léa entend donc encore
« réponse fausse » ; la scène, elle, n'ajoute aucun son, en Muet comme sans Muet.

## Scénarios, par règle

**R1. Première réponse fausse de la séance : la scène, en plus du retour de #97**
- À la première réponse fausse de la séance, Coach Léo joue sa scène de réponse fausse et encourage Léa (163.1, 163.3, 163.7)
- La scène de réponse fausse n'affiche aucun titre : l'aide reste la seule chose à lire (163.3)
- La scène de réponse fausse n'est jamais punitive : Coach Léo finit souriant, sans croix ni rouge plein écran
- À la fin de sa scène de réponse fausse, Coach Léo reprend sa place et la même question attend Léa (163.13)
- Après la scène de réponse fausse, la bonne réponse garde tout son retour
- Sans réseau, Coach Léo joue quand même sa scène de réponse fausse
- Quand la scène de réponse fausse ne peut pas être chargée, Coach Léo réfléchit comme avant et la nouvelle chance n'attend pas

**R2. Une seule scène par séance**
- À la deuxième réponse fausse à la même question, Coach Léo encourage sans rejouer sa scène (163.1)
- Une réponse fausse à une autre question de la même séance ne rejoue pas la scène (163.1)
- Dans une nouvelle séance, la première réponse fausse fait de nouveau jouer la scène (163.1, 163.14)
- « Je ne sais pas » ne fait pas jouer la scène et ne la consomme pas : la première réponse fausse qui suit la fait jouer (163.1, 163.6)

**R3. La scène ne retient jamais l'enfant**
- Pendant la scène de réponse fausse, la question et ses choix restent visibles
- Une bonne réponse donnée pendant la scène de réponse fausse est prise tout de suite et l'arrête
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
- Pendant la scène de réponse fausse, Coach Léo porte la tenue choisie par Léa (163.8, `@depend-de-106`)

**R6. Jamais plus attrayante que la bonne réponse**
- La scène de réponse fausse est plus courte qu'une célébration de l'univers (163.2)
- La scène de réponse fausse n'a ni confettis, ni cri de victoire, ni musique, ni son à elle

**R7. Accessibilité**
- Avec les mouvements réduits, Léa voit l'image fixe de la scène de réponse fausse, et l'encouragement est dit
- En Muet, la scène de réponse fausse se joue sans aucune parole, et seul « réponse fausse » se fait entendre
- Les lecteurs d'écran annoncent une seule fois l'encouragement, sans lire la scène de réponse fausse (163.3)
- Avec le mode dys, l'encouragement dit pendant la scène de réponse fausse s'affiche en mode dys
- À 360 px, la scène de réponse fausse tient à la place du personnage guide, et les choix restent assez grands (163.7)

**R8. Écrans concernés et non concernés**
- Plan : Dans un exercice bulles / classer / ordre, la première réponse fausse de la séance fait jouer la scène de réponse fausse (163.6)
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
- La scène pendant la dictée tant que 163.15 n'est pas tranchée (aucun scénario de dictée écrit).

## Questions ouvertes

Questions 163.1 à 163.12 : voir `docs/stories/163/domain-model.md`. Questions nouvelles :

**163.13 Après la scène, quelle humeur montre le dessin du personnage guide ?** La scène finit souriante, le pouce
levé ; puis le dessin fixe revient, et la même question reste posée.
- **Reco A** : l'humeur `reflechit` de #97 (il penche la tête), jusqu'à la réponse suivante. Raison : rien ne change
  au retour de #97 après la scène, et l'humeur invite à regarder encore la question.
- B : l'humeur `content`, le personnage guide souriant, dans le prolongement de la fin de la scène.

**163.14 Une nouvelle séance rejoue-t-elle la scène ?** Avec 163.1 B, « scène déjà jouée » n'est gardée que le temps
de l'écran de la séance. Exemple : Léa voit la scène dans la séance de « Les sons ou, on, an », la termine, puis
commence une séance de révision et s'y trompe.
- **Reco A** : oui, à la première réponse fausse de **chaque** séance, même le même jour, même pour une séance
  quittée puis recommencée. Raison : rien n'est enregistré (minimisation), et quitter une séance pour revoir une
  scène de 1,5 s n'a pas d'intérêt pour l'enfant.
- B : une fois par jour et par profil (il faudrait garder une date sur l'appareil).

**163.15 Dictée : la scène à la première lettre fausse ?** En dictée, une réponse fausse est une lettre fausse
(`Seance.taper`).
- **Reco A** : oui, à la première lettre fausse de la séance ; la lettre suivante tapée arrête la scène comme une
  réponse. Un scénario de dictée sera ajouté quand la question sera tranchée.
- B : pas de scène en dictée, pour ne pas distraire l'enfant pendant qu'il écrit un mot.

**163.16 Les bulles écrites du dessin (« oh ! », « pschitt ! ») en mode dys et en mouvements réduits ?**
- **Reco A** : en mode dys, elles s'écrivent en police Andika comme tout texte que l'enfant lit ; l'image fixe des
  mouvements réduits n'en montre aucune (seulement le personnage guide souriant, le pouce levé).
- B : elles gardent leur lettrage dessiné, comme un élément du dessin.

**163.17 Une séance d'un seul exercice (« Je joue seulement l'exercice », « Rejouer ») compte-t-elle comme une
séance ?**
- **Reco A** : oui, une scène au plus dans cette séance, comme dans une séance complète. Les scénarios s'appuient sur
  cette reco (exercice seul, question de test).
- B : non, une seule scène pour tous les exercices joués à la suite sans revenir à l'accueil.

**163.18 Une réponse fausse donnée pendant la scène ?** Exemple : Léa répond « 8 », la scène commence, et elle
touche aussitôt « 9 ».
- **Reco A** : la réponse est prise tout de suite et arrête la scène, comme une bonne réponse ; elle reçoit le
  retour de #97 (son « réponse fausse », encouragement, `reflechit`), sans rejouer la scène (163.1 B).
- B : la deuxième réponse fausse attend la fin de la scène (à éviter : la scène retiendrait l'enfant).
