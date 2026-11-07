# Critères d'acceptance : issue #183, une barre du haut et une barre d'action en bas pour laisser la place à la leçon

Scénarios : `features/183-barres-de-la-seance.feature` (`@issue-183 @wip`).
Modèle : `docs/stories/183/domain-model.md` (règle `Seance.aRecuUneReponse()`, décisions 183.1 à 183.9).
État : **validé par le PO le 2026-11-07** (« OK ») : toutes les recommandations sont retenues (I1 à I3, 183.1 à
183.15 réponse A). Plus aucun scénario `@a-valider`.

13 règles, 48 scénarios (dont 3 plans : 7 exemples en tout).

## Objectif

En tant qu'**enfant**, pendant une leçon, je veux voir tout de suite l'exercice et le bouton pour répondre, sans
défiler, **afin de rester concentré sur ce que j'apprends**.

Constat de l'issue : sur 360 × 740, l'exercice commence aujourd'hui à 703 px ; avec la maquette validée par le PO,
il commence à 194 px. Définition de « terminé » : sur 360 × 740, l'exercice commence au plus à 210 px du haut (seuil
relevé de 200 à 210 px par la décision E2E-1).

Une seule règle relève du domaine (Apprentissage) : **Retour ouvre la pause de la séance seulement si la séance a
reçu une réponse** (`Seance.aRecuUneReponse()`). Le reste est de la présentation : React ne décide rien, il lit
`aRecuUneReponse()` et `avancement()`.

## Règles et exemples

| # | Règle | Exemples clés | Scénarios |
|---|---|---|---|
| R1 | Pendant la séance, l'en-tête de l'application disparaît ; la barre du haut porte Retour, le titre de la leçon et le choix Son/Muet | Léa commence « Les sons ou, on, an » : ni « Savanturier », ni « Léa · CP », ni Espace parent ; revenue sur la page de la leçon, l'en-tête revient | 2 |
| R2 | Le titre de la séance est le titre de la leçon seul, sans classe ni matière, sur deux lignes au plus | « Les sons ou, on, an » sans « CP » ni « Français » ; « Lire une œuvre : Vingt mille lieues sous les mers » (49 caractères) sur deux lignes à 360 px, sans mot coupé ; le titre nomme la séance pour les lecteurs d'écran | 3 |
| R3 | L'avancement de la séance se montre par une fine barre et un compteur « réussies / total », et reste lu par les lecteurs d'écran | « 0 / 6 » au début (183.11) ; « 1 / 6 » après « ou » à « poule » ; toujours « 0 / 6 » après « on » ; étapes de leçon : « 0 / 15 » ; « 9 / 9 » à la dernière étiquette ; « 1 sur 6 » annoncé | 6 |
| R4 | Avant la première réponse de la séance, Retour ramène directement à la page de la leçon | pendant la première étape de leçon ; à la question « poule » pas encore répondue ; après la dernière étape de leçon (183.1) ; dictée « ch » (183.3) ; fluence sans réponse (183.4) | 3 (dont 1 plan, 3 exemples) |
| R5 | À partir de la première réponse, juste, fausse ou « Je ne sais pas », Retour ouvre la pause de la séance | « ou » ou « on » à « poule » ; « Je ne sais pas » (183.2) ; dictée « chas » (183.3) ; fluence à 2 calculs réussis (183.4) ; « 7 » à « 3 + 4 » avant la fin de la séance (183.5) ; la pause rouvre après « Je continue la leçon » ; ni compte à rebours, ni reproche, ni avertissement (183.9) | 7 (dont 1 plan, 2 exemples) |
| R6 | « Je continue la leçon » ferme la pause : la séance reprend au même exercice, sans rien perdre | même question « poule » et 0 réussie sur 6 ; « mouton » posée et « 1 / 6 » gardé ; 1 erreur avant la pause → 2 étoiles ; fluence : chrono non arrêté, 2 calculs gardés (183.6) | 4 |
| R7 | « Retour à la leçon » ramène à la page de la leçon ; la séance quittée n'est pas gardée | page de la leçon, voix coupée, 0 étoile ; la séance recommence à la première étape de leçon, « 0 / 15 » | 2 |
| R8 | Échap et le geste retour suivent la même règle que Retour | Échap ferme la pause, « 3 + 4 » reste posée ; geste retour avant réponse → page de la leçon, après « on » → pause ; geste retour, la pause ouverte → la pause se ferme (183.12) | 3 (dont 1 plan, 2 exemples) |
| R9 | La pause se lit au lecteur d'écran, en mode dys, au clavier, sans mouvement si l'appareil le demande | fenêtre « On fait une pause ? » annoncée, « Je continue la leçon » en premier ; police Andika et espacements ; apparition sans glisser ; choix de 52 px au moins à 360 px | 4 |
| R10 | Le personnage guide n'est montré que quand il réagit ; pendant une question, la consigne prend toute la largeur de la bulle | « Touche le bon nombre. » seule dans la bulle ; après « 3 », Noisette avec sa félicitation à la place de la consigne, puis la consigne revient ; après une réponse fausse, Noisette avec son encouragement, puis la même question (183.13) | 3 |
| R11 | Un seul bouton « Réécouter » : la consigne pendant une question, la parole du personnage guide après une réponse | plus de « Relire la consigne » (183.8) ; « Touche le bon nombre. » relue (183.10) ; sans consigne, la question « poule » relue (183.10) ; après « Je ne sais pas », « Pas de souci, on apprend ensemble ! La bonne réponse brille : touche-la. » redit | 4 |
| R12 | La barre d'action, en bas, porte le bouton principal et « Je ne sais pas » ; « Valider » seulement si l'exercice en a besoin | « Continuer » pendant une étape de leçon ; bulles : « Je ne sais pas » sans « Valider » ; clavier de cristaux : « Valider » mis en avant, « Je ne sais pas » plus discret à côté, 52 px au moins ; classer : « Je ne sais pas » aussi (décision I3) | 4 |
| R13 | Sur 360 × 740, l'exercice et ses boutons se voient dès le début, sans défiler | bulles « poule » : exercice à 210 px au plus du haut (E2E-1), question, choix et « Je ne sais pas » visibles ; calcul « 12 − 5 » : carte, clavier, « Valider », « Je ne sais pas » visibles ; commandes de 44 px au moins | 3 |

