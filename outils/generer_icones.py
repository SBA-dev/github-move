"""Génère les icônes PNG de l'application installée (192 et 512 px, et 180 px pour l'écran d'accueil d'Apple) : un écureuil stylisé sur fond vert.

Outil à relancer seulement pour changer le dessin : les PNG de public/icones/ sont commités.
Dépendance : Pillow (pip install Pillow).
Commande : python3 outils/generer_icones.py
Sortie : public/icones/icone-192.png, icone-512.png et apple-touch-icon.png.
"""
from pathlib import Path

from PIL import Image, ImageDraw

DOSSIER = Path(__file__).resolve().parent.parent / "public" / "icones"
VERT = "#24452c"
ROUX = "#c9452f"
CREME = "#f6f1e7"
BRUN = "#1f2a1f"
TAILLE_DE_DESSIN = 1024  # dessiné en grand puis réduit, pour des bords lisses


def dessiner() -> Image.Image:
    image = Image.new("RGB", (TAILLE_DE_DESSIN, TAILLE_DE_DESSIN), VERT)
    d = ImageDraw.Draw(image)
    d.ellipse((560, 330, 940, 800), fill=ROUX)  # queue
    d.ellipse((620, 420, 880, 760), fill=VERT)
    d.ellipse((250, 400, 700, 880), fill=ROUX)  # corps
    d.ellipse((330, 520, 620, 860), fill=CREME)  # ventre
    d.polygon([(290, 300), (350, 110), (460, 270)], fill=ROUX)  # oreilles
    d.polygon([(500, 270), (610, 110), (660, 300)], fill=ROUX)
    d.ellipse((240, 230, 700, 600), fill=ROUX)  # tête
    d.ellipse((330, 360, 400, 430), fill=BRUN)  # yeux
    d.ellipse((530, 360, 600, 430), fill=BRUN)
    d.ellipse((435, 450, 495, 500), fill=BRUN)  # museau
    return image


def main() -> None:
    DOSSIER.mkdir(parents=True, exist_ok=True)
    dessin = dessiner()
    fichiers = {"icone-192.png": 192, "icone-512.png": 512, "apple-touch-icon.png": 180}
    for nom, taille in fichiers.items():
        dessin.resize((taille, taille), Image.LANCZOS).save(DOSSIER / nom)


if __name__ == "__main__":
    main()
