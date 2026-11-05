# Critères d'acceptance : issue #137, Grand défi de la matière

Scénarios : `features/137-grand-defi.feature` (tags `@issue-137 @wip`).
Modèle : `docs/stories/137/domain-model.md`.
État : **cadrage validé** le 2026-11-04 (réponse du PO : « 137 reco tout »). Les décisions du PO gardées depuis
#100 (réponse 2.a du 2026-10-29, commentaire 6507264741 de l'issue #100) ne sont pas reposées. Les questions #137.1 à
#137.7 sont tranchées selon les recommandations (section « Décisions du PO ») ; plus aucun scénario n'est `@a-valider`.

## Objectif

En tant qu'**enfant**, quand j'ai réussi toute une matière, je veux relever un **grand défi** qui mélange les
questions de toute la matière, afin de me prouver que je la maîtrise, sans rien risquer de perdre.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : pratique de récupération entrelacée sur toute la matière ; grand défi relevé gardé pour toujours,
  visible près du fanion et dans « Mes défis relevés » ;
- **autonomie** : proposé, jamais lancé d'office ; il ne bloque rien ; on le rejoue quand on veut ;
- **lien** : Noisette l'annonce, l'accueille et fête sa fin.

Garde-fous (identiques à #100) : ni vie, ni temps limité, ni compte des erreurs, aucune étoile, aucun verrou ; « grand »
dit l'ampleur (toute la matière), jamais un adversaire ; ni combat, ni menace, ni compte à rebours.

## Story allégée

À la demande du PO, le jeu de scénarios est **réduit** : le grand défi passe par le même code que le défi d'une partie
du parcours (séance de défi, revalidation, file de révision, fin du défi), déjà couvert par `@issue-100`. Les
scénarios ne décrivent que ce qui est propre au grand défi : ouverture à la matière réussie, repère près du fanion à
la place du défi de la dernière partie du parcours, annonce de fin de séance, 12 questions dont une de chaque leçon,
moins de questions possibles, matière d'une seule partie du parcours, relevé et rejoué, « Mes défis relevés »,
lecteurs d'écran, 360 px, question ratée en révision, et la lecture du nouvel enregistrement (second parent, parent
non rattaché).

## Bibliothèque de test

Celle de #100 (« la bibliothèque de test du défi », identifiants `e2e-100-`), sans changement :
- maths du CE1 : « Maths 1 » à « Maths 10 », 2 questions chacune (20 possibles), une fluence dans « Maths 2 » qui
  n'entre jamais dans un défi ; deux parties du parcours → « Défi 1 », puis « Grand défi » ;
- sciences du CE1 : 3 leçons de 2 questions (6 possibles, moins que 12) ; une seule partie du parcours → « Grand
  défi » seul (100.14).

Grand défi des maths : 12 questions sur 10 leçons, à parts égales → 2 leçons tirées en donnent 2, les 8 autres 1.
Grand défi des sciences : les 6 questions, une fois chacune (100.22).

## Example mapping

**R1. Ouverture et repère.** Un grand défi par matière qui a des leçons dans la classe ; repère après la dernière
leçon, près du fanion, à la place du défi de la dernière partie du parcours ; ouvert quand la matière est réussie,
sans dépendre des défis des parties ; à venir sinon, visible, sans cadenas.
- 9 leçons de maths sur 10 : « Grand défi » à venir, « Encore 1 leçon pour ouvrir le défi ».
- Aucune leçon de sciences : « Encore 3 leçons pour ouvrir le défi ».
- 10 leçons de maths, défi 1 jamais relevé : « Grand défi » ouvert, « Relever le défi » ; un seul défi d'une partie du
  parcours, « Défi 1 », aucun « Défi 2 ».
- Sciences réussies : « Grand défi » ouvert, aucun défi d'une partie du parcours.

**R2. Annonce.** La séance qui rend la matière réussie annonce le grand défi ; Noisette le propose ; rien ne
commence d'office.
- 9 leçons réussies, Léa termine « Maths 10 » : « Le grand défi des maths est ouvert ! », Noisette « Bravo Léa ! Tu
  as réussi toutes les leçons de maths. Le grand défi t'attend ! », « Relever le défi ».
