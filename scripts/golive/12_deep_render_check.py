"""12 - Verification approfondie du rendu : titre H1, presence de blocs cles, taille totale."""
from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path

CHECKS = [
    # (label, url, marqueurs HTML attendus)
    ("Home",            "https://labienveillance.fr/", [
        "Bien vieillir chez soi", "hero", "Monte-escaliers", "Salle de bain", "Aménagements",
    ]),
    ("Monte-escaliers", "https://labienveillance.fr/monte-escaliers/", [
        "Monte-escaliers", "devis-jlm", "iframe", "Up Stairlift", "Acorn",
    ]),
    ("Salle de bain",   "https://labienveillance.fr/salle-de-bain/", [
        "Salle de bain", "devis-sdb-app", "devis-sdb",
    ]),
    ("Amenagements",    "https://labienveillance.fr/amenagements/", [
        "Aménagements", "amenagement-item",
    ]),
    ("Contact",         "https://labienveillance.fr/contact/", [
        "Contact", "demander-rdv",
    ]),
    ("Mentions",        "https://labienveillance.fr/mentions-legales/", [
        "Politique", "cookies", "RGPD",
    ]),
    ("Embed JLM",       "https://labienveillance.fr/embed-devis-jlm/", [
        "jlmLiteAppRoot", "jlm-lite-devis.js",
    ]),
    ("Conseils",        "https://labienveillance.fr/conseils/", [
        "Conseils",
    ]),
]


def fetch(url: str) -> tuple[int, dict, str]:
    req = urllib.request.Request(url, headers={
        "User-Agent": "LBV-GoLive-Probe/1.0",
        "Cache-Control": "no-cache",
    })
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.status, dict(r.headers), r.read().decode("utf-8", errors="replace")


def main() -> None:
    print(f"{'Page':<18} {'HTTP':<6} {'Bytes':<8} {'Title':<60}  {'Markers'}")
    print("-" * 130)
    all_ok = True
    for label, url, markers in CHECKS:
        try:
            status, headers, body = fetch(url)
            m = re.search(r"<title[^>]*>([^<]+)</title>", body, re.IGNORECASE)
            title = (m.group(1).strip() if m else "(no title)")[:60]
            found = [k for k in markers if k.lower() in body.lower()]
            missing = [k for k in markers if k.lower() not in body.lower()]
            mark_str = f"OK={len(found)}/{len(markers)}"
            if missing:
                mark_str += f" missing={missing}"
                all_ok = False
            print(f"{label:<18} {status:<6} {len(body):<8} {title:<60}  {mark_str}")
        except Exception as exc:
            print(f"{label:<18} ERR    -        -                                                            {exc}")
            all_ok = False

    # Tests redirections clés
    print("\n== Redirections legacy attendues ==")
    for label, url in [
        ("/parrainage.html",   "https://labienveillance.fr/parrainage.html"),
        ("/admin/",            "https://labienveillance.fr/admin/"),
        ("/monte-escalier.html","https://labienveillance.fr/monte-escalier.html"),
    ]:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "LBV-Probe"}, method="HEAD")
            with urllib.request.urlopen(req, timeout=10) as r:
                print(f"  {label:<25} HTTP {r.status}  (final URL : {r.url})")
        except urllib.error.HTTPError as e:
            print(f"  {label:<25} HTTP {e.code}  ({e.reason})")
        except Exception as e:
            print(f"  {label:<25} ERR {e}")

    # Test API REST publique (apres bascule permaliens)
    print("\n== /wp-json/ (pretty REST) ==")
    try:
        status, headers, body = fetch("https://labienveillance.fr/wp-json/")
        ct = headers.get("Content-Type", "")
        print(f"  HTTP {status}  Content-Type: {ct[:50]}")
        if "application/json" in ct:
            import json
            j = json.loads(body)
            print(f"  Site : {j.get('name')}  | namespaces : {len(j.get('namespaces', []))}")
    except Exception as e:
        print(f"  ERR : {e}")


if __name__ == "__main__":
    main()
