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


def test_un_octet_de_marque_d_ordre_des_octets_separe_les_phrases_comme_un_espace():
    phrases = phrases_avec_cle("Lis﻿le mot.﻿Puis oui")

    assert [(p.texte, p.cle) for p in phrases] == [
        ("Lis le mot.", "efcd4ab80d03473c"),
        ("Puis oui", "75ad212d1ea01c09"),
    ]


def test_un_separateur_de_fichier_n_est_pas_un_espace():
    phrases = phrases_avec_cle("Lis\x1cle mot. Puis oui")

    assert [(p.texte, p.cle) for p in phrases] == [
        ("Lis\x1cle mot.", "42457115c1500890"),
        ("Puis oui", "75ad212d1ea01c09"),
    ]


def test_une_lettre_accentuee_decomposee_donne_la_meme_cle_que_la_forme_composee():
    phrases = phrases_avec_cle("Café est bon.")

    assert [(p.texte, p.cle) for p in phrases] == [("Café est bon.", "be04a0dd5347355c")]
