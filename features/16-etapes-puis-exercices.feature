# language: fr
@issue-16
Fonctionnalité: Étapes de leçon lues, puis exercices
  En tant qu'enfant
  Je veux écouter mon personnage guide m'expliquer la leçon étape par étape, puis faire les exercices à la suite, ou en choisir un seul
  Afin de comprendre avant de m'entraîner

  Leçons de la bibliothèque utilisées : « Les sons ou, on, an » (fr-cp-sons-ou-on-an : 3 étapes de leçon,
  un exercice bulles de 6 questions, un exercice classer de 9 étiquettes) et « La boîte à jetons : ajouter »
  (ma-cp-boite-ajouter, qui cite un guide fondamental). Les leçons de test sont décrites dans les scénarios.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: La page de la leçon présente la leçon et propose la séance complète ou un seul exercice

    Scénario: La page de la leçon propose la séance complète et chaque exercice
      Quand Léa ouvre la page de la leçon « Les sons ou, on, an »
      Alors elle voit le titre « Les sons ou, on, an » et « CP · Français »
      Et la séance complète lui est proposée par « Leçon et tous les jeux »
      Et sous « Ou choisis un seul jeu : », elle voit les exercices « Quel son entends-tu ? » et « Les maisons des sons »

    Plan du Scénario: L'exercice « <titre> » est proposé avec le libellé de son type, « <libellé> »
      Quand Léa ouvre la page de la leçon « Les sons ou, on, an »
      Alors l'exercice « <titre> » est proposé avec le libellé « <libellé> »

      Exemples:
        | titre                  | libellé                  |
        | Quel son entends-tu ?  | Bulles-réponses          |
        | Les maisons des sons   | Ranger dans les maisons  |

    Scénario: Un exercice sans titre est proposé sous le libellé de son type
      Étant donné qu'une leçon de test « Les nombres » a un exercice calcul sans titre
      Quand Léa ouvre la page de la leçon « Les nombres »
      Alors un exercice est proposé sous le libellé « Calcul »

    Scénario: Le personnage guide accueille l'enfant sur la page de la leçon
      Quand Léa ouvre la page de la leçon « Les sons ou, on, an »
      Alors Noisette dit « Coucou Léa ! Je t'explique la leçon, et après, on joue. Tu peux aussi choisir directement un jeu. »

    Scénario: Le passage pour les adultes cite le programme officiel et le guide fondamental
      Quand Léa ouvre la page de la leçon « La boîte à jetons : ajouter »
      Alors le passage « Pour les adultes : ce que dit le programme » donne la citation du programme officiel et la source de sa section
      Et il donne « Ce que conseille le guide fondamental » avec le passage cité
      Et il indique « Guide fondamental « Pour enseigner les nombres, le calcul et la résolution de problèmes au CP » (Eduscol), page 53. »
      Mais jamais « Ce que conseille le guide » seul

    Scénario: Une leçon qui ne s'appuie sur aucun guide fondamental n'en cite aucun
      Quand Léa ouvre la page de la leçon « Les sons ou, on, an »
      Alors le passage pour les adultes donne la citation du programme officiel
      Mais il ne cite aucun guide fondamental

  Règle: Une séance complète lit toutes les étapes de leçon, dans l'ordre, avant le premier exercice

    Scénario: La première étape de leçon est lue, puis attend l'enfant
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète
      Alors Léa entend Noisette lire « Certains sons s'écrivent avec deux lettres. O et U ensemble font le son « ou », comme dans loup. »
      Et Léa peut continuer quand elle est prête
      Mais aucun exercice n'a encore commencé

    Scénario: Les exemples d'une étape de leçon sont affichés et lus après son texte
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa a continué après les deux premières étapes de leçon
      Quand la troisième étape de leçon s'affiche
      Alors Léa voit les exemples « ou », « on » et « an »
      Et Léa entend Noisette lire « Écoute bien chaque mot, et cherche le son que tu entends. », puis les exemples « ou », « on » et « an »

    Scénario: Continuer passe à l'étape de leçon suivante
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Noisette a lu la première étape de leçon
      Quand Léa continue
      Alors Léa entend Noisette lire « O et N font le son « on », comme dans ballon. A et N font le son « an », comme dans maman. »

    Scénario: Après la dernière étape de leçon, le personnage guide lance le premier exercice
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Noisette a lu la dernière étape de leçon
      Quand Léa continue
      Alors Noisette applaudit en sautant
      Et Noisette dit l'une des phrases « À toi de jouer maintenant ! », « C'est parti, à toi ! » ou « Prêt ? On joue ! »
      Et la question « Dans le mot « poule », quel son entends-tu ? » s'affiche

    Scénario: Une leçon sans étape de leçon commence directement par son premier exercice
      Étant donné qu'une leçon de test « Compter » n'a aucune étape de leçon et un exercice bulles qui pose « Combien font 2 + 1 ? »
      Et que Léa est sur la page de la leçon « Compter »
      Quand Léa commence la séance complète
      Alors la question « Combien font 2 + 1 ? » s'affiche
      Et Léa n'entend aucune étape de leçon

    Scénario: « Réécouter » relit la dernière phrase du personnage guide
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Noisette a lu la première étape de leçon
      Quand Léa demande à réécouter
      Alors Léa entend de nouveau Noisette lire « Certains sons s'écrivent avec deux lettres. O et U ensemble font le son « ou », comme dans loup. »

  Règle: Une séance d'un exercice joue seulement l'exercice choisi, sans étape de leçon

    Scénario: Choisir un seul exercice saute les étapes de leçon
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors Léa entend Noisette lire « Range chaque mot dans la maison de son son. »
      Mais Léa n'entend aucune étape de leçon

    Scénario: Le titre de l'exercice choisi seul n'est pas annoncé
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors Noisette n'annonce pas « Les maisons des sons » comme un nouveau défi

    @depend-de-18
    Scénario: Une séance d'un exercice se termine avec cet exercice
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Et qu'il ne reste que l'étiquette « dent » à poser
      Quand Léa pose l'étiquette « dent » dans la maison « an »
      Alors la séance est terminée
      Mais l'exercice « Quel son entends-tu ? » n'a pas été joué

  Règle: Les exercices se jouent dans l'ordre de la leçon, et le personnage guide annonce le titre du suivant

    @depend-de-17
    Scénario: Entre deux exercices, le personnage guide annonce le titre de l'exercice suivant
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa en est à la dernière question de l'exercice « Quel son entends-tu ? », « Dans le mot « lampe », quel son entends-tu ? »
      Quand Léa répond « an »
      Alors Noisette dit « Nouveau défi : Les maisons des sons ! », « Jeu suivant : Les maisons des sons ! » ou « Place au jeu : Les maisons des sons ! »
      Et l'exercice « Les maisons des sons » commence

    @depend-de-17
    Scénario: Un exercice sans titre commence sans être annoncé
      Étant donné qu'une leçon de test « Compter » a deux exercices bulles, le second sans titre
      Et que Léa en est à la dernière question du premier exercice de la séance complète de « Compter »
      Quand Léa donne la bonne réponse
      Alors le second exercice commence
      Mais Noisette n'annonce aucun nouveau défi

    @depend-de-17
    Scénario: Tant que la question en cours n'est pas réussie, l'exercice suivant ne commence pas
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa en est à la dernière question de l'exercice « Quel son entends-tu ? », « Dans le mot « lampe », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors la question « Dans le mot « lampe », quel son entends-tu ? » reste posée
      Et l'exercice « Les maisons des sons » n'a pas commencé

  Règle: L'avancement de la séance compte les questions réussies, et il est complet exactement à la dernière question réussie

    Plan du Scénario: L'avancement d'une <séance> compte <total> questions
      Étant donné que Léa est sur la page de la leçon « <leçon> »
      Quand Léa commence <choix>
      Alors l'avancement de la séance montre 0 question réussie sur <total>

      Exemples:
        | séance                    | leçon                         | choix                                             | total |
        | séance complète           | Les sons ou, on, an           | la séance complète                                | 15    |
        | séance d'un exercice      | Les sons ou, on, an           | seulement l'exercice « Quel son entends-tu ? »    | 6     |
        | séance d'un exercice      | Les sons ou, on, an           | seulement l'exercice « Les maisons des sons »     | 9     |
        | séance d'une lecture      | Lecture : Le petit chat Plume | la séance complète                                | 4     |
        | séance d'une chanson      | Chanson : Au clair de la lune | la séance complète                                | 16    |

    Scénario: Les étapes de leçon ne font pas avancer la séance
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Noisette a lu la dernière étape de leçon
      Quand Léa continue
      Alors l'avancement de la séance montre 0 question réussie sur 15

    @depend-de-17
    Scénario: Chaque question réussie fait avancer la séance d'un pas
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors l'avancement de la séance montre 1 question réussie sur 15

    @depend-de-17
    Scénario: Une erreur ne fait jamais reculer l'avancement
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa a réussi la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « an » à la question « Dans le mot « mouton », quel son entends-tu à la fin ? »
      Alors l'avancement de la séance montre toujours 1 question réussie sur 15

    @depend-de-18
    Scénario: L'avancement est complet quand la dernière question est réussie
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et qu'il ne reste que l'étiquette « dent » à poser
      Quand Léa pose l'étiquette « dent » dans la maison « an »
      Alors l'avancement de la séance montre 15 questions réussies sur 15
      Et la séance est terminée

    Scénario: Un exercice d'un type inconnu est écarté : il n'est ni proposé, ni joué, ni compté
      Étant donné qu'une leçon de test « Mélange » a un exercice bulles de 3 questions et un exercice d'un type inconnu « puzzle »
      Quand Léa ouvre la page de la leçon « Mélange »
      Alors un seul exercice lui est proposé
      Et la séance complète de « Mélange » compte 3 questions
      Et aucun message d'erreur n'apparaît

  Règle: Quitter une séance en cours ne garde rien de cette séance

    Scénario: Quitter la séance en cours ramène à la page de la leçon et coupe la voix
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Noisette est en train de lire la première étape de leçon
      Quand Léa quitte la séance
      Alors Léa voit la page de la leçon « Les sons ou, on, an »
      Et Léa n'entend plus Noisette

    @depend-de-17
    Scénario: Une séance quittée recommence du début
      Étant donné que Léa a quitté la séance complète de la leçon « Les sons ou, on, an » après 3 questions réussies
      Quand Léa commence de nouveau la séance complète
      Alors Léa entend Noisette lire la première étape de leçon
      Et l'avancement de la séance montre 0 question réussie sur 15

  Règle: La séance se suit à voix haute, en mode dys, au clavier et sur un petit écran

    @depend-de-12
    Scénario: Avec le mode dys, les étapes de leçon et leurs exemples s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Quand la troisième étape de leçon s'affiche
      Alors Léa voit le texte de l'étape de leçon dans la bulle de Noisette en mode dys : police Andika, lettres, mots et lignes espacés
      Et Léa voit les exemples « ou », « on » et « an » en mode dys

    @depend-de-17
    Scénario: L'avancement de la séance est annoncé aux lecteurs d'écran
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors les lecteurs d'écran annoncent « 1 sur 15 », sans couper Noisette

    Scénario: Au clavier, Léa suit les étapes de leçon et commence le premier exercice sans souris
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète et continue jusqu'au premier exercice, au clavier seulement
      Alors la question « Dans le mot « poule », quel son entends-tu ? » s'affiche

    Scénario: La page de la leçon et la séance tiennent dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète
      Alors la page tient dans la largeur de l'écran
      Et chaque commande de la séance mesure au moins 44 px de haut et de large
