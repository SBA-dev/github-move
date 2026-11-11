"""Adaptateur Piper en ligne de commande : Piper dit la phrase en WAV, ffmpeg l'encode en MP3 (story #182)."""
import subprocess
from pathlib import Path

# Piper allonge les sons par ce facteur : 1 / 0,65 (rythme lent du lecteur) ~ 1,54, arrondi à 1,5.
LONGUEUR_LENTE = 1.5


class ErreurDeSynthese(Exception):
    def __init__(self, texte, detail):
        super().__init__(f"Synthèse impossible pour la phrase « {texte} » : {detail}")


def _executer_dans_un_sous_processus(commande, *, entree=None):
    return subprocess.run(commande, input=entree, capture_output=True, text=True)


class PiperEnLigneDeCommande:
    def __init__(self, modele, executable_piper, executable_ffmpeg, executer=_executer_dans_un_sous_processus):
        self._modele = Path(modele)
        self._piper = str(executable_piper)
        self._ffmpeg = str(executable_ffmpeg)
        self._executer = executer

    def synthetiser(self, texte_envoye, chemin_mp3, allure):
        mp3 = Path(chemin_mp3)
        wav = mp3.with_suffix(".wav")
        try:
            self._lancer(texte_envoye, self._commande_piper(wav, allure), texte_envoye)
            self._lancer(texte_envoye, self._commande_ffmpeg(wav, mp3))
        except ErreurDeSynthese:
            mp3.unlink(missing_ok=True)
            raise
        finally:
            wav.unlink(missing_ok=True)

    def _commande_piper(self, wav, allure):
        commande = [self._piper, "-m", str(self._modele), "-f", str(wav)]
        if allure == "lente":
            commande += ["--length-scale", str(LONGUEUR_LENTE)]
        return commande

    def _commande_ffmpeg(self, wav, mp3):
        return [
            self._ffmpeg, "-nostdin", "-y", "-loglevel", "error", "-i", str(wav),
            "-ac", "1", "-ar", "22050", "-b:a", "32k", str(mp3),
        ]

    def _lancer(self, texte, commande, entree=None):
        resultat = self._executer(commande, entree=entree)
        if resultat.returncode != 0:
            raise ErreurDeSynthese(texte, resultat.stderr)
