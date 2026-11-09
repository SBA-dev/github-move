# Graphe des stories

Mise à jour : 2026-11-09 (fin de la vague 1), par le responsable des équipes seulement (décision 0017).
Une story ne commence son code que quand **toutes** ses dépendances sont mergées dans `main`. L'état courant (en cours, en revue…) est dans les labels `graphe:*` des issues et dans l'issue `[Coordination des équipes] Vague <k>`, pas ici.

Les dépendances viennent des issues (relevé du 2026-10-24), corrigées par le PO le 2026-10-24. Une dépendance suivie de `?` est une **hypothèse** : le PO la confirme ou l'écarte avant le lancement de la story. Tant qu'elle n'est pas tranchée, elle bloque.

## Livrées

Avant la vague 1 : #5, #6, #7, #8, #10, #11, #12, #15, #16, #17, #18, #19, #23, #24.

Vague 1 (24/10 → 09/11, coordination #64) :
- **beta** : #20, #25, #22, #21, #65, #27, #58, #72, #26, #32, #28, #73, #39, #34, #29, #79, #31, #30, #33, #45 (code et publication) ;
- **épopée #95, leçons plus ludiques** : #96, #97, #99, #98 (98a), #102, #101, #100, #127, #126, #128, #131, #129, #130, #137, #106 (106a à 106h), #158, #161, #168, #163 (163a à 163f), #166, #173 ;
- **outillage et correctifs** : #146, #141, #140, #155, #179, #107, #111, #136, #113, #114, #115, #123.

**En ligne en production** depuis le 07/11 : `5d690d3`. Mergée depuis, pas encore publiée : #173 (`35b1e38`).

## Sorties de la beta

#13, #14 (PO, 25/10) et #38 (cadrée et validée, pas lancée) ne sont pas dans la beta en ligne.

## Ouvertes à la fin de la vague 1

| # | Story | Contexte | Dépend de (ouvertes) | État |
|---|---|---|---|---|
| 182 | Voix en MP3 pré-générés (Piper) | Apprentissage (voix) | à relever | prête à cadrer |
| 183 | Écran de séance : barre du haut et barre d'action | Apprentissage | à relever | prête à cadrer |
| 184 | Hors séance : en-tête compact et dock | transverse | à relever | prête à cadrer |
| 13 | Inviter un second parent | Famille | — | cadrée (lot 2) |
| 14 | Supprimer et exporter un profil | Famille | — | cadrée (lot 2) |
| 38 | Enregistrements de lecture | Accompagnement | — | cadrée et validée |
| 103 | Vérifier le texte du parent (leçons personnelles) | Accompagnement | à relever | à cadrer |
| 104 | Vérifier le prénom saisi par le parent | Famille | à relever | à cadrer |
| 116 à 121 | Épopée #122 : retours depuis l'application | transverse | #116 d'abord | à cadrer |
| 86, 87 | Outillage E2E (environnement par équipe, non-régressions fiables) | outillage | — | à cadrer |
| 45 | Mise en ligne | transverse | — | publiée ; restent au PO M1 et le parent de test de production |

Les dépendances « à relever » se lisent dans les issues au lancement de la vague 2 et se font confirmer par le PO, comme pour la vague 1.

## Graphe de départ de la vague 1 (24/10, gardé pour mémoire)

### Nœuds ouverts au 24/10

Ressources : `base` = migration sur `savanturier-dev` ; `email` = scénarios `@envoi-email` ; `ia` = appel à l'API Claude (clé pas encore fournie, décision de démarrage n°6).

### Beta

| # | Story | Contexte | Dépend de (ouvertes) | Ressources | Niveau |
|---|---|---|---|---|---|
| 13 | Inviter un second parent | Famille | — | base, email | 0 |
| 14 | Supprimer et exporter un profil | Famille | — | base | 0 |
| 19 | Dictée, conjugaison | Apprentissage | — | — | 0 |
| 20 | Calcul, fluence, addition posée | Apprentissage | — | base | 0 |
| 22 | Mémoriser une poésie | Apprentissage | — | — | 0 |
| 25 | Parcours par matière et verrous | Apprentissage | — | base? | 0 |
| 58 | Retirer la page de démonstration | transverse | — | — | 0 |
| 21 | Boîte, barres | Apprentissage | 20 | — | 1 |
| 26 | Parcours libre et classes d'avant | Apprentissage | 25 | — | 1 |
| 27 | Test de départ | Apprentissage | 25, 20 | base | 1 |
| 65 | Écran « Mes trophées » (nom à trancher) | Motivation | 20 | — | 1 |
| 28 | Révisions des erreurs | Apprentissage | 19, 20, 21, 22, 27 | base | 2 |
| 32 | Cabane | Motivation | 27, 65 | base? | 2 |
| 39 | Leçons personnelles (générateurs locaux) | Accompagnement | 25, 26, 19, 20, 22, 14 | base | 2 |
| 29 | Écran « Aujourd'hui » | Apprentissage | 25, 26, 27, 28 | — | 3 |
| 31 | Badges et compétences | Motivation | 27, 39, 65 | base? | 3 |
| 34 | Suivi et carte des compétences | Accompagnement | 25, 27, 28, 13 | — | 3 |
| 30 | Série | Motivation | 29, 27 | base | 4 |
| 38 | Enregistrements de lecture | Accompagnement | 22, 14, 34 | base | 4 |
| 33 | Épisodes de l'histoire | Motivation | 27, 28, 30, 65 | base | 5 |
| 45 | Mise en ligne | transverse | toute la beta | email, base? | 6 |

#39, #38 et #34 entrent dans la beta (décisions du PO du 2026-10-24).

### Après la beta

| # | Story | Contexte | Dépend de (ouvertes) | Ressources |
|---|---|---|---|---|
| 43 | Traduction des consignes | Accompagnement | — | ia, base? |
| 37 | Mots de la semaine | Accompagnement | 19, 29 | base |
| 35 | Rapport de la semaine | Accompagnement | 34, 28, 30? | base |
| 36 | Devoirs : leçon à faire | Accompagnement | 29, 39? | base |
| 40 | Leçons personnelles avec l'IA | Accompagnement | 39 | ia |
| 41 | Photographier le cahier | Accompagnement | 39, 40 | ia |
| 42 | Audio des poésies | Accompagnement | 22, 39, 14 | base |
| 44 | Hors ligne et synchronisation | transverse | 13, 14, 28?, 30? à 33? | base |
| 46 | Retrait de `app/` | transverse | toutes les autres, 58, 45 | — |

Le **niveau** est la longueur de la plus longue chaîne de dépendances ouvertes : toutes les stories d'un même niveau peuvent avancer en parallèle dès que le niveau précédent qui les concerne est mergé.

## Graphe de la beta

```mermaid
graph LR
  20[#20 calcul] --> 21[#21 boîte, barres]
  20 --> 27[#27 test de départ]
  20 --> 65[#65 Mes trophées]
  25[#25 parcours] --> 26[#26 parcours libre]
  25 --> 27
  19[#19 dictée] --> 28[#28 révisions]
  20 --> 28
  21 --> 28
  22[#22 poésie] --> 28
  27 --> 28
  25 --> 39[#39 leçons personnelles]
  26 --> 39
  19 --> 39
  20 --> 39
  22 --> 39
  14[#14 suppression] --> 39
  27 --> 32[#32 cabane]
  65 --> 32
  27 --> 31[#31 badges]
  39 --> 31
  65 --> 31
  25 --> 29[#29 Aujourd'hui]
  26 --> 29
  27 --> 29
  28 --> 29
  28 --> 34[#34 suivi]
  27 --> 34
  13[#13 second parent] --> 34
  22 --> 38[#38 enregistrements]
  14 --> 38
  34 --> 38
  29 --> 30[#30 série]
  27 --> 30
  30 --> 33[#33 épisodes]
  28 --> 33
  65 --> 33
  58[#58 démonstration]
```

## Chemin critique de la beta

`#20 → #21 → #28 → #29 → #30 → #33 → #45` : 7 stories en série (8 avant les réponses du PO). C'est la durée minimale de la beta, quel que soit le nombre d'équipes. Les stories du chemin critique passent en premier dans chaque vague ; #25 et #27 sont presque aussi critiques (`#25 → #27 → #28`).

## Vague 1 proposée le 24/10 (2 équipes, puis 3)

| Équipe | Story | Pourquoi | Verrous |
|---|---|---|---|
| A | #20 calcul | chemin critique ; ouvre #21, #27, #65 | base |
| B | #25 parcours | ouvre #26, #27, #29, #39 | base? |

En attente d'une place : #19, #22, #14, #13, #58 (niveau 0), puis #21 et #65 dès que #20 est mergée, #26 dès que #25 est mergée, #27 quand les deux le sont.

## Réponses du PO (2026-10-24)

| Question | Réponse | Effet sur le graphe |
|---|---|---|
| #14 dépend-elle de #13 ? | non | #14 passe au niveau 0 |
| #27 dépend-elle de #21 ? | non | #27 ne dépend plus que de #25 et #20 |
| #28 dépend-elle de #27 ? | oui | arête confirmée |
| #31 cite #39 (hors beta) | #31 dépend de #39, et #39 entre dans la beta | #39 dans la beta |
| #45 suppose l'expiration à 30 jours de #38 | #38 entre dans la beta | #38 dans la beta |
| #30 dépend-elle de #27 ? #33 de #30 ? | oui et oui (lecture de la réponse « #30 dépend de #27, #33 de #30 », à corriger si elle est fausse) | arêtes confirmées |
| #38 dépend de #34 : #34 entre aussi dans la beta ? | oui, #38 et #34 entrent dans la beta | #34 dans la beta |
| #34 dépend-elle de #13 ? | oui | arête confirmée |
| Écran « Mes trophées » et type `lecture` sans issue | créer les issues | **#65** créée pour l'écran ; pas d'issue pour `lecture` : le type est déjà livré par #17 (« Lecture : Le petit chat Plume »), et le bouton d'enregistrement qui lui manque est décrit dans #38 |

## Épopée #95 (après la beta), telle que livrée

- #96 → #97 → #98 (98a) ;
- #98 → #130 (train), #126 (bulles), #127 (addition) → #131 (boîte et barres), #128 (claviers), #129 (parchemin) ;
- #96 → #99 → #100 → #137 (grand défi) ;
- #99 → #101 ;
- #96, #102 et #100 → #106 (106a à 106h) → #158, #161, #168 (dessins fixes), #163 (réponse fausse), #166 (musiques) → #173 (musiques de Sports et de Police).

## Questions encore ouvertes

Aucune hypothèse `?` ne reste. Les dépendances de #182, #183, #184, #103, #104 et de l'épopée #122 restent à relever avant la vague 2.

## Scénarios déjà écrits qui attendent une story ouverte

Livrer ces stories rend exécutables des scénarios déjà écrits (tags `@depend-de-<n>`), #13 (1 scénario), #14 (5) et #44 (1). L'équipe qui les livre relance ces scénarios en non-régression. Les scénarios `@hors-beta` attendent le retour de la connexion par e-mail (décision 0019).
