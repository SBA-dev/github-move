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
| Guide fondamental | Guide Eduscol pour l'enseignement (ex. « lecture et écriture au CP »), sur lequel s'appuie la progression d'une leçon. | Catalogue pédagogique | guide (seul), manuel |
| Matière | Domaine enseigné : `francais`, `maths`, `sciences`, `histoire` (histoire et géographie), `anglais`, `emc`. | Catalogue pédagogique | discipline, sujet, cours |
| Niveau | Classe de l'élève : `CP`, `CE1`, `CE2`, `CM1`, `CM2`. | Catalogue pédagogique | classe (dans le code), grade, année |
| Leçon | Unité d'apprentissage d'une matière et d'un niveau : des étapes expliquées, puis des exercices. | Catalogue pédagogique | cours, chapitre, module |
| Consigne | Texte qui dit à l'enfant ce qu'il doit faire dans un exercice (champ `consigne`). Il est lu à voix haute dès qu'il s'affiche. | Catalogue pédagogique | énoncé, instruction |
| Étape de leçon | Explication courte, lue à voix haute avant les exercices (champ `lecon`). | Catalogue pédagogique | slide, page |
| Exercice | Activité notée d'une leçon. Son **type** fixe la mécanique : `bulles`, `classer`, `dictee`, `ordre`, `trous`, `conjugaison`, `lecture`, `memoriser`, `addition`, `calcul`, `fluence`, `ecoute`, `boite`, `barres`. | Catalogue pédagogique | question, quiz, activité |
| Question | Un item à résoudre à l'intérieur d'un exercice. | Catalogue pédagogique | exercice (pour l'item) |
| Ordre | Position d'une leçon dans le parcours de sa matière et de son niveau. | Catalogue pédagogique | rang, index |
| Compétence | Ce que l'enfant sait faire quand il réussit une leçon (« Je connais les tables de 3 et de 4 »). C'est le nom de son badge. | Catalogue pédagogique | objectif, skill |
| Bibliothèque | Ensemble des leçons préparées à partir des programmes officiels (`bibliotheque.json`). | Catalogue pédagogique | catalogue, base de leçons |

## Apprentissage

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Séance (à valider) | Une partie jouée d'une leçon par un enfant, du début à l'écran de fin. | Apprentissage | partie, session, tentative |
| Réponse (à valider) | Ce que l'enfant propose à une question. Elle est juste ou fausse. « Je ne sais pas » est une réponse permise. | Apprentissage | saisie, essai |
| Erreur (à valider) | Réponse fausse à une question pendant une séance. Le nombre d'erreurs fixe les étoiles gagnées. | Apprentissage | faute, échec |
| Étoile | Récompense d'une séance, de 1 à 3 : 3 sans erreur, 2 avec 1 à 3 erreurs, 1 au-delà. Une leçon garde son meilleur score. | Apprentissage | point, note, score |
| Leçon réussie | Leçon pour laquelle l'enfant a gagné au moins 1 étoile. | Apprentissage | leçon terminée, faite |
| Leçon acquise | Leçon réussie avec au moins 2 étoiles, ou validée par le test de départ. | Apprentissage | maîtrisée, validée |
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
| Personnage guide | Personnage de l'univers qui lit les consignes et encourage l'enfant (Noisette, Lumi, Coach Léo…). | Motivation | mascotte, guide (seul) |
| Série (à valider) | Nombre de jours consécutifs avec au moins une séance, jusqu'à aujourd'hui ou hier. | Motivation | streak, flamme |
| Badge (à valider) | Récompense liée à une compétence, gagnée avec au moins 2 étoiles sur la leçon. | Motivation | trophée, médaille |
| Cabane (à valider) | Décor que l'enfant remplit d'objets débloqués par paliers d'étoiles (3, 6, 10… 75). | Motivation | maison, collection |
| Épisode (à valider) | Chapitre de l'histoire de l'univers. Un nouvel épisode s'ouvre à chaque jour de séance. | Motivation | chapitre, histoire, niveau |
| Titre du personnage guide (à valider) | Qualité qui suit le nom du personnage guide (Noisette, « l'écureuil savant »). | Motivation | surnom, rôle |
| Royaume (à valider) | Lieu de l'univers où vit le personnage guide (« la Forêt des Savanturiers »). | Motivation | monde, pays |
| Humeur du personnage guide (à valider) | Attitude montrée par le personnage guide : `content` (par défaut), `reflechit` (après une erreur, il penche la tête), `applaudit` (il saute). | Motivation | émotion, état, mood |
| Félicitation (à valider) | Phrase qui salue une bonne réponse : une félicitation commune (« Bravo ! ») ou une expression du personnage guide. | Motivation | compliment, praise |
| Expression du personnage guide (à valider) | Félicitation propre à un personnage guide (Noisette : « Youpi ! »). | Motivation | cri, réplique |
| Encouragement (à valider) | Phrase dite après une erreur, jamais punitive (« Pas grave, on réessaie ! »). | Motivation | reproche, oops |
| Caractère de la voix (à valider) | Voix féminine ou masculine, hauteur et rythme propres à un personnage guide. Sa forme est définie par le sous-domaine Voix, ses valeurs sont fournies par Motivation pour chaque personnage guide (décision 0008). | Motivation | style, timbre, sexe de la voix |

## Famille

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Parent | Adulte qui a un compte et qui est rattaché à un ou plusieurs profils enfants. Il crée et règle les profils, donne les devoirs et consulte le suivi. Il ne voit **que les enfants auxquels il est rattaché**. Il n'y a pas d'autre rôle adulte. | Famille | utilisateur, adulte, enseignant, tuteur, compte |
| Rattachement (à valider) | Lien entre un parent et un profil enfant, qui donne au parent l'accès à ce profil. Un profil enfant a **un ou deux parents**. | Famille | partage, lien, accès |
| Invitation (à valider) | Lien communiqué par un parent pour qu'un second parent se rattache à un profil enfant. | Famille | code, parrainage |
| Profil enfant | Enfant qui apprend : prénom ou pseudo, niveau, univers et réglages. Il n'a ni compte, ni e-mail, ni mot de passe. | Famille | élève, utilisateur, joueur, compte enfant |
| Réglages (à valider) | Préférences d'un profil enfant : mode dys, tout lire à voix haute, parcours libre, clavier, langue du parent. | Famille | paramètres, options |
| Mode dys | Réglage qui adapte l'affichage pour les enfants dyslexiques (police, espacement). | Famille | mode dyslexie, accessibilité |
| Contrôle parental (à valider) | Question à laquelle seul un adulte sait répondre, qui protège l'espace parent. | Famille | code, verrou, mot de passe |
| Connexion du parent (à valider) | État d'un appareil sur lequel un parent est reconnu. Elle est obligatoire pour utiliser l'application et reste ouverte jusqu'à la déconnexion. | Famille | session, login |
| Lien de connexion (à valider) | Lien envoyé par e-mail au parent, qui ouvre la connexion du parent. Il vaut 1 heure et sert une seule fois. L'interface peut dire « lien magique ». | Famille | lien (seul), code de connexion, mot de passe |
| Code de connexion (à valider) | Code de 6 chiffres, dans le même e-mail que le lien de connexion, que le parent saisit sur l'appareil qui a fait la demande pour ouvrir la connexion du parent. Même durée (1 heure) et même usage unique que le lien. | Famille | code (seul), mot de passe, code PIN, lien de connexion |
| E-mail de connexion (à valider) | E-mail que reçoit le parent quand il demande à se connecter : sujet et texte en français, qui contiennent le lien de connexion et le code de connexion de la même demande. Composé par le domaine Famille (décision 0011) ; il n'utilise que l'adresse du parent. | Famille | courriel, courriel de connexion, mail, message, e-mail magique, OTP, modèle d'e-mail |
| Déconnexion (à valider) | Fin de la connexion du parent sur un appareil, faite depuis l'espace parent. Elle ne ferme pas les autres appareils. Plus aucune donnée de la famille n'y reste visible. | Famille | logout |
| Appareil (à valider) | Tablette, téléphone ou ordinateur où l'application est ouverte. Certaines préférences y sont mémorisées (Son/Muet ; voix imposée au lot 2). | Famille (utilisé partout) | device, navigateur, poste |

## Accompagnement

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Suivi (à valider) | Vue du parent sur la progression d'un enfant : leçons réussies, étoiles, compétences, enregistrements. | Accompagnement | tableau de bord, dashboard, statistiques |
| Rapport de la semaine (à valider) | Synthèse hebdomadaire du suivi, avec des conseils au parent. | Accompagnement | bilan, récap |
| Carte des compétences (à valider) | État de chaque compétence d'un enfant : à faire, en cours, acquise. | Accompagnement | skill map |
| Devoir | Travail que le parent donne à un enfant, mis en avant dans « Aujourd'hui ». Deux sortes : une **leçon à faire** ou des **mots de la semaine**. | Accompagnement | mission, tâche, assignation |
| Leçon à faire (à valider) | Devoir qui demande de faire une leçon de la bibliothèque ou une leçon personnelle. | Accompagnement | leçon imposée |
| Mots de la semaine | Devoir qui prépare une dictée : une liste de mots et une date de dictée. Chaque jour, l'entraînement en propose 5. | Accompagnement | dictée de la semaine, liste de mots |
| Leçon personnelle (à valider) | Leçon créée par un parent à partir de son propre texte ou d'une photo, avec l'aide de l'IA. Elle n'est visible que dans sa famille. | Accompagnement | leçon custom, leçon adulte |
| Enregistrement de lecture (à valider) | Audio de l'enfant qui lit à voix haute, écoutable par le parent. Il expire au bout de 30 jours. | Accompagnement | audio, voix, fichier |

## Voix (sous-domaine générique)

Sous-domaine décidé à la validation n°1 du lot 1 (décision 0007). Ses termes restent `(à valider)`.

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Lecture à voix haute (à valider) | Le personnage guide lit un texte, phrase par phrase, en surlignant le mot prononcé. | Voix | synthèse, TTS |
| Voix automatique (à valider) | Choix par défaut : la voix française la plus naturelle de l'appareil, adaptée au caractère de la voix du personnage guide. | Voix | voix par défaut |
| Voix imposée (à valider) | Voix de l'appareil choisie par le parent, dans l'espace parent, à la place de la voix automatique. Mémorisée sur l'appareil. Arrive au lot 2. | Voix | voix préférée, voix forcée |
| Muet (à valider) | Choix de l'appareil qui coupe la voix (et les effets sonores, à confirmer avec leur story). Son contraire est « Son ». | Voix | silencieux, mute |
| Voix bloquée (à valider) | Le navigateur refuse de lire alors qu'il sait lire à voix haute. L'enfant est prévenu une fois par ouverture de l'application, sans être bloqué. | Voix | voix cassée, erreur de son |

## Décisions

1. **« Guide »** : on dit **Personnage guide** (le personnage de l'univers) et **Guide fondamental** (le guide Eduscol), jamais « guide » seul. Dans le format JSON des leçons, le champ `guide` désigne le guide fondamental.
2. **Parent** est le seul rôle adulte. Pas de rôle Enseignant.
3. Les deux seuils sont gardés : **réussie** à 1 étoile (ouvre la leçon suivante), **acquise** à 2 étoiles (compétence et badge).
4. Les **mots de la semaine** sont une sorte de **devoir**.
5. Les **leçons personnelles** appartiennent au contexte Accompagnement.
6. **Motivation** est un contexte à part : il réagit aux séances terminées et ne modifie jamais une note.
7. **Pas de temps d'écran** : l'application ne limite pas la durée de jeu. Le terme n'existe pas dans le domaine.
8. **Accès** : un parent ne voit que les profils enfants auxquels il est rattaché. Un profil enfant peut avoir deux parents. Le second parent se rattache par un lien d'invitation communiqué par le premier.
9. **Voix** est un sous-domaine générique (décision 0007), utilisé par Apprentissage, Motivation et Accompagnement.
10. **« Compte »** (story #5) : synonyme interdit de **Parent** dans le domaine. On dit **Parent** et **Connexion du parent** ; l'interface peut dire « ton compte » (proposition appliquée, validation n°1 du lot 1).
11. **« Session »** (story #5) : reste un synonyme interdit de **Séance**. On dit « la connexion reste ouverte » (proposition appliquée).
12. **« Lien magique »** (story #5) : on dit **Lien de connexion** dans le domaine ; « lien magique » est permis dans l'interface (proposition appliquée).
13. **« Code »** (story #5) : jamais seul. On dit **Code de connexion**, **Contrôle parental** ou **Invitation** selon le cas.
14. **« Voix »** (story #7) : désigne la voix de synthèse. L'audio de l'enfant reste un **Enregistrement de lecture** (proposition appliquée). On dit « voix féminine / voix masculine », pas « sexe de la voix ».
15. **« Monde »** (story #6) : « Monde vivant » est le nom du style graphique, pas un terme du domaine (proposition appliquée).
16. **Termes d'interface** hors glossaire (story #6) : paysage, couleur principale, en-tête, mouvements réduits, page de démonstration (proposition appliquée).

## Conflits à trancher

1. **« Étoile »** est aussi le nom de l'« Étoile du savoir » dans l'histoire. Proposition : **Étoile** reste la récompense. L'objet de l'histoire n'est pas un terme du domaine.
2. **« Test »** : on dit toujours **Test de départ**, pour ne pas confondre avec les tests logiciels.

3. **« Courriel »** (story #5, décision 0011) : la décision 0011 dit « courriel de connexion », le glossaire dit « e-mail » partout. Proposition : **E-mail de connexion**, « courriel » interdit (question n°15 de `docs/stories/5/domain-model.md`, à valider par le PO).

Les anciens conflits n°3 à n°7 (compte, session, lien magique, voix, monde) sont tranchés : voir Décisions n°10 à n°15.

## Questions ouvertes (pour `domain-modeler`, story de rattachement)

1. Les deux parents d'un enfant ont-ils les mêmes droits (par exemple supprimer le profil, retirer l'autre parent) ?
2. Combien de temps une invitation reste-t-elle valable, et sert-elle une seule fois ?
3. Deux parents rattachés au même enfant voient-ils aussi leurs autres enfants respectifs ? (Proposition : non. Chaque rattachement est propre à un enfant, ce qui convient aussi aux parents séparés.)
