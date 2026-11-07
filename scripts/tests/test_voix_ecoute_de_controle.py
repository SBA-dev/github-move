"""Page d'écoute de contrôle des sons de phrases, par niveau (#182, décision 182.8).

API attendue (module `voix/ecoute_de_controle.py`) :
- `page_d_ecoute(repertoire, bibliotheque, niveau, inventaire, avec_paroles_communes=False) -> str`
  - `repertoire` : `{"voix", "sons": {cle: {fichier, dureeMs}}, "lecons": {...}}` ;
  - `bibliotheque` : liste de leçons `{"id", "niveau", ...}`, dans l'ordre de la bibliothèque ;
  - `inventaire` : `{"phrases": [{"cle", "phrase"}], "lecons": {id | "paroles-communes": [cle]}}` ;
  - rend le HTML de la page, qui lit les sons par `../public/voix/<fichier>`
    (la page est écrite dans `ecoute/`, à la racine du dépôt) ;
  - chaque phrase a un `<audio controls>` et un bouton `data-phrase="<phrase échappée>"` ;
  - un niveau absent de la bibliothèque lève `ValueError` (message citant le niveau).
"""
import re
import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

from voix import ecoute_de_controle  # noqa: E402

REPERTOIRE = {
    "voix": "fr_FR-tom-medium",
    "sons": {
        "le-chat-dort": {"fichier": "aaaa000000000001.mp3", "dureeMs": 1200},
        "bonjour-le-soleil": {"fichier": "aaaa000000000002.mp3", "dureeMs": 1500},
        "la-lune-brille": {"fichier": "aaaa000000000003.mp3", "dureeMs": 1300},
        "bravo": {"fichier": "aaaa000000000004.mp3", "dureeMs": 800},
    },
    "lecons": {},
}

INVENTAIRE = {
    "phrases": [
        {"cle": "le-chat-dort", "phrase": "Le chat dort"},
        {"cle": "bonjour-le-soleil", "phrase": "Bonjour le soleil"},
        {"cle": "la-lune-brille", "phrase": "La lune brille"},
        {"cle": "bravo", "phrase": "Bravo"},
    ],
    "lecons": {
        "fr-cp-animaux": ["le-chat-dort"],
        "fr-cp-saluer": ["bonjour-le-soleil"],
        "fr-ce1-nuit": ["la-lune-brille"],
        "paroles-communes": ["bravo"],
    },
}

BIBLIOTHEQUE = [
    {"id": "fr-cp-animaux", "niveau": "CP"},
    {"id": "fr-ce1-nuit", "niveau": "CE1"},
    {"id": "fr-cp-saluer", "niveau": "CP"},
]


def page(niveau="CP", repertoire=REPERTOIRE, inventaire=INVENTAIRE, **options):
    return ecoute_de_controle.page_d_ecoute(repertoire, BIBLIOTHEQUE, niveau, inventaire, **options)


def inventaire_avec_phrase(phrase):
    return {
        "phrases": [{"cle": "cle", "phrase": phrase}],
        "lecons": {"fr-cp-animaux": ["cle"]},
    }


def test_la_page_donne_a_chaque_phrase_du_niveau_un_lecteur_audio_vers_son_fichier():
    html = page("CP")

    assert '<audio controls' in html
    assert 'src="../public/voix/aaaa000000000001.mp3"' in html
    assert 'src="../public/voix/aaaa000000000002.mp3"' in html
    assert "Le chat dort" in html and "Bonjour le soleil" in html


def test_la_page_d_un_niveau_ne_contient_pas_les_phrases_des_autres_niveaux():
    html = page("CP")

    assert "La lune brille" not in html
    assert "aaaa000000000003.mp3" not in html


def test_les_phrases_suivent_l_ordre_de_la_bibliotheque():
    html = page("CP")

    assert html.index("Le chat dort") < html.index("Bonjour le soleil")


def test_les_paroles_communes_ne_figurent_que_si_on_les_demande():
    assert "Bravo" not in page("CP")
    assert "Bravo" in page("CP", avec_paroles_communes=True)
    assert "aaaa000000000004.mp3" in page("CP", avec_paroles_communes=True)


def test_chaque_phrase_a_un_bouton_mal_prononce_qui_porte_la_phrase():
    html = page("CP")

    boutons = re.findall(r'<button[^>]*data-phrase="([^"]*)"[^>]*>\s*mal prononcé', html)
    assert boutons == ["Le chat dort", "Bonjour le soleil"]


def test_la_page_offre_une_liste_copiable_des_phrases_mal_prononcees():
    html = page("CP")

    assert 'id="mal-prononcees"' in html
    assert "<textarea" in html


def test_le_texte_d_une_phrase_est_echappe_en_html():
    html = page("CP", inventaire=inventaire_avec_phrase('Tom & Léa disent "<salut>"'))

    assert "<salut>" not in html
    assert "Tom &amp; Léa disent &quot;&lt;salut&gt;&quot;" in html
    assert 'data-phrase="Tom &amp; Léa disent &quot;&lt;salut&gt;&quot;"' in html


def test_la_page_n_appelle_aucun_service_externe():
    html = page("CP", avec_paroles_communes=True)

    assert not re.search(r"https?://", html)


def test_un_niveau_inconnu_est_refuse_avec_un_message_qui_le_cite():
    with pytest.raises(ValueError, match="CM2"):
        page("CM2")


def test_la_page_s_ecrit_dans_un_fichier_html_lisible_en_utf8(tmp_path):
    html = page("CP")
    chemin = tmp_path / "ecoute-CP.html"

    chemin.write_text(html, encoding="utf-8")

    assert "Le chat dort" in chemin.read_text(encoding="utf-8")
