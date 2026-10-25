# Modèle du domaine : issue #79, la consigne d'un exercice reste visible pendant tout l'exercice

État : story de correction, scénarios **validés par le PO le 2026-10-25** (décisions 79.1 à 79.9 dans `acceptance.md`). Ce modèle ne fait que placer ces règles ; il n'en ajoute aucune. Aucune migration, aucune Edge Function, aucun agrégat nouveau.

## Contexte

Deux contextes existants, chacun pour ce qu'il sait. Tout se joue dans le navigateur, hors ligne compris : les deux règles vivent dans `domain/` et le front les importe (`@domain/voix`, `@domain/apprentissage`).

- **Voix** (sous-domaine générique) sait si une phrase a été **entendue** et si la voix est **bloquée**. Il ne connaît ni séance, ni exercice, ni félicitation.
- **Apprentissage** sait quelle **consigne** afficher et ce qu'on **attend avant l'écran suivant** quand une parole n'a pas été entendue. Il reçoit seulement « entendue : oui ou non ».

Communication : **appel dans le navigateur**. Le front lit avec `LectureAVoixHaute` (Voix), puis passe `entendue` à `attenteAvantLEcranSuivant` (Apprentissage). Apprentissage n'importe pas Voix : pas de nouvelle relation dans la context map.

React n'a aucune règle : il affiche la consigne affichée dans une place à elle, au-dessus de l'exercice et hors de la bulle du personnage guide, avec un bouton pour la relire (44 px ou plus) ; il montre le message de voix bloquée entre `onVoixBloquee` et `onFinDeLaVoixBloquee` ; il applique l'attente rendue par le domaine. Il ne doit plus effacer le message à chaque lecture (défaut 2 de l'issue).

## Termes

| Terme | Statut |
|---|---|
| Consigne, Personnage guide, Séance terminée, Muet, Voix bloquée, Réécouter | existants |
| Message de voix bloquée, Relire la consigne | déjà ajoutés au glossaire par le cadrage de #79 |
| Voix bloquée | précisé (note datée, définition existante inchangée) : « prévenu une fois » devient « un seul message, tant que la voix est bloquée » |
| Consigne affichée | nouveau (à valider) |
| Parole entendue | nouveau (à valider), contexte Voix |
| Fin de la voix bloquée | nouveau (à valider), contexte Voix |
| Durée d'affichage sans voix | nouveau (à valider) |
| Fin de la séance | nouveau (à valider) : l'**écran** qui suit une séance terminée. Le **fait** garde son nom, « Séance terminée » (`SeanceTerminee`). |

## Modèle

### Voix : `LectureAVoixHaute` (service existant, `voix/domain/lecture-a-voix-haute.ts`)

- `lire(texte, options): Promise<ParoleEntendue>`, avec `type ParoleEntendue = { readonly entendue: boolean }` (nouveau type, exporté par `voix/domain/index.ts`).
  - `entendue: true` seulement si le lecteur a lu le texte jusqu'au bout sans erreur.
  - `entendue: false` en Muet, sur une voix bloquée, sur une lecture impossible (navigateur qui ne sait pas lire), et **pour un texte sans rien à dire**. Raison : la définition reste « l'enfant a entendu quelque chose » ; un texte sans rien à prononcer n'a rien fait entendre, le laisser visible le temps minimal est sans risque, alors que le dire entendu pourrait faire disparaître un texte affiché que personne n'a lu.
- Nouvelle dépendance `onFinDeLaVoixBloquee: () => void` dans `DependancesDeLectureAVoixHaute`, à côté de `onVoixBloquee`.
- État interne `voixBloqueeSignalee` (existant), désormais remis à faux :
  - `onVoixBloquee` est appelé au premier blocage, puis plus tant que la voix reste bloquée (décision 79.5 : jamais deux messages) ;
  - `onFinDeLaVoixBloquee` est appelé, une fois, quand la voix bloquée signalée prend fin : **lecture entendue** (décision 79.5) ou **`passerEnMuet`** (décision 79.6) ;
  - après une fin, un nouveau blocage appelle de nouveau `onVoixBloquee` (voir question 79.10).

### Apprentissage : fonctions pures (`apprentissage/domain/`)

