"""Commande de fabrication des phrases enregistrées, Piper remplacé par un faux (story #182).

API attendue (scripts/voix/commande_de_fabrication.py) :
- principal(arguments: list[str], *, piper) -> ResultatDeFabrication ; affiche un résumé
  « <n> fabriquées, <m> sautées » ; n'appelle jamais sys.exit.
- arguments : <phrases.json> --voix <nom> [--niveau <n>] [--lot <k>] [--dossier <d>]
  (dossier par défaut : public/voix, relatif au dossier courant).
- JSON : [{ cle, phrase, niveau, lecons, allures? }] ; "allures": ["normale", "lente"] marque la
  phrase `lente=True` (travail restant côté export Deno : produire ce champ pour les mots dictés).
"""
import json
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RACINE / "scripts"))

from voix.commande_de_fabrication import principal  # noqa: E402


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

    principal([fichier, "--voix", "modele-a", "--dossier", str(sortie)], piper=piper)

    assert sorted(texte for texte, _ in piper.appels) == ["Bonjour", "Merci"]
    repertoire = json.loads((sortie / "repertoire.json").read_text(encoding="utf-8"))
    assert repertoire["voixEnregistree"] == "modele-a"


def test_le_dossier_de_sortie_par_defaut_est_public_voix(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    fichier = _phrases(tmp_path, [_entree("Bonjour")])

    principal([fichier, "--voix", "modele-a"], piper=PiperFaux())

    assert (tmp_path / "public" / "voix" / "repertoire.json").is_file()


def test_l_option_niveau_ne_garde_que_les_phrases_de_ce_niveau(tmp_path):
    piper = PiperFaux()
    fichier = _phrases(tmp_path, [_entree("Bonjour", "CP"), _entree("Merci", "CE1")])

    principal([fichier, "--voix", "m", "--niveau", "CE1", "--dossier", str(tmp_path / "s")], piper=piper)

    assert [texte for texte, _ in piper.appels] == ["Merci"]


def test_l_option_lot_limite_le_nombre_de_phrases_fabriquees(tmp_path):
    piper = PiperFaux()
    fichier = _phrases(tmp_path, [_entree("Un"), _entree("Deux"), _entree("Trois")])

    resultat = principal([fichier, "--voix", "m", "--lot", "2", "--dossier", str(tmp_path / "s")], piper=piper)

    assert len(piper.appels) == 2
    assert resultat.fabriquees == 2


def test_les_phrases_dont_l_export_demande_l_allure_lente_sont_aussi_fabriquees_lentement(tmp_path):
    piper = PiperFaux()
    fichier = _phrases(
        tmp_path,
        [_entree("chat", allures=["normale", "lente"]), _entree("Bonjour", allures=["normale"])],
    )

    principal([fichier, "--voix", "m", "--dossier", str(tmp_path / "s")], piper=piper)

    assert sorted(piper.appels) == [("Bonjour", "normale"), ("chat", "lente"), ("chat", "normale")]


def test_la_commande_affiche_le_nombre_de_phrases_fabriquees_et_sautees(tmp_path, capsys):
    fichier = _phrases(tmp_path, [_entree("Bonjour"), _entree("Merci")])
    arguments = [fichier, "--voix", "m", "--dossier", str(tmp_path / "s")]
    principal(arguments, piper=PiperFaux())
    capsys.readouterr()

    principal(arguments, piper=PiperFaux())

    assert "0 fabriquées, 2 sautées" in capsys.readouterr().out
