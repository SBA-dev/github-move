# language: fr
@issue-19
Fonctionnalité: Dictée et conjugaison
  En tant qu'enfant
  Je veux écrire les mots que mon personnage guide me dicte, et choisir la bonne forme d'un verbe pour chaque personne
  Afin d'apprendre l'orthographe et la conjugaison

  Leçons de la bibliothèque utilisées : « Dictée : les animaux » (fr-cp-dictee-animaux, exercice dictée
  « J'écris les animaux » : « chat », « chien », « souris », « lapin », « loup », chacun avec sa phrase d'exemple)
  et « Être et avoir au présent » (fr-cp-etre-avoir, exercice conjugaison « Le verbe être »).
  Les mots dictés de test sont décrits dans les scénarios.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Le mot dicté est seulement dit à voix haute, et il n'est montré qu'une fois bien écrit

    Scénario: Le mot dicté est dit avec sa phrase d'exemple, sans être écrit
      Étant donné que Léa est sur la page de la leçon « Dictée : les animaux »
      Quand Léa choisit seulement l'exercice « J'écris les animaux »
      Alors Léa entend Noisette dire « Écoute bien. chat. Le chat dort sur le lit. Écris : chat. »
      Et Léa voit « Écoute bien et écris le mot que tu entends. » et 4 cases vides
      Mais « chat » n'est écrit nulle part à l'écran

    @wip
    Scénario: La dictée commence par le mot dicté, sans lire la consigne avant
      Étant donné que Léa est sur la page de la leçon « Dictée : les animaux »
      Quand Léa choisit seulement l'exercice « J'écris les animaux »
      Alors la première chose que Léa entend Noisette dire est « Écoute bien. chat. Le chat dort sur le lit. Écris : chat. »
      Mais Léa n'entend pas Noisette lire la consigne « Écoute bien et écris le mot que tu entends. »
      Et Léa voit « Écoute bien et écris le mot que tu entends. » et 4 cases vides

    Plan du Scénario: Léa peut <demande>
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa demande à <demande>
      Alors Léa entend de nouveau Noisette dire « chat »<vitesse>

      Exemples:
        | demande                 | vitesse         |
        | réécouter le mot        |                 |
        | écouter plus lentement  | , plus lentement |

    Scénario: Le mot bien écrit est montré et félicité
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « chat »
      Alors Noisette dit une félicitation, suivie de « « chat » est bien écrit ! »
      Et Léa voit le mot « chat » écrit

    Scénario: Les espaces, apostrophes, tirets et points d'un mot dicté sont déjà écrits
      Étant donné qu'une leçon de test a un exercice dictée du mot « arc-en-ciel »
      Quand le mot dicté « arc-en-ciel » commence
      Alors Léa voit 9 cases à écrire et les deux tirets déjà écrits à leur place
      Et Léa n'a pas à taper les tirets

  Règle: Le mot est corrigé dès que sa dernière case est remplie, et le début juste est gardé

    Scénario: Le mot est corrigé sans qu'il faille valider
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Et que Léa a écrit « cha »
      Quand Léa écrit la lettre « t »
      Alors Noisette dit une félicitation, suivie de « « chat » est bien écrit ! »

    Scénario: Un mot mal écrit montre les lettres fausses, et le début juste est gardé
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « chas »
      Alors la lettre « s » est montrée en rouge
      Et Noisette dit un encouragement, suivi de « Regarde les lettres en rouge et écoute encore. », puis redit « chat »
      Et ensuite, il reste « cha » écrit et une case vide

    Scénario: Un mot mal écrit coûte une seule erreur, quel que soit le nombre de lettres fausses
      Étant donné que Paul a réglé « clavier des dictées » sur « clavier complet » pour Léa
      Et qu'une leçon de test a un seul exercice dictée du mot « chat »
      Et que Léa a écrit « bxyz »
      Quand Léa écrit ensuite « chat »
      Alors Léa gagne 2 étoiles

    Scénario: La correction ne tient pas compte des majuscules
      Étant donné qu'une leçon de test a un exercice dictée du mot « Paris »
      Quand Léa écrit « paris »
      Alors Noisette dit une félicitation, suivie de « « Paris » est bien écrit ! »

  Règle: Le clavier proposé dépend du réglage clavier des dictées et du niveau de l'enfant

    Plan du Scénario: Avec « <réglage> » au <niveau>, la dictée propose <clavier>
      Étant donné que Tom a un profil enfant préparé de niveau <niveau>
      Et que Paul a réglé « clavier des dictées » sur « <réglage> » pour Tom
      Quand Tom commence un exercice dictée d'une leçon de test
      Alors la dictée propose <clavier>

      Exemples:
        | réglage                    | niveau | clavier                |
        | automatique                | CP     | les lettres du mot     |
        | automatique                | CE1    | les lettres du mot     |
        | automatique                | CE2    | le clavier complet     |
        | automatique                | CM2    | le clavier complet     |
        | lettres du mot seulement   | CM2    | les lettres du mot     |
        | clavier complet            | CP     | le clavier complet     |

    Plan du Scénario: Les lettres du mot « <mot> » sont proposées avec <intruses> lettres en plus
      Étant donné que Paul a réglé « clavier des dictées » sur « lettres du mot seulement » pour Léa
      Quand le mot dicté « <mot> » commence
      Alors Léa voit <touches> touches : les lettres de « <mot> » et <intruses> lettres absentes du mot

      Exemples:
        | mot      | touches | intruses |
        | chat     | 7       | 3        |
        | lapin    | 8       | 3        |
        | souris   | 8       | 2        |

    Scénario: Avec les lettres du mot, chaque touche ne sert qu'une fois, et « Effacer » la rend
      Étant donné que Paul a réglé « clavier des dictées » sur « lettres du mot seulement » pour Léa
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Et que Léa a écrit « c »
      Quand Léa efface la dernière lettre
      Alors la touche « c » est de nouveau proposée
      Et toutes les cases sont vides

    Scénario: Le clavier complet propose « œ »
      Étant donné que Paul a réglé « clavier des dictées » sur « clavier complet » pour Léa
      Quand Léa commence un exercice dictée d'une leçon de test
      Alors le clavier complet propose les lettres de « azertyuiop », « qsdfghjklm », « wxcvbnéèêà », « çùëïôâîû » et « œ »

  Règle: Conjugaison : une forme par personne, dans l'ordre du tableau, choisie parmi trois

    Scénario: Le verbe et le temps sont annoncés, puis la première personne est demandée
      Étant donné que Léa est sur la page de la leçon « Être et avoir au présent »
      Quand Léa choisit seulement l'exercice « Le verbe être »
      Alors Léa voit « être · présent » et le tableau des pronoms
      Et Léa entend Noisette lire « Conjuguons le verbe être au présent. Choisis la bonne forme pour chaque personne. »
      Et « je … ? » propose « suis » et deux autres formes, toutes différentes

    Scénario: La bonne forme s'écrit dans le tableau sans félicitation
      Étant donné que Léa joue seulement l'exercice « Le verbe être » de la leçon « Être et avoir au présent »
      Quand Léa répond « suis »
      Alors Léa voit « je suis » dans le tableau
      Et Noisette applaudit en sautant, sans dire de félicitation
      Et « tu … ? » est demandé

    Scénario: Une mauvaise forme est écartée et le personnage guide rappelle la personne
      Étant donné que Léa joue seulement l'exercice « Le verbe être » de la leçon « Être et avoir au présent »
      Et que Léa en est à « tu … ? »
      Quand Léa répond « est »
      Alors le choix « est » reste visible, pâle, et ne réagit plus
      Et Noisette dit un encouragement, suivi de « Avec « tu », quelle forme va ? »

    Scénario: À la dernière personne, le personnage guide félicite pour le verbe
      Étant donné que Léa joue seulement l'exercice « Le verbe être » de la leçon « Être et avoir au présent »
      Et que Léa en est à « ils … ? »
      Quand Léa répond « sont »
      Alors Noisette dit une félicitation, suivie de « Tu sais conjuguer être ! »

  Règle: Sans son, la dictée prévient l'enfant au lieu de dicter

    Scénario: En Muet, la dictée demande d'activer le son
      Étant donné que la tablette est en Muet
      Quand Léa commence l'exercice « J'écris les animaux » de la leçon « Dictée : les animaux »
      Alors Léa voit le message « Pour la dictée, j'ai besoin du son : active-le avec le bouton ci-dessous. »
      Et le son peut être activé par « Activer le son »

    Scénario: Sur un navigateur qui ne sait pas lire à voix haute, la dictée se fait avec un adulte
      Étant donné que le navigateur ne sait pas lire à voix haute
      Quand Léa commence l'exercice « J'écris les animaux » de la leçon « Dictée : les animaux »
      Alors Léa voit le message « Ce navigateur ne sait pas lire à voix haute : fais cette dictée avec un adulte, qui te dira les mots. »

  Règle: La dictée s'utilise au clavier et sur un petit écran

    Scénario: Sur un ordinateur, Léa écrit le mot dicté avec le clavier
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa tape « chat » au clavier seulement
      Alors Noisette dit une félicitation, suivie de « « chat » est bien écrit ! »

    Scénario: Le clavier complet tient dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Paul a réglé « clavier des dictées » sur « clavier complet » pour Léa
      Quand Léa commence l'exercice « J'écris les animaux » de la leçon « Dictée : les animaux »
      Alors la page tient dans la largeur de l'écran
      Et chaque touche du clavier mesure au moins 44 px de haut et de large