```ts
type AttenteAvantLEcranSuivant =
  | { genre: "aucune" }                                      // parole entendue
  | { genre: "dureeDAffichageSansVoix"; millisecondes: number } // 79.4
  | { genre: "enfantQuiContinue" };                          // 79.3 : bouton « Continuer »

attenteAvantLEcranSuivant({ entendue, seanceTerminee }): AttenteAvantLEcranSuivant
DUREE_D_AFFICHAGE_SANS_VOIX_MS = 2000
```

| entendue | seanceTerminee | attente |
|---|---|---|
| oui | – | `aucune` |
| non | oui (félicitation de la dernière bonne réponse) | `enfantQuiContinue` |
| non | non (félicitation entre deux questions, dernière bonne réponse d'un exercice qui n'est pas le dernier, annonce du nouveau défi) | `dureeDAffichageSansVoix`, 2000 ms |

Elle ne s'applique qu'aux paroles **suivies d'un écran qui vient seul**. L'étape de leçon attend déjà l'enfant (79.2, inchangé) ; l'indication du geste n'a pas d'écran suivant (79.9).

```ts
consigneAffichee(exercice: Exercice): string | undefined
```

Rend `exercice.consigne` si `consigneLueAuDebut(exercice.type)`, sinon `undefined` (dictée, poésie à mémoriser, décision 79.8). Les consignes par défaut de `classer`, `ordre` et `trous` sont déjà posées par le Catalogue : aucune règle à ajouter ici. Une consigne absente donne `undefined`.

## Invariants

1. Un seul message de voix bloquée à la fois : `onVoixBloquee` n'est jamais appelé deux fois sans `onFinDeLaVoixBloquee` entre les deux.
2. `onFinDeLaVoixBloquee` n'est appelé que si un blocage a été signalé.
3. Une parole n'est entendue que si elle a été lue ; Muet n'entend jamais rien.
4. Sans voix, la séance terminée n'affiche la fin de la séance que quand l'enfant continue ; avec la voix, rien ne change.
5. La consigne affichée ne dépend que de l'exercice en cours : elle change avec l'exercice et n'existe plus à la fin de la séance.

## Événements

Aucun événement de domaine (rien n'est enregistré). Les deux signaux `onVoixBloquee` et `onFinDeLaVoixBloquee` sont des rappels du service Voix vers l'affichage, pas des faits métier.

## Emplacement

| Fichier | Action |
|---|---|
| `supabase/functions/_shared/voix/domain/lecture-a-voix-haute.ts` | modifier : `lire` rend `ParoleEntendue`, dépendance `onFinDeLaVoixBloquee`, remise à zéro du signalement |
| `supabase/functions/_shared/voix/domain/lecture-a-voix-haute_test.ts` | compléter |
| `supabase/functions/_shared/voix/domain/index.ts` | exporter `ParoleEntendue` |
| `supabase/functions/_shared/apprentissage/domain/attente-avant-l-ecran-suivant.ts` (+ `_test.ts`) | créer : `attenteAvantLEcranSuivant`, `AttenteAvantLEcranSuivant`, `DUREE_D_AFFICHAGE_SANS_VOIX_MS` |
| `supabase/functions/_shared/apprentissage/domain/exercices/consigne-affichee.ts` (+ `_test.ts`) | créer : `consigneAffichee` |
| `supabase/functions/_shared/apprentissage/domain/index.ts` | exporter les trois |
| `src/voix/useVoix.ts`, `src/seance/` | câblage seulement (aucune règle) |

## Questions ouvertes

- **79.10** La définition actuelle de Voix bloquée dit « prévenu **une fois par ouverture de l'application** ». Avec 79.5 (« visible tant que la voix est bloquée »), si la voix revient puis se bloque de nouveau dans la même ouverture, le message réapparaît-il ? (oui / non ; le modèle suit « oui », changement d'une ligne si c'est non.)
- **79.11** Sans voix, l'**invitation à jouer après les étapes de la leçon** (avant le premier exercice) reste-t-elle aussi visible environ 2 s avant que l'exercice vienne seul, comme l'annonce du nouveau défi ? (oui / non ; 79.4 ne cite que la félicitation entre deux questions et l'annonce du nouveau défi.)
