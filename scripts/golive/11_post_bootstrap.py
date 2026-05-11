"""11 - Apres bootstrap : desactiver snippet, vider cache IONOS, tester rendu."""
from __future__ import annotations

import json
import stat
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import sftp_connect, wp_get, wp_post


def rm_recursive(s, path: str) -> int:
    """Supprime un dossier distant recursivement. Retourne le nombre de fichiers."""
    count = 0
    try:
        for e in list(s.listdir_attr(path)):
            child = path + "/" + e.filename
            if stat.S_ISDIR(e.st_mode):
                count += rm_recursive(s, child)
                try:
                    s.rmdir(child)
                except IOError:
                    pass
            else:
                s.remove(child)
                count += 1
    except IOError:
        pass
    return count


def main() -> None:
    # 1. Desactiver le snippet bootstrap (chercher par nom)
    print("== 1. Desactiver snippet bootstrap ==")
    st, snippets = wp_get("/code-snippets/v1/snippets")
    target = None
    if isinstance(snippets, list):
        for sp in snippets:
            if "LBV Bootstrap GO-LIVE" in (sp.get("name") or ""):
                target = sp
                break
    if target:
        print(f"  Snippet trouve : #{target['id']} active={target.get('active')}")
        if target.get("active"):
            st, body = wp_post(f"/code-snippets/v1/snippets/{target['id']}/deactivate", body={})
            print(f"  Desactivation HTTP {st}")
        else:
            print(f"  Deja inactif")
    else:
        print("  Snippet introuvable")

    # 2. Vider cache IONOS Performance
    print("\n== 2. Vider cache IONOS Performance ==")
    t, s = sftp_connect()
    try:
        cache_root = "clickandbuilds/laseptieme/wp-content/cache/ionos-performance"
        try:
            entries = list(s.listdir_attr(cache_root))
            print(f"  {len(entries)} entree(s) dans le cache")
            for e in entries:
                child = cache_root + "/" + e.filename
                if stat.S_ISDIR(e.st_mode):
                    n = rm_recursive(s, child)
                    try:
                        s.rmdir(child)
                    except IOError:
                        pass
                    print(f"  - {e.filename}/ : {n} fichier(s) supprime(s)")
                else:
                    s.remove(child)
                    print(f"  - {e.filename} : supprime")
        except IOError as exc:
            print(f"  Cache vide ou absent : {exc}")

        # Egalement : vider wp-content/cache/ en general s'il y a un autre cache plugin
        # On laisse le reste tel quel.
    finally:
        s.close()
        t.close()

    # 3. Tests HTTP sur les URLs publiques
    print("\n== 3. Tests rendu public ==")
    import urllib.request
    urls = [
        ("Home",            "https://labienveillance.fr/"),
        ("Monte-escaliers", "https://labienveillance.fr/monte-escaliers/"),
        ("Salle de bain",   "https://labienveillance.fr/salle-de-bain/"),
        ("Amenagements",    "https://labienveillance.fr/amenagements/"),
        ("Contact",         "https://labienveillance.fr/contact/"),
        ("Mentions",        "https://labienveillance.fr/mentions-legales/"),
        ("Embed JLM",       "https://labienveillance.fr/embed-devis-jlm/"),
        ("Conseils",        "https://labienveillance.fr/conseils/"),
        ("404 test",        "https://labienveillance.fr/page-qui-nexiste-pas/"),
    ]
    for label, url in urls:
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "LBV-GoLive-Probe/1.0",
                "Cache-Control": "no-cache",
            })
            with urllib.request.urlopen(req, timeout=10) as r:
                ct = r.headers.get("Content-Type", "")
                content = r.read()[:4000].decode("utf-8", errors="replace")
                has_theme = "labienveillance" in content.lower() or "header__logo" in content.lower()
                has_old = "elementor" in content.lower() and "elementor-frontend" in content.lower()
                marker = "[NEW]" if has_theme and not has_old else ("[OLD]" if has_old else "[??]")
                print(f"  {marker} {label:<18} HTTP {r.status} ({len(content)} bytes shown) ct={ct[:30]}")
        except Exception as exc:
            err = str(exc)
            if "404" in err:
                print(f"  [404] {label:<18} {err}")
            else:
                print(f"  [ERR] {label:<18} {err}")


if __name__ == "__main__":
    main()
