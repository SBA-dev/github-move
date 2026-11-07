# Modèle du domaine : issue #183, écran de séance avec une barre du haut et une barre d'action en bas

Contexte : **Apprentissage**. La story est **surtout de la présentation** : l'écran de séance est réorganisé (barre du haut, barre d'action en bas, plus d'en-tête global, personnage guide montré seulement quand il réagit, un seul bouton « Réécouter »). Une seule règle relève du domaine : **le bouton Retour (et le geste retour) ouvre la feuille de pause seulement si la séance a déjà reçu une réponse**. Cette règle se lit dans l'agrégat `Seance` par une petite requête nouvelle, `aRecuUneReponse()`. Aucune commande, aucun événement, aucune migration, aucune Edge Function, aucune donnée d'enfant nouvelle.

État : **à cadrer** (questions 183.1 à 183.9 ci-dessous, avec les questions 1 à 3 de l'issue).

## Contexte

### Pourquoi Apprentissage

- La séance, ses réponses, son avancement et « Je ne sais pas » appartiennent à Apprentissage (`Seance`, `QuestionSuivie`, `ReponseDonnee`).
- Ce que la feuille de pause protège est un fait d'Apprentissage : une séance quittée avant d'être terminée n'est pas gardée (rien n'est enregistré, comme pour la séance de défi « quittée en cours »). La pause évite de perdre par un geste involontaire des réponses déjà données.
- Motivation n'est pas concernée : le personnage guide qui apparaît « quand il réagit » reprend les réactions existantes (`reagirALaReponse`, scène de réponse fausse de #163). Aucune règle de Motivation ne change.

### Ce qui relève du domaine, et ce qui n'en relève pas

| Élément de l'issue | Domaine ou présentation | Source |
|---|---|---|
| Retour ouvre la feuille de pause **à partir de la première réponse** ; avant, il ramène à la page de la leçon | **Domaine** : « la séance a-t-elle reçu une réponse ? » | `Seance.aRecuUneReponse()` (nouveau) |
| Le geste retour du téléphone ou du navigateur suit la même règle | Présentation (navigation), même lecture du domaine | `src/navigation.ts` lit `aRecuUneReponse()` |
| Compteur « 2 / 6 » et fine barre de progression | Présentation d'un fait existant | `Seance.avancement()` (`Avancement` : `questionsReussies`, `total`), inchangé |
| Nom de la leçon sans classe ni matière | Présentation | titre de la `Lecon` (Catalogue), inchangé |
| Plus d'en-tête global, plus de dock pendant la séance | Présentation | `src/Application.tsx` |
| Personnage guide montré seulement quand il réagit | Présentation | réactions existantes de Motivation, inchangées |
| Un seul bouton « Réécouter » (consigne pendant la question, parole du personnage guide après une réponse) | Présentation, mais touche au langage (voir « Termes ») | `useDeroulementDeSeance.ts` |
| Barre d'action (« Valider », « Continuer », « Je ne sais pas ») | Présentation | « Je ne sais pas » reste permis selon le domaine (`jeNeSaisPasPermis`, `jeNeSaisPasPropose`), inchangé |
| Échap ferme la feuille, aucun compte à rebours, aucun reproche | Présentation, accessibilité | — |

### Faits lus

| Fait | Disponible aujourd'hui |
|---|---|
| Avancement de la séance | Oui : `Seance.avancement()` |
| Séance finie (toutes les questions réussies) | Oui : `Seance.estFinie()` |
| La séance a reçu une réponse | **Non exposé**. L'état existe déjà dans l'agrégat : chaque `QuestionSuivie` garde ses `reponses()` (choix, nombre, mot écrit, placement, réponse de fluence, et `{ genre: "jeNeSaisPas" }`), mais la liste des questions est privée (`questions()`). Aucune méthode publique ne le dit. `avancement().questionsReussies > 0` ne suffit pas : une réponse fausse ou « Je ne sais pas » ne fait pas avancer. `erreurs() > 0` ne suffit pas non plus : une première réponse juste ne coûte aucune erreur |

### Communication entre contextes

Aucune relation nouvelle. Tout se passe dans le navigateur, hors ligne compris. Le serveur n'a rien à revalider : la feuille de pause ne change aucun résultat.

## Termes

