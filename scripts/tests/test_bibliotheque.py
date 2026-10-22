"""Contrat de app/bibliotheque.json (format décrit dans docs/format-lecons.md)."""
import json
from pathlib import Path

import pytest

RACINE = Path(__file__).resolve().parents[2]
LECONS = json.loads((RACINE / "app/bibliotheque.json").read_text(encoding="utf-8"))
SECTIONS = {s["id"] for s in json.loads((RACINE / "app/programmes-index.json").read_text(encoding="utf-8"))}

MATIERES = {"francais", "maths", "sciences", "histoire", "anglais", "emc"}
NIVEAUX = {"CP", "CE1", "CE2", "CM1", "CM2"}
TYPES = {
    "bulles", "classer", "dictee", "ordre", "trous", "conjugaison", "lecture",
    "memoriser", "addition", "calcul", "fluence", "ecoute", "boite", "barres",
}
QUESTIONS_A_CHOIX = {"bulles", "lecture", "ecoute"}


def par_lecon():
    return pytest.mark.parametrize("lecon", LECONS, ids=[l["id"] for l in LECONS])


def test_chaque_lecon_a_un_identifiant_unique():
    ids = [l["id"] for l in LECONS]
    assert len(ids) == len(set(ids))


@par_lecon()
def test_une_lecon_a_une_matiere_et_un_niveau_connus(lecon):
    assert lecon["matiere"] in MATIERES
    assert lecon["niveau"] in NIVEAUX


@par_lecon()
def test_une_lecon_est_rattachee_a_une_section_du_programme_avec_sa_citation(lecon):
    assert lecon["programme"]["section"] in SECTIONS
    assert lecon["programme"]["citation"].strip()


@par_lecon()
def test_une_lecon_a_des_etapes_et_des_exercices_de_types_connus(lecon):
    assert lecon["lecon"]
    assert lecon["exercices"]
    assert {e["type"] for e in lecon["exercices"]} <= TYPES


@par_lecon()
def test_la_bonne_reponse_fait_partie_des_choix_proposes(lecon):
    questions = [q for e in lecon["exercices"] if e["type"] in QUESTIONS_A_CHOIX for q in e.get("questions", e.get("items", []))]
    assert all(q["reponse"] in q["choix"] for q in questions)


@par_lecon()
def test_dans_un_parcours_deux_lecons_n_ont_pas_le_meme_ordre(lecon):
    memes = [l for l in LECONS if (l["matiere"], l["niveau"], l["ordre"]) == (lecon["matiere"], lecon["niveau"], lecon["ordre"])]
    assert len(memes) == 1
