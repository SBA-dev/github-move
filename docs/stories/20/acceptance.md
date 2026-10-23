# Critères d'acceptance : issue #20, Calcul, fluence, addition posée

Scénarios : `features/20-calcul-fluence-addition-posee.feature` (tags `@issue-20 @wip`).
Modèle du domaine : `docs/stories/20/domain-model.md` (contexte **Apprentissage**, avec **Catalogue pédagogique**, **Motivation** et **Famille**).
Numérotation des questions : unique pour le lot 3, voir `docs/stories/16/acceptance.md` (#20 → Q37 à Q48 ; nouvelle question Q80).

## Objectif

En tant qu'**enfant**, je veux calculer avec des choix (au CP) ou le **clavier de cristaux** (à partir du CE1), calculer vite contre la montre (**fluence**) et poser puis calculer une **addition posée** en **colonnes**, afin de m'entraîner au calcul à mon rythme.

La story pose le **mode de réponse** et le clavier de cristaux (repris par #21), le tirage des **opérations** par un **générateur**, l'**adaptation de la difficulté**, l'**astuce de l'opération**, le **record de fluence** (nouvel agrégat, donnée de l'enfant) et la **retenue**.

Comportement actuel (`app/`, `keypad`, `genOp`, `calcRate`, `RUNNERS.calcul`, `fluence`, `addition`, `Records`) repris comme premiers exemples. Écarts voulus, validés par le PO (voir « Décisions ») : adaptation sur les 50 dernières réponses (Q40), pas d'astuce pour un calcul sans signe (Q45), messages de fluence pour 0 et 1 (Q39), phrase de la retenue selon le rang (Q37), retenue toujours garantie (Q48), aide d'un chiffre en double (Q80).

## Règles

Validation n°1 du lot 3 par le PO, le 2026-10-23 : « OK pour tout » (`docs/stories/lot-3-decisions.md` ; décisions `docs/decisions/0012-*` et `docs/decisions/0013-*`). Les propositions sont acceptées telles quelles : plus aucun scénario n'est `@a-valider`, et le comportement décrit n'a pas changé.

| # | Règle | Scénarios |
|---|---|---|
| 1 | Au CP, on répond à un calcul par choix ; à partir du CE1, au clavier de cristaux | Au CP, le calcul propose quatre choix autour du résultat · Au CP, un résultat de 0 ne propose jamais de nombre négatif · À partir du CE1, le calcul se répond au clavier de cristaux · Au clavier de cristaux, un nombre faux s'efface et laisse une nouvelle chance · « Valider » sans chiffre ne compte rien · Le clavier de cristaux n'accepte pas plus de 4 chiffres |
| 2 | Les opérations tirées respectent leur générateur, et la difficulté s'adapte quand l'enfant se trompe souvent | Les opérations tirées restent dans les intervalles du générateur · Une soustraction tirée ne donne jamais un résultat négatif · Sans opérations ni générateur, le calcul propose 5 additions de nombres de 1 à 10 · Quand l'enfant se trompe souvent, les nombres tirés deviennent plus petits · Quand l'enfant réussit de nouveau, les nombres tirés regrandissent · Avec moins de 6 réponses de calcul, la difficulté ne change pas |
| 3 | Après une erreur de calcul, le personnage guide lit l'aide de l'opération, sinon l'astuce de son signe | Sans aide, le personnage guide donne l'astuce de l'addition · L'aide de l'opération passe avant l'astuce de son signe · Un calcul sans signe et sans aide n'a pas d'astuce |
| 4 | La fluence compte les calculs réussis avant la fin du temps, sans erreur, et garde le record | La fluence commence au signal et compte chaque bonne réponse · Une réponse fausse pendant la fluence ne coûte pas d'erreur · Après la fin du temps, plus aucune réponse n'est prise · À la fin de la fluence, <cas> (3 cas : premier record, nouveau record, record qui reste) · À la fin de la fluence, <score> calcul réussi donne « <phrase> » (2 cas) · Un score de fluence de 0 n'est jamais un record · Le record de fluence … seulement pour un parent rattaché (`@acces`) |
| 5 | Addition posée, étape poser : chaque chiffre va dans la colonne de son rang | Dans l'univers « <univers> », les colonnes gardent leurs couleurs (2 cas) · Un chiffre posé dans la colonne de son rang y reste · Un chiffre posé dans la mauvaise colonne revient, avec son rang et sa couleur · Un nombre d'un seul chiffre va dans la colonne des unités · Avec un chiffre en double, l'aide vise la colonne encore libre |
| 6 | Addition posée, étape calculer : on calcule des unités vers la gauche, et la dizaine monte en retenue | Une somme de 10 ou plus écrit ses unités et fait monter la retenue · Oublier la retenue est reconnu · Une autre erreur invite à compter doucement · La dernière colonne écrit toute sa somme, et l'addition est félicitée · Au CP, la somme d'une colonne se choisit parmi quatre nombres · Dans la colonne des dizaines, la phrase de la retenue dit centaines et dizaines · Un générateur d'additions avec retenue donne toujours une retenue · L'avancement d'une addition posée compte chaque chiffre posé et chaque colonne calculée |
| 7 | Le calcul s'utilise au doigt, au clavier, sans mouvement et sur un petit écran | Le clavier de cristaux tient dans un écran de 360 px de large · Sur un ordinateur, Tom répond au clavier de cristaux avec le clavier · Le temps qui reste et les calculs réussis de la fluence sont annoncés aux lecteurs d'écran · Avec les mouvements réduits, la retenue apparaît sans voler |

Total : 7 règles, 39 scénarios (43 cas), dont 1 `@acces`, aucun `@a-valider`. Story la plus grosse du lot : si elle doit être découpée à la livraison, la coupe naturelle est calcul (règles 1 à 3) / fluence (règle 4) / addition posée (règles 5 et 6).

Droits d'accès (`@acces`) : le record de fluence est une donnée de l'enfant. Un parent non rattaché ne le lit pas (RLS fondée sur le rattachement, comme #24). Il est supprimé avec le profil et inclus dans l'export (contrat de #14) : vérifié par les scénarios de #24 sur les données du profil et par les tests d'intégration de l'adaptateur.

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| Les doubles | `ma-cp-doubles` | calcul « Les doubles » (« 2 + 2 » → choix 3, 4, 5, 6 ; « 3 + 3 » sans aide) ; fluence « Calcul rapide : les doubles » (45 s) |
| Poser une addition en colonnes | `ma-cp-addition-posee` | « La leçon en action : 45 + 37 » (poser puis calculer : 12 dans les unités, retenue 1, 8 dans les dizaines, 82) ; « Calculer avec la retenue » (générateur avec retenue, 3 additions) |
| Leçons de test | — | « 3 − 3 » (CP) ; « 12 − 5 » (CE1, clavier de cristaux) ; « 9 + 6 » avec aide ; « Moitié de 10 » sans aide ; générateurs d'additions (1 à 5, 1 à 20) et de soustractions ; addition posée « 28 + 8 », « 55 + 3 », « 45 + 65 » |

Profils : Léa (CP) et Tom (CE1), univers « Animaux de la forêt » ; Nina (CP) pour les couleurs des colonnes dans deux univers.

Adaptation : intervalle [1, 20] avec 4 justes sur 10 réponses (40 %) → [1, 13] (`arrondi(1 + 19 × 0,65)`). L'historique de calcul est préparé par le jeu de données (séances terminées de #24). Le temps de la fluence est piloté par l'horloge de test (port `Horloge`), jamais par une attente réelle.

## Hors périmètre

- Addition de 4 chiffres ou plus (Q41) : refusée par le Catalogue, vérifiée par les tests du domaine et le test de la bibliothèque.
- Complément dont `a` dépasse la cible (Q46) : refusé par le Catalogue, tests unitaires seulement.
- Erreurs de l'étape poser notées pour les révisions (Q42) : invisibles au lot 3.
- Plus de temps de fluence en mode dys (Q44) : aucune règle au lot 3.
- Textes exacts des annonces « premier record » et « nouveau record » : repris du legacy à la livraison ; les scénarios vérifient le record annoncé.

## Décisions

Source : validation du PO du 2026-10-23 (`docs/stories/lot-3-decisions.md`). Chaque question reçoit pour réponse sa proposition.

37. *(#20 n°1)* **Phrase de la retenue** selon le rang de la colonne (« 11, c'est 1 centaine et 1 dizaine ! ») ? **Décision** : oui. → « Dans la colonne des dizaines, la phrase de la retenue… ».
38. *(#20 n°2)* **Fluence** : les réponses fausses ne coûtent pas d'erreur, mais une séance faite seulement d'une fluence ne donne pas d'étoiles (Q69), et elles comptent pour l'adaptation ? **Décision** : oui. → « Une réponse fausse pendant la fluence ne coûte pas d'erreur » (et #24).
39. *(#20 n°3)* **Fluence : 0 et 1 calcul** : « Pas encore de calcul réussi : on réessaie quand tu veux ! » et « 1 calcul réussi ! » ? **Décision** : oui. → plan « À la fin de la fluence, <score> calcul réussi… ».
40. *(#20 n°4)* **Adaptation** : toutes les leçons de calcul, seuils gardés (6 réponses, 60 %, 65 %), sur les **50 dernières réponses** ? **Décision** : oui. → « Quand l'enfant se trompe souvent… », « Quand l'enfant réussit de nouveau… ».
41. *(#20 n°5)* **Addition de 4 chiffres** : refusée au lot 3 ? **Décision** : oui. Tests unitaires et pytest.
42. *(#20 n°6)* **Étape poser** : les questions ratées gardées comme les autres, le lot 4 décide ? **Décision** : oui. Pas de scénario.
43. *(#20 n°7)* **Glossaire** : Record de fluence, Clavier de cristaux, Retenue, Colonne, Rang ; « maison » mot d'interface ? **Décision** : oui.
44. *(#20 n°8)* **Fluence en mode dys** : plus de temps ? **Décision** : non au lot 3. Pas de scénario.
45. *(#20 n°9)* **Calcul sans signe** (« Moitié de 10 ») : seulement l'encouragement, sauf `aide` ? **Décision** : oui. → « Un calcul sans signe et sans aide n'a pas d'astuce ».
46. *(#20 n°10)* **Complément** : le Catalogue refuse un `a` qui dépasse la cible ? **Décision** : oui. Tests unitaires.
47. *(#20 n°11)* **Avancement de l'addition posée** : une question par chiffre posé et par colonne calculée ? **Décision** : oui. → « L'avancement d'une addition posée… » (45 + 37 : 6).
48. *(#20 n°12)* **Générateur avec `retenue`** : toujours une retenue ? **Décision** : oui. → « Un générateur d'additions avec retenue donne toujours une retenue ».

Question née des scénarios :

80. **Addition posée, chiffre en double** (« 55 + 3 ») : quand l'enfant pose le second « 5 » dans la colonne déjà prise, l'aide vise la colonne **encore libre** (« … le 5 est le chiffre des dizaines : il va dans la maison rose. ») ? Aujourd'hui elle vise le premier « 5 » et peut renvoyer l'enfant vers la colonne déjà remplie. Le modèle (#20, étape poser) propose cette correction sans l'avoir numérotée. **Décision** : oui. → « Avec un chiffre en double, l'aide vise la colonne encore libre ».

## Questions ouvertes

Aucune.
