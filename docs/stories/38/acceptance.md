# Critères d'acceptance : issue #38, Enregistrements de lecture

Scénarios : `features/38-enregistrements-de-lecture.feature` (tags `@issue-38 @wip`).
Modèle du domaine : `docs/stories/38/domain-model.md` (contexte **Accompagnement**, proposé pendant une séance d'**Apprentissage**, lit le **Catalogue pédagogique** et **Famille**). Les questions 38.1 à 38.20 en viennent ; 38.21 à 38.29 sont ajoutées ici.

Les scénarios suivent **les recommandations** du modèle et de ce document. Ceux qui dépendent d'une question encore ouverte portent `@a-valider` et un commentaire `# Question 38.n`. Ceux qui passent par le suivi de l'espace parent (#34, cadrée en parallèle, pas encore livrée) portent `@depend-de-34`.

Décisions du PO déjà prises (commentaire [Responsable] du 2026-10-25 sur l'issue) :
- #13 (second parent) et #14 (export et suppression du profil) sont **sortis de la beta** : aucun scénario « second parent », aucun scénario d'export ni de suppression du profil ;
- l'**expiration automatique à 30 jours** (fichier et ligne effacés) **reste dans #38** ;
- la suppression d'**un** enregistrement de lecture par le parent, dans le suivi, **reste dans #38**.

## Objectif

En tant qu'**enfant**, je veux m'enregistrer quand je lis, récite ou chante à voix haute pendant un exercice `lecture` ou `memoriser`, puis me réécouter. En tant que **parent**, je veux écouter ces enregistrements de lecture dans le suivi, puis les supprimer, afin de suivre les progrès de lecture à voix haute de mon enfant.

L'enregistrement de lecture **n'est pas noté** : il ne change ni l'avancement de la séance, ni les étoiles. Son refus ou son échec ne bloque jamais l'exercice. C'est une donnée sensible (la voix de l'enfant) : seul un parent rattaché l'écoute, elle est effacée 30 jours après l'enregistrement, et rien n'est envoyé à l'IA.

Le comportement actuel (`app/app.js`, `recordButton`, bloc des enregistrements de `adultSuivi`) donne les premiers exemples : libellés des boutons, messages à l'enfant, ligne « `<titre ou « Enregistrement »>` · `<date>` », « Supprimer » puis « Confirmer », bloc absent sans enregistrement. Les écarts voulus (enregistrement dans la page, expiration, liste complète, suppression sûre, accès réservé) sont des questions : 38.1, 38.6, 38.8, 38.15, 38.23, 38.24.

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Seuls les exercices `lecture` et `memoriser` proposent de s'enregistrer, avec un libellé selon ce que l'enfant fait, et seulement si l'appareil sait enregistrer | « Le petit chat Plume » lu → « Je la lis à voix haute et je m'enregistre » et « J'ai écouté » · « Le début de la fable » (poésie) → « Je récite et je m'enregistre » · « Au clair de la lune » (chanson) → « Je chante et je m'enregistre » · Noisette : « À toi ! Redis tout le texte, tranquillement. Tu peux t'enregistrer pour te réécouter. Quand c'est bon, on joue ! » · appareil qui ne sait pas enregistrer → ni bouton, ni phrase · bulles « Quel son entends-tu ? » → pas de bouton |
| 2. L'enfant s'enregistre, s'arrête et se réécoute ; pas noté, jamais bloquant | « en train de s'enregistrer » et « Arrêter » · arrêt → réécouter, « J'ai écouté » · arrêt tout seul à 3 minutes · « J'ai écouté » pendant l'enregistrement → question « De quelle couleur est Plume ? », enregistrement gardé · avancement 0 sur 12 après l'enregistrement · micro refusé → « Le micro n'est pas disponible. Tu peux lire à voix haute sans t'enregistrer. » |
| 3. Gardé par le serveur pour les parents ; sinon l'enfant se réécoute et en est prévenu | « Bravo ! Ton enregistrement est gardé : tes parents pourront l'écouter. » · sans réseau → « Écoute-toi ! (L'enregistrement n'a pas pu être gardé.) », réécoute possible · au retour du réseau, rien n'est envoyé · deux enregistrements du même exercice → deux gardés · refus : exercice bulles, vide, 6 Mo, image, leçon hors bibliothèque |
| 4. Le parent écoute dans le suivi, avec la date d'expiration | « Lectures et récitations enregistrées (2) », Cigale (il y a 1 jour, gardé 29 jours) avant Plume (il y a 5 jours, 25 jours) · « Les enregistrements sont effacés au bout de 30 jours. » · 35 enregistrements → (35) et 35 lignes · leçon retirée → « Enregistrement » · aucun → pas de bloc · « Écouter » → l'enregistrement se joue |
| 5. Le parent supprime en deux temps ; supprimé, il ne s'écoute plus | « Supprimer » → « Confirmer », toujours (1) · confirmé → (1) sur 2, plus écoutable même par le chemin du fichier · dernier supprimé → bloc retiré · sans réseau → « L'enregistrement n'a pas pu être supprimé. Réessaie. », toujours (1) |
| 6. Expiration à 30 jours : ni listé ni écoutable, puis effacé avec son fichier | 29 jours et 23 heures → s'écoute · 30 jours → introuvable · 31 jours → introuvable · 31 jours, effacement pas encore passé → pas listé · effacement → 31 jours effacé avec son fichier, 2 jours gardé · fichier sans enregistrement de 2 heures → effacé, de 10 minutes → gardé · Claire ne lance pas l'effacement |
| 7. Seul un parent rattaché garde, liste, écoute ou supprime ; l'enfant ne réécoute que celui qu'il vient de faire | Claire : liste vide, écoute refusée par identifiant et par chemin, suppression refusée comme introuvable, envoi refusé comme pour un profil introuvable · bloc de Léa sans l'enregistrement de Tom · Léa rejoue Plume → rien à réécouter · Tom sur la même tablette → rien à réécouter |
| 8. Au doigt, au clavier, au lecteur d'écran, sur un petit écran | 360 px, commandes de 44 px (avant et pendant l'enregistrement) · « Enregistrement en cours », « Enregistrement terminé » · clavier seulement · mouvements réduits → signalé sans animation · suivi à 360 px, « Écouter » et « Supprimer » de 44 px |

## Règles

| # | Règle | Scénarios | Questions |
|---|---|---|---|
| 1 | Seuls les exercices `lecture` et `memoriser` proposent de s'enregistrer, avec un libellé selon ce que l'enfant fait, et seulement si l'appareil sait enregistrer | Dans une lecture, après le texte lu, l'enfant peut s'enregistrer avant de dire qu'il a écouté · Pour une `<sorte>`, après le dernier vers, l'enfant peut s'enregistrer avec « `<libellé>` » (2 cas) · Pour une `<sorte>`, le personnage guide invite à `<verbe>` tout le texte et à s'enregistrer (2 cas, `@a-valider`) · Sur un appareil qui ne sait pas enregistrer, la poésie n'invite pas à s'enregistrer (`@a-valider`) · Sur un appareil qui ne sait pas enregistrer, la lecture ne propose pas de s'enregistrer (`@a-valider`) · Un exercice qui n'est ni une lecture ni une poésie ne propose pas de s'enregistrer | 38.1, 38.17, 38.20, 38.21, 38.27 |
| 2 | L'enfant s'enregistre, s'arrête et se réécoute ; l'enregistrement de lecture n'est pas noté et ne bloque jamais l'exercice | Pendant qu'il s'enregistre, l'enfant voit qu'il est en train de s'enregistrer et peut arrêter (`@a-valider`) · Après l'arrêt, l'enfant peut se réécouter et continuer l'exercice · L'enregistrement s'arrête tout seul au bout de 3 minutes (`@a-valider`) · Dire qu'il a écouté pendant l'enregistrement l'arrête et le garde (`@a-valider`) · S'enregistrer ne compte pas dans l'avancement de la séance · Si le micro est refusé, l'enfant est prévenu sans reproche et continue l'exercice (`@a-valider`) | 38.1, 38.3, 38.17, 38.18, 38.28 |
| 3 | L'enregistrement de lecture est gardé par le serveur pour les parents ; sinon l'enfant se réécoute quand même et en est prévenu | Un enregistrement de lecture gardé est annoncé à l'enfant et se retrouve chez le parent (`@a-valider`) · Sans réseau, l'enfant se réécoute et apprend que l'enregistrement n'a pas pu être gardé (`@a-valider`) · Au retour du réseau, un enregistrement de lecture fait sans réseau n'est pas envoyé (`@a-valider`) · Deux enregistrements dans le même exercice sont gardés tous les deux (`@a-valider`) · Le serveur refuse de garder un enregistrement de lecture `<cas>` (5 cas, dont 3 `@a-valider`) | 38.2, 38.3, 38.7, 38.9, 38.10, 38.11, 38.19, 38.22 |
| 4 | Le parent écoute dans le suivi les enregistrements de lecture de l'enfant, avec leur date d'expiration | Le suivi montre les enregistrements de lecture, du plus récent au plus ancien, avec leur date d'expiration · Le suivi dit que les enregistrements de lecture sont effacés au bout de 30 jours · Tous les enregistrements de lecture non expirés sont montrés, même au-delà de 30 · Un enregistrement de lecture d'une leçon qui n'est plus dans la bibliothèque s'appelle « Enregistrement » · Sans enregistrement de lecture, le suivi ne montre pas leur bloc · Le parent écoute un enregistrement de lecture (tous `@depend-de-34 @a-valider`) | 38.4, 38.6, 38.8, 38.16, 38.23, 38.24, 38.29 |
| 5 | Le parent supprime un enregistrement de lecture en deux temps ; supprimé, il ne s'écoute plus | « Supprimer » demande une confirmation avant de supprimer · Après confirmation, l'enregistrement de lecture disparaît du suivi et ne s'écoute plus · Supprimer le dernier enregistrement de lecture retire leur bloc du suivi (`@a-valider`) · Si la suppression échoue, l'enregistrement de lecture reste et le parent peut réessayer (`@a-valider`) (tous `@depend-de-34`) | 38.15, 38.23 |
| 6 | Un enregistrement de lecture expire 30 jours après avoir été fait : il n'est plus ni listé ni écoutable, puis il est effacé avec son fichier | Un enregistrement de lecture fait il y a `<âge>` `<résultat>` (3 cas) · Un enregistrement de lecture expiré n'est plus listé dans le suivi, même avant d'être effacé (`@depend-de-34`) · L'effacement des enregistrements expirés efface l'enregistrement de lecture et son fichier, et garde les autres · Un fichier d'enregistrement sans enregistrement de lecture, rangé il y a `<âge>`, `<résultat>` (2 cas, `@a-valider`) · Un parent ne peut pas lancer l'effacement des enregistrements expirés (`@acces`) | 38.12, 38.14, 38.26 |
| 7 | Seul un parent rattaché garde, liste, écoute ou supprime les enregistrements de lecture d'un enfant ; l'enfant ne réécoute que celui qu'il vient de faire | Un parent qui n'est pas rattaché ne liste pas les enregistrements de lecture de Léa · … n'écoute pas un enregistrement de lecture de Léa, même avec `<moyen>` (2 cas : identifiant, chemin du fichier) · … ne supprime pas un enregistrement de lecture de Léa · … ne garde pas d'enregistrement de lecture pour Léa · Le suivi de Léa ne montre jamais les enregistrements de lecture d'un autre enfant (`@depend-de-34`) · L'enfant ne réécoute pas un enregistrement de lecture déjà gardé en rejouant l'exercice (`@a-valider`) · Un autre enfant de la même tablette ne réécoute pas l'enregistrement de lecture de Léa (tous `@acces`) | 38.9 |
| 8 | S'enregistrer et écouter se font au doigt, au clavier, avec un lecteur d'écran et sur un petit écran | Le bouton d'enregistrement tient dans un écran de 360 px et se touche du doigt · Pendant l'enregistrement, « Arrêter » tient dans un écran de 360 px et se touche du doigt · Un lecteur d'écran annonce que l'enregistrement est en cours (`@a-valider`) · Un lecteur d'écran annonce la fin de l'enregistrement (`@a-valider`) · Au clavier, l'enfant s'enregistre et s'arrête sans souris · Avec les mouvements réduits, l'enregistrement en cours est signalé sans animation (`@a-valider`) · Les enregistrements de lecture du suivi tiennent dans un écran de 360 px et se touchent du doigt (`@depend-de-34`) | 38.25 |

Total : **8 règles, 46 scénarios (56 cas)**, dont **25 `@a-valider`** (un seul bloc `Exemples` du plan de refus en porte le tag), **8 `@acces`** et **13 `@depend-de-34`**.

8 règles, c'est au-dessus des 6 conseillées par le skill. La story peut se livrer en deux temps, ce qui suit aussi la dépendance à #34 :
1. **l'enfant** (règles 1, 2, 3, 8 sans le dernier scénario) et **l'expiration et les droits** hors suivi (règles 6 et 7 sans leurs scénarios `@depend-de-34`) : tout se vérifie sans le suivi, par la réécoute et par les étapes « Paul retrouve … » et « Paul demande à écouter … » (appels directs sous le JWT de Paul) ;
2. **le bloc du suivi** (règles 4 et 5, et les 13 scénarios `@depend-de-34`), après le merge de #34.

### Droits d'accès (`@acces`)

- L'enregistrement de lecture est une donnée nouvelle du profil enfant : table et fichiers sous RLS fondée sur le rattachement (`private.est_rattache_au_profil`), bucket privé, écoute par URL signée courte demandée avec le JWT du parent.
- Seul un parent rattaché (Paul) garde, liste, écoute et supprime. Claire, non rattachée :
  - ne reçoit **aucune donnée** quand elle liste, ni quand elle demande à écouter, que ce soit avec l'identifiant de l'enregistrement **ou le chemin de son fichier** dans Storage ;
  - voit sa suppression refusée **comme pour un enregistrement de lecture introuvable** (même réponse qu'un enregistrement inexistant ou expiré : on ne révèle rien), et l'enregistrement reste ;
  - voit son envoi refusé **comme pour un profil introuvable**, mot pour mot comme une séance terminée (#24) et un test de départ (#27).
- Le suivi de Léa ne montre jamais un enregistrement de Tom, même pour leur parent commun : la lecture est filtrée par profil enfant.
- **L'enfant n'a aucun droit propre** : il réécoute seulement l'enregistrement qu'il vient de faire, sur l'appareil. En rejouant l'exercice, ou quand un autre enfant joue sur la même tablette, rien n'est à réécouter. Le suivi n'existe que dans l'espace parent, protégé par le contrôle parental (#10).
- L'effacement des enregistrements expirés ne se lance que par la tâche planifiée (secret partagé) ; un parent connecté, même rattaché, ne peut pas le lancer.
- Le second parent (Marie) n'a **aucun scénario** : #13 est sorti de la beta. Les policies reposant sur le rattachement, il verra les mêmes enregistrements dès qu'il sera rattaché.

### Données d'enfants (RGPD) dans les scénarios

- Expiration à 30 jours : règle 6 (bornes 29 jours et 23 heures, 30 jours, 31 jours ; masquage avant l'effacement ; effacement de la ligne **et** du fichier ; fichiers orphelins).
- Minimisation : aucun scénario n'attend un prénom, un titre recopié ou une durée gardés ; la ligne du suivi relit le titre dans la bibliothèque (« Enregistrement » si la leçon n'y est plus).
- Rien n'est envoyé à l'IA : aucun scénario ne le demande ; à vérifier en review (aucun appel à l'API Claude dans le code de la story).
- Sans réseau, rien n'est gardé sur l'appareil en attendant (38.7).

## Données de test

Leçons **réelles** de la bibliothèque (`app/bibliotheque.json`), toutes de CP, comme #17 et #22 :

| Leçon | Exercice | Sert à |
|---|---|---|
| « Lecture : Le petit chat Plume » (`fr-cp-lecture-petit-chat`) | `lecture` « Le petit chat Plume » (exercice 0), première question « De quelle couleur est Plume ? » (« gris », « noir », « blanc ») | sorte `lecture`, la plupart des scénarios de l'enfant |
| « Poésie : La Cigale et la Fourmi » (`fr-cp-poesie-cigale`) | `memoriser` « Le début de la fable », 6 vers, Jean de La Fontaine, 12 questions | sorte `recitation` |
| « Chanson : Au clair de la lune » (`fr-cp-chanson-clair-de-lune`) | `memoriser`, 8 vers, « Chanson traditionnelle » | sorte `chanson` |
| « Les sons ou, on, an » (`fr-cp-sons-ou-on-an`) | `bulles` « Quel son entends-tu ? » | exercice sans enregistrement, refus du serveur |

Parents, enfants, appareils (formulations reprises) :
- Léa, profil enfant préparé de CP, univers « Animaux de la forêt », personnage guide Noisette ; Paul rattaché (comme le profil préparé de #24 et #27) ;
- Tom, second enfant de Paul, « Tom a un profil enfant préparé de niveau CP » ;
- Claire, connectée sur le téléphone, non rattachée.

Âges des enregistrements préparés : « fait il y a 2 jours », « il y a 31 jours ». L'étape crée l'enregistrement (ligne **et** fichier) avec la clé `service_role` réservée à la préparation, à la date « maintenant moins l'âge » (le serveur fixe la date de l'enregistrement : il n'y a pas d'autre moyen de vieillir un enregistrement, et aucune porte de test dans l'application, décision 0021). Dans les tableaux attendus, « il y a 5 jours » et « dans 25 jours » se lisent comme les dates affichées correspondantes (même format que la « Dernière séance » de #34, question 38.29).

Enregistrements faits dans l'interface : Chromium avec un faux micro (`--use-fake-device-for-media-stream`, `--use-fake-ui-for-media-stream`, note du modèle). « Léa s'enregistre » = commence, attend une à deux secondes, arrête. « Le micro de l'appareil est refusé » : permission refusée pour la page. « L'appareil ne sait pas enregistrer » : l'appareil n'offre pas d'enregistrement dans la page (par exemple `MediaRecorder` absent). L'arrêt automatique à 3 minutes se vérifie avec l'horloge de Playwright, sans attendre 3 minutes.

Effacement des enregistrements expirés : « l'effacement des enregistrements expirés passe » appelle l'Edge Function de la tâche avec son secret, côté Node, comme le ferait `pg_cron` ; « n'est pas encore passé » ne l'appelle pas. « n'existe plus, ni son fichier » regarde la table et le bucket avec la clé `service_role` (question 38.26).

### Étapes reprises d'autres stories (mot pour mot, même sens)

- Famille et accès : « Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt » », « Tom a un profil enfant préparé de niveau CP », « Claire est connectée sur le téléphone », « Claire ne reçoit aucune donnée de Léa ».
- Séance : « (Léa | Tom) joue seulement l'exercice « … » de la leçon « … » », « Léa joue l'exercice « … » de la leçon « … » », « Noisette a lu le texte de l'exercice « … » » (aussi en `Quand`), « Noisette a lu le dernier vers », « Noisette a lu tous les vers de « … » », « Léa dit qu'elle a écouté », « Léa peut dire qu'elle est prête », « Noisette dit « … » », « la question « … » s'affiche », « la question « … » s'affiche avec les choix « … », « … » et « … » », « l'avancement de la séance montre 0 question réussie sur 12 », « Léa voit le message « … » », « Paul voit le message « … » ».
- Réseau, accessibilité : « le réseau est coupé », « Léa joue sur un ordinateur, au clavier », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « chaque commande de la séance mesure au moins 44 px de haut et de large », « les lecteurs d'écran annoncent « … » », « l'appareil demande des mouvements réduits ».
- Suivi (#34, formulation de `features/34-suivi-et-carte-des-competences.feature` en cours de rédaction) : « Paul consulte le suivi » ; « Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées » suit la forme « Paul consulte le suivi, carte des compétences et leçons jouées dépliées » de #34. Si #34 change ses formulations à la validation, aligner celles-ci.

Extension sans changement de sens : « Noisette dit « … » » doit accepter la phrase complète de 38.17 ; le scénario livré de #22 qui vérifie la phrase sans « Tu peux t'enregistrer » est traité par la question 38.21.

### Étapes nouvelles

- enfant : « Léa peut s'enregistrer avec « … » », « Léa ne peut pas s'enregistrer », « Léa peut dire qu'elle a écouté », « Léa commence à s'enregistrer », « Léa est en train de s'enregistrer », « Léa s'enregistre depuis 2 minutes et 59 secondes », « 3 minutes sont passées depuis le début de son enregistrement », « Léa voit qu'elle est en train de s'enregistrer(, sans animation) », « Léa n'est plus en train de s'enregistrer », « Léa peut arrêter son enregistrement avec « Arrêter » », « Léa arrête son enregistrement », « Léa s'enregistre(, au clavier seulement) », « Léa s'est déjà enregistrée une fois », « Léa s'enregistre de nouveau », « Léa choisit « … » », « Léa peut réécouter son enregistrement », « (Léa | Tom) n'a aucun enregistrement à réécouter », « Léa s'est enregistrée (sans réseau) pendant l'exercice « … »( sur la tablette) » ;
- appareil : « l'appareil ne sait pas enregistrer », « le micro de l'appareil est refusé », « le réseau revient » ;
- données préparées : « Léa a ces enregistrements de lecture : » (colonnes `leçon`, `enregistré`), « (Léa | Tom) a un enregistrement de lecture de « … » fait il y a … », « Léa a 35 enregistrements de lecture de « … », faits ces 20 derniers jours », « Léa a un enregistrement de lecture d'une leçon qui n'est plus dans la bibliothèque, fait il y a 2 jours », « Léa n'a aucun enregistrement de lecture », « un fichier d'enregistrement de Léa, sans enregistrement de lecture, a été rangé il y a … » ;
- parent, suivi : « Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées », « le suivi de Léa montre « … » », « le suivi de Léa ne montre pas de bloc « … » », « les enregistrements de lecture de Léa sont, dans l'ordre : » (colonnes `leçon`, `enregistré`, `gardé jusqu'au`), « 35 enregistrements de lecture de Léa sont listés », « Paul lit « … » », « Paul écoute l'enregistrement de lecture de « … » », « l'enregistrement de lecture de « … » se joue », « Paul choisit « Supprimer » pour l'enregistrement de lecture de « … » », « Paul a choisi « Supprimer » pour … », « Paul peut choisir « Confirmer » pour … », « Paul confirme la suppression », « « Écouter » et « Supprimer » mesurent au moins 44 px de haut et de large » ;
- parent, appels directs sous son JWT : « Paul retrouve n enregistrement(s) de lecture de Léa, de la leçon « … » », « Paul ne retrouve aucun enregistrement de lecture de Léa », « Paul demande à écouter l'enregistrement de lecture de Léa », « l'enregistrement de lecture de Léa se joue », « l'enregistrement de lecture de Léa est introuvable », « Paul ne peut plus écouter l'enregistrement de lecture supprimé, même par le chemin de son fichier » ;
- serveur : « l'appareil envoie pour Léa un enregistrement de lecture … », « l'enregistrement de lecture est refusé( comme pour un profil introuvable) », « l'effacement des enregistrements expirés (passe | n'est pas encore passé) », « l'enregistrement de lecture de Léa fait il y a … (n'existe plus, ni son fichier | existe toujours, avec son fichier) », « ce fichier (n'existe plus | existe toujours) » ;
- Claire : « Claire demande les enregistrements de lecture du profil enfant de Léa », « Claire demande à écouter l'enregistrement de lecture de Léa avec (son identifiant | le chemin de son fichier) », « Claire supprime l'enregistrement de lecture de Léa avec son identifiant », « la suppression est refusée comme pour un enregistrement de lecture introuvable », « Claire envoie un enregistrement de lecture de l'exercice « … » pour le profil enfant de Léa », « Claire demande l'effacement des enregistrements expirés », « l'effacement des enregistrements expirés est refusé ».

Aucune étape existante n'est modifiée.

## Hors périmètre

- **Export et suppression des enregistrements avec le profil : reportés dans #14** (décision du PO du 2026-10-25, question 38.5). Pendant la beta, la suppression d'un profil à la demande d'un parent se fait à la main, dossier `<profil>/` du bucket compris ; la tâche planifiée efface de toute façon les fichiers orphelins (38.14).
- **Second parent** (#13, sorti de la beta) : aucun scénario.
- **Accord du parent** avant de garder (réglage « Garder les enregistrements de lecture ») : pas dans la beta, dette à reprendre avant #45 (38.2). Aucun scénario.
- **Garder plus de 30 jours, bouton « Télécharger »** : non (38.4). Aucun scénario.
- **Révisions (#28) et test de départ (#27)** : le bouton n'y apparaît jamais (38.13). Le test de départ ne pose jamais de question de lecture (27.6) ; pour la révision, vérifié par les tests unitaires (sorte d'enregistrement absente hors séance de leçon), pas en E2E tant que #28 n'est pas mergée.
- **Attente du réseau sur l'appareil** et envoi au retour du réseau : #44 (38.7). Ici, rien n'est gardé sur l'appareil.
- **Renvoi idempotent** (même identifiant envoyé deux fois après une coupure) : tests unitaires du cas d'usage et de l'adaptateur, pas d'E2E.
- **Échec d'effacement du fichier seul** (le fichier résiste, la ligne pourrait partir) : tests unitaires de `SupprimerLEnregistrementDeLecture` et de `EffacerLesEnregistrementsExpires` (fichier d'abord, rien supprimé sinon). L'E2E couvre l'échec vu par le parent (sans réseau).
- **Fréquence de la tâche planifiée** (toutes les heures, 38.12) : configuration `pg_cron`, vérifiée en review, pas en E2E.
- **Formats** produits par Safari (`audio/mp4`) : liste fermée vérifiée par les tests unitaires de `FichierAudio` ; l'E2E tourne sur Chromium (`audio/webm`).
- **Leçons personnelles** (#39) : refusées par le serveur pendant la beta (38.19) ; la story des leçons personnelles étendra le port `LeconsDuCatalogue`.
- **Rapport de la semaine** (#35) : l'événement `EnregistrementDeLectureGarde` n'a aucun abonné ici.
- **Mode dys** : le bouton d'enregistrement suit le style de la séance, déjà vérifié par #17 et #22 ; pas de scénario propre.

## Questions ouvertes

Les questions **38.1 à 38.20** sont dans `docs/stories/38/domain-model.md`, avec leurs recommandations. Les scénarios les suivent ; ceux qui en dépendent portent `@a-valider` et `# Question 38.n`. Rappel des scénarios concernés :

| n° | Sujet | Scénarios `@a-valider` |
|---|---|---|
| 38.1 | Enregistrement dans la page, « Arrêter » | Pendant qu'il s'enregistre, l'enfant voit … et peut arrêter |
| 38.2 | Accord du parent | aucun (hors périmètre) |
| 38.3 | 3 minutes, 5 Mo, pas de plafond en nombre | L'enregistrement s'arrête tout seul au bout de 3 minutes · refus « de 6 Mo » |
| 38.4 | Pas plus de 30 jours | aucun |
| 38.5 | Export | hors périmètre, #14 |
| 38.6 | Tous les enregistrements non expirés, sans pagination | Tous les enregistrements de lecture non expirés sont montrés, même au-delà de 30 |
| 38.7 | Sans réseau, rien gardé sur l'appareil | Sans réseau, l'enfant se réécoute … · Au retour du réseau, … n'est pas envoyé |
| 38.8 | « gardé jusqu'au … » et phrase des 30 jours | Le suivi montre les enregistrements … avec leur date d'expiration · Le suivi dit que … effacés au bout de 30 jours |
| 38.9 | L'enfant ne revoit rien ; plusieurs enregistrements gardés | Deux enregistrements dans le même exercice … · L'enfant ne réécoute pas un enregistrement de lecture déjà gardé … |
| 38.10 | Messages à l'enfant | Un enregistrement de lecture gardé est annoncé … · Sans réseau, l'enfant se réécoute … |
| 38.11 | Formats sans conversion | refus « au format d'une image » |
| 38.12 | Tâche planifiée toutes les heures | aucun (le scénario d'effacement vaut quelle que soit la fréquence) |
| 38.13 | Pas en révision ni au test de départ | aucun (hors périmètre E2E) |
| 38.14 | Fichiers orphelins de plus d'une heure | Un fichier d'enregistrement sans enregistrement de lecture … (2 cas) |
| 38.15 | Suppression : fichier d'abord, message d'échec | Si la suppression échoue, … |
| 38.16 | Ligne : titre relu, « Enregistrement » | Le suivi montre les enregistrements … · Un enregistrement de lecture d'une leçon qui n'est plus dans la bibliothèque … |
| 38.17 | Phrase et bouton seulement si l'appareil sait enregistrer ; message du micro refusé | Pour une `<sorte>`, le personnage guide invite … · Sur un appareil qui ne sait pas enregistrer (2) · Si le micro est refusé … |
| 38.18 | « J'ai écouté » pendant l'enregistrement | Dire qu'il a écouté pendant l'enregistrement l'arrête et le garde |
| 38.19 | Leçons hors du Catalogue refusées | refus « d'une leçon qui n'est pas dans la bibliothèque » |
| 38.20 | Glossaire (définition élargie, sortes) | aucun (vocabulaire des scénarios inchangé dans les deux cas) |

### Questions nouvelles

**38.21. Scénario livré de #22 et phrase « Tu peux t'enregistrer ».** `features/22-memoriser-une-poesie.feature`, plan « Pour une `<sorte>`, le personnage guide invite à `<verbe>` tout le texte », attend « À toi ! `<Verbe>` tout le texte, tranquillement. Quand c'est bon, on joue ! ». Avec #38 (38.17), sur l'appareil des tests E2E, qui sait enregistrer, la phrase complète revient : le scénario de #22 échouera.
- **Recommandation** : ajouter à ce plan de #22 l'étape « Étant donné que l'appareil ne sait pas enregistrer » (son sens est gardé : on ne mentionne pas ce que l'enfant ne peut pas faire), et laisser à #38 le cas où l'appareil sait enregistrer. Modification faite par l'équipe de #38, dans sa PR, avec l'accord du PO.

**38.22. « L'enregistrement est refusé » dans #24 et #27.** Les étapes livrées « l'enregistrement est refusé » et « l'enregistrement est refusé comme pour un profil introuvable » parlent de l'enregistrement d'une **séance terminée** ou d'un **test de départ** par le serveur, pas d'un enregistrement de lecture. Le mot « enregistrement » seul devient ambigu.
- **Recommandation** : dans #38, écrire **toujours** « enregistrement de lecture » en entier (« l'enregistrement de lecture est refusé ») ; ne pas toucher aux étapes livrées. À noter au glossaire, sans nouveau terme : « enregistrement » seul ne désigne jamais un enregistrement de lecture.

**38.23. Suivi sans enregistrement.** Le legacy ne montre pas le bloc « Lectures et récitations enregistrées » quand il n'y en a aucun, et le retire après la suppression du dernier.
- **Recommandation** : **garder le legacy** (pas de bloc vide). La phrase sur les 30 jours (38.8) n'apparaît donc qu'avec au moins un enregistrement, là où elle sert.

**38.24. Écouter dans le suivi.** Le legacy met un lecteur audio dans chaque ligne. Avec une URL signée de 5 minutes, demandée au moment de l'écoute (modèle), un lecteur préparé à l'affichage expirerait.
- **Recommandation** : un bouton **« Écouter »** par ligne, qui demande l'URL signée puis joue l'enregistrement (avec les commandes de lecture du navigateur une fois chargé). Nom lu par les lecteurs d'écran : « Écouter l'enregistrement de lecture `<titre>` du `<date>` », et de même pour « Supprimer », pour distinguer les lignes.

**38.25. Accessibilité de l'enregistrement en cours.** Textes et forme proposés :
- pendant l'enregistrement, le bouton devient « Arrêter », un témoin « Enregistrement en cours » s'affiche, et les lecteurs d'écran l'annoncent une fois (« Enregistrement en cours ») ; à l'arrêt, ils annoncent « Enregistrement terminé » ;
- le témoin pulse doucement ; avec les mouvements réduits, il reste fixe (texte et point rouge).
- **Recommandation** : **oui**, textes ci-dessus. Le témoin ne dit jamais un temps qui reste (pas de compte à rebours : l'arrêt à 3 minutes est un garde-fou, pas une limite de jeu).

**38.26. Vérifier l'effacement dans le stockage.** La règle des 30 jours exige que l'enregistrement « n'existe plus, ni en base ni dans Storage » (issue). Ce n'est pas observable par un utilisateur : les scénarios « … n'existe plus, ni son fichier » et « ce fichier n'existe plus » regardent la table et le bucket avec la clé `service_role`, côté Node.
- **Recommandation** : **accepter cette exception** à la règle « `Alors` observable » pour ces 3 cas, parce que c'est une obligation RGPD. Le reste de la règle 6 est vérifié comme le voit le parent (introuvable, plus listé).

**38.27. « Poésie : Chanson d'automne » (Verlaine, CM1).** Son titre contient « Chanson » : `estUneChanson` la traite comme une chanson (constat de #22). Le bouton dira donc « Je chante et je m'enregistre ».
- **Recommandation** : **garder** pour la beta, cohérent avec « Chante » déjà dit par Noisette (#22). Si le PO veut « Je récite », la correction se fait une fois pour #22 et #38 (contenu ou règle `estUneChanson`), dans une story à part.

**38.28. Petit son après l'enregistrement.** Le legacy joue un petit son magique à la fin de l'enregistrement.
- **Recommandation** : **ne pas le reprendre**. Il couvrirait le début de la réécoute ; le message « Bravo ! … » suffit. Aucun scénario.

**38.29. Format des dates du suivi.** Le legacy écrit `23/10/2026` (`fr-FR`). La ligne devient « `<titre>` · `<date>` · gardé jusqu'au `<date d'expiration>` ».
- **Recommandation** : **même format que la « Dernière séance » de #34** (une seule façon d'écrire une date dans le suivi) ; la date d'expiration est un jour, sans heure.

## Décisions

Aucune pour l'instant : les questions 38.1 à 38.29 attendent la validation du PO.
