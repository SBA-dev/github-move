# Termes refusés (français)

> **Statut : validée par le PO le 2026-10-25.** #103 peut la brancher. Toute modification ultérieure (ajout ou retrait d'un terme) est validée par le PO et notée dans « Traitements ».

`fr.txt` : un terme par ligne, en minuscules, 327 termes. C'est une liste de **filtrage** : elle n'est **jamais montrée** à l'enfant ni au parent. Elle sert à refuser un texte saisi par un parent (#103, puis une story par saisie) selon la règle « Contenus pour les enfants » de `CLAUDE.md`.

## Provenance

| Source | Licence | Version | Termes repris |
|---|---|---|---|
| [darwiin/french-badwords-list](https://github.com/darwiin/french-badwords-list) (`list.txt`, tiré de la catégorie « Insultes en français » du Wiktionnaire) | MIT (`LICENCE-french-badwords-list.txt`) | commit `a44dd60`, 2023-05-25 | 271 formes simples |
| [LDNOOBW](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words) (`fr`) | CC BY 4.0 (`LICENCE-ldnoobw.txt`), attribution : « List of Dirty, Naughty, Obscene, and Otherwise Bad Words », Shutterstock et contributeurs | commit `5faf2ba`, 2020-07-13 | 91 termes |

## Traitements

- Fusion des deux listes, doublons retirés (31 termes communs).
- **Variantes déguisées retirées** : darwiin contient 2 161 variantes où des lettres sont remplacées par des chiffres ou des symboles (`0` pour `o`, `1` pour `i`, `@` pour `a`…). Toutes se ramènent à une des formes simples gardées. La vérification de #103 doit donc **décoder** ces substitutions (et ignorer majuscules, accents, lettres répétées et espaces entre les lettres) avant de comparer, plutôt que de lister chaque variante.
- **Écarté** : `chatte`, mot du vocabulaire des leçons (femelle du chat), présent dans `app/bibliotheque.json`.
- **Retirés à la relecture du PO** (2026-10-25) : `épais` et sa forme sans accent `epais`, `gueule`. Mots courants, utiles dans des leçons (« la gueule du loup », « un épais brouillard »).
- **Vérifié absent** : les mots que le programme d'histoire emploie (guerre, arme, mort, soldat, bataille, esclavage…). Ils ne doivent jamais entrer dans cette liste (décision 0030).

## Limites

Une liste ne comprend pas le contexte : elle ne repère ni une phrase violente faite de mots ordinaires, ni un contenu haineux sans terme injurieux. La modération par l'IA (#40) complètera ce filtre. Une erreur dans la liste (terme manquant ou mot innocent refusé) se corrige ici, avec une ligne dans « Traitements ».
