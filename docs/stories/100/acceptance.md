# Critères d'acceptance : issue #100, Défi de fin de partie du parcours (« défi de fin de chapitre »)

Scénarios : `features/100-defi-de-fin-de-partie-du-parcours.feature` (`@issue-100 @wip`).
Modèle : `docs/stories/100/domain-model.md`.
État : **cadrage validé le 2026-10-29**. Le PO a répondu aux questions #100.1 à #100.28 (commentaire 6507264741 de
l'issue #100, annonce [Responsable] 6507280845 de #64). Il ne reste aucune question ouverte ni aucun scénario
`@a-valider`. Le PO a allégé la story : le grand défi de la matière sort de #100 et devient la story #137 (voir
« Gardé pour #137 »).

## Objectif

En tant qu'**enfant**, après avoir réussi toutes les leçons d'une **partie du parcours**, je veux relever un **défi**
qui mélange leurs questions, afin de me prouver que je suis devenu fort, sans rien risquer de perdre.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : pratique de récupération entrelacée (questions mélangées de plusieurs leçons), défi relevé gardé
  pour toujours et visible sur « Mon parcours » et dans « Mes médailles » ;
- **autonomie** : le défi est proposé, jamais lancé d'office ; il ne bloque rien ; on le quitte ou on le rejoue
  quand on veut ;
- **lien** : le personnage guide propose le défi, l'accueille, encourage après une erreur et fête la fin.

