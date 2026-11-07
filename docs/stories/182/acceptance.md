# Critères d'acceptance de la story #182 : la voix de l'application en sons pré-fabriqués

Scénarios : `features/182-voix-de-l-application.feature` (nouveaux, 8 règles, 35 scénarios dont 1 Plan), plus les
scénarios existants de #7, #15, #19, #73, #79 et #97 listés plus bas (non-régression). Les questions « 182.1 » à
« 182.24 » renvoient à `docs/stories/182/domain-model.md` ; les questions « 182.25 » et suivantes sont posées ici.

## Objectif

En tant qu'**enfant**, je veux entendre mon personnage guide lire les consignes, les questions et ses paroles **sur
n'importe quel appareil, sans qu'un adulte installe quoi que ce soit**, afin de faire mes leçons même si je lis
encore mal.

Constat du PO (Honor Magic, Chrome, Android) : aucune voix française sur l'appareil, donc aucune lecture à voix
haute, et un message trompeur « La voix de Coach Léo est bloquée par ce navigateur ». La story ajoute la **voix de
l'application** (sons de phrases fabriqués à l'avance par le pipeline de contenu) devant la **voix de l'appareil**, et
distingue la **voix absente** de la **voix bloquée**.

## Règles (example mapping)

| # | Règle | Scénarios (`182`) | Questions | Réponse du PO (2026-11-07) |
|---|---|---|---|---|
| R1 | La voix de l'application lit en français toute phrase qui a son son de phrase, même sur un appareil sans voix française | « Sur un appareil sans voix française, la consigne est lue par la voix de l'application » · « … la question est lue … » · « … la félicitation du personnage guide est dite … » · « … Coach Léo lit la consigne … » · « Sur un navigateur qui ne sait pas lire à voix haute, la voix de l'application lit quand même » · « En remettant le son, le personnage guide se présente avec la voix de l'application » | 182.15 (navigateur sans synthèse), 182.22 (variante finie « Je suis Lumi ») | reco : se taire avec le message de voix absente (182.15) ; variantes finies fabriquées (182.22) |
| R2 | Une phrase sans son de phrase est lue par la voix de l'appareil, phrase par phrase, sans changer la voix des autres phrases ; le mot à écouter garde la voix anglaise | « Une question sans son de phrase est lue par la voix de l'appareil » · « Dans une même lecture, chaque phrase garde sa voix, dans l'ordre, jamais deux voix en même temps » · « Un son de phrase qui ne peut pas être joué laisse la voix de l'appareil lire la phrase, sans message » · « Le mot à écouter garde la voix anglaise de l'appareil » | 182.1, 182.20 | reco : 182.1 A (repli sur la voix de l'appareil) ; 182.20 oui (mot à écouter en voix anglaise de l'appareil) |
| R3 | Sans son de phrase et sans voix française sur l'appareil, la phrase n'est pas dite : l'enfant voit le message de voix absente et joue quand même | « Sans son de phrase ni voix française, la question n'est pas dite et le message de voix absente apparaît » · « Le message de voix absente nomme le personnage guide de l'univers » · « Sans son de phrase, une voix étrangère de l'appareil ne lit jamais une phrase en français » · « Le message de voix absente n'est jamais affiché deux fois » · « Quand une phrase suivante est entendue, le message de voix absente disparaît » · « Sans voix, l'enfant répond et réussit la question » · « Quand la félicitation de la dernière réponse n'est pas dite, elle attend que Léa continue » (tous) | 182.15, 182.16, 182.17, 182.25 | reco : se taire (182.15) ; texte et durée de vie du message proposés (182.16) ; parole non entendue (182.17) ; message de voix absente qui n'est pas un message d'erreur (182.25 A) |
| R4 | La voix bloquée ne désigne plus que le refus du navigateur de jouer, avec la voix de l'application comme avec la voix de l'appareil | « Quand le navigateur refuse de jouer la voix de l'application, l'enfant voit le message de voix bloquée » · « Quand le navigateur ne bloque plus la voix, Réécouter fait entendre la voix de l'application » | (glossaire : Voix bloquée, précisée par #182) | sans objet |
| R5 | Avec la voix de l'application, la lecture à voix haute garde ses règles : Muet, voix suspendue, une seule lecture à la fois, arrêt, lecture lente, effets sonores avant la parole, surlignage | « En Muet, une question qui a son son de phrase s'affiche sans être lue » · « Passer en Muet coupe la voix de l'application » · « Une nouvelle lecture coupe la voix de l'application en cours » · « Quitter la séance en cours coupe la voix de l'application » · Plan « Pendant la voix de l'application, <ce que fait Léa> arrête la voix » (entrée de l'espace parent, retour à l'accueil) · « L'effet sonore de la réponse juste passe avant la voix de l'application, jamais par-dessus » · « Écouter plus lentement fait entendre le son de phrase du mot dicté plus lentement » · « Pendant la voix de l'application, les mots de la consigne sont surlignés dans l'ordre » | 182.18, 182.23 | reco : surlignage approximatif (182.18 A, oui) ; lecture lente en ralentissant le son, hauteur gardée (182.23 oui) |
| R6 | La voix automatique lit avec la voix de l'application ; une voix imposée par le parent lit toutes les phrases à sa place | « Avec la voix automatique, la voix de l'application passe avant la voix de l'appareil » · « Une voix imposée par le parent lit la consigne, même quand elle a son son de phrase » · « Sur un appareil sans voix française, le parent n'est plus invité à installer une voix » · « Écouter la voix automatique fait entendre l'essai de voix avec la voix de l'application » | 182.14, 182.22, 182.26 | reco : 182.14 A ; 182.22 oui ; 182.26 proposition, libellé « voix de l'application » |
| R7 | La voix de l'application ne dit jamais le prénom de l'enfant ; le texte affiché le garde | « Le personnage guide salue l'enfant sans dire son prénom, qui reste affiché » | 182.2, 182.27 | reco : 182.2 A ; 182.27 A (seule la voix de l'application omet le prénom) |
| R8 | Une leçon lancée avec le réseau se lit jusqu'au bout sans réseau | « Sans réseau, la suite de la leçon lancée est lue par la voix de l'application » · « Sans réseau, une phrase dont le son de phrase n'est pas sur l'appareil est lue par la voix de l'appareil » · « Après une séance terminée avec le réseau, la leçon suivante du parcours se lit sans réseau » (tous `@pwa`) | 182.19 | reco : proposition de mise en réserve, et oui pour la prochaine leçon du parcours |

