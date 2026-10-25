# Critères d'acceptance : issue #32, Cabane, des objets débloqués par paliers d'étoiles

Scénarios : `features/32-cabane.feature` (tags `@issue-32 @wip`).
Modèle du domaine : `docs/stories/32/domain-model.md` (contexte **Motivation**, lecture seule des meilleures étoiles d'**Apprentissage**). Les scénarios suivent la **recommandation** de chaque question, retenue par le PO le 2026-10-25 (voir « Validation du PO ») ; ceux qui dépendaient d'une réponse portent le numéro de la décision en commentaire. Aucun scénario ne porte plus `@a-valider`.

## Objectif

En tant qu'**enfant**, je veux remplir une cabane d'objets grâce à mes étoiles, afin de voir mes efforts prendre forme.

La story remplit la section « cabane » de l'écran « Mes médailles » (#65 : dessin, phrase, une pastille par palier) et ouvre la zone « nouveautés » de l'écran de fin (#24 : encart « Pour la cabane » et fin de la phrase du personnage guide). La cabane ne fait que **compter** le total des étoiles : elle ne modifie aucune étoile et n'enregistre rien (pas de migration, pas d'Edge Function).

Comportement actuel (`app/app.js`, `showTrophees`, `CABANE`, fin de séance l. 1945) repris comme premiers exemples : 12 paliers et leurs objets, phrases « Tu as n étoile(s). Encore k étoile(s) et Noisette recevra … ! » et « La cabane est complète, quelle merveille ! », pastille « 10 ★ », libellé « La cabane de Noisette, avec n objet(s) », encart « Pour la cabane », cabane de Noisette dans tous les univers. Écarts voulus (issue) : tout se lit à voix haute, 360 px, mouvements réduits, nom de l'objet « un trophée » (question 32.5).

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Le total des étoiles est la somme des meilleures étoiles de toutes les leçons du profil ; le test de départ n'y ajoute rien | CP : 2 à « Les sons ou, on, an » + 3 à « Les tables de 3 et de 4 » (CE2) → 5 · 2 leçons réussies au test de départ + 2 étoiles → 2 · leçon à 3 rejouée à 1 → toujours 6, 2 objets · 3 étoiles à une leçon retirée de la bibliothèque → 3 · 2 + séance de 1 étoile → 3 tout de suite · fluence seule → +0 (unitaire) |
| 2. Un objet par palier atteint ; complète à 75 | 0 → « Tu as 0 étoile. Encore 3 étoiles… lanterne », 0 objet · 2 → « Encore 1 étoile… lanterne » · 3 → 1 objet · 9 → 2 objets, « pot de fleurs » · 75 → complète, 12 objets · 100 → complète · 6 → pastilles « une lanterne », « un tapis tout doux », « 10 ★ »… « 75 ★ » · pastille inerte · sans réseau → section absente · profil préparé (sans profil réel au serveur) → étoiles de l'appareil |
| 3. La fin d'une séance qui fait atteindre un palier annonce l'objet | 5 + 1 → « Pour la cabane » : « Noisette a reçu un tapis tout doux ! » et fin de phrase « … pour sa cabane. » · leçon à 2 rejouée à 3 → 3, lanterne · leçon à 3 rejouée à 1 (total 6) → rien · leçon à 1 rejouée à 1 (total 4) → rien · sans réseau au début → rien |
| 4. Toujours la cabane de Noisette | univers Sports, Princesses : « La cabane de Noisette », 1 objet gardé · Coach Léo dit « Noisette a reçu un tapis tout doux pour sa cabane. » |
| 5. Voix, lecteur d'écran, dys, mouvements réduits, 360 px | Tout lire : accueil, titre de l'écran, « La cabane de Noisette », phrase · « Écouter » : titre puis phrase · 2 étoiles, aucun record : « Gagne des étoiles pour remplir la cabane ! » · pastille « 10 ★ » dite « 10 étoiles » · 75 étoiles à 360 px · mode dys · encart sans mouvement |
| 6. Seulement le profil en cours | Tom 30, Léa 2 → Léa lit 2 · Marie retrouve 3 · Claire ne reçoit rien |

## Règles

| # | Règle | Scénarios | Décisions |
|---|---|---|---|
| 1 | Le total des étoiles est la somme des meilleures étoiles de toutes les leçons du profil ; le test de départ n'y ajoute rien | Les étoiles des leçons d'une autre classe comptent dans le total · Les leçons réussies au test de départ n'ajoutent aucune étoile à la cabane · Rejouer une leçon avec moins d'étoiles ne retire aucun objet · Les étoiles d'une leçon qui n'est plus dans la bibliothèque comptent toujours · Juste après une séance, ses étoiles sont déjà dans le total de la cabane | 32.4, 32.7, 32.15, 32.19 |
| 2 | La cabane a un objet par palier atteint par le total des étoiles ; elle est complète à 75 étoiles | Avec <total> en tout, la cabane a <objets> (5 cas : 0, 2, 3, 9, 75) · Une pastille montre le nom de l'objet reçu, ou le palier qui reste à atteindre · Au-delà de 75 étoiles, la cabane reste complète avec ses 12 objets · Une pastille de la cabane n'ouvre rien · Sans réseau, la section de la cabane n'apparaît pas, sans message d'erreur · Avec le profil préparé, sans profil réel au serveur, la cabane compte les étoiles gagnées sur l'appareil | 32.3, 32.5, 32.6, 32.8, 32.13, 32.14, 32.16, 32.22 |
| 3 | À la fin d'une séance qui fait atteindre un palier, l'enfant apprend quel objet la cabane a reçu | Passer de 5 à 6 étoiles fait recevoir le tapis tout doux · Le personnage guide termine sa phrase de fin par l'objet reçu · Rejouer mieux une leçon n'ajoute au total que les étoiles en plus · Sans palier atteint, la fin de la séance n'annonce rien pour la cabane (2 cas) · Sans réseau au début de la séance, la fin de la séance n'annonce aucun objet | 32.12, 32.13, 32.23 |
| 4 | La cabane est toujours celle de Noisette, quel que soit l'univers du profil | Dans l'univers <clé>, l'enfant retrouve la cabane de Noisette et ses objets (2 cas : sports, princesse) · Dans l'univers Sports, Coach Léo annonce que Noisette a reçu un objet | 32.1, 32.2 |
| 5 | La cabane se lit à voix haute, au lecteur d'écran, en mode dys, sans mouvement et sur un petit écran | Avec « tout lire à voix haute », le titre de la cabane puis sa phrase sont lus à l'ouverture · Sans « tout lire à voix haute », l'enfant fait lire la cabane à la demande · Sans objet ni record, le personnage guide invite l'enfant à gagner des étoiles · Un lecteur d'écran dit une pastille non atteinte en étoiles · La cabane complète tient dans un écran de 360 px de large · Avec le mode dys, la section de la cabane s'affiche en mode dys · Avec les mouvements réduits, l'annonce de l'objet reçu apparaît sans mouvement | 32.9, 32.10, 32.11, 32.17, 32.18, 32.21 |
| 6 | La cabane ne compte que les étoiles du profil enfant qui joue | Les étoiles d'un autre enfant du même parent ne comptent pas dans la cabane (`@acces`) · Le second parent rattaché retrouve la cabane de Léa sur son téléphone (`@acces`) · Un parent qui n'est pas rattaché ne lit pas les étoiles de Léa (`@acces`) | 32.24 |

Total : 6 règles, 28 scénarios (34 cas), dont 0 `@a-valider` (17 avant la validation du PO) et 3 `@acces`.

Droits d'accès (`@acces`) : la cabane lit les meilleures étoiles sous la RLS existante de `resultats_des_lecons` (#24, lecture par un parent rattaché). La RLS ne sépare pas deux enfants d'un même parent : c'est le filtre sur le **profil en cours** qui garantit que les étoiles de Tom ne comptent pas pour Léa. Le scénario Claire reprend mot pour mot les étapes de #24 (« Claire demande les étoiles du profil enfant de Léa », « Claire ne reçoit aucune donnée de Léa »).

## Ce qui se vérifie en test unitaire, et ce qui demande l'E2E

Les E2E tournent contre `savanturier-dev` : ils sont peu nombreux et préparent les étoiles en base (« Léa a gagné N étoiles en tout », « Léa a pour meilleures étoiles : ») plutôt que de jouer des leçons. Seuls les scénarios de la règle 3 jouent une séance (la leçon de test « Les sons de test », 10 questions).

Tests unitaires du domaine (`@domain/motivation`, `cabane_test.ts`, `paroles-de-la-cabane_test.ts`), **exhaustifs** :

- `PALIERS_DE_LA_CABANE` : 12 paliers, seuils strictement croissants, écart d'au moins 3, clés uniques.
- `totalDesEtoiles` : 0 sans leçon ; somme des meilleures étoiles ; `NombreDEtoilesInvalide` pour 0 ou 4.
- `cabaneDe(total)`, à chaque borne : tableau ci-dessous.

  | total | objets reçus | prochain objet (étoiles manquantes) |
  |---|---|---|
  | 0 | 0 | une lanterne (3) |
  | 1 | 0 | une lanterne (2) |
  | 2 | 0 | une lanterne (1) |
  | 3 | 1 | un tapis tout doux (3) |
  | 5 / 6 | 1 / 2 | un tapis tout doux (1) / un pot de fleurs (4) |
  | 9 / 10 | 2 / 3 | un pot de fleurs (1) / une étagère de livres (5) |
  | 14 / 15 | 3 / 4 | |
  | 19 / 20, 25 / 26, 32 / 33, 39 / 40, 47 / 48, 55 / 56, 64 / 65 | n / n + 1 | |
  | 74 | 11 | l'étoile magique (1) |
  | 75, 100, 795 | 12, complète | aucun |

- `objetRecuParLaSeance` : leçon nouvelle 5 → +1 → « un tapis tout doux » ; leçon à 3 rejouée à 1 → aucun ; leçon à 1 rejouée à 3 → +2 ; leçon à 2 rejouée à 3 avec total 2 → « une lanterne » ; séance sans étoiles (fluence seule) → aucun ; à 75 et plus → aucun ; jamais deux objets.
- Paroles : « 0 étoile », « 1 étoile », « 2 étoiles » ; « Encore 1 étoile » / « Encore 3 étoiles » ; « avec 0 objet », « avec 1 objet », « avec 2 objets » ; phrase complète ; libellé d'une pastille atteinte ou non (« 10 ★ », dit « 10 étoiles ») ; annonce de fin ; fin de phrase du personnage guide ; titre « La cabane de Noisette » quel que soit l'univers.
- Sections de « Mes médailles » (#65) : section `cabane` disponible et en tête ; paroles à l'ouverture selon objets et records (décision 32.9).

E2E (`features/32-cabane.feature`) : ce qui passe par la lecture sous RLS, le profil en cours, l'écran « Mes médailles », l'écran de fin, la voix, l'accessibilité. Les bornes de `cabaneDe` n'y sont qu'échantillonnées (0, 2, 3, 9, 75, 100).

## Données de test

- Leçons **réelles** de la bibliothèque : « Les sons ou, on, an » (CP), « Les tables de 3 et de 4 » (CE2), « Les syllabes » et « Utiliser le bon mot » (CP, réussies au test de départ).
- Leçons **de test** de #24 : « Les sons de test » et « La suite de test » (étape `les leçons de test … sont dans la bibliothèque`, en Contexte).
- Profil réel : toute étape qui écrit des étoiles en base (« Léa a gagné N étoiles en tout », « Léa a pour meilleures étoiles : », « Léa a gagné N étoiles à la leçon … », leçons réussies au test de départ, leçon retirée) suppose que Léa joue avec un **profil réel** créé pour Paul (`features/steps/profil-reel.ts`, décision 0021, point 5), comme pour #24, #25 et #27. Le seul scénario qui garde le **profil préparé** du Contexte, sans profil réel au serveur, est « Avec le profil préparé, sans profil réel au serveur, la cabane compte les étoiles gagnées sur l'appareil ».
- Étoiles préparées : « Léa a gagné N étoiles en tout » écrit des meilleures étoiles sur des leçons de test absentes de la bibliothèque (identifiants `e2e-32-…`, 3 étoiles par leçon puis le reste), comme `ecrireUnResultatDeLecon` de #25 ; elles partent en cascade avec le profil enfant. Aucune migration.
- Steps réutilisés sans changement de sens : « Léa a pour meilleures étoiles : », « (Léa|Tom) a pour leçons réussies au test de départ : », « Léa a terminé une séance de la leçon « … » avec N étoile(s) » (version qui joue la séance, #25), « Léa joue la séance complète de la leçon « … » », « Léa a fait N erreurs pendant la séance », « Léa n'a fait aucune erreur pendant la séance », « Léa réussit la dernière question de la séance », « Noisette dit une félicitation, suivie de « … » », « Léa ouvre « Mes médailles » depuis son accueil » (et « … sur le téléphone de Marie », « Léa a ouvert … »), « Léa choisit la pastille « … » », « le titre de l'écran est toujours « Mes médailles » », « Léa lit « … » », « les lecteurs d'écran annoncent « … » », « Léa entend Noisette lire, dans l'ordre : », « Léa entend Noisette lire « … », puis « … » », « Léa entend Noisette dire « … » », « Léa a choisi l'univers … », « le réseau est coupé », « aucun message d'erreur n'apparaît », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « le bouton d'accès à l'écran, « Retour » et chaque bouton « Écouter » mesurent au moins 44 px de haut », « l'appareil demande des mouvements réduits », « Paul a réglé « … » sur « … » pour Léa », « le réglage « … » de Léa est sur « … » », « Tom a un profil enfant préparé de niveau CP », « Marie est rattachée au profil enfant de Léa », « Léa a gagné 2 étoiles à la leçon « … » sur la tablette », « Claire est connectée sur le téléphone », « Claire demande les étoiles du profil enfant de Léa », « Claire ne reçoit aucune donnée de Léa ». Certains sont restreints au tag d'une autre story (`@issue-65`, `@issue-25`) : à étendre à `@issue-32` par l'e2e-tester, sans en changer le sens.
- Steps nouveaux : voir la liste remise à l'orchestrateur (préparation du total, « Léa joue avec le profil préparé, sans profil réel au serveur », pastilles de la cabane, annonce pour la cabane, section absente, écoute de la cabane, Coach Léo, leçon retirée, mode dys, encart sans mouvement).

## Hors périmètre

- Paliers au-delà de 75 étoiles, cabanes par univers (décisions 32.1, 32.3 : story à part, textes et dessins fournis par le PO).
- Badges (#31), épisodes (#33), série (#29, #30) : #32 ne fait qu'ouvrir la zone « nouveautés » de l'écran de fin.
- Copie des meilleures étoiles sur l'appareil pour l'affichage hors ligne (#44).
- Leçons personnelles (lot 6) : comptées d'office si elles ont des meilleures étoiles (décision 32.4), rien à vérifier ici.
- Export et suppression : la cabane n'enregistre rien ; les meilleures étoiles sont déjà couvertes par #24 et #14.
- Séances de révision (#28) : à confirmer avec #28 qu'elles ne changent pas les meilleures étoiles (remarque du modèle, pas une question au PO).
- La cabane dans l'Espace parent (décision 32.24).

## Questions ouvertes

Aucune.

## Validation du PO (2026-10-25)

Réponse du PO, recopiée mot pour mot depuis l'annonce du responsable sur l'issue #32 (commentaire 6398398436) :

> « OK #32 reco partout »

- **32.1 à 32.24 : recommandations de l'équipe retenues, telles qu'écrites** (32.1 à 32.20 dans `domain-model.md`, 32.21 à 32.24 ci-dessous ; 32.22 dans sa version corrigée, profil préparé, commit `60387a1`).
- Textes désormais **définitifs** : « une coupe dorée » remplace « un trophée » (objet n°11, 32.5) ; « Gagne des étoiles pour remplir la cabane ! » est la phrase d'ouverture de « Mes médailles » sans objet ni record (32.9).
- Les 17 tags `@a-valider` de `features/32-cabane.feature` sont retirés ; les commentaires « Question 32.n » deviennent « Décision 32.n ».
- 32.21 : les scénarios livrés de #65 que la cabane rend faux sont mis à jour dans la même PR (voir « Mise à jour par #32, décision 32.21 » à la fin de `docs/stories/65/acceptance.md`).

Questions tranchées (32.1 à 32.20 : énoncé complet dans `domain-model.md`) :

| Question | Sujet | Décision (reco retenue) | Statut | Scénarios |
|---|---|---|---|---|
| 32.1 | Cabane de Noisette ou par univers | Noisette pour tous | validée | Plan « Dans l'univers <clé>… », « Dans l'univers Sports, Coach Léo… » |
| 32.2 | Objets gardés au changement d'univers | Oui, automatique | validée | Plan « Dans l'univers <clé>… » |
| 32.3 | Paliers au-delà de 75 | Non dans #32 | validée | « Au-delà de 75 étoiles… » |
| 32.4 | Classes d'avant, leçons personnelles | Tout compte | validée | « Les étoiles des leçons d'une autre classe… » |
| 32.5 | Renommer « un trophée » | Oui : « une coupe dorée » | validée | « Au-delà de 75 étoiles… » |
| 32.6 | « L'étoile magique » au glossaire | Garder le nom, noter le conflit | validée | (aucun scénario : glossaire) |
| 32.7 | Un seul jeu = étoiles de la leçon | Règle Q69, rien de propre à la cabane | validée | (aucun) |
| 32.8 | Section toujours affichée | Oui, même à 0 étoile | validée | Plan « Avec <total> en tout… » (cas 0) |
| 32.9 | Phrase d'ouverture sans objet ni record | « Gagne des étoiles pour remplir la cabane ! » | validée | « Sans objet ni record… », « Avec « tout lire à voix haute »… » |
| 32.10 | Que lit-on de la section | Titre puis phrase ; pas les pastilles | validée | « Avec « tout lire à voix haute »… », « Sans « tout lire à voix haute »… » |
| 32.11 | Pastille « 10 ★ » dite | « 10 étoiles » | validée | « Un lecteur d'écran dit une pastille non atteinte en étoiles » |
| 32.12 | Encart et phrase du personnage guide | Comme le legacy | validée | « Le personnage guide termine sa phrase de fin… » |
| 32.13 | Sans réseau | Pas de section, pas d'annonce, pas d'erreur | validée | « Sans réseau, la section… », « Sans réseau au début de la séance… » |
| 32.14 | Profil sans étoiles en base | Étoiles gagnées pendant l'utilisation | validée | « Avec le profil préparé, sans profil réel au serveur… » |
| 32.15 | Leçon retirée de la bibliothèque | Ses étoiles comptent | validée | « Les étoiles d'une leçon qui n'est plus dans la bibliothèque… » |
| 32.16 | Pastille ou dessin cliquable | Non | validée | « Une pastille de la cabane n'ouvre rien » |
| 32.17 | Animation de l'arrivée d'un objet | Courte, sur l'écran de fin, coupée avec les mouvements réduits | validée | « Avec les mouvements réduits, l'annonce… » |
| 32.18 | Dessin du legacy | Repris tel quel | validée | (aucun : illustration) |
| 32.19 | Étoiles de la séance en cours d'envoi | Comptées tout de suite | validée | « Juste après une séance… » |
| 32.20 | Recalcul sans enregistrement (architecture) | Oui | validée | (aucun) |

| 32.21 | Mise à jour des scénarios livrés de #65 | Oui, dans la même PR | validée | 5 scénarios de `features/65-ecran-mes-medailles.feature` |
| 32.22 | Le profil préparé affiche la cabane | Oui, étoiles gagnées sur l'appareil | validée | « Avec le profil préparé, sans profil réel au serveur… » |
| 32.23 | Encart lu avec « tout lire » | Non, seule la phrase du personnage guide | validée | (aucun : tests unitaires et revue) |
| 32.24 | Cabane dans l'Espace parent | Non dans #32 | validée | (aucun) |

Questions nées de l'écriture des scénarios (énoncé et recommandation retenue) :

21. **32.21 Faut-il mettre à jour des scénarios livrés de #65 ?** Avec la section de la cabane **toujours** affichée (32.8) et la nouvelle phrase d'ouverture (32.9), quatre scénarios de `features/65-ecran-mes-medailles.feature` ne seraient plus vrais : « Sans rien à montrer, le personnage guide invite l'enfant à gagner un premier record » et le scénario de #65 qui ouvre l'écran sans profil réel au serveur et sans section des records (ligne 79 de ce fichier) (la phrase « Fais un calcul rapide pour gagner ton premier record ! » ne serait plus dite à 0 étoile ; ce second scénario est en plus à reformuler avec le profil préparé, sans profil réel au serveur : son titre et son étape « Léa joue avec … sans compte parent » emploient encore l'ancien terme, retiré par la décision 0021) ; « Avec « tout lire à voix haute », le titre puis chaque section sont lus à l'ouverture » (la cabane serait lue avant les records) ; « Sans rien à montrer, le personnage guide ne dit qu'une phrase à l'ouverture, même avec « tout lire à voix haute » » (la cabane vide est quelque chose à montrer). **Recommandation retenue** : oui, #32 met à jour ces scénarios de #65 dans la même PR, sans changer leurs règles : « rien à montrer » devient « aucun objet et aucun record », la phrase de 32.9 remplace « Fais un calcul rapide… », et la lecture « tout lire » ajoute « La cabane de Noisette » et sa phrase avant les records.
22. **32.22 Le profil préparé affiche-t-il la cabane ?** 32.13 retire la section quand les étoiles du serveur ne sont pas lues ; le profil préparé (sans profil réel au serveur, décision 0021) n'a **pas** d'étoiles au serveur (rien d'inconnu), et 32.14 veut compter les étoiles gagnées pendant l'utilisation. **Recommandation retenue** : oui : pour le profil préparé, sans profil réel au serveur, la cabane compte les étoiles gagnées sur l'appareil pendant l'utilisation, et l'écran de fin annonce l'objet reçu ; la règle 32.13 ne vaut que pour un profil réel dont la lecture a échoué.
23. **32.23 Avec « tout lire à voix haute », l'encart « Pour la cabane » est-il lu en plus de la phrase du personnage guide ?** Les deux disent la même chose (« Noisette a reçu un tapis tout doux ! » et « … pour sa cabane. »). **Recommandation retenue** : non : seule la phrase du personnage guide est lue ; l'encart est annoncé aux lecteurs d'écran (`role="status"`) sans être dit par la voix.
24. **32.24 Le parent voit-il la cabane ou le total des étoiles dans l'Espace parent ?** **Recommandation retenue** : non dans #32 (comme les records, 65.16) ; le suivi relève d'Accompagnement (rapport de la semaine).

À signaler au domain-modeler : « encart » et « zone « nouveautés » » sont des mots d'interface, hors glossaire.
