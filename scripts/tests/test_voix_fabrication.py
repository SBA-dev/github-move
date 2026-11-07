"""Fabrication incrémentale des sons de phrases et répertoire des sons (#182).

API attendue (module `voix/fabrication.py`) :
- `fabriquer_les_sons(inventaire, dossier, voix, identifiant_voix="fr_FR-tom-medium", debit="32k") -> dict`
  - `voix(texte, chemin) -> int` écrit le MP3 à `chemin` et rend sa durée en millisecondes ;
  - le retour est le répertoire des sons, aussi écrit dans `<dossier>/repertoire.json`.
- `nom_du_fichier(prononciation, identifiant_voix, debit) -> str` : `<empreinte>.mp3`.
"""
import json
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

from voix import fabrication  # noqa: E402
from voix.prononciation import prononciation_corrigee  # noqa: E402

VOIX = "fr_FR-tom-medium"
DEBIT = "32k"


class FauxPiper:
    """Écrit des octets et journalise les textes reçus : ni Piper ni ffmpeg."""

    def __init__(self, duree_ms=1500):
        self.textes_recus = []
        self.duree_ms = duree_ms

    def __call__(self, texte, chemin):
        self.textes_recus.append(texte)
        Path(chemin).write_bytes(b"octets-mp3")
        return self.duree_ms


def inventaire_de(*phrases, lecons=None):
    return {
        "phrases": [{"cle": phrase.lower(), "phrase": phrase} for phrase in phrases],
        "lecons": lecons or {},
    }


def fabriquer(inventaire, dossier, voix, identifiant_voix=VOIX, debit=DEBIT):
    return fabrication.fabriquer_les_sons(
        inventaire, dossier, voix, identifiant_voix=identifiant_voix, debit=debit
    )


def test_la_prononciation_corrigee_est_envoyee_a_la_voix(tmp_path):
    piper = FauxPiper()

    fabriquer(inventaire_de("Vas-y, essaie encore !"), tmp_path, piper)

    assert piper.textes_recus == [prononciation_corrigee("Vas-y, essaie encore !")]


def test_chaque_phrase_a_un_fichier_mp3_dans_le_dossier_de_sortie(tmp_path):
    fabriquer(inventaire_de("Bravo !", "Bien joué !"), tmp_path, FauxPiper())

    assert len(list(tmp_path.glob("*.mp3"))) == 2


def test_deux_phrases_de_meme_prononciation_corrigee_partagent_le_meme_fichier(tmp_path):
    piper = FauxPiper()

    repertoire = fabriquer(inventaire_de("Vas-y !", "Va-z-i !"), tmp_path, piper)

    fichiers = {son["fichier"] for son in repertoire["sons"].values()}
    assert len(fichiers) == 1 and len(piper.textes_recus) == 1


def test_changer_la_voix_change_le_nom_du_fichier():
    assert fabrication.nom_du_fichier("Bravo !", "fr_FR-tom-medium", "32k") != fabrication.nom_du_fichier(
        "Bravo !", "fr_FR-autre-medium", "32k"
    )


def test_changer_le_debit_change_le_nom_du_fichier():
    assert fabrication.nom_du_fichier("Bravo !", VOIX, "32k") != fabrication.nom_du_fichier("Bravo !", VOIX, "48k")


def test_le_repertoire_relie_chaque_cle_a_son_fichier_et_sa_duree(tmp_path):
    repertoire = fabriquer(inventaire_de("Bravo !"), tmp_path, FauxPiper(duree_ms=1234))

    nom = fabrication.nom_du_fichier("Bravo !", VOIX, DEBIT)
    assert repertoire == {
        "voix": VOIX,
        "sons": {"bravo !": {"fichier": nom, "dureeMs": 1234}},
        "lecons": {},
    }


def test_le_repertoire_liste_les_sons_de_chaque_lecon_et_est_ecrit_en_json(tmp_path):
    inventaire = inventaire_de("Bravo !", "Bien joué !", lecons={"cp-lecture-01": ["bravo !", "bien joué !"]})

    fabriquer(inventaire, tmp_path, FauxPiper())

    ecrit = json.loads((tmp_path / "repertoire.json").read_text(encoding="utf-8"))
    assert ecrit["lecons"] == {
        "cp-lecture-01": [
            fabrication.nom_du_fichier("Bravo !", VOIX, DEBIT),
            fabrication.nom_du_fichier("Bien joué !", VOIX, DEBIT),
        ]
    }


def test_les_sons_d_une_lecon_sont_listes_une_seule_fois_dans_l_ordre_de_premiere_apparition(tmp_path):
    inventaire = inventaire_de(
        "Bravo !",
        "Vas-y !",
        "Va-z-i !",
        "Bien joué !",
        lecons={"cp-lecture-01": ["bravo !", "vas-y !", "bravo !", "va-z-i !", "bien joué !"]},
    )

    repertoire = fabriquer(inventaire, tmp_path, FauxPiper())

    assert repertoire["lecons"]["cp-lecture-01"] == [
        fabrication.nom_du_fichier(prononciation_corrigee("Bravo !"), VOIX, DEBIT),
        fabrication.nom_du_fichier(prononciation_corrigee("Vas-y !"), VOIX, DEBIT),
        fabrication.nom_du_fichier(prononciation_corrigee("Bien joué !"), VOIX, DEBIT),
    ]


def test_un_fichier_deja_fabrique_n_est_pas_refabrique_et_garde_sa_duree(tmp_path):
    inventaire = inventaire_de("Bravo !")
    fabriquer(inventaire, tmp_path, FauxPiper(duree_ms=1234))
    seconde_voix = FauxPiper(duree_ms=9999)

    repertoire = fabriquer(inventaire, tmp_path, seconde_voix)

    assert seconde_voix.textes_recus == []
    assert repertoire["sons"]["bravo !"]["dureeMs"] == 1234


def test_une_phrase_ajoutee_est_seule_fabriquee(tmp_path):
    fabriquer(inventaire_de("Bravo !"), tmp_path, FauxPiper())
    seconde_voix = FauxPiper()

    fabriquer(inventaire_de("Bravo !", "Bien joué !"), tmp_path, seconde_voix)

    assert seconde_voix.textes_recus == ["Bien joué !"]


def test_un_mp3_qui_ne_correspond_plus_a_aucune_phrase_est_supprime(tmp_path):
    fabriquer(inventaire_de("Bravo !", "Bien joué !"), tmp_path, FauxPiper())

    fabriquer(inventaire_de("Bravo !"), tmp_path, FauxPiper())

    assert [p.name for p in tmp_path.glob("*.mp3")] == [fabrication.nom_du_fichier("Bravo !", VOIX, DEBIT)]


def test_les_fichiers_qui_ne_sont_pas_des_mp3_sont_gardes(tmp_path):
    (tmp_path / "LICENCE-tom.txt").write_text("licence", encoding="utf-8")

    fabriquer(inventaire_de("Bravo !"), tmp_path, FauxPiper())

    assert (tmp_path / "LICENCE-tom.txt").read_text(encoding="utf-8") == "licence"