Déclencheurs métier : la **leçon réussie** (#24, #27) qui complète une partie du parcours ouvre son défi ; le fait
`DefiTermine`, revalidé par le serveur, rend le défi **relevé** et retient ses questions ratées dans la **file de
révision**. Garde-fous respectés : pas de vie, pas de temps limité, pas de compte des erreurs, aucune étoile, aucun
verrou, rien de tiré au sort contre des étoiles, rien ne se perd.

## Bibliothèque de test

Bibliothèque de test du défi (identifiants `e2e-100-`), servie comme celles de #28 et #99 :
- maths du CE1 : « Maths 1 » (ordre 10) à « Maths 10 » (ordre 100), chacune un exercice bulles de 2 questions sans
  aide, « Combien font n + 1 ? » et « Combien font n + 2 ? », à 3 choix ; « Maths 2 » a en plus une fluence de calcul
  (elle ne doit jamais entrer dans le défi) ;
- sciences du CE1 : « Les êtres vivants », « Les saisons », « L'eau », chacune un exercice bulles de 2 questions à
  3 choix, sans aide (questions neutres sur le vivant, les saisons et l'eau) ;
- aucune autre leçon.

Avec les blocs de 5 (100.1 A), les maths ont 2 parties du parcours (leçons 1 à 5, puis 6 à 10), les sciences une
seule. La dernière partie du parcours d'une matière n'a pas de défi (1.b) : les maths n'ont donc que le **Défi 1**, les sciences
aucun. Aucun scénario n'a besoin d'un Défi 2 ; la bibliothèque reste à 10 leçons de maths.

## Example mapping

**R1. Ouverture.** Chaque partie du parcours, sauf la dernière de sa matière, a un défi. Il s'ouvre quand toutes ses
leçons sont réussies (au moins 1 étoile ou réussie au test de départ) ; avant, il est **à venir**, visible et sans
cadenas.
- Léa a réussi 4 leçons sur 5 : « Défi 1 » à venir, « Encore 1 leçon pour ouvrir le défi ».
- Léa a réussi « Maths 1, 2, 4, 5 » et termine « Maths 3 » : la fin de la séance annonce « Le défi 1 est ouvert ! »,
  Noisette le propose, « Relever le défi » est à côté de « Leçon suivante ».
- Quatre leçons réussies au test de départ et la cinquième avec 1 étoile : le défi est ouvert.
- Léa rejoue « Maths 3 » alors que le défi est déjà ouvert, ou termine « Maths 10 » : aucune annonce de défi.
- Toutes les maths réussies : un seul repère, « Défi 1 », rien après « Maths 10 » ; sciences réussies : aucun repère.

**R2. Ne bloque rien, ne change aucune note.**
- Défi 1 pas fait : Noisette se tient sur « Maths 6 » (« À toi ! »).
- Défi relevé sans erreur : « Maths 2 » garde 1 étoile.
- Fin du défi : ni étoile, ni objet de la cabane, ni tenue, ni badge, ni épisode.

**R3. Questions.** 10, seulement des leçons de la partie du parcours, qui se posent seules et sans temps limité ;
réparties à parts égales, mélangées ; chacune au plus une fois ; moins de 10 possibles : toutes, une fois chacune.
- Défi 1 : 2 questions de chacune des leçons 1 à 5, dans un ordre mélangé, aucune de la leçon 6, jamais la fluence.
- Moins de 10 questions possibles (100.22) : couvert par les tests unitaires du domaine (voir « Hors périmètre »).

**R4. Erreur.** Encouragement, aide (ou aide par défaut), nouvelle chance sans limite, « Je ne sais pas » ; pas de
vie, pas de temps qui passe, pas de nombre d'erreurs affiché ; la question ratée entre dans la file de révision
(100.10).
- Léa répond « 4 » à « Combien font 2 + 1 ? » : encouragement, « Essaie une autre bulle. », la question reste.
- Léa s'est trompée (ou a dit « Je ne sais pas ») à « Combien font 2 + 1 ? » pendant le défi : le lendemain,
  l'accueil propose la séance de révision, « 1 petite erreur des jours passés ».
- Défi sans erreur : rien en révision le lendemain.

**R5. Défi relevé.** Terminé = relevé, avec ou sans erreurs ; quitté = rien de perdu ; rejoué = sans nouvelle
récompense ; les défis relevés sont dans « Mes médailles ».
- Terminé sans erreur ou avec une erreur à chaque question : « Défi relevé ! », effet sonore « grande victoire ».
- Quitté après 6 questions : le défi reste ouvert, sans reproche.
- Rejoué : effet sonore « séance terminée », « Tu as encore relevé le défi 1 ! », sans l'annonce « Défi relevé ! ».
- Relevé deux fois : une seule ligne « Défi 1 · Maths · CE1 », dans la dernière section de « Mes médailles ».

**R6. « Mon parcours ».** Un repère par défi, à venir, ouvert ou relevé ; le personnage guide ne s'y arrête jamais ;
une ligne par défi dans la liste des lecteurs d'écran, rien après la dernière leçon de la matière.

**R7. Accessibilité et hors ligne.** Sans réseau, le défi se joue et se garde sur l'appareil ; mouvements réduits :
l'annonce reste, sans mouvement ; 360 px, cibles de 44 px.

**R8. Serveur et droits.** Le serveur seul enregistre le défi relevé, après revalidation ; un parent non rattaché ne
lit ni n'écrit rien ; un autre enfant du même parent n'hérite de rien ; l'export contient les défis relevés.

## Règles et scénarios

Les règles sont renumérotées depuis le retrait du grand défi (ancienne R6) : les anciennes R7, R8 et R9 deviennent
R6, R7 et R8.

| Règle | Scénarios |
|---|---|
| **R1.** Chaque partie du parcours, sauf la dernière de sa matière, a un défi ; il s'ouvre quand toutes ses leçons sont réussies ; avant, il est à venir, visible et sans cadenas | 1.1 Avec 0 ou 4 leçons réussies sur 5, le défi 1 est à venir (plan, 2 cas) · 1.2 Des leçons réussies au test de départ comptent pour ouvrir le défi · 1.3 La séance qui rend réussie la dernière leçon qui manquait ouvre le défi, et le personnage guide le propose sans le lancer · 1.4 Une séance qui n'ouvre aucun défi n'annonce aucun défi : leçon rejouée alors que son défi est déjà ouvert, dernière leçon de la dernière partie du parcours (plan, 2 cas) · 1.5 La dernière partie du parcours des maths, ou une matière d'une seule partie du parcours, n'a pas de défi (plan, 2 cas) |
| **R2.** Le défi ne bloque rien et ne change aucune note ; il ne donne ni objet de la cabane, ni tenue, ni badge, ni épisode | 2.1 Sans avoir fait le défi 1, l'enfant continue son parcours, et le personnage guide se tient sur la leçon 6 · 2.2 Relever le défi ne change aucune étoile des leçons de la partie du parcours · 2.3 La fin du défi ne montre aucune étoile et n'annonce ni objet de la cabane, ni tenue, ni badge, ni épisode |
| **R3.** 10 questions prises seulement dans les leçons de la partie du parcours, parmi celles qui se posent seules et sans temps limité, réparties à parts égales et mélangées | 3.1 Le défi 1 pose 2 questions de chacune des leçons 1 à 5, mélangées, jamais d'une autre leçon ni d'une fluence |
| **R4.** Une erreur suit les règles d'une séance ; ni vie, ni temps limité, ni compte des erreurs ; la question ratée entre dans la file de révision | 4.1 Le défi commence par une parole du personnage guide, sans vie ni temps qui passe · 4.2 Après une erreur pendant le défi, le personnage guide encourage, donne l'aide, et la même question reste posée · 4.3 Après un défi relevé en se trompant, en disant « Je ne sais pas » ou sans erreur, l'accueil du lendemain propose ou non la séance de révision (plan, 3 cas) |
| **R5.** Un défi terminé est relevé, avec ou sans erreurs, et sa fin le fête ; quitté sans rien perdre ; rejoué sans nouvelle récompense ; retrouvé dans « Mes médailles » | 5.1 Un défi terminé sans erreur, ou avec une erreur à chaque question, est relevé, et sa fin le fête (plan, 2 cas) · 5.2 Un défi quitté en cours n'est pas relevé et reste ouvert, sans reproche · 5.3 Rejouer un défi relevé le fait rejouer en entier, sans nouvelle annonce de défi relevé · 5.4 « Mes médailles » montre les défis relevés, chacun une seule fois, dans sa dernière section |
| **R6.** Sur « Mon parcours », chaque défi a son repère ; les lecteurs d'écran le lisent à sa place | 6.1 Le repère « Défi 1 » montre un défi ouvert ou relevé (plan, 2 cas) · 6.2 Les lecteurs d'écran lisent le défi dans la liste ordonnée, juste après sa dernière leçon |
| **R7.** Sans réseau, sans mouvement, sur 360 px | 7.1 Sans réseau, le défi se joue jusqu'au bout et sa fin dit que la progression est gardée sur l'appareil · 7.2 Avec les mouvements réduits, la fin du défi garde son annonce, sans mouvement ni confettis · 7.3 Une question du défi tient dans un écran de 360 px, « Je ne sais pas » compris · 7.4 À 360 px, le repère du défi tient dans la largeur et est assez grand pour un doigt d'enfant |
| **R8.** Le défi relevé est enregistré par le serveur, après vérification, seulement pour un parent rattaché ; il est compris dans les données du profil | 8.1 `@acces` Sur le téléphone du second parent rattaché, l'enfant retrouve son défi relevé · 8.2 Le serveur refuse un défi terminé incohérent : défi à venir, question d'une leçon hors du défi, question qui ne finit pas par la bonne réponse (plan, 3 cas) · 8.3 `@acces` Le défi relevé par un enfant ne se voit pas chez un autre enfant du même parent · 8.4 `@acces` Un parent qui n'est pas rattaché ne lit pas les défis relevés de Léa · 8.5 `@acces` Un parent qui n'est pas rattaché ne peut pas enregistrer un défi terminé pour Léa · 8.6 L'export du profil contient les défis relevés, sans les réponses données |

Total : 8 règles, 28 scénarios (dont 7 plans du scénario), soit 37 cas générés ; 4 `@acces`, aucun `@a-valider`.

Critères de l'issue couverts : 4 leçons sur 5 → à venir (1.1) ; 5 sur 5 → ouvert et proposé par le personnage guide
(1.3) ; questions des 5 leçons seulement (3.1) ; erreur → encouragement et aide (4.2) ; aucune étoile changée (2.2) ;
partie du parcours suivante ouverte sans le défi (2.1).

## Hors périmètre

- **Le grand défi de la matière** : story #137 (voir « Gardé pour #137 »). Dans #100, la dernière partie du parcours
  d'une matière et une matière d'une seule partie du parcours n'ont pas de défi (1.5).
- **Moins de 10 questions possibles** (100.22) : le défi pose toutes les questions possibles, une fois chacune. La
  bibliothèque de test du défi a exactement 10 questions possibles dans la première partie du parcours des maths ; un scénario de plus
  demanderait une autre bibliothèque de test. La règle est couverte par les tests unitaires de `planDuDefi` (règle 5
  du modèle, exemple 1, 4, 4, 4 et 4 questions posables), sans scénario.
- **Un défi qui n'existe pas** (`DefiInconnu`, par exemple un « défi 2 » des maths, qui serait celui de la dernière
  partie du parcours) et **un défi sans question posable** (`AucuneQuestionPourLeDefi`) : tests du domaine et du cas
  d'usage `TerminerLeDefi`.
- Le suivi du parent (#34) : les défis relevés n'y apparaissent pas (100.18). L'Espace parent ne montre rien du
  défi ; seul l'export le contient (8.6).
- La quête du jour (#101) : elle ne propose pas le défi, et un défi terminé ne l'accomplit pas (100.11). Pas de
  scénario tant que #101 n'est pas mergée ; la règle est couverte par les tests du domaine. Même chose pour la série
  (#30) et l'objectif du jour (#29), inchangés.
- L'ordre complet des annonces de la zone des nouveautés de la fin de séance (100.17) : le défi ouvert vient en
  dernier, au-dessus de « Relever le défi » ; un scénario d'ordre s'ajoutera avec l'équipe de #101.
- Une musique propre au défi (100.19), un nouveau champ `partie` dans le format des leçons (100.1 D, plus tard).
- La suppression en cascade avec le profil et l'idempotence de l'enregistrement (un défi gardé sur l'appareil et
  renvoyé n'est compté qu'une fois et ne retient pas deux fois ses questions ratées) : couvertes par les tests du cas
  d'usage `TerminerLeDefi` et la migration, sans scénario de plus. La suppression du profil est déjà vérifiée par #14.
- Les détails de la file de révision (question déjà retenue ratée de nouveau, question juste pendant le défi qui ne
  change rien, limite de 250) : mêmes règles qu'en séance (#28), couvertes par les tests du domaine (règle 9 du
  modèle).
- Un défi relevé qui reste relevé quand la bibliothèque change (100.15) : test unitaire du domaine.
- L'annonce d'exercice « Nouveau défi » remplacée par « Nouveau jeu » (100.4) : test unitaire de
  `paroles-de-seance.ts` ; le fichier de scénarios n'emploie jamais l'ancienne annonce.
- « Toutes les leçons », l'accueil de l'enfant (sauf « À revoir », 4.3) et la leçon du jour : inchangés.
- Le jeu du défi au clavier : il reprend les commandes d'une séance (#28, « au clavier seulement »), sans scénario de
  plus.

## Décisions

Réponses du PO du 2026-10-29 (« 100. 1 A 100.10 : oui elle rentre dans la révision les autres question reco . OK
pour alléger la story », puis « 1.b 2.a » aux deux précisions).

| Question | Réponse | Effet sur les scénarios |
|---|---|---|
| Découpage de la story | OK pour alléger | Le grand défi (ancienne R6, scénarios 3.2, 3.3, 6.1 à 6.3) sort de #100 et devient #137 |
| 100.1 Partie du parcours | A : blocs de 5 leçons consécutives, un dernier bloc de 1 ou 2 leçons rejoint le précédent | Bibliothèque de test, numéros de leçon |
| 100.2 Chapitre = partie du parcours | oui | Vocabulaire du fichier |
| 100.3 Texte de l'écran | « Défi 1 », « Défi 2 »… (« Grand défi » gardé pour #137) | 1.x, 2.1, 4.1, 5.x, 6.x, 7.4, 8.x |
| 100.4 Annonce « Nouveau défi » | Remplacée par « Nouveau jeu » | Aucun scénario |
| 100.5 Nombre de questions | 10 pour le défi d'une partie du parcours (12 de la matière gardées pour #137) | 3.1 |
| 100.6 Répartition | À parts égales entre les leçons | 3.1 |
| 100.7 Questions mélangées | oui | 3.1 |
| 100.8 Défi relevé | Dès qu'il est terminé, avec ou sans erreur | 5.1 |
| 100.9 Rejouable | oui, nouveau tirage, sans nouvelle récompense | 5.3, 5.4 |
| 100.10 Question ratée et révision | **oui** (écart à la reco) : elle entre dans la file de révision | Ancien 2.4 inversé, devenu 4.3 (plan, 3 cas) |
| 100.11 Série, épisodes, objectif et quête du jour | Le défi ne compte pour aucun | 2.3 |
| 100.12 Récompense | Le défi relevé lui-même : repère, célébration, parole du personnage guide, « Mes défis relevés » | 2.3, 5.1, 5.4 |
| 100.13 Étoiles pour la cabane | non | 2.2, 2.3 |
| 100.14 Matière d'une seule partie du parcours | **1.b** : aucun défi dans #100 (« n'a que le grand défi » gardé pour #137) | 1.5 |
| 100.15 Bibliothèque changée | Un défi relevé reste relevé | Test unitaire |
| 100.16 Défi à venir | Visible, sans cadenas | 1.1, 6.2 |
| 100.17 Ordre des nouveautés | Le défi ouvert en dernier, au-dessus de « Relever le défi », à accorder avec #101 | 1.3 (ne fixe pas l'ordre) |
| 100.18 Suivi du parent | Rien dans #100 | Hors périmètre |
| 100.19 Mise en scène | Paysage de #96, effets sonores de #97, paroles du personnage guide, pas de musique nouvelle | 4.1 |
| 100.20 Termes | Validés (Défi de la matière et grand défi gardés pour #137) | Vocabulaire du fichier |
| 100.21 Textes | Retenus (l'annonce du grand défi gardée pour #137), voir ci-dessous | 1.1, 1.3, 4.1, 5.1, 5.3, 5.4, 6.1, 6.2 |
| 100.22 Moins de questions possibles | Toutes, une fois chacune ; s'applique au défi d'une partie du parcours | Tests unitaires (hors périmètre) |
| 100.23 Défi de la dernière partie du parcours | **1.b** : pas de défi dans #100 (« le grand défi la remplace » gardé pour #137) | 1.4 (2e cas), 1.5, 6.2 |
| 100.24 Repère d'un défi à venir | Pas un bouton | 1.1 |
| 100.25 Effets sonores à la fin | « grande victoire » la première fois, « séance terminée » quand il est rejoué | 5.1, 5.3 |
| 100.26 Défi quitté | Ne se reprend pas ; reste ouvert, se rejoue avec un nouveau tirage | 5.2 |
| 100.27 Place de « Mes défis relevés » | À la fin de « Mes médailles », après les records de fluence | 5.4 |
| 100.28 « Fin du défi », écrans de l'enfant | Ajoutés au glossaire | Vocabulaire du fichier |

Textes validés (100.21) :
- repère à venir : « Encore 1 leçon pour ouvrir le défi » / « Encore 5 leçons pour ouvrir le défi » ; ouvert :
  « Relever le défi » ; relevé : « Défi relevé » ;
- annonce de fin de séance : « Le défi 1 est ouvert ! » ;
- proposition de Noisette : « Bravo Léa ! Tu as réussi toutes les leçons avant le défi 1. Tu veux le relever ? » ;
- début du défi : titre « Défi 1 », avec « Maths » ; Noisette : « Voici des questions de 5 leçons que tu connais.
  Prends ton temps, je suis avec toi ! » ;
- fin du défi : annonce « Défi relevé ! » ; Noisette : « Bravo Léa ! Tu as relevé le défi 1 ! » ; rejoué : « Bravo
  Léa ! Tu as encore relevé le défi 1 ! », sans l'annonce « Défi relevé ! » ; boutons « Mon parcours » et « Accueil » ;
- sans réseau : le message existant « Sauvegarde en ligne impossible : la progression est gardée sur cet appareil. » ;
- lecteurs d'écran : « Défi 1 : à venir, encore 1 leçon pour ouvrir le défi », « Défi 1 : ouvert », « Défi 1 :
  relevé » ;
- « Mes médailles » : section « Mes défis relevés », une ligne par défi relevé, « Défi 1 · Maths · CE1 ».

## Gardé pour #137 (« Grand défi de la matière »)

Pour mémoire, scénarios retirés de #100 (réponse 2.a du PO : les décisions sur le grand défi sont gardées pour #137).
Ils ne sont plus dans le fichier `.feature` ; #137 les reprendra et les adaptera.
- Ancien 3.2 : le grand défi des maths pose 12 questions, au moins une de chacune des 10 leçons (100.5, 100.6).
- Ancien 3.3 : quand la matière a moins de 12 questions qui se posent seules, le grand défi les pose toutes, une
  seule fois chacune (exemple : 6 questions pour les sciences du CE1) (100.22).
- Ancien 6.1 : la matière réussie, le grand défi est ouvert près du fanion, à la place du défi de la dernière partie
  du parcours (100.23).
- Ancien 6.2 : la séance qui rend la matière réussie annonce « Le grand défi des maths est ouvert ! », et Noisette
  dit « Bravo Léa ! Tu as réussi toutes les leçons de maths. Le grand défi t'attend ! » (100.21 ; cette parole
  n'avait pas été validée à part).
- Ancien 6.3 : une matière qui n'a qu'une partie du parcours n'a que le grand défi, à venir tant que la matière n'est
  pas réussie (100.14).
- Lignes retirées d'autres scénarios : « Grand défi : à venir, encore 6 leçons pour ouvrir le défi » (lecteurs
  d'écran, ancien 7.2), le repère « Grand défi » à 360 px (ancien 8.4), « Grand défi · Sciences · CE1 » dans « Mes
  défis relevés » (ancien 5.4).

## Questions ouvertes

Aucune. Toutes les questions #100.1 à #100.28 ont reçu une réponse du PO le 2026-10-29 (section « Décisions »).
