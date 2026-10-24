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
| Profil de séance (à valider) | Ce qu'Apprentissage lit du profil enfant pour jouer une séance : réglage Clavier des dictées et niveau. Il sert seulement au navigateur, pour choisir le clavier proposé ; le serveur ne le lit pas et accepte l'une ou l'autre forme de clavier (#19, décision 0017). | Apprentissage | profil (seul), contexte, préférences |
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
| Relance (à valider) | Phrase du personnage guide après chaque bonne étiquette d'un exercice `ordre`, sauf la dernière, **tirée au hasard** par Motivation parmi « Oui ! Et après ? », « Bien ! Et ensuite ? », « Super ! La suite ? » ; elle remplace la félicitation. Apprentissage dit seulement qu'elle est due (**Parole due**) (Décision n°32, #18). | Motivation | encouragement, félicitation |
| Encouragement (à valider) | Phrase dite après une erreur, jamais punitive (« Pas grave, on réessaie ! »). | Motivation | reproche, oops |
| Caractère de la voix (à valider) | Voix féminine ou masculine, hauteur et rythme propres à un personnage guide. Sa forme est définie par le sous-domaine Voix, ses valeurs sont fournies par Motivation pour chaque personnage guide (décision 0008). | Motivation | style, timbre, sexe de la voix |

## Famille

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Parent | Adulte qui a un compte et qui est rattaché à un ou plusieurs profils enfants. Il crée et règle les profils, donne les devoirs et consulte le suivi. Il ne voit **que les enfants auxquels il est rattaché**. Il n'y a pas d'autre rôle adulte. | Famille | utilisateur, adulte, enseignant, tuteur, compte |
| Rattachement | Lien entre un parent et un profil enfant, qui donne au parent l'accès à ce profil. Un profil enfant a **un ou deux parents**, qui ont les **mêmes droits** (modifier, régler, inviter, exporter, supprimer). Le parent qui crée le profil y est rattaché d'office (#11) ; le second par une invitation (#13). Chaque rattachement est propre à un enfant : deux parents ne voient pas leurs autres enfants respectifs, ni l'adresse e-mail l'un de l'autre (validation n°1 du lot 2, décisions n°1 et n°3). | Famille | partage, lien, accès |
| Invitation | Demande faite par un parent rattaché pour qu'un second parent se rattache à **un** profil enfant. Valable **7 jours**, utilisable **une seule fois** ; une seule invitation en attente par profil (une nouvelle remplace l'ancienne). Elle est en attente, acceptée ou annulée. Le parent qui invite peut l'annuler ; le parent invité l'accepte ou la refuse. Elle vaut pour quiconque a le lien d'invitation en main. L'application n'envoie rien : le parent communique lui-même le lien d'invitation (#13 ; validation n°1 du lot 2, décision n°2). | Famille | code, parrainage, partage |
| Lien d'invitation (à valider) | Lien qui porte le jeton d'une invitation, communiqué par le parent qui invite. Jamais « lien » seul. | Famille | lien (seul), lien de connexion, code |
| Jeton d'invitation (à valider) | Secret impossible à deviner, contenu dans le lien d'invitation, qui désigne l'invitation. Montré une seule fois. | Famille | code, mot de passe |
| Parent invité (à valider) | Parent qui ouvre un lien d'invitation ; il devient un parent rattaché en l'acceptant. Ce n'est pas un autre rôle. | Famille | invité (seul), second compte |
| Profil enfant | Enfant qui apprend : prénom ou pseudo, niveau, univers, réglages et date de création, rattaché à un ou deux parents. Il n'a ni compte, ni e-mail, ni mot de passe, ni date de naissance. Changer son niveau garde sa progression. | Famille | élève, utilisateur, joueur, compte enfant |
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
| Lien de connexion (à valider) | Lien envoyé par e-mail au parent, qui ouvre la connexion du parent. Il vaut 1 heure et sert une seule fois. L'interface peut dire « lien magique ». | Famille | lien (seul), code de connexion, mot de passe |
| Code de connexion (à valider) | Code de 6 chiffres, dans le même e-mail que le lien de connexion, que le parent saisit sur l'appareil qui a fait la demande pour ouvrir la connexion du parent. Même durée (1 heure) et même usage unique que le lien. | Famille | code (seul), mot de passe, code PIN, lien de connexion |
| E-mail de connexion | E-mail que reçoit le parent quand il demande à se connecter : sujet et texte en français, qui contiennent le lien de connexion et le code de connexion de la même demande. Composé par le domaine Famille (décision 0011) ; il n'utilise que l'adresse du parent. | Famille | courriel, courriel de connexion, mail, message, e-mail magique, OTP, modèle d'e-mail |
| Déconnexion (à valider) | Fin de la connexion du parent sur un appareil, faite depuis l'espace parent. Elle ne ferme pas les autres appareils. Plus aucune donnée de la famille n'y reste visible. | Famille | logout |
| Appareil (à valider) | Tablette, téléphone ou ordinateur où l'application est ouverte. Certaines préférences y sont mémorisées (Son/Muet, choix de voix), jamais les réglages d'un profil. | Famille (utilisé partout) | device, navigateur, poste |

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

## Conflits à trancher

1. **« Étoile »** est aussi le nom de l'« Étoile du savoir » dans l'histoire. Proposition : **Étoile** reste la récompense. L'objet de l'histoire n'est pas un terme du domaine.
2. **« Test »** : on dit toujours **Test de départ**, pour ne pas confondre avec les tests logiciels.
3. **« Courriel »** (story #5, décision 0011) : **tranché par le PO le 2026-10-23** : on dit **E-mail de connexion** partout, « courriel » est interdit.
4. **« Plateau »** (#18) : **tranché par le PO le 2026-10-24** : voir Décision n°31.
5. **« Relance »** (#18) : **tranché par le PO le 2026-10-24** : voir Décision n°32.

Les anciens conflits n°3 à n°7 (compte, session, lien magique, voix, monde) sont tranchés : voir Décisions n°10 à n°15. Ceux du lot 2 (espace adulte, lien, supprimer / détacher, la voix des guides, progression) : voir Décisions n°17 à n°21.
Ceux du lot 3 (anciens n°8 à n°14 : jeu, maison, rang, énoncé, essai, étape, progression) : voir Décisions n°23 à n°29.

## Questions ouvertes

Les trois questions de rattachement (mêmes droits des deux parents, durée et usage unique d'une invitation, visibilité des autres enfants) sont tranchées par la validation n°1 du lot 2 (décisions n°1, n°2 et n°3). Restent, sans blocage :
- « Qui joue ? » : terme du domaine ou titre d'écran (#11, question n°2) ;
- « police de lecture », « texte espacé », « syllabe » : glossaire ou interface (#12, question n°3) ;
- « Avertissement de suppression » : terme du domaine ou d'interface (#14, question n°6).

Lot 3 : plus aucune question ouverte ; les termes sont validés (Décision n°30).
