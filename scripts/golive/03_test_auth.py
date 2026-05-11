"""03 - Verifier que l'auth REST API marche maintenant."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import wp_get


def main() -> None:
    print("== /wp/v2/users/me ==")
    status, body = wp_get("/wp/v2/users/me", params={"context": "edit"})
    print(f"  HTTP {status}")
    if isinstance(body, dict):
        print("  id        :", body.get("id"))
        print("  username  :", body.get("username"))
        print("  name      :", body.get("name"))
        print("  email     :", body.get("email"))
        print("  roles     :", body.get("roles"))
        print("  caps OK   :", "manage_options" in (body.get("capabilities") or {}))
    else:
        print("  body :", str(body)[:600])

    print("\n== / (root namespace) ==")
    status, body = wp_get("/", params={})
    if isinstance(body, dict):
        print("  Site         :", body.get("name"))
        print("  URL          :", body.get("url"))
        print("  Home         :", body.get("home"))
        print("  GMT offset   :", body.get("gmt_offset"))
        print("  Timezone     :", body.get("timezone_string"))
        wp_v2_routes = [r for r in (body.get("routes") or {}).keys() if r.startswith("/wp/v2")]
        print("  /wp/v2 routes:", len(wp_v2_routes))


if __name__ == "__main__":
    main()
