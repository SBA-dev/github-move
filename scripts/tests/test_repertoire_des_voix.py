"""Répertoire des voix : cohérence entre public/voix/repertoire.json et les MP3 fabriqués (story #182)."""
import json
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RACINE / "scripts"))

from voix.fabrication_des_phrases import _nom_du_mp3  # noqa: E402

DOSSIER = RACINE / "public" / "voix"
BUDGET_EN_OCTETS = 45_000_000


def _noms_references():
    phrases = json.loads((DOSSIER / "repertoire.json").read_text(encoding="utf-8"))["phrases"]
    noms = set()
    for cle, empreintes in phrases.items():
        noms.add(_nom_du_mp3(cle, empreintes["normale"], "normale"))
        if empreintes.get("lente") is not None:
            noms.add(_nom_du_mp3(cle, empreintes["lente"], "lente"))
    return noms


def test_chaque_mp3_du_repertoire_existe_dans_public_voix():
    noms = _noms_references()

    assert noms, "le répertoire ne référence aucun MP3"
    assert sorted(nom for nom in noms if not (DOSSIER / nom).is_file()) == []


def test_chaque_mp3_present_dans_public_voix_est_reference_par_le_repertoire():
    presents = {fichier.name for fichier in DOSSIER.glob("*.mp3")}

    assert sorted(presents - _noms_references()) == []


def test_public_voix_ne_depasse_pas_le_budget_de_poids():
    poids = sum(fichier.stat().st_size for fichier in DOSSIER.glob("*.mp3"))

    assert poids <= BUDGET_EN_OCTETS