Note : avec 8 règles, la story dépasse le repère de 6 du skill BDD. Le PO garde les 8 règles dans la story (182.28 : non).

### Exemples retenus

- **Phrases avec un son de phrase** : consignes de la bibliothèque (« Range chaque mot dans la maison de son son. »),
  question (« Combien font 3 + 4 ? », dite « Combien font 3 plus 4 ? »), félicitations de Noisette, « Écoute bien. »,
  présentation au retour du son (« Je t'entends ! Je suis Lumi. »), essai de voix, mot dicté « chat ».
- **Phrases sans son de phrase** : calcul tiré au hasard, leçon personnelle (182.1), et dans les scénarios une
  question de test déclarée absente du répertoire des sons.
- **Message de voix absente** (texte proposé par 182.16) : « Noisette ne peut pas lire cette phrase sur cet appareil.
  Tu peux la lire avec un adulte. », avec le nom du personnage guide de l'univers (Coach Léo en Sports).
- **Message de voix bloquée** inchangé (#79) : « La voix de Noisette est bloquée par ce navigateur. Touche
  « Réécouter » pour réessayer, ou lis avec un adulte. » Il ne s'affiche plus que pour un refus du navigateur.
- **Prénom** : Noisette dit « Bonjour ! » avec la voix de l'application ; l'écran montre « Bonjour Léa ! » (182.2 A).

### Droits d'accès

Aucune donnée nouvelle côté serveur, aucune table, aucune policy RLS : pas de scénario `@acces` nouveau. Les règles
d'accès touchées restent couvertes par #15 (règle « Seul le parent change le choix de voix… », l. 189 de `features/15-choix-de-la-voix.feature`) et
#73 (voix suspendue sur les écrans du parent). Côté données d'enfants, R7 vérifie que la voix de l'application ne dit
jamais le prénom (aucun son fabriqué à partir d'une donnée d'enfant).

## Règles vérifiées hors E2E

Le pipeline de contenu ne se décrit pas en Gherkin. Ces règles sont vérifiées par **pytest** (`scripts/tests/`) et par
**`Deno.test`** (domaine `voix/domain/`), et font partie de la définition de « terminé » :

| Règle | Vérification |
|---|---|
| Chaque phrase de l'inventaire des phrases a son son de phrase dans le répertoire des sons (aucun manquant) | pytest |
| Aucun son de phrase orphelin (fichier sans phrase de l'inventaire), supprimé à la regénération (182.12) | pytest |
| Plafond de poids de `public/voix/` respecté, sinon le pipeline échoue (182.6, 182.7) | pytest |
| Fabrication incrémentale : une phrase dont la prononciation corrigée, la voix et les réglages n'ont pas changé garde son fichier (182.12) | pytest |
| Table de prononciation : chaque entrée a un exemple et sa prononciation corrigée attendue ; elle ne change ni le texte affiché, ni la clé de la phrase, ni le sens, et n'ajoute aucun mot (règle absolue de `CLAUDE.md`, 182.13) | pytest |
| Jamais édité à la main : empreintes cohérentes entre le répertoire des sons et les fichiers (182.5, 182.11) | pytest |
| Licence de la voix présente (`public/voix/LICENCE-tom.txt`), modèle de voix absent du dépôt et du build (182.9) | pytest, et `scripts/exploitation/secrets_du_build.py` à étendre si besoin |
| Clé de la phrase : même découpage et même normalisation que `texteALire`, calculés par le même code au pipeline et au front (182.10, 182.11) | `Deno.test` (vecteurs) + pytest sur l'inventaire produit |
| Inventaire des phrases : bibliothèque lue par `lireLecon` (consignes par défaut comprises), paroles fixes des personnages guides, variantes finies ; mot à écouter exclu ; aucun prénom (182.2, 182.20, 182.21, 182.22) | `Deno.test` / pytest |
| Plan de lecture : une source par phrase, dans l'ordre (son de phrase, sinon voix de l'appareil, sinon aucune) ; français seulement pour un son de phrase | `Deno.test` |
| Instants des mots : croissants, le premier à 0, tous avant la fin, divisés par le rythme (182.18) | `Deno.test` |
| `LectureAVoixHaute` : une seule lecture à la fois sur les deux lecteurs, Muet, voix suspendue, fin de lecture appelée une fois, `VoixBloquee` et `VoixAbsente` distinctes, `SonIllisible` jamais montrée | `Deno.test` (fakes en mémoire) |
| Lecture lente d'un son de phrase sans changer sa hauteur (182.23) | `Deno.test` (rythme transmis) + écoute du PO |

**Vérifications manuelles** (définition de « terminé ») :
- sur le Honor Magic (Chrome, Android, aucune voix française installée) : les leçons sont lues, sans rien installer ;
- déverrouillage du son au premier toucher sur téléphone (182.24) : aucun scénario E2E, le navigateur de test ne
  reproduit pas la règle d'activation d'Android ; vérifié sur le Honor Magic (premier toucher → la consigne suivante
  est entendue) ;
- écoute de contrôle par le PO (182.8) : prononciation, débit (182.6), lecture lente (182.23).

## Non-régression : scénarios existants

Les scénarios de #7, #15, #19, #73, #79 et #97 qui disent « Léa entend Noisette lire … », « Léa n'entend rien »,
« Léa n'entend plus Noisette », « Léa voit un seul message de voix bloquée » restent vrais **sans changer un mot** :
leur texte ne dit pas quelle voix lit. Points d'attention :

1. **#15, Plan « Le parent est prévenu quand <situation> »** (l. 55, exemple « l'appareil n'a aucune voix
   française ») : contredit par le scénario R6 « … le parent n'est plus invité à installer une voix » (182.14 A et
   182.26 retenus) : cet exemple est retiré (182.26). « Le parent trouve des conseils pour installer des voix plus
   naturelles » (l. 67) reste, les conseils étant présentés comme facultatifs (182.26).
