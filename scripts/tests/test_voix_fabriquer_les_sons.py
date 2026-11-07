"""Commande de fabrication des sons (#182) : rapport, modèle manquant, code de sortie.

La colle Piper / ffmpeg (`voix/voix_piper.py`) n'a pas de règle : elle n'a pas de test unitaire,
elle est exercée par la fabrication réelle (`docs/voix.md`).
"""
import json
import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

from voix import fabriquer_les_sons as commande  # noqa: E402

INVENTAIRE = {
    "phrases": [{"cle": "Bravo !", "phrase": "Bravo !"}, {"cle": "Encore !", "phrase": "Encore !"}],
    "lecons": {"cp-1": ["Bravo !", "Encore !"]},
}


def voix_factice(texte, chemin):
    Path(chemin).write_bytes(b"x" * 1024)
    return 1500


def test_sans_modele_le_message_dit_quoi_donner(monkeypatch):
    monkeypatch.delenv("VOIX_PIPER_MODELE", raising=False)
    with pytest.raises(SystemExit, match="VOIX_PIPER_MODELE"):
        commande.chemin_du_modele(None)


def test_un_modele_introuvable_est_signale(tmp_path):
    with pytest.raises(SystemExit, match="introuvable"):
        commande.chemin_du_modele(str(tmp_path / "absent.onnx"))


def test_le_modele_vient_de_la_variable_d_environnement(monkeypatch, tmp_path):
    modele = tmp_path / "tom.onnx"
    modele.write_bytes(b"")
    monkeypatch.setenv("VOIX_PIPER_MODELE", str(modele))
    assert commande.chemin_du_modele(None) == modele


def test_le_rapport_compte_fabriques_gardes_duree_et_poids(tmp_path):
    from voix.fabrication import fabriquer_les_sons

    repertoire = fabriquer_les_sons(INVENTAIRE, tmp_path, voix_factice)
    gardes = {repertoire["sons"]["Bravo !"]["fichier"]}
    texte = commande.rapport(INVENTAIRE, repertoire, tmp_path, gardes)
    assert "2 phrases" in texte
    assert "1 fabriqués, 1 gardés" in texte
    assert "durée totale 0.1 min" in texte
    assert "poids 0.0 Mo" in texte


def test_la_commande_echoue_quand_un_controle_echoue(tmp_path, monkeypatch, capsys):
    inventaire = tmp_path / "inventaire.json"
    inventaire.write_text(json.dumps(INVENTAIRE), encoding="utf-8")
    monkeypatch.setattr(commande, "DOSSIER_DES_SONS", tmp_path / "voix")  # sans licence : le contrôle échoue
    code = commande.principal(["--inventaire", str(inventaire)], voix=voix_factice)
    assert code == 1
    assert "LICENCE-tom.txt est absente" in capsys.readouterr().err


def test_la_commande_reussit_quand_tout_est_conforme(tmp_path, monkeypatch, capsys):
    inventaire = tmp_path / "inventaire.json"
    inventaire.write_text(json.dumps(INVENTAIRE), encoding="utf-8")
    dossier = tmp_path / "voix"
    dossier.mkdir()
    (dossier / "LICENCE-tom.txt").write_text("Tjiho, AGPL", encoding="utf-8")
    monkeypatch.setattr(commande, "DOSSIER_DES_SONS", dossier)
    assert commande.principal(["--inventaire", str(inventaire)], voix=voix_factice) == 0
    assert "2 phrases" in capsys.readouterr().out