| Terme | Statut | Remarque |
|---|---|---|
| Séance, Séance complète, Séance d'un exercice, Réponse, Je ne sais pas, Avancement de la séance, Étape de leçon, Fluence, Séance terminée, Fin de la séance, Personnage guide, Consigne affichée, Relire la consigne | existants | Réutilisés sans les redéfinir |
| **Séance qui a reçu une réponse** | **nouveau (à valider)** | Séance dont au moins une question a reçu une réponse (juste, fausse ou choix écarté) ou « Je ne sais pas ». Définition exacte : questions 183.1 à 183.4. Ajouté au glossaire. On évite « séance commencée » : une séance est commencée (`Seance.commencer`) dès l'ouverture de l'écran |
| **Pause de la séance** | **nouveau (à valider), en conflit** | Moment où l'enfant, après la première réponse, demande à quitter la séance : la séance reste en l'état et l'enfant choisit de continuer ou de revenir à la page de la leçon. Rien n'est enregistré. **Conflit** : « pause » est aujourd'hui un synonyme interdit de **Durée d'affichage sans voix** (#79). Question 183.7. Ajouté au glossaire et aux « Conflits à trancher » |
| Feuille de pause | mot d'interface | Le panneau « On fait une pause ? ». Hors glossaire (composant d'écran), comme « en-tête » (Décision n°16) |
| Barre du haut, barre de séance, barre d'action, pastille du compteur | mots d'interface | Hors glossaire |
| « Je continue la leçon », « Retour à la leçon », « On fait une pause ? » | textes d'écran | Pas des termes |
| **Réécouter** | **absent du glossaire, en conflit** | Employé partout (#16, #17, #79) mais jamais défini. La ligne **Relire la consigne** dit « distinct de « Réécouter » » : l'issue fond les deux en un seul bouton. Je n'ajoute qu'une ligne « Réécouter (à valider) » qui le définit selon la décision 6 de l'issue, sans toucher à la ligne « Relire la consigne ». Question 183.8 |
| « progression » | interdit | L'issue dit « barre de progression » : c'est un mot d'interface. Dans le code et les scénarios on dit **Avancement de la séance** (synonyme interdit : progression). Une ligne « complément (#183) » le rappelle au glossaire |
| « Retour » | texte d'écran | Nom accessible du bouton, inchangé |

## Modèle

Pas d'agrégat nouveau. L'agrégat **`Seance`** reçoit une **requête** (lecture seule) ; rien ne change d'état.

```mermaid
classDiagram
  class Seance {
    <<agrégat, existant>>
    avancement() Avancement
    estFinie() boolean
    repondre(reponse) ResultatDeReponse
    taper(lettre) ResultatDeReponse?
    direJeNeSaisPas() AideDonnee
    finirLaFluence()
    continuer()
    aRecuUneReponse() boolean  «nouveau»
  }
  class QuestionSuivie {
    <<existant>>
    reponses() ReponseDonnee[]
  }
  class Avancement {
    <<value object, existant>>
    questionsReussies
    total
  }
  Seance o-- QuestionSuivie : par ses exercices joués
  Seance ..> Avancement
```

### Requête proposée

```ts
// supabase/functions/_shared/apprentissage/domain/seance.ts
aRecuUneReponse(): boolean
```

- **Vrai** dès qu'une question de la séance a reçu une réponse, selon les réponses aux questions 183.1 à 183.4. Avec les recos : un choix touché (juste, faux ou déjà écarté), un nombre validé, un mot écrit en entier en dictée, une étiquette posée (bonne ou mauvaise), un chiffre posé dans une addition posée, une réponse d'un exercice `memoriser`, une réponse pendant le chrono d'une fluence, ou « Je ne sais pas ».
- **Faux** au début de la séance, et tant que l'enfant n'a fait que lire les étapes de leçon (« Continuer »), écouter, relire ou réécouter.
- **Ne revient jamais à faux** pendant la séance.
- Elle se **déduit de l'état existant** (les `reponses()` de chaque question), sans nouveau champ, si les tests le permettent pour tous les types. Elle est donc juste aussi pour une séance reconstituée (`Seance.reconstituer`). Point à vérifier au TDD : les colonnes pas encore posées de l'étape calculer (`colonnePasEncorePosee`, `reponses: () => []`) et les questions de `memoriser`.
- Exportée par `@domain/apprentissage` avec la classe `Seance` (déjà exportée) : rien à ajouter à `index.ts`.

La règle de l'écran se lit alors sans calcul dans React : **Retour ouvre la feuille de pause si `seance.aRecuUneReponse()`**, sinon il ramène à la page de la leçon. Après la dernière bonne réponse, tant que la fin de la séance n'est pas affichée, la séance a reçu une réponse : la feuille s'ouvre (question 183.5). La fin de la séance n'a pas de barre du haut de séance : elle garde ses propres boutons (présentation).

Si le PO étend la présentation au test de départ, à la révision et aux défis (question 1 de l'issue), la même requête est ajoutée, avec le même nom, à `SeanceDeRevision` et `SeanceDeDefi` (par `QuestionsEnCours`, qui garde déjà les questions et leurs réponses) et à `TestDeDepart`.

### Commandes, événements, erreurs

- **Aucune commande** : la pause ne change rien à la séance. « Je continue la leçon » ferme la feuille ; « Retour à la leçon » quitte l'écran comme aujourd'hui (la séance n'est pas terminée, donc rien n'est enregistré).
- **Aucun événement de domaine.** On n'enregistre ni la pause ni la séance quittée.
- **Aucune erreur métier nouvelle.**

### Ce qui reste dans `src/` (affichage, aucune règle)

Barre du haut (flèche Retour 44 px, nom de la leçon sur deux lignes au plus, son), fine barre et compteur « 2 / 6 » tirés de `avancement()` (le rôle `progressbar` et ses valeurs restent), feuille de pause (« Je continue la leçon » en choix principal, Échap la ferme, pas de compte à rebours, apparition sans glissement en mouvements réduits), barre d'action en bas, retrait de `EnTete` pendant la séance, personnage guide montré à la place de la bulle seulement quand il réagit, bouton « Réécouter » unique qui relit la consigne pendant une question et redit la parole du personnage guide après une réponse. Le geste retour (`popstate` dans `src/navigation.ts`) appelle la même lecture que le bouton.

## Invariants

1. **La règle de la pause vient du domaine.** React ne décide jamais, par exemple d'après le compteur ou l'état d'un exercice, si la séance a reçu une réponse : il lit `aRecuUneReponse()`.
2. **Une réponse donnée ne s'efface pas.** `aRecuUneReponse()` ne revient jamais à faux pendant la séance.
3. **La pause ne change rien.** Ni les erreurs, ni les étoiles, ni l'avancement, ni la question en cours, ni la file de révision. Fermer la feuille rend la séance exactement comme elle était.
4. **Jamais punitive** : aucun reproche, aucun compte à rebours, rien qui fasse peur de perdre (règle « retour d'erreur jamais punitif », `CLAUDE.md`).
5. **Pas de temps d'écran** : la pause n'est ni proposée par l'application, ni limitée dans le temps. Elle n'existe que parce que l'enfant a touché Retour.
6. **Même règle pour le bouton et pour le geste retour.**

## Événements

Aucun événement nouveau. #183 **lit** :

| Fait lu | Source |
|---|---|
| La séance a reçu une réponse | `Seance.aRecuUneReponse()` (nouveau) |
| Avancement de la séance | `Seance.avancement()` (existant) |

## Comportements unitaires du domaine (pour le TDD)

Fichier proposé : `supabase/functions/_shared/apprentissage/domain/seance-a-recu-une-reponse_test.ts`.

1. Une séance qui vient de commencer n'a reçu aucune réponse.
2. Une séance complète dont l'enfant a lu des étapes de leçon (`continuer`) sans répondre n'a reçu aucune réponse (selon 183.1).
3. Après une réponse juste à la première question : a reçu une réponse.
4. Après une réponse fausse : a reçu une réponse (l'avancement est toujours à 0).
5. Après « Je ne sais pas » seul : a reçu une réponse (selon 183.2).
6. Dictée : une lettre tapée, mot incomplet → pas encore (selon 183.3) ; le mot écrit en entier → a reçu une réponse.
7. `classer` / `ordre` : un mauvais placement → a reçu une réponse.
8. Addition posée : un chiffre posé → a reçu une réponse.
9. Fluence : chrono démarré sans réponse → pas encore ; une réponse pendant le chrono → a reçu une réponse (selon 183.4).
10. `memoriser` : une réponse → a reçu une réponse.
11. Après la dernière bonne réponse (séance finie) : a reçu une réponse.
12. Séance reconstituée avec des réponses : a reçu une réponse.

## Emplacement

Aucune migration, aucune table, aucune Edge Function, aucun `application/` ni `infrastructure/`.

```
supabase/functions/_shared/apprentissage/domain/
  seance.ts                                 # + aRecuUneReponse()
  seance-a-recu-une-reponse_test.ts         # comportements ci-dessus
src/Application.tsx                         # pas d'EnTete pendant la séance
src/navigation.ts                           # geste retour : même lecture que le bouton
src/seance/EcranDeSeance.tsx                # barre du haut, feuille de pause, barre d'action
src/seance/RecipientDeProgression.tsx       # fine barre et compteur (même avancement)
src/seance/BulleDuPersonnageGuide.tsx       # consigne pleine largeur, bouton Réécouter unique
src/seance/exercices/*                      # « Valider », « Je ne sais pas » remontés (selon la question 3 de l'issue)
src/styles.css
```

**Données d'enfants** : aucune nouvelle. La pause n'est ni enregistrée ni envoyée. Rien n'est envoyé à l'IA.

Glossaire : ajouts « Séance qui a reçu une réponse (à valider) », « Pause de la séance (à valider) », « Réécouter (à valider) », « Avancement de la séance, complément (#183) », et le conflit n°13 « pause ». Context map : rien à changer.

## Questions ouvertes

Les questions 1 à 3 de l'issue (test de départ, révision et défis ; tablette en paysage ; types d'exercices de la barre d'action) restent posées au PO telles quelles. Elles ne changent le domaine que pour la question 1 (même requête sur `SeanceDeRevision`, `SeanceDeDefi`, `TestDeDepart`).

**183.1 Lire une étape de leçon (« Continuer ») compte-t-il comme une réponse ?** Exemple : Léa ouvre « Leçon et tous les jeux », lit 3 étapes de leçon, puis touche Retour.
- **Reco A** : non. Retour la ramène directement à la page de la leçon. Raison : une étape de leçon n'est pas une question (elle ne compte pas dans l'avancement), et la relire ne coûte rien.
- B : oui, la feuille de pause s'ouvre.

**183.2 « Je ne sais pas » compte-t-il comme une réponse ?** Exemple : Léa touche « Je ne sais pas » à la première question, puis Retour.
- **Reco A** : oui, la feuille s'ouvre. Raison : le glossaire dit déjà que « Je ne sais pas » est une réponse permise, et il peut coûter une erreur.
- B : non.

**183.3 Dictée : une lettre tapée suffit-elle ?** Exemple : Léa a tapé « m », « a » d'un mot de 6 lettres, puis touche Retour.
- **Reco A** : non, seulement le mot écrit en entier (c'est la réponse corrigée). Raison : même règle que le clavier de cristaux, où les chiffres tapés ne comptent qu'après « Valider ».
- B : oui, dès la première lettre.

**183.4 Fluence : démarrer le chrono suffit-il ?** Exemple : Léa démarre la fluence, n'a encore rien répondu, et touche Retour.
- **Reco A** : non, seulement la première réponse pendant le chrono.
- B : oui, dès que le chrono démarre.

**183.5 Après la dernière bonne réponse, avant la fin de la séance, Retour ouvre-t-il la feuille ?** Exemple : Léa réussit la dernière question ; la félicitation est affichée et elle n'a pas encore touché « Continuer ».
- **Reco A** : oui. Raison : la séance n'est pas encore terminée ni enregistrée ; quitter là ferait perdre les étoiles.
- B : non, Retour mène directement à la page de la leçon.

**183.6 Pendant le chrono d'une fluence, la feuille de pause arrête-t-elle le chrono ?** Exemple : Léa a 20 secondes restantes et touche Retour ; elle lit la feuille pendant 10 secondes, puis choisit « Je continue la leçon ».
- **Reco A** : non, le chrono continue (le domaine n'a aucune notion de chrono arrêté, et une fluence se rejoue).
- B : oui, le chrono s'arrête tant que la feuille est ouverte (il faudrait alors une commande nouvelle, par exemple `suspendreLaFluence`).

**183.7 Le mot « pause » : le garde-t-on ?** « pause » est aujourd'hui un synonyme interdit de **Durée d'affichage sans voix** (#79).
- **Reco A** : oui. « Pause de la séance » devient un terme (à valider), et « pause » seul reste interdit pour la durée d'affichage sans voix. Le texte d'écran « On fait une pause ? » ne change pas.
- B : on nomme le concept autrement dans le code et les scénarios (« Demande de quitter la séance »), « On fait une pause ? » restant un simple texte d'écran.

**183.8 « Relire la consigne » disparaît-il comme commande à part ?** L'issue fond « Réécouter » et « Relire la consigne » en un seul bouton « Réécouter ». La ligne du glossaire « Relire la consigne » dit « distinct de « Réécouter » » ; je ne la modifie pas.
- **Reco A** : oui. **Réécouter** relit la consigne pendant une question et redit la parole du personnage guide après une réponse ; la ligne « Relire la consigne » est marquée remplacée par #183 à la clôture de la story.
- B : « Relire la consigne » reste un terme du domaine (ce que fait « Réécouter » pendant une question), sans bouton à lui.

**183.9 « Retour à la leçon » : faut-il dire à l'enfant que ses réponses ne seront pas gardées ?** Exemple : Léa a répondu à 4 questions sur 6 et choisit « Retour à la leçon » ; quand elle revient, la séance repart du début.
- **Reco A** : non, la feuille dit seulement « On fait une pause ? » et ses deux choix, sans avertissement (décision 3 de l'issue : aucun reproche). La séance repart du début, comme aujourd'hui.
- B : une phrase douce sous le titre (par exemple « Si tu reviens à la leçon, tu recommenceras ce jeu. »).
