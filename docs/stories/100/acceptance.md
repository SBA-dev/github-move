# Critères d'acceptance : issue #100, Défi de fin de partie du parcours (« défi de fin de chapitre »)

Scénarios : `features/100-defi-de-fin-de-partie-du-parcours.feature` (`@issue-100 @wip`).
Modèle : `docs/stories/100/domain-model.md` (questions #100.1 à #100.20).
État : **à valider par le PO**. Les scénarios suivent les **recommandations** du modèle (#100.1 à #100.20), que le PO
n'a pas encore tranchées. La table « Dépendances aux questions » dit quels scénarios changent si le PO choisit une
autre option. Les scénarios tagués `@a-valider` dépendent en plus d'une question nouvelle (#100.21 et suivantes).

## Objectif

En tant qu'**enfant**, après avoir réussi toutes les leçons d'une **partie du parcours**, je veux relever un **défi**
qui mélange leurs questions, afin de me prouver que je suis devenu fort, sans rien risquer de perdre. Quand toute la
**matière est réussie**, un **grand défi** mélange les questions de toute la matière de ma classe (réponse du PO du
2026-10-25).

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : pratique de récupération entrelacée (questions mélangées de plusieurs leçons), défi relevé gardé
  pour toujours et visible sur « Mon parcours » et dans « Mes médailles » ;
- **autonomie** : le défi est proposé, jamais lancé d'office ; il ne bloque rien ; on le quitte ou on le rejoue
  quand on veut ;
- **lien** : le personnage guide propose le défi, l'accueille, encourage après une erreur et fête la fin.

Déclencheurs métier : la **leçon réussie** (#24, #27) qui complète une partie du parcours ouvre le défi ; la
**matière réussie** (#26) ouvre le grand défi ; le fait `DefiTermine`, revalidé par le serveur, rend le défi
**relevé**. Garde-fous respectés : pas de vie, pas de temps limité, pas de compte des erreurs, aucune étoile, aucun
verrou, rien de tiré au sort contre des étoiles, rien ne se perd.

## Bibliothèque de test

Bibliothèque de test du défi (identifiants `e2e-100-`), servie comme celles de #28 et #99 :
- maths du CE1 : « Maths 1 » (ordre 10) à « Maths 10 » (ordre 100), chacune un exercice bulles de 2 questions sans
  aide, « Combien font n + 1 ? » et « Combien font n + 2 ? », à 3 choix ; « Maths 2 » a en plus une fluence de calcul
  (elle ne doit jamais entrer dans le défi) ;
- sciences du CE1 : « Les êtres vivants », « Les saisons », « L'eau », chacune un exercice bulles de 2 questions à
  3 choix, sans aide (questions neutres sur le vivant, les saisons et l'eau) ;
- aucune autre leçon.

Avec #100.1 A, les maths ont 2 parties du parcours (leçons 1 à 5, puis 6 à 10), les sciences une seule. Avec
#100.14 et #100.23, les maths ont donc « Défi 1 » et « Grand défi » ; les sciences seulement « Grand défi ».

## Example mapping

**R1. Ouverture.** Le défi d'une partie du parcours s'ouvre quand toutes ses leçons sont réussies (au moins 1 étoile
ou réussie au test de départ) ; avant, il est **à venir**, visible et sans cadenas.
- Léa a réussi 4 leçons sur 5 : « Défi 1 » à venir, « Encore 1 leçon pour ouvrir le défi ».
- Léa a réussi « Maths 1, 2, 4, 5 » et termine « Maths 3 » : la fin de la séance annonce « Le défi 1 est ouvert ! »,
  Noisette le propose, « Relever le défi » est à côté de « Leçon suivante ».
- Quatre leçons réussies au test de départ et la cinquième avec 1 étoile : le défi est ouvert.
- Léa rejoue « Maths 3 » alors que le défi est déjà ouvert : pas de nouvelle annonce.

**R2. Ne bloque rien, ne change aucune note.**
- Défi 1 pas fait : Noisette se tient sur « Maths 6 » (« À toi ! »).
- Défi relevé sans erreur : « Maths 2 » garde 1 étoile.
- Fin du défi : ni étoile, ni objet de la cabane, ni tenue, ni badge, ni épisode.
- Une erreur dans le défi ne revient pas en révision le lendemain.

**R3. Questions.** 10 pour une partie du parcours, 12 pour la matière ; seulement des leçons du défi, qui se posent
seules et sans temps limité ; réparties à parts égales, mélangées.
- Défi 1 : 2 questions de chacune des leçons 1 à 5, dans un ordre mélangé, aucune de la leçon 6, jamais la fluence.
- Grand défi des maths : 12 questions, au moins une de chacune des 10 leçons.
- Grand défi des sciences : seulement 6 questions possibles, chacune posée une fois (#100.22).

**R4. Erreur.** Encouragement, aide (ou aide par défaut), nouvelle chance sans limite, « Je ne sais pas » ; pas de
vie, pas de temps qui passe, pas de nombre d'erreurs affiché.
- Léa répond « 4 » à « Combien font 2 + 1 ? » : encouragement, « Essaie une autre bulle. », la question reste.

**R5. Défi relevé.** Terminé = relevé, avec ou sans erreurs ; quitté = rien de perdu ; rejoué = sans nouvelle
récompense ; les défis relevés sont dans « Mes médailles ».
- Terminé sans erreur ou avec une erreur à chaque question : « Défi relevé ! ».
- Quitté après 6 questions : le défi reste ouvert, sans reproche.
- Rejoué : « Tu as encore relevé le défi 1 ! », sans l'annonce « Défi relevé ! ».

**R6. Grand défi.** Il s'ouvre quand la matière est réussie ; il remplace le défi de la dernière partie du parcours ;
une matière d'une seule partie n'a que lui.

**R7. « Mon parcours ».** Un repère par défi, à venir, ouvert ou relevé ; le personnage guide ne s'y arrête jamais ;
une ligne par défi dans la liste des lecteurs d'écran.

**R8. Accessibilité et hors ligne.** Sans réseau, le défi se joue et se garde sur l'appareil ; mouvements réduits :
l'annonce reste, sans mouvement ; 360 px, cibles de 44 px.

**R9. Serveur et droits.** Le serveur seul enregistre le défi relevé, après revalidation ; un parent non rattaché ne
lit ni n'écrit rien ; un autre enfant du même parent n'hérite de rien ; l'export contient les défis relevés.

Le skill `bdd-gherkin` signale qu'au-delà de 6 règles une story est souvent trop grosse. Si le PO veut la réduire, le
grand défi (R6) peut faire une story à part : R1 à R5 et R7 à R9 n'en dépendent pas, sauf la ligne « Grand défi » du
scénario 7.2 et le repère « Grand défi » du scénario 8.4.

## Règles et scénarios

| Règle | Scénarios |
|---|---|
| **R1.** Le défi d'une partie du parcours s'ouvre quand toutes ses leçons sont réussies ; avant, il est à venir, visible et sans cadenas | 1.1 Avec 0 ou 4 leçons réussies sur 5, le défi 1 est à venir (plan) · 1.2 Des leçons réussies au test de départ comptent pour ouvrir le défi · 1.3 La séance qui rend réussie la dernière leçon qui manquait ouvre le défi, et le personnage guide le propose sans le lancer · 1.4 Rejouer une leçon dont le défi est déjà ouvert ne l'annonce pas de nouveau |
| **R2.** Le défi ne bloque rien et ne change aucune note ; il ne donne ni objet de la cabane, ni tenue, ni badge, ni épisode | 2.1 Sans avoir fait le défi 1, l'enfant continue son parcours, et le personnage guide se tient sur la leçon 6 · 2.2 Relever le défi ne change aucune étoile des leçons de la partie du parcours · 2.3 La fin du défi ne montre aucune étoile et n'annonce ni objet de la cabane, ni tenue, ni badge, ni épisode · 2.4 Une question où l'enfant s'est trompé pendant le défi ne revient pas en révision |
| **R3.** 10 questions pour une partie du parcours, 12 pour la matière, prises seulement dans ses leçons, parmi les questions qui se posent seules et sans temps limité, réparties et mélangées | 3.1 Le défi 1 pose 2 questions de chacune des leçons 1 à 5, mélangées, jamais d'une autre leçon ni d'une fluence · 3.2 Le grand défi des maths pose 12 questions, au moins une de chacune des 10 leçons · 3.3 `@a-valider` Quand la matière a moins de 12 questions qui se posent seules, le grand défi les pose toutes, une seule fois chacune |
| **R4.** Une erreur suit les règles d'une séance ; ni vie, ni temps limité, ni compte des erreurs | 4.1 Le défi commence par une parole du personnage guide, sans vie ni temps qui passe · 4.2 Après une erreur pendant le défi, le personnage guide encourage, donne l'aide, et la même question reste posée |
| **R5.** Un défi terminé est relevé, avec ou sans erreurs, et sa fin le fête ; quitté sans rien perdre ; rejoué sans nouvelle récompense ; retrouvé dans « Mes médailles » | 5.1 Un défi terminé sans erreur, ou avec une erreur à chaque question, est relevé, et sa fin le fête (plan) · 5.2 Un défi quitté en cours n'est pas relevé et reste ouvert, sans reproche · 5.3 Rejouer un défi relevé le fait rejouer en entier, sans nouvelle annonce de défi relevé · 5.4 « Mes médailles » montre les défis relevés, chacun une seule fois |
| **R6.** Le grand défi s'ouvre quand la matière est réussie ; une matière d'une seule partie du parcours n'a que lui | 6.1 `@a-valider` La matière réussie, le grand défi est ouvert près du fanion, à la place du défi de la dernière partie du parcours · 6.2 `@a-valider` La séance qui rend la matière réussie annonce le grand défi · 6.3 Une matière qui n'a qu'une partie du parcours n'a que le grand défi, à venir tant que la matière n'est pas réussie |
| **R7.** Sur « Mon parcours », chaque défi a son repère ; les lecteurs d'écran le lisent à sa place | 7.1 Le repère « Défi 1 » montre un défi ouvert ou relevé (plan) · 7.2 Les lecteurs d'écran lisent le défi dans la liste ordonnée, juste après sa dernière leçon |
| **R8.** Sans réseau, sans mouvement, sur 360 px | 8.1 Sans réseau, le défi se joue jusqu'au bout et sa fin dit que la progression est gardée sur l'appareil · 8.2 Avec les mouvements réduits, la fin du défi garde son annonce, sans mouvement ni confettis · 8.3 Une question du défi tient dans un écran de 360 px, « Je ne sais pas » compris · 8.4 À 360 px, les repères des défis tiennent dans la largeur et sont assez grands pour un doigt d'enfant |
| **R9.** Le défi relevé est enregistré par le serveur, après vérification, seulement pour un parent rattaché ; il est compris dans les données du profil | 9.1 `@acces` Sur le téléphone du second parent rattaché, l'enfant retrouve son défi relevé · 9.2 Le serveur refuse un défi terminé incohérent : défi à venir, question d'une leçon hors du défi, question qui ne finit pas par la bonne réponse (plan) · 9.3 `@acces` Le défi relevé par un enfant ne se voit pas chez un autre enfant du même parent · 9.4 `@acces` Un parent qui n'est pas rattaché ne lit pas les défis relevés de Léa · 9.5 `@acces` Un parent qui n'est pas rattaché ne peut pas enregistrer un défi terminé pour Léa · 9.6 L'export du profil contient les défis relevés, sans les réponses données |

Total : 9 règles, 32 scénarios (dont 4 plans du scénario), soit 37 cas générés ; 3 scénarios `@a-valider`, 4 `@acces`.

Critères de l'issue couverts : 4 leçons sur 5 → à venir (1.1) ; 5 sur 5 → ouvert et proposé par le personnage guide
(1.3) ; questions des 5 leçons seulement (3.1) ; erreur → encouragement et aide (4.2) ; aucune étoile changée (2.2) ;
partie du parcours suivante ouverte sans le défi (2.1).

## Dépendances aux questions

Si le PO choisit une autre option que la recommandation, les scénarios ci-dessous changent.

| Question | Reco suivie | Scénarios qui en dépendent |
|---|---|---|
| #100.1 Découpage en blocs de 5 | A | Toute la bibliothèque de test et les numéros de leçon : 1.1 à 1.4, 2.1, 3.1, 6.1, 7.2, 9.2 (avec B ou D, la bibliothèque de test reçoit un domaine ou un champ `partie` et les tailles changent) |
| #100.2 Chapitre = partie du parcours | oui | Vocabulaire de tout le fichier |
| #100.3 « Défi 1 », « Grand défi » | A | 1.1, 1.2, 1.3, 2.1, 4.1, 5.1, 5.3, 5.4, 6.1 à 6.3, 7.1, 7.2, 8.4, 9.1 (avec B : « Défi de la partie 1 », « Défi de la matière ») |
| #100.4 Annonce d'exercice « Nouveau défi » | A | Aucun scénario ; le fichier n'emploie jamais « Nouveau défi » |
| #100.5 10 / 12 questions | A | 3.1, 3.2, 3.3 |
| #100.6 Répartition à parts égales | A | 3.1 (« 2 de chacune »), 3.2 (« au moins une de chacune ») |
| #100.7 Questions mélangées | oui | 3.1 (« sans suivre l'ordre des leçons ») |
| #100.8 Relevé dès qu'il est terminé | A | 5.1 (exemple « une erreur à chaque question ») ; avec B, cet exemple devient « on réessaie quand tu veux » |
| #100.9 Rejouable sans nouvelle récompense | oui | 5.3, 5.4 (« n'y est qu'une fois ») |
| #100.10 Pas de file de révision | A | 2.4 (s'inverse avec B) |
| #100.11 Ne compte ni pour la série, ni les épisodes, ni l'objectif du jour, ni la quête du jour | A | 2.3 (« ni épisode », pas de « Lire l'épisode ») |
| #100.12 Récompense = le défi relevé lui-même | A | 2.3, 5.1, 5.4 (section « Mes défis relevés ») |
| #100.13 Pas d'étoile | non | 2.2, 2.3 |
| #100.14 Une seule partie → seulement le grand défi | oui | 3.3, 6.3 |
| #100.15 Un défi relevé reste relevé si la bibliothèque change | A | Aucun scénario E2E (test unitaire du domaine) |
| #100.16 Défi à venir visible, sans cadenas | A | 1.1, 6.3, 7.2 (avec B : invisibles tant qu'ils ne sont pas ouverts) |
| #100.17 Annonce du défi ouvert en dernier, au-dessus de « Relever le défi » | reco | 1.3, 6.2 (ne fixent pas l'ordre ; un scénario d'ordre s'ajoutera avec l'équipe de #101) |
| #100.18 Pas de défi dans le suivi | non | Aucun scénario (hors périmètre) |
| #100.19 Mise en scène sans musique nouvelle | A | 4.1 (aucune musique décrite) |
| #100.20 Termes du domaine | oui | Vocabulaire de tout le fichier |
| #100.21 Textes et paroles | reco | 1.1, 1.3, 4.1, 5.1, 5.3, 5.4, 6.2, 6.3, 7.1, 7.2 |
| #100.22 Moins de questions possibles que prévu | A | 3.3 `@a-valider` |
| #100.23 Le grand défi remplace le défi de la dernière partie du parcours | A | 6.1, 6.2 `@a-valider`, 7.2 (ligne « Grand défi » après « Maths 10 »), 8.4 |
| #100.24 Le repère d'un défi à venir ne se touche pas | A | 1.1 (« ne propose pas « Relever le défi » ») |
| #100.26 Défi quitté | A | 5.2 |
| #100.27 Section « Mes défis relevés » | reco | 5.4 |

## Hors périmètre

- Le suivi du parent (#34) : les défis relevés n'y apparaissent pas (#100.18). L'Espace parent ne montre rien du
  défi ; seul l'export le contient (9.6).
- La quête du jour (#101) : elle ne propose pas le défi, et un défi terminé ne l'accomplit pas (#100.11). Pas de
  scénario tant que #101 n'est pas mergée ; la règle est couverte par les tests du domaine. Même chose pour la série
  (#30) et l'objectif du jour (#29), inchangés.
- Une musique propre au défi (#100.19 B), un nouveau champ `partie` dans le format des leçons (#100.1 D), la file de
  révision nourrie par le défi (#100.10 B).
- La suppression en cascade avec le profil et l'idempotence de l'enregistrement (un défi gardé sur l'appareil et
  renvoyé n'est compté qu'une fois) : couvertes par les tests du cas d'usage `TerminerLeDefi` et la migration, sans
  scénario de plus. La suppression du profil est déjà vérifiée par #14.
- Un défi relevé qui reste relevé quand la bibliothèque change (#100.15) : test unitaire du domaine.
- « Toutes les leçons », l'accueil de l'enfant et la leçon du jour : inchangés.
- Le jeu du défi au clavier : il reprend les commandes d'une séance (#28, « au clavier seulement »), sans scénario de
  plus.

## Questions ouvertes

Les questions #100.1 à #100.20 sont celles du modèle (`domain-model.md`). Questions nouvelles :

**#100.21 Textes et paroles du défi.** Proposition (scénarios 1.1, 1.3, 4.1, 5.1, 5.3, 5.4, 6.2, 6.3, 7.1, 7.2) :
- repère à venir : « Encore 1 leçon pour ouvrir le défi » / « Encore 5 leçons pour ouvrir le défi » ; ouvert :
  « Relever le défi » ; relevé : « Défi relevé » ;
- annonce de fin de séance : « Le défi 1 est ouvert ! », « Le grand défi des maths est ouvert ! » ;
- proposition de Noisette : « Bravo Léa ! Tu as réussi toutes les leçons avant le défi 1. Tu veux le relever ? » ;
  grand défi : « Bravo Léa ! Tu as réussi toutes les leçons de maths. Le grand défi t'attend ! » ;
- début du défi : titre « Défi 1 », avec « Maths » ; Noisette : « Voici des questions de 5 leçons que tu connais.
  Prends ton temps, je suis avec toi ! » ;
- fin du défi : annonce « Défi relevé ! » ; Noisette : « Bravo Léa ! Tu as relevé le défi 1 ! » ; rejoué : « Bravo
  Léa ! Tu as encore relevé le défi 1 ! », sans l'annonce « Défi relevé ! » ; boutons « Mon parcours » et « Accueil » ;
- sans réseau : le message existant « Sauvegarde en ligne impossible : la progression est gardée sur cet appareil. » ;
- lecteurs d'écran : « Défi 1 : à venir, encore 1 leçon pour ouvrir le défi », « Défi 1 : ouvert », « Défi 1 :
  relevé » ;
- « Mes médailles » : section « Mes défis relevés », une ligne par défi relevé, « Défi 1 · Maths · CE1 », « Grand
  défi · Sciences · CE1 » (la classe distingue le défi 1 du CE1 de celui du CE2).
**Reco : ces textes.** Aucun ne dit « perdu », « raté », « épreuve », « partie » seul ni « Nouveau défi ».

**#100.22 Que pose le défi quand ses leçons ont moins de questions qui se posent seules que prévu ?** (6 questions
possibles pour le grand défi des sciences, qui en prévoit 12 ; les 16 matières de 2 à 5 leçons sont concernées)
- A. Toutes les questions possibles, chacune une fois : le défi est plus court.
- B. On répète des questions pour arriver à 10 ou 12.
- **Reco : A.** Une question répétée dans la même séance n'apprend rien de plus. Avec 0 question possible, le défi
  n'existe pas (règle 5 du modèle).

**#100.23 La dernière partie du parcours d'une matière a-t-elle son propre défi ?** Sa dernière leçon réussie rend
aussi la matière réussie : la même séance ouvrirait deux défis.
- A. **Non : le grand défi remplace le défi de la dernière partie du parcours.** C'est la même règle que #100.14,
  généralisée : la matière d'une seule partie du parcours n'a que le grand défi. Maths du CP (5, 5, 5, 5, 5, 6) :
  « Défi 1 » à « Défi 5 », puis « Grand défi ».
- B. Oui : la fin de la séance annonce les deux défis, avec un bouton par défi.
- C. Oui : la fin de la séance n'annonce que le grand défi ; le défi de la dernière partie du parcours attend sur
  « Mon parcours ».
- **Reco : A** (un seul défi annoncé à la fois, pas deux défis presque sur les mêmes leçons). Scénarios 6.1 et 6.2,
  `@a-valider`.

**#100.24 Que fait le repère d'un défi à venir quand l'enfant le touche ?**
- A. Rien : ce n'est pas un bouton ; son texte « Encore N leçons pour ouvrir le défi » suffit.
- B. Le personnage guide dit combien de leçons il reste.
- **Reco : A**, pour garder le dessin du parcours simple (la prochaine leçon reste la seule chose mise en avant).

**#100.25 Quels effets sonores à la fin du défi ?** (#97 ne connaît que la séance, la séance de révision et le test de
départ)
- A. « grande victoire » au premier défi relevé, « séance terminée » quand il est rejoué ; pendant le défi, les effets
  sonores d'une séance (réponse juste, réponse fausse, point du récipient).
- B. Toujours « séance terminée ».
- **Reco : A.** Aucun scénario n'en dépend encore ; un scénario s'ajoutera après la réponse.

**#100.26 Un défi quitté en cours se reprend-il ?**
- A. Non : rien n'est gardé, l'enfant revient au dessin du parcours de la matière, le défi reste ouvert et se rejoue
  avec un nouveau tirage, sans reproche (comme la séance de révision quittée, 28.8).
- B. Oui : il reprend à la question où l'enfant s'était arrêté.
- **Reco : A.** Scénario 5.2.

**#100.27 Où va la section « Mes défis relevés » dans « Mes médailles » ?** Ordre actuel : cabane, tenues, histoire,
badges, records de fluence.
- A. À la fin, après les records de fluence (aucune section existante ne bouge).
- B. Juste après les badges (deux récompenses de compétence côte à côte).
- **Reco : A.** Le scénario 5.4 ne fixe pas l'ordre.

**#100.28 Deux termes de plus pour le glossaire, avec #100.20 ?** « Fin du défi » (écran qui suit la dernière
question du défi, comme **Fin de la séance**) ; et l'ajout de la séance de défi et de sa fin à la liste des **écrans
de l'enfant** (#73 : voix suspendue seulement sur les écrans du parent ; #96 : décor). « Repère » reste un mot de
scénario, pas un terme du domaine. **Reco : oui.**
