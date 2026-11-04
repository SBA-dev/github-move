# Critères d'acceptance de #140 : « Mes médailles », « Écouter » touché avant la fin du chargement est perdu

## Objectif

En tant qu'enfant
je veux que ce que je demande à écouter sur « Mes médailles » soit lu jusqu'au bout
afin de ne jamais perdre une lecture que j'ai demandée, même si l'écran n'a pas fini de se charger.

Attendu de l'issue, validé par le PO : « Une demande de lecture faite par l'enfant n'est jamais perdue. Elle est lue,
ou elle passe après l'accueil. » Choix de l'équipe, dans le cadre de cet attendu (« elle est lue ») : si l'enfant a déjà
demandé une lecture sur l'écran, la phrase d'accueil du personnage guide (« Regarde tout ce que tu as gagné ! ») n'est
pas dite ; la lecture demandée est lue jusqu'au bout.

## Règle

| Règle | Scénario |
|---|---|
| Une lecture demandée par l'enfant n'est jamais perdue : elle est lue jusqu'au bout, même si l'écran finit de se charger pendant ce temps | Touché avant la fin du chargement de l'écran, « Écouter » lit les records jusqu'au bout, sans être coupé par l'accueil |

Le scénario est ajouté, dans un nouveau bloc `Règle:`, à la fin de `features/65-ecran-mes-medailles.feature`, tagué
`@issue-140` (il hérite aussi de `@issue-65`, porté par la `Fonctionnalité`). Aucun scénario existant n'est modifié.

## Scénario

```gherkin
  # Ajoutée par #140 (correctif) : l'attendu de l'issue est validé par le PO ; l'équipe a choisi « elle est lue »
  Règle: Une lecture demandée par l'enfant n'est jamais perdue : elle est lue jusqu'au bout, même si l'écran finit de se charger pendant ce temps

    @issue-140
    Scénario: Touché avant la fin du chargement de l'écran, « Écouter » lit les records jusqu'au bout, sans être coupé par l'accueil
      Étant donné que le réglage « tout lire à voix haute » de Léa est sur « non »
      Et que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que l'histoire des Savanturiers tarde à se charger
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa demande à écouter les records de calcul rapide
      Alors Léa entend Noisette lire « Mes records de calcul rapide », puis « Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs »
      Mais Léa n'entend pas Noisette lire « Regarde tout ce que tu as gagné ! »
```

La section des records de calcul rapide est choisie parce que sa préparation est la plus légère (un seul record, step
déjà en place) et que son « Écouter » à la demande est déjà décrit par #65 (même texte lu, même step `Alors`).
« tout lire à voix haute » est sur « non » pour que la seule lecture automatique possible soit la phrase d'accueil.

## Steps

### Réutilisés (définis, aucune modification de texte)

| Step | Fichier |
|---|---|
| `Étant donné que Paul est connecté sur la tablette` (Contexte) | step commun déjà utilisé par #65 |
| `Et que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »` (Contexte) | step commun déjà utilisé par #65 |
| `le réglage « tout lire à voix haute » de Léa est sur « non »` | `features/steps/ecran-mes-medailles.steps.ts` (réglages appliqués avant l'ouverture) |
| `Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »` | `features/steps/ecran-mes-medailles.steps.ts` |
| `Léa a ouvert « Mes médailles » depuis son accueil` | `features/steps/ecran-mes-medailles.steps.ts` (l. 236) |
| `Léa demande à écouter les records de calcul rapide` | `features/steps/ecran-mes-medailles.steps.ts` (l. 392) |
| `Léa entend Noisette lire « … », puis « … »` | `features/steps/ecran-mes-medailles.steps.ts` (l. 373, tags `@issue-65 or …` : couvert par l'héritage de `@issue-65`) |
| `Léa n'entend pas Noisette lire « … »` | `features/steps/ecran-mes-medailles.steps.ts` (l. 384) |

### Nouveau (un seul)

`Étant donné que l'histoire des Savanturiers tarde à se charger` : la section de l'histoire n'arrive qu'après un
moment, pendant que la section des records est déjà affichée avec son bouton « Écouter ». Formulé en langage métier
(« Histoire des Savanturiers » est au glossaire) ; c'est à l'`e2e-tester` d'en écrire la définition.

### Points d'attention pour l'e2e-tester (pas des règles nouvelles)

- Le step `Léa demande à écouter les records de calcul rapide` attend aujourd'hui que la bulle du personnage guide
  soit affichée avant de toucher « Écouter » (attente ajoutée par #136, `3d810cf`). Avec une section qui tarde, cette
  attente fait toucher « Écouter » après la fin du chargement : le scénario ne reproduirait plus le défaut. L'issue
  demande de retirer cette attente une fois le défaut corrigé.
- Pour que le `Mais` ait un sens, l'histoire doit finir de se charger après le geste de Léa et avant la vérification
  « n'entend pas » : sinon le scénario passe sans avoir laissé l'occasion à l'accueil d'être dit.
- Avant la correction, le scénario doit échouer (la phrase d'accueil coupe la lecture des records).

## Hors périmètre

- La bulle d'accueil affichée (texte écrit) : seul ce qui est dit change.
- Les autres écrans qui disent un accueil à l'ouverture.
- Les « Écouter » de la cabane, de l'histoire et des badges : même règle, même correctif, non dupliqués en scénario
  (la règle porte sur l'écran, pas sur une section).

## Questions ouvertes

140.1 Avec « tout lire à voix haute » sur « oui », si l'enfant touche « Écouter » avant la fin du chargement, la lecture
de tout l'écran à l'ouverture (accueil, titre, chaque section) est-elle aussi abandonnée, comme l'accueil seul avec le
réglage sur « non » ? Ou bien passe-t-elle après la lecture demandée ? Le choix de l'équipe ne parle que de l'accueil ;
aucun scénario n'est écrit pour ce cas tant que ce n'est pas tranché.
