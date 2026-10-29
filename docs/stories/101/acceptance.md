# Critères d'acceptance : issue #101, Quête du jour

Scénarios : `features/101-quete-du-jour.feature` (`@issue-101 @wip`).
Modèle : `docs/stories/101/domain-model.md` (questions #101.1 à #101.15).
État : **validé par le PO le 2026-10-29** (« 101 reco ») : toutes les recommandations des questions #101.1 à #101.22
sont retenues (section « Réponses du PO (2026-10-29) »). Plus aucun scénario n'est `@a-valider` ; le commentaire
au-dessus d'un scénario nomme la réponse ou le critère de l'issue qu'il illustre.

## Objectif

En tant qu'**enfant**, je veux qu'en arrivant sur mon **accueil**, mon **personnage guide** me propose une seule
**quête du jour**, afin de savoir quoi faire sans chercher, et d'être fêté quand elle est **accomplie**.

Besoins nourris (skill `gamification`, section 1) :
- **autonomie** : une seule proposition claire, que l'enfant accepte ou écarte par « Autre chose », sans rien perdre ;
- **compétence** : la révision passe d'abord (pratique espacée, `spaced-practice-scheduler`), et la fête vient au
  moment de l'effort, à la fin de la séance qui accomplit la quête ;
- **lien** : c'est le personnage guide qui propose et qui fête.

Déclencheurs métier : la **séance terminée** (#24) et la **séance de révision terminée** (#28) du jour. Rien n'est
enregistré : la quête et son état se calculent à partir de la leçon du jour, du nombre de questions dues et des
faits du jour. Garde-fous respectés : aucune perte, aucun message sur un jour passé, aucune notification, aucun
compte à rebours, aucune étoile ni récompense de plus, rien d'aléatoire.

## Règles et scénarios

| Règle | Scénarios | Réponses |
|---|---|---|
| **R1.** La quête du jour propose la séance de révision s'il y a au moins une question due, sinon la leçon du jour ; quand il n'y a rien à proposer, il n'y a pas de quête | Avec 1 ou 3 questions dues, Noisette propose la séance de révision (plan) · Sans question due, Noisette propose la leçon du jour · Après une séance de français, la quête propose la leçon du jour en maths · Tout le parcours réussi et des questions dues : révision · **Tout le parcours réussi et aucune question due : pas de quête, l'accueil félicite** · Sans leçon pour sa classe : pas de quête, sans félicitation · Le test de départ n'est jamais proposé · Sans bibliothèque ou sans file de révision lue : pas de quête, sans message d'erreur (plan) | #101.1, #101.6, #101.10 |
| **R2.** Le personnage guide propose la quête à l'accueil ; l'enfant l'accepte, ou choisit « Autre chose » sans rien perdre | « Oui, on y va ! » commence la séance de révision · « Oui, on y va ! » ouvre la page de la leçon · Après « Autre chose », réponse douce et tout reste ouvert · Après « Autre chose », plus de quête en revenant sur l'accueil · À la prochaine ouverture, la quête revient sans reproche · Dans l'univers Sports, Coach Léo propose | #101.6, #101.9, #101.15 |
| **R3.** La quête est accomplie par une séance du même genre terminée aujourd'hui ; fête une seule fois, à la fin de cette séance ; une seule quête par jour | Fête à la fin de la séance de révision · Fête à la fin de la séance de la leçon proposée · Séance de révision avec des erreurs : accomplie quand même · Une autre leçon de la classe ou une leçon des classes d'avant accomplit la quête (plan) · La séance qui finit le parcours accomplit la quête · Une séance de leçon n'accomplit pas une quête de révision · Après « Autre chose », la séance de révision faite plus tard accomplit quand même la quête · Ni le test de départ ni une séance quittée (plan) · Accomplie : l'accueil le dit calmement, pas d'autre quête · Une séance de plus ne fête pas de nouveau · Épisode puis quête accomplie, dans cet ordre · Sans réseau, accomplie tout de suite | #101.2, #101.8, #101.11, #101.12, #101.17, #101.21 |
| **R4.** Jamais punitive : une quête non faite disparaît le lendemain sans message ; la quête accomplie ne change aucune récompense existante | **Revenue le lendemain ou 3 jours plus tard, aucune quête passée n'est évoquée** (plan) · Le lendemain d'une quête accomplie, nouvelle quête · Aucune étoile, aucun objet de la cabane, aucune tenue de plus · L'objectif du jour ne change pas | #101.2, #101.3, #101.5, #101.8 |
| **R5.** Voix haute, clavier, petit écran, mouvements réduits | Lue après la salutation · Acceptée au clavier · 360 px et boutons de 44 px · Mouvements réduits : la fête apparaît sans mouvement et garde son texte | #101.11, #101.15, #101.16 |
| **R6.** (`@acces`) La quête d'un enfant ne tient compte que de ses séances et questions dues, et ne se montre ni dans l'Espace parent ni à un autre enfant | Les séances de Tom n'accomplissent pas la quête de Léa · Les questions dues de Tom ne deviennent pas la quête de Léa · Sur le téléphone de Marie, la quête accomplie se retrouve · L'Espace parent ne montre pas la quête | #101.4, #101.8 |

Total : 6 règles, 38 scénarios (dont 5 plans du scénario), soit 43 cas générés ; aucun n'est `@a-valider`. Un parent non rattaché ne lit déjà ni
les séances terminées ni la file de révision de Léa (#29, #28) : la quête ne lit rien d'autre, aucun scénario de plus.

Les critères de l'issue sont tous couverts : questions dues → révision (R1), sans question due → leçon du jour (R1),
après la séance de la quête → accomplie (R3), lendemain d'un jour sans séance → aucun message (R4), parcours fini sans
question due → pas de quête et félicitation (R1). S'y ajoutent le refus « Autre chose » (R2), les mouvements réduits
(R5), les récompenses inchangées (R4) et les 360 px (R5).

## Exemples clés (example mapping)

- Léa (CE1) a 3 questions dues. Noisette : « Ta quête du jour : réviser 3 petites erreurs des jours passés. On y va ? ».
  Léa choisit « Autre chose » : « D'accord, choisis ce qui te fait envie ! ». La tuile « À revoir » et la leçon du jour
  « Le son in » restent proposées.
- Léa n'a aucune question due. Noisette : « Ta quête du jour : la leçon « Le son in ». On y va ? ». Léa préfère jouer
  « Les nombres jusqu'à 100 » : la quête est accomplie, fêtée à la fin de cette séance (#101.12 a).
- Léa a fini tout son parcours, rien n'est dû : pas de quête ; l'accueil dit « Bravo ! », « Tu as fini ton parcours ».
- Léa n'a pas joué hier : aujourd'hui, rien ne parle d'hier ; la quête du jour est simplement proposée.
- Léa accomplit sa quête de révision : à la fin, « Quête du jour accomplie ! Bravo Léa ! ». Sur l'accueil :
  « Ta quête du jour est accomplie. », sans nouvelle fête et sans autre quête. Elle gagne les mêmes étoiles que sans quête.

## Hors périmètre

- Le choix de la leçon du jour (29.1), la file de révision (#28), l'objectif du jour (#29), la série (#30), les
  épisodes (#33), la cabane (#32), les tenues (#102), les badges (#31) : inchangés.
- Toute notification ou rappel hors de l'application (aucun, par principe).
- Un historique des quêtes, un compteur de quêtes, une récompense propre à la quête (réponses 101.3 a et 101.4 a).
- Les quêtes dans l'Espace parent (réponse 101.4 a).
- Un effet sonore propre à la fête de la quête (réponse 101.18 a).
- Les devoirs (lot 6) : leur place dans la quête sera revue avec leur story (réponse 101.10 a).
- Un dessin pour la quête (parchemin, boussole…) : seulement si le PO le demande, par le skill `illustration`.

## Réponses du PO (2026-10-29)

Réponse du PO, mot pour mot : « 101 reco » (annonce du responsable sur #64). Toutes les recommandations des questions
#101.1 à #101.22 sont retenues ; les tags `@a-valider` sont retirés et les paroles proposées deviennent définitives.

| Question | Réponse retenue | Effet sur les scénarios |
|---|---|---|
| #101.1 Choix de la quête | **(a)** : révision d'abord s'il y a au moins une question due, sinon la leçon du jour telle quelle (29.1) | inchangés (R1) |
| #101.2 Une quête par jour | **(a)** : une seule ; accomplie jusqu'au lendemain | inchangés (R3, R4) |
| #101.3 Récompense | **(a)** : rien de plus que la fête | inchangé (R4) |
| #101.4 Parent | **(a)** : le parent ne voit pas les quêtes | inchangé (R6) |
| #101.5 Série, épisodes, objectif du jour | **(a)** : la quête s'ajoute sans rien remplacer, sans compteur | inchangé (R4) |
| #101.6 Nature du concept | **(B)** : calculée, sans règle de choix propre, jamais enregistrée | inchangés |
| #101.7 Nom | **(a)** : Quête du jour et Quête accomplie, termes validés du glossaire | aucun |
| #101.8 Quête accomplie plus tard dans la journée | **(A)** : calculée à partir des faits du jour | inchangés (R3, R4, R6) |
| #101.9 Refus | **(a)** : « Autre chose », réponse douce, pas reproposée pendant l'utilisation, revient à la prochaine ouverture | inchangés (R2) |
| #101.10 Ce que la quête ne propose jamais | **(a)** : ni test de départ, ni leçon personnelle, ni autre classe ; rien sans leçon pour la classe | inchangés (R1) |
| #101.11 Lieu de la fête | **(a)** : fin de la séance qui accomplit, après les annonces existantes ; accueil calme | inchangés (R3, R5) |
| #101.12 Séance qui accomplit | **(a)** : toute séance du même genre terminée aujourd'hui | inchangés (R3) |
| #101.13 Contexte | **(a)** : Motivation | aucun |
| #101.14 Histoire des Savanturiers | **(a)** : aucun lien | aucun |
| #101.15 Place sur l'accueil | **(a)** : bulle du personnage guide, tuiles inchangées en dessous | inchangés (R2, R5) |
| #101.16 Lecture à voix haute de la proposition | **(a)** : dans la même lecture, après la salutation et la pastille de série | inchangé (R5) |
| #101.17 Accueil après la quête accomplie | **(a)** : « Ta quête du jour est accomplie. », sans boutons, sans son, sans confettis | inchangés (R3) |
| #101.18 Effet sonore de la fête | **(a)** : aucun de plus ; parole, humeur `applaudit`, confettis | aucun |
| #101.19 Fête lue à voix haute | **(a)** : oui, une fois, après la phrase de fin du personnage guide | aucun |
| #101.20 Parole après une révision toute fausse | **(a)** : la même fête, « Quête du jour accomplie ! Bravo Léa ! » | inchangé (R3) |
| #101.21 Fête après « Autre chose » | **(a)** : oui, la séance du même genre faite plus tard accomplit la quête | **ajouté** (R3) |
| #101.22 « Fête » | **(a)** : mot courant, pas de terme nouveau | aucun |

## Questions ouvertes

Aucune.

## Décisions

Les questions #101.1 à #101.22 sont tranchées (section « Réponses du PO (2026-10-29) »). Rappel des questions posées
par ce document (#101.16 à #101.22) et de leur recommandation, toutes retenues :

**#101.16. La quête est-elle lue avec la salutation ?** Avec « tout lire à voix haute », le personnage guide dit déjà
« Bonjour Léa ! » et la pastille de série en une seule lecture (#30).
- (a) La proposition est lue dans la même lecture, après la salutation et la pastille de série.
- (b) Elle n'est lue que si l'enfant touche la bulle (lecture à la demande).

**Recommandation : (a).** Un enfant qui ne lit pas encore doit entendre la quête pour la comprendre. Une seule lecture
évite deux voix qui se suivent.

**#101.17. Que dit l'accueil quand la quête est accomplie ?**
- (a) Dans la bulle du personnage guide : « Ta quête du jour est accomplie. », sans boutons, sans effet sonore, sans
  confettis.
- (b) Rien : la proposition disparaît simplement.

**Recommandation : (a).** L'enfant garde le sentiment d'avoir fini, calmement (fête une seule fois, #101.11). (b)
laisserait croire que la quête a disparu.

**#101.18. Quel effet sonore pour la fête ?** Le skill impose un effet sonore existant (#97 : pas de son nouveau sans
choix du PO), et la fin de la séance en joue déjà un (« séance terminée » ou « grande victoire », parfois
« découverte » pour une tenue ou un objet de la cabane).
- (a) Aucun effet sonore de plus : la fête est une parole du personnage guide, son humeur `applaudit` et des confettis.
- (b) L'effet sonore « découverte », une seule fois même si une tenue ou un objet de la cabane est aussi reçu.

**Recommandation : (a).** Moins de sons empilés à la fin de la séance ; la fête reste visible et lue.

**#101.19. Avec « tout lire à voix haute », la fête est-elle lue ?**
- (a) Oui, une fois, après la phrase de fin du personnage guide (comme l'annonce d'une tenue reçue).
- (b) Non, elle reste écrite.

**Recommandation : (a)**, pour les enfants qui ne lisent pas encore.

**#101.20. Quelle parole après une séance de révision toute fausse ?** La fin de la séance de révision dit alors
« Merci Léa ! Ces erreurs reviendront demain… » (#28).
- (a) La même fête : « Quête du jour accomplie ! Bravo Léa ! » (l'effort est fêté, jamais le résultat).
- (b) Une parole adaptée : « Quête du jour accomplie ! Merci Léa ! ».

**Recommandation : (a)**, plus simple et jamais punitive ; (b) si le PO trouve que « Bravo » sonne faux juste après
« Merci ».

**#101.21. Après « Autre chose », la quête peut-elle encore être fêtée ?** Exemple : Léa écarte la révision, joue une
leçon, puis plus tard fait quand même la séance de révision.
- (a) Oui : la quête reste la même, non proposée, et sa fête vient à la fin de la séance qui l'accomplit (exemple du
  modèle).
- (b) Non : une quête écartée n'est plus fêtée ce jour-là (il faudrait garder le refus, #101.9 c).

**Recommandation : (a).** Écarter ne coûte rien ; rien n'est enregistré. Retenue : scénario « Après « Autre chose », la
séance de révision faite plus tard dans la journée accomplit quand même la quête du jour » (R3).

**#101.22. « Fête » : mot courant ou terme du glossaire ?** La définition de « Quête accomplie » dit « le personnage
guide la fête ». « Félicitation » est un terme (phrase qui salue une bonne réponse).
- (a) Mot courant, comme dans la définition : pas de terme nouveau.
- (b) Terme « Fête de la quête » au glossaire.

**Recommandation : (a)**, la fête est un retour animé ordinaire (skill `gamification`, section 2), pas un concept
métier.

## Corrections de données après E2E, intention inchangée

Les steps E2E (commit 5813fee) ont montré deux données de départ incohérentes avec une règle validée, et une étape
qui ne visait pas le bon appareil. Seules la donnée de départ et la formulation d'étape changent ; les règles, les
réponses du PO et l'intention des scénarios restent les mêmes.

| Scénario | Avant | Après | Pourquoi |
|---|---|---|---|
| Après une séance de français, la quête du jour propose la leçon du jour en maths (R1) | Léa a terminé hier une séance de « Le son in » avec 1 étoile | … avec 3 étoiles | Une séance à 1 étoile a des erreurs, retenues (#28) et dues le lendemain : la révision passe d'abord (#101.1) et la leçon n'est pas proposée. Sans erreur, seule l'alternance des matières (#29.1) joue. |
| Le lendemain d'une quête accomplie, une nouvelle quête du jour est proposée (R4) | Léa a terminé une séance de « Le son in » avec 1 étoile | … avec 3 étoiles | Même raison : le lendemain, les erreurs de la veille seraient dues et la quête serait la séance de révision. |
| Sur le téléphone du second parent rattaché, Léa retrouve sa quête du jour accomplie (R6) | Alors l'accueil de Léa affiche « Ta quête du jour est accomplie. » | … sur le téléphone de Marie | L'étape lisait l'accueil de la tablette de Paul : elle ne prouvait pas que la quête accomplie se retrouve sur l'autre appareil. |
