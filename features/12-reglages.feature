# language: fr
@issue-12
Fonctionnalité: Réglages d'un profil enfant
  En tant que parent
  Je veux adapter l'application à mon enfant : mode dys, tout lire à voix haute, parcours libre, clavier des dictées et langue du parent
  Afin qu'il joue dans de bonnes conditions et que je comprenne les consignes

  Les effets du parcours libre (lot 4), du clavier des dictées (lot 3) et de la langue du parent (lot 6)
  arrivent avec leurs écrans : ici, ces réglages sont seulement enregistrés et retrouvés.
  Le mode dys se vérifie dans une vraie séance (la consigne d'un exercice d'une leçon de test, la félicitation,
  une question à choix) et sur l'accueil de l'enfant, après « Qui joue ? ». « Tout lire à voix haute » se vérifie sur
  une question de test à choix ; le cas nominal et le réglage sur « non » sont dans #17.
  Les réglages suivent le profil enfant, jamais l'appareil.

  Règle: Un profil enfant a toujours ses cinq réglages ; sans choix du parent, ils ont leurs valeurs par défaut

    Scénario: Un profil créé sans toucher aux réglages reçoit les réglages par défaut
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 sans changer ses réglages
      Et que Paul est dans l'espace parent
      Quand Paul ouvre les réglages de Léa
      Alors les réglages de Léa indiquent : mode dys non, tout lire à voix haute non, parcours libre non, clavier des dictées automatique, langue du parent aucune

    Scénario: Les réglages se choisissent dès la création du profil
      Étant donné que Paul est connecté sur la tablette
      Quand Paul crée le profil enfant "Léa" de niveau CE1 en réglant « mode dys » sur « oui »
      Alors les réglages de Léa indiquent « mode dys » : « oui »
      Et les autres réglages de Léa ont leurs valeurs par défaut

    Scénario: Les réglages proposés sont les cinq réglages du profil, sans aucune limite de durée de jeu
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul est dans l'espace parent
      Quand Paul ouvre les réglages de Léa
      Alors Paul voit les réglages mode dys, tout lire à voix haute, parcours libre, clavier des dictées et langue du parent
      Mais aucun réglage ne limite la durée de jeu

  Règle: Un parent rattaché change les réglages du profil, et les retrouve sur tous ses appareils

    Plan du Scénario: Paul règle « <réglage> » sur « <valeur> » pour Léa
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que le réglage « <réglage> » de Léa est sur « <avant> »
      Et que Paul est dans l'espace parent
      Quand Paul règle « <réglage> » sur « <valeur> » pour Léa
      Alors les réglages de Léa indiquent « <réglage> » : « <valeur> »

      Exemples:
        | réglage                | avant                     | valeur                    |
        | mode dys               | non                       | oui                       |
        | mode dys               | oui                       | non                       |
        | tout lire à voix haute | non                       | oui                       |
        | parcours libre         | non                       | oui                       |
        | clavier des dictées    | automatique               | lettres du mot seulement  |
        | clavier des dictées    | automatique               | clavier complet           |
        | clavier des dictées    | clavier complet           | automatique               |
        | langue du parent       | aucune                    | arabe                     |
        | langue du parent       | arabe                     | aucune                    |

    Scénario: Le clavier des dictées se choisit parmi trois claviers
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul est dans l'espace parent
      Quand Paul ouvre les réglages de Léa
      Alors le clavier des dictées propose « automatique », « lettres du mot seulement » et « clavier complet »

    Scénario: La langue du parent se choisit parmi les vingt langues proposées, ou aucune
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul est dans l'espace parent
      Quand Paul ouvre les réglages de Léa
      Alors la langue du parent propose « aucune » et les langues anglais, arabe, espagnol, portugais, turc, roumain, polonais, italien, allemand, russe, ukrainien, chinois, vietnamien, tamoul, wolof, bambara, lingala, persan, albanais, serbe

    Scénario: Les réglages changés sur la tablette sont retrouvés sur le téléphone
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul a réglé « langue du parent » sur « turc » pour Léa sur la tablette
      Et que Paul est dans l'espace parent sur le téléphone
      Quand Paul ouvre les réglages de Léa
      Alors les réglages de Léa indiquent « langue du parent » : « turc »

    Scénario: Changer les réglages de Léa ne change pas ceux de Tom
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul est rattaché au profil enfant de Tom
      Et que Paul est dans l'espace parent
      Quand Paul règle « mode dys » sur « oui » pour Léa
      Alors les réglages de Tom indiquent « mode dys » : « non »

  Règle: Seul un parent rattaché au profil voit et change ses réglages

    @acces
    Scénario: Le second parent rattaché change aussi les réglages
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Marie est rattachée au profil enfant de Léa
      Et que Marie est dans l'espace parent sur le téléphone
      Quand Marie règle « tout lire à voix haute » sur « oui » pour Léa
      Alors Paul retrouve « tout lire à voix haute » sur « oui » dans les réglages de Léa

    @acces
    Scénario: Un parent d'une autre famille ne voit pas les réglages de Léa
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Claire est connectée sur la tablette
      Quand Claire ouvre l'espace parent
      Alors Claire ne voit pas le profil enfant de Léa
      Et Claire ne voit aucun réglage de Léa

    @acces
    Scénario: Un parent d'une autre famille ne peut pas changer les réglages de Léa
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Claire est connectée sur la tablette
      Quand Claire tente de régler « mode dys » sur « oui » pour Léa
      Alors le changement est refusé comme pour un profil introuvable
      Et Paul retrouve les réglages de Léa inchangés

    @acces
    Scénario: Sans connexion du parent, personne ne change les réglages de Léa
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que personne n'est connecté sur la tablette
      Quand un visiteur tente de régler « parcours libre » sur « oui » pour Léa
      Alors le changement est refusé
      Et Paul retrouve les réglages de Léa inchangés

    @acces
    Scénario: L'enfant ne se voit pas proposer les réglages en jouant
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un profil enfant de niveau CE1
      Quand Léa commence à jouer
      Alors les réglages ne sont pas proposés à Léa
      Et l'en-tête propose l'« Espace parent »

  Règle: Le mode dys adapte l'affichage du texte quand le profil en cours l'a choisi

    @issue-58
    Scénario: Avec le mode dys, la consigne s'affiche en police Andika et avec un texte espacé
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Quand la consigne « Trouve le mot qui commence par le son [a]. » s'affiche
      Alors Léa voit la consigne « Trouve le mot qui commence par le son [a]. » en mode dys : police Andika, lettres, mots et lignes espacés

    @issue-58
    Scénario: Sans le mode dys, la consigne s'affiche comme d'habitude
      Étant donné que le réglage « mode dys » de Léa est sur « non »
      Quand la consigne « Trouve le mot qui commence par le son [a]. » s'affiche
      Alors Léa voit la consigne « Trouve le mot qui commence par le son [a]. »
      Mais la consigne ne s'affiche pas en mode dys

    @issue-58
    Scénario: Avec le mode dys, ce que dit le personnage guide s'affiche aussi en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors la félicitation de Noisette s'affiche en mode dys

    @issue-58
    Scénario: Avec le mode dys, les syllabes des mots de plus de trois lettres sont en couleurs alternées
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Quand la consigne « Lis le mot maman. » s'affiche
      Alors Léa voit « maman » en deux syllabes de couleurs alternées, « ma » puis « man »
      Mais « Lis », « le » et « mot » restent d'une seule couleur

    @issue-58
    Scénario: En mode dys, le mot prononcé est toujours surligné pendant la lecture
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Quand la consigne « Lis la phrase avec Noisette. » s'affiche
      Alors chaque mot de la consigne est surligné au moment où Noisette le prononce

    @issue-58
    Scénario: Le mode dys suit le profil en cours, pas l'appareil
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que le réglage « mode dys » de Tom est sur « non »
      Et que Léa a joué sur la tablette
      Quand Tom choisit son profil enfant dans « Qui joue ? » sur la tablette
      Alors Tom voit son accueil sans le mode dys

    @issue-58
    Scénario: Un réglage changé pendant que Léa joue s'applique au prochain choix de son profil
      Étant donné que Léa joue sur la tablette sans le mode dys
      Et que Paul a ensuite réglé « mode dys » sur « oui » pour Léa sur le téléphone
      Et que Léa est revenue sur « Qui joue ? » sur la tablette
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa voit son accueil en mode dys

    @issue-58
    Scénario: Le mode dys réglé sur la tablette s'applique quand Léa joue sur le téléphone
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa sur la tablette
      Et que Paul est connecté sur le téléphone
      Quand Léa commence à jouer sur le téléphone
      Alors Léa voit son accueil en mode dys

    @depend-de-44 @issue-58
    Scénario: Le mode dys s'applique aussi sans réseau
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Savanturier a déjà été chargé une fois sur la tablette
      Et que le réseau est coupé
      Quand Léa commence à jouer
      Alors Léa voit son accueil en mode dys

    @issue-58
    Scénario: En mode dys, une question de lecture tient dans un écran de 360 px
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue la leçon « Lecture : Le petit chat Plume »
      Quand la question « Où dort Plume ? » s'affiche
      Alors Léa voit la question et les choix en mode dys : police Andika, lettres, mots et lignes espacés
      Et la page tient dans la largeur de l'écran

  Règle: Avec « tout lire à voix haute », le personnage guide lit aussi les choix proposés

    @issue-58
    Scénario: Avec deux choix proposés, le personnage guide ne lit que ces deux choix
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et qu'une question de test « Trouve le mot qui commence par le son [a]. » a les choix « ami » et « lune », de réponse « ami »
      Et que l'ordre des choix tiré au début de la séance est « ami », « lune »
      Quand la question « Trouve le mot qui commence par le son [a]. » s'affiche
      Alors Léa entend ensuite Noisette dire « Est-ce ami, ou lune ? »

    @issue-58
    Scénario: En Muet, « tout lire à voix haute » ne fait rien lire
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la tablette est en Muet
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa n'entend rien