**Droits d'accès** : aucun scénario `@acces`. La story n'ajoute ni table, ni donnée, ni Edge Function : la pause de
la séance n'est ni enregistrée ni envoyée, et la séance quittée ne l'est pas non plus (comme aujourd'hui).

## Scénarios, par règle

**R1. Plus d'en-tête de l'application pendant la séance**
- Pendant la séance, Léa ne voit ni « Savanturier », ni son prénom, ni l'Espace parent
- Revenue sur la page de la leçon, Léa retrouve l'en-tête de l'application

**R2. Le titre de la leçon seul**
- Le titre de la séance ne dit ni la classe ni la matière
- Sur un écran de 360 px de large, le titre le plus long de la bibliothèque tient sur deux lignes au plus, sans mot coupé
- Les lecteurs d'écran nomment la séance par le titre de la leçon

**R3. Fine barre et compteur de l'avancement de la séance**
- Au début d'une séance d'un exercice de 6 questions, le compteur affiche « 0 / 6 » et la barre est vide (décision 183.11)
- Une question réussie fait passer le compteur à « 1 / 6 » et remplit la barre d'un pas
- Une réponse fausse ne fait reculer ni avancer le compteur
- Les étapes de leçon ne font pas avancer le compteur
- À la dernière question réussie, le compteur affiche « 9 / 9 » et la barre est pleine
- L'avancement de la séance reste lu par les lecteurs d'écran

**R4. Avant la première réponse, Retour ramène à la page de la leçon**
- Plan : Avant toute réponse, quand <situation>, Retour ramène à la page de la leçon (première étape de leçon en cours ; question pas encore répondue ; dernière étape de leçon lue, décision 183.1)
- En dictée, des lettres écrites sans finir le mot ne sont pas encore une réponse : Retour ramène à la page de la leçon (décision 183.3)
- Pendant une fluence, sans aucune réponse, Retour ramène à la page de la leçon (décision 183.4)

**R5. Après la première réponse, Retour ouvre la pause de la séance**
- Plan : Après une réponse <genre>, Retour ouvre la pause de la séance (juste, fausse)
- Après « Je ne sais pas », Retour ouvre la pause de la séance (décision 183.2)
- En dictée, après un mot écrit en entier, Retour ouvre la pause de la séance (décision 183.3)
- Pendant une fluence, après des calculs réussis, Retour ouvre la pause de la séance (décision 183.4)
- Après la dernière bonne réponse, avant la fin de la séance, Retour ouvre la pause de la séance (décision 183.5)
- Une réponse donnée ne s'efface pas : après « Je continue la leçon », Retour rouvre la pause de la séance
- La pause de la séance ne fait aucun reproche, n'affiche aucun compte à rebours et ne prévient de rien (décision 183.9)

**R6. « Je continue la leçon »**
- Après une réponse fausse, « Je continue la leçon » laisse la même question posée
- « Je continue la leçon » garde les questions réussies
- La pause de la séance n'ajoute ni n'efface aucune erreur : une erreur avant la pause donne 2 étoiles
- Pendant une fluence, la pause de la séance n'arrête pas le chrono et garde les calculs réussis (décision 183.6)

**R7. « Retour à la leçon »**
- « Retour à la leçon » ramène à la page de la leçon, coupe la voix et ne change pas les étoiles
- Une séance quittée par « Retour à la leçon » recommence du début

**R8. Échap et geste retour**
- Au clavier, Échap ferme la pause de la séance et la même question attend Léa
- Plan : Le geste retour, quand <situation>, fait comme le bouton Retour (avant réponse → page de la leçon ; après « on » → pause)
- Quand la pause de la séance est ouverte, le geste retour la ferme et la séance reprend (décision 183.12)

**R9. Accessibilité de la pause de la séance**
- La pause de la séance est annoncée aux lecteurs d'écran par son titre, « Je continue la leçon » en premier
- Avec le mode dys, la pause de la séance s'affiche en mode dys
- Quand l'appareil demande des mouvements réduits, la pause de la séance apparaît sans glisser
- Sur un écran de 360 px de large, les choix de la pause de la séance se touchent facilement

**R10. Le personnage guide seulement quand il réagit**
- Pendant une question, la consigne s'affiche seule dans la bulle, sans le personnage guide à côté
- Après une bonne réponse, Noisette se montre à la place de la consigne, puis la consigne revient (décision 183.13)
- Après une réponse fausse, Noisette se montre à la place de la consigne avec son encouragement, puis la même question attend Léa (décision 183.13)

**R11. Un seul « Réécouter »**
- La séance ne propose qu'un seul « Réécouter », sans « Relire la consigne » (décision 183.8)
- Pendant une question, « Réécouter » relit la consigne et laisse la question posée (décision 183.10)
- Dans un exercice sans consigne, « Réécouter » relit la question (décision 183.10)
- Après « Je ne sais pas », « Réécouter » redit la parole du personnage guide

**R12. Barre d'action**
- Pendant une étape de leçon, « Continuer » est dans la barre d'action
- Dans un exercice bulles, la barre d'action porte « Je ne sais pas » sans « Valider » : Léa répond en touchant une bulle
- Au clavier de cristaux, « Valider » et « Je ne sais pas » sont dans la barre d'action, « Valider » mis en avant
- Dans un exercice classer, « Je ne sais pas » est aussi dans la barre d'action (décision I3)

**R13. 360 × 740 sans défiler**
- Dans un exercice bulles, la question, ses choix et « Je ne sais pas » se voient sans défiler
- Au clavier de cristaux, le calcul, le clavier, « Valider » et « Je ne sais pas » se voient sans défiler
- Sur un écran de 360 px de large, Retour, le choix Son/Muet et « Réécouter » se touchent facilement

## Notes pour l'équipe (étapes E2E)

- Les étapes existantes sont réutilisées autant que possible ; `npx bddgen --tags "@issue-183"` ne signale aucune
  ambiguïté, seulement des étapes à écrire (33 textes nouveaux : en-tête absent, barre du haut, titre, compteur et
  barre de l'avancement, pause de la séance, Échap, Noisette à la place de la consigne, barre d'action, mesures
  360 × 740). Aucune nouvelle étape ne se termine par « applaudit en sautant » ni « réfléchit en penchant la tête »,
  déjà prises par des expressions régulières génériques.
- « Léa revient en arrière » réutilise l'étape non taguée de `parcours.steps.ts` (geste retour du navigateur).
- Étapes existantes à faire passer par la pause de la séance : « Léa quitte la séance » (#16, Retour cliqué, reste vrai
  avant la première réponse), « Léa a quitté la séance complète de la leçon « … » après 3 questions réussies » (#16,
  réutilisée ici), « Léa a quitté une séance complète de cette leçon avant la dernière question » (#24), « Léa a quitté
  la séance de la leçon « … » avant la fin » (#29), « séance quittée avant la fin » (#163) : après une réponse, elles
  doivent choisir « Retour à la leçon ». Les steps qui cherchent « Relire la consigne » (`voix.steps.ts`) passent au
  bouton « Réécouter » (décision 183.8).
- Le titre le plus long est une leçon de CM2 ouverte par sa page de la leçon avec le profil CP de Léa : l'étape
  « Léa est sur la page de la leçon « … » » doit y mener directement (sinon, préparer un profil de CM2).
- Dictée : « Léa joue le mot dicté « chat » » ne doit pas avoir répondu aux mots précédents, sinon la séance a déjà
  reçu une réponse (vérifier que « chat » est le premier mot de « J'écris les animaux », ou jouer l'exercice seul).

## Règle absolue sur les contenus

Les textes nouveaux de la story (« On fait une pause ? », « Je continue la leçon », « Retour à la leçon ») sont
doux et sans reproche ; la pause de la séance n'a ni compte à rebours ni avertissement. Les données des scénarios
reprennent des leçons et des questions déjà employées (sons, animaux, calculs). Rien n'est produit par l'IA ni
saisi par un parent.

## Hors périmètre

- Le profil compact et le dock avec icônes hors de la séance (issue suivante).
- Le test de départ, la séance de révision, le défi et le grand défi : story suivante (décision I1). Seule la
  séance d'une leçon, complète ou d'un exercice, change.
- La tablette en paysage (garder le personnage guide à côté de la bulle) : à trancher plus tard, aucun scénario
  (décision I2).
- La fin de la séance : elle garde ses propres boutons (sans en-tête de l'application, décision 183.15).
- Toute donnée enregistrée : ni la pause de la séance, ni la séance quittée ne sont gardées.
- Tout changement des félicitations, encouragements, aides, effets sonores, de la scène de réponse fausse (#163).

## Questions ouvertes

Aucune.

## Décisions du PO (2026-11-07)

Réponse du PO : « OK », toutes les recommandations sont retenues.

Questions de l'issue :

- **I1.** Test de départ, révision et défis ? **Décision** : présentation seulement pour la séance d'une leçon
  (complète ou d'un exercice) ; le test de départ, la révision et les défis passent dans une story suivante (qui
  ajoutera la même requête `aRecuUneReponse()` à `SeanceDeRevision`, `SeanceDeDefi` et `TestDeDepart`).
- **I2.** Tablette en paysage : garder le personnage guide à côté de la bulle ? **Décision** : à trancher plus
  tard ; aucun scénario dans cette story.
- **I3.** « Je ne sais pas » et « Valider » dans la barre d'action pour quels types ? **Décision** : pour **tous les
  types** d'exercices dans cette story (scénario classer).

Questions du modèle (`docs/stories/183/domain-model.md`), réponse A retenue :

1. **183.1** Lire une étape de leçon n'est pas une réponse : Retour ramène à la page de la leçon.
2. **183.2** « Je ne sais pas » est une réponse : la pause de la séance s'ouvre.
3. **183.3** Dictée : seul le mot écrit en entier est une réponse, pas une lettre écrite.
4. **183.4** Fluence : démarrer le chrono n'est pas une réponse ; la première réponse pendant le chrono l'est.
5. **183.5** Après la dernière bonne réponse, avant la fin de la séance, Retour ouvre la pause de la séance.
6. **183.6** La pause de la séance n'arrête pas le chrono d'une fluence.
7. **183.7** On garde le mot : « Pause de la séance » est un terme ; « pause » seul reste interdit pour la durée
   d'affichage sans voix. Les scénarios disent « la pause de la séance ».
8. **183.8** « Relire la consigne » n'a plus de bouton à lui : un seul « Réécouter ». La ligne du glossaire
   « Relire la consigne » sera marquée remplacée par #183 à la clôture de la story.
9. **183.9** Aucun avertissement sur les réponses non gardées dans la pause de la séance.

Questions ajoutées par les critères d'acceptance, réponse A retenue :

10. **183.10** Pendant une question, « Réécouter » relit ce qui a été lu au début de la question : la consigne puis
    la question ; sans consigne, la question seule.
11. **183.11** Le compteur montre les questions réussies (« 0 / 6 » au début, « 1 / 6 » après la première réussie),
    comme l'avancement de la séance du domaine.
12. **183.12** Le geste retour, la pause de la séance ouverte, la ferme comme Échap ; la séance reprend sans rien
    perdre.
13. **183.13** La parole du personnage guide reste écrite près de lui pendant qu'il réagit, puis la consigne revient
    quand il a fini de parler (en Muet, après la durée d'affichage sans voix) ; les scénarios de #163 restent vrais.
14. **183.14** La voix s'arrête à l'ouverture de la pause de la séance ; « Je continue la leçon » ne relit rien
    (« Réécouter » est là). Aucun scénario ne le vérifie encore.
15. **183.15** Pas d'en-tête de l'application à la fin de la séance non plus ; il revient sur la page de la leçon et
    hors de la séance. Aucun scénario ne le vérifie encore.

Décisions du PO après le premier passage E2E (2026-11-07) :

- **E2E-1** : #79 adapté (« Avec la voix, la consigne revient quand Noisette a fini son encouragement », au lieu
  de « … la consigne reste visible pendant l'encouragement du personnage guide », qui contredisait 183.13) ; #163
  addition posée adaptée (« Avec l'addition posée sur un écran de 360 px, Coach Léo joue sa scène de réponse
  fausse ») ; le personnage guide est affiché à environ 100 px quand il réagit, et sa hauteur est réservée ; le
  seuil devient 210 px (« le début de l'exercice est à 210 px au plus du haut de l'écran »). Le scénario « mode
  dys » de #163 ne change pas. Tag `@wip` retiré de la fonctionnalité : ses scénarios passent.
