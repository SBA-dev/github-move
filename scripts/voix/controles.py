"""Contrôles du répertoire des sons de phrases (#182)."""
import json

from voix.fabrication import NOM_DU_REPERTOIRE, nom_du_fichier
from voix.prononciation import prononciation_corrigee

NOM_DE_LA_LICENCE = "LICENCE-tom.txt"
MENTIONS_DE_LA_LICENCE = ("Tjiho", "AGPL")


def _problemes_de_licence(dossier):
    chemin = dossier / NOM_DE_LA_LICENCE
    if not chemin.exists():
        return [f"{NOM_DE_LA_LICENCE} est absente"]
    texte = chemin.read_text(encoding="utf-8")
    return [f"{NOM_DE_LA_LICENCE} ne cite pas {mention}" for mention in MENTIONS_DE_LA_LICENCE if mention not in texte]


def _problemes_du_son(phrase, son, dossier, voix, debit):
    cle = phrase["cle"]
    if son is None or not (dossier / son["fichier"]).exists():
        return [f"son manquant pour la clé {cle}"]
    attendu = nom_du_fichier(prononciation_corrigee(phrase["phrase"]), voix, debit)
    if son["fichier"] != attendu:
        return [f"empreinte incohérente pour la clé {cle} : {son['fichier']} au lieu de {attendu}"]
    return []


def verifier_les_sons(inventaire, dossier, plafond_octets=40 * 1024 * 1024, debit="32k"):
    repertoire = json.loads((dossier / NOM_DU_REPERTOIRE).read_text(encoding="utf-8"))
    sons = repertoire["sons"]
    problemes = []
    for phrase in inventaire["phrases"]:
        problemes += _problemes_du_son(phrase, sons.get(phrase["cle"]), dossier, repertoire["voix"], debit)
    references = {son["fichier"] for son in sons.values()}
    mp3 = list(dossier.glob("*.mp3"))
    problemes += [f"mp3 orphelin : {fichier.name}" for fichier in mp3 if fichier.name not in references]
    if sum(fichier.stat().st_size for fichier in mp3) > plafond_octets:
        problemes.append(f"le dossier dépasse le plafond de {plafond_octets} octets")
    return problemes + _problemes_de_licence(dossier)
