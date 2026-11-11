"""Commande de fabrication des phrases enregistrées, Piper remplacé par un faux (story #182).

API attendue (scripts/voix/commande_de_fabrication.py) :
- principal(arguments: list[str], *, piper) -> ResultatDeFabrication ; affiche un résumé
  « <n> fabriquées, <m> sautées » ; n'appelle jamais sys.exit.
- arguments : <phrases.json> --voix <nom> [--niveau <n>] [--lot <k>] [--dossier <d>]
  (dossier par défaut : public/voix, relatif au dossier courant).
- principal(..., table=TABLE_DE_PRONONCIATION) : la table est appliquée au texte envoyé à Piper ; elle est
  vérifiée sur TOUTE la liste (RemplacementSansEffet) et ses exemples (ExempleDePrononciationEnEchec, avant tout appel à Piper).
- JSON : [{ cle, phrase, niveau, lecons, allures? }] ; "allures": ["normale", "lente"] marque la
  phrase `lente=True` (travail restant côté export Deno : produire ce champ pour les mots dictés).
"""
import inspect
import json
import sys
from pathlib import Path

import pytest

RACINE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RACINE / "scripts"))

from voix.commande_de_fabrication import principal  # noqa: E402
from voix.table_de_prononciation import (  # noqa: E402
    EntreeDePrononciation,
    ExempleDePrononciationEnEchec,
    RemplacementSansEffet,
    TABLE_DE_PRONONCIATION,
)


class PiperFaux:
    def __init__(self):
        self.appels = []

    def synthetiser(self, texte_envoye, chemin_mp3, allure):
        self.appels.append((texte_envoye, allure))
        Path(chemin_mp3).write_bytes(b"MP3")


def _phrases(tmp_path, entrees):
    chemin = tmp_path / "phrases.json"
    chemin.write_text(json.dumps(entrees), encoding="utf-8")
    return str(chemin)


def _entree(phrase, niveau="CP", **en_plus):
    return {"cle": "x", "phrase": phrase, "niveau": niveau, "lecons": ["l1"], **en_plus}


def test_la_commande_fabrique_les_phrases_du_fichier_dans_le_dossier_donne(tmp_path):
    piper = PiperFaux()
    fichier = _phrases(tmp_path, [_entree("Bonjour"), _entree("Merci")])
    sortie = tmp_path / "sortie"

    principal([fichier, "--voix", "modele-a", "--dossier", str(sortie)], piper=piper, table=[])

    assert sorted(texte for texte, _ in piper.appels) == ["Bonjour", "Merci"]
    repertoire = json.loads((sortie / "repertoire.json").read_text(encoding="utf-8"))
    assert repertoire["voixEnregistree"] == "modele-a"


def test_le_dossier_de_sortie_par_defaut_est_public_voix(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    fichier = _phrases(tmp_path, [_entree("Bonjour")])

    principal([fichier, "--voix", "modele-a"], piper=PiperFaux(), table=[])

    assert (tmp_path / "public" / "voix" / "repertoire.json").is_file()


def test_l_option_niveau_ne_garde_que_les_phrases_de_ce_niveau(tmp_path):
    piper = PiperFaux()
    fichier = _phrases(tmp_path, [_entree("Bonjour", "CP"), _entree("Merci", "CE1")])

    principal([fichier, "--voix", "m", "--niveau", "CE1", "--dossier", str(tmp_path / "s")], piper=piper, table=[])

    assert [texte for texte, _ in piper.appels] == ["Merci"]


def test_l_option_lot_limite_le_nombre_de_phrases_fabriquees(tmp_path):
    piper = PiperFaux()
    fichier = _phrases(tmp_path, [_entree("Un"), _entree("Deux"), _entree("Trois")])

    resultat = principal([fichier, "--voix", "m", "--lot", "2", "--dossier", str(tmp_path / "s")], piper=piper, table=[])

    assert len(piper.appels) == 2
    assert resultat.fabriquees == 2


def test_les_phrases_dont_l_export_demande_l_allure_lente_sont_aussi_fabriquees_lentement(tmp_path):
    piper = PiperFaux()
    fichier = _phrases(
        tmp_path,
        [_entree("chat", allures=["normale", "lente"]), _entree("Bonjour", allures=["normale"])],
    )

    principal([fichier, "--voix", "m", "--dossier", str(tmp_path / "s")], piper=piper, table=[])

    assert sorted(piper.appels) == [("Bonjour", "normale"), ("chat", "lente"), ("chat", "normale")]


def test_la_commande_affiche_le_nombre_de_phrases_fabriquees_et_sautees(tmp_path, capsys):
    fichier = _phrases(tmp_path, [_entree("Bonjour"), _entree("Merci")])
    arguments = [fichier, "--voix", "m", "--dossier", str(tmp_path / "s")]
    principal(arguments, piper=PiperFaux(), table=[])
    capsys.readouterr()

    principal(arguments, piper=PiperFaux(), table=[])

    assert "0 fabriquées, 2 sautées" in capsys.readouterr().out


def _sortie(tmp_path):
    return str(tmp_path / "s")


def test_la_table_appliquee_par_defaut_est_la_table_de_prononciation_du_module():
    table_par_defaut = inspect.signature(principal).parameters["table"].default

    assert table_par_defaut is TABLE_DE_PRONONCIATION


def test_une_entree_de_la_table_sans_effet_sur_la_liste_complete_fait_echouer_la_fabrication_meme_avec_le_filtre_niveau(tmp_path):
    table = [EntreeDePrononciation("absent", "présent", "Un absent.", "Un présent.")]
    fichier = _phrases(tmp_path, [_entree("Bonjour", "CP"), _entree("Merci", "CE1")])

    with pytest.raises(RemplacementSansEffet):
        principal([fichier, "--voix", "m", "--niveau", "CE1", "--dossier", _sortie(tmp_path)], piper=PiperFaux(), table=table)


def test_une_entree_qui_ne_vise_que_des_phrases_filtrees_ne_fait_pas_echouer_la_fabrication(tmp_path):
    piper = PiperFaux()
    table = [EntreeDePrononciation("absent", "présent", "Un absent.", "Un présent.")]
    fichier = _phrases(tmp_path, [_entree("Un absent.", "CP"), _entree("Merci", "CE1")])

    principal([fichier, "--voix", "m", "--niveau", "CE1", "--dossier", _sortie(tmp_path)], piper=piper, table=table)

    assert [texte for texte, _ in piper.appels] == ["Merci"]


def test_une_entree_dont_l_exemple_echoue_arrete_la_fabrication_avant_tout_appel_a_la_voix(tmp_path):
    piper = PiperFaux()
    table = [EntreeDePrononciation("absent", "présent", "Un absent.", "Un autre texte.")]
    fichier = _phrases(tmp_path, [_entree("Un absent.")])

    with pytest.raises(ExempleDePrononciationEnEchec):
        principal([fichier, "--voix", "m", "--dossier", _sortie(tmp_path)], piper=piper, table=table)

    assert piper.appels == []
