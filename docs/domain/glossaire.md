# Glossaire : langage ubiquitaire

Ce glossaire est **la référence** pour le code, les tests, les scénarios Gherkin et les échanges.
Il est mis à jour par l'agent `domain-modeler` et validé par le PO. Un terme marqué `(à valider)` n'est pas encore confirmé.

Première version : elle reprend les termes de l'application existante (`app/`) et du format des leçons (`docs/format-lecons.md`).
- Les termes du format des leçons sont confirmés : ils sont déjà publiés et utilisés par 265 leçons.
- Les autres sont `(à valider)`.

**Dans le code**, un terme s'écrit sans accent, en PascalCase pour les types (`Lecon`, `ProfilEnfant`, `Etoile`) et en camelCase pour les variables (`profilEnfant`).
Le glossaire garde l'orthographe française.

## Catalogue pédagogique

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Programme officiel | Texte de l'Éducation nationale qui fixe ce qu'un élève apprend à chaque niveau. Découpé en **sections**. | Catalogue pédagogique | curriculum, référentiel |
| Section du programme | Partie identifiée d'un programme officiel (`programme.section`), à laquelle se rattache chaque leçon. | Catalogue pédagogique | chapitre, rubrique |
| Citation | Phrase recopiée **mot pour mot** d'un programme officiel ou d'un guide fondamental, qui justifie une leçon. | Catalogue pédagogique | extrait libre, résumé |
| Guide fondamental | Guide Eduscol pour l'enseignement (ex. « lecture et écriture au CP »), sur lequel s'appuie la progression d'une leçon. | Catalogue pédagogique | guide (seul, voir conflits), manuel |
| Matière | Domaine enseigné : `francais`, `maths`, `sciences`, `histoire` (histoire et géographie), `anglais`, `emc`. | Catalogue pédagogique | discipline, sujet, cours |
| Niveau | Classe de l'élève : `CP`, `CE1`, `CE2`, `CM1`, `CM2`. | Catalogue pédagogique | classe (dans le code), grade, année |
| Leçon | Unité d'apprentissage d'une matière et d'un niveau : des étapes expliquées, puis des exercices. | Catalogue pédagogique | cours, chapitre, module |
| Étape de leçon | Explication courte, lue à voix haute avant les exercices (champ `lecon`). | Catalogue pédagogique | slide, page |
| Exercice | Activité notée d'une leçon. Son **type** fixe la mécanique : `bulles`, `classer`, `dictee`, `ordre`, `trous`, `conjugaison`, `lecture`, `memoriser`, `addition`, `calcul`, `fluence`, `ecoute`, `boite`, `barres`. | Catalogue pédagogique | question, quiz, activité |
| Question | Un item à résoudre à l'intérieur d'un exercice. | Catalogue pédagogique | exercice (pour l'item) |
| Ordre | Position d'une leçon dans le parcours de sa matière et de son niveau. | Catalogue pédagogique | rang, index |
| Compétence | Ce que l'enfant sait faire quand il réussit une leçon (« Je connais les tables de 3 et de 4 »). C'est le nom de son badge. | Catalogue pédagogique | objectif, skill |
| Bibliothèque | Ensemble des leçons préparées à partir des programmes officiels (`bibliotheque.json`). | Catalogue pédagogique | catalogue, base de leçons |
| Leçon personnelle (à valider) | Leçon créée par un parent à partir de son propre texte ou d'une photo, avec l'aide de l'IA. | Catalogue pédagogique | leçon custom, leçon adulte |

## Apprentissage

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Séance (à valider) | Une partie jouée d'une leçon par un enfant, du début à l'écran de fin. | Apprentissage | partie, session, tentative |
| Réponse (à valider) | Ce que l'enfant propose à une question. Elle est juste ou fausse. « Je ne sais pas » est une réponse permise. | Apprentissage | saisie, essai |
| Erreur (à valider) | Réponse fausse à une question pendant une séance. Le nombre d'erreurs fixe les étoiles gagnées. | Apprentissage | faute, échec |
| Étoile | Récompense d'une séance, de 1 à 3 : 3 sans erreur, 2 avec 1 à 3 erreurs, 1 au-delà. Une leçon garde son meilleur score. | Apprentissage | point, note, score |
| Leçon réussie (à valider) | Leçon pour laquelle l'enfant a gagné au moins 1 étoile. | Apprentissage | leçon terminée, faite |
| Leçon acquise (à valider) | Leçon réussie avec au moins 2 étoiles, ou validée par le test de départ. | Apprentissage | maîtrisée, validée |
| Parcours | Suite ordonnée des leçons d'une matière pour le niveau de l'enfant. | Apprentissage | chemin, programme, carte |
| Leçon verrouillée | Leçon du parcours que l'enfant ne peut pas encore commencer, parce que la précédente n'est pas réussie. | Apprentissage | bloquée, fermée |
| Parcours libre | Réglage qui ouvre toutes les leçons du parcours. L'ordre conseillé reste affiché. | Apprentissage | mode libre, déverrouillage |
| Test de départ (à valider) | Série de questions de français et de maths, jusqu'au niveau de l'enfant, pour savoir où commencer. Il s'arrête après 3 erreurs de suite. | Apprentissage | évaluation, examen, test (seul) |
| Révision (à valider) | Séance qui reprend les questions ratées dont la date de révision est arrivée (10 au plus). | Apprentissage | rattrapage, revoir |
| Leçon des classes d'avant (à valider) | Leçon d'un niveau inférieur, proposée sans verrou pour réviser. | Apprentissage | ancienne leçon |

## Motivation

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Univers | Habillage choisi par l'enfant (princesses, animaux, sports, police, pompiers, danse). Il ne change ni le contenu ni les règles. | Motivation | thème, monde, skin |
| Personnage guide (à valider) | Personnage de l'univers qui lit les consignes et encourage l'enfant (Noisette, Lumi, Coach Léo…). | Motivation | mascotte, guide (seul, voir conflits) |
| Série (à valider) | Nombre de jours consécutifs avec au moins une séance, jusqu'à aujourd'hui ou hier. | Motivation | streak, flamme |
| Badge (à valider) | Récompense liée à une compétence, gagnée avec au moins 2 étoiles sur la leçon. | Motivation | trophée, médaille |
| Cabane (à valider) | Décor que l'enfant remplit d'objets débloqués par paliers d'étoiles (3, 6, 10… 75). | Motivation | maison, collection |
| Épisode (à valider) | Chapitre de l'histoire de l'univers. Un nouvel épisode s'ouvre à chaque jour de séance. | Motivation | chapitre, histoire, niveau |

## Famille

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Parent (à valider) | Adulte titulaire du compte. Il crée et règle les profils enfants et consulte leur suivi. | Famille | utilisateur, adulte (voir conflits), tuteur, compte |
| Compte famille (à valider) | Compte du parent, auquel sont rattachés les profils enfants. | Famille | compte utilisateur |
| Profil enfant | Enfant qui apprend : prénom ou pseudo, niveau, univers et réglages. Il n'a ni compte, ni e-mail, ni mot de passe. | Famille | élève, utilisateur, joueur, compte enfant |
| Réglages (à valider) | Préférences d'un profil enfant : mode dys, tout lire à voix haute, parcours libre, clavier, temps d'écran maximum, langue du parent. | Famille | paramètres, options |
| Mode dys | Réglage qui adapte l'affichage pour les enfants dyslexiques (police, espacement). | Famille | mode dyslexie, accessibilité |
| Temps d'écran (à valider) | Durée de jeu maximale par jour fixée par le parent. Au-delà, une pause s'affiche. | Famille | limite, quota |
| Contrôle parental (à valider) | Question à laquelle seul un adulte sait répondre, qui protège l'espace parent. | Famille | code, verrou, mot de passe |

## Accompagnement

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Suivi (à valider) | Vue du parent sur la progression d'un enfant : leçons réussies, étoiles, compétences, enregistrements. | Accompagnement | tableau de bord, dashboard, statistiques |
| Rapport de la semaine (à valider) | Synthèse hebdomadaire du suivi, avec des conseils au parent. | Accompagnement | bilan, récap |
| Carte des compétences (à valider) | État de chaque compétence d'un enfant : à faire, en cours, acquise. | Accompagnement | skill map |
| Devoirs (à valider) | Leçons choisies par le parent pour un enfant, mises en avant dans « Aujourd'hui ». | Accompagnement | missions, tâches, assignations |
| Mots de la semaine (à valider) | Liste de mots donnée par le parent pour préparer une dictée à une date fixée. Un entraînement quotidien en propose 5. | Accompagnement | dictée de la semaine, liste |
| Enregistrement de lecture (à valider) | Audio de l'enfant qui lit à voix haute, écoutable par le parent. Il expire au bout de 30 jours. | Accompagnement | audio, voix, fichier |

## Conflits à trancher

1. **« Guide »** désigne aujourd'hui deux choses : le personnage de l'univers (`W.guide` dans `app.js`) et le guide fondamental d'Eduscol (champ `guide` d'une leçon). Proposition : **Personnage guide** pour le premier, **Guide fondamental** pour le second, et jamais « guide » seul.
2. **« Adulte » ou « Parent »** : l'application parle d'« espace adulte » parce qu'un enseignant ou un proche peut aussi l'utiliser. Proposition : **Parent** dans le domaine, et l'interface peut garder « Espace parent ». Faut-il prévoir un rôle Enseignant ?
3. **« Étoile »** est aussi le nom de l'« Étoile du savoir » dans l'histoire. Proposition : **Étoile** reste la récompense. L'objet de l'histoire n'est pas un terme du domaine.
4. **« Test »** : on dit toujours **Test de départ**, pour ne pas confondre avec les tests logiciels.
5. **« Réussie » ou « acquise »** : faut-il garder les deux seuils (1 étoile pour ouvrir la leçon suivante, 2 étoiles pour la compétence) ?
6. **« Devoirs » et « Mots de la semaine »** : deux notions distinctes, ou les mots de la semaine sont-ils un type de devoir ?