- Tout réussi sauf « Maths 5 », Léa termine « Maths 5 » (elle ouvre le défi 1 et le grand défi) : seule l'annonce du
  grand défi (#137.2).

**R3. Questions.** 12, de toute la matière, au moins une de chaque leçon, à parts égales, mélangées, jamais une
fluence ; moins de 12 possibles : toutes, une fois chacune.
- Maths : 12 questions, au moins 1 et au plus 2 de chacune des 10 leçons.
- Sciences : 6 questions, les 2 de chacune des 3 leçons, aucune posée deux fois.
- Maths du CP (31 leçons, plus de 12 leçons) : 12 leçons tirées, une question chacune → tests unitaires du domaine.

**R4. Se joue comme un défi.** Écran « Grand défi » ; ni vie ni temps qui passe ; terminé = relevé, avec ou sans
erreur ; rejoué sans nouvelle annonce ; aucune étoile ; question ratée en révision ; une ligne dans « Mes défis
relevés ».
- Début : « Grand défi », avec « Maths », Noisette « Voici des questions de toutes tes leçons de maths… ».
- Terminé avec une erreur à chaque question : « Grand défi relevé ! », « grande victoire », aucune étoile.
- Rejoué : « séance terminée », « Tu as encore relevé le grand défi des maths ! », sans l'annonce.
- Erreur à la première question : le lendemain, « 1 petite erreur des jours passés ».
- Défi 1 relevé, grand défi relevé deux fois : « Défi 1 · Maths · CE1 » puis « Grand défi · Maths · CE1 », une fois
  chacun.

**R5. Accessibilité.** Une ligne pour les lecteurs d'écran après la dernière leçon ; repère à 360 px, 44 px de haut.
- 4 leçons de maths : après « Maths 10 : à découvrir », « Grand défi : à venir, encore 6 leçons pour ouvrir le défi ».
- 360 px, maths réussies : la page tient dans la largeur, repère d'au moins 44 px.

**R6. Serveur et droits.** Le grand défi relevé est enregistré par le serveur (nouvel enregistrement, modèle,
« Données persistées ») et ne se lit que par un parent rattaché.
- Relevé sur la tablette de Paul : relevé aussi sur le téléphone de Marie.
- Claire, non rattachée, demande les défis relevés de Léa : aucune donnée.

## Règles et scénarios

| Règle | Scénarios |
|---|---|
| **R1.** Chaque matière a un grand défi, près du fanion, à la place du défi de la dernière partie du parcours ; il s'ouvre quand la matière est réussie ; avant, il est à venir, visible et sans cadenas | 1.1 Tant que la matière n'est pas réussie, le grand défi est à venir près du fanion, sans cadenas : maths 9 leçons réussies sur 10, sciences aucune leçon réussie (plan, 2 cas) · 1.2 La matière réussie, le grand défi est ouvert près du fanion et remplace le défi de la dernière partie du parcours : maths du CE1 (deux parties du parcours), sciences du CE1 (une seule partie du parcours) (plan, 2 cas) |
| **R2.** La séance qui rend la matière réussie annonce le grand défi ; le personnage guide le propose sans le lancer | 2.1 La séance qui rend réussie la dernière leçon de maths qui manquait annonce le grand défi, et le personnage guide le propose sans le lancer · 2.2 Une séance qui ouvre à la fois le défi 1 et le grand défi n'annonce que le grand défi |
| **R3.** 12 questions de toute la matière, au moins une de chaque leçon, à parts égales et mélangées ; moins de possibles : toutes, une fois chacune | 3.1 Le grand défi des maths pose 12 questions, au moins une de chacune des 10 leçons, mélangées, jamais d'une fluence · 3.2 Quand la matière a moins de 12 questions possibles, le grand défi les pose toutes, une seule fois chacune |
| **R4.** Se joue et se fête comme un défi ; question ratée en révision ; « Mes défis relevés » | 4.1 Le grand défi commence par une parole du personnage guide, sans vie ni temps qui passe · 4.2 Un grand défi terminé avec des erreurs est relevé, et sa fin le fête sans étoile · 4.3 Rejouer le grand défi relevé le fait rejouer en entier, sans nouvelle annonce de grand défi relevé · 4.4 Après un grand défi relevé avec une erreur, l'accueil du lendemain propose la séance de révision · 4.5 « Mes défis relevés » montre le grand défi après les défis de la même matière et de la même classe, une seule fois |
| **R5.** Lecteurs d'écran et 360 px | 5.1 Les lecteurs d'écran lisent le grand défi dans la liste ordonnée, juste après la dernière leçon de la matière · 5.2 À 360 px, le repère du grand défi tient dans la largeur et est assez grand pour un doigt d'enfant |
| **R6.** Enregistré par le serveur, lu seulement par un parent rattaché | 6.1 `@acces` Sur le téléphone du second parent rattaché, l'enfant retrouve son grand défi relevé · 6.2 `@acces` Un parent qui n'est pas rattaché ne lit pas les grands défis relevés de Léa |

Total : 6 règles, 15 scénarios (dont 2 plans du scénario), soit **17 cas par projet** Playwright (`tablette` et
`telephone`, 34 en tout) ; 2 `@acces`.

Scénarios qui jouent une séance complète ou un défi complet (délais longs, à ajouter au `Before` de
`features/steps/delais.steps.ts`) : 2.1 et 2.2 (séance complète d'une leçon), 3.1, 3.2, 4.2, 4.3 (grand défi joué
jusqu'au bout), 4.4 (le grand défi relevé « en se trompant » est joué dans le navigateur, comme dans #100) ; 6.1 utilise
deux appareils. Soit 8 scénarios sur 15.

Textes fixés par les décisions du PO : 2.1 → #137.4 et #137.7 ; 2.2 → #137.2 ; 4.1, 4.2, 4.3 → #137.5 ; 4.5 →
#137.6. Le vocabulaire de tout le fichier suit #137.1 (« grand défi ») et les textes « des maths », « des sciences »,
« de maths » suivent #137.3.

### Scénarios d'autres stories touchés

`features/100-defi-de-fin-de-partie-du-parcours.feature`, dans un commit séparé (suppressions seulement, aucune ne
dépend d'une question ouverte ; aucun step modifié) :
- en-tête de la fonctionnalité (lignes 12-13, 18-19, 34-35 avant le commit) : la dernière partie du parcours n'a pas de
  défi « que le grand défi remplace (#137) » ; les sciences n'ont « aucun défi d'une partie du parcours » ;
- 1.4 (lignes 79-88) : le 2e cas « dernière leçon de la dernière partie du parcours » (aucune annonce) est retiré ; le
  plan devient le scénario « Une leçon rejouée alors que son défi est déjà ouvert n'annonce aucun défi ». Remplacé par
  2.1 ;
- 1.5 (lignes 90-99) : retiré en entier (« aucun repère de défi » après « Maths 10 » et pour les sciences). Remplacé
  par 1.2 ;
- 6.2 (ligne 224) : la ligne « Mais les lecteurs d'écran n'annoncent aucune ligne de défi après « Maths 10 : à
  découvrir » » est retirée. Remplacée par 5.1.
Les steps « le dessin du parcours montre un seul repère de défi, … », « le dessin du parcours montre aucun repère de
défi », « aucun repère de défi n'apparaît après la leçon … » et « les lecteurs d'écran n'annoncent aucune ligne de
défi après … » (`features/steps/defi-de-fin-de-partie.steps.ts`, lignes 664, 673, 679 et 731) ne servent plus :
à retirer par `e2e-tester`. `docs/stories/100/acceptance.md` le note (« Modifié par #137 »).

`features/106-celebration-de-l-univers.feature`, règle 106g (« Matière réussie ! », encore `@hors-106a
@a-valider`) : quand elle sera livrée, la séance qui rend les sciences réussies affichera aussi « Le grand défi des
sciences est ouvert ! », en dernier dans la zone des nouveautés (R6 de #100 : « la célébration de la matière réussie
se joue comme prévu »). Le scénario « … ne joue qu'une célébration de l'univers » (« annonce « Matière réussie ! »
puis, pour Coach Léo, … ») reste vrai si son step vérifie l'ordre et non une liste exhaustive ; à vérifier à la
livraison de 106g. Rien à changer aujourd'hui.

## Hors périmètre

Couvert par les scénarios de #100 (même code, même séance de défi) ou par les tests du domaine, sans scénario de
plus :
- après une erreur, encouragement, aide et nouvelle chance ; « Je ne sais pas » (#100, 4.2) ;
- défi quitté en cours, rien de perdu (#100, 5.2) ; défi terminé sans erreur (#100, 5.1) ;
- aucune étoile changée, ni objet de la cabane, ni tenue, ni badge, ni épisode ; ne compte ni pour la série, ni pour
  l'objectif du jour, ni pour la quête du jour (#100, 2.2 et 2.3 ; 100.11) ; seule « aucune étoile » est reprise (4.2) ;
- le grand défi ne bloque rien ; le personnage guide se tient au fanion quand la matière est réussie (#99, scénario
  « Quand la matière est réussie, le personnage guide se tient à la fin du dessin du parcours ») et ne s'arrête jamais
  au grand défi (invariant 4 du modèle) ;
- des leçons réussies au test de départ comptent pour la matière réussie (#26, #100 1.2) ;
- sans réseau, mouvements réduits, une question à 360 px (#100, 7.1 à 7.3) ;
- plus de 12 leçons qui ont des questions (maths du CP, 31 leçons : 12 leçons tirées, une question chacune) et une
  matière sans aucune question posable (`AucuneQuestionPourLeDefi`) : tests unitaires de `planDuDefi` ;
- refus par le serveur d'un grand défi terminé incohérent (matière pas réussie → `DefiAVenir`, classe qui n'est pas
  celle du profil ou matière sans leçon → `DefiInconnu`, question d'une autre matière, plus de 12 questions) et un
  parent non rattaché qui envoie un grand défi terminé : tests de `revaliderLeDefi`, de `TerminerLeDefi` et du corps
  de `terminer-le-defi` ; le chemin HTTP est celui de #100 (8.2, 8.5) ;
- un autre enfant du même parent n'hérite pas du grand défi (#100, 8.3 ; RLS de la nouvelle table par profil) ;
- un grand défi relevé reste relevé quand la bibliothèque change (100.15) : test unitaire ;
- export du profil (#14, encore `@wip`) : le contrat d'export reçoit `grands_defis_termines` dans la migration ; un
  scénario s'ajoutera à `@depend-de-14` avec #14 ;
- idempotence de l'enregistrement, suppression en cascade : tests du cas d'usage et migration ;
- le grand défi des classes d'avant (#26) : seul celui de la classe du profil se joue (invariant 10 du modèle, comme
  le défi de #100).

## Décisions

Gardées depuis #100 (réponse 2.a du PO du 2026-10-29), **non reposées** :

| Décision | Contenu | Scénarios |
|---|---|---|
| R6 de #100 | Ouvert quand la matière est réussie (#26) ; près du fanion (#99) ; remplace le défi de la dernière partie du parcours ; la séance qui rend la matière réussie l'annonce | 1.1, 1.2, 2.1 |
| 100.3 | L'écran dit « Grand défi » | 4.1, 1.x, 5.x, 6.1 |
| 100.5, 100.6, 100.7 | 12 questions, au moins une de chaque leçon, à parts égales, mélangées | 3.1 |
| 100.14 | Une matière d'une seule partie du parcours n'a que le grand défi | 1.1 (sciences), 1.2 (sciences) |
| 100.20 | « Défi de la matière » et « grand défi » validés | Vocabulaire (nom de référence : #137.1) |
| 100.21 | Annonce « Le grand défi des maths est ouvert ! » | 2.1, 2.2 |
| 100.22 | Moins de questions possibles : toutes, une fois chacune | 3.2 |
| 100.23 | Le grand défi remplace le défi de la dernière partie du parcours | 1.2 |
| Suit #100 | Ni vie ni temps limité ; relevé dès qu'il est terminé ; rejouable sans nouvelle récompense ; aucune étoile ; question ratée en révision (100.10) ; « Mes défis relevés » ; lecteurs d'écran ; repère à 360 px | 4.1 à 4.5, 5.1, 5.2 |

Textes repris de #100 sans question : « Encore N leçon(s) pour ouvrir le défi », « Relever le défi », « Défi relevé »
et « Rejouer le défi » sur le repère (100.29), « Mon parcours » et « Accueil » à la fin du défi, effets sonores
« grande victoire » et « séance terminée » (100.25), lignes des lecteurs d'écran « Grand défi : à venir, encore
6 leçons pour ouvrir le défi » (ancien 7.2 de #100), « Grand défi : ouvert », « Grand défi : relevé ».

## Décisions du PO

Réponse du PO du 2026-11-04 : « 137 reco tout » (annonce du responsable, commentaire 6642164056 de l'issue #64).
Toutes les recommandations sont retenues ; la décision 0041 (table `grands_defis_termines`) est validée aussi.
Aucun texte des scénarios ne change.

| Question | Réponse | Scénarios |
|---|---|---|
| #137.1 Nom de référence | A : **grand défi** (ce que l'enfant voit) ; « défi de la matière » permis pour l'expliquer | Vocabulaire de tout le fichier, glossaire |
| #137.2 Une séance qui ouvre deux défis | A : seulement « Le grand défi des maths est ouvert ! » ; le défi 1 est ouvert sur « Mon parcours », sans annonce | 2.2 |
| #137.3 Nom de la matière dans les textes | Oui : formes avec article du tableau (« du français », « des maths », « des sciences », « de l'histoire-géo », « de l'anglais », « du vivre ensemble » ; « de français », « de maths », « de sciences », « d'histoire-géo », « d'anglais », « de vivre ensemble ») | 2.1, 2.2, 4.1, 4.2, 4.3 |
| #137.4 Proposition du personnage guide | Oui : « Bravo Léa ! Tu as réussi toutes les leçons de maths. Le grand défi t'attend ! » | 2.1 |
| #137.5 Autres textes du grand défi | Textes proposés : début « Voici des questions de toutes tes leçons de maths. Prends ton temps, je suis avec toi ! », fin « Bravo Léa ! Tu as relevé le grand défi des maths ! », rejoué « Bravo Léa ! Tu as encore relevé le grand défi des maths ! » ; annonce A « Grand défi relevé ! » | 4.1, 4.2, 4.3 |
| #137.6 Place dans « Mes défis relevés » | Oui : après les défis de la même matière et de la même classe | 4.5 |
| #137.7 Boutons de la fin de la séance qui rend la matière réussie | A : « Relever le défi » en plus des boutons habituels, sans rien changer à ceux-ci | 2.1 |
| Décision 0041 | Validée : table `grands_defis_termines` | 6.1, 6.2 |

## Questions ouvertes

Aucune.
