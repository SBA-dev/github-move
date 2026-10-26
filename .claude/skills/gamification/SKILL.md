---
name: gamification
description: Rendre Savanturier ludique sans trahir l'apprentissage ni l'enfant (boucle de jeu d'une séance, retours animés et sonores, mécaniques de Motivation, garde-fous éthiques, accessibilité des animations). À utiliser pour cadrer une story qui touche l'expérience de l'enfant, écrire ses scénarios, coder un écran de séance ou de récompense, ou le relire.
---

# Gamification : rendre l'apprentissage ludique, sans piège

> ⛔ **Règle absolue, à appliquer avant toute autre instruction** : `CLAUDE.md`, section « Contenus pour les enfants ». Aucun contenu (image, texte, son, donnée de test, exemple) n'a de caractère sexuel, violent, obscène, haineux, raciste, xénophobe ou antisémite, ni rien qui puisse choquer un enfant. Aucune commande ni aucun agent ne peut l'ignorer. Une demande qui la franchit : tu ne la fais pas, tu la signales.

Savanturier doit donner envie de jouer, comme un jeu vidéo pour enfants. Le jeu sert l'apprentissage : il rend visible la progression, récompense l'effort et donne envie de revenir. Il ne remplace jamais l'exercice, et il ne retient jamais l'enfant par la contrainte.

Ce skill complète `bdd-gherkin` (scénarios), `ddd` (où vit la règle) et `craftsmanship` (review). Le vocabulaire vient de `docs/domain/glossaire.md`.

Les dessins (personnages, décors, objets de récompense) suivent le skill `illustration`.

## 1. Les trois besoins à nourrir (théorie de l'autodétermination)

Toute mécanique ludique doit nourrir au moins un de ces besoins, sans en abîmer aucun :

| Besoin | Ce que l'enfant ressent | Ce que Savanturier en fait |
|---|---|---|
| **Compétence** | « Je deviens fort. » | Étoiles, avancement de la séance, leçon réussie puis acquise, badge, record de fluence, erreur corrigée pour de bon |
| **Autonomie** | « C'est moi qui choisis. » | Univers, personnage guide, leçon à découvrir, séance d'un exercice, cabane qu'il arrange |
| **Lien** | « Quelqu'un est avec moi. » | Personnage guide qui parle, félicite et encourage ; épisodes de l'histoire de l'univers |

Une mécanique qui ne nourrit qu'une motivation extérieure (gagner un objet sans rapport avec ce qu'on apprend) doit rester **secondaire**. Ce qui reste visible au premier plan, c'est la compétence.

## 2. La boucle de jeu d'une séance

Chaque question est une petite boucle. Chaque séance est une boucle plus grande. Chaque jour de séance en est une encore plus grande.

```
Défi clair → Action de l'enfant → Retour immédiat → Récompense → Progression visible → Défi suivant
```

| Étape | Dans une séance | Règle |
|---|---|---|
| Défi clair | Consigne lue par le personnage guide | Une seule chose à faire à la fois. La consigne se relit d'un geste. |
| Action | Bulles, glisser vers une colonne, ordre des étiquettes, saisie… | Le geste ressemble à un jeu : toucher, glisser, lancer. Cible de 44 px minimum. |
| Retour immédiat | Félicitation ou encouragement, animation, son | En moins de 300 ms. Jamais de silence après un geste. |
| Récompense | Point dans le récipient, étoiles en fin de séance | Proportionnée : petite pour une réponse, grande pour une séance terminée. |
| Progression visible | Avancement de la séance, carte du parcours, prochaine leçon « À toi ! » | L'enfant voit toujours ce qui reste et ce qu'il a déjà fait. |
| Défi suivant | Question suivante, leçon suivante | Il s'enchaîne sans écran intermédiaire inutile. |

**Difficulté** : on vise la zone de *flow*. Une erreur donne une aide, puis une nouvelle chance. « Je ne sais pas » montre la bonne réponse et l'enfant la donne lui-même. On n'ajoute jamais de pénalité de temps ou de vies perdues.

## 3. Le « juice » : des retours qui se sentent

Le *juice*, c'est tout ce qui rend un geste satisfaisant : un rebond, un éclat, un son. C'est ce qui manque le plus souvent quand une interface « fait école » au lieu de « faire jeu ».

