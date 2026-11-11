"""Table de prononciation : change le texte envoyé à la voix, jamais le texte affiché ni la clé (story #182).

Une entrée porte la casse exacte de son motif : « vas-y » et « Vas-y » sont deux entrées.

Pour ajouter une entrée, ajouter à TABLE_DE_PRONONCIATION, avec son exemple :
    EntreeDePrononciation("vas-y", "va-zi", "Allez, vas-y.", "Allez, va-zi.")
Le motif doit toucher au moins une phrase de la bibliothèque, sinon la fabrication refuse de tourner.
La table est vide tant que le PO n'a relevé aucun mot mal prononcé.
"""
import re
from dataclasses import dataclass


@dataclass(frozen=True)
class EntreeDePrononciation:
    motif: str
    remplacement: str
    exemple: str
    texte_attendu: str


class RemplacementSansEffet(Exception):
    def __init__(self, motif):
        super().__init__(f"L'entrée « {motif} » ne touche aucune phrase")
        self.motif = motif


class ExempleDePrononciationEnEchec(Exception):
    def __init__(self, motifs):
        super().__init__("L'exemple ne donne pas le texte attendu pour : " + ", ".join(f"« {m} »" for m in motifs))
        self.motifs = motifs


TABLE_DE_PRONONCIATION = []


def _motif_sur_mots_entiers(entree):
    return re.compile(rf"(?<!\w){re.escape(entree.motif)}(?!\w)")


def _applique(entree, phrase):
    return _motif_sur_mots_entiers(entree).sub(lambda _: entree.remplacement, phrase)


def texte_envoye_a_la_voix(phrase, table):
    for entree in table:
        phrase = _applique(entree, phrase)
    return phrase


def exemples_en_echec(table):
    return [
        entree
        for entree in table
        if texte_envoye_a_la_voix(entree.exemple, [entree]) != entree.texte_attendu
    ]


def verifier_la_table(table, phrases):
    for entree in table:
        if not any(_motif_sur_mots_entiers(entree).search(phrase) for phrase in phrases):
            raise RemplacementSansEffet(entree.motif)
