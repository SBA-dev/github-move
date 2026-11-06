# #166 Une musique propre à chaque univers pour les célébrations : modèle du domaine

Petite story : **aucun agrégat, aucune commande, aucun événement nouveau**. Elle remplit deux catalogues qui existent déjà (sons de Voix, célébrations de Motivation). Elle referme 106.27.

## Contexte

- **Motivation** choisit la musique : `musique` de chaque entrée de `CRIS_ET_MUSIQUES` (`motivation/domain/celebrations-des-univers.ts`), aujourd'hui `grandeVictoire` pour les six univers. L'ordre des sons de la fin reste celui de `effets-sonores.ts` (106.46).
- **Voix** joue le son : quatre valeurs de plus dans l'union `EffetSonore` (`voix/domain/effet-sonore.ts`), leurs MP3, leur cache hors ligne.
- Relation **inchangée** : Voix publie `EffetSonore` (Published Language), Motivation l'importe. Voix ne connaît pas les univers. Pas de mise à jour de la context map.

## Termes

| Terme | Statut |
|---|---|
| Effet sonore | existant. « un des 8 sons » : **note de précision ajoutée** (#166 ajoute quatre musiques, 12 sons), sans reformuler la définition |
| Musique de la célébration | **nouveau** au glossaire (à valider). Le terme est déjà employé par #106 (`musiqueDeLaCelebration`) mais n'avait pas de ligne |
| Célébration de l'univers, Célébration commune, Moment de célébration, Univers, Muet, Voix suspendue | existants, réutilisés tels quels |
| « musique » seule | à éviter (synonyme interdit de **Chanson**, Catalogue pédagogique) : on dit « musique de la célébration » |

**Règle de nommage** (106.12) : chaque nouvel `EffetSonore` est nommé **d'après le son d'origine** choisi par le PO, jamais d'après l'univers ; nom en français, en camelCase dans le code (`grandeVictoire`), en kebab-case pour le fichier (`public/sons/grande-victoire.mp3`). Noms retenus après le choix du PO à l'écoute (voir « Choix des musiques par le PO »).

## Modèle

Aucun changement de structure. Deux catalogues sont remplis :

- `EffetSonore` (Voix) : 8 valeurs, puis 12 (quatre musiques distinctes, 166.2 A).
- `CRIS_ET_MUSIQUES` (Motivation) : `musique` de Danse, Animaux de la forêt, Princesses et fées et Pompiers = l'un de ces nouveaux `EffetSonore` ; Sports et Police gardent `grandeVictoire` (166.4 A, #173).

### Choix des musiques par le PO (à l'écoute, 2026-11-06)

| Univers | `musique` |
|---|---|
| Danse | `airDeSaxophone` |
| Animaux de la forêt | `airDeCordesPincees` |
| Princesses et fées | `airDeSteelDrumCourt` |
| Pompiers | `airDeSteelDrumLong` |
| Sports | `grandeVictoire` (en attente, issue de suivi #173) |
| Police | `grandeVictoire` (en attente, issue de suivi #173) |

## Invariants

1. **Chaque univers a sa musique, sauf univers en attente** (166.4 A) : les six entrées ont une `musique` définie ; Danse, Animaux de la forêt, Princesses et fées et Pompiers ont leur propre musique, Sports et Police gardent « grande victoire » jusqu'à #173.
2. **Musiques distinctes** des 8 effets sonores existants et distinctes entre elles : jamais un même son pour deux univers (166.2 A).
3. **3 s au plus**, jamais plus longue que la célébration (106.12, décision 0039) ; **30 Ko au plus**, MP3 mono 128 kbit/s (166.3 A).
4. **Un seul son de fin** : la musique remplace « grande victoire » ou « séance terminée », puis « découverte » s'il y a lieu, puis la parole, jamais par-dessus (106.12, 106.46).
5. **Fins sans moment de célébration inchangées** : célébration commune (#97), défi rejoué, test de départ et univers sans célébration gardent leur son actuel (« grande victoire » ou « séance terminée »).
6. **Contenu pour les enfants** : joyeux, sans sirène, alarme, bruit d'arme, cri ni son effrayant (règle absolue de `CLAUDE.md`), même pour Police et Pompiers.
7. **Hors ligne** : chaque MP3 est précaché (`public/sw.js`, liste `SONS`) et a sa licence dans `docs/sons.md` ; pas de nouveau scénario `@pwa`, celui de #97 couvre le mécanisme et la review vérifie le précache (166.5 B).
8. **Muet et voix suspendue** (166.1 A) : le Muet ne coupe pas la musique ; seule la voix suspendue des écrans du parent la coupe (97.2, 97.13, 106.11).

## Événements

Aucun.

## Emplacement

Fichiers existants modifiés, rien de créé sous `_shared/` :
- `supabase/functions/_shared/voix/domain/effet-sonore.ts` (union `EffetSonore`)
- `supabase/functions/_shared/motivation/domain/celebrations-des-univers.ts` (`musique` des six univers)
- `src/voix/lecteur-d-effets-sonores-du-navigateur.ts` (`FICHIER_DE_L_EFFET`), `public/sw.js` (`SONS`), `public/sons/*.mp3`, `public/sons/LICENCE-*.txt`, `docs/sons.md`

Partage avec le front : déjà en place (`@domain/voix`, `@domain/motivation`). Données d'enfants : **aucune** donnée nouvelle, rien d'enregistré ni d'envoyé.

## Questions ouvertes

Aucune. Questions tranchées par le PO le 2026-11-06 :

- **166.1 Le Muet coupe-t-il la musique de la célébration ? A** : non, le Muet laisse la musique (97.2, 106.11) ; seule la voix suspendue des écrans du parent la coupe (97.13). Le texte de l'issue (point 5) est à lire ainsi.
- **166.2 Une même musique pour deux univers ? A** : non, musiques distinctes.
- **166.3 Budget de poids ? A** : 30 Ko au plus par musique, MP3 mono 128 kbit/s.
- **166.4 Univers sans son convenable ? A** : il garde « grande victoire » et une issue de suivi est ouverte (#173, Sports et Police).
- **166.5 Scénario `@pwa` ? B** : pas de nouveau scénario (voir invariant 7).
