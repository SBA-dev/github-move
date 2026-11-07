"""Fabrique les sons de phrases de l'application (#182) : `docs/voix.md`.

    VOIX_PIPER_MODELE=<modèle>.onnx python3 scripts/voix/fabriquer_les_sons.py [--inventaire inventaire.json]

Sans `--inventaire`, l'inventaire est produit par `deno run` (`inventaire-des-phrases.ts`).
"""
import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from voix.controles import verifier_les_sons  # noqa: E402
from voix.fabrication import fabriquer_les_sons  # noqa: E402

RACINE = Path(__file__).resolve().parents[2]
DOSSIER_DES_SONS = RACINE / "public" / "voix"
SCRIPT_D_INVENTAIRE = Path(__file__).with_name("inventaire-des-phrases.ts")


def rapport(inventaire, repertoire, dossier, deja_fabriques):
    sons_par_fichier = {son["fichier"]: son for son in repertoire["sons"].values()}
    fabriques = len(set(sons_par_fichier) - deja_fabriques)
    duree_s = sum(son["dureeMs"] for son in sons_par_fichier.values()) / 1000
    poids = sum((dossier / fichier).stat().st_size for fichier in sons_par_fichier)
    return (
        f"{len(inventaire['phrases'])} phrases, {len(sons_par_fichier)} sons "
        f"({fabriques} fabriqués, {len(sons_par_fichier) - fabriques} gardés), "
        f"durée totale {duree_s / 60:.1f} min, poids {poids / 1024 / 1024:.1f} Mo"
    )


def sans_les_phrases_muettes(inventaire):
    """Une phrase sans lettre ni chiffre (« ?. ») n'a rien à dire : Piper n'en tire aucun son."""
    a_dire = {phrase["cle"] for phrase in inventaire["phrases"] if re.search(r"\w", phrase["phrase"])}
    return {
        "phrases": [phrase for phrase in inventaire["phrases"] if phrase["cle"] in a_dire],
        "lecons": {lecon: [cle for cle in cles if cle in a_dire] for lecon, cles in inventaire["lecons"].items()},
    }


def inventaire_des_phrases(chemin):
    if chemin:
        return json.loads(Path(chemin).read_text(encoding="utf-8"))
    sortie = subprocess.run(
        ["deno", "run", "--allow-read", str(SCRIPT_D_INVENTAIRE)], check=True, capture_output=True, text=True
    ).stdout
    return json.loads(sortie)


def chemin_du_modele(argument):
    chemin = argument or os.environ.get("VOIX_PIPER_MODELE")
    if not chemin:
        raise SystemExit("Modèle de voix manquant : donnez --modele ou la variable VOIX_PIPER_MODELE (docs/voix.md).")
    if not Path(chemin).exists():
        raise SystemExit(f"Modèle de voix introuvable : {chemin}")
    return Path(chemin)


def _fichiers_deja_fabriques(dossier):
    return {mp3.name for mp3 in dossier.glob("*.mp3")}


def principal(arguments=None, voix=None):
    analyseur = argparse.ArgumentParser(description=__doc__)
    analyseur.add_argument("--modele", help="chemin du modèle .onnx (sinon VOIX_PIPER_MODELE)")
    analyseur.add_argument("--inventaire", help="inventaire JSON déjà produit (sinon lancé par deno)")
    options = analyseur.parse_args(arguments)
    if voix is None:
        from voix.voix_piper import VoixPiper

        voix = VoixPiper(chemin_du_modele(options.modele))
    inventaire = sans_les_phrases_muettes(inventaire_des_phrases(options.inventaire))
    deja_fabriques = _fichiers_deja_fabriques(DOSSIER_DES_SONS) if DOSSIER_DES_SONS.exists() else set()
    repertoire = fabriquer_les_sons(inventaire, DOSSIER_DES_SONS, voix)
    print(rapport(inventaire, repertoire, DOSSIER_DES_SONS, deja_fabriques))
    problemes = verifier_les_sons(inventaire, DOSSIER_DES_SONS)
    for probleme in problemes:
        print(f"PROBLÈME : {probleme}", file=sys.stderr)
    return 1 if problemes else 0


if __name__ == "__main__":
    sys.exit(principal())
