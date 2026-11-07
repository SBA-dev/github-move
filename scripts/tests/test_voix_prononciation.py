"""Table de prononciation : elle change ce que dit la voix, jamais le sens (#182)."""
import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

from voix import prononciation  # noqa: E402
from voix.prononciation import EntreeDePrononciation  # noqa: E402


def entree(cherche, envoye, exemple, attendu):
    return EntreeDePrononciation(cherche=cherche, envoye=envoye, exemple=exemple, attendu=attendu)


def test_une_phrase_sans_entree_concernee_est_rendue_telle_quelle():
    phrase = "Bravo, tu as trouvé la bonne réponse !"

    assert prononciation.prononciation_corrigee(phrase) == phrase


def test_vas_y_est_envoye_a_la_voix_sous_une_graphie_qui_se_lit_bien():
    corrigee = prononciation.prononciation_corrigee("Allez, vas-y, tu peux commencer.")

    assert corrigee == "Allez, va-z-i, tu peux commencer."


def test_la_casse_du_debut_de_phrase_est_respectee():
    corrigee = prononciation.prononciation_corrigee("Vas-y, essaie encore !")

    assert corrigee == "Va-z-i, essaie encore !"


def test_un_mot_cherche_n_est_pas_remplace_au_milieu_d_un_autre_mot():
    table = [entree("cap", "kap", "Un cap.", "Un kap.")]

    assert prononciation.prononciation_corrigee("Un capitaine, un cap.", table) == "Un capitaine, un kap."


def test_la_liaison_de_tu_vas_y_arriver_n_est_pas_corrigee():
    phrase = "Tu vas y arriver !"

    assert prononciation.prononciation_corrigee(phrase) == phrase


def test_une_entree_qui_ajoute_un_mot_est_refusee():
    table = [entree("vas-y", "va-z-i vite", "Vas-y.", "Va-z-i vite.")]

    with pytest.raises(ValueError, match="ajoute"):
        prononciation.verifier_la_table(table)


def test_une_entree_dont_l_exemple_ne_donne_pas_la_prononciation_attendue_est_refusee():
    table = [entree("vas-y", "va-z-i", "Vas-y.", "Vazi.")]

    with pytest.raises(ValueError, match="exemple"):
        prononciation.verifier_la_table(table)


def test_la_table_livree_respecte_ses_garde_fous():
    prononciation.verifier_la_table(prononciation.TABLE)


def test_la_table_livree_connait_vas_y():
    assert any(e.cherche == "vas-y" for e in prononciation.TABLE)
