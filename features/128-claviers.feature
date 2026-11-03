# language: fr
@issue-128 @wip
Fonctionnalité: Des exercices qui ressemblent à des jeux : les cases de la dictée, les cristaux du calcul et la marque du record de fluence
  En tant qu'enfant
  Je veux que les cases de la dictée s'allument, que les cristaux du calcul brillent quand je les touche et voir mon record pendant la fluence
  Afin d'avoir envie de me dépasser

  Tranche 98d de la story #98 (docs/stories/98/domain-model.md, « Découpage révisé ») : `dictee`, `calcul` (au
  clavier de cristaux) et `fluence`. Le modèle est docs/stories/128/domain-model.md (règles R1 à R6). La story ne
  change que l'affichage, plus une lecture du domaine : « le score dépasse-t-il le record ? » (Record dépassé).
  La correction, les erreurs, « Je ne sais pas », l'aide, les étoiles, l'avancement et le record restent ceux de
  #19, #20, #23 et #24 ; les retours de #97 (rebond, effets sonores, fête de la fin de la fluence) passent d'abord.
  Le mode par choix du calcul (#126) et l'addition posée (#127) ne sont pas décrits ici.
  Les commentaires « Décision #128.n » renvoient aux réponses du PO dans docs/stories/128/acceptance.md
  (2026-11-03, « 128 reco tout ») : toutes les recommandations sont retenues.

  Mots employés dans ces scénarios (mots d'interface, pas des termes du domaine) :
  - « la case » : la place d'une lettre à écrire du mot dicté (décision n°30). Les caractères déjà écrits (espace,
    apostrophe, tiret, point) ne sont pas des cases ;
  - « la case s'allume » : elle change d'aspect dès qu'une lettre y est écrite, sans dire si la lettre est juste ;
    « les cases s'illuminent » : quand le mot est juste, toutes ses cases s'éclairent, l'une après l'autre ;
  - « la touche » : une touche du clavier de cristaux ; « un éclat bref » : la lumière courte d'une touche touchée ;
  - « la marque du record » : le record de fluence montré pendant la fluence, comme une marque à atteindre
    (« Ton record : 12 ») ; elle « change de couleur » quand le record est dépassé ;
  - « s'allume », « s'illumine » et « éclat » ne sont jamais « brille » : « brille » reste réservé à la bonne réponse
    montrée après « Je ne sais pas », de la même façon dans les 6 univers ;
  - « le dessin de l'univers » : la case, la touche et la marque ont un dessin propre à chaque univers (décision
    98.2). Les scénarios ne décrivent jamais ce qui est dessiné : l'objet de chaque univers est choisi par le PO
    (questions #128.1 à #128.3) et validé sur une planche, pas par un scénario ;
  - rien ne présente la fluence comme une course : ni le mot « course », ni ligne d'arrivée, ni podium (98.10) ;
  - durées, pour l'implémentation et la review, jamais dans les étapes : éclat d'environ 200 ms, illumination du mot
    juste de 400 ms au plus en tout (question #128.6).

  Leçons de la bibliothèque utilisées, toutes déjà employées par d'autres stories : « Dictée : les animaux » (dictée
  « J'écris les animaux » : « chat », « chien », « souris », « lapin », « loup », #19) ; « Les doubles » (fluence
  « Calcul rapide : les doubles » de 45 secondes, #20). Leçons de test de #19, #20, #21 et #23 : la dictée du mot
  « arc-en-ciel », du mot « éléphant » et du mot « chat » seul ; le calcul « 12 − 5 » de niveau CE1 ; la boîte à
  jetons « 4 + 3 ».
  Les 6 univers et leur personnage guide (#6, #96) : Animaux de la forêt (Noisette), Princesses et fées (Lumi),
  Sports (Coach Léo), Police (Agent Max), Pompiers (Capitaine Sam), Danse (Lili).
  Paul est le parent de Léa et de Tom. Léa a un profil enfant de niveau CP, Tom de niveau CE1, tous deux dans
  l'univers « Animaux de la forêt ». La fluence se répond au clavier de cristaux, au CP comme au CE1 (#20).

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »

  Règle: Pour les mêmes réponses, l'habillage de jeu ne change rien : mêmes erreurs, même avancement de la séance, mêmes étoiles et même record de fluence qu'avant

    Scénario: Un mot mal écrit puis bien écrit coûte toujours une seule erreur
      Étant donné que Paul a réglé « clavier des dictées » sur « clavier complet » pour Léa
      Et qu'une leçon de test a un seul exercice dictée du mot « chat »
      Et que Léa a écrit « bxyz »
      Quand Léa écrit ensuite « chat »
      Alors Léa gagne 2 étoiles

    Scénario: Un mot bien écrit fait avancer la séance d'une question, comme avant
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « chat »
      Alors l'avancement de la séance montre 1 question réussie sur 5

    Scénario: Au clavier de cristaux, un nombre faux s'efface toujours et laisse une nouvelle chance
      Étant donné que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand Tom répond « 8 » au clavier de cristaux
      Alors le nombre « 8 » s'efface
      Et Noisette dit un encouragement
      Et le calcul « 12 − 5 » reste posé

    Plan du Scénario: À la fin de la fluence, <cas>, comme avant
      Étant donné que Léa a un record de <record> à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence
      Quand le temps de la fluence est écoulé avec 12 calculs réussis
      Alors Noisette dit « 12 calculs réussis ! », puis <suite>

      Exemples:
        | cas                 | record | suite                                                     |
        | un nouveau record   | 10     | annonce son nouveau record, 12                            |
        | le record reste     | 15     | « 12 calculs ! Ton record reste 15. Tu y es presque ! »   |

  Règle: Dans la dictée, une case s'allume dès qu'une lettre y est écrite, sans la juger ; quand le mot est juste, ses cases s'illuminent l'une après l'autre, sans feu d'artifice ; un mot faux reste corrigé comme aujourd'hui, au mot complet

    Plan du Scénario: Une lettre écrite <moyen> allume sa case, sans dire si elle est juste
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand <saisie>
      Alors les cases 1, 2 et 3 sont allumées
      Et la case 4 reste vide et éteinte
      Mais aucune lettre n'est encore montrée en rouge

      Exemples:
        | moyen                   | saisie                                |
        | au clavier de la dictée | Léa écrit « cho »                     |
        | au clavier seulement    | Léa tape « cho » au clavier seulement |

    Scénario: Une case allumée ne ressemble pas à une bonne réponse montrée
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « c »
      Alors la case 1 est allumée
      Mais aucune case ne brille comme une bonne réponse montrée

    Scénario: Effacer une lettre éteint sa case
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Et que Léa a écrit « ch »
      Quand Léa efface la dernière lettre
      Alors la case 1 est allumée
      Et les cases 2, 3 et 4 restent vides et éteintes

    Scénario: Le mot juste fait s'illuminer ses cases l'une après l'autre, sans feu d'artifice
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Et que Léa a écrit « cha »
      Quand Léa écrit la lettre « t »
      Alors les 4 cases s'illuminent l'une après l'autre, de la première à la dernière
      Et Noisette dit une félicitation, suivie de « « chat » est bien écrit ! »
      Mais aucune étincelle n'apparaît

    Scénario: L'illumination du mot juste ne retarde pas l'effet sonore « réponse juste »
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « chat »
      Alors Léa entend l'effet sonore « réponse juste » avant que Noisette dise une félicitation
      Et l'effet sonore « réponse juste » commence avant que la dernière case soit illuminée

    Scénario: Dans un mot juste, les caractères déjà écrits ne s'illuminent pas
      Étant donné qu'une leçon de test a un exercice dictée du mot « arc-en-ciel »
      Quand Léa écrit « arcenciel »
      Alors les 9 cases s'illuminent l'une après l'autre, de la première à la dernière
      Mais les deux tirets ne s'illuminent pas

    Scénario: Un mot faux montre ses lettres fausses en rouge, comme aujourd'hui, et aucune case ne s'illumine
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « chas »
      Alors la lettre « s » est montrée en rouge
      Et aucune case ne s'illumine
      Et Noisette dit un encouragement, suivi de « Regarde les lettres en rouge et écoute encore. », puis redit « chat »
      Et ensuite, il reste « cha » écrit et une case vide

    Scénario: Après « Je ne sais pas », la lettre montrée par le personnage guide garde son signal, et ne s'allume pas
      Étant donné que Léa joue un exercice dictee d'une leçon de test
      Quand Léa dit « Je ne sais pas »
      Alors la lettre juste suivante s'écrit dans sa case, sans montrer tout le mot
      Et cette case se voit comme une lettre montrée par le personnage guide, pas comme une case allumée

    # Décision #128.14 (reco retenue : le mot est réussi, toutes ses cases s'illuminent, la lettre montrée comprise)
    Scénario: Après « Je ne sais pas », le mot juste s'illumine aussi sur la lettre montrée
      Étant donné que Léa joue un exercice dictee d'une leçon de test
      Et que Léa a dit « Je ne sais pas »
      Quand Léa écrit la fin du mot
      Alors toutes les cases du mot s'illuminent l'une après l'autre, la case de la lettre montrée comprise

    Scénario: En Muet, le mot juste s'illumine et « réponse juste » se fait entendre, sans parole
      Étant donné que la tablette est en Muet
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « chat »
      Alors les 4 cases s'illuminent l'une après l'autre, de la première à la dernière
      Et Léa entend l'effet sonore « réponse juste »
      Mais Léa n'entend aucune parole

  Règle: Au clavier de cristaux, une touche de chiffre touchée a un éclat bref, qui ne ressemble jamais à la bonne réponse montrée par « Je ne sais pas » ; l'éclat ne donne aucune réponse

    Scénario: Une touche de chiffre touchée a un éclat bref et écrit son chiffre
      Étant donné que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand Tom touche la touche « 7 » du clavier de cristaux
      Alors la touche « 7 » a un éclat bref, puis redevient comme les autres touches
      Et Tom voit « 7 »
      Mais la touche « 7 » ne brille pas comme une bonne réponse montrée

    Scénario: Pendant la fluence, une touche de chiffre touchée a le même éclat bref
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles »
      Quand Léa touche la touche « 4 » du clavier de cristaux
      Alors la touche « 4 » a un éclat bref, puis redevient comme les autres touches
      Et Léa voit « 4 » dans le nombre tapé

    Scénario: Après « Je ne sais pas », la touche touchée a un éclat, et seule la bonne réponse brille
      Étant donné que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Et que Tom a dit « Je ne sais pas »
      Quand Tom touche la touche « 3 » du clavier de cristaux
      Alors la touche « 3 » a un éclat bref, puis redevient comme les autres touches
      Et seule la touche « 7 » brille

    # Décision #128.5 (reco retenue : oui, le même éclat, quel que soit le moyen de taper)
    Scénario: Un chiffre tapé au clavier de l'ordinateur donne le même éclat à sa touche
      Étant donné que Tom joue sur un ordinateur, au clavier
      Et que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand Tom tape « 7 » au clavier seulement
      Alors la touche « 7 » a un éclat bref, puis redevient comme les autres touches
      Et Tom voit « 7 »

    # Décision #128.4 (reco retenue : éclat sur « Effacer »)
    Scénario: « Effacer » touché a un éclat bref et efface le dernier chiffre
      Étant donné que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Et que Tom a tapé « 18 »
      Quand Tom touche « Effacer »
      Alors « Effacer » a un éclat bref, puis redevient comme avant
      Et Tom voit « 1 »

    # Décision #128.4 (reco retenue : pas d'éclat sur « Valider », qui garde le rebond de #97)
    Scénario: « Valider » garde le rebond d'une réponse juste, sans éclat
      Étant donné que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand Tom répond « 7 » au clavier de cristaux
      Alors « Valider » rebondit, sans éclat
      Et le calcul « 12 − 5 » est réussi

    # Décision #128.13 (reco retenue : pas d'éclat quand le chiffre ne s'écrit pas)
    Scénario: Un cinquième chiffre ne s'écrit pas, et sa touche n'a pas d'éclat
      Étant donné que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Et que Tom a tapé « 1234 »
      Quand Tom touche la touche « 5 » du clavier de cristaux
      Alors Tom voit « 1234 »
      Et la touche « 5 » n'a pas d'éclat

    Scénario: Quand le temps de la fluence est écoulé, toucher une touche ne fait rien, pendant la fête du record
      Étant donné que Léa a un record de 3 à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence
      Et que le temps de la fluence est écoulé avec 5 calculs réussis
      Quand Léa touche la touche « 4 » du clavier de cristaux
      Alors aucune touche n'a d'éclat
      Et le compteur défile jusqu'au nouveau record, 5
      Et Léa voit toujours 5 calculs réussis

  Règle: Pendant la fluence, le record de fluence se voit comme une marque à atteindre, jamais comme une course ; sans record connu, aucune marque ; le chrono reste

    Scénario: Avec un record, la marque du record se voit dès le début de la fluence, avec le chrono
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : les doubles »
      Et que Léa est sur la page de la leçon « Les doubles »
      Et que Léa a choisi seulement l'exercice « Calcul rapide : les doubles »
      Quand Noisette dit « C'est parti ! »
      Alors Léa voit la marque du record « Ton record : 12 »
      Et Léa voit le temps qui reste, 45 secondes, et 0 calcul réussi

    Scénario: Sans record, aucune marque du record
      Étant donné que Léa n'a pas encore de record à la fluence « Calcul rapide : les doubles »
      Et que Léa est sur la page de la leçon « Les doubles »
      Et que Léa a choisi seulement l'exercice « Calcul rapide : les doubles »
      Quand Noisette dit « C'est parti ! »
      Alors Léa ne voit aucune marque du record
      Et Léa voit le temps qui reste, 45 secondes, et 0 calcul réussi

    # Décision #128.8 (reco retenue : sans record lu, aucune marque, et rien n'est gardé dans l'appareil)
    Scénario: Quand le record ne peut pas être lu, aucune marque, et aucun message d'erreur
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : les doubles »
      Mais que le record de Léa ne peut pas être lu
      Et que Léa est sur la page de la leçon « Les doubles »
      Et que Léa a choisi seulement l'exercice « Calcul rapide : les doubles »
      Quand Noisette dit « C'est parti ! »
      Alors Léa ne voit aucune marque du record
      Et aucun message d'erreur n'apparaît

    Scénario: Rien ne présente la fluence comme une course
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : les doubles »
      Et que Léa est sur la page de la leçon « Les doubles »
      Et que Léa a choisi seulement l'exercice « Calcul rapide : les doubles »
      Quand Noisette dit « C'est parti ! »
      Alors Léa voit la marque du record « Ton record : 12 »
      Mais Léa ne voit ni le mot « course », ni ligne d'arrivée, ni podium

    # Décision #128.3 (reco retenue : une petite marque posée à côté du score, jamais sur la barre de temps)
    Scénario: La marque du record se pose à côté du score, pas sur la barre de temps
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : les doubles »
      Et que Léa est sur la page de la leçon « Les doubles »
      Et que Léa a choisi seulement l'exercice « Calcul rapide : les doubles »
      Quand Noisette dit « C'est parti ! »
      Alors la marque du record est à côté du nombre de calculs réussis
      Mais elle n'est pas posée sur la barre de temps

  Règle: Quand le score de fluence dépasse le record, la marque change de couleur, sans son, sans arrêt et sans parole ; un score égal au record ne change rien ; la fête reste celle de la fin

    Plan du Scénario: Avec un record de 3, passer de <avant> à <après> calculs réussis laisse la marque <état>
      Étant donné que Léa a un record de 3 à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence, avec <avant> calculs réussis
      Quand Léa donne une bonne réponse
      Alors Léa voit <après> calculs réussis
      Et la marque du record est <état>
      Et la marque du record montre toujours « Ton record : 3 »

      Exemples:
        | avant | après | état        |
        | 1     | 2     | à atteindre |
        | 2     | 3     | à atteindre |
        | 3     | 4     | dépassée    |
        | 5     | 6     | dépassée    |

    Scénario: Dépasser le record ne fait entendre aucun son de plus, et la fluence continue
      Étant donné que Léa a un record de 3 à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence, avec 3 calculs réussis
      Quand Léa donne une bonne réponse
      Alors la marque du record est dépassée
      Mais Léa n'entend ni l'effet sonore « grande victoire » ni l'effet sonore « découverte »
      Et Noisette ne dit rien
      Et le temps qui reste continue de passer, et Léa peut encore répondre

    Scénario: Une réponse fausse après le record dépassé laisse la marque dépassée
      Étant donné que Léa a un record de 3 à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence, avec 4 calculs réussis
      Quand Léa donne une réponse fausse
      Alors Léa voit toujours 4 calculs réussis
      Et la marque du record est dépassée

    Scénario: La marque dépassée ne ressemble ni à la bonne réponse montrée, ni à une erreur
      Étant donné que Léa a un record de 3 à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence, avec 3 calculs réussis
      Quand Léa donne une bonne réponse
      Alors la marque du record est dépassée
      Mais elle ne brille pas comme une bonne réponse montrée
      Et elle n'a pas le rouge d'une lettre fausse

    Scénario: Un record dépassé pendant la fluence est fêté à la fin seulement, une seule fois
      Étant donné que Léa a un record de 3 à la fluence « Calcul rapide : les doubles »
      Et que Léa joue seulement l'exercice « Calcul rapide : les doubles »
      Quand le temps de la fluence est écoulé avec 5 calculs réussis
      Alors le compteur défile jusqu'au nouveau record, 5
      Et Léa entend une seule fois l'effet sonore « grande victoire »

    # Décision #128.7 (reco retenue : la marque disparaît dès que le temps est écoulé ; la fin appartient à #97)
    Plan du Scénario: Quand le temps est écoulé, la marque du record disparaît (<cas>)
      Étant donné que Léa a un record de <record> à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence
      Quand le temps de la fluence est écoulé avec 5 calculs réussis
      Alors Léa ne voit plus la marque du record
      Et <suite>

      Exemples:
        | cas                 | record | suite                                                       |
        | record battu        | 3      | le compteur défile jusqu'au nouveau record, 5               |
        | record qui reste    | 8      | aucun compteur ne défile jusqu'à un record                  |

  Règle: Avec les mouvements réduits, rien ne bouge : la case s'allume, le mot juste s'illumine d'un coup, la touche change brièvement de couleur et la marque change de couleur aussitôt ; les lecteurs d'écran annoncent la même chose qu'avant

    Scénario: Avec les mouvements réduits, une lettre écrite allume sa case sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « c »
      Alors la case 1 est allumée, sans bouger

    Scénario: Avec les mouvements réduits, le mot juste s'illumine d'un coup, toutes ses cases ensemble
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Et que Léa a écrit « cha »
      Quand Léa écrit la lettre « t »
      Alors les 4 cases s'illuminent toutes ensemble, sans cascade ni mouvement
      Et Noisette dit une félicitation, suivie de « « chat » est bien écrit ! »

    Scénario: Avec les mouvements réduits, l'éclat d'une touche est un bref changement de couleur, sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand Tom touche la touche « 7 » du clavier de cristaux
      Alors la touche « 7 » change brièvement de couleur, sans grandir ni bouger
      Et Tom voit « 7 »

    Scénario: Avec les mouvements réduits, la marque change de couleur aussitôt, sans bouger
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a un record de 3 à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence, avec 3 calculs réussis
      Quand Léa donne une bonne réponse
      Alors la marque du record est dépassée
      Et la marque du record ne bouge pas

    Scénario: Le temps qui reste et le score restent annoncés comme avant, et la marque n'est pas annoncée
      Étant donné que Léa a un record de 3 à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence, avec 3 calculs réussis
      Quand Léa réussit un calcul
      Alors les lecteurs d'écran peuvent lire le temps qui reste et le nombre de calculs réussis
      Mais les lecteurs d'écran n'annoncent ni la marque du record ni son changement de couleur

    Scénario: Les lecteurs d'écran annoncent les cases de la dictée comme avant, sans dire qu'elles sont allumées
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « ch »
      Alors les lecteurs d'écran annoncent « Case 1 : c », « Case 2 : h », « Case 3, vide » et « Case 4, vide »
      Mais les lecteurs d'écran n'annoncent ni « allumée » ni « illuminée »

  Règle: Dans chacun des 6 univers, la case de la dictée, la touche du clavier de cristaux et la marque du record ont le dessin de cet univers ; changer d'univers ne change ni les gestes, ni les textes lus, ni les signaux communs ; un profil sans univers connu voit les dessins de l'univers « Animaux de la forêt »

    # Questions #128.2 (objet de la case) et 98.31 (la PR attend les 6 dessins)
    Plan du Scénario: Dans l'univers « <univers> », les cases de la dictée ont le dessin de cet univers et s'annoncent comme avant
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « c »
      Alors les 4 cases ont le dessin de l'univers « <univers> »
      Et la case 1 est allumée
      Et les lecteurs d'écran annoncent « Case 1 : c », « Case 2, vide », « Case 3, vide » et « Case 4, vide »

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Décision #128.1 (reco A retenue : la touche reste un cristal dans les 6 univers, le nom ne change pas)
    Plan du Scénario: Dans l'univers « <univers> », les touches du clavier de cristaux ont le dessin de cet univers, et le clavier s'annonce toujours « Clavier de cristaux »
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa fait la fluence « Calcul rapide : les doubles »
      Quand Léa touche la touche « 4 » du clavier de cristaux
      Alors les touches de chiffres du clavier de cristaux ont le dessin de l'univers « <univers> »
      Et la touche « 4 » a le même éclat bref que dans l'univers « Animaux de la forêt »
      Et les lecteurs d'écran annoncent toujours « Clavier de cristaux » et « Nombre tapé »

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Décision #128.3 (objet de la marque, jamais une étoile)
    Plan du Scénario: Dans l'univers « <univers> », la marque du record a le dessin de cet univers et change de couleur quand le record est dépassé
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa a un record de 3 à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence, avec 3 calculs réussis
      Quand Léa donne une bonne réponse
      Alors la marque du record a le dessin de l'univers « <univers> »
      Et la marque du record est dépassée
      Et la marque du record montre toujours « Ton record : 3 »

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Décision #128.4 (reco retenue : « Effacer » et « Valider » gardent leur aspect commun)
    Scénario: « Effacer » et « Valider » gardent leur aspect commun dans un autre univers
      Étant donné que Léa a choisi l'univers sports
      Quand Léa fait la fluence « Calcul rapide : les doubles »
      Alors les touches de chiffres du clavier de cristaux ont le dessin de l'univers « Sports »
      Mais « Effacer » et « Valider » ont le même aspect que dans l'univers « Animaux de la forêt »

    Plan du Scénario: Dans l'univers « <univers> », la touche montrée par « Je ne sais pas » brille comme dans tous les univers
      Étant donné que Tom a un profil enfant préparé de niveau CE1 dans l'univers « <univers> »
      Et que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand Tom dit « Je ne sais pas »
      Alors seule la touche « 7 » brille
      Et elle brille de la même façon que dans l'univers « Animaux de la forêt »

      Exemples:
        | univers             |
        | Princesses et fées  |
        | Sports              |
        | Police              |
        | Pompiers            |
        | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », une lettre fausse est montrée en rouge comme dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « chas »
      Alors la lettre « s » est montrée en rouge, de la même façon que dans l'univers « Animaux de la forêt »
      Et aucune case ne s'illumine

      Exemples:
        | clé       | univers             |
        | princesse | Princesses et fées  |
        | pompier   | Pompiers            |

    Plan du Scénario: Dans l'univers « <univers> », un mot mal écrit puis bien écrit donne 2 étoiles, comme dans l'univers « Animaux de la forêt »
      Étant donné que Léa a choisi l'univers <clé>
      Et que Paul a réglé « clavier des dictées » sur « clavier complet » pour Léa
      Et qu'une leçon de test a un seul exercice dictée du mot « chat »
      Et que Léa a écrit « bxyz »
      Quand Léa écrit ensuite « chat »
      Alors Léa gagne 2 étoiles

      Exemples:
        | clé    | univers |
        | police | Police  |
        | danse  | Danse   |

    Plan du Scénario: Un profil enfant <cas> voit <cible> avec le dessin de l'univers « Animaux de la forêt »
      Étant donné que Léa a un profil enfant préparé <cas>
      Et que <situation>
      Quand <action>
      Alors <cible> ont le dessin de l'univers « Animaux de la forêt »
      Et aucun message d'erreur n'apparaît

      Exemples:
        | cas                        | cible                                          | situation                                                            | action                      |
        | sans univers               | les 4 cases                                    | Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux » | Léa écrit « c »             |
        | dont l'univers est inconnu | les touches de chiffres du clavier de cristaux | Léa fait la fluence « Calcul rapide : les doubles »                  | Léa donne une bonne réponse |

    # Décision #128.9 (reco retenue : le clavier de cristaux a le dessin de l'univers partout où il sert)
    Scénario: Dans une boîte à jetons, le clavier de cristaux a aussi le dessin de l'univers
      Étant donné que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Sports »
      Et qu'une leçon de test a une boîte à jetons « 4 + 3 »
      Quand Tom joue cette boîte à jetons et que la boîte est fermée
      Alors Tom répond au clavier de cristaux
      Et les touches de chiffres du clavier de cristaux ont le dessin de l'univers « Sports »

  Règle: Dans chacun des 6 univers, cases, touches et marque tiennent à 360 px de large, gardent 44 px pour toucher et s'affichent en mode dys ; le texte reste du texte, lisible sur le dessin

    Plan du Scénario: Dans l'univers « <univers> », la fluence avec la marque du record tient dans un écran de 360 px
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et que Léa a un record de 3 à la fluence « Calcul rapide : les doubles »
      Quand Léa fait cette fluence
      Alors la page tient dans la largeur de l'écran
      Et chaque touche du clavier de cristaux mesure au moins 44 px de haut et de large
      Et Léa voit en entier la marque du record « Ton record : 3 », le temps qui reste et 0 calcul réussi

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », les 8 cases de « éléphant » tiennent dans un écran de 360 px
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et qu'une leçon de test a un exercice dictée du mot « éléphant »
      Quand Léa écrit « éléph »
      Alors la page tient dans la largeur de l'écran
      Et Léa voit en entier les 8 cases, dont 5 allumées

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: En mode dys, les lettres écrites dans les cases s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa écrit « ch »
      Alors Léa voit les lettres écrites dans les cases en mode dys : police Andika, lettres espacées

    Scénario: En mode dys, les chiffres des touches et la marque du record s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa a un record de 12 à la fluence « Calcul rapide : les doubles »
      Quand Léa fait cette fluence
      Alors Léa voit les chiffres des touches et la marque du record en mode dys : police Andika, lettres espacées
