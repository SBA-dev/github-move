"""Commande de fabrication des phrases enregistrées (story #182).

Exemple : python3 scripts/voix/commande_de_fabrication.py phrases.json --voix <nom> --modele <chemin.onnx> --niveau commun --lot 50
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from voix.fabrication_des_phrases import NORMALE, LENTE, PhraseAFabriquer, fabriquer_les_phrases  # noqa: E402
from voix.piper_en_ligne_de_commande import PiperEnLigneDeCommande  # noqa: E402


def _lire_les_arguments(arguments):
    analyseur = argparse.ArgumentParser(description="Fabrique les MP3 des phrases enregistrées.")
    analyseur.add_argument("phrases")
    analyseur.add_argument("--voix", required=True)
    analyseur.add_argument("--niveau")
    analyseur.add_argument("--lot", type=int)
    analyseur.add_argument("--dossier", default="public/voix")
    return analyseur.parse_args(arguments)


def _phrases_a_fabriquer(chemin, niveau):
    entrees = json.loads(Path(chemin).read_text(encoding="utf-8"))
    return [
        PhraseAFabriquer(entree["phrase"], lente=LENTE in entree.get("allures", [NORMALE]))
        for entree in entrees
        if niveau is None or entree["niveau"] == niveau
    ]


def principal(arguments, *, piper):
    choix = _lire_les_arguments(arguments)
    resultat = fabriquer_les_phrases(
        _phrases_a_fabriquer(choix.phrases, choix.niveau),
        piper=piper,
        dossier=choix.dossier,
        voix_enregistree=choix.voix,
        lot=choix.lot,
    )
    print(f"{resultat.fabriquees} fabriquées, {resultat.sautees} sautées")
    return resultat


if __name__ == "__main__":
    complement = argparse.ArgumentParser(add_help=False)
    complement.add_argument("--modele", required=True)
    complement.add_argument("--piper", default="piper")
    complement.add_argument("--ffmpeg", default="ffmpeg")
    voix, restant = complement.parse_known_args()
    principal(restant, piper=PiperEnLigneDeCommande(voix.modele, voix.piper, voix.ffmpeg))
