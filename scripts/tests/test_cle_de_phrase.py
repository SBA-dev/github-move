"""Clé de phrase du pipeline Python : identique à celle du domaine TypeScript (story #182).

Le jeu de cas est partagé avec le domaine : docs/voix/cas-des-cles-de-phrases.json.
"""
import json
import sys
from pathlib import Path

import pytest

RACINE = Path(__file__).resolve().parents[2]
SCRIPTS = RACINE / "scripts"
sys.path.insert(0, str(SCRIPTS))

from voix.cle_de_phrase import empreinte_fnv1a64, phrases_avec_cle  # noqa: E402

CAS = json.loads((RACINE / "docs/voix/cas-des-cles-de-phrases.json").read_text(encoding="utf-8"))


@pytest.mark.parametrize("cas", CAS, ids=[c["brut"] for c in CAS])
def test_les_phrases_et_leurs_cles_sont_celles_du_domaine(cas):
    attendu = [{"texte": p["texte"], "cle": p["cle"]} for p in cas["phrases"]]

    assert [{"texte": p.texte, "cle": p.cle} for p in phrases_avec_cle(cas["brut"])] == attendu


def test_l_empreinte_d_un_texte_vide_est_la_base_fnv_1a_64():
    assert empreinte_fnv1a64("") == "cbf29ce484222325"


def test_l_empreinte_de_la_lettre_a_est_celle_de_la_reference_fnv_1a_64():
    assert empreinte_fnv1a64("a") == "af63dc4c8601ec8c"
