# Critères d'acceptance : story #129, textes qui se dévoilent comme un parchemin (tranche 98e)

Scénarios : `features/129-parchemin.feature`. Modèle : `docs/stories/129/domain-model.md`. Épopée #95, tranche 98e de #98 (`docs/stories/98/domain-model.md`, abrégé « #98 »).

Tags :
- `@issue-129 @wip` sur la fonctionnalité ;
- `@a-valider` sur les scénarios qui suivent la reco d'une question encore ouverte (#129.1 à #129.5) ; le commentaire au-dessus de chaque scénario cite la question ;
- pas de `@acces` (voir « Droits d'accès ») ; pas de `@depend-de-…` : #97, #98 et #126 sont mergées.

État : **cadrage à valider** par le PO (questions #129.1 à #129.11).

## Objectif

En tant qu'**enfant**, je veux que le texte à lire se déroule comme un parchemin pendant que le personnage guide le lit, afin de suivre la lecture comme une aventure.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : l'enfant suit la voix des yeux, phrase après phrase ou vers après vers, et retrouve ensuite tout le texte pour répondre ou pour redire ;
- **autonomie** : un enfant qui lit seul n'attend jamais la voix (Muet, voix bloquée, « J'ai écouté » : tout s'ouvre) ; il retrouve son univers sur le parchemin.

La story ne change que l'affichage du texte d'une `lecture` et des vers d'un `memoriser` pendant la première lecture. Aucune règle de correction, aucune erreur, aucune étoile, aucun avancement, aucune parole du personnage guide ne change. Aucune donnée nouvelle, aucune migration, aucune Edge Function. Seule exception possible, dans le domaine Voix : une lecture pure qui donne le rang de la phrase de chaque mot affiché, si #129.1 est tranchée « phrase après phrase ». Aucun garde-fou de la section 5 n'est franchi : pas de récompense, pas de hasard, pas de pénalité, pas d'attente imposée (le déroulement suit la voix, il ne la mène pas, P3).

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Pendant la première lecture, le texte se déroule avec la voix : phrase après phrase en lecture, vers après vers en poésie ; le titre est visible dès l'ouverture ; ensuite, tout reste visible, pour les questions, pour redire et après « Réécouter » ; un toucher sur le parchemin ne fait rien | Plan « À l'ouverture de <exercice>, le titre est visible et le parchemin est encore roulé » : lecture, poésie (2) · « En lecture, chaque phrase apparaît en entier quand Noisette commence à la lire » `@a-valider` (#129.1) · Plan « Quand Noisette commence « <phrase lue> », les phrases d'avant sont visibles et la suivante est cachée » : 1re et 3e phrases (2) `@a-valider` (#129.1) · « Quand Noisette a fini de lire le texte, tout le texte reste visible » · Plan « Pendant les questions, tout le texte reste visible au-dessus de la question « <question> » » : 1re et 2e questions (2, P2) · « Après la première lecture, « Réécouter » ne cache aucune phrase » (98.12) · « En lecture, « Réécouter » pendant la première lecture ne cache pas les phrases déjà dévoilées » `@a-valider` (#129.4) · « En poésie, chaque vers apparaît quand Noisette commence à le lire » · Plan « Quand Noisette commence le vers « <vers lu> », les vers d'avant sont visibles et le suivant est caché » : 1er et 3e vers (2) · « Quand Noisette a lu le dernier vers, les 6 vers restent visibles pour redire la poésie » (P2) · « En poésie, « Réécouter » pendant l'écoute garde visibles les vers déjà dévoilés » `@a-valider` (#129.4) · Plan « Toucher le parchemin pendant <exercice> ne saute pas la lecture » : lecture, poésie (2, 97.17) |
| R2 | Sans voix, tout le texte est visible tout de suite ; si la lecture s'arrête avant la fin, tout le texte s'ouvre aussitôt ; un enfant qui lit seul n'attend jamais la voix | Plan « En lecture, quand <cas>, tout le texte est visible dès l'ouverture de l'exercice » : Muet, voix bloquée, pas de synthèse vocale (3, 98.12) · Plan « En poésie, quand <cas>, les 6 vers sont visibles dès l'ouverture de l'exercice » : les mêmes (3) · Plan « En lecture, quand <arrêt> au milieu du texte, tout le texte s'ouvre aussitôt » : « J'ai écouté », passage en Muet, voix bloquée en cours (3) `@a-valider` (#129.3) · « « J'ai écouté » à la deuxième phrase : la première question s'affiche sous tout le texte » `@a-valider` (#129.3, P2) · Plan « En poésie, quand <arrêt> pendant l'écoute, les 6 vers s'ouvrent aussitôt » : Muet, voix bloquée en cours (2) `@a-valider` (#129.3) · « Si la voix lit sans signaler les mots, tout le texte s'ouvre sans attendre la fin de la lecture » `@a-valider` (#129.2) · « En séance de révision, en Muet, tout le texte de la question de lecture est visible tout de suite » (invariant 12, 98.13) |
| R3 | Avec les mouvements réduits, tout le texte est visible tout de suite : rien ne se déroule, le mot prononcé reste surligné et le vers lu reste mis en avant ; si le réglage change pendant la lecture, tout s'ouvre | Plan « Avec les mouvements réduits, <contenu> est visible tout de suite, sans déroulement » : lecture, poésie (2, I9) · « Si l'appareil passe aux mouvements réduits pendant la lecture, tout le texte s'ouvre aussitôt » |
| R4 | Dans chacun des 6 univers, le parchemin a le dessin de cet univers, en séance et en séance de révision ; le texte reste du texte, lisible, en mode dys aussi, et tient à 360 px ; changer d'univers ne change ni le texte, ni la voix, ni le déroulement, ni ce que lisent les lecteurs d'écran ; un profil sans univers connu voit le parchemin de l'univers « Animaux de la forêt » | Plan « Dans l'univers « <univers> », le texte d'une lecture est sur le parchemin de cet univers, et les lecteurs d'écran ne lisent que le texte » : les 6 univers (98.2, 98.31, #129.6) · Plan « Dans l'univers « <univers> », les vers d'une poésie sont sur le parchemin de cet univers » : les 6 univers · Plan « Dans l'univers « <univers> », <personnage guide> lit le texte, qui se déroule phrase après phrase comme dans tous les univers » : les 5 univers autres qu'Animaux de la forêt (P6) `@a-valider` (#129.1) · Plan « Un profil enfant <cas> voit le parchemin de l'univers « Animaux de la forêt » » : sans univers, univers inconnu (2, I16) · « En séance de révision, le texte de la question de lecture est sur le parchemin de l'univers » : Sports (98.13) · Plan « Dans l'univers « <univers> », sur un écran de 360 px, <contenu> tient dans la largeur et se lit en entier » : lecture dans les 6 univers, poésie en Sports et Pompiers (8, I17, I18) · Plan « En mode dys, dans l'univers « <univers> », <contenu> s'affiche en mode dys sur le parchemin, sans que son décor cache le texte » : lecture en Animaux de la forêt, Princesses et fées, Police ; poésie en Danse, à 360 px (4, I10, I18) |
| R5 | Le parchemin ne change ni la place du texte, ni ce que lisent les lecteurs d'écran, ni les erreurs, ni l'avancement, ni les étoiles ; il vaut aussi en séance de révision | Plan « Pendant que <contenu> se déroule, le parchemin a déjà sa taille finale et rien ne bouge sous le doigt » : lecture (« J'ai écouté »), poésie (« Réécouter ») (2, P4) `@a-valider` (#129.5) · Plan « Pendant que <contenu> se déroule, les lecteurs d'écran peuvent lire tout le texte » : lecture, poésie (2, P5, I11) `@a-valider` (#129.5) · Plan « <cas>, Léa répond aux questions du texte <déroulé> et gagne <étoiles>, comme avant » : Animaux de la forêt sans erreur (3), Danse une erreur (2), Muet sans erreur (3), mouvements réduits une erreur (2) (4, I1) · Plan « Pendant que <contenu> se déroule, l'avancement de la séance ne change pas » : lecture 0 sur 4, poésie 0 sur 12 (2, I1) · « En séance de révision, le texte de la question de lecture se déroule comme en séance » `@a-valider` (#129.1, invariant 12) |

Au total : **5 règles, 33 scénarios** (dont 20 plans de scénario, **64 exemples**), soit **77 cas exécutés**. **12 scénarios** portent `@a-valider` (dont 5 plans), soit 24 cas.

R5 regroupe les invariants de #98 et de la tranche (P4, P5, I1, invariant 12) ; le modèle compte 4 règles, auxquelles s'ajoute ce bloc d'invariants, comme dans #98.

Les Plans sur les univers suivent la mesure de #98 et #126 : les 6 univers là où le dessin peut changer ce qu'on vérifie (dessin et lecteurs d'écran, tenue à 360 px avec un texte de 6 phrases) ; les 5 autres univers là où l'on compare à Animaux de la forêt (déroulement commun) ; en mode dys, 3 univers pour la lecture et Danse pour la poésie (sa partition a des portées en haut et en bas, au plus près des vers) ; 2 univers là où le dessin ne peut rien changer (étoiles) ; Sports seul pour la séance de révision.

Checklist `po-acceptance` du skill `gamification` :
- besoin nourri : compétence et autonomie (ci-dessus) ;
- déclencheur de chaque retour : le **mot prononcé** (Voix) pour une phrase, le **vers lu** pour un vers ; la fin de la lecture, « J'ai écouté », le Muet, la voix bloquée et la parole non entendue pour tout ouvrir. Aucune récompense nouvelle ;
- retour après une erreur : Plan des étoiles de R5 (une erreur à « Où dort Plume ? », 2 étoiles, comme avant) ;
- mouvements réduits : R3, l'information reste (tout le texte, mot surligné, vers mis en avant) ;
- aucune durée ni classe CSS dans les étapes ; aucun garde-fou franchi.

### Droits d'accès

La story ne crée, ne lit et n'enregistre aucune donnée nouvelle : **pas de scénario `@acces`**. L'univers est lu sur le profil enfant en cours (#6, #96). Les écrans du parent ne montrent aucun exercice.

### Séance complète et délais

**Aucun scénario ne joue une séance complète d'une leçon.** Le Plan des étoiles de R5 (4 cas) joue **tout l'exercice « Le petit chat Plume »** jusqu'à la fin de la séance (« Léa joue seulement l'exercice… » : séance d'un seul exercice, texte puis 4 questions, puis les étoiles). C'est plus long qu'un scénario courant, surtout avec la voix factice qui lit les 6 phrases : **ajouter `@issue-129` aux tags du `Before` de `features/steps/delais.steps.ts`** (délai de 120 s) est recommandé ; `e2e-tester` peut s'en passer s'il mesure moins de 30 s. Les autres scénarios s'arrêtent au texte, à la première ou à la deuxième question, ou au temps « redire » de la poésie. Deux scénarios ouvrent une séance de révision sans aller jusqu'à sa fin.

### Précisions pour les étapes (pour `e2e-tester`)

- **Projets** : tous les scénarios tournent sur `telephone` (mise au point) et `tablette` (non-régression).
- **Dessin de l'univers** : « le parchemin a le dessin de l'univers « … » » se vérifie par **`data-univers`** sur le parchemin (vigilance 6 du modèle), égal à la clé de l'univers ; jamais par un tracé SVG. Il vaut pour `TexteDeLecture` (séance et révision) et pour la liste des vers de `ExerciceDeMemorisation`.
- **Visible, caché** : un attribut d'état de dévoilement par phrase et par vers (nommé par l'implementer). « n'est pas encore visible », « restent cachées » : l'élément est dans la page, à sa place, mais invisible à l'œil (opacité nulle ou masque), **jamais retiré** ; « tout le texte est visible » : toutes les phrases (ou les 6 vers) dévoilées et visibles, de la première à la dernière nommée.
- **Tout de suite, aussitôt** : « tout de suite » = dès que le texte s'affiche, sans aucun état « caché » observé ; « aussitôt » = juste après l'action, avant la phrase suivante de la voix ; « bien avant la fin de la lecture » (#129.2) = pendant que la voix factice lit encore la première moitié du texte (reco : 2 s sans mot signalé). Les attentes Playwright (`expect` qui réessaie) suffisent.
- **Rien ne se déroule** : aucune phrase ni aucun vers n'est jamais vu dans l'état caché pendant toute la lecture.
- **Phrases** : la voix factice signale les mots (`onMot`) ; « Noisette commence à lire la phrase « … » » attend que le premier mot de cette phrase soit prononcé (`data-prononce`) ; « Noisette en est à la phrase « … » » est le même état, posé en préparation. Les phrases sont coupées comme la lecture à voix haute (après `.`, `!`, `?`, `…`, `:`).
- **Vers** : « commence à lire le vers « … » » attend que ce vers soit mis en avant (`data-lu`) ; « Noisette a lu les 3 premiers vers » attend que le 4e vers soit mis en avant.
- **Toucher le parchemin** : un toucher au centre du texte, pendant la lecture ; la voix continue (la parole en cours ne change pas), aucune erreur, aucun effet sonore « réponse fausse », aucune question ne s'affiche.
- **Voix qui ne signale pas les mots** (#129.2) : la voix factice lit le texte en entier (même durée) sans jamais appeler `onMot`.
- **Mouvements réduits en cours de lecture** : émuler `prefers-reduced-motion: reduce` après le début de la lecture (`page.emulateMedia`), le hook est réactif.
- **Taille finale** (#129.5) : la boîte englobante du parchemin a la même hauteur à la première phrase (ou au premier vers) et une fois tout le texte visible ; celle de « J'ai écouté » (ou de « Réécouter ») a la même position aux deux instants.
- **Lecteurs d'écran** : « les lecteurs d'écran lisent tout le texte, sans décrire le dessin du parchemin » lit l'arbre d'accessibilité du parchemin : tout le texte (6 phrases ou 6 vers), aucun `aria-hidden` sur une phrase cachée, le dessin `aria-hidden`, aucun libellé du dessin ; « n'annoncent aucun dévoilement » : aucune région `aria-live` ne change pendant le déroulement.
- **Étoiles** : « Léa répond aux questions du texte, sans erreur | en se trompant une fois à « … » » dit « J'ai écouté », puis répond aux 4 questions (bonnes réponses de la bibliothèque : « gris », « sur le lit de Léa », « une souris », « du lait » ; l'erreur prend un autre choix une fois, puis la bonne réponse).
- **Question retenue de lecture en révision** : « Léa a pour question retenue la question « Où dort Plume ? » de l'exercice « Le petit chat Plume », due aujourd'hui » prépare une question retenue de la leçon `fr-cp-lecture-petit-chat`, sur le modèle de l'étape de #126 (« Léa a pour question retenue l'étiquette … ») ; la bibliothèque de test des révisions de #28 n'a pas de question de lecture.
- **Étapes de #98 à ouvrir à `@issue-129`** si elles sont filtrées par tag : « Léa a un profil enfant préparé de niveau CP dans l'univers « … » », « Léa a choisi l'univers <clé> », « Léa a un profil enfant préparé sans univers | dont l'univers est inconnu ».

#### Étapes nouvelles

- « Noisette lit le texte », « <personnage guide> lit le texte », « Noisette commence à lire le texte »
- « <personnage guide> a fini de lire le texte » ; « <personnage guide> a lu le dernier vers » (forme avec un autre personnage guide que Noisette de l'étape de #22)
- « Noisette commence à lire la phrase « … » », « Noisette commence à lire le vers « … » »
- « Noisette en est à la phrase « … » », « Noisette en est au vers « … » », « Noisette a lu les 3 premiers vers de « … » »
- « Léa n'a pas encore dit qu'elle a écouté » (état de départ, sans action)
- « aucune phrase du texte n'est visible tant que Noisette présente l'histoire », « aucun vers n'est visible tant que Noisette annonce l'écoute »
- « chaque phrase du texte apparaît en entier quand <personnage guide> commence à la lire », « les phrases que Noisette n'a pas encore commencées restent cachées », « ensuite, chaque phrase suivante apparaît en entier quand Noisette commence à la lire »
- « chaque vers apparaît quand Noisette commence à le lire », « les vers que Noisette n'a pas encore commencés restent cachés », « ensuite, le vers « … » apparaît quand Noisette commence à le lire »
- « les phrases « … » (, « … » et « … ») sont visibles », « la phrase « … » n'est pas encore visible », « les vers « … » … sont visibles », « le vers « … » n'est pas encore visible »
- « (ensuite,) tout le texte est visible (tout de suite | aussitôt | bien avant la fin de la lecture), de « … » à « … » », « les 6 vers sont visibles (tout de suite | aussitôt), de « … » à « … » »
- « rien ne se déroule », « aucune phrase ne se cache de nouveau pendant que Noisette relit »
- « le vers « … » est de nouveau mis en avant »
- « Léa touche le parchemin », « Noisette continue de lire « … » »
- « le navigateur bloque la voix pendant que Noisette lit », « l'appareil se met à demander des mouvements réduits », « la voix de l'appareil lit sans signaler les mots qu'elle prononce », « Léa entend toujours Noisette lire le texte jusqu'au bout »
- « le parchemin a le dessin de l'univers « … » », « le décor du parchemin ne cache pas le texte »
- « les lecteurs d'écran lisent tout le texte, sans décrire le dessin du parchemin », « les lecteurs d'écran n'annoncent aucun dévoilement »
- « le parchemin a, dès la première phrase | le premier vers, la hauteur qu'il a une fois tout le texte visible », « « J'ai écouté » | « Réécouter » ne bouge pas pendant que le texte | la poésie se déroule »
- « Léa voit le texte en mode dys : police Andika, lettres, mots et lignes espacés » (« Léa voit les vers en mode dys : … » existe déjà, #22)
- « Léa répond aux questions du texte, sans erreur | en se trompant une fois à « … » »
- « Léa a pour question retenue la question « … » de l'exercice « … », due aujourd'hui »

#### Étapes existantes reprises

« Léa est sur la page de la leçon « … » », « Léa choisit seulement l'exercice « … » », « Léa joue seulement l'exercice « … » de la leçon « … » », « Léa commence l'exercice « … » de la leçon « … » », « Léa voit « … » » (#17, #18, #22) ; « Noisette a lu le texte de l'exercice « … » », « Léa dit qu'elle a écouté », « la question « … » s'affiche (avec les choix …) », « Léa a répondu « … » à la question « … » », « Léa voit toujours le texte « … » au-dessus de la question « … » », « chaque mot du texte est surligné au moment où Noisette le prononce » (#17) ; « Noisette lit la poésie vers par vers », « Noisette a lu le dernier vers », « chaque vers est mis en avant pendant que Noisette le lit », « Léa voit les 6 vers, un par ligne », « Léa peut dire qu'elle est prête », « Léa voit les vers en mode dys : … » (#22) ; « Léa demande à réécouter », « l'avancement de la séance montre 0 question réussie sur <n> » (#16) ; « la tablette est en Muet », « le navigateur bloque la voix », « le navigateur ne sait pas lire à voix haute », « Léa passe en Muet », « plus aucun mot n'est surligné quand la lecture est finie » (#7) ; « Léa n'entend pas l'effet sonore « réponse fausse » » (#97) ; « Léa gagne <n> étoiles » (#24) ; « Léa commence la séance de révision » (#28) ; « l'appareil demande des mouvements réduits », « aucun message d'erreur n'apparaît » (#6) ; « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran » (socle) ; « Paul a réglé « mode dys » sur « oui » pour Léa » (#12) ; « Léa a choisi l'univers <clé> », « Léa a un profil enfant préparé sans univers | dont l'univers est inconnu » (#98).

Aucune étape existante ne change de sens.

## Scénarios existants à mettre à jour

**Aucun texte de scénario existant ne change** avec les recos. Points à surveiller dans les étapes :

| Fichier | Scénario | Ce qui peut changer dans l'étape |
|---|---|---|
| `features/17-…` | « Le texte de lecture reste affiché pendant les questions », « L'histoire est présentée, puis lue… » | Le texte est d'abord roulé : une étape qui lirait tout le texte **pendant** la lecture doit attendre la fin de la lecture ou « J'ai écouté ». Après, rien ne change (P2). |
| `features/22-…` | « La carte de la poésie montre son titre, son auteur et ses vers » (« Léa voit les 6 vers, un par ligne » juste après l'ouverture) | Pendant l'écoute, les vers pas encore lus sont cachés à l'œil : l'étape doit attendre la fin de l'écoute, ou compter les vers présents dans la page (ils y sont tous, P5). |
| `features/38-…` | Enregistrements de lecture après « Noisette a lu le texte… » | Aucun : le texte est entier après la lecture. |

## Hors périmètre

- **Le dessin de chaque univers** : il est choisi par le PO (#129.6, #129.7, #129.8) et validé sur la planche `parchemin.png` (98.28), pas par un scénario. La PR attend les 6 dessins validés (98.31).
- **Les 6 captures jointes à la PR** (98.29, #129.9) : sans tag `@visuel`, sans capture de référence ; elles ne font échouer aucun test.
- **Le test de départ** : il ne pose aucune question de `lecture` ni de `memoriser` (modèle, « Où le texte est joué »).
- **La séance de révision en poésie** : elle ne pose aucune question de `memoriser`.
- **Les entraînements de la poésie** (ordre des vers, mots cachés) : ils ne montrent pas la poésie déroulée ; #22 et #130 les couvrent.
- **La sortie de l'exercice en pleine lecture** : rien d'observable après la sortie ; à la réouverture, l'exercice repart de son début comme aujourd'hui (#129.4 pour ce qui reste dévoilé).
- **Le mot prononcé surligné et le vers mis en avant** : inchangés (#7, #17, #22), seulement repris comme signaux communs.
- Aucune donnée, aucune règle d'Apprentissage, aucun son nouveau.

## Questions ouvertes

Les questions **#129.1 à #129.9** sont posées dans `docs/stories/129/domain-model.md`, avec leur contexte, leur exemple, leur reco et leurs options. Elles sont reprises ici en bref, avec les scénarios qui en dépendent.

1. **#129.1 En `lecture`, le texte se déroule-t-il phrase après phrase ?** Reco : oui, avec la coupure de la voix. Scénarios `@a-valider` : « En lecture, chaque phrase apparaît en entier… », Plan « Quand Noisette commence « <phrase lue> »… » (2), Plan « Dans l'univers « <univers> », <personnage guide> lit le texte, qui se déroule phrase après phrase… » (5), « En séance de révision, le texte de la question de lecture se déroule comme en séance ». Les scénarios qui disent « Noisette en est à la phrase « … » » s'appuient aussi sur cette reco.
2. **#129.2 Si la voix lit sans signaler les mots, le texte s'ouvre-t-il en entier tout de suite ?** Reco : oui, après 2 s sans mot signalé. Scénario `@a-valider` : « Si la voix lit sans signaler les mots… ».
3. **#129.3 Si la lecture s'arrête avant la fin (« J'ai écouté », Muet, voix bloquée, sortie), tout le texte s'ouvre-t-il aussitôt ?** Reco : oui. Scénarios `@a-valider` : Plan « En lecture, quand <arrêt> au milieu du texte… » (3), « « J'ai écouté » à la deuxième phrase… », Plan « En poésie, quand <arrêt> pendant l'écoute… » (2).
4. **#129.4 Une reprise (« Réécouter » pendant l'écoute, réouverture) garde-t-elle visibles les phrases et les vers déjà dévoilés ?** Reco : oui. Scénarios `@a-valider` : « En lecture, « Réécouter » pendant la première lecture… », « En poésie, « Réécouter » pendant l'écoute… ».
5. **#129.5 La place du texte entier est-elle gardée, et les lecteurs d'écran lisent-ils tout le texte pendant le déroulement ?** Reco : oui aux deux. Scénarios `@a-valider` : Plan « … le parchemin a déjà sa taille finale… » (2), Plan « … les lecteurs d'écran peuvent lire tout le texte » (2).
6. **#129.6 Quel parchemin dans chaque univers ?** Reco A (feuille d'arbre, parchemin royal, tableau de l'entraîneur, carnet d'enquête, carnet de bord de la caserne, partition). Pas de scénario : la planche le tranche ; les Plans des 6 univers lisent seulement `data-univers`.
7. **#129.7 En Sports, garder le « tableau de l'entraîneur », aussi piste de la case de la dictée de #128 ?** Reco : oui. Pas de scénario.
8. **#129.8 En Police, garder « carnet d'enquête » comme nom de l'objet ?** Reco : oui, dessin limité au carnet et à la loupe. Pas de scénario.
9. **#129.9 Quelles 6 captures joindre à la PR ?** Reco : une `lecture`, texte entier et première question, à 360 px, dans chaque univers. Pas de scénario.
10. **#129.10 En `lecture`, pendant la présentation de l'histoire (« Installe-toi bien, j'ai une histoire pour toi… »), le parchemin est-il roulé, avec seulement le titre de l'exercice visible ?**
    Contexte : le modèle dit « le titre (et la carte de la poésie) est visible dès le début » et que le texte ne se dévoile qu'avec la voix ; la présentation dure plusieurs secondes avant la première phrase. En séance de révision, la question de lecture n'a pas toujours de titre affiché.
    Exemple : Léa ouvre « Le petit chat Plume » : elle voit le titre « Le petit chat Plume » et le parchemin roulé pendant que Noisette présente l'histoire ; « Plume est un petit chat gris. » apparaît quand Noisette dit « Plume ».
    Reco : **oui**, roulé avec le titre seul (c'est la colonne 1 « Roulé : titre seul, pendant l'introduction » de la planche du modèle). Scénario concerné : Plan « À l'ouverture de <exercice>, le titre est visible et le parchemin est encore roulé » (pour la poésie, le roulé pendant l'annonce suit la même reco).
    Option : la première phrase est visible dès l'ouverture, les suivantes se dévoilent avec la voix.
11. **#129.11 En séance de révision, « J'ai écouté » existe-t-il, et la question de lecture arrive-t-elle comme en séance, après le texte lu ?**
    Contexte : le modèle dit que `useDeroulementDeRevision` lit le texte (`lireLeTexte`, `texteEcoutePour`) ; les scénarios de R2, R4 et R5 en séance de révision supposent le même enchaînement qu'en séance (texte lu, puis question). Aucun scénario existant de #28 ne joue une question de lecture en révision.
    Exemple : Léa a « Où dort Plume ? » à revoir : Noisette lit le texte, qui se déroule phrase après phrase, puis « Où dort Plume ? » s'affiche sous tout le texte.
    Reco : **oui, même enchaînement** qu'en séance (98.13) ; c'est un fait à confirmer par l'implementer, pas une règle nouvelle. Scénarios concernés : « En séance de révision, en Muet… », « En séance de révision, le texte de la question de lecture est sur le parchemin de l'univers », « En séance de révision, le texte de la question de lecture se déroule comme en séance ».

## Termes

| Terme | Statut | Remarque |
|---|---|---|
| Parchemin | Mot d'interface (décision n°30), hors glossaire | Le support du texte et son déroulement ; jamais lu ni annoncé |
| Première lecture | Mot de cadrage | La lecture automatique à l'ouverture |
| Phrase | Lecture à voix haute (Voix, « phrase par phrase ») | Unité du déroulement en `lecture` (#129.1) |
| Vers | Glossaire | Jamais « ligne » (synonyme interdit) |
| Se dévoile, apparaît, caché, roulé | Mots de scénario | « Caché » = caché à l'œil seulement (#129.5) |

Rien n'est ajouté au glossaire.

## Décisions

Aucune pour l'instant : toutes les questions attendent la réponse du PO.

## Historique

| Date | Changement |
|---|---|
| 2026-11-03 | Critères d'acceptance : 5 règles, 33 scénarios (77 cas), 12 `@a-valider` ; questions #129.10 et #129.11 ajoutées. |
