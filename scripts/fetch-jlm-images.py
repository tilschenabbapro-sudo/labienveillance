"""Rapatriement des images du devis estimatif monte-escalier (JLM).

Les originales sont hébergées sur un domaine WordPress.com de staging
qui peut disparaître. Ce script télécharge chacune dans
`wp-theme/labienveillance/assets/img/devis-monte-escalier/` puis copie
le tout dans `img/devis-monte-escalier/` pour la maquette statique.

Idempotent : si le fichier existe déjà localement et n'est pas vide,
on saute (sauf si --force est passé).

Usage :
    python scripts/fetch-jlm-images.py
"""

from __future__ import annotations

import shutil
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DST_THEME = ROOT / "wp-theme" / "labienveillance" / "assets" / "img" / "devis-monte-escalier"
DST_STATIC = ROOT / "img" / "devis-monte-escalier"

# Clé du JS -> (URL source, nom local). Plusieurs clés peuvent partager
# le même fichier source : on télécharge une fois et on duplique localement
# pour garder le mapping 1-pour-1 lisible côté JS.
IMAGES: list[tuple[str, str, str]] = [
    ("logo",            "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/logomakr-0c1pju.png",                               "logo-jlm.png"),
    ("type_droit",      "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/escalier-droit.jpg",                                "escalier-droit.jpg"),
    ("type_90",         "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/escalier-90.jpg",                                   "escalier-90.jpg"),
    ("type_180",        "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/escalier-180c2b0.jpg",                              "escalier-180.jpg"),
    ("type_ext",        "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/serenite-monte-escalier-monte-escaliers7-390x380-1.jpeg", "escalier-exterieur.jpg"),
    ("marque_up",       "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/camscanner-23-02-2026-15.20_1.jpg",                 "marque-up-stairlift.jpg"),
    ("marque_acorn",    "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/0abcd33b-7191-4d4f-81fe-5097d415b3cc_image1.png",   "marque-acorn.png"),
    ("depart_std",      "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-14.44.17.jpeg",        "depart-standard.jpg"),
    ("depart_rall",     "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-14.45.07.jpeg",        "depart-rallonge.jpg"),
    ("depart_p90",      "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-15.20.00.jpeg",        "depart-pivot-90.jpg"),
    ("depart_p180",     "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2024-11-17-a-15.19.52_789038bb.jpg", "depart-pivot-180.jpg"),
    ("obstacle_ex1",    "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2025-07-23-at-16.55.59-1-768x1024-1.jpeg", "obstacle-exemple-1.jpg"),
    ("obstacle_ex2",    "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-02-at-15.22.57.jpeg",        "obstacle-exemple-2.jpg"),
    ("obstacle_yes",    "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/IMG_4902.jpeg",                                     "obstacle-oui.jpg"),
    ("obstacle_no",     "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2024-11-17-a-15.19.52_38b0d7f8.jpg", "obstacle-non.jpg"),
    ("rail_1",          "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-02-at-15.22.57.jpeg",        "rail-exemple-1.jpg"),
    ("rail_2",          "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/IMG_4902.jpeg",                                     "rail-exemple-2.jpg"),
    ("rail_yes",        "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-14.54.44.jpeg",        "rail-oui.jpg"),
    ("rail_no",         "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2024-11-17-a-15.19.52_38b0d7f8.jpg", "rail-non.jpg"),
    ("arr_nez",         "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-04-at-14.51.48.jpeg",        "arrivee-nez-marche.jpg"),
    ("arr_prol",        "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-01-at-08.10.01.jpeg",        "arrivee-prolongement.jpg"),
    ("arr_90",          "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-01-at-08.08.50.jpeg",        "arrivee-90.jpg"),
    ("arr_180",         "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2024-11-17-a-15.19.53_562a3c5e-1.jpg", "arrivee-180.jpg"),
    ("pivot_manuel",    "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-15.21.03.jpeg",        "pivot-manuel.jpg"),
    ("pivot_elec",      "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-04-at-14.51.48.jpeg",        "pivot-electrique.jpg"),
    ("garanties_photo", "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-01-at-08.11.43.jpeg",        "garanties.jpg"),
    ("aides_photo",     "https://laseptiemecom.wpcomstaging.com/wp-content/uploads/2026/03/whatsapp-image-2026-03-01-at-08.16.15.jpeg",        "aides.jpg"),
]


def human(size: int) -> str:
    return f"{size / 1024:.1f} Ko" if size < 1024 * 1024 else f"{size / (1024 * 1024):.2f} Mo"


def fetch(url: str, dest: Path) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 La Bienveillance migration"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read()
    dest.write_bytes(data)
    return len(data)


def main() -> int:
    DST_THEME.mkdir(parents=True, exist_ok=True)
    DST_STATIC.mkdir(parents=True, exist_ok=True)

    force = "--force" in sys.argv

    print(f"Téléchargement vers {DST_THEME.relative_to(ROOT)}")
    print("=" * 70)

    failures: list[str] = []
    downloaded = 0
    skipped = 0

    for key, url, filename in IMAGES:
        dest = DST_THEME / filename
        if dest.is_file() and dest.stat().st_size > 0 and not force:
            print(f"  ~  {key:<18} déjà présent : {filename}")
            skipped += 1
            continue
        try:
            size = fetch(url, dest)
            print(f"  +  {key:<18} {filename:<28} ({human(size)})")
            downloaded += 1
        except Exception as exc:  # pragma: no cover
            failures.append(f"{key} ({url}) : {exc}")
            print(f"  !  {key:<18} ÉCHEC : {exc}")

    print(f"\n{downloaded} téléchargé(s), {skipped} ignoré(s), {len(failures)} échec(s).")

    # Synchronisation vers le miroir statique (img/devis-monte-escalier/).
    print(f"\nCopie vers {DST_STATIC.relative_to(ROOT)}")
    print("=" * 70)
    for jpg in sorted(DST_THEME.iterdir()):
        if not jpg.is_file():
            continue
        shutil.copy2(jpg, DST_STATIC / jpg.name)
        print(f"  >  {jpg.name}")

    if failures:
        print("\nÉchecs :")
        for f in failures:
            print(f"  - {f}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
