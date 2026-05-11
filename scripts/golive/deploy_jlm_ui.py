"""Upload fichiers refonte UI JLM (CSS + JS + PHP)."""
from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CREDS = ROOT / "dist" / ".creds.env"

REMOTE_BASE = "clickandbuilds/laseptieme/wp-content/themes/labienveillance"

FILES = [
    ("wp-theme/labienveillance/assets/css/jlm-lite-devis.css", "assets/css/jlm-lite-devis.css"),
    ("wp-theme/labienveillance/assets/js/jlm-lite-devis.js", "assets/js/jlm-lite-devis.js"),
    ("wp-theme/labienveillance/functions.php", "functions.php"),
    ("wp-theme/labienveillance/page-embed-devis-jlm.php", "page-embed-devis-jlm.php"),
]


def load_creds() -> dict[str, str]:
    if not CREDS.is_file():
        print(f"!! Créez {CREDS} avec IONOS_HOST, IONOS_USER, IONOS_PASS", file=sys.stderr)
        sys.exit(1)
    out: dict[str, str] = {}
    for line in CREDS.read_text(encoding="utf-8-sig").splitlines():
        line = line.strip()
        if not line or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip()
    return out


def main() -> None:
    creds = load_creds()
    import paramiko

    t = paramiko.Transport((creds["IONOS_HOST"], 22))
    t.connect(username=creds["IONOS_USER"], password=creds["IONOS_PASS"])
    s = paramiko.SFTPClient.from_transport(t)
    try:
        for rel_local, rel_remote in FILES:
            local = ROOT / rel_local
            remote = REMOTE_BASE + "/" + rel_remote
            if not local.is_file():
                print(f"!! Manquant : {local}")
                sys.exit(1)
            # mkdir parents
            parts = remote.rsplit("/", 1)[0].split("/")
            cur = ""
            for p in parts:
                cur = cur + "/" + p if cur else p
                try:
                    s.stat(cur)
                except IOError:
                    s.mkdir(cur)
            mtime = int(local.stat().st_mtime)
            size = local.stat().st_size
            s.put(str(local), remote)
            s.utime(remote, (mtime, mtime))
            st = s.stat(remote)
            print(f"  OK {rel_remote} ({st.st_size} o, local {size})")
    finally:
        s.close()
        t.close()
    print("Déploiement JLM terminé.")


if __name__ == "__main__":
    main()
