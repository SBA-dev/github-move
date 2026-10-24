"""Helpers du pipeline : écriture des exercices et contrat du format des leçons (docs/format-lecons.md)."""
import json
import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

import build_bibliotheque as bb  # noqa: E402

LECONS = json.loads((SCRIPTS.parent / "app/bibliotheque.json").read_text(encoding="utf-8"))
CONJUGAISONS = [(l["id"], e) for l in LECONS for e in l["exercices"] if e["type"] == "conjugaison"]
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


def test_conjugaison_de_six_couples_garde_les_pronoms_donnes():
    couples = [("j'", "ai mangé"), ("tu", "as mangé"), ("il", "a mangé"), ("nous", "avons mangé"), ("vous", "avez mangé"), ("ils", "ont mangé")]

    exercice = bb.conjugaison("manger", "passé composé", couples)

    assert exercice["formes"][0] == {"pronom": "j'", "forme": "ai mangé"}


def test_conjugaison_de_six_textes_applique_les_pronoms_par_defaut():
    textes = ["mange", "manges", "mange", "mangeons", "mangez", "mangent"]

    exercice = bb.conjugaison("manger", "présent", textes)

    assert [f["pronom"] for f in exercice["formes"]] == ["je", "tu", "il", "nous", "vous", "ils"]
    assert exercice["formes"][3]["forme"] == "mangeons"


def test_conjugaison_de_moins_de_six_couples_garde_les_couples():
    exercice = bb.conjugaison("manger", "impératif", [("tu", "mange"), ("nous", "mangeons")])

    assert exercice["formes"] == [{"pronom": "tu", "forme": "mange"}, {"pronom": "nous", "forme": "mangeons"}]


@pytest.mark.parametrize("forme", [{"pronom": "je", "forme": ["j'", "ai mangé"]}, {"pronom": "je", "forme": ""}, {"pronom": ["je"], "forme": "mange"}])
def test_une_forme_qui_n_est_pas_un_texte_non_vide_est_mal_formee(forme):
    exercice = {"type": "conjugaison", "formes": [forme]}

    assert bb.formes_mal_formees(exercice) == [forme]


def test_une_forme_bien_formee_est_acceptee():
    exercice = {"type": "conjugaison", "formes": [{"pronom": "j'", "forme": "ai mangé"}]}

    assert bb.formes_mal_formees(exercice) == []


@pytest.mark.parametrize("exercice", [e for _, e in CONJUGAISONS], ids=[i for i, _ in CONJUGAISONS])
def test_la_bibliotheque_ne_contient_aucune_conjugaison_a_forme_mal_formee(exercice):
    assert bb.formes_mal_formees(exercice) == []
