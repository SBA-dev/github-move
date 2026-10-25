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
| Consigne | Texte qui dit à l'enfant ce qu'il doit faire dans un exercice (champ `consigne`). Il est lu à voix haute dès qu'il s'affiche. Sans `consigne`, le Catalogue donne la consigne par défaut du type (#18). | Catalogue pédagogique | énoncé (seul, voir Décisions n°26), instruction |
| Étape de leçon | Explication courte, lue à voix haute avant les exercices (champ `lecon`). | Catalogue pédagogique | slide, page |
| Exercice | Activité notée d'une leçon. Son **type** fixe la mécanique : `bulles`, `classer`, `dictee`, `ordre`, `trous`, `conjugaison`, `lecture`, `memoriser`, `addition`, `calcul`, `fluence`, `ecoute`, `boite`, `barres`. | Catalogue pédagogique | question, quiz, activité |
| Question | Un item à résoudre à l'intérieur d'un exercice. | Catalogue pédagogique | exercice (pour l'item) |
| Ordre | Position d'une leçon dans le parcours de sa matière et de son niveau. Ne pas confondre avec l'exercice `ordre` (remettre des étiquettes dans l'ordre). | Catalogue pédagogique | rang (pour une leçon, voir Décisions n°25), index |
| Compétence | Ce que l'enfant sait faire quand il réussit une leçon (« Je connais les tables de 3 et de 4 »). C'est le nom de son badge. | Catalogue pédagogique | objectif, skill |
| Bibliothèque | Ensemble des leçons préparées à partir des programmes officiels (`bibliotheque.json`). | Catalogue pédagogique | catalogue, base de leçons |
| Choix | Terme du format (`choix`) : réponses proposées à l'enfant pour une question ; la réponse attendue en fait toujours partie (#17). | Catalogue pédagogique | option, proposition |
| Aide | Terme du format (`aide`) : texte lu par le personnage guide après une erreur ou après « Je ne sais pas ». Sans `aide`, l'aide par défaut du type d'exercice est lue (#23). | Catalogue pédagogique | indice, correction |
| Distracteur | Terme du format (`distracteurs`) : mot faux proposé exprès parmi les choix d'un texte à trous ou d'une conjugaison (#18, #19). | Catalogue pédagogique | piège, leurre |
| Groupe | Terme du format (`groupes`) : catégorie d'un exercice `classer`, avec un `id` et un `nom`. L'interface dit « maison » (#18). | Catalogue pédagogique | maison (dans le code), catégorie, boîte |
| Texte à trous | Texte d'un exercice `trous`, découpé par le Catalogue en segments de texte et en trous ; Apprentissage ne lit jamais les crochets (#18). | Catalogue pédagogique | texte lacunaire |
| Trou | Place d'un **mot attendu** dans un texte à trous (`[mot]` dans le format) (#18). | Catalogue pédagogique | blanc, case vide |
| Mot dicté | Mot d'un exercice `dictee`, seulement dit à voix haute et jamais montré avant d'être bien écrit (#19). | Catalogue pédagogique | mot de dictée, mot de la semaine (c'est un devoir) |
| Phrase d'exemple | Phrase facultative qui situe un mot dicté (`mots[].phrase`), seulement dite (#19). | Catalogue pédagogique | contexte |
| Mot à écouter | Mot ou phrase d'un exercice `ecoute` (`dire`), dit par une voix anglaise et jamais écrit (#17). | Catalogue pédagogique | mot anglais, audio |
| Opération | Calcul à faire, fixe (`operations` : énoncé `q`, résultat `r`, `aide` facultative) ou tiré par un générateur. Peut être une question de calcul sans signe (« Moitié de 10 ») (#20). | Catalogue pédagogique | calcul (pour l'item), exercice |
| Générateur | Terme du format (`generateur`) : règle de tirage des opérations (signe, intervalles, nombre, cible) ou des additions posées (#20). | Catalogue pédagogique | aléatoire, random |
| Poésie | Texte en vers d'un exercice `memoriser` (`titre`, `auteur`, `vers`). L'interface dit aussi « poème » (#22). | Catalogue pédagogique | récitation, texte |
| Chanson | Poésie à chanter (chanson, comptine, reconnue à son titre ou à son auteur) : le personnage guide dit « chante » au lieu de « redis » ou « récite » (#22). | Catalogue pédagogique | air, musique |
| Vers | Terme du format (`vers`) : ligne d'une poésie ou d'une chanson (#22). | Catalogue pédagogique | ligne, phrase |
| Boîte à jetons | Exercice `boite` (guide fondamental du CP) : des jetons entrent ou sortent d'une boîte fermée, l'enfant prévoit combien il y en a, puis on ouvre pour vérifier (#21). | Catalogue pédagogique | boîte (seule) |
| Jeton | Objet compté qui entre dans la boîte à jetons ou en sort (#21). | Catalogue pédagogique | pion, objet |
| Schéma en barres | Exercice `barres` (guide fondamental du CP) : un problème représenté par des barres proportionnelles, sous trois formes (parties et tout, comparaison, parts) (#21). | Catalogue pédagogique | graphique, dessin |
| Énoncé du problème | Texte d'un problème en schéma en barres (champ `enonce`). « Énoncé » seul reste interdit pour la consigne (#21). | Catalogue pédagogique | énoncé (seul), consigne |
| Valeur cherchée | La seule valeur inconnue d'un schéma en barres (`null` dans le format), montrée par « ? » (#21). | Catalogue pédagogique | inconnue, trou |
| Écriture du calcul | Égalité montrée après la bonne réponse d'une boîte à jetons ou d'un schéma en barres (`4 + 2 = 6`, `12 = 3 × 4`) (#21). | Catalogue pédagogique | opération (pour l'égalité), correction |
| Problème en barres | Item d'un schéma en barres (`ProblemeEnBarres`) : un énoncé du problème, une forme (parties et tout, comparaison ou parts) avec sa valeur cherchée, une aide et une phrase réponse facultatives (#21). | Catalogue pédagogique | exercice (pour l'item), question |
| Parties et tout | Forme d'un schéma en barres (guide fondamental) : deux parties forment le tout ; on cherche le tout ou une partie (#21). | Catalogue pédagogique | addition (pour la forme) |
| Comparaison | Forme d'un schéma en barres (guide fondamental) : une grande barre, une petite, et l'écart entre les deux (#21). | Catalogue pédagogique | différence (pour la forme) |
| Parts | Forme d'un schéma en barres (guide fondamental) : un total partagé en parts égales ; on cherche le total, la valeur d'une part ou le nombre de parts (#21). | Catalogue pédagogique | multiplication, division (pour la forme) |
| Phrase réponse | Phrase facultative d'un problème en barres (`phrase`), dite après la bonne réponse, avec `{r}` remplacé par la réponse (« J'ai 6 pommes. ») (#21). | Catalogue pédagogique | conclusion, correction |

## Apprentissage

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Séance | Une leçon jouée par un enfant, de la première étape de leçon (ou du seul exercice choisi) jusqu'à l'écran de fin. Elle est **complète** ou **d'un exercice** (#16). | Apprentissage | partie, session, tentative |
| Séance complète | Séance qui lit toutes les étapes de leçon, puis joue tous les exercices de la leçon, dans l'ordre. Interface : « Leçon et tous les jeux » (#16). | Apprentissage | leçon complète |
| Séance d'un exercice | Séance d'un seul exercice choisi sur la page de la leçon, sans étapes de leçon. Elle donne les étoiles de la leçon, sauf si cet exercice est une fluence (#16, #24). | Apprentissage | jeu seul, mini-séance |
| Avancement de la séance | Nombre de questions réussies sur le nombre de questions de la séance ; les étapes de leçon ne comptent pas. Interface : le récipient et ses points (#16). | Apprentissage | progression, score, récipient (dans le code) |
| Réponse | Ce que l'enfant propose à une question : un choix touché, un nombre validé, un mot écrit, une étiquette posée. Elle est juste ou fausse. « Je ne sais pas » est une réponse permise. | Apprentissage | saisie, essai |
| Erreur | Réponse fausse à une question pendant une séance. Le nombre d'erreurs fixe les étoiles gagnées. Chaque réponse fausse coûte une erreur ; « Je ne sais pas » en coûte une seulement si la question n'en a pas encore coûté ; plus aucune n'est comptée après la bonne réponse montrée (#23). | Apprentissage | faute, échec |
| Nouvelle chance | Après une erreur, la même question reste posée, sans limite d'essais : l'enfant avance seulement avec la bonne réponse (#23). | Apprentissage | deuxième essai, rattrapage |
| Je ne sais pas | Réponse permise, une fois par question, dans tous les types d'exercices sauf la fluence (dictée, classer, ordre et étape poser compris) : la bonne réponse est montrée, puis l'enfant la donne lui-même (#23). | Apprentissage | passer, abandon, joker |
| Aide par défaut | Aide propre à un type d'exercice, lue quand la question n'a pas d'`aide` (ex. l'astuce de l'opération) (#23). | Apprentissage | indice |
| Bonne réponse montrée | État d'une question après « Je ne sais pas » : seul le bon choix reste et brille, ou la réponse est dite (#23). | Apprentissage | solution, corrigé |
| Choix écarté | Choix faux déjà touché : il reste visible, pâle, et ne coûte plus d'erreur (#17). | Apprentissage | bulle grisée (dans le code) |
| Explication de la réponse | Phrase propre au type d'exercice, dite après la félicitation (« « cat », c'est « chat » », « On ouvre la boîte pour vérifier… »). Apprentissage la fournit, Motivation la félicitation (#17). | Apprentissage | correction |
| Étiquette | Mot, nombre ou chiffre que l'enfant pose sur une cible : item de `classer`, élément d'`ordre`, chiffre d'une addition posée, vers (#18). | Apprentissage | pierre, tag, carte |
| Placement (à valider) | Réponse qui pose une étiquette sur une cible : un groupe pour `classer`, la place suivante de la liste pour `ordre`. Bon placement : l'étiquette ne bouge plus ; mauvais placement : une erreur, l'étiquette revient (#18). | Apprentissage | dépôt, glisser-déposer, drop |
| Indication du geste (à valider) | Phrase lue après la consigne de `classer` ou d'`ordre` pour dire comment poser une étiquette (« Fais glisser chaque étiquette, ou touche-la puis touche une maison. », « Touche d'abord celle qui vient en premier. ») (#18). | Apprentissage | tutoriel, mode d'emploi |
| Étiquettes mélangées | Étiquettes d'un exercice `classer` ou `ordre`, mélangées une fois au début de la séance ; celles qui restent à poser sont les **étiquettes à placer** (`etiquettesMelangees`, `etiquettesAPlacer`). Interface : le plateau (Décision n°31) (#18). | Apprentissage | plateau (dans le code), pioche |
| Parole due (à valider) | Ce qu'Apprentissage annonce après une bonne réponse, sans choisir la phrase : `felicitation`, `felicitationUneFoisSurDeux` (classer, sauf la dernière étiquette) ou `relance` (ordre, sauf la dernière étiquette). Motivation en tire la phrase (Décision n°32) (#18). | Apprentissage | réplique, message |
| Texte complet (à valider) | Moment où le dernier trou d'un texte à trous reçoit le bon mot : le personnage guide dit une félicitation suivie de « Le texte est complet ! » (#18). | Apprentissage | texte fini, texte rempli |
| Mode de réponse | Manière de répondre à un calcul : par choix au CP (et, pour la boîte et les barres, si la réponse vaut 20 au plus), sinon au clavier de cristaux (#20, #21). | Apprentissage | mode de saisie |
| Clavier de cristaux | Clavier de chiffres (0 à 9, « Effacer », « Valider ») pour répondre à un calcul, à partir du CE1. Nommé dans le format (#20). | Apprentissage | pavé numérique, clavier (seul) |
| Caractère déjà écrit | Espace, apostrophe, tiret ou point d'un mot dicté, écrit d'avance et jamais tapé (#19). | Apprentissage | lettre fixe |
| Adaptation de la difficulté | Réduction des intervalles d'un générateur de calcul quand l'enfant se trompe souvent (moins de 60 % de réponses justes sur au moins 6, calculé sur les 50 dernières réponses de calcul, toutes leçons confondues) (#20). | Apprentissage | niveau adaptatif, difficulté (seule) |
| Astuce de l'opération | Aide par défaut d'un calcul, selon son signe (« Pars du plus grand nombre, et avance du plus petit. ») (#20). | Apprentissage | conseil, truc |
| Score de fluence | Nombre de calculs réussis pendant une fluence. Ce n'est pas une étoile (#20). | Apprentissage | points, note |
| Record de fluence | Meilleur score de fluence d'un enfant à un exercice de fluence d'une leçon. Il ne baisse jamais ; 0 n'est jamais un record. « Record » seul : interface (#20). | Apprentissage | meilleur temps, high score |
| Colonne | Colonne des unités (bleue), des dizaines (rose) ou des centaines (verte) d'une addition posée, mêmes couleurs dans tous les univers. L'interface dit « maison » (#20). | Apprentissage | maison (dans le code), tour |
| Rang | Unités, dizaines, centaines : ce que vaut un chiffre selon sa colonne (#20). | Apprentissage | position, ordre (réservé à la leçon) |
| Retenue | Dizaine d'une colonne reportée en haut de la colonne suivante, à gauche (#20). | Apprentissage | report |
| Mot caché | Mot d'un vers remplacé par un trou pendant l'entraînement d'une poésie : le plus long d'au moins 3 lettres (#22). | Apprentissage | mot envolé (interface), trou (seul) |
| Séance terminée | Séance dont toutes les questions sont réussies. Elle donne des étoiles et devient un fait enregistré (`SeanceTerminee`), revalidé par le serveur ; si l'envoi échoue, elle est gardée sur l'appareil et renvoyée au retour du réseau (#24, décision 0013). | Apprentissage | séance finie, séance validée |
| Résultat de la leçon | Pour un enfant et une leçon : meilleures étoiles, dernières étoiles et nombre de séances terminées. Il dit si la leçon est réussie ou acquise (#24). | Apprentissage | progression (mot d'interface), progrès |
| Meilleures étoiles | Le plus grand nombre d'étoiles gagné sur une leçon ; il ne baisse jamais (#24). | Apprentissage | meilleur score, record |
| Jour de séance | Jour où l'enfant a terminé au moins une séance ; sert à la série et aux épisodes (lot 5) (#24). | Apprentissage | jour joué, connexion |
| Étoile | Récompense d'une séance, de 1 à 3 : 3 sans erreur, 2 avec 1 à 3 erreurs, 1 au-delà. Une leçon garde ses meilleures étoiles. | Apprentissage | point, note, score |
| Leçon réussie | Leçon pour laquelle l'enfant a gagné au moins 1 étoile, ou leçon réussie au test de départ (réponse 27.1 du PO). | Apprentissage | leçon terminée, faite |
| Leçon acquise | Leçon réussie avec au moins 2 étoiles (le test de départ ne rend pas une leçon acquise : réponse 27.1 du PO). | Apprentissage | maîtrisée, validée |
| Parcours | Suite ordonnée des leçons d'une matière pour le niveau de l'enfant. | Apprentissage | chemin, programme, carte |
| Leçon verrouillée | Leçon du parcours que l'enfant ne peut pas encore commencer, parce que la précédente n'est pas réussie. | Apprentissage | bloquée, fermée |
| Parcours libre | Réglage qui ouvre toutes les leçons du parcours. L'ordre conseillé reste affiché. | Apprentissage | mode libre, déverrouillage |
| Test de départ | Série de questions de français et de maths, jusqu'au niveau de l'enfant, pour savoir où commencer. Il s'arrête après 3 questions fausses de suite (réponse 27.13 du PO). | Apprentissage | évaluation, examen, test (seul) |
| Révision (à valider) | Séance qui reprend les questions ratées dont la date de révision est arrivée (10 au plus). | Apprentissage | rattrapage, revoir |
| Leçon des classes d'avant (à valider) | Leçon d'un niveau inférieur, proposée sans verrou pour réviser. | Apprentissage | ancienne leçon |
| Prochaine leçon | Première leçon non réussie du parcours d'une matière ; au plus une par matière, aucune quand toutes sont réussies. Elle est mise en avant et ne ferme aucune autre leçon ; une leçon réussie plus loin ne la déplace pas (#25, réponse N8). Interface : « À toi ! ». | Apprentissage | leçon en cours, leçon débloquée |
| Leçon à découvrir | Leçon du parcours, non réussie, qui n'est pas la prochaine leçon ; l'enfant peut la commencer. Interface : « À découvrir » (#25). | Apprentissage | leçon ouverte, leçon libre, leçon déverrouillée |
| Leçon suivante | Leçon proposée à la fin d'une séance (« Leçon suivante », « Ensuite : … ») : dans le parcours de la leçon jouée, la première leçon d'après non réussie, sinon la leçon juste après ; aucune après la dernière leçon du parcours, ni après une leçon qui n'est pas dans le parcours de l'enfant (leçon d'une classe au-dessus), ni vers une autre matière avant #29 (#25, réponses 25.2, N4, N10). | Apprentissage | leçon d'après, suite |
| Matière du parcours | Matière qui a au moins une leçon du niveau de l'enfant ; elle a un onglet dans « Mon parcours ». Une matière qui n'a que des leçons réussies d'une classe au-dessus n'en est pas une (#25, réponses 25.4, N7). | Apprentissage | onglet (dans le code), discipline |
| Place | Numéro d'une leçon dans son parcours (1, 2, …), tiré de l'`ordre`. Interface : « Leçon 1 » (#25, réponse 25.8). Ne pas confondre avec la place d'une étiquette dans un exercice `ordre` (Placement). | Apprentissage | rang, étape, numéro d'étape |
| Leçon réussie d'une classe au-dessus | Leçon réussie d'un niveau supérieur à celui de l'enfant (enfant redescendu de classe). Elle reste visible avec son niveau et ses étoiles, à part, sous les leçons du parcours de sa matière (« Déjà réussies en CE2 ») ; elle s'ouvre pour être rejouée, ne compte pas dans le parcours, n'est jamais la prochaine leçon et n'a pas de leçon suivante (#25, réponses 25.12, N1, N9, N10). | Apprentissage | leçon perdue, leçon cachée |
| Proposition du test de départ | Moment où le personnage guide propose le test de départ, avec « Oui, on y va ! » et « Plus tard » : après la création d'un profil, depuis l'accueil de l'enfant tant que le test de départ n'est pas fait, ou depuis l'espace parent (#27). | Apprentissage | invitation (réservé à Famille), test (seul) |
| Réserve du test de départ | Leçons qui peuvent fournir une question du test de départ : bibliothèque seulement, `francais` et `maths`, niveau inférieur ou égal à celui de l'enfant (#27). | Apprentissage | banque de questions, pool |
| Question du test de départ | Une seule question tirée au hasard d'un exercice d'une leçon de la réserve, et rattachée à cette leçon ; au plus 12, une par leçon, de la plus facile à la plus difficile (#27). | Apprentissage | item, épreuve |
| Question juste, question fausse (au test de départ) | Juste : question du test de départ réussie sans aucune erreur. Fausse : au moins une réponse fausse ou « Je ne sais pas » ; l'enfant donne quand même la bonne réponse avant de continuer (#27). Ne pas confondre avec une **Réponse** juste ou fausse. | Apprentissage | question ratée, échec |
| Arrêt du test de départ | Fin anticipée du test de départ après 3 questions fausses de suite ; une question juste remet le compte à zéro. Un test de départ arrêté est fait (#27). | Apprentissage | abandon, élimination |
| Leçon réussie au test de départ | Leçon que le test de départ compte comme réussie, sans étoile : elle fait avancer le parcours, ne donne ni étoile, ni badge, ni compétence acquise (#27, réponses 27.1 et 27.2 du PO). Une séance terminée ensuite lui donne ses étoiles. | Apprentissage | acquise au test, validée, cochée (dans le code) |
| Résultat du test de départ | Pour un enfant : la date du dernier test de départ fait et les leçons réussies au test de départ. Il ne modifie jamais une étoile (#27). | Apprentissage | progression, score, note |
| Test de départ fait | Le profil a fini au moins un test de départ, par toutes ses questions ou par un arrêt ; quitter en cours ne compte pas (#27). | Apprentissage | test passé, testFait (dans le code) |
| Matière réussie (à valider) | Matière dont l'enfant a réussi toutes les leçons de sa classe (au moins 1 étoile ou réussie au test de départ). Dans « Toutes les leçons », elle montre les leçons de cette matière de la classe **juste** au-dessus, et pas au-delà. Une matière sans leçon dans la classe n'est jamais réussie. Calculée à chaque affichage (#26, réponses 26.1, 26.1a, 26.1b, 26.18). | Apprentissage | classe finie, matière terminée, matière validée |

## Motivation

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Univers | Habillage choisi par l'enfant (princesses, animaux, sports, police, pompiers, danse). Il ne change ni le contenu ni les règles. | Motivation | thème, monde, skin |
| Personnage guide | Personnage de l'univers qui lit les consignes et encourage l'enfant (Noisette, Lumi, Coach Léo…). | Motivation | mascotte, guide (seul) |
| Série (à valider) | Nombre de jours consécutifs avec au moins une séance, jusqu'à aujourd'hui ou hier. | Motivation | streak, flamme |
| Badge (à valider) | Récompense liée à une compétence, gagnée avec au moins 2 étoiles sur la leçon. | Motivation | trophée |
| Cabane (à valider) | Décor que l'enfant remplit d'objets débloqués par paliers d'étoiles (3, 6, 10… 75). | Motivation | maison, collection |
| Épisode (à valider) | Chapitre de l'histoire de l'univers. Un nouvel épisode s'ouvre à chaque jour de séance. | Motivation | chapitre, histoire, niveau |
| Titre du personnage guide (à valider) | Qualité qui suit le nom du personnage guide (Noisette, « l'écureuil savant »). | Motivation | surnom, rôle |
| Royaume (à valider) | Lieu de l'univers où vit le personnage guide (« la Forêt des Savanturiers »). | Motivation | monde, pays |
| Humeur du personnage guide (à valider) | Attitude montrée par le personnage guide : `content` (par défaut), `reflechit` (après une erreur, il penche la tête), `applaudit` (il saute). | Motivation | émotion, état, mood |
| Félicitation (à valider) | Phrase qui salue une bonne réponse : une félicitation commune (« Bravo ! ») ou une expression du personnage guide. | Motivation | compliment, praise |
| Expression du personnage guide (à valider) | Félicitation propre à un personnage guide (Noisette : « Youpi ! »). | Motivation | cri, réplique |
| Relance (à valider) | Phrase du personnage guide après chaque bonne étiquette d'un exercice `ordre`, sauf la dernière, **tirée au hasard** par Motivation parmi « Oui ! Et après ? », « Bien ! Et ensuite ? », « Super ! La suite ? » ; elle remplace la félicitation. Apprentissage dit seulement qu'elle est due (**Parole due**) (Décision n°32, #18). | Motivation | encouragement, félicitation |
| Encouragement (à valider) | Phrase dite après une erreur, jamais punitive (« Pas grave, on réessaie ! »). | Motivation | reproche, oops |
| Caractère de la voix (à valider) | Voix féminine ou masculine, hauteur et rythme propres à un personnage guide. Sa forme est définie par le sous-domaine Voix, ses valeurs sont fournies par Motivation pour chaque personnage guide (décision 0008). | Motivation | style, timbre, sexe de la voix |
| Écran des récompenses de l'enfant (à valider) | Écran de l'enfant qui réunit ce qu'il a gagné, en sections dans un ordre fixe : cabane, histoire, badges, records de fluence. Une section n'existe que lorsque sa story est livrée. Il ne fait que lire : il ne modifie ni étoile, ni record. Interface : « Mes médailles » (écran et bouton d'accès, décision 65.1 du PO) ; le legacy dit « Mes trophées » (#65). | Motivation | trophées, mes trophées (« trophée » est interdit pour Badge), collection (interdit pour Cabane), réussites (réservé à Leçon réussie) |
| Section de l'écran (à valider) | Une des parties de l'écran des récompenses de l'enfant : cabane (#32), histoire (#33), badges (#31), records de calcul rapide (#65), toujours dans cet ordre. Peut-être un simple mot d'interface (#65). | Motivation | onglet, rubrique |
| Records de calcul rapide (à valider) | Section de l'écran des récompenses de l'enfant qui montre les records de fluence du profil en cours, un par exercice de fluence ; absente quand le profil n'a aucun record. Les records sont lus dans Apprentissage, jamais modifiés. Interface : « Mes records de calcul rapide » (#65). | Motivation | trophées, meilleurs scores, high scores |
| Pastille de record (à valider) | Libellé d'un exercice de fluence et meilleur score du record de fluence correspondant, dans les records de calcul rapide. Libellé proposé : le titre de l'exercice (question n°3 de #65). Peut-être un simple mot d'interface (#65). | Motivation | badge, médaille, trophée |
| Badge, précision | Décidé par #31 (2026-10-25) : un badge existe dès qu'une leçon de la bibliothèque est **acquise** (au moins 2 meilleures étoiles), jamais par le test de départ ; **un seul badge par compétence** (une leçon sans compétence a le sien). Il se recalcule à partir des meilleures étoiles, n'est pas enregistré et ne se perd jamais tant que sa leçon est dans la bibliothèque. **Une leçon personnelle ne donne pas de badge** (décision du PO, 39.12). | Motivation | trophée, médaille (« Mes médailles » est le nom de l'écran, jamais celui d'un badge : décision 31.21) |
| Nom du badge | La compétence de la leçon acquise, sinon « Je sais : `<titre de la leçon>` » (#31, décision 31.20). | Motivation | titre du badge, intitulé |
| Badge gagné par la séance | Badge que la séance vient de faire gagner : la leçon jouée n'était pas acquise avant la séance et l'est après, et sa compétence n'était pas déjà un badge. Au plus un par séance ; jamais pour une leçon personnelle. Interface : encart « Nouveau badge » de l'écran de fin (#31). | Motivation | nouveau trophée, badge débloqué |
| Épisode, nouvelle définition | Une des 20 parties de l'histoire des Savanturiers, numérotées de 1 à 20 (titre et texte, lus à voix haute par le personnage guide du profil). Un épisode s'ouvre à **chaque séance terminée** (séance de révision comprise, test de départ exclu), dans l'ordre, quel que soit l'univers ; aucun après le 20e (#33, décisions 33.1, 33.2, 33.3 et 33.7 du PO, 2026-10-25). Remplace la ligne **Épisode** ci-dessus, qui dit « histoire de l'univers » et « à chaque jour de séance ». | Motivation | chapitre, histoire (pour un seul épisode), niveau |
| Histoire des Savanturiers | Suite des 20 épisodes, la même pour tous les profils ; l'histoire de Noisette (#33, décisions 33.2, 33.6 et 33.27). Interface : section « L'histoire des Savanturiers » de « Mes médailles ». | Motivation | histoire de l'univers, livre, saga |
| Épisode ouvert | Épisode dont le numéro est inférieur ou égal au nombre de séances terminées du profil (20 au plus). Il se recalcule à partir des séances terminées et des séances de révision terminées d'Apprentissage, n'est pas enregistré et ne se referme jamais. Contraire : épisode fermé, interface « À découvrir » (#33, décisions 33.1, 33.8 et 33.27). « Nombre de séances terminées » et « épisode ouvert par la séance » sont des noms de calcul, pas des termes du glossaire (décision 33.27). | Motivation | épisode débloqué, épisode gagné |

## Famille

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Parent | Adulte qui a un compte et qui est rattaché à un ou plusieurs profils enfants. Il crée et règle les profils, donne les devoirs et consulte le suivi. Il ne voit **que les enfants auxquels il est rattaché**. Il n'y a pas d'autre rôle adulte. | Famille | utilisateur, adulte, enseignant, tuteur, compte |
| Rattachement | Lien entre un parent et un profil enfant, qui donne au parent l'accès à ce profil. Un profil enfant a **un ou deux parents**, qui ont les **mêmes droits** (modifier, régler, inviter, exporter, supprimer). Le parent qui crée le profil y est rattaché d'office (#11) ; le second par une invitation (#13). Chaque rattachement est propre à un enfant : deux parents ne voient pas leurs autres enfants respectifs, ni l'adresse e-mail l'un de l'autre (validation n°1 du lot 2, décisions n°1 et n°3). | Famille | partage, lien, accès |
| Invitation | Demande faite par un parent rattaché pour qu'un second parent se rattache à **un** profil enfant. Valable **7 jours**, utilisable **une seule fois** ; une seule invitation en attente par profil (une nouvelle remplace l'ancienne). Elle est en attente, acceptée ou annulée. Le parent qui invite peut l'annuler ; le parent invité l'accepte ou la refuse. Elle vaut pour quiconque a le lien d'invitation en main. L'application n'envoie rien : le parent communique lui-même le lien d'invitation (#13 ; validation n°1 du lot 2, décision n°2). | Famille | code, parrainage, partage |
| Lien d'invitation (à valider) | Lien qui porte le jeton d'une invitation, communiqué par le parent qui invite. Jamais « lien » seul. | Famille | lien (seul), lien de connexion, code |
| Jeton d'invitation (à valider) | Secret impossible à deviner, contenu dans le lien d'invitation, qui désigne l'invitation. Montré une seule fois. | Famille | code, mot de passe |
| Parent invité (à valider) | Parent qui ouvre un lien d'invitation ; il devient un parent rattaché en l'acceptant. Ce n'est pas un autre rôle. | Famille | invité (seul), second compte |
| Profil enfant | Enfant qui apprend : prénom ou pseudo, niveau, univers, réglages et date de création, rattaché à un ou deux parents. Il n'a ni compte, ni e-mail, ni mot de passe, ni date de naissance. Changer son niveau garde sa progression. Apprentissage lit, dans le navigateur, son réglage Clavier des dictées et son niveau pour choisir le clavier proposé d'une dictée ; le serveur ne les relit pas (#19, décision 0018). | Famille | élève, utilisateur, joueur, compte enfant |
| Prénom (à valider) | Prénom ou pseudo d'un profil enfant : 1 à 20 caractères, espaces autour retirés, coupé à 20 caractères s'il est plus long ; un prénom vide est refusé ; deux profils peuvent avoir le même (#11). Un seul terme dans le code (`Prenom`). | Famille | nom, pseudo (dans le code), identifiant |
| Profil en cours (à valider) | Profil enfant qui joue en ce moment sur l'appareil, choisi dans « Qui joue ? ». Il n'est pas mémorisé d'une ouverture de l'application à l'autre. | Famille | enfant courant, joueur actif, session |
| Qui joue ? (à valider) | Écran où l'enfant touche son profil pour jouer (« Qui joue aujourd'hui ? »). Il s'affiche à chaque ouverture de l'application et en sortant de l'espace parent. Terme du domaine ou simple titre : question ouverte n°2 de #11. | Famille | accueil, sélection du joueur |
| Réglages | Préférences d'un profil enfant, réglées par un parent rattaché et lues par les autres contextes : mode dys, tout lire à voix haute, parcours libre, clavier des dictées, langue du parent. Enregistrées avec le profil, retrouvées sur tous les appareils ; jamais une préférence de l'appareil (#12 ; validation n°1 du lot 2, décision n°8). | Famille | paramètres, options, temps d'écran |
| Tout lire à voix haute (à valider) | Réglage qui fait lire aussi les choix proposés (« Est-ce a, b, ou c ? ») et une salutation. Les consignes, elles, sont toujours lues (Lecture à voix haute). | Famille | lecture automatique, mode audio |
| Clavier des dictées (à valider) | Réglage du clavier proposé pendant une dictée : automatique (lettres du mot jusqu'au CE1, clavier complet ensuite), lettres du mot seulement, clavier complet. | Famille | clavier (seul), saisie |
| Langue du parent (à valider) | Réglage de chaque profil enfant : langue dans laquelle les consignes sont traduites pour le parent, ou aucune (20 langues proposées). | Famille | langue (seule), langue de l'enfant, traduction |
| Mode dys | Réglage qui adapte l'affichage pour les enfants dyslexiques : police Andika, texte espacé, syllabes en couleurs alternées (décision n°8 du lot 2). | Famille | mode dyslexie, accessibilité |
| Contrôle parental | Question de multiplication (deux facteurs entre 6 et 9) à laquelle seul un adulte sait répondre, qui protège **seulement l'entrée** de l'espace parent sur l'appareil. Après une erreur, la même question est reposée, sans limite d'essais. Elle n'est pas posée juste après la connexion du parent. Ce n'est pas une sécurité : la connexion du parent et l'accès aux données s'en chargent (#10 ; validation n°1 du lot 2, décision n°4). | Famille | code, verrou, mot de passe, code PIN |
| Question du contrôle parental (à valider) | La multiplication posée par le contrôle parental, tirée au hasard à chaque entrée, et reposée telle quelle après une erreur. | Famille | énigme, captcha |
| Espace parent (à valider) | Partie de l'application réservée au parent (profils, réglages, suivi, devoirs, voix, déconnexion), protégée par le contrôle parental. En sortir ramène à « Qui joue ? » ; il est refermé à chaque ouverture de l'application. | Famille | espace adulte, administration, back-office |
| Suppression du profil (à valider) | Effacement immédiat et définitif d'un profil enfant et de toutes les données qui le concernent, dans tous les contextes, dans Storage et sur les appareils, après un avertissement et la confirmation d'un parent rattaché. Elle vaut pour les deux parents. Elle demande le réseau (#14). | Famille (tous les contextes y participent) | archivage, désactivation, détacher |
| Avertissement de suppression (à valider) | Ce que voit le parent avant de confirmer la suppression du profil : elle est définitive, l'autre parent ne verra plus l'enfant (s'il y en a un), l'export est proposé d'abord (#14). Terme du domaine ou d'interface : question ouverte n°6 de #14. | Famille | alerte, popup |
| Export des données du profil (à valider) | Fichier JSON lisible (`savanturier-<prénom>-<date>`), téléchargeable par un parent rattaché, qui contient tout ce que l'application garde sur un profil enfant, sans l'adresse e-mail de l'autre parent. Proposé aussi avant la suppression (#14). | Famille (tous les contextes y participent) | sauvegarde, backup |
| Connexion du parent (à valider) | État d'un appareil sur lequel un parent est reconnu. Elle est obligatoire pour utiliser l'application et reste ouverte jusqu'à la déconnexion. | Famille | session, login |
| Lien de connexion (à valider) | Lien envoyé par e-mail au parent, qui ouvre la connexion du parent. Il vaut 1 heure et sert une seule fois. L'interface peut dire « lien magique ». | Famille | lien (seul), code de connexion, mot de passe (pour désigner ce lien ; le **Mot de passe du parent** est un autre terme, #72) |
| Code de connexion (à valider) | Code de 6 chiffres, dans le même e-mail que le lien de connexion, que le parent saisit sur l'appareil qui a fait la demande pour ouvrir la connexion du parent. Même durée (1 heure) et même usage unique que le lien. | Famille | code (seul), mot de passe (pour désigner ce code ; le **Mot de passe du parent** est un autre terme, #72), code PIN, lien de connexion |
| E-mail de connexion | E-mail que reçoit le parent quand il demande à se connecter : sujet et texte en français, qui contiennent le lien de connexion et le code de connexion de la même demande. Composé par le domaine Famille (décision 0011) ; il n'utilise que l'adresse du parent. | Famille | courriel, courriel de connexion, mail, message, e-mail magique, OTP, modèle d'e-mail |
| Déconnexion (à valider) | Fin de la connexion du parent sur un appareil, faite depuis l'espace parent. Elle ne ferme pas les autres appareils. Plus aucune donnée de la famille n'y reste visible. | Famille | logout |
| Mot de passe du parent | Secret choisi par le parent qui, avec son adresse e-mail, ouvre la connexion du parent. Il respecte les **règles du mot de passe** et la **longueur maximale du mot de passe** ; il est gardé tel quel, espaces au début et à la fin compris. L'application ne le conserve ni ne le journalise : seul le service de connexion en garde l'empreinte. Il reste après la mise en ligne (#45). Un profil enfant n'a jamais de mot de passe (#72, validé le 2026-10-24). | Famille | mot de passe (seul, pour un enfant), code, code PIN, mot de passe du compte |
| Règles du mot de passe | Les 4 règles d'un mot de passe du parent, affichées sous le champ avec leurs libellés courts : « 8 caractères » (au moins 8 caractères Unicode), « une majuscule » (lettres accentuées majuscules comprises : `É`, `À`, `Ç`), « une minuscule » (lettres accentuées minuscules comprises, dont `ù`), « un caractère spécial » (un caractère spécial accepté). Chacune passe au vert dès qu'elle est respectée ; vérifiées aussi par le serveur à l'inscription et à la réinitialisation. Les chiffres et les autres signes (`*`, `-`, `_`, `.`…) sont permis sans compter pour aucune règle (#72, validé le 2026-10-24). | Famille | critères, politique de mot de passe, force du mot de passe |
| Longueur maximale du mot de passe | 64 caractères au plus pour un mot de passe du parent. Règle bloquante, vérifiée dans le navigateur et par le serveur, mais **pas** affichée dans la liste des règles du mot de passe : elle n'apparaît que comme refus (« 64 caractères au plus. », texte à fixer avec les scénarios) (#72, validé le 2026-10-24). | Famille | taille, limite (seule) |
| Caractère spécial accepté | Un des 14 caractères `& # { } ( ) [ ] $ € % @ ! ?` qui respectent la règle du caractère spécial. `ù`, les chiffres, `*`, `-`, `_` et `.` n'en sont pas (#72, validé le 2026-10-24). | Famille | symbole, caractère spécial (seul, pour un autre signe) |
| Inscription du parent | Arrivée d'un nouveau parent avec son adresse e-mail et un mot de passe du parent (avec confirmation) ; le serveur revérifie les règles et crée le parent, puis il est connecté aussitôt, sans e-mail de confirmation. Code : `InscrireLeParent`. L'interface dit « Créer ton compte » (#72, validé le 2026-10-24, décision n°34). | Famille | création du compte, compte, enregistrement, signup |
| Réinitialisation du mot de passe | Choix d'un nouveau mot de passe du parent (avec confirmation) quand il l'a oublié, puis connexion du parent ; **les autres connexions du parent sont fermées**. **Beta seulement** : prouvée par l'adresse e-mail et le prénom d'un enfant rattaché à ce parent (comparé sans casse, sans accents, sans espaces autour, rien d'autre) ; impossible pour un parent sans profil enfant. Proposée par « Mot de passe oublié » sur l'écran de connexion et sous le message « Adresse e-mail ou mot de passe incorrect ». Retirée par #45 au profit de la réinitialisation par e-mail (#72, décision 0019, validé le 2026-10-24). | Famille | récupération, reset, changement de mot de passe |
| Essai de réinitialisation | Une demande de réinitialisation du mot de passe pour une adresse, comptée par le serveur, **sans le prénom saisi**. Elle est réussie ou **ratée** (adresse inconnue, parent sans enfant ou prénom qui ne correspond pas, avec le même message « Ces informations ne correspondent pas. »). Une demande refusée avant (adresse mal formée, prénom vide, mot de passe non conforme) ou pendant le blocage n'en est pas un raté. Les ratés s'oublient 24 heures après le dernier raté ; les essais de réinitialisation sont effacés au plus tard à ce moment. Jamais « essai » seul (#72, validé le 2026-10-24, décision n°35). | Famille | essai (seul), tentative, réponse |
| Blocage de la réinitialisation | Après 5 essais de réinitialisation ratés pour une même adresse, connue ou non, toute réinitialisation est refusée pendant 1 heure à partir du 5ᵉ raté, même avec un prénom juste, avec le message fixe « Trop d'essais. Réessaie dans une heure. ». Un essai pendant le blocage ne le prolonge pas. Il n'empêche pas la connexion avec le bon mot de passe du parent. Une réinitialisation réussie ou la fin du blocage remettent le compteur à zéro (#72, validé le 2026-10-24). | Famille | verrou, verrouillage (réservé à la leçon verrouillée), bannissement |
| Appareil (à valider) | Tablette, téléphone ou ordinateur où l'application est ouverte. Certaines préférences y sont mémorisées (Son/Muet, choix de voix), jamais les réglages d'un profil. | Famille (utilisé partout) | device, navigateur, poste |
| Accueil de l'enfant | Écran de l'enfant après le choix de son profil dans « Qui joue ? » : son personnage guide le salue ; il mène à « Mon parcours » et, tant que le test de départ n'est pas fait, à « Mon test de départ ». #29 dira s'il devient « Aujourd'hui » (#27, réponse 27.22 du PO). | Famille | écran d'accueil, home, tableau de bord |

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
| Traduction des consignes (à valider) | Traduction d'une consigne dans la langue du parent, faite par l'IA depuis une Edge Function. Seul le texte de la consigne est envoyé (lot 6). | Accompagnement | traduction de l'enfant |

## Voix (sous-domaine générique)

Sous-domaine décidé à la validation n°1 du lot 1 (décision 0007). Ses termes restent `(à valider)`.

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Lecture à voix haute (à valider) | Le personnage guide lit un texte, phrase par phrase, en surlignant le mot prononcé. | Voix | synthèse, TTS |
| Voix automatique (à valider) | Choix par défaut : la voix française la plus naturelle de l'appareil, adaptée au caractère de la voix du personnage guide. | Voix | voix par défaut |
| Voix imposée (à valider) | Voix française de l'appareil choisie par le parent, dans l'espace parent, à la place de la voix automatique. Elle garde le caractère de la voix du personnage guide ; l'anglais garde sa voix anglaise. Mémorisée sur l'appareil, pour tous les profils qui y jouent, même après la déconnexion du parent. Si elle n'existe plus sur l'appareil, la voix automatique reprend (affichée comme choisie) et le choix reste mémorisé (#15). | Voix | voix préférée, voix forcée |
| Choix de voix (à valider) | Préférence de l'appareil : voix automatique ou une voix imposée (#15). | Voix | réglage de voix, préférence vocale |
| Voix très naturelle (à valider) | Voix française de l'appareil dont le score est d'au moins 60 (mention de l'interface). | Voix | voix premium, voix HD |
| Essai de voix (à valider) | Phrase lue pour écouter une voix avant de la choisir (« Coucou ! Je suis Noisette. On apprend en s'amusant ? Youpi ! »), par le personnage guide du profil en cours, ou Noisette s'il n'y en a pas. Ne change pas le choix de voix. | Voix | test de voix (« test » est réservé) |
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
17. **« Espace adulte »** (legacy, #10) : synonyme interdit de **Espace parent** (proposition appliquée, validation n°1 du lot 2).
18. **« Lien »** (#13) : on dit toujours **Lien de connexion** ou **Lien d'invitation**, jamais « lien » seul (proposition appliquée).
19. **« Supprimer » / « détacher »** (#14) : supprimer un profil qui a deux parents le supprime **pour les deux** (tranchée, décision n°1 du lot 2). « Détacher » reste un synonyme interdit de **Suppression du profil** ; le retrait d'un parent n'existe pas au lot 2.
20. **« La voix des guides »** (legacy, #15) : on dit « La voix des personnages guides » (proposition appliquée).
21. **« Progression »** (legacy, #14) : mot d'interface (« supprimer Léa et sa progression »), hors glossaire (proposition appliquée).
22. **Rattachement, Invitation, Contrôle parental, Réglages** : confirmés par la validation n°1 du lot 2 (`docs/stories/lot-2-decisions.md`, décisions n°1 à n°4 et n°8). Les autres termes du lot 2 restent `(à valider)`.
23. **« Jeu »** (#16) : mot d'interface pour **exercice** (« Leçon et tous les jeux », « Jeu suivant »), jamais dans le code ni les scénarios (tranché par le PO le 2026-10-23, validation n°1 du lot 3).
24. **« Maison »** (#18, #20) : mot d'interface ; le domaine dit **Groupe** (classer) et **Colonne** (addition posée) (tranché par le PO le 2026-10-23).
25. **« Rang »** (#20) : **Rang** entre au glossaire pour l'addition posée (unités, dizaines, centaines) ; il reste interdit seulement pour la position d'une leçon (**Ordre**) (tranché par le PO le 2026-10-23).
26. **« Énoncé »** (#21) : **Énoncé du problème** désigne le texte d'un schéma en barres (champ `enonce`) ; « énoncé » seul reste interdit pour la consigne (tranché par le PO le 2026-10-23).
27. **« Essai »** (#24) : le champ `essais` du legacy devient le **nombre de séances** (terminées) du résultat de la leçon ; « essai » reste interdit pour **Réponse** (tranché par le PO le 2026-10-23).
28. **« Étape »** (#20) : on dit toujours « étape poser » ou « étape calculer » pour l'addition posée, et **Étape de leçon** pour l'explication ; jamais « étape » seule (tranché par le PO le 2026-10-23).
29. **« Progression »** (#24) : reste un mot d'interface (décision n°21) ; ce qui garde les meilleures étoiles s'appelle **Résultat de la leçon** (tranché par le PO le 2026-10-23).
30. **Termes du lot 3** (« Jouer une leçon », #16 à #24) : tous validés par le PO le 2026-10-23 (`docs/stories/lot-3-decisions.md`, « OK pour tout »), y compris les définitions précisées de **Séance**, **Réponse** et **Erreur**. Restent hors glossaire, comme mots d'interface : récipient, bulle, carte de la question, plateau, case, lettre intruse, écran de fin, maison, jeu, poème.
31. **« Plateau »** (#18, ancien conflit n°4) : mot d'interface seulement (Décision n°30) ; le domaine dit **Étiquettes mélangées** et **étiquettes à placer** (`etiquettesMelangees`, `etiquettesAPlacer`) (tranché par le PO le 2026-10-24).
32. **« Relance »** (#18, ancien conflit n°5) : parole de **Motivation**, tirée **au hasard** parmi les trois phrases. Apprentissage dit seulement quelle **Parole due** (`felicitation`, `felicitationUneFoisSurDeux`, `relance`) ; en `classer`, Motivation tire la félicitation une fois sur deux, et la dernière étiquette est toujours félicitée (tranché par le PO le 2026-10-24).
33. **« Leçon verrouillée »** (#25) : **abandonné par la réponse 25.1** (aucun verrou : toutes les leçons du parcours s'ouvrent, la prochaine leçon est seulement mise en avant). La ligne « Leçon verrouillée » d'Apprentissage est gardée pour l'historique, mais le terme n'est plus employé (ni code, ni interface, ni scénario) ; « Plus tard » et le cadenas disparaissent. De même, « ouvre la leçon suivante » (Décision n°3) se lit « fait avancer le parcours », et « sans verrou » ne distingue plus une **Leçon des classes d'avant** (tranché par le PO le 2026-10-24, réponse N3).
34. **Termes du parcours** (#25) : **Prochaine leçon**, **Leçon à découvrir** (remplace « leçon ouverte »), **Leçon suivante**, **Matière du parcours**, **Place** et **Leçon réussie d'une classe au-dessus** sont validés (tranché par le PO le 2026-10-24, réponse N11). Restent des mots d'interface : « Mon parcours », « À toi ! », « À découvrir », « Déjà réussies en CE2 ». « Carte », « chemin », « étape » et « rang » ne désignent jamais une leçon du parcours.
35. **Termes du test de départ** (#27) : **Test de départ**, **Proposition du test de départ**, **Réserve du test de départ**, **Question du test de départ**, **Question juste, question fausse (au test de départ)**, **Arrêt du test de départ**, **Leçon réussie au test de départ**, **Résultat du test de départ**, **Test de départ fait** et **Accueil de l'enfant** sont validés (tranché par le PO le 2026-10-24, réponses 27.1 à 27.23 : « reco OK »). Une leçon validée par le test de départ est **réussie**, sans étoile, jamais **acquise** (réponse 27.1) ; l'arrêt porte sur 3 **questions fausses** de suite, pas sur 3 erreurs (réponse 27.13). Restent des mots d'interface : « Mon test de départ », « Fin du test de départ », « Voir mon parcours », « Pour savoir où commencer ».
36. **Leçons des classes d'avant** (#26, numéro 35 laissé à #27) : la ligne « Leçon des classes d'avant » se lit désormais : « Leçon d'un niveau inférieur à celui de l'enfant. Dans « Mon parcours », elle est montrée à part, sous les leçons de sa matière quand celle-ci est une matière du parcours ; dans « Toutes les leçons », dans une section à part, rangée par classe. Elle s'ouvre, ne compte pas dans le parcours, n'est jamais la prochaine leçon et n'a pas de leçon suivante. » Synonymes interdits : ancienne leçon, leçon de révision, classes précédentes. **Leçon à découvrir** couvre aussi une leçon des classes d'avant non réussie et une leçon de la classe juste au-dessus non réussie montrée dans « Toutes les leçons » ; jamais « À toi ! » pour elles. Les leçons réussies d'une classe au-dessus se voient toujours dans « Toutes les leçons » (tranché par le PO le 2026-10-25, réponses 26.1 à 26.20).
37. **Mots d'interface de #26** : « Toutes les leçons » et « Leçons des classes d'avant (24) » restent hors glossaire. L'état « Révision » d'une leçon et le titre « Revoir les classes d'avant » du legacy sont abandonnés : « revoir » reste un synonyme interdit de **Révision** (tranché par le PO le 2026-10-25, réponses 26.3, 26.4, 26.12).

33. **« Mot de passe »** (#72) : il n'est plus un synonyme interdit en soi. On dit **Mot de passe du parent** ; « mot de passe » reste interdit pour désigner un lien de connexion, un code de connexion, le contrôle parental ou un jeton d'invitation, et un profil enfant n'en a jamais (tranché par le PO le 2026-10-24, validation n°1 de #72).
34. **« Création du compte »** (#72, ancien conflit n°7) : « compte » reste interdit dans le domaine (Décision n°10). On dit **Inscription du parent** (`InscrireLeParent`) dans le domaine, le code et les scénarios ; « Créer ton compte » seulement à l'écran (tranché par le PO le 2026-10-24).
35. **« Essai »** (#72, ancien conflit n°6) : « essai » reste interdit pour **Réponse** (Décision n°27). **Essai de réinitialisation** entre au glossaire (Famille), toujours avec son complément ; « essai » seul reste interdit (tranché par le PO le 2026-10-24). Le message d'interface « Trop d'essais. Réessaie dans une heure. » est un texte d'écran, permis.
36. **Termes de #72** (Mot de passe du parent, Règles du mot de passe, Longueur maximale du mot de passe, Caractère spécial accepté, Inscription du parent, Réinitialisation du mot de passe, Essai de réinitialisation, Blocage de la réinitialisation) : validés par le PO le 2026-10-24 (« OK aux propositions », `docs/stories/72/journal.md`).

## Conflits à trancher

1. **« Étoile »** est aussi le nom de l'« Étoile du savoir » dans l'histoire. Proposition : **Étoile** reste la récompense. L'objet de l'histoire n'est pas un terme du domaine.
2. **« Test »** : on dit toujours **Test de départ**, pour ne pas confondre avec les tests logiciels.
3. **« Courriel »** (story #5, décision 0011) : **tranché par le PO le 2026-10-23** : on dit **E-mail de connexion** partout, « courriel » est interdit.
4. **« Plateau »** (#18) : **tranché par le PO le 2026-10-24** : voir Décision n°31.
5. **« Relance »** (#18) : **tranché par le PO le 2026-10-24** : voir Décision n°32.
6. **« Essai »** (#72) : **tranché par le PO le 2026-10-24** : voir Décision n°35.
7. **« Création du compte »** (#72) : **tranché par le PO le 2026-10-24** : voir Décision n°34.

Les anciens conflits n°3 à n°7 (compte, session, lien magique, voix, monde) sont tranchés : voir Décisions n°10 à n°15. Ceux du lot 2 (espace adulte, lien, supprimer / détacher, la voix des guides, progression) : voir Décisions n°17 à n°21.
Ceux du lot 3 (anciens n°8 à n°14 : jeu, maison, rang, énoncé, essai, étape, progression) : voir Décisions n°23 à n°29.

Ajouts de #33 (cadrage, numéros à attribuer à la fusion des branches du lot 5) :
- **« Histoire »** (#33) : synonyme interdit d'**Épisode**, mais nom de l'ensemble des 20 épisodes (« L'histoire des Savanturiers »). Proposition : **Histoire des Savanturiers** entre au glossaire ; « histoire » reste interdit pour désigner **un** épisode (question 33.27).
- **« Leçon terminée »** (#33) : le sous-titre du legacy (« Un nouvel épisode s'ouvre à chaque leçon terminée. ») emploie un synonyme interdit de **Leçon réussie**. Proposition : réécrire le sous-titre selon la règle d'ouverture (questions 33.1 et 33.6).
- Conflit n°1 (**Étoile du savoir**) : #33 propose de le trancher comme ci-dessus (question 33.4).

## Questions ouvertes

Les trois questions de rattachement (mêmes droits des deux parents, durée et usage unique d'une invitation, visibilité des autres enfants) sont tranchées par la validation n°1 du lot 2 (décisions n°1, n°2 et n°3). Restent, sans blocage :
- « Qui joue ? » : terme du domaine ou titre d'écran (#11, question n°2) ;
- « police de lecture », « texte espacé », « syllabe » : glossaire ou interface (#12, question n°3) ;
- « Avertissement de suppression » : terme du domaine ou d'interface (#14, question n°6).

Lot 3 : plus aucune question ouverte ; les termes sont validés (Décision n°30).

Lot 4 (#25, `docs/stories/25/domain-model.md`) : le PO a répondu **aucun verrou** (réponse 25.1), puis a suivi toutes les recommandations N1 à N11 (2026-10-24). Questions tranchées :
- « Leçon verrouillée » : abandonné (Décision n°33, réponse N3) ;
- termes du parcours : validés (Décision n°34, réponse N11) ;
- leçons réussies d'une classe au-dessus : bloc à part dans « Mon parcours », ouvrables, sans onglet propre ni leçon suivante (réponses N1, N7, N9, N10) ;
- « Étape » (« Étape 1 ») : remplacé par « Leçon 1 » (réponse 25.8) ; terme **Place** ;
- hors glossaire, corrigés par #25 (réponse N3) : `CLAUDE.md` (« réussie à 1 étoile (elle fait avancer le parcours) »), ligne `ordre` de `docs/format-lecons.md` (« position dans le parcours de la matière »), note ajoutée à `docs/domain/context-map.md`.

Restent, sans blocage pour #25 :
- « Parcours libre » : réglage sans effet ; retiré de l'interface et du glossaire par une story de Famille dédiée, créée par le responsable (réponse N2). La ligne reste ici jusque-là ;
- « Leçon des classes d'avant » : définition à revoir avec #26 (renommée « Leçons des classes d'avant », réponse N2).

Lot 4 (#27, `docs/stories/27/domain-model.md`) : le PO a suivi toutes les recommandations 27.1 à 27.23 (2026-10-24) ; voir Décision n°35. Reste, sans blocage pour #27 :
- « Objectif du jour » (« Joue 2 leçons aujourd'hui ») : employé par l'issue #27, absent du glossaire ; terme de Motivation, à définir par #29 ou #30.

Lot 5 (#65, `docs/stories/65/domain-model.md`) : à trancher par le PO.
- Nom de l'écran des récompenses de l'enfant : tranché, « Mes médailles » (décision 65.1 du PO ; « médaille » retiré des synonymes interdits de Badge, « trophée » reste interdit) ;
- « Section de l'écran » et « Pastille de record » : termes du domaine ou mots d'interface (#65).

Lot 5 (#31, `docs/stories/31/domain-model.md`) : tranché par le PO le 2026-10-25 (toutes les recommandations, sauf les leçons personnelles, qui ne donnent pas de badge).
- Un badge par compétence (31.2), recalculé (31.3) ; « Nom du badge » et « Badge gagné par la séance » sont des termes du domaine ;
- « Médaille » : nom de l'écran seulement, jamais pour un badge (31.21) ;
- Leçon personnelle : ne donne pas de badge (réponse « A », 39.12) ;
- Reste : **Carte des compétences**, conflit de sens (la définition dit « par compétence », le legacy calcule par section du programme, test de départ compris) ; renvoyé à #34 (31.17).

Lot 4 (#26, `docs/stories/26/domain-model.md`) : tout est tranché (réponses 26.1 à 26.20) ; « Leçon des classes d'avant » est redéfinie (Décision n°36). Reste le nom **Matière réussie** `(à valider)`.

Lot 5 (#33, `docs/stories/33/domain-model.md`, cadrage) : à trancher par le PO.
- Règle d'ouverture d'un épisode : chaque séance terminée, chaque leçon réussie ou chaque jour de séance (33.1) ; selon la réponse, la ligne **Jour de séance** (« sert à la série et aux épisodes ») perdra « et aux épisodes » ;
- histoire de Noisette pour tous, ou une histoire par univers (33.2) : nouvelle définition de **Épisode** ;
- « Nombre de séances terminées » et « Épisode ouvert par la séance » : termes du domaine ou simples calculs (33.27).
