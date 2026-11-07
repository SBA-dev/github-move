"""Table de prononciation : elle change ce que dit la voix de l'application, jamais le sens (#182)."""
import re
from dataclasses import dataclass


@dataclass(frozen=True)
class EntreeDePrononciation:
    cherche: str
    envoye: str
    exemple: str
    attendu: str


TABLE = [
    EntreeDePrononciation(
        cherche="vas-y",
        envoye="va-z-i",
        exemple="Vas-y, essaie encore !",
        attendu="Va-z-i, essaie encore !",
    ),
]


def _mot_entier(cherche):
    return re.compile(r"(?<!\w)" + re.escape(cherche) + r"(?!\w)", re.IGNORECASE)


def _avec_la_casse_de(trouve, envoye):
    if trouve[0].isupper():
        return envoye[0].upper() + envoye[1:]
    return envoye


def prononciation_corrigee(phrase, table=TABLE):
    for entree in table:
        phrase = _mot_entier(entree.cherche).sub(
            lambda trouve, e=entree: _avec_la_casse_de(trouve.group(0), e.envoye), phrase
        )
    return phrase


def verifier_la_table(table):
    for entree in table:
        if len(entree.envoye.split()) > len(entree.cherche.split()):
            raise ValueError(f"« {entree.cherche} » ajoute un mot : la table ne change que la prononciation")
        if prononciation_corrigee(entree.exemple, [entree]) != entree.attendu:
            raise ValueError(f"L'exemple de « {entree.cherche} » ne donne pas la prononciation attendue")
