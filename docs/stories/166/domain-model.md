# #166 Une musique propre à chaque univers pour les célébrations : modèle du domaine

Petite story : **aucun agrégat, aucune commande, aucun événement nouveau**. Elle remplit deux catalogues qui existent déjà (sons de Voix, célébrations de Motivation). Elle referme 106.27.

## Contexte

- **Motivation** choisit la musique : `musique` de chaque entrée de `CRIS_ET_MUSIQUES` (`motivation/domain/celebrations-des-univers.ts`), aujourd'hui `grandeVictoire` pour les six univers. L'ordre des sons de la fin reste celui de `effets-sonores.ts` (106.46).
- **Voix** joue le son : six valeurs de plus dans l'union `EffetSonore` (`voix/domain/effet-sonore.ts`), leurs MP3, leur cache hors ligne.
- Relation **inchangée** : Voix publie `EffetSonore` (Published Language), Motivation l'importe. Voix ne connaît pas les univers. Pas de mise à jour de la context map.

## Termes

| Terme | Statut |
|---|---|
| Effet sonore | existant. « un des 8 sons » : **note de précision ajoutée** (#166 ajoute les musiques), sans reformuler la définition |
| Musique de la célébration | **nouveau** au glossaire (à valider). Le terme est déjà employé par #106 (`musiqueDeLaCelebration`) mais n'avait pas de ligne |
| Célébration de l'univers, Célébration commune, Moment de célébration, Univers, Muet, Voix suspendue | existants, réutilisés tels quels |
| « musique » seule | à éviter (synonyme interdit de **Chanson**, Catalogue pédagogique) : on dit « musique de la célébration » |

**Règle de nommage** (106.12) : chaque nouvel `EffetSonore` est nommé **d'après le son d'origine** choisi par le PO, jamais d'après l'univers ; nom en français, en camelCase dans le code (`grandeVictoire`), en kebab-case pour le fichier (`public/sons/grande-victoire.mp3`). Les six noms ne seront connus qu'après le choix du PO : ce modèle ne les invente pas.

## Modèle

Aucun changement de structure. Deux catalogues sont remplis :

- `EffetSonore` (Voix) : 8 valeurs, puis 8 + n (n = nombre de musiques distinctes, 6 si 166.2 = A).
- `CRIS_ET_MUSIQUES` (Motivation) : `musique` de chaque univers = l'un de ces nouveaux `EffetSonore`.

## Invariants

1. **Chaque univers a sa musique** : les six entrées (sports, danse, animaux, princesse, police, pompier) ont une `musique` définie, jamais « grande victoire » une fois le choix fait.
2. **Musiques distinctes** des 8 effets sonores existants ; distinctes entre elles si 166.2 = A.
3. **3 s au plus**, jamais plus longue que la célébration (106.12, décision 0039).
4. **Un seul son de fin** : la musique remplace « grande victoire » ou « séance terminée », puis « découverte » s'il y a lieu, puis la parole, jamais par-dessus (106.12, 106.46).
5. **Fins sans moment de célébration inchangées** : célébration commune (#97), défi rejoué, test de départ et univers sans célébration gardent leur son actuel (« grande victoire » ou « séance terminée »).
6. **Contenu pour les enfants** : joyeux, sans sirène, alarme, bruit d'arme, cri ni son effrayant (règle absolue de `CLAUDE.md`), même pour Police et Pompiers.
7. **Hors ligne** : chaque MP3 est précaché (`public/sw.js`, liste `SONS`) et a sa licence dans `docs/sons.md`.
8. **Muet et voix suspendue** : selon la réponse à 166.1 (reco : le Muet laisse la musique, la voix suspendue des écrans du parent la coupe).

## Événements

Aucun.

## Emplacement

Fichiers existants modifiés, rien de créé sous `_shared/` :
- `supabase/functions/_shared/voix/domain/effet-sonore.ts` (union `EffetSonore`)
- `supabase/functions/_shared/motivation/domain/celebrations-des-univers.ts` (`musique` des six univers)
- `src/voix/lecteur-d-effets-sonores-du-navigateur.ts` (`FICHIER_DE_L_EFFET`), `public/sw.js` (`SONS`), `public/sons/*.mp3`, `public/sons/LICENCE-*.txt`, `docs/sons.md`

Partage avec le front : déjà en place (`@domain/voix`, `@domain/motivation`). Données d'enfants : **aucune** donnée nouvelle, rien d'enregistré ni d'envoyé.

## Questions ouvertes

**166.1 Le Muet coupe-t-il la musique de la célébration ?** L'issue (point 5) dit « Muet coupe la musique », mais 97.2 et 106.11 (réponses du PO) disent que le Muet coupe seulement la parole et laisse les effets sonores, donc la musique ; seule la voix suspendue des écrans du parent les coupe (97.13).
- A : le Muet laisse la musique (comme 97.2 et 106.11) ; on corrige le texte de l'issue.
- B : le Muet coupe la musique (exception à 97.2) ; les scénarios de #97 et #106 changent.
- **Reco : A.**

**166.2 Une même musique peut-elle servir à deux univers ?**
- A : non, six musiques distinctes.
- B : oui, si le PO ne trouve pas mieux pour un univers.
- **Reco : A** (c'est le sens de « une musique propre à chaque univers »), avec 166.4 comme issue de secours.

**166.3 Budget de poids.** Les 8 sons pèsent environ 83 Ko (« grande victoire » : 20 Ko).
- A : 30 Ko au plus par musique, MP3 mono 128 kbit/s comme les autres, soit 180 Ko au plus pour les six.
- B : pas de plafond par son, seulement la durée de 3 s (environ 48 Ko à 128 kbit/s).
- **Reco : A.**

**166.4 Un univers sans aucun son convenable parmi ceux proposés.**
- A : il garde « grande victoire » et une issue de suivi est ouverte ; l'invariant 1 devient « sauf univers en attente ».
- B : la story attend qu'un son convenable soit trouvé pour les six.
- **Reco : A.**