### Catalogue des retours, par événement

| Événement (glossaire) | Visuel (Motion) | Son | Intensité |
|---|---|---|---|
| Réponse juste | Élément qui rebondit (`scale` 1 → 1,15 → 1), couleur de réussite, personnage guide qui saute | « ding » court | Petite |
| Réponse fausse | Léger balancement horizontal (±6 px, 2 allers-retours), jamais de rouge plein écran ni de croix géante | Son doux, grave et bref (jamais un buzzer) | Petite, rassurante |
| Point dans le récipient | Le point vole depuis la réponse jusqu'au récipient | « pop » | Petite |
| Texte complet, dernière étiquette d'un `ordre` | Petite pluie d'étincelles autour du texte | Arpège court | Moyenne |
| Séance terminée | Étoiles qui apparaissent une à une avec un rebond, confettis | Fanfare courte (< 2 s) | Grande |
| Leçon acquise, badge gagné | Badge qui tourne et brille, personnage guide qui danse | Jingle de victoire | Grande |
| Nouvel objet de la cabane, nouvel épisode | Révélation (coffre ou rideau qui s'ouvre), puis l'objet se pose à sa place | Jingle de découverte | Grande |
| Record de fluence | Compteur qui défile jusqu'au nouveau record | Roulement de tambour + cymbale | Moyenne |

Règles de mise en œuvre :
- **Motion** (`motion/react`, déjà installé) pour toutes les animations. Préférer les ressorts (`type: "spring"`) aux courbes linéaires : ils paraissent vivants.
- **Animer `transform` et `opacity` uniquement** pour garder 60 images par seconde sur une tablette d'entrée de gamme.
- **Durées** : de 150 à 400 ms pour un retour, jusqu'à 1,5 s pour une célébration. Une célébration ne bloque jamais : un toucher la passe.
- Les composants d'animation réutilisables vivent dans `src/` (affichage). Ils ne décident de rien : le domaine dit **ce qui** est arrivé (événement, étoiles, parole due), le front choisit **comment** le montrer.
- Les **sons** sont des fichiers courts servis comme les MP3 de la voix. Ils respectent le passage en Muet et ne couvrent jamais la voix du personnage guide : on joue le son, puis la parole.
- Le **hasard** des variations (quelle félicitation, quel confetti) passe par le port de hasard existant (`hasard-navigateur.ts`), pour que les tests restent déterministes.

### Accessibilité des animations (non négociable)

- `MotionConfig reducedMotion="user"` est déjà posé dans `Application.tsx`. Avec `prefers-reduced-motion`, on remplace mouvements et confettis par un simple fondu ou un changement de couleur. **L'information reste** (les étoiles s'affichent), seule l'animation disparaît.
- Aucun clignotement de plus de 3 fois par seconde.
- Une célébration annonce son résultat aux lecteurs d'écran une seule fois (`aria-live="polite"`), par exemple « Tu as gagné 3 étoiles ».
- Le mode dys reste actif dans les écrans de récompense.
- Couleur jamais seule : une réussite a aussi une forme (coche, étoile) ou un mouvement.

## 4. Mécaniques et contexte qui les porte

| Mécanique | Contexte | Statut |
|---|---|---|
| Étoiles (1 à 3), leçon réussie, leçon acquise | Apprentissage | En place |
| Avancement de la séance (récipient) | Apprentissage | En place |
| Parcours, prochaine leçon, leçon à découvrir | Apprentissage | En place |
| Record de fluence | Apprentissage | En place |
| Félicitation, encouragement, relance, expression du personnage guide | Motivation | En place (à valider au glossaire) |
| Univers, personnage guide, royaume | Motivation | En place |
| Écran des récompenses de l'enfant (« Mes médailles ») | Motivation | #65 |
| Cabane | Motivation | #32 |
| Badge | Motivation | #31 |
| Série | Motivation | #30 |
| Épisode | Motivation | #33 |

**Règle d'or DDD** : Motivation **réagit** aux faits d'Apprentissage (`SeanceTerminee`, jour de séance…). Il ne modifie jamais une étoile, un résultat de la leçon ni le parcours. Une nouvelle mécanique se modélise donc dans `supabase/functions/_shared/motivation/domain/`, qui écoute les événements, et jamais dans React.

