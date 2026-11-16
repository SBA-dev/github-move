# Story #183 : modèle du domaine

Contexte : **Apprentissage** (agrégat `Seance`). Story surtout d'interface : barre du haut, barre d'action, pause. Aucun autre contexte touché, aucune donnée nouvelle sur l'enfant, rien d'enregistré.

## Termes

| Terme | Statut |
|---|---|
| Séance, Réponse, Je ne sais pas, Étape de leçon, Avancement de la séance, Personnage guide, Consigne affichée, Relire la consigne | existants |
| Première réponse de la séance | nouveau (à valider) |
| Pause | nouveau (à valider). « Feuille de pause » reste un mot d'interface. Ne pas confondre avec **Durée d'affichage sans voix**, qui interdit « pause » comme synonyme |
| Réécouter | utilisé depuis #16, jamais défini au glossaire : complément ajouté (à valider), sans redéfinition |
| Barre du haut, barre d'action, barre de progression, compteur « 2 / 6 », pastille, bulle | **mots d'interface**, hors glossaire (comme « récipient », décision 30). La barre de progression et le compteur affichent l'**Avancement de la séance** existant (`Seance.avancement()`) : aucune règle nouvelle |
| « Compteur » | déjà employé au glossaire pour le compteur des erreurs corrigées pour de bon (profil) et pour le blocage de la réinitialisation. Dans cette story, il reste un mot d'interface : dans le domaine on dit **Avancement de la séance** |

## Modèle : la requête du domaine

Aucune requête n'existe aujourd'hui sur `Seance` pour savoir si une réponse a été donnée. Le champ privé `dernierExerciceRepondu` s'en approche, mais il n'est pas public et « Je ne sais pas » ne le remplit pas.

Requête à ajouter, en lecture seule :

```
Seance.aRecuUneReponse(): boolean
```

- Fausse à la création (`commencer`) et pendant les étapes de leçon (`continuer` n'est pas une réponse).
- Vraie dès la première réponse corrigée : `repondre(…)` (juste ou fausse), ou `taper(…)` quand il complète le mot de la dictée (une lettre seule ne compte pas : `taper` ne rend alors pas de résultat).
- Ne redevient jamais fausse pendant la séance.
- `direJeNeSaisPas(…)` : selon la réponse à la question 1.
- Fluence : la première réponse pendant le chrono compte comme une réponse (`repondre`). Le seul démarrage du chrono (`demarrerLaFluence`) : question 2.

Aucun invariant nouveau, aucune commande, aucun événement, aucune erreur métier. L'agrégat ne change pas de forme. La requête est exportée par `domain/index.ts` (la classe `Seance` l'est déjà) et lue par le front : elle doit marcher hors ligne.

**Autres séances** (`SeanceDeRevision`, `SeanceDeDefi`, `TestDeDepart`) : aucune n'a cette requête. Si le PO étend la présentation (question 4 de l'issue, ici question 3), chacune recevra la **même** requête `aRecuUneReponse()`, avec la même règle. On ne crée pas de type commun dans cette story.

## Ce qui reste de la présentation (React, sans règle métier)

- La disparition de l'en-tête global pendant la séance, la barre du haut (Retour, nom de la leçon, son), la barre d'action et ses boutons, le personnage guide montré seulement quand il réagit.
- Le choix entre « ouvrir la pause » et « revenir à la page de la leçon » : React lit `aRecuUneReponse()` et ne calcule rien d'autre. Bouton Retour et geste retour suivent la même lecture.
- La pause elle-même : un état d'écran. Elle ne met pas la séance en pause dans le domaine, ne touche ni à l'avancement ni aux erreurs. « Retour à la leçon » perd la séance en cours, comme aujourd'hui.
- Le bouton unique « Réécouter » : relire la consigne ou redire la phrase due après la réponse (`paroleDueApresLaDerniereReponse()`, `aideApresLaDerniereErreur()`, déjà dans le domaine). Le choix dépend de ce qui est montré à l'écran à cet instant (question posée ou réaction du personnage guide). C'est un état d'affichage, pas une règle du domaine.
- La barre de progression et le compteur « 2 / 6 » : rendu de `Seance.avancement()` (questions réussies sur le total).

## Emplacement

- `supabase/functions/_shared/apprentissage/domain/seance.ts` : la requête `aRecuUneReponse()`.
- Tests : `supabase/functions/_shared/apprentissage/domain/seance-premiere-reponse_test.ts` (nom proposé).
- Rien dans `application/` ni `infrastructure/`, aucune migration.

## Questions ouvertes

1. **« Je ne sais pas » compte-t-il comme première réponse ?** Exemple : l'enfant ouvre un exercice, touche « Je ne sais pas » tout de suite, puis Retour. Ouvre-t-on la pause (oui) ou revient-on à la page de la leçon (non) ? Recommandation : **oui**. Le glossaire dit déjà que « Je ne sais pas » est une réponse permise, il coûte une erreur, et l'enfant a commencé à travailler.
2. **Fluence** : le démarrage du chrono, avant toute réponse, suffit-il pour que Retour ouvre la pause ? Recommandation : **non**, seule une réponse compte (même règle partout).
3. Si la présentation s'étend au **test de départ**, à la **révision** et aux **défis** (question 1 de l'issue) : la même règle de première réponse s'applique-t-elle à chacun ? Recommandation : **oui**, avec la même requête sur chaque séance.
4. Pour la **dictée** et `memoriser`, qui n'ont pas de consigne affichée (#79), le bouton unique « Réécouter » garde-t-il pendant une question son comportement d'aujourd'hui (redire ce que dit le personnage guide) ? Recommandation : **oui**, rien ne change pour ces deux types.
