# Critères d'acceptance : issue #27, Test de départ

Scénarios : `features/27-test-de-depart.feature` (tags `@issue-27 @wip`).
Modèle du domaine : `docs/stories/27/domain-model.md` (contexte **Apprentissage**, qui lit le **Catalogue pédagogique** et **Famille**). Les questions 27.1 à 27.16 en viennent ; 27.17 à 27.23 sont ajoutées ici.

Le PO a retenu toutes les recommandations des questions 27.1 à 27.23 (voir « Décisions »). Les scénarios qui en dépendent portent un commentaire `# Réponse 27.n` ; aucun ne porte plus `@a-valider`.

## Objectif

En tant qu'**enfant**, je veux répondre à quelques questions de français et de maths au début, afin que mon **parcours** commence là où j'en suis, sans refaire ce que je sais déjà.

Le test de départ se joue dans le navigateur, même sans réseau, avec la correction de la séance (nouvelle chance, « Je ne sais pas »). Il **n'est pas une séance** : il ne donne pas d'étoiles. Il rend des **leçons réussies au test de départ**, sans étoile, qui comptent comme réussies dans le parcours de #25 (aucun verrou) :
- la **prochaine leçon** (« À toi ! ») est la première leçon non réussie du parcours ;
- la **leçon suivante** en fin de séance saute les leçons réussies.

Le test de départ s'exprime donc ainsi : après lui, quelle leçon est « À toi ! ». Avec la règle retenue (27.2 b), c'est la première leçon que l'enfant ne sait pas.

Le comportement actuel (`app/`, `offerTest`, `buildTest`, `playLesson` partie `test`) donne les premiers exemples. Les écarts voulus ont été tranchés par le PO : 27.2, 27.7, 27.10, 27.14, 27.17, 27.19.

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Le test de départ est proposé après la création d'un profil enfant, puis depuis l'accueil de l'enfant tant qu'il n'est pas fait | création de Léa → « Bonjour Léa ! Veux-tu faire un petit jeu de questions ? … » avec « Oui, on y va ! » et « Plus tard » · ajout de Tom → proposition pour Tom · « Oui, on y va ! » → « C'est parti ! … », question de « Les voyelles », sans étape de leçon · « Plus tard » ou retour → accueil avec « Mon test de départ » · test fait, jusqu'au bout ou arrêté → plus de bouton · passage en CE2 → pas de nouvelle proposition · bibliothèque non chargée → pas de bouton |
| 2. Au plus 12 questions de français et de maths, jusqu'au niveau de l'enfant, de la plus facile à la plus difficile | CE1 : 19 leçons dans la réserve → 12 questions à pas réguliers, du CP au CE1, sans « Le futur » (CE2) ni « Les cinq sens » (sciences) · CP : 10 leçons, « La dictée des sons » sautée → 9 questions |
| 3. Une question est juste seulement sans aucune erreur ; « Je ne sais pas » est toujours permis ; on continue avec la bonne réponse | « Je ne sais pas » dès la première question, et de nouveau à la suivante · erreur → encouragement, « Essaie une autre bulle. », même question · « L'ordre alphabétique » juste → prochaine leçon « Le pluriel des noms » ; après une erreur ou « Je ne sais pas » → « L'ordre alphabétique » |
| 4. Arrêt après 3 questions fausses de suite ; quitté en cours, rien n'est enregistré | fausses à Q1, Q2, Q3 (erreur ou « Je ne sais pas ») → fin · F, F, J, F, F → la question 6 est posée · 3 erreurs à Q1 → Q2 posée · quitter après 10 questions → accueil, bouton encore là, parcours inchangé |
| 5. Le parcours commence à la première leçon que l'enfant ne sait pas ; le test de départ ne change jamais une étoile | tout juste → français CE1 : 3 réussies au test de départ, « Le pluriel des noms » à toi · fausse à « L'ordre alphabétique » → elle est à toi, « Le son in » et « Les mots contraires » réussies · maths toutes réussies → pas d'« À toi ! » · aucune juste → « Le son in » à toi · 3 étoiles gardées · 2 étoiles gardées malgré une question fausse · séance après le test → 1 étoile · compteur « 3 leçons réussies sur 5 » · « Ensuite : Les mots contraires » · « Déjà réussies en CE2 » |
| 6. La fin dit combien de leçons l'enfant connaît déjà, sans étoiles, et mène au parcours | « Voir mon parcours » seul, sans étoile · 17 leçons (CP compris) · « 1 leçon : je l'ai cochée » · aucune → « Maintenant, je sais par où commencer » · leçon déjà réussie non comptée · « Voir mon parcours » → « Français · CE1 » |
| 7. Le parent propose de nouveau le test de départ depuis l'espace parent ; une leçon réussie au test de départ le reste | « Refaire le test de départ » → proposition pour Léa · questions sur des leçons déjà réussies · « L'ordre alphabétique » reste réussie malgré une question fausse au second test · « Plus tard » → pas de bouton |
| 8. Sans réseau, à voix haute, au clavier, sur un petit écran | test sans réseau → parcours à jour · message « Sauvegarde en ligne impossible… » · question lue par Noisette · « Le son in : réussie au test de départ » · « Oui, on y va ! » au clavier · 360 px et 44 px (proposition, choix, « Je ne sais pas ») |
| 9. Le résultat est enregistré par le serveur, seulement pour un parent rattaché | envoi d'une question juste → plus de bouton sur le téléphone de Paul · refus : leçon de CE1 pour un CP, question après l'arrêt, question sans bonne réponse · Marie retrouve le parcours · le test de Tom ne touche pas Léa · Claire ne lit rien et n'enregistre rien |

