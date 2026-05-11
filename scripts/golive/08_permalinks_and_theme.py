"""08 - Passer permaliens en /%postname%/ + activer le theme La Bienveillance.

A faire dans cet ordre :
1. Update settings.permalink_structure
2. Activer le theme (PUT /wp/v2/themes/labienveillance avec status=active)
3. Verifier que show_on_front = page + page_on_front pointe sur 'accueil'
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import wp_get, wp_post, wp_put


def main() -> None:
    print("== 1. Settings avant ==")
    st, body = wp_get("/wp/v2/settings")
    print(f"  permalink_structure : {body.get('permalink_structure')!r}")
    print(f"  show_on_front       : {body.get('show_on_front')!r}")
    print(f"  page_on_front       : {body.get('page_on_front')!r}")
    print(f"  page_for_posts      : {body.get('page_for_posts')!r}")

    print("\n== 2. Update permalink_structure -> /%postname%/ ==")
    st, body = wp_post("/wp/v2/settings", body={
        "permalink_structure": "/%postname%/",
    })
    print(f"  HTTP {st}")
    print(f"  permalink_structure : {body.get('permalink_structure')!r}")

    # Verifier que les pages renvoient bien leur URL canonique
    print("\n== 3. Verifier URL canonique de quelques pages cles ==")
    for slug in ("accueil", "monte-escaliers", "salle-de-bain", "contact", "mentions-legales"):
        st2, b2 = wp_get("/wp/v2/pages", params={"slug": slug, "per_page": "1"})
        if isinstance(b2, list) and b2:
            page = b2[0]
            print(f"  {slug:<20} id={page['id']:<6} link={page['link']}")

    print("\n== 4. Themes installes ==")
    st, body = wp_get("/wp/v2/themes")
    for t in body if isinstance(body, list) else []:
        mark = "* " if t["status"] == "active" else "  "
        print(f"  {mark}{t['stylesheet']:<35} v{t.get('version', '?')}")

    # Activer le theme La Bienveillance
    print("\n== 5. Activer 'labienveillance' ==")
    st, body = wp_put("/wp/v2/themes/labienveillance", body={"status": "active"})
    print(f"  HTTP {st}")
    if isinstance(body, dict):
        print(f"  stylesheet : {body.get('stylesheet')}")
        print(f"  status     : {body.get('status')}")
        print(f"  version    : {body.get('version')}")
    else:
        print(f"  body : {json.dumps(body, ensure_ascii=False)[:600]}")

    # Verifier
    print("\n== 6. Themes apres activation ==")
    st, body = wp_get("/wp/v2/themes")
    for t in body if isinstance(body, list) else []:
        mark = "* " if t["status"] == "active" else "  "
        print(f"  {mark}{t['stylesheet']:<35} v{t.get('version', '?')}")


if __name__ == "__main__":
    main()
