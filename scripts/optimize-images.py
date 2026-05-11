"""Optimisation des images du site La Bienveillance.

Pour chaque dossier d'images cible :
- recompresse les .jpg en quality=82, progressive, optimize=True ;
- redimensionne à 1600 px de large maximum (les fiches produit / hero
  n'ont pas besoin de plus en HiDPI raisonnable) ;
- convertit les .png lourds historiques en .jpg ;
- recadre l'image Open Graph en 1200x630 (ratio social standard).

Idempotent : peut être relancé sans dégrader davantage si le fichier
est déjà aux dimensions/qualité cibles.

Usage :
    python scripts/optimize-images.py
"""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent

# Dossiers où trouver des .jpg à compresser (récursif sur 1 niveau).
PHOTO_DIRS = [
    ROOT / "img",
    ROOT / "img" / "sdb",
    ROOT / "img" / "devis-monte-escalier",
    ROOT / "wp-theme" / "labienveillance" / "assets" / "img",
    ROOT / "wp-theme" / "labienveillance" / "assets" / "img" / "sdb",
    ROOT / "wp-theme" / "labienveillance" / "assets" / "img" / "devis-monte-escalier",
]

# Cibles de conversion PNG -> JPG (paire (source, destination)).
PNG_TO_JPG = [
    "sdb-baignoire-vintage-style.png",
    "sdb-avant-apres-douche.png",
]
PNG_DIRS = [
    ROOT / "img",
    ROOT / "wp-theme" / "labienveillance" / "assets" / "img",
]

# Image OG : recadrage final.
OG_FILES = [
    ROOT / "img" / "og-labienveillance.jpg",
    ROOT / "wp-theme" / "labienveillance" / "assets" / "img" / "og-labienveillance.jpg",
]

MAX_WIDTH = 1600
JPG_QUALITY = 82
OG_TARGET = (1200, 630)
OG_QUALITY = 85


def human(size: int) -> str:
    return f"{size / 1024:.1f} Ko" if size < 1024 * 1024 else f"{size / (1024 * 1024):.2f} Mo"


def process_jpg(path: Path) -> None:
    if not path.is_file():
        return
    before = path.stat().st_size
    try:
        with Image.open(path) as im:
            im = ImageOps.exif_transpose(im)
            if im.mode in ("RGBA", "P"):
                im = im.convert("RGB")
            w, h = im.size
            if w > MAX_WIDTH:
                ratio = MAX_WIDTH / w
                im = im.resize((MAX_WIDTH, int(h * ratio)), Image.LANCZOS)
            im.save(path, format="JPEG", quality=JPG_QUALITY, optimize=True, progressive=True)
    except Exception as exc:  # pragma: no cover - safety net
        print(f"  ! erreur {path.name} : {exc}")
        return
    after = path.stat().st_size
    delta_pct = (1 - after / before) * 100 if before else 0
    print(f"  {path.name:<40} {human(before):>10} -> {human(after):>10}  ({delta_pct:+.0f}%)")


def convert_png_to_jpg(directory: Path, filename: str) -> None:
    src = directory / filename
    if not src.is_file():
        return
    dst = directory / (Path(filename).stem + ".jpg")
    before = src.stat().st_size
    try:
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im)
            if im.mode in ("RGBA", "LA"):
                # Aplatir sur fond blanc pour éviter la transparence noire en JPG.
                bg = Image.new("RGB", im.size, (255, 255, 255))
                bg.paste(im, mask=im.split()[-1] if im.mode == "RGBA" else None)
                im = bg
            else:
                im = im.convert("RGB")
            w, h = im.size
            if w > MAX_WIDTH:
                ratio = MAX_WIDTH / w
                im = im.resize((MAX_WIDTH, int(h * ratio)), Image.LANCZOS)
            im.save(dst, format="JPEG", quality=JPG_QUALITY, optimize=True, progressive=True)
    except Exception as exc:  # pragma: no cover - safety net
        print(f"  ! erreur {filename} : {exc}")
        return
    after = dst.stat().st_size
    delta_pct = (1 - after / before) * 100 if before else 0
    print(f"  {filename:<40} {human(before):>10} -> {dst.name} {human(after):>10}  ({delta_pct:+.0f}%)")


def crop_og(path: Path) -> None:
    if not path.is_file():
        return
    before = path.stat().st_size
    target_w, target_h = OG_TARGET
    target_ratio = target_w / target_h
    try:
        with Image.open(path) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            w, h = im.size
            current_ratio = w / h
            if current_ratio > target_ratio:
                # Image trop large -> rogner sur la largeur.
                new_w = int(h * target_ratio)
                left = (w - new_w) // 2
                im = im.crop((left, 0, left + new_w, h))
            else:
                # Image trop haute -> rogner sur la hauteur.
                new_h = int(w / target_ratio)
                top = (h - new_h) // 2
                im = im.crop((0, top, w, top + new_h))
            im = im.resize(OG_TARGET, Image.LANCZOS)
            im.save(path, format="JPEG", quality=OG_QUALITY, optimize=True, progressive=True)
    except Exception as exc:  # pragma: no cover - safety net
        print(f"  ! erreur {path.name} : {exc}")
        return
    after = path.stat().st_size
    print(f"  {path.name:<40} {human(before):>10} -> {human(after):>10}  (1200x630)")


def main() -> None:
    print("=" * 70)
    print("Conversion PNG -> JPG (lourds historiques)")
    print("=" * 70)
    for directory in PNG_DIRS:
        if not directory.is_dir():
            continue
        print(f"\n[{directory.relative_to(ROOT)}]")
        for png in PNG_TO_JPG:
            convert_png_to_jpg(directory, png)

    print("\n" + "=" * 70)
    print(f"Compression JPG (max {MAX_WIDTH}px, quality {JPG_QUALITY})")
    print("=" * 70)
    for directory in PHOTO_DIRS:
        if not directory.is_dir():
            continue
        print(f"\n[{directory.relative_to(ROOT)}]")
        for jpg in sorted(directory.glob("*.jpg")):
            if jpg.name == "og-labienveillance.jpg":
                continue  # géré ensuite
            process_jpg(jpg)

    print("\n" + "=" * 70)
    print(f"Recadrage Open Graph -> {OG_TARGET[0]}x{OG_TARGET[1]}")
    print("=" * 70)
    for og in OG_FILES:
        crop_og(og)

    print("\nTermine.")


if __name__ == "__main__":
    main()
