"""Fabrication incrémentale des sons de phrases et répertoire des sons (#182).

La voix est injectée : `voix(texte, chemin)` écrit le MP3 et rend sa durée en millisecondes.
"""
import hashlib
import json
from pathlib import Path

from voix.prononciation import prononciation_corrigee

NOM_DU_REPERTOIRE = "repertoire.json"


def nom_du_fichier(prononciation, identifiant_voix, debit):
    empreinte = hashlib.sha256(f"{identifiant_voix}|{debit}|{prononciation}".encode("utf-8")).hexdigest()
    return f"{empreinte[:16]}.mp3"


def _durees_deja_connues(dossier):
    chemin = dossier / NOM_DU_REPERTOIRE
    if not chemin.exists():
        return {}
    anciens_sons = json.loads(chemin.read_text(encoding="utf-8")).get("sons", {})
    return {son["fichier"]: son["dureeMs"] for son in anciens_sons.values()}


def _supprimer_les_mp3_orphelins(dossier, fichiers_utiles):
    for mp3 in dossier.glob("*.mp3"):
        if mp3.name not in fichiers_utiles:
            mp3.unlink()


def fabriquer_les_sons(inventaire, dossier, voix, identifiant_voix="fr_FR-tom-medium", debit="32k"):
    dossier = Path(dossier)
    dossier.mkdir(parents=True, exist_ok=True)
    durees_connues = _durees_deja_connues(dossier)
    sons = {}
    fichiers_de_la_cle = {}
    for entree in inventaire["phrases"]:
        prononciation = prononciation_corrigee(entree["phrase"])
        nom = nom_du_fichier(prononciation, identifiant_voix, debit)
        if nom not in durees_connues or not (dossier / nom).exists():
            durees_connues[nom] = voix(prononciation, dossier / nom)
        sons[entree["cle"]] = {"fichier": nom, "dureeMs": durees_connues[nom]}
        fichiers_de_la_cle[entree["cle"]] = nom
    _supprimer_les_mp3_orphelins(dossier, {son["fichier"] for son in sons.values()})
    repertoire = {
        "voix": identifiant_voix,
        "sons": sons,
        "lecons": {
            lecon: [fichiers_de_la_cle[cle] for cle in cles] for lecon, cles in inventaire["lecons"].items()
        },
    }
    (dossier / NOM_DU_REPERTOIRE).write_text(
        json.dumps(repertoire, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return repertoire
