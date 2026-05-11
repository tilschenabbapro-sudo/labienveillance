"""02 - Patcher .htaccess pour faire passer l'en-tete Authorization.

Sauvegarde le .htaccess actuel dans dist/snapshots/.htaccess.original,
puis insere un petit bloc 'LBV GO-LIVE' au tout debut. Idempotent.
"""

from __future__ import annotations

import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import ROOT, sftp_connect

WP_PATH = "clickandbuilds/laseptieme"
HTACCESS = WP_PATH + "/.htaccess"

MARKER_START = "# === LBV GO-LIVE : Forward Authorization header (REST API) ==="
MARKER_END = "# === /LBV GO-LIVE ==="
BLOCK = f"""{MARKER_START}
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{{HTTP:Authorization}} ^(.+)$
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{{HTTP:Authorization}}]
</IfModule>
<IfModule mod_setenvif.c>
    SetEnvIf Authorization "(.+)" HTTP_AUTHORIZATION=$1
</IfModule>
{MARKER_END}
"""


def main() -> None:
    snap_dir = ROOT / "dist" / "snapshots"
    snap_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")

    t, s = sftp_connect()
    try:
        # Sauvegarde
        with s.open(HTACCESS, "r") as f:
            current = f.read().decode("utf-8", errors="replace")
        local_backup = snap_dir / f".htaccess.{ts}.original"
        local_backup.write_text(current, encoding="utf-8")
        print(f"== Backup local : {local_backup.relative_to(ROOT)} ({len(current)} bytes)")

        # Sauvegarde aussi en distant
        remote_backup = HTACCESS + f".lbv-backup-{ts}"
        with s.open(remote_backup, "w") as f:
            f.write(current.encode("utf-8"))
        print(f"== Backup distant : {remote_backup}")

        if MARKER_START in current:
            print("== Bloc deja present, rien a faire.")
            return

        new_content = BLOCK + "\n" + current
        with s.open(HTACCESS, "w") as f:
            f.write(new_content.encode("utf-8"))
        print(f"== .htaccess patche : +{len(new_content) - len(current)} bytes au debut")

        # Verification
        with s.open(HTACCESS, "r") as f:
            check = f.read().decode("utf-8", errors="replace")
        assert MARKER_START in check, "Le marqueur n'apparait pas apres ecriture"
        print(f"== Verification OK ({len(check)} bytes total)")
    finally:
        s.close()
        t.close()


if __name__ == "__main__":
    main()
