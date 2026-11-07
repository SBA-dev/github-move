"""Voix réelle de la fabrication : Piper (voix « tom ») puis ffmpeg (#182).

Adaptateur sans règle : `VoixPiper(modele)(texte, chemin)` écrit le MP3 et rend sa durée en millisecondes.
Le modèle n'est jamais dans le dépôt (licence AGPLv3, décision 0043).
"""
import subprocess
import tempfile
import wave
from pathlib import Path

FREQUENCE_HZ = "22050"
DEBIT_MP3 = "32k"


class VoixPiper:
    def __init__(self, modele: Path):
        from piper import PiperVoice  # import paresseux : seuls la fabrication réelle et ce module en dépendent

        self._voix = PiperVoice.load(str(modele))

    def __call__(self, texte, chemin):
        with tempfile.TemporaryDirectory() as dossier:
            wav = Path(dossier) / "phrase.wav"
            with wave.open(str(wav), "wb") as fichier:
                self._voix.synthesize_wav(texte, fichier)
            _convertir_en_mp3(wav, Path(chemin))
        return _duree_en_ms(Path(chemin))


def _convertir_en_mp3(wav, mp3):
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav),
         "-ac", "1", "-ar", FREQUENCE_HZ, "-b:a", DEBIT_MP3, str(mp3)],
        check=True,
    )


def _duree_en_ms(mp3):
    sortie = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp3)],
        check=True, capture_output=True, text=True,
    ).stdout
    return round(float(sortie) * 1000)
