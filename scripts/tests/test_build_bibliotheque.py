"""Helpers du pipeline : écriture des exercices et contrat du format des leçons (docs/format-lecons.md)."""
import json
import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

import build_bibliotheque as bb  # noqa: E402

LECONS = json.loads((SCRIPTS.parent / "app/bibliotheque.json").read_text(encoding="utf-8"))
EXERCICES_A_TROUS = [(l["id"], e) for l in LECONS for e in l["exercices"] if e["type"] == "trous"]


def test_un_trou_avec_un_distracteur_propose_deux_choix():
    exercice = bb.trous("t", "c", "Au clair de la [lune]", ["soleil"])

    assert bb.trous_sans_deux_choix(exercice) == []


def test_a_et_a_accentue_sont_deux_choix_differents():
    exercice = bb.trous("a ou à ?", "c", "Lina [a] un chat. Elle va [à] la piscine.", ["a", "à"])

    assert bb.trous_sans_deux_choix(exercice) == []


def test_les_autres_mots_attendus_comptent_parmi_les_candidats():
    exercice = bb.trous("t", "c", "Le [chat] et le [chien] dorment.")

    assert bb.trous_sans_deux_choix(exercice) == []


def test_un_trou_sans_autre_candidat_est_refuse():
    exercice = bb.trous("t", "c", "Au clair de la [lune]")

    assert bb.trous_sans_deux_choix(exercice) == ["lune"]


def test_un_distracteur_de_texte_identique_au_mot_attendu_n_est_pas_un_candidat():
    exercice = bb.trous("t", "c", "Au clair de la [lune]", ["lune"])

    assert bb.trous_sans_deux_choix(exercice) == ["lune"]


def test_deux_trous_du_meme_mot_n_offrent_pas_de_candidat():
    exercice = bb.trous("t", "c", "Il a [a] et elle a [a].")

    assert bb.trous_sans_deux_choix(exercice) == ["a", "a"]


@pytest.mark.parametrize("exercice", [e for _, e in EXERCICES_A_TROUS], ids=[i for i, _ in EXERCICES_A_TROUS])
def test_la_bibliotheque_ne_contient_aucun_trou_sans_deux_choix(exercice):
    assert bb.trous_sans_deux_choix(exercice) == []


def test_classer_recopie_l_aide_facultative_d_une_etiquette():
    exercice = bb.classer("t", "c", {"Mammifères": [("baleine", "Elle respire avec des poumons."), "chien"], "Poissons": ["thon"]})

    assert exercice["items"] == [
        {"texte": "baleine", "groupe": "1", "aide": "Elle respire avec des poumons."},
        {"texte": "chien", "groupe": "1"},
        {"texte": "thon", "groupe": "2"},
    ]


@pytest.mark.parametrize("nombre, refuse", [(20, False), (21, True)])
def test_un_classer_de_plus_de_20_etiquettes_est_refuse(nombre, refuse):
    exercice = bb.classer("t", "c", {"A": [f"a{i}" for i in range(nombre - 1)], "B": ["b"]})

    assert len(exercice["items"]) == nombre
    assert bb.a_trop_d_etiquettes(exercice) is refuse


@pytest.mark.parametrize("nombre, refuse", [(20, False), (21, True)])
def test_un_ordre_de_plus_de_20_elements_est_refuse(nombre, refuse):
    exercice = bb.ordre("t", "c", [f"e{i}" for i in range(nombre)])

    assert bb.a_trop_d_etiquettes(exercice) is refuse
