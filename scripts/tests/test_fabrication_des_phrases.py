"""Fabrication reprenable des phrases enregistrées, Piper remplacé par un faux (story #182).

API attendue (scripts/voix/fabrication_des_phrases.py) :
- PhraseAFabriquer(texte, lente=False)
- empreinte_de_fabrication(texte_envoye, voix_enregistree, encodage, allure="normale") -> 8 chiffres
  hexadécimaux : les 8 premiers de FNV-1a 64 (cle_de_phrase.empreinte_fnv1a64) du texte
  "texte_envoye\\nvoix_enregistree\\nencodage\\nallure".
- fabriquer_les_phrases(phrases, *, piper, dossier, voix_enregistree, encodage="mono-32k-22050",
  table=(), lot=None, budget_en_octets=45_000_000, cle_de=empreinte_fnv1a64,
  supprimer_les_orphelins=False) -> ResultatDeFabrication(fabriquees, sautees)
- piper.synthetiser(texte_envoye, chemin_mp3, allure) écrit les octets du MP3 à `chemin_mp3`.
- erreurs : CollisionDeCles, BudgetDePoidsDepasse.
"""
import json
import sys
from pathlib import Path

import pytest

RACINE = Path(__file__).resolve().parents[2]
SCRIPTS = RACINE / "scripts"
sys.path.insert(0, str(SCRIPTS))

from voix.cle_de_phrase import empreinte_fnv1a64  # noqa: E402
from voix.fabrication_des_phrases import (  # noqa: E402
    BudgetDePoidsDepasse,
    CollisionDeCles,
    PhraseAFabriquer,
    empreinte_de_fabrication,
    fabriquer_les_phrases,
)
from voix.table_de_prononciation import EntreeDePrononciation  # noqa: E402

VOIX = "fr_FR-tom-test"
ENCODAGE = "mono-32k-22050"
BONJOUR = "Bonjour les amis."
CHAT = "Le chat dort."
BEAU = "Il fait beau."
ALLEZ = "Allez, vas-y."
ENTREE_VAS_Y = EntreeDePrononciation("vas-y", "va-zi", "Allez, vas-y.", "Allez, va-zi.")


class FauxPiper:
    def __init__(self, octets=1000):
        self.octets = octets
        self.appels = []

    def synthetiser(self, texte_envoye, chemin_mp3, allure):
        self.appels.append((texte_envoye, Path(chemin_mp3).name, allure))
        Path(chemin_mp3).write_bytes(b"\x00" * self.octets)

    def textes_envoyes(self):
        return [texte for texte, _, _ in self.appels]


def fabriquer(phrases, dossier, piper, **options):
    options.setdefault("voix_enregistree", VOIX)
    return fabriquer_les_phrases(
        [PhraseAFabriquer(p) if isinstance(p, str) else p for p in phrases],
        piper=piper,
        dossier=dossier,
        **options,
    )


def repertoire(dossier):
    return json.loads((dossier / "repertoire.json").read_text(encoding="utf-8"))


def test_une_phrase_a_fabriquer_produit_son_mp3_nomme_par_cle_et_empreinte_et_entre_au_repertoire(tmp_path):
    cle = empreinte_fnv1a64(BONJOUR)
    empreinte = empreinte_de_fabrication(BONJOUR, VOIX, ENCODAGE)

    fabriquer([BONJOUR], tmp_path, FauxPiper())

    assert (tmp_path / f"{cle}-{empreinte}.mp3").is_file()
    assert repertoire(tmp_path) == {
        "voixEnregistree": VOIX,
        "phrases": {cle: {"normale": empreinte}},
    }


