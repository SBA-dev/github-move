# 0038 : Le défi d'une partie du parcours appartient à Apprentissage, enregistré par le serveur seul ; parties en blocs de 5 leçons

**Statut** : Acceptée · 2026-10-29 (réponses du PO aux questions #100.1 à #100.28)

## Contexte

La story #100 ajoute un **défi** à la fin de chaque **partie du parcours** (le « chapitre » de l'issue) : une séance qui mélange des questions des leçons de la partie, sans étoile, sans rien bloquer, rejouable. Il faut décider :
- quel contexte possède le défi : Apprentissage (séances, questions, parcours) ou Motivation (récompenses) ;
- comment on enregistre un défi terminé, alors que l'enfant doit pouvoir le jouer hors ligne ;
- ce qu'est une partie du parcours, alors que le format des leçons (`docs/format-lecons.md`) n'a aucun champ pour cela.

Les mesures sur la bibliothèque (265 leçons, 26 couples matière et classe) écartent les regroupements par section du programme ou par `competence` : 93 % à 99 % des groupes n'auraient qu'une leçon. Un regroupement par domaine du programme donne des parties très inégales (de 2 à 13 leçons). Le PO a aussi décidé (réponse 100.10) que les questions ratées pendant un défi entrent dans la file de révision (#28), et que le grand défi de la matière devient une story à part (#137).

## Décision

1. **Le défi est dans Apprentissage**, comme la séance de révision (#28) et le test de départ (#27). Son ouverture se lit dans le parcours (leçons réussies, test de départ compris), ses questions sont posées seules avec `questionDeRevision`, et il se joue dans le navigateur avec `@domain/apprentissage` (décision 0003), hors ligne compris. Il ne modifie aucune étoile, aucun résultat de la leçon, aucun record de fluence.
2. **Les parties du parcours sont calculées, jamais enregistrées** : des blocs de **5 leçons consécutives** du parcours d'une matière et d'une classe, dans l'`ordre` ; un dernier bloc de 1 ou 2 leçons rejoint le précédent. Toutes les parties ont un défi **sauf la dernière** de la matière, qui attend le grand défi de #137 ; une matière d'une seule partie n'a pas de défi. Ce découpage tient en attendant qu'un **champ du format des leçons** (par exemple `partie`) le remplace, dans une story qui modifiera `docs/format-lecons.md`, le pipeline, le domaine du Catalogue et le test de schéma.
3. **Un défi terminé est écrit par le serveur seul**, dans une table nouvelle **`defis_termines`** (migration additive) : identifiant de la séance de défi, profil, matière, classe (le `Niveau` du domaine), numéro de la partie, jour et heure de fin. On ne garde **ni les leçons du défi, ni les questions, ni les réponses, ni les erreurs**, par minimisation (section RGPD de `CLAUDE.md`) : un défi relevé se reconnaît à (matière, classe, numéro), ses leçons se déduisent de la partie du parcours recalculée, et un défi relevé reste relevé même si la bibliothèque change (réponse 100.15), ce qui ne demande pas les leçons. Le front envoie le défi joué (questions, tirages, réponses) à l'Edge Function `terminer-le-defi` avec le JWT du parent. Le cas d'usage `TerminerLeDefi` vérifie le rattachement sous RLS, recalcule les parties et l'état du défi (ouvert ou déjà relevé), vérifie les questions et rejoue les réponses, puis écrit avec la clé `service_role`, comme le prévoit la décision 0016, par la fonction d'enregistrement `enregistrer_le_defi_termine` : en `security invoker` (elle garde les droits de l'appelant) et exécutable par `service_role` seul. `anon` et `authenticated` n'ont que la lecture, pour le parent rattaché.
4. **Les questions ratées du défi entrent dans la file de révision** dans le **même enregistrement** que le défi terminé (tout ou rien, version de la file relue en cas de conflit), avec la règle d'une séance (#28). Elles sont calculées par le serveur en rejouant les réponses. L'enregistrement est idempotent par identifiant : un défi renvoyé depuis l'appareil n'est compté qu'une fois.
5. **Motivation lit les défis relevés et n'écrit rien**, comme pour la cabane (décision 32.20) : le front lit `defis_termines` du profil en cours sous RLS et donne à `@domain/motivation` une forme propre (matière, classe, numéro). Motivation en tire la mise en scène de la fin du défi et la section « Mes défis relevés ». Aucune étoile n'est créée. La série, les épisodes, l'objectif du jour et la quête du jour ne lisent pas les défis terminés.

## Options écartées

- **Défi dans Motivation** : Motivation ne corrige pas de réponse et ne lit pas le parcours ; elle aurait dû dupliquer les règles des séances et écrire dans la file de révision d'Apprentissage.
- **Parties par section du programme ou par `competence`** : presque toutes les parties n'auraient qu'une leçon, donc un défi après presque chaque leçon.
- **Parties par domaine du programme** : parties de 2 à 13 leçons, défis très inégaux.
- **Champ `partie` du format des leçons dès #100** : environ 205 leçons à découper à la main, et des changements du format, du pipeline, du Catalogue et du test de schéma ; gardé pour plus tard.
- **Écriture directe par le front sous RLS** : un parent pourrait se donner un défi relevé ou retenir des questions sans revalidation ; contraire à la décision 0016.
- **Enregistrer les réponses du défi** : inutile à l'apprentissage et au suivi (minimisation) ; les questions ratées suffisent, et elles vont dans la file de révision.

## Conséquences

- Le domaine gagne `partiesDuParcours`, `defisDeLaMatiere`, `planDuDefi`, l'agrégat `SeanceDeDefi`, `revaliderLeDefi` et le fait `DefiTermine` ; l'application gagne `TerminerLeDefi` et le port `DefisTermines`.
- La migration de `defis_termines` demande le verrou `base`. Elle ajoute la RLS en lecture pour le parent rattaché, la suppression en cascade avec le profil et l'export du profil (#14), sans les réponses.
- Si la bibliothèque change, les blocs de 5 se déplacent, mais un défi relevé reste relevé (réponse 100.15) : il est identifié par la matière, la classe et le numéro de la partie.
- #137 (grand défi de la matière) viendra à la place de la dernière partie et étendra `defis_termines` par une migration additive.
- Le champ du format qui remplacera les blocs de 5 fera l'objet d'une nouvelle décision, qui remplacera le point 2 de celle-ci.
