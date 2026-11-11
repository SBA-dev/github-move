"""Table de prononciation du pipeline : ne change que le texte envoyé à la voix (story #182).

Convention : une entrée porte la casse exacte de son motif (« vas-y » et « Vas-y » sont deux entrées).
"""
import sys
from pathlib import Path

import pytest

RACINE = Path(__file__).resolve().parents[2]
SCRIPTS = RACINE / "scripts"
sys.path.insert(0, str(SCRIPTS))

from voix.cle_de_phrase import empreinte_fnv1a64, phrases_avec_cle  # noqa: E402
from voix.table_de_prononciation import (  # noqa: E402
    TABLE_DE_PRONONCIATION,
    EntreeDePrononciation,
    RemplacementSansEffet,
    exemples_en_echec,
    texte_envoye_a_la_voix,
    verifier_la_table,
)


def entree(motif, remplacement, exemple, attendu):
    return EntreeDePrononciation(
        motif=motif, remplacement=remplacement, exemple=exemple, texte_attendu=attendu
    )


VAS_Y = entree("vas-y", "va-zi", "Allez, vas-y.", "Allez, va-zi.")
CP = entree("CP", "cé pé", "Je suis au CP.", "Je suis au cé pé.")


def test_une_entree_remplace_le_mot_entier_dans_la_phrase():
    assert texte_envoye_a_la_voix("Essaie encore, vas-y.", [VAS_Y]) == "Essaie encore, va-zi."


def test_une_entree_est_sensible_a_la_casse():
    assert texte_envoye_a_la_voix("Vas-y, essaie encore.", [VAS_Y]) == "Vas-y, essaie encore."


def test_une_phrase_sans_motif_est_envoyee_telle_quelle():
    assert texte_envoye_a_la_voix("Lis le mot.", [VAS_Y, CP]) == "Lis le mot."


def test_un_motif_n_agit_pas_a_l_interieur_d_un_autre_mot():
    assert texte_envoye_a_la_voix("Le CPE et le ACP.", [CP]) == "Le CPE et le ACP."


def test_tous_les_exemples_de_la_table_reelle_donnent_le_texte_attendu():
    assert exemples_en_echec(TABLE_DE_PRONONCIATION) == []


def test_un_exemple_faux_est_signale_comme_en_echec():
    exemple_faux = entree("vas-y", "va-zi", "Allez, vas-y.", "Allez, vas-y.")

    assert exemples_en_echec([VAS_Y, exemple_faux]) == [exemple_faux]


def test_une_entree_qui_ne_touche_aucune_phrase_fait_echouer_la_verification():
    with pytest.raises(RemplacementSansEffet, match="vas-y"):
        verifier_la_table([VAS_Y], ["Lis le mot.", "Je suis au CP."])


def test_une_table_dont_chaque_entree_touche_une_phrase_est_acceptee():
    verifier_la_table([VAS_Y, CP], ["Allez, vas-y.", "Je suis au CP."])


def test_la_table_ne_change_pas_la_cle_de_la_phrase():
    phrase = phrases_avec_cle("Allez, vas-y.")[0]

    envoye = texte_envoye_a_la_voix(phrase.texte, [VAS_Y])

    assert envoye == "Allez, va-zi."
    assert phrase.texte == "Allez, vas-y."
    assert phrase.cle == empreinte_fnv1a64("Allez, vas-y.")
