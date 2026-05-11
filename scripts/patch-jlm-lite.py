"""Patch de `js/jlm-lite-devis.js` (racine + thème) pour la mise en prod.

Trois changements :
1. Les 27 URLs hébergées sur le staging WordPress.com (`laseptiemecom.wpcomstaging.com`)
   sont remplacées par des chemins relatifs `img/devis-monte-escalier/<nom>` qui pointent
   désormais vers les fichiers rapatriés en local.
2. La constante `ADMIN_CODE = "424720"` est neutralisée (`null`) : l'UI admin frontend
   reste dans le bundle mais inerte. Si un jour on veut un back-office, mieux vaut
   passer par une page d'options WordPress propre.
3. Un petit bootstrap ajouté juste après la déclaration de `var DEF = …` permet à
   WordPress (via `wp_localize_script`) de remplacer les URLs relatives par des
   URLs absolues du thème — voir `labienveillance_enqueue_jlm_devis()` dans
   `functions.php`. Idempotent : si le bootstrap est déjà présent, rien ne se passe.

Usage : python scripts/patch-jlm-lite.py
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGETS = [
    ROOT / "js" / "jlm-lite-devis.js",
    ROOT / "wp-theme" / "labienveillance" / "assets" / "js" / "jlm-lite-devis.js",
]

# Mapping clé JS -> nom de fichier local (recadré pour rester court & lisible).
KEY_TO_FILE: dict[str, str] = {
    "logo":             "logo-jlm.png",
    "type_droit":       "escalier-droit.jpg",
    "type_90":          "escalier-90.jpg",
    "type_180":         "escalier-180.jpg",
    "type_ext":         "escalier-exterieur.jpg",
    "marque_up":        "marque-up-stairlift.jpg",
    "marque_acorn":     "marque-acorn.png",
    "depart_std":       "depart-standard.jpg",
    "depart_rall":      "depart-rallonge.jpg",
    "depart_p90":       "depart-pivot-90.jpg",
    "depart_p180":      "depart-pivot-180.jpg",
    "obstacle_ex1":     "obstacle-exemple-1.jpg",
    "obstacle_ex2":     "obstacle-exemple-2.jpg",
    "obstacle_yes":     "obstacle-oui.jpg",
    "obstacle_no":      "obstacle-non.jpg",
    "rail_1":           "rail-exemple-1.jpg",
    "rail_2":           "rail-exemple-2.jpg",
    "rail_yes":         "rail-oui.jpg",
    "rail_no":          "rail-non.jpg",
    "arr_nez":          "arrivee-nez-marche.jpg",
    "arr_prol":         "arrivee-prolongement.jpg",
    "arr_90":           "arrivee-90.jpg",
    "arr_180":          "arrivee-180.jpg",
    "pivot_manuel":     "pivot-manuel.jpg",
    "pivot_elec":       "pivot-electrique.jpg",
    "garanties_photo":  "garanties.jpg",
    "aides_photo":      "aides.jpg",
}

LOCAL_PREFIX = "img/devis-monte-escalier/"

BOOTSTRAP_MARKER = "/* lbv-bootstrap-jlm-images */"
BOOTSTRAP = f"""
  {BOOTSTRAP_MARKER}
  (function () {{
    if (typeof labienveillanceJlm === "undefined") return;
    if (labienveillanceJlm.images && DEF.images) {{
      Object.keys(labienveillanceJlm.images).forEach(function (k) {{
        if (DEF.images[k]) DEF.images[k].url = labienveillanceJlm.images[k];
      }});
    }}
  }})();
"""


def patch(path: Path) -> bool:
    if not path.is_file():
        print(f"  !  introuvable : {path}")
        return False
    content = path.read_text(encoding="utf-8")
    original = content

    # 1. Remplacement des URLs externes par les chemins locaux.
    replacements = 0
    for key, filename in KEY_TO_FILE.items():
        # On cherche la ligne `<key>: { url: "https://…" }` et on remplace l'URL.
        # Le JS définit chaque entrée sur une seule ligne, ce qui rend la regex sûre.
        import re
        pattern = re.compile(
            r"(" + re.escape(key) + r"\s*:\s*\{\s*url\s*:\s*[\"'])([^\"']+)([\"']\s*\})"
        )
        new_content, n = pattern.subn(
            lambda m: m.group(1) + LOCAL_PREFIX + filename + m.group(3),
            content,
        )
        if n:
            content = new_content
            replacements += n

    # 2. Neutralisation de ADMIN_CODE.
    content = content.replace(
        'var ADMIN_CODE = "424720";',
        "var ADMIN_CODE = null; /* UI admin front désactivée : passer par une page d'options WP si besoin */",
    )

    # 3. Ajout du bootstrap (idempotent grâce au marqueur).
    if BOOTSTRAP_MARKER not in content:
        # On insère juste après la déclaration `var cfg = clone(DEF);`.
        anchor = "var cfg = clone(DEF);"
        if anchor in content:
            content = content.replace(anchor, anchor + "\n" + BOOTSTRAP, 1)
        else:
            print(f"  !  ancre introuvable dans {path.name}, bootstrap non inséré.")

    if content == original:
        print(f"  =  {path} : déjà à jour")
        return True
    path.write_text(content, encoding="utf-8")
    print(f"  +  {path} : {replacements} URLs réécrites + bootstrap")
    return True


def main() -> None:
    print("Patch jlm-lite-devis.js")
    print("=" * 70)
    for target in TARGETS:
        patch(target)


if __name__ == "__main__":
    main()
