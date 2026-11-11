# Story #182 : critères d'acceptance

> Rédigé par `po-acceptance`, 2026-11-10, à partir de l'issue #182, de `domain-model.md` et du brouillon de la décision 0043.
> Scénarios : `features/182-voix-mp3-piper.feature` (`@issue-182`). Cadrage validé par le PO le 2026-11-11 (voir « Réponses du PO ») ; plus aucun scénario `@a-valider`, tag `@wip` retiré comme pour les features validées.

## Objectif

En tant qu'**enfant**, je veux entendre mon personnage guide lire les consignes, les questions et ses paroles **sur n'importe quel appareil, sans qu'un adulte installe quoi que ce soit**, afin de faire mes leçons même si je lis encore mal.

## Règles et scénarios

| # | Règle | Scénarios |
|---|---|---|
| 1 | Une phrase enregistrée est dite par la voix enregistrée, même sur un appareil sans voix française | Sans voix française sur l'appareil, la consigne est lue par la voix enregistrée · Avec une voix française sur l'appareil, la phrase enregistrée garde la voix enregistrée · Une consigne écrite avec des symboles retrouve la phrase enregistrée dite avec des mots · `@paroles-fixes-fabriquees` Sans voix française sur l'appareil, la félicitation du personnage guide est dite par la voix enregistrée |
| 2 | Une phrase sans MP3 lisible est dite par la voix de l'appareil, pour cette phrase seulement (repli sur la voix de l'appareil) | Un calcul tiré au hasard est dit par la voix de l'appareil · Dans une même consigne, chaque phrase garde sa voix, dans l'ordre et jamais en même temps · Une phrase enregistrée dont le MP3 ne peut pas être lu est dite par la voix de l'appareil, sans message · Le mot à écouter en anglais garde la voix anglaise de l'appareil |
| 3 | Sans MP3 lisible ni voix française, l'enfant lit un message juste (voix indisponible) et continue sa leçon | Sans MP3 ni voix française, l'enfant lit le message de voix indisponible, pas celui de voix bloquée · Sans MP3 ni voix française, l'enfant réussit quand même la question · Le message de voix indisponible n'apparaît qu'une fois · Le message de voix indisponible disparaît dès qu'une phrase enregistrée est entendue · Le message de voix bloquée remplace le message de voix indisponible, jamais les deux à la fois · Quand le navigateur refuse de jouer la voix enregistrée, l'enfant voit le message de voix bloquée |
| 4 | La voix enregistrée respecte le Muet, la voix suspendue, l'arrêt, la lecture lente et le surlignage, comme la lecture à voix haute | En Muet, une phrase enregistrée n'est pas entendue · Passer en Muet coupe tout de suite la voix enregistrée · Réécouter reprend la phrase enregistrée depuis le début, sans deux lectures en même temps · Quitter l'écran coupe la voix enregistrée · En arrivant sur un écran du parent, la voix enregistrée s'arrête et ne reprend pas · Écouter plus lentement fait entendre le mot dicté enregistré à l'allure lente · Sans MP3 lent, le mot dicté enregistré est quand même dit plus lentement par la voix enregistrée · Pendant une phrase enregistrée, les mots sont surlignés l'un après l'autre, puis plus aucun à la fin |
| 5 | Rien de personnel n'est dit par la voix enregistrée : le prénom reste affiché | Le prénom de l'enfant n'est jamais dit par la voix enregistrée · Le personnage guide salue l'enfant sans dire son prénom, et le prénom reste affiché · Avec une voix française sur l'appareil, la phrase avec le prénom est dite en entier par la voix de l'appareil |
| 5 bis | Dans l'espace parent, la voix de Savanturier est présentée d'abord ; la voix de l'appareil choisie ne dit que les phrases sans voix enregistrée | Le parent voit d'abord la voix de Savanturier, puis le choix de la voix de l'appareil pour les phrases sans voix enregistrée · Une voix imposée ne remplace pas la voix enregistrée d'une phrase enregistrée · Une voix imposée dit les phrases sans voix enregistrée · Sans voix française sur l'appareil, le parent apprend que la voix de Savanturier lit les leçons |
| 6 | Une leçon ouverte une fois avec le réseau reste lue par la voix enregistrée sans réseau | `@pwa` Sans réseau, la leçon déjà ouverte est lue par la voix enregistrée · `@pwa` Après une nouvelle version, la leçon déjà ouverte reste lue sans réseau par la voix enregistrée · `@pwa` Sans réseau, une leçon jamais ouverte est lue par la voix de l'appareil, sans message |
| 7 | Une fois un niveau fabriqué, les consignes de ses leçons sont lues sans aucune voix installée | `@hors-182a` Plan : Sans voix française, les consignes de la leçon « <leçon> » (<niveau>) sont lues par la voix enregistrée (exemples `@niveau-cp`, `@niveau-ce1`, `@niveau-ce2`, `@niveau-cm1 @niveau-cm2`) |