2. **#15, « Sans voix imposée, la voix automatique est choisie et le parent sait laquelle elle utilise »** (l. 22) :
   la mention « actuellement : Denise (Natural) » devient « actuellement : voix de l'application » quand la voix de
   l'application est utilisée (182.14 A, 182.26 retenus).
3. **#7 « Sur un navigateur qui ne sait pas lire à voix haute, l'enfant joue quand même »** et les Plans de #79 avec
   « le navigateur ne sait pas lire à voix haute » : la question de test n'a pas de son de phrase ; elle donnerait
   désormais le message de voix absente (182.15). L'étape « aucun message d'erreur n'apparaît » refuse tout
   `role="alert"` (`univers.steps.ts`). 182.25 A retenu : le message de voix absente n'est pas un message d'erreur,
   ces scénarios restent vrais sans changer un mot, et l'étape doit ne pas le compter.
4. **Salutations avec le prénom** (#29 l. 41, #11 l. 148, #73 l. 118 « Léa entend Noisette dire « Bonjour Léa ! » »,
   et les « Bravo Léa ! … » de #100, #106, #137) : avec 182.2 A, la voix de l'application dit « Bonjour ! ». Les
   étapes qui vérifient la parole entendue (pas seulement le texte affiché) doivent rester vraies, voir la note 1 des
   étapes ci-dessous et 182.27 (A retenu : la voix de l'appareil dit toujours le prénom).
5. **#79, « Le message de voix bloquée … »** : inchangés (la voix bloquée garde son message et sa durée de vie).

## Étapes Gherkin (pour l'e2e-tester)

Comportements observables par les faux du navigateur de test (faux `speechSynthesis`, faux lecture audio
`HTMLMediaElement.play/pause`), sans détail technique dans le texte :

1. **Répertoire des sons par défaut en E2E.** Les scénarios existants ne déclarent aucun son de phrase. Proposition :
   le navigateur de test sert un **répertoire des sons de test vide** par défaut (tout se replie sur la voix de
   l'appareil, les scénarios existants ne changent pas), et les étapes « la phrase « … » a un son de phrase »,
   « les félicitations de Noisette ont leur son de phrase », « les phrases de la leçon « … » ont leur son de phrase »,
   « le mot dicté « … » a un son de phrase » y ajoutent des entrées. Les scénarios `@pwa` utilisent le vrai
   répertoire de la build de production.
2. **Étapes nouvelles (Étant donné)** : « la phrase « … » a un son de phrase » · « la phrase « … » n'a pas de son de
   phrase » · « la phrase « A » a un son de phrase, mais pas la phrase « B » » · « la phrase « A » n'a pas de son de
   phrase, mais la phrase « B » en a un » · « aucune phrase de la séance n'a de son de phrase » · « le son de phrase de
   « … » ne peut pas être joué » (fichier introuvable) · « l'appareil n'a qu'une voix anglaise » · « Léa a déjà vu le
   message de voix absente » · hors ligne : « Léa a commencé avec le réseau la séance complète de la leçon « … » »,
   « Léa n'a jamais joué la leçon « … » sur la tablette », « Léa a terminé avec le réseau la séance de la leçon « … » ».
3. **Étapes nouvelles (Quand)** : « Léa en arrive à la question « … » » · « Léa commence la séance de la leçon suivante
   de son parcours ».
4. **Étapes nouvelles (Alors)** : « … lire|dire « … » avec la voix de l'application » (un son de phrase joué, aucune
   parole de la synthèse pour cette phrase) · « … avec la voix « <nom> » » pour une phrase précise · « … avec la voix de
   l'appareil » · « Léa entend Noisette lire « A » avec la voix de l'application, puis « B » avec la voix « … » » ·
   « Léa entend l'effet sonore « … » avant que Noisette dise une félicitation avec la voix de l'application » · « Léa
   entend de nouveau Noisette dire « chat », plus lentement, avec la voix de l'application » (rythme lent, hauteur
   gardée) · « chaque mot de la consigne est surligné à son tour, dans l'ordre, pendant que Noisette lit avec la voix
   de l'application » (vérifiable : chaque mot surligné au moins une fois, dans l'ordre, jamais un mot hors de la
   phrase en cours ; pas de vérification du moment exact, 182.18) · « Léa voit un seul message de voix absente » ·
   « Léa ne voit plus le message de voix absente » · « Léa ne voit pas le message de voix absente / de voix bloquée » ·
   « Léa ne voit ni le message de voix absente ni le message de voix bloquée » · « Léa voit que Noisette dit « … » »
   (texte affiché seulement) · « Paul entend Noisette dire « … » avec la voix de l'application ».