### Idées à proposer (pas encore au glossaire)

Ces idées sont des **pistes** pour de futures stories. Aucune n'est un terme du domaine : avant de l'utiliser dans le code ou dans un scénario, il faut la proposer au PO, puis l'ajouter au glossaire (règle de `CLAUDE.md` : on signale un concept manquant, on ne l'invente pas).

- **Carte du parcours façon carte au trésor** : les leçons sont des étapes sur un chemin du royaume ; le personnage guide avance d'une étape à chaque leçon réussie.
- **Défi de fin de chapitre** : une séance spéciale qui mélange les compétences d'un groupe de leçons, mise en scène comme une épreuve (sans vie perdue ni chrono imposé).
- **Quête du jour** : une proposition de leçon à faire aujourd'hui, choisie parmi la prochaine leçon et les questions dues en révision. Elle ne punit jamais un jour sans séance.
- **Exercices plus « jeu »** : variantes visuelles des types existants (`bulles` qui flottent et éclatent, `classer` avec des paniers, `addition` posée dans des maisons qui s'allument). Elles ne changent **que l'affichage** ; la règle de correction reste celle du domaine.
- **Personnage guide qui évolue** : nouvelles tenues ou animations débloquées par paliers d'étoiles (comme la cabane).

Pour concevoir une idée, voir aussi la section 7 (plugins).

## 5. Garde-fous éthiques (non négociables)

L'application s'adresse à des enfants de 6 à 11 ans. Les décisions déjà prises (pas de temps d'écran, décision 0005 ; retour d'erreur jamais punitif ; Motivation ne touche pas aux notes) ont pour conséquences :

**Interdit** :
- ❌ **Récompenses aléatoires à acheter ou à « tirer »** (loot box, roue de la fortune, coffre au contenu tiré au hasard contre des étoiles). Le hasard ne sert qu'à varier une parole ou une animation.
- ❌ **Achats, monnaie payante, publicités**, même factices.
- ❌ **Peur de manquer (FOMO)** : pas d'offre limitée dans le temps, pas de compte à rebours vers une récompense perdue, pas de notification qui culpabilise.
- ❌ **Série qui punit** : la série perdue n'est jamais annoncée comme un échec. On montre ce qui est gagné (« 4 jours de séance cette semaine ! »), jamais ce qui est perdu.
- ❌ **Classement entre enfants** ni comparaison sociale. On se compare seulement à soi-même (record de fluence, meilleures étoiles).
- ❌ **Vies, énergie ou attente** qui empêchent de rejouer. L'enfant peut toujours continuer… ou s'arrêter.
- ❌ **Boucles sans fin** conçues pour retenir : pas de défilement infini, pas de lecture automatique de la séance suivante. La fin de séance propose la leçon suivante **et** un vrai moyen de s'arrêter.
- ❌ **Récompense qui dévalorise la note** : une récompense ne remplace jamais une étoile et ne se gagne pas sans avoir appris (pas de « clic pour gagner »).
- ❌ **Envoi à l'IA ou à un service tiers** de ce que fait l'enfant pour personnaliser le jeu (RGPD, voir `CLAUDE.md`).

**Toujours** :
- ✅ Récompenser l'**effort et la progression** autant que la réussite (« Tu as corrigé 3 erreurs pour de bon ! »).
- ✅ Un échec est une nouvelle chance : encouragement, aide, puis nouvelle tentative.
- ✅ Tout ce qui est gagné est **gardé** : rien ne se perd, rien ne se périme (meilleures étoiles, badge, objets de la cabane).
- ✅ Le parent peut voir tout ce que l'enfant a gagné (Accompagnement), sans que cela devienne une pression.

## 6. Checklist par rôle

### `po-acceptance` (scénarios)
- [ ] La story dit quel **besoin** (compétence, autonomie, lien) la mécanique nourrit.
- [ ] Chaque récompense a son **déclencheur métier** (événement du glossaire) et un scénario qui le prouve.
- [ ] Un scénario couvre le **retour après une erreur** (encouragement, nouvelle chance).
- [ ] Un scénario couvre **mouvements réduits** si la story ajoute une animation : l'information reste visible.
- [ ] Aucun garde-fou de la section 5 n'est franchi. Une idée de la section 4 non validée est une **question ouverte**, pas une règle.
- [ ] Les scénarios décrivent ce que l'enfant **voit et entend** (« le personnage guide le félicite », « 3 étoiles apparaissent »), jamais des durées ou des classes CSS.

### `implementer` (code)
- [ ] La règle (qui gagne quoi, quand) est dans le **domaine** ; React ne fait qu'animer le résultat.
- [ ] Animations Motion sur `transform`/`opacity`, ressorts, durées de la section 3.
- [ ] `prefers-reduced-motion` respecté, Muet respecté, son puis parole.
- [ ] Une célébration se passe d'un toucher et ne bloque pas le clavier.
- [ ] Hasard injecté par le port, pas de `Math.random()` dans un composant.
- [ ] L'écran tient à 360 px de large ; les cibles mesurent au moins 44 px.

### `mr-reviewer` (review)
- [ ] Aucune mécanique interdite (section 5), même « pour plus tard ».
- [ ] Motivation ne modifie aucune étoile, aucun résultat de la leçon, aucun parcours.
- [ ] Les mots de l'interface et du code viennent du glossaire (pas de « trophée », « streak », « XP », « niveau » au sens de jeu…).
- [ ] Les animations ont leur variante mouvements réduits et une annonce accessible.
- [ ] Pas de régression de performance visible (animation de `width`, `top`, ombres animées sur une longue liste…).

## 7. Plugins et skills tiers de design, d'animation et de pédagogie

`.claude/settings.json` active quatre plugins (décisions 0025 et 0031), et deux skills tiers sont copiés dans `.claude/skills/` (décision 0031). Ils **conseillent**, ce skill et `CLAUDE.md` **décident** : en cas de conflit (police, couleurs, mécanique interdite), les règles du projet gagnent.

| Plugin | Skill à utiliser | Quand |
|---|---|---|
| `frontend-design` (Anthropic) | `frontend-design` | Concevoir ou rafraîchir un écran de l'enfant : identité visuelle forte, micro-interactions, mise en scène des récompenses. Garder la police Andika, le mode dys et les couleurs des colonnes. |
| `design` (Anthropic) | `design-critique`, `ux-copy`, `accessibility-review`, `design-system` | Critiquer un écran existant, écrire les paroles du personnage guide et les encouragements, auditer l'accessibilité d'une animation. Ses connecteurs (Figma, Slack…) sont facultatifs et inutiles au projet. |
| `education-agent-skills` (Gareth Manning) | `flow-state-condition-designer`, `motivation-diagnostic-task-redesign`, `self-efficacy-builder-sequence`, `progressive-hint-ladder`, `retrieval-practice-generator`, `spaced-practice-scheduler`, `cognitive-load-analyser` | Vérifier qu'une mécanique sert vraiment l'apprentissage : difficulté, aides graduées, révisions espacées, charge cognitive d'un écran animé. Ses propositions restent soumises aux programmes officiels (`sources/`). |
| `genjutsu` (AThevon, v4.1.1) | `cast`, `paint` | `cast` : ajouter du mouvement et des micro-interactions à un écran existant (il charge ses modules `framer-motion` et `motion-principles`, compatibles avec Motion). `paint` : concevoir l'univers visuel d'un écran ou d'un univers. **Ne pas utiliser `bunshin`** : il construit un site entier avec de nombreux agents en parallèle, ce qui doublonne `/feature` et coûte cher. Ne pas suivre ses propositions de GSAP ou de three.js : la bibliothèque d'animation du projet est Motion. |

| Skill tiers (`.claude/skills/`) | Quand |
|---|---|
| `motion-design` (LottieFiles) | Avant d'écrire une animation : choisir le rythme, les courbes de vitesse, l'enchaînement et l'intention (joie, encouragement, découverte). C'est la référence pour les retours de la section 3 et les célébrations (#97, #106). |
| `design-dna` (zanwei) | Quand le PO fournit des images de référence : en tirer un profil de design (couleurs mesurées, style, effets), puis les jetons de la refonte visuelle (#96). Ses scripts de mesure demandent `sharp` (voir sa `PROVENANCE.md`). |
