"""Contrôles du répertoire des sons de phrases (#182).

API attendue (module `voix/controles.py`) :
- `verifier_les_sons(inventaire, dossier, plafond_octets=40 * 1024 * 1024, debit="32k") -> list[str]`
  - `inventaire` : `{"phrases": [{"cle", "phrase"}], "lecons": {...}}` (comme `fabriquer_les_sons`) ;
  - lit `<dossier>/repertoire.json`, la licence `<dossier>/LICENCE-tom.txt` et les `.mp3` du dossier ;
  - rend la liste des problèmes (phrases de texte lisible), vide si tout va bien.
"""
import json
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

from voix import controles, fabrication  # noqa: E402
from voix.prononciation import prononciation_corrigee  # noqa: E402

LICENCE = "Voix fr_FR-tom-medium, auteur : Tjiho. Licence AGPLv3."

INVENTAIRE = {
    "phrases": [
        {"cle": "bonjour-le-soleil", "phrase": "Bonjour le soleil"},
        {"cle": "le-chat-dort", "phrase": "Le chat dort"},
    ],
    "lecons": {"lecon-1": ["bonjour-le-soleil", "le-chat-dort"]},
}


def faux_piper(texte, chemin):
    Path(chemin).write_bytes(b"mp3:" + texte.encode("utf-8"))
    return 1200


def dossier_conforme(tmp_path):
    fabrication.fabriquer_les_sons(INVENTAIRE, tmp_path, faux_piper)
    (tmp_path / "LICENCE-tom.txt").write_text(LICENCE, encoding="utf-8")
    return tmp_path


def lire_repertoire(dossier):
    return json.loads((dossier / "repertoire.json").read_text(encoding="utf-8"))


def ecrire_repertoire(dossier, repertoire):
    (dossier / "repertoire.json").write_text(json.dumps(repertoire), encoding="utf-8")


def test_un_dossier_conforme_n_a_aucun_probleme(tmp_path):
    dossier = dossier_conforme(tmp_path)

    assert controles.verifier_les_sons(INVENTAIRE, dossier) == []


def test_une_phrase_de_l_inventaire_absente_du_repertoire_est_un_son_manquant(tmp_path):
    dossier = dossier_conforme(tmp_path)
    repertoire = lire_repertoire(dossier)
    del repertoire["sons"]["le-chat-dort"]
    ecrire_repertoire(dossier, repertoire)

    problemes = controles.verifier_les_sons(INVENTAIRE, dossier)

    assert any("le-chat-dort" in probleme for probleme in problemes)


def test_un_son_dont_le_fichier_n_existe_pas_est_un_son_manquant(tmp_path):
    dossier = dossier_conforme(tmp_path)
    fichier = lire_repertoire(dossier)["sons"]["bonjour-le-soleil"]["fichier"]
    (dossier / fichier).unlink()

    problemes = controles.verifier_les_sons(INVENTAIRE, dossier)

    assert any("bonjour-le-soleil" in probleme for probleme in problemes)


def test_un_mp3_que_le_repertoire_ne_reference_pas_est_un_orphelin(tmp_path):
    dossier = dossier_conforme(tmp_path)
    (dossier / "0000000000000000.mp3").write_bytes(b"mp3")

    problemes = controles.verifier_les_sons(INVENTAIRE, dossier)

    assert any("0000000000000000.mp3" in probleme for probleme in problemes)


def test_un_dossier_plus_lourd_que_le_plafond_est_un_probleme(tmp_path):
    dossier = dossier_conforme(tmp_path)
    taille_totale = sum(mp3.stat().st_size for mp3 in dossier.glob("*.mp3"))

    problemes = controles.verifier_les_sons(INVENTAIRE, dossier, plafond_octets=taille_totale - 1)

    assert any("plafond" in probleme.lower() for probleme in problemes)


def test_un_dossier_au_plafond_exact_n_a_pas_de_probleme(tmp_path):
    dossier = dossier_conforme(tmp_path)
    taille_totale = sum(mp3.stat().st_size for mp3 in dossier.glob("*.mp3"))

    assert controles.verifier_les_sons(INVENTAIRE, dossier, plafond_octets=taille_totale) == []


def test_une_licence_absente_est_un_probleme(tmp_path):
    dossier = dossier_conforme(tmp_path)
    (dossier / "LICENCE-tom.txt").unlink()

    problemes = controles.verifier_les_sons(INVENTAIRE, dossier)

    assert any("LICENCE-tom.txt" in probleme for probleme in problemes)


def test_une_licence_qui_ne_cite_pas_l_auteur_est_un_probleme(tmp_path):
    dossier = dossier_conforme(tmp_path)
    (dossier / "LICENCE-tom.txt").write_text("Licence AGPLv3.", encoding="utf-8")

    problemes = controles.verifier_les_sons(INVENTAIRE, dossier)

    assert any("Tjiho" in probleme for probleme in problemes)


def test_une_licence_qui_ne_cite_pas_l_agpl_est_un_probleme(tmp_path):
    dossier = dossier_conforme(tmp_path)
    (dossier / "LICENCE-tom.txt").write_text("Voix de Tjiho.", encoding="utf-8")

    problemes = controles.verifier_les_sons(INVENTAIRE, dossier)

    assert any("AGPL" in probleme for probleme in problemes)


def test_un_fichier_dont_le_nom_n_est_pas_l_empreinte_de_sa_phrase_est_un_probleme(tmp_path):
    dossier = dossier_conforme(tmp_path)
    repertoire = lire_repertoire(dossier)
    ancien_nom = repertoire["sons"]["le-chat-dort"]["fichier"]
    nom_edite = "ffffffffffffffff.mp3"
    (dossier / ancien_nom).rename(dossier / nom_edite)
    repertoire["sons"]["le-chat-dort"]["fichier"] = nom_edite
    ecrire_repertoire(dossier, repertoire)

    problemes = controles.verifier_les_sons(INVENTAIRE, dossier)

    assert any("le-chat-dort" in probleme and "empreinte" in probleme for probleme in problemes)


def test_un_son_fabrique_avec_un_autre_debit_n_a_pas_la_bonne_empreinte(tmp_path):
    dossier = dossier_conforme(tmp_path)

    problemes = controles.verifier_les_sons(INVENTAIRE, dossier, debit="48k")

    assert any("empreinte" in probleme for probleme in problemes)


def test_l_empreinte_attendue_vient_de_la_prononciation_corrigee(tmp_path):
    dossier = dossier_conforme(tmp_path)
    attendu = fabrication.nom_du_fichier(
        prononciation_corrigee("Le chat dort"), "fr_FR-tom-medium", "32k"
    )

    assert lire_repertoire(dossier)["sons"]["le-chat-dort"]["fichier"] == attendu
    assert controles.verifier_les_sons(INVENTAIRE, dossier) == []
