# Journal : story #126, exercices comme des jeux (98b) : bulles de choix

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64), à la demande du PO (« Graphe 126 »).
Branche : `feature/126-bulles-de-choix`, partie de `main` (`f8a4787`). Branche de base : `main`.
Dépendances mergées : #97 et #98 (98a). Le PO lance #126 avant #130 (petit train). Story voisine en parallèle : #106 (célébration de l'univers).
Numéro de décision : prochain libre 0040, si besoin. Commentaire `Avancement` : 6588520873.

## 2026-11-02

- 21:20 UTC : démarrage. Lu : issue #126 et le découpage révisé du responsable (6481220011), #64 (annonces jusqu'à 6588499848), `docs/stories/98/domain-model.md`, `journal.md` de #98.
- 21:22 UTC : étape 1, délégation à `domain-modeler` : la story n'ajoute aucun concept du domaine, mais elle introduit des dessins par univers (bulle de l'univers) dont les objets doivent être nommés par le PO, et des mots d'interface (ballon, bulle de savon). Modèle court, centré sur la tranche.
- 21:45 UTC : `domain-modeler` rend `domain-model.md` (`36150f1`) : aucun changement du domaine. 6 règles. Bulle de l'univers pour les 10 types (98.4), flottement pour `bulles` et `ecoute`. Objets proposés par univers. Écart repéré : la question d'un `classer` en révision et au test de départ a le type `bulles`. Questions #126.1 à #126.10.
- 21:46 UTC : étape 2, délégation à `po-acceptance`.
- 22:10 UTC : `po-acceptance` rend `acceptance.md` et `features/126-bulles-de-choix.feature` (`43496ec`) : 6 règles, 26 scénarios (14 plans, 62 cas), 6 `@a-valider`. Nouvelle question #126.11. Aucune séance complète : `delais.steps.ts` inchangé. Contenu relu contre la règle absolue : rien à signaler.
- 22:12 UTC : CADRAGE PRÊT publié sur #126. Attente de la validation du PO (annonce `[Responsable]`). Pendant l'attente : planches de la bulle de l'univers (⛔ intermédiaire, reco de #126.1), sans code de production.
- 22:25 UTC : planches de la bulle de l'univers rendues par `implementer` en rôle d'illustrateur (`b637063`), selon la reco de 126.1. Une seule correction entre les passes : l'anneau du focus et l'opacité de « s'efface ». Relue par l'orchestrateur contre la règle absolue : rien à signaler. `PLANCHES PRÊTES` publié sur #126 (⛔ intermédiaire).
- 21:38 UTC (horloge du responsable) : ⛔ validation n°1 levée (annonce [Responsable] 6589102464 sur #64, PO : « 126 reco tout »). #126 passe en `graphe:dev`. Les planches attendent encore la validation univers par univers. À SAVOIR du responsable (6588890640) : #127.2 écarte l'étoile d'insigne pour la retenue ; la reco de 126.1 (Police, étoile bleue fixe) est retenue par « reco tout », la planche reste soumise au PO.
- Liste des comportements unitaires : **aucun**, comme pour #98. Le domaine ne change pas : flottement, bulle juste qui s'efface, mot qui rejoint son trou et dessin de l'univers se lisent dans les faits existants (`ecartes()`, `bonneReponseMontree`, `ResultatDeReponse`, trou en cours, type de la question) et la clé d'univers. Le RED passe par les étapes E2E de `@issue-126`. Une règle qui apparaîtrait dans React pendant le câblage repasse par un cycle TDD dans le domaine.
- Délégations en parallèle : `po-acceptance` reporte les réponses et retire les `@a-valider` ; `e2e-tester` écrit les étapes de `@issue-126` (RED).
- 21:39 UTC : commentaires [Responsable] sur #126 : 6589099383 (lecture de « 126 reco tout » : recos 126.1 à 126.11, décor gardé sous le halo, ce qu'il appelle #126.12 ; périmètre élargi aux 4 types par choix validé) et 6589115744 (planches : « bulles OK », les 6 univers validés tels quels, 98.31 remplie). La validation des planches n'est pas encore sur #64 : à confirmer avant la PR. Elle ne bloque pas le code.
- 21:50 UTC : `po-acceptance` reporte les réponses (`4427434`) : `@a-valider` retirés, 26 scénarios (62 cas), aucune question ouverte.
- ~22:00 UTC : **redémarrage du conteneur** pendant le travail d'`e2e-tester`. Son travail partiel (`features/steps/bulles-de-choix.steps.ts`, 684 lignes, et l'ouverture à `@issue-126` de 4 étapes et du `Before` de #98) est retrouvé sur disque, commité et poussé (`6feff1e`). Nouvelle délégation à `e2e-tester` pour terminer, avec consigne de commiter et pousser tôt.
- 22:35 UTC : `e2e-tester` (reprise) rend le RED : aucune étape à ajouter (le travail de `6feff1e` était complet). Sur `telephone`, 11 verts (comportement existant) et 51 rouges, tous pour une fonctionnalité absente (`data-univers`, `data-flotte`, `flottement`, `dessin-de-la-bulle`, `mot-qui-voyage`, `trou-rempli`/`data-eclat`, bulle qui s'efface sur place, `signal-brille`, largeur commune, flèches), sauf un. Ce dernier, l'exemple « la consigne relue » en « Quel son entends-tu ? », ne peut pas se jouer : l'exercice n'a pas de consigne affichée, donc pas de bouton « Relire la consigne ». Chromium 1243 (liens symboliques du scratchpad).
- 22:37 UTC : `po-acceptance` corrige l'exemple seulement (relecture de la question, étape existante) ; la règle 126.4 ne change pas. À signaler dans la PR. En parallèle, `implementer` commence le câblage selon le contrat d'attributs.
- 22:45 UTC : exemple corrigé par `po-acceptance` (`f64796a`, la question relue avec « Réécouter », règle 126.4 inchangée) ; étape adaptée par `e2e-tester` (`3b51321`) : le plan est rouge au bon endroit (attente de `data-flotte`).
- ~23:20 UTC : **second redémarrage du conteneur** pendant le câblage. Déjà poussés : `2097e6b` (la voix dit si une lecture est en cours) et `a57aae4` (bulles de l'univers, flottement, effacement, mot qui voyage). Une modification non commitée restait dans `src/retours/useRetourDe.ts` (fichier de #97) : laissée à l'appréciation du nouvel `implementer`, relancé pour finir le câblage.
- 00:36 UTC (03/11) : À SAVOIR du responsable (#64) : #127 modifie `EcranDeSeance.tsx`, `useDeroulementDeSeance.ts` et `styles.css`. Conflits attendus (surtout `styles.css`) à l'intégration de `main` après le merge de #127.
- 01:50 UTC : câblage terminé par `implementer` (`070b4ae`, `6529030`, `b6aa9f1`). `useRetourDe.ts` (#97) : modification gardée, car `animation.cancel()` ne résout pas `.then` et `data-retour="rebond"` restait accroché quand la cible change en plein rebond ; le comportement de #97 ne change pas. Autres corrections : réserve de place de « Je ne sais pas » (la bulle effacée bougeait de 60 px), mot qui voyage qui suit sa place, halo posé de la bonne réponse montrée (#23). Aucune règle métier dans React. `deno test` 2766 verts, `vite build` OK. `@issue-126` 61/62 sur `telephone`. Le rouge restant est l'étape du plan « question relue », qui ne termine pas la relecture dans le faux `speechSynthesis`. `tsc` échoue sur une fonction inutilisée des steps (`rangDeLaBulle`). #17, #23, #97 et #98 : 186 verts et 2 rouges ; #23 est corrigé (`b6aa9f1`) ; un scénario de #97 (« La fin d'une séance se fête… ») est rouge aussi à `3b51321`, avant tout code de #126.
- 01:52 UTC : en parallèle, `e2e-tester` corrige les deux étapes, vérifie le rouge de #97 sur `main` et rejoue le périmètre ; `mr-reviewer` fait la review complète (cycle 1).
- 01:09 UTC : `e2e-tester` corrige les deux étapes (`a9881d8`). Son `git pull` intègre aussi `main` dans la branche (`b2542c0`, merge sans conflit) : **#106 mergée** (`8757070`, PR #142). Vérifié après coup par l'orchestrateur : aucun marqueur, `tsc` OK, `vite build` OK, `deno test` 2778 verts. La review du cycle 1 se fait contre `origin/main` à jour.
- 02:05 UTC : review cycle 1 (`mr-reviewer`, diff `origin/main...ef35b2d`) : **À CORRIGER**. Bloquants :
  1. la couleur de réussite de #97 ne se voit plus sur la bulle : le dessin SVG opaque cache le fond du bouton. Avec les mouvements réduits, c'est le seul signal de réussite. L'étape ne lit que `data-reussite` ;
  2. les 5 cas « écarté de la même façon » ne prouvent toujours rien : la signature ne lit ni le tracé ni le décor ;
  3. le mot qui voyage, rendu en portail hors de `main.ecran[data-mode-dys]`, ignore le mode dys.
  Non bloquants retenus pour ce cycle :
  - `rebondVu` jamais remis à faux ;
  - départ du voyage relancé par un autre toucher ;
  - petits éléments des dessins longs agrandis par la mise à l'échelle ;
  - fond de la bonne réponse montrée : jaune pâle sur la planche validée, fond de l'univers dans le code ;
  - clé stable et `document.fonts.ready` pour la largeur commune ;
  - code mort ;
  - couleurs du choix écarté en variables.
  Notés en dette :
  - `left`/`top` du mot qui voyage ;
  - `useReducedMotion()` dans `useRetourDe.ts` (#97) ;
  - indentation d'`Application.tsx` ;
  - fondu instantané avec les mouvements réduits (règle globale existante).
- Ordre : à la fin du run E2E en cours, `e2e-tester` rend les étapes 1 et 2 plus strictes (RED), puis `implementer` corrige les 3 bloquants et les non bloquants retenus.
- 02:45 UTC : run du périmètre sur la branche (`telephone`, #126, #17, #23, #97, #98) : 247 verts, 3 rouges, en 32 min. #17, #23 et #98 sont entièrement verts. Les étapes de `a9881d8` font passer le plan « question relue ». Les 3 rouges :
  - #126, conjugaison « suis » : éclat pas vu ;
  - #97 « Rejouer une leçon déjà acquise… séance terminée » : **rouge aussi sur `main`** (worktree de `origin/main`, 62/63 sur #97), l'effet « découverte » se joue avec « séance terminée » ; il ne vient pas de #126 ;
  - #97 « Léa rejoue fait entendre « bouton touché » » : vert sur `main`, rouge sur la branche, possible régression.
- 02:47 UTC : `e2e-tester` diagnostique les deux rouges non expliqués et rend plus strictes les étapes des bloquants 1 et 2 de la review (RED).
- 03:40 UTC : `e2e-tester` (`7b5a0f6`).
  - A1, conjugaison « suis » : défaut d'étape. L'arrivée du mot était lue trop tôt dans le journal. Corrigé, 12/12 verts avec trace.
  - A2, #97 « Léa rejoue… bouton touché » : instable **aussi sur `main`** (5 échecs sur 9). Piste : garde `parolesEnCours > 0` de `toucherUnBouton`. Ce n'est pas une régression de #126. Publié en APPRIS sur #126 (6594148597).
  - Étapes rendues strictes : couleur de réussite lue sur le tracé du dessin ; signature du choix écarté (dessin présent, `fill` et `stroke`, aucun décor ni dégradé). `@issue-126` : 55 verts, 7 rouges, tous pour la couleur de réussite cachée (bug applicatif). L'étape « écarté » est prouvée stricte par une mutation temporaire (5/5 rouges).
- 03:42 UTC : `implementer` corrige les 3 bloquants et les non bloquants retenus du cycle 1.