## Règles

| # | Règle | Scénarios | Questions |
|---|---|---|---|
| 1 | Le test de départ est proposé après la création d'un profil enfant, puis depuis l'accueil de l'enfant tant qu'il n'est pas fait | Juste après la création de son profil, le personnage guide propose le test de départ à l'enfant · Le test de départ est aussi proposé après l'ajout d'un deuxième enfant · « Oui, on y va ! » commence le test de départ par sa première question, sans étape de leçon · Sans faire le test de départ, l'enfant revient à son accueil, qui le propose encore (2 cas : « Plus tard », retour) · Tant que le test de départ n'est pas fait, l'accueil de l'enfant le propose · Depuis l'accueil de l'enfant, « Mon test de départ » ouvre la proposition · Un test de départ fait n'est plus proposé sur l'accueil de l'enfant (2 cas : allé jusqu'au bout, arrêté) · Un enfant qui change de classe ne se voit pas proposer de nouveau le test de départ · Sans bibliothèque chargée, le test de départ n'est pas proposé, sans message d'erreur | 27.3, 27.5, 27.10, 27.16, 27.19 |
| 2 | Le test de départ pose au plus 12 questions de français et de maths, jusqu'au niveau de l'enfant, de la plus facile à la plus difficile | Le test de départ d'un enfant de CE1 pose 12 questions, du CP au CE1, de la plus facile à la plus difficile · Une leçon sans question possible est sautée, et le test de départ d'un enfant de CP pose moins de 12 questions | 27.6 |
| 3 | Une question du test de départ est juste seulement sans aucune erreur ; « Je ne sais pas » est toujours permis, et l'enfant donne la bonne réponse pour continuer | « Je ne sais pas » est proposé dès la première question du test de départ · Après « Je ne sais pas » et la bonne réponse, la question suivante propose de nouveau « Je ne sais pas » · Après une erreur, le personnage guide encourage et la même question reste posée · Une question répondue <manière> est <résultat>, ce qui fixe la prochaine leçon (3 cas) | 27.2 |
| 4 | Le test de départ s'arrête après 3 questions fausses de suite ; quitté en cours, il n'enregistre rien | Après 3 questions fausses de suite, le test de départ s'arrête (2 cas : erreur, « Je ne sais pas ») · Une question juste remet à zéro le compte des questions fausses de suite · Plusieurs erreurs à une même question ne comptent que pour une question fausse · Quitter le test de départ en cours ramène à l'accueil, qui le propose encore · Un test de départ quitté en cours ne change pas le parcours | 27.10, 27.13 |
| 5 | Le parcours commence à la première leçon que l'enfant ne sait pas, et le test de départ ne change jamais une étoile | Toutes les leçons jusqu'à la dernière question juste d'une matière sont réussies, même celles qui n'ont pas été posées · Le parcours commence à la première leçon dont la question est fausse · Une matière dont toutes les leçons sont réussies au test de départ n'a plus de prochaine leçon · Sans aucune question juste, le parcours ne change pas · Une leçon déjà réussie en séance garde ses étoiles après le test de départ · Une question fausse ne retire pas les étoiles d'une leçon déjà réussie · Une séance terminée donne ses étoiles à une leçon réussie au test de départ · Les leçons réussies au test de départ comptent parmi les leçons réussies du parcours · La leçon suivante saute une leçon réussie au test de départ · Redescendue en CE1, l'enfant retrouve à part sa leçon de CE2 réussie au test de départ | 27.1, 27.2, 27.7, 27.8, 27.15 |
| 6 | La fin du test de départ dit à l'enfant combien de leçons il connaît déjà, sans étoiles, et le mène à son parcours | La fin du test de départ ne montre pas d'étoiles et propose seulement « Voir mon parcours » · Le personnage guide dit combien de leçons l'enfant connaît déjà, celles des classes d'avant comprises · Avec une seule leçon connue, le personnage guide le dit au singulier · Sans question juste, le personnage guide dit qu'il sait par où commencer · Une leçon déjà réussie avant le test de départ n'est pas comptée parmi les leçons connues · « Voir mon parcours » ouvre le parcours de l'enfant | 27.2, 27.14, 27.17, 27.21, 27.23 |
| 7 | Le parent peut proposer de nouveau le test de départ depuis l'espace parent ; une leçon réussie au test de départ le reste | Depuis l'espace parent, « Refaire le test de départ » propose de nouveau le test de départ à l'enfant · Un test de départ refait pose aussi des questions sur les leçons déjà réussies · Une leçon réussie à un test de départ le reste, même si sa question est fausse au suivant · Après « Plus tard », un test de départ proposé de nouveau par le parent reste fait | 27.9 |
| 8 | Le test de départ se joue sans réseau, à voix haute, au clavier et sur un petit écran | Sans réseau, le test de départ se joue jusqu'au bout et le parcours se met à jour tout de suite · Sans réseau, la fin du test de départ dit que la progression est gardée sur l'appareil · Le personnage guide lit chaque question du test de départ · Un lecteur d'écran lit qu'une leçon est réussie au test de départ · Le test de départ se commence et se joue au clavier · La proposition du test de départ tient dans un écran de 360 px, avec des boutons assez grands pour un doigt d'enfant · Une question du test de départ tient dans un écran de 360 px, « Je ne sais pas » compris | 27.2, 27.7, 27.18 |
| 9 | Le résultat du test de départ est enregistré par le serveur, et seulement pour un parent rattaché au profil enfant | Un test de départ terminé envoyé par l'appareil est enregistré et se retrouve sur un autre appareil du parent (`@acces`) · Le serveur refuse un test de départ terminé incohérent, qui reste à faire (3 cas) · Le second parent rattaché retrouve sur son téléphone le parcours que le test de départ a fait avancer (`@acces`) · Le test de départ d'un enfant ne fait jamais avancer le parcours d'un autre enfant (`@acces`) · Un parent qui n'est pas rattaché ne lit pas le résultat du test de départ de Léa (`@acces`) · Un parent qui n'est pas rattaché ne peut pas enregistrer un test de départ pour Léa (`@acces`) | 27.12 (pas de scénario E2E) |