5. **Étapes existantes réutilisées** : `voix.steps.ts` (Muet, voix bloquée, navigateur sans synthèse, « Noisette est
   en train de lire la consigne », « Léa n'entend plus Noisette », « Léa n'entend jamais deux lectures en même
   temps »…), `choix-de-voix.steps.ts` (voix de l'appareil, voix imposée, choix de voix, essai de voix),
   `retours-animes-et-sonores.steps.ts` (effets sonores, « Léa n'entend jamais un effet sonore et Noisette en même
   temps »), `consigne-visible.steps.ts`, `etapes-puis-exercices.steps.ts`, `dictee-et-conjugaison.steps.ts`,
   `pwa.steps.ts`. Les étapes « Léa entend Noisette lire « … » » sans précision doivent accepter les deux voix.

## Périmètre E2E à rejouer avant la PR

`npx bddgen --tags "@socle or @issue-7 or @issue-15 or @issue-19 or @issue-58 or @issue-73 or @issue-79 or @issue-97 or @issue-182"`
(à ajuster aux stories livrées, voir `CLAUDE.md`), puis le projet `telephone` ; les scénarios `@pwa @issue-182` avec
`playwright.pwa.config.ts`. La définition de « terminé » demande aussi `tablette` pour `@issue-182`.

## Hors périmètre

- Assemblage de morceaux enregistrés pour les calculs tirés au hasard et les nombres (182.1 B, story de suite).
- Caractère propre à chaque personnage guide sur la voix de l'application (vitesse, hauteur) et voix féminine
  (182.3, 182.4, stories de suite).
- Voix anglaise fabriquée pour le mot à écouter (182.20).
- Surlignage exact (instants des mots fournis par l'outil de fabrication, 182.18 B).
- Leçons personnelles lues par la voix de l'application (texte saisi par le parent : repli, 182.1).
- Menus du haut et du bas trop hauts sur téléphone (issue à part).

## Questions ouvertes

Aucune. Toutes les questions 182.1 à 182.28 ont été tranchées le 2026-11-07 (voir « Décisions »).

## Questions traitées

Questions du modèle, toutes tranchées le 2026-11-07 : reco (les scénarios qui en dépendaient ne sont plus `@a-valider`) : **182.1** (R2), **182.2** (R7),
**182.14** (R6), **182.15** (R1, R3), **182.16** (R3 : texte et durée de vie du message), **182.17** (R3, félicitation
non dite), **182.18** (R5, surlignage), **182.19** (R8), **182.20** (R2, mot à écouter), **182.22** (R1 et R6 :
présentation et essai de voix fabriqués pour chaque personnage guide), **182.23** (R5, lecture lente). **182.24** :
vérification manuelle seulement, aucun scénario.

Questions posées ici :

**182.25 Message de voix absente et « aucun message d'erreur ».** Sur un navigateur qui ne sait pas lire à voix
haute, une phrase sans son de phrase donne le message de voix absente (182.15). Les scénarios existants de #7 et #79
(« … l'enfant joue quand même », « aucun message d'erreur n'apparaît ») deviennent-ils faux ?
A. Le message de voix absente n'est pas un message d'erreur : il est annoncé aux lecteurs d'écran comme une
information, et les scénarios de #7 et #79 restent vrais sans changer un mot. B. Il compte comme un message
d'erreur : on réécrit ces scénarios pour qu'ils attendent le message de voix absente.
**Recommandation : A**, cohérent avec « un retour d'erreur n'est jamais punitif » ; l'e2e-tester vérifie que
l'étape « aucun message d'erreur n'apparaît » ne le compte pas (aujourd'hui elle refuse tout `role="alert"`).
**Tranchée le 2026-11-07 : reco (A).** Le message de voix absente n'est pas un message d'erreur ; il est annoncé aux lecteurs d'écran comme une information ; les scénarios de #7 et #79 restent vrais sans changer un mot, et l'étape « aucun message d'erreur n'apparaît » ne le compte pas.

**182.26 Écran Voix de l'Espace parent avec la voix de l'application** (prolonge 182.14).
Que voit le parent ? Proposition : « Automatique (recommandé) » porte la mention « actuellement : voix de
l'application » ; le message « Aucune voix française trouvée sur cet appareil : installe-en une (voir ci-dessous),
puis recharge la page. » ne s'affiche plus ; les voix françaises de l'appareil restent proposées comme voix
imposées ; les conseils pour installer des voix plus naturelles restent, présentés comme facultatifs. L'exemple
« l'appareil n'a aucune voix française » du Plan de #15 (l. 55) est retiré.
**Recommandation : cette proposition.** Variante à trancher pour le libellé : « voix de l'application » (terme du
glossaire) ou « voix de Savanturier ».
**Tranchée le 2026-11-07 : reco (la proposition), libellé « voix de l'application ».** « Automatique (recommandé) » porte la mention « actuellement : voix de l'application » ; le message « Aucune voix française trouvée sur cet appareil… » ne s'affiche plus ; les voix françaises de l'appareil restent proposées comme voix imposées ; les conseils d'installation restent, présentés comme facultatifs ; l'exemple « l'appareil n'a aucune voix française » du Plan de #15 (l. 55) est retiré.

**182.27 Prénom et voix de l'appareil** (prolonge 182.2).
Avec 182.2 A, la voix de l'application dit « Bonjour ! ». Quand c'est la voix de l'appareil qui lit (voix imposée par
le parent, ou phrase sans son de phrase), dit-elle le prénom comme aujourd'hui ? A. Oui : seule la voix de
l'application omet le prénom. B. Non : aucune voix ne dit plus le prénom.
**Recommandation : A.** Rien n'est stocké, comme aujourd'hui, et les scénarios de #73, #29, #11 avec voix imposée ou
sans son de phrase ne changent pas.
**Tranchée le 2026-11-07 : reco (A).** Seule la voix de l'application omet le prénom ; la voix de l'appareil (voix imposée, phrase sans son de phrase) dit le prénom comme aujourd'hui.