8 règles, 33 scénarios (le plan de la règle 7 compte pour un, avec 7 exemples).

## Tags propres à la story, et livraisons

| Tag | Sens | Livraison 182a | Livraisons 182b à 182e |
|---|---|---|---|
| (aucun) | MP3 de test fournis par le support : ne dépend d'aucune fabrication | joués | joués |
| `@paroles-fixes-fabriquees` | lit les vrais MP3 des paroles fixes (répertoire publié) | joué une fois les paroles fixes fabriquées (fin de 182a, après le téléchargement du modèle de voix, voir l'escalade réseau de l'issue) ; exclu avant | joué |
| `@hors-182a` + `@niveau-<x>` | lit les vrais MP3 des leçons d'un niveau | exclu (`--grep-invert "…\|@hors-182a"`) | 182b joue `@niveau-cp`, 182c ajoute `@niveau-ce1`, etc. Le tag `@hors-182a` est retiré quand tous les niveaux sont fabriqués |
| `@pwa` | a besoin du service worker | exclu de la configuration principale (déjà le cas) ; **`playwright.pwa.config.ts` doit ajouter `features/182-*.feature` et `(@issue-182 and @pwa)` à son filtre**, comme pour #45 et #97 | idem |

**MP3 de test** : « la phrase « … » est une phrase enregistrée » se prépare par le support E2E (répertoire de test et un MP3 court fourni avec les tests, ou interception réseau de l'adresse du MP3) ; « dont le MP3 ne peut pas être lu » se prépare par une réponse d'erreur ou un MP3 illisible. Les scénarios décrivent le comportement : l'outil reste au choix de l'`e2e-tester`. Le MP3 de test ne contient aucune parole ni aucun son qui contrevienne à la règle absolue (un son neutre suffit).

**Steps existants** : les scénarios réutilisent les formulations de #7, #15, #19, #29, #73 et #8 sans en changer le sens. Les formulations nouvelles ajoutent « avec la voix enregistrée » ou « avec la voix de l'appareil », ou parlent du « message de voix indisponible ».

## Critères vérifiés par les tests unitaires (pytest et Deno, pas en Gherkin)

1. **Clé de phrase identique en Python et en TypeScript** : le jeu de cas partagé `docs/voix/cas-des-cles-de-phrases.json` donne les mêmes phrases et les mêmes clés des deux côtés (`cle-de-phrase_test.ts` et `scripts/tests/test_cle_de_phrase.py`), avec au moins les cas de la section 3.1 du modèle (guillemets, `+` et `=`, `___`, balise et entité, `…` et `:`, apostrophes droite et typographique, accent en NFD, espaces insécables, « ! » isolé, phrase de nombres, phrase la plus longue).
2. **Collision de clés** : le pipeline s'arrête (`CollisionDeCles`) si deux textes de clé différents donnent la même clé.
3. **Table de prononciation** : chaque entrée a un exemple testé (phrase d'entrée → texte envoyé à la voix) ; le texte affiché et la clé ne changent pas ; une entrée qui ne touche aucune phrase fait échouer le pipeline (`RemplacementSansEffet`) ; changer une entrée ne regénère que les phrases touchées (empreinte de fabrication).
4. **Fabrication reprenable** (Piper remplacé par un faux) : un MP3 déjà présent avec la bonne clé et la bonne empreinte est sauté ; un lot interrompu reprend où il s'est arrêté ; `--niveau` et `--lot` limitent la fabrication ; aucun ménage des fichiers orphelins sans demande explicite.
5. **Répertoire cohérent** : chaque MP3 du répertoire existe, chaque MP3 de `public/voix/` est dans le répertoire (vérifié au build).
6. **Budget de poids** : `public/voix/` au-delà du budget fixé par le PO fait échouer le build (`BudgetDePoidsDepasse`).
7. **Rien de personnel fabriqué** : la liste des phrases à fabriquer ne contient ni prénom ni texte d'un parent (leçons personnelles, mots de la semaine).
8. **Garde de couverture** : pour chaque niveau déjà fabriqué, chaque phrase française dite pendant une leçon de `app/bibliotheque.json` a sa clé dans le répertoire ; les paroles fixes aussi.
9. **Plan de lecture** (domaine Voix, fakes) : phrase enregistrée si française et présente à l'allure demandée, sinon repli ; ordre gardé ; langue étrangère toujours au repli ; `VoixIndisponible` sans MP3 lisible ni voix française ; `VoixBloquee` sur refus du navigateur, MP3 compris ; Muet, voix suspendue et arrêt coupent le MP3 ; fin de lecture à la fin du dernier morceau.
10. **Surlignage approximatif** : `instantsDesMots` répartit la durée au prorata des caractères, dans l'ordre, sans dépasser la durée.

## Critères vérifiés hors E2E

- **Licence** : `public/voix/LICENCE-voix-tom.txt` crédite l'auteur de la voix « tom » (AGPLv3) et `docs/sons.md` (ou équivalent) le mentionne ; le modèle de voix n'est ni dans le dépôt ni dans le build (vérification au build, par exemple dans `secrets_du_build.py` ou un test pytest). Pas de scénario : ce n'est pas un comportement vu par l'enfant ni par le parent.
- **Vérification manuelle du PO** sur le Honor Magic : les leçons des niveaux fabriqués sont lues sans aucune voix installée ; en 182a, les paroles fixes sont dites et le message de voix indisponible remplace « bloquée par ce navigateur ».
- **Page d'écoute** (si 182.5 est acceptée) : écoutée par le PO pour chaque niveau ; ses remarques deviennent des entrées de la table de prononciation.

## Hors périmètre

- Assemblage de morceaux enregistrés (calculs tirés au hasard, lecture des choix un par un) : story de suite si le PO la demande (182.1).
- Voix anglaise enregistrée (182.11).
- Deuxième voix enregistrée pour les personnages guides à voix féminine (182.3, option B).
- La mise en page de l'écran de séance (#183) et les menus du haut et du bas sur téléphone.

## Réponses du PO

**2026-11-11 00:47 UTC**, annonce `[Responsable]` sur l'issue #193, réponse du PO mot pour mot : « Reco tout ».

Lecture : toutes les recommandations de `domain-model.md` (section 9) et de ce fichier sont retenues, avec ces précisions transmises par le responsable des équipes :

| Question | Décision | Effet sur les scénarios |
|---|---|---|
| 182.1 à 182.6 | Recommandations retenues ; **budget de poids : 45 Mo** pour `public/voix/` | Calculs tirés au hasard au repli (règle 2) ; budget vérifié au build (critère unitaire 6) |
| 182.7 | Message de voix indisponible : « *<nom du personnage guide>* ne peut pas lire cette phrase sur cet appareil. Lis-la avec un adulte, ou touche « Réécouter » plus tard. » | Texte exact dans le scénario de la règle 3 (avec Noisette, univers animaux) |
| 182.8 | 32 kbit/s, 22,05 kHz (182.8a reste ouverte à l'oreille, 24 ou 32) ; **MP3 lents à part** pour les mots dictés ; pas de préchargement de la leçon suivante | Les deux scénarios de lecture lente sont gardés : MP3 lent quand il existe ; sinon la phrase enregistrée est ralentie par le lecteur (`domain-model.md` §4.5) |
| 182.9 | Option A : Espace parent › Voix présente d'abord « la voix de Savanturier » (sans choix), puis le choix de la voix de l'appareil « pour les phrases sans voix enregistrée » | Nouvelle règle 5 bis (4 scénarios) |
| 182.10 à 182.14 | Recommandations retenues | Tags `@hors-182a` et `@niveau-<x>` (182.14) |
| 182.15 | Option B : la phrase sans prénom ne vaut que pour la voix enregistrée, sans voix française ; avec une voix française, la phrase avec le prénom reste dite en entier par elle | Scénario ajouté à la règle 5 ; les scénarios de #24, #29, #100, #101 ne changent pas |
| 182.16 | Terme « message de voix indisponible » retenu ; un seul des deux messages à la fois | Scénario ajouté à la règle 3 (le plus récent remplace l'autre). Terme à porter au glossaire |
| 182.17 | (a) oui, (b) oui | Scénarios `@pwa` de la règle 6 |
| 182.18 | Message de #15 reformulé, sens validé : « La voix de Savanturier lit les leçons ; une voix de l'appareil sert seulement aux phrases fabriquées à la volée » | Texte adapté à l'écran sans voix française (scénario de la règle 5 bis) ; **exemple de #15 modifié** (voir plus bas) |

### Scénarios existants modifiés (autorisé par le PO, 182.18)

- `features/15-choix-de-la-voix.feature`, Plan « Le parent est prévenu quand <situation> », ligne d'exemples `l'appareil n'a aucune voix française` : message attendu remplacé par « Aucune voix française sur cet appareil : la voix de Savanturier lit les leçons ; une voix de l'appareil sert seulement aux phrases fabriquées à la volée, qui ne pourront pas être lues à voix haute. » Step inchangé (`Paul voit le message « … »`) ; le texte vient de `src/voix/ChoixDeLaVoix.tsx`.

**À surveiller sans changement de texte** : les scénarios de #7 et #15 qui attendent une consigne lue « avec la voix « … » » de l'appareil (par exemple « Écoute bien. ») supposent maintenant que cette consigne **n'est pas** une phrase enregistrée ; le support E2E doit garantir que le répertoire de test ne la contient pas. Le step `Paul voit, dans cet ordre, …` de #15 ne doit lister que les voix de l'appareil, pas la voix de Savanturier.

## Décisions

Questions posées au cadrage, tranchées par le PO le 2026-11-11 (« Reco tout », voir « Réponses du PO ») ; libellés d'origine gardés pour la trace :

15. **182.15 Scénarios existants qui font dire le prénom** : si 182.2 est acceptée, des scénarios livrés vérifient que le personnage guide **dit** une phrase avec le prénom (#29 « Noisette dit « Bonjour Léa ! » », #24 « Trois étoiles, … », #100 « Bravo Léa ! … », #101 « Quête du jour accomplie ! Bravo Léa ! »). On ne change pas le sens d'un step existant pendant cette story. (A) ces steps se lisent « la bulle affiche … et la voix dit le même texte sans le prénom », et la story #182 les adapte avec l'accord du PO ; (B) la recommandation 182.2 ne s'applique qu'à la voix enregistrée : la phrase avec le prénom reste dite en entier par la voix de l'appareil quand elle existe, et les scénarios existants (qui tournent avec une voix française) ne changent pas. **Recommandation : B** pour 182a, ce qui ne casse rien ; A à décider plus tard.
16. **182.16 Terme « message de voix indisponible »** : à ajouter au glossaire (à valider), à côté de « Message de voix bloquée », avec le même cycle de vie (un seul message à la fois, il disparaît à la fin de la voix indisponible : une phrase entendue ou le passage en Muet). **Recommandation : oui** ; et un seul message à la fois entre les deux (le plus récent remplace l'autre).
17. **182.17 Hors ligne** : (a) une leçon jamais ouverte, sans réseau, est dite par la voix de l'appareil sans message, ou par le message de voix indisponible s'il n'y a pas de voix française ? **Recommandation : oui** (scénario `@pwa`). (b) Les phrases enregistrées gardées pour une leçon restent disponibles après une nouvelle version de l'application ? **Recommandation : oui** (scénario `@pwa`, cache à part non vidé à chaque publication).
18. **182.18 Message de l'Espace parent › Voix** (#15) : « Aucune voix française trouvée sur cet appareil : installe-en une (voir ci-dessous), puis recharge la page. » pousse encore le parent à installer une voix, alors que la voix enregistrée lit les leçons. Faut-il le reformuler (par exemple « Les phrases sans voix enregistrée ne pourront pas être lues ») ? Complète 182.9 ; **recommandation : à trancher avec 182.9**, sans changer le scénario de #15 dans cette story.

## Questions ouvertes

1. **182.8a** Débit des MP3 : 24 ou 32 kbit/s, à trancher à l'oreille (32 kbit/s retenu en attendant). Aucun scénario n'en dépend.
2. **182.19** Lequel des trois modèles « tom » de Piper. Aucun scénario n'en dépend.
3. **182.20 (nouvelle)** Message de #15 « Ce navigateur ne sait pas lire à voix haute. » : avec la voix de Savanturier, un navigateur sans synthèse vocale lit quand même les phrases enregistrées ; faut-il le reformuler comme 182.18 ? Recommandation : oui, même sens (« La voix de Savanturier lit les leçons ; les phrases fabriquées à la volée ne pourront pas être lues à voix haute sur ce navigateur. »). Le scénario de #15 n'est pas changé tant que le PO n'a pas répondu.
4. **Glossaire** : « voix de Savanturier » (nom de la voix enregistrée dans l'interface, 182.9) et « message de voix indisponible » (182.16) sont à ajouter au glossaire par le `domain-modeler`.