Total : 9 règles, 53 scénarios (60 cas), dont 0 `@a-valider` (29 avant les décisions du PO) et 5 `@acces`.

La story peut se livrer en deux temps :
1. le test de départ et sa proposition (règles 1 à 4, 6 à 9) ;
2. son effet sur le parcours (règle 5), qui touche le calcul et l'écran de #25.

Droits d'accès (`@acces`) :
- Le résultat du test de départ est une nouvelle donnée du profil enfant, sous RLS fondée sur le rattachement.
- Seul un parent rattaché le lit (Paul, Marie) et l'enregistre, par l'Edge Function avec son JWT.
- Claire, non rattachée, ne reçoit aucune ligne. Son envoi est refusé « comme pour un profil introuvable », mot pour mot comme une séance terminée (#24).
- Le scénario Léa / Tom vérifie que la lecture est filtrée par profil enfant, même entre deux enfants du même parent.
- L'enfant n'a aucun droit propre. « Refaire le test de départ » n'existe que dans l'espace parent, protégé par le contrôle parental (#10).

### Lecture des tableaux du parcours

| Dans les scénarios | À l'écran (cible, recommandation 27.7) |
|---|---|
| réussie au test de départ | coche, sans étoile ; texte lu « `<titre>` : réussie au test de départ » (« `<titre>`, CE2 : réussie au test de départ » dans le bloc « Déjà réussies en CE2 ») |
| réussie, n étoiles | comme #25 : l'état d'une leçon qui a des étoiles l'emporte, même si elle est aussi réussie au test de départ |
| à toi, à découvrir | comme #25 |

## Données de test

**Bibliothèque de test du test de départ**, servie au navigateur **à la place** de la vraie bibliothèque, comme celle de #25.
- Identifiants préfixés `e2e-27-`, leçons servies dans le désordre.
- Chaque leçon a une étape de leçon et **un seul exercice bulles d'une seule question** :
  - énoncé « `<titre>` : quelle est la bonne réponse ? » ;
  - choix « oui », « non », « peut-être » ;
  - réponse « oui », sans `aide` (aide par défaut : « Essaie une autre bulle. »).
- La question tirée dans chaque leçon est donc toujours la même : **le hasard du choix des questions n'a pas besoin d'être fixé**. Les choix sont mélangés, mais les étapes répondent par le texte du choix, comme #17 et #25. Le tirage au hasard parmi plusieurs questions, et entre plusieurs exercices, est vérifié par les tests unitaires (port `Hasard`).

| Matière, niveau | Leçons (ordre) | Sert à |
|---|---|---|
| français, CP | « Les voyelles » (10), « La dictée des sons » (18, **un seul exercice `dictee`**), « Les syllabes » (20), « Le son ou » (30), « Le son on » (40), « Le son an » (50) | classes d'avant d'un CE1 ; leçon sans question possible (27.6) |
| maths, CP | « Compter jusqu'à 10 » (15), « Les nombres jusqu'à 20 » (25), « Les doubles » (35), « Les additions » (45) | les deux matières mêlées par `ordre` |
| français, CE1 | « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30), « Le pluriel des noms » (40), « Le féminin des noms » (50) | parcours de français de CE1 (5 leçons) |
| maths, CE1 | « Les nombres jusqu'à 100 » (15), « Les compléments à 10 » (25), « La soustraction » (35), « Les tables de 2 » (45) | parcours de maths de CE1 (4 leçons) |
| français, CE2 | « Le futur » (10) | exclue pour un CE1 ; enfant redescendu (27.15) |
| sciences, CP | « Les cinq sens » (10) | autre matière, exclue |

Calcul du test de départ, à refaire par l'`e2e-tester` si la bibliothèque change :
- **CE1** : la réserve compte 19 leçons, triées par niveau, puis `ordre`, puis matière.
  - Pas = 19 / 12 ≈ 1,583 ; indices 0, 1, 3, 4, 6, 7, 9, 11, 12, 14, 15, 17.
  - Les 12 questions, dans l'ordre : Q1 Les voyelles, Q2 Compter jusqu'à 10, Q3 Les syllabes, Q4 Les nombres jusqu'à 20, Q5 Les doubles, Q6 Le son on, Q7 Le son an, Q8 Les nombres jusqu'à 100, Q9 L'ordre alphabétique, Q10 Les mots contraires, Q11 La soustraction, Q12 Les tables de 2.
  - Ne sont pas posées : La dictée des sons, Le son ou, Les additions, Le son in, Les compléments à 10, Le pluriel des noms, Le féminin des noms.
  - Aucun indice ne tombe près d'un entier : le résultat ne dépend pas d'un arrondi.
- **CP** : la réserve compte 10 leçons. Pas = 1. « La dictée des sons » est sautée, ce qui donne 9 questions.
- **Règle 27.2 (b)**, tout juste, CE1 :
  - français : jusqu'à Q10, 9 leçons (6 du CP, dont la dictée, et 3 du CE1) ;
  - maths : toutes, 8 leçons ;
  - total : 17, d'où la phrase de fin.
- Une seule question juste (Q1), puis l'arrêt : 1 leçon, « Les voyelles ».

Étapes du test de départ joué dans l'interface : « Léa a fait le test de départ, … », « Léa a répondu au test de départ jusqu'à « X »(, avec des questions fausses à …) », « Léa en est à la question de « X » du test de départ ».
- Les questions non citées comme fausses sont **justes**.
- Une question fausse est jouée par une réponse fausse, puis la bonne.
- « Léa a refait le test de départ, … » passe par « Refaire le test de départ » de l'espace parent.
- « Léa a quitté le test de départ après la question de « X » » : questions justes jusqu'à X, puis retour.
- « Léa a commencé le test de départ » : proposition acceptée, première question affichée.
- « la proposition du test de départ est affichée pour Léa » : Léa choisie dans « Qui joue ? », puis « Mon test de départ » depuis son accueil (27.10).

Résultat préparé, avec la clé `service_role` réservée à la préparation, directement dans la future table des résultats du test de départ, pour le profil réel :
- « Léa a déjà fait le test de départ » : résultat sans leçon ;
- « Léa a pour leçons réussies au test de départ : » (tableau, colonne `leçon`) : résultat avec ces leçons.

Comme pour `resultats_des_lecons` (#25), les identifiants `e2e-27-…` doivent y être acceptés.

Séance préparée par le jeu de données : pour #27, l'étape reprise « Léa a terminé une séance de la leçon « … » avec 1 étoile » (règle 5, « Une séance terminée donne ses étoiles à une leçon réussie au test de départ ») n'est **pas jouée** dans l'interface comme dans #25. Avec un exercice d'une seule question à 3 choix, une séance à 1 étoile est injouable. Le résultat est donc préparé directement dans `resultats_des_lecons`, avec la clé `service_role` réservée à la préparation. Le texte de l'étape ne change pas.

Serveur et leçons de test :
- Le serveur ne connaît pas les leçons de test (#24, Q85). Il refusera donc un test de départ joué sur la bibliothèque de test (`TestDeDepartIncoherent`).
- Comme pour #25 (réponse 25.6), l'écran de fin, l'accueil et le parcours reflètent tout de suite le test fini, par le résultat calculé dans le navigateur et gardé sur l'appareil.
- Si un refus du serveur efface ce résultat de l'appareil, ou fait réapparaître la proposition, l'`e2e-tester` le signale.
- Les scénarios de la règle 9 qui écrivent (« l'appareil envoie pour Léa un test de départ terminé … », « Claire envoie un test de départ terminé … ») sont des **appels directs à l'Edge Function** `terminer-le-test-de-depart`, avec le JWT de Paul ou de Claire.
- Ils portent sur une **vraie leçon** de la bibliothèque, « Les sons ou, on, an » (`fr-cp-sons-ou-on-an`, exercice bulles « Quel son entends-tu ? ») : Léa y est donc de niveau CP.
- Un envoi d'une seule question est cohérent : le pas régulier n'est pas revérifié (27.12).

Parents, enfants et appareils :
- Paul (tablette et téléphone) et Marie (téléphone), rattachés à Léa ;
- Claire (téléphone), non rattachée ;
- Tom, second enfant de Paul ;
- univers « Animaux de la forêt » : personnage guide Noisette.

### Étapes reprises d'autres stories (mot pour mot, même sens)

- Famille : « Paul est connecté sur la tablette », « Paul est dans l'espace parent », « Paul crée le profil enfant "…" de niveau … dans l'univers « … » », « Paul a créé le profil enfant "…" de niveau … dans l'univers « … » », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Tom a un profil enfant préparé de niveau … », « Marie est rattachée au profil enfant de Léa », « Claire est connectée sur le téléphone », « Paul a changé sur la tablette le niveau du profil enfant de Léa en … », « Léa choisit son profil enfant dans « Qui joue ? » », « Léa a choisi son profil enfant dans « Qui joue ? » », « Léa revient à l'accueil par le nom de l'application ».
- Séance et aide : « Léa n'entend aucune étape de leçon », « « Je ne sais pas » est proposé à Léa », « « Je ne sais pas » est de nouveau proposé à Léa », « Noisette dit un encouragement, suivi de « … » », « Noisette dit « … » », « Léa entend Noisette lire « … » », « Léa joue la séance complète de la leçon « … » », « Léa réussit la dernière question de la séance », « la fin de la séance annonce « … » », « la leçon suivante ouvre la page de la leçon « … » », « Léa a terminé une séance de la leçon « … » avec 1 étoile ».
- Parcours (#25) : « Léa ouvre le parcours de français », « Léa choisit « … » dans son parcours », « Léa ouvre le parcours de français sur le téléphone de Marie », « Léa voit son accueil », « Léa revient en arrière », « Léa a pour meilleures étoiles : », « Tom a pour meilleures étoiles : » (forme), « le titre du parcours est « … » », « le parcours montre : », « le parcours montre « … » réussie avec n étoile(s) », « « … » est la prochaine leçon », « le parcours indique « … » », « aucune leçon du parcours n'est marquée « À toi ! » », « le bloc « … » du parcours montre, et seulement elles : », « les lecteurs d'écran annoncent les leçons du parcours ainsi : », « les lecteurs d'écran annoncent « … » ».
- Réseau, accessibilité, droits : « le réseau est coupé », « elle voit le message « … » », « Léa joue sur un ordinateur, au clavier », « le focus est sur « … » » (ici : le bouton « Voir mon parcours » de la fin du test de départ ; l'étape est déjà propre à chaque story par son tag), « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « chaque choix mesure au moins 44 px de haut et de large », « « Je ne sais pas » mesure au moins 44 px de haut », « Claire ne reçoit aucune donnée de Léa », « l'enregistrement est refusé », « l'enregistrement est refusé comme pour un profil introuvable ».

Extensions sans changement de sens :
- Les étapes « le parcours montre : », « le bloc « … » du parcours montre, et seulement elles : » et « les lecteurs d'écran annoncent … » doivent accepter le nouvel état « réussie au test de départ ».
- « Léa a pour meilleures étoiles : » et « Léa ouvre le parcours de français sur le téléphone de Marie » doivent connaître la bibliothèque `e2e-27-`.

Aucune étape existante n'est modifiée.

Étapes nouvelles :
- proposition : « la bibliothèque de test du test de départ est servie », « la proposition du test de départ s'affiche pour … », « la proposition du test de départ est affichée pour Léa », « la proposition du test de départ propose « … » et « … » », « Noisette dit, et l'écran affiche : » (texte en bloc, à cause des guillemets imbriqués), « l'écran s'intitule « … », avec « … » », « Léa accepte la proposition du test de départ(, au clavier seulement) », « Léa remet le test de départ à plus tard », « Léa ouvre « Mon test de départ » depuis son accueil », « l'accueil de Léa (ne) propose (pas) « Mon test de départ »( sur le téléphone de Paul) », « la bibliothèque ne peut pas être chargée » ;
- déroulé : « la question de « … » s'affiche », « … reste posée », « Léa répond juste à la question de « … » », « Léa se trompe( 2 fois) à la question de « … »(, puis donne la bonne réponse) », « Léa dit « Je ne sais pas » à la question de « … », puis donne la bonne réponse », « Léa répond juste à toutes les questions du test de départ », « Léa a eu, dans l'ordre, les questions des leçons : », « aucune question de « … » (ni de « … »)( n'est posée) », « Léa quitte le test de départ » ;
- fin : « la fin du test de départ s'affiche », « la fin du test de départ propose seulement « Voir mon parcours » », « la fin du test de départ ne montre aucune étoile », « Léa choisit « Voir mon parcours » » ;
- parent et serveur : « Paul choisit « Refaire le test de départ » pour Léa », « Paul a proposé de nouveau le test de départ à Léa depuis l'espace parent », « l'appareil envoie pour Léa un test de départ terminé … », « Claire demande le résultat du test de départ du profil enfant de Léa », « Claire envoie un test de départ terminé pour le profil enfant de Léa » ;
- données préparées : voir plus haut.

## Hors périmètre

- Écran « Aujourd'hui » et sa tuile « Mon test de départ » : #29. Elle remplacera le bouton de l'accueil de l'enfant (27.10).
- Série, épisodes, cabane, objectif du jour, badges (Motivation, lot 5, #30 à #33) : le test de départ n'y compte pas (27.4). Rien n'est modélisé ni scénarisé ici. Les stories de Motivation ignoreront `TestDeDepartTermine`.
- Révisions (#28, pas livrée) : les questions du test de départ ne vont jamais en révision. Le test de départ n'écrit rien dans les tables de séances. Vérifié par les tests unitaires du cas d'usage (aucune séance enregistrée), pas en E2E.
- Questions de boîte et de barres : #21, pas mergée (27.11 b).
- Forme « question à choix » de la conjugaison, du texte à trous et de classer, addition posée en ligne (27.11 a) : tests unitaires du domaine. La bibliothèque de test E2E n'a que des bulles.
- Tirage au hasard de la question d'une leçon : tests unitaires (port `Hasard`).
- Réserve sans aucune question (classe sans leçon de français ni de maths) : tests unitaires (27.5). Le cas E2E couvert est la bibliothèque non chargée.
- Revalidation détaillée par le serveur (ordre, maximum de 12, tirages, idempotence, leçon retirée de la bibliothèque, niveau changé entre-temps, 27.12) : tests unitaires de `revaliderLeTestDeDepart` et du cas d'usage. L'E2E garde 3 cas de refus.
- Au retour du réseau, envoi du test de départ gardé sur l'appareil : même file d'envoi que la séance (#24). Pas de scénario E2E, puisque le serveur refuse les leçons de test. L'enregistrement par le serveur est couvert par l'appel direct de la règle 9.
- Copie du résultat sur l'appareil, pour un lancement sans réseau : #44.
- Export et suppression du résultat du test de départ avec le profil : #14. La donnée s'ajoute au contrat de données personnelles, sans scénario ici.
- Suivi du parent (« réussie au test de départ », carte des compétences) : #34 (27.1).
- Leçons des classes d'avant (« Revoir les classes d'avant ») : #26. Les leçons du CP réussies au test de départ par un CE1 s'y afficheront. Ici, on les voit seulement dans le nombre de la phrase de fin.
- Son d'étoiles à la fin du test de départ (défaut du legacy) : supprimé, non vérifié en E2E (aucun son n'est observé par les scénarios).

## Décisions

Réponse du PO, le 2026-10-24 : « 27# reco OK » (annonce du responsable des équipes, https://github.com/SBA-dev/github-move/issues/64#issuecomment-6389314266). Toutes les recommandations sont retenues. Le détail des questions 27.1 à 27.16 est dans `docs/stories/27/domain-model.md` (section « Questions ouvertes », toutes tranchées).

| n° | Question | Réponse | Effet sur les scénarios |
|---|---|---|---|
| 27.1 | Réussie ou acquise ? | **Réussie**, sans étoile, sans badge ni compétence acquise. La ligne « Leçon acquise » du glossaire perd « ou validée par le test de départ ». | Vocabulaire « réussie au test de départ » de la règle 5 confirmé. |
| 27.2 | Quelles leçons le test de départ rend-il réussies ? | **(b)** : pour chaque matière, toutes les leçons de la réserve jusqu'à la dernière question juste, sauf celles dont la question est fausse. | `@a-valider` retiré de « Une question répondue <manière>… », des 3 premiers scénarios de la règle 5, de « Le personnage guide dit combien de leçons… » et de « Sans réseau, le test de départ se joue jusqu'au bout… ». |
| 27.3 | Changement de classe | Pas de nouvelle proposition automatique ; le parent garde « Refaire le test de départ ». | `@a-valider` retiré de « Un enfant qui change de classe… ». |
| 27.4 | Objectif du jour, série, épisodes, cabane | Le test de départ ne compte pour rien de tout cela. | Aucun scénario (hors périmètre). |
| 27.5 | Bibliothèque non chargée, ou aucune question | Pas de proposition, sans message ; après la création, l'accueil de l'enfant ; le test n'est pas marqué fait. | `@a-valider` retiré de « Sans bibliothèque chargée… ». |
| 27.6 | Dictée et lecture exclues (avec ordre, poésie, fluence) | Oui. | `@a-valider` retiré de « Une leçon sans question possible est sautée… ». |
| 27.7 | Affichage d'une leçon réussie au test de départ | État propre, coché sans étoile, lu « `<titre>` : réussie au test de départ » ; une séance terminée ensuite affiche ses étoiles, même une seule. | `@a-valider` retiré des scénarios de la règle 5 et de « Un lecteur d'écran lit… ». |
| 27.8 | Compteur et leçon suivante | Les leçons réussies au test de départ comptent dans le compteur, et la leçon suivante les saute. | `@a-valider` retiré des 2 scénarios concernés. |
| 27.9 | Refaire le test de départ | (a) les questions ne regardent pas les résultats ; (b) une leçon réussie le reste ; (c) après « Plus tard », le test reste fait. | `@a-valider` retiré des 3 derniers scénarios de la règle 7. |
| 27.10 | Où trouver la proposition avant #29 ? | Bouton « Mon test de départ » sur l'accueil de l'enfant, à côté de « Mon parcours », tant que le test n'est pas fait ; « Plus tard », le retour et « quitter » mènent à cet accueil. | `@a-valider` retiré des scénarios de la règle 1 et de « Quitter le test de départ en cours… ». |
| 27.11 | Forme des questions, boîte et barres | Questions à choix pour conjugaison, trous et classer, addition en ligne ; boîte et barres exclues jusqu'à #21. | Aucun scénario E2E (tests unitaires). |
| 27.12 | Revalidation après un test hors ligne | Niveau actuel du profil, pas de contrôle du pas régulier, leçon retirée ignorée, question au-dessus du niveau refusée. | Tests unitaires ; scénarios E2E inchangés. |
| 27.13 | Définition du glossaire | « 3 questions fausses de suite ». Glossaire corrigé. | `@a-valider` retiré de « Plusieurs erreurs à une même question… ». |
| 27.14 | Phrase de fin | Compter les leçons **nouvellement** réussies, classes d'avant comprises ; sans aucune, « Maintenant, je sais par où commencer ». | `@a-valider` retiré des 2 scénarios concernés. |
| 27.15 | Enfant redescendu de classe | La leçon de CE2 réussie au test de départ va dans « Déjà réussies en CE2 », sans étoile. | `@a-valider` retiré de « Redescendue en CE1… ». |
| 27.16 | Proposition après le premier profil et après l'ajout d'un enfant | Oui dans les deux cas. | `@a-valider` retiré des 2 premiers scénarios de la règle 1. |
| 27.17 | Phrase de fin au singulier | « Merci `<prénom>` ! Tu connais déjà 1 leçon : je l'ai cochée. Ton parcours t'attend ! » ; le pluriel ne change pas. | `@a-valider` retiré de « Avec une seule leçon connue… ». |
| 27.18 | Fin du test de départ sans réseau | Même message que la fin d'une séance (#24) : « Sauvegarde en ligne impossible : la progression est gardée sur cet appareil. » | `@a-valider` retiré de « Sans réseau, la fin du test de départ dit… ». |
| 27.19 | Proposition juste après une création faite dans l'espace parent | Après la création, l'espace parent se ferme, le profil créé devient le profil en cours et son personnage guide propose le test de départ ; « Plus tard » mène à l'accueil de cet enfant. Pour créer un autre profil, le parent rentre dans l'espace parent (contrôle parental). | `@a-valider` retiré des 2 premiers scénarios de la règle 1. Scénarios de #11 et #12 qui vérifient l'espace parent juste après une création : texte inchangé, adaptation dans les steps (voir ci-dessous). |
| 27.20 | Avancement pendant le test de départ | Le même avancement que la séance ; après un arrêt, directement la fin. | Aucun scénario. |
| 27.21 | Où mène « Voir mon parcours » ? | À « Mon parcours », ouvert comme depuis l'accueil (réponse 25.11) ; le retour ramène à l'accueil de l'enfant. | `@a-valider` retiré de « « Voir mon parcours » ouvre le parcours de l'enfant ». |
| 27.22 | « Accueil de l'enfant » absent du glossaire | Ajouté au glossaire (Famille). « Fin du test de départ », « Mon test de départ », « Voir mon parcours » restent des mots d'interface. | Aucun changement d'étape. |
| 27.23 | Leçon sans question possible placée avant une question juste | Réussie au test de départ, comme toute leçon d'avant. | `@a-valider` retiré de « Le personnage guide dit combien de leçons… » (17 leçons). |

### Correction de données de test, sans changement de règle, après la mise au point E2E

- Règle 4, « Plusieurs erreurs à une même question ne comptent que pour une question fausse » : « Léa se trompe 3 fois » devient « Léa se trompe 2 fois ». Chaque question de la bibliothèque de test n'a que 3 choix, donc 2 mauvaises bulles au plus, et une bulle déjà touchée est grisée : une 3e erreur distincte est impossible. Le sens est gardé : plusieurs erreurs à une même question comptent pour une seule question fausse (27.13).
- Validée par le PO le 2026-10-25 (« 2 fois OK ») : https://github.com/SBA-dev/github-move/issues/64#issuecomment-6395398175

### Effet de 27.19 sur les stories livrées (#11, #12, #13)

La même étape « Paul crée le profil enfant … » sert dans #11 et dans les 2 premiers scénarios de la règle 1 de #27, où elle doit laisser la proposition du test de départ affichée. La création ne peut donc pas, dans son step, fermer la proposition et revenir dans l'espace parent. Ce sont les étapes `Alors` qui regardent l'espace parent qui y rentrent si besoin (contrôle parental compris), comme « … apparaît dans « Qui joue ? » » ouvre déjà « Qui joue ? ». Aucun texte de scénario de #11, #12 ou #13 ne change ; le travail revient à l'`e2e-tester` :
- `features/11-profil-enfant.feature`, « Le parent qui crée un profil enfant y est rattaché d'office » : « Paul voit le profil enfant de Léa dans l'espace parent » rentre dans l'espace parent s'il n'est pas affiché.
- `features/12-reglages.feature`, « Les réglages se choisissent dès la création du profil » : « les réglages de Léa indiquent « mode dys » : « oui » » et « les autres réglages de Léa ont leurs valeurs par défaut » rentrent dans l'espace parent s'il n'est pas affiché.
- Toutes les créations par l'écran (`creerParLInterface`, création avec un réglage de #12) : le retour attendu après « Créer le profil » est le message de création, une erreur **ou** la proposition du test de départ (ou l'accueil de l'enfant si la bibliothèque n'est pas chargée, 27.5).
- Les scénarios de #11 qui vérifient « Qui joue ? » après une création, et les étapes « Paul est dans l'espace parent » qui suivent une création (#12), passent par les steps existants qui ouvrent « Qui joue ? » ou rentrent dans l'espace parent : aucun changement de texte.
- #13 ne crée aucun profil par l'écran : aucun scénario touché.

## Questions ouvertes

Aucune.