**182.28 Taille de la story.** 8 règles (repère du skill BDD : 6). Faut-il sortir la règle R8 (hors ligne) dans une
story de suite ? (oui / non)
**Recommandation : non**, l'issue la demande (« Attendu » n°3) et ses scénarios sont `@pwa`, isolés des exécutions
courantes ; à revoir si la mise en réserve des sons (182.19) se révèle longue à livrer.
**Tranchée le 2026-11-07 : reco (non).** La règle R8 (hors ligne) reste dans la story.

## Décisions

Le 2026-11-07, à la question « Répondez « reco tout » ou corrigez par numéro », le PO a répondu, mot pour mot :
« Ok ». **Toutes les recommandations des questions 182.1 à 182.28 sont retenues** (182.1 à 182.24 dans
`docs/stories/182/domain-model.md`, 182.25 à 182.28 ci-dessus). Pour 182.26, le libellé retenu est « voix de
l'application ».

| Question | Réponse retenue | Effet sur les scénarios |
|---|---|---|
| 182.1 | A : les textes fabriqués à la volée passent par la voix de l'appareil, sinon voix absente | R2, R3 : `@a-valider` retiré |
| 182.2 | A : la voix de l'application ne dit jamais le prénom, le texte affiché le garde | R7 : `@a-valider` retiré |
| 182.3, 182.4 | une seule voix pour tous les personnages guides dans cette story | aucun scénario |
| 182.5 à 182.13 | recommandations du modèle (pipeline, stockage, débit, budget, licence, clé, prononciation) | vérifiées hors E2E |
| 182.14 | A : la voix de l'application est le choix automatique de l'écran Voix | R6 : `@a-valider` retiré |
| 182.15 | se taire, avec le message de voix absente | R1, R3 : `@a-valider` retiré |
| 182.16 | texte « <Nom du personnage guide> ne peut pas lire cette phrase sur cet appareil. Tu peux la lire avec un adulte. », durée de vie du message de voix bloquée | R3 : `@a-valider` retiré |
| 182.17 | non : une parole dont une phrase n'a pas été dite n'est pas entendue | R3 : `@a-valider` retiré |
| 182.18 | A : surlignage approximatif, « à peu près celui qui est prononcé » | R5 : `@a-valider` retiré |
| 182.19 | la proposition de mise en réserve, et la prochaine leçon du parcours | R8 : `@a-valider` retiré (`@pwa` gardé) |
| 182.20 | oui : le mot à écouter garde la voix anglaise de l'appareil | R2 : `@a-valider` retiré |
| 182.21 | oui : textes fixes de `src/` déplacés dans le domaine | aucun scénario |
| 182.22 | oui : variantes finies fabriquées, jamais le prénom ni les nombres tirés au hasard | R1, R6 : `@a-valider` retiré |
| 182.23 | oui : lecture lente en ralentissant le son, hauteur gardée | R5 : `@a-valider` retiré |
| 182.24 | oui : déverrouillage du son au premier toucher corrigé | vérification manuelle |
| 182.25 | A : le message de voix absente n'est pas un message d'erreur | #7 et #79 inchangés |
| 182.26 | la proposition, libellé « voix de l'application » | R6 ; exemple du Plan de #15 (l. 55) à retirer |
| 182.27 | A : seule la voix de l'application omet le prénom | #11, #29, #73 inchangés |
| 182.28 | non : R8 reste dans la story | aucun |
