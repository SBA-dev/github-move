"""Adaptateur Piper en ligne de commande, exécuteur de commandes remplacé par un faux (story #182).

API attendue (scripts/voix/piper_en_ligne_de_commande.py) :
- LONGUEUR_LENTE : valeur de `--length-scale` pour l'allure lente. 1 / 0,65 (rythme du lecteur) ~ 1,54 ; fixée à 1,5.
- ErreurDeSynthese(Exception) : message qui nomme le texte de la phrase.
- PiperEnLigneDeCommande(modele, executable_piper, executable_ffmpeg, executer=...)
  .synthetiser(texte_envoye, chemin_mp3, allure) respecte le port `Piper`.
- executer(commande: list[str], *, entree: str | None = None) -> objet avec `.returncode` et `.stderr`.
"""
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest

RACINE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RACINE / "scripts"))

from voix.piper_en_ligne_de_commande import (  # noqa: E402
    LONGUEUR_LENTE,
    ErreurDeSynthese,
    PiperEnLigneDeCommande,
)


class ExecuteurFaux:
    def __init__(self, echoue_sur=None):
        self.appels = []
        self.echoue_sur = echoue_sur

    def __call__(self, commande, *, entree=None):
        self.appels.append((list(commande), entree))
        programme = Path(commande[0]).name
        if programme == self.echoue_sur:
            return SimpleNamespace(returncode=1, stderr="panne")
        if programme == "piper":
            Path(commande[commande.index("-f") + 1]).write_bytes(b"RIFF")
        else:
            Path(commande[-1]).write_bytes(b"MP3")
        return SimpleNamespace(returncode=0, stderr="")


def _adaptateur(executeur):
    return PiperEnLigneDeCommande(
        Path("voix/modele.onnx"), "piper", "ffmpeg", executer=executeur
    )


def test_une_phrase_normale_est_dite_par_piper_puis_encodee_en_mp3_mono_22050_hz_32_kbit_s(tmp_path):
    executeur = ExecuteurFaux()
    mp3 = tmp_path / "abc-12345678.mp3"

    _adaptateur(executeur).synthetiser("Bonjour les amis", mp3, "normale")

    (cmd_piper, entree), (cmd_ffmpeg, _) = executeur.appels
    assert entree == "Bonjour les amis"
    assert cmd_piper[0] == "piper"
    assert cmd_piper[cmd_piper.index("-m") + 1] == str(Path("voix/modele.onnx"))
    assert "--length-scale" not in cmd_piper
    assert cmd_ffmpeg[0] == "ffmpeg"
    assert cmd_ffmpeg[-1] == str(mp3)
    for option, valeur in (("-ac", "1"), ("-ar", "22050"), ("-b:a", "32k")):
        assert cmd_ffmpeg[cmd_ffmpeg.index(option) + 1] == valeur
    assert mp3.read_bytes() == b"MP3"


def test_le_wav_intermediaire_est_supprime(tmp_path):
    mp3 = tmp_path / "abc-12345678.mp3"

    _adaptateur(ExecuteurFaux()).synthetiser("Bonjour", mp3, "normale")

    assert sorted(p.name for p in tmp_path.iterdir()) == ["abc-12345678.mp3"]


def test_l_allure_lente_demande_a_piper_de_parler_plus_lentement(tmp_path):
    executeur = ExecuteurFaux()

    _adaptateur(executeur).synthetiser("chat", tmp_path / "abc-lente-12345678.mp3", "lente")

    cmd_piper = executeur.appels[0][0]
    assert LONGUEUR_LENTE > 1
    assert float(cmd_piper[cmd_piper.index("--length-scale") + 1]) == LONGUEUR_LENTE


@pytest.mark.parametrize("programme", ["piper", "ffmpeg"])
def test_un_echec_de_fabrication_nomme_la_phrase_et_ne_laisse_aucun_fichier(tmp_path, programme):
    mp3 = tmp_path / "abc-12345678.mp3"

    with pytest.raises(ErreurDeSynthese, match="Bonjour les amis"):
        _adaptateur(ExecuteurFaux(echoue_sur=programme)).synthetiser(
            "Bonjour les amis", mp3, "normale"
        )

    assert list(tmp_path.iterdir()) == []