def test_l_empreinte_depend_du_texte_envoye_de_la_voix_et_de_l_encodage_et_reste_stable(tmp_path):
    reference = empreinte_de_fabrication(BONJOUR, VOIX, ENCODAGE)

    assert len(reference) == 8
    assert all(c in "0123456789abcdef" for c in reference)
    assert empreinte_de_fabrication(BONJOUR, VOIX, ENCODAGE) == reference
    assert empreinte_de_fabrication(CHAT, VOIX, ENCODAGE) != reference
    assert empreinte_de_fabrication(BONJOUR, "fr_FR-autre", ENCODAGE) != reference
    assert empreinte_de_fabrication(BONJOUR, VOIX, "mono-24k-22050") != reference


def test_relancer_la_fabrication_ne_rappelle_pas_piper_pour_un_fichier_deja_present(tmp_path):
    fabriquer([BONJOUR, CHAT], tmp_path, FauxPiper())
    second_piper = FauxPiper()

    fabriquer([BONJOUR, CHAT], tmp_path, second_piper)

    assert second_piper.appels == []
    assert len(repertoire(tmp_path)["phrases"]) == 2


def test_une_entree_de_la_table_qui_change_le_texte_envoye_ne_refabrique_que_la_phrase_touchee(tmp_path):
    fabriquer([ALLEZ, BONJOUR], tmp_path, FauxPiper())
    second_piper = FauxPiper()

    fabriquer([ALLEZ, BONJOUR], tmp_path, second_piper, table=[ENTREE_VAS_Y])

    assert second_piper.textes_envoyes() == ["Allez, va-zi."]
    cle = empreinte_fnv1a64(ALLEZ)
    assert repertoire(tmp_path)["phrases"][cle] == {
        "normale": empreinte_de_fabrication("Allez, va-zi.", VOIX, ENCODAGE)
    }


def test_le_lot_limite_les_phrases_fabriquees_par_appel_et_un_second_appel_continue(tmp_path):
    phrases = [BONJOUR, CHAT, BEAU]
    premier_piper = FauxPiper()
    second_piper = FauxPiper()

    fabriquer(phrases, tmp_path, premier_piper, lot=2)
    fabriquer(phrases, tmp_path, second_piper, lot=2)

    assert len(premier_piper.appels) == 2
    assert second_piper.textes_envoyes() == [BEAU]
    assert len(repertoire(tmp_path)["phrases"]) == 3


def test_un_mp3_orphelin_n_est_pas_supprime_sans_demande_explicite(tmp_path):
    orphelin = tmp_path / "0123456789abcdef-89abcdef.mp3"
    orphelin.write_bytes(b"\x00")

    fabriquer([BONJOUR], tmp_path, FauxPiper())

    assert orphelin.is_file()


def test_deux_phrases_differentes_de_meme_cle_font_echouer_la_fabrication(tmp_path):
    piper = FauxPiper()

    with pytest.raises(CollisionDeCles):
        fabriquer([BONJOUR, CHAT], tmp_path, piper, cle_de=lambda _: "0000000000000000")


def test_un_dossier_de_sortie_au_dela_du_budget_de_poids_fait_echouer_la_fabrication(tmp_path):
    piper = FauxPiper(octets=1000)

    with pytest.raises(BudgetDePoidsDepasse):
        fabriquer([BONJOUR, CHAT], tmp_path, piper, budget_en_octets=1500)


def test_une_phrase_lente_produit_aussi_son_mp3_lent_et_l_entree_lente_du_repertoire(tmp_path):
    cle = empreinte_fnv1a64(CHAT)
    normale = empreinte_de_fabrication(CHAT, VOIX, ENCODAGE)
    lente = empreinte_de_fabrication(CHAT, VOIX, ENCODAGE, allure="lente")

    fabriquer([PhraseAFabriquer(CHAT, lente=True)], tmp_path, FauxPiper())

    assert (tmp_path / f"{cle}-{normale}.mp3").is_file()
    assert (tmp_path / f"{cle}-lente-{lente}.mp3").is_file()
    assert repertoire(tmp_path)["phrases"][cle] == {"normale": normale, "lente": lente}
