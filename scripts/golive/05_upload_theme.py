"""05 - Uploader recursivement le theme via SFTP.

Source local  : wp-theme/labienveillance/
Destination   : clickandbuilds/laseptieme/wp-content/themes/labienveillance/

- Cree les dossiers manquants
- Skip les fichiers identiques (taille + mtime) pour pouvoir relancer rapidement
- Logs detailles
"""
from __future__ import annotations

import os
import stat
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import ROOT, sftp_connect

LOCAL_THEME = ROOT / "wp-theme" / "labienveillance"
REMOTE_THEME = "clickandbuilds/laseptieme/wp-content/themes/labienveillance"


def remote_exists(s, path: str) -> bool:
    try:
        s.stat(path)
        return True
    except IOError:
        return False


def remote_mkdir_p(s, path: str) -> None:
    parts = path.strip("/").split("/")
    current = ""
    for part in parts:
        current = (current + "/" + part) if current else part
        try:
            s.stat(current)
        except IOError:
            s.mkdir(current)


def upload_file(s, local: Path, remote: str) -> tuple[bool, int]:
    """Retourne (uploaded, size_bytes). uploaded=False = skip car identique."""
    local_size = local.stat().st_size
    local_mtime = int(local.stat().st_mtime)
    try:
        ra = s.stat(remote)
        if ra.st_size == local_size and abs((ra.st_mtime or 0) - local_mtime) < 2:
            return False, local_size
    except IOError:
        pass
    s.put(str(local), remote)
    s.utime(remote, (local_mtime, local_mtime))
    return True, local_size


def main() -> None:
    if not LOCAL_THEME.is_dir():
        print(f"!! Source introuvable : {LOCAL_THEME}")
        sys.exit(1)

    t, s = sftp_connect()
    t0 = time.time()
    try:
        remote_mkdir_p(s, REMOTE_THEME)
        # Inventaire local
        files: list[tuple[Path, str]] = []
        for root, dirs, fnames in os.walk(LOCAL_THEME):
            rel_dir = os.path.relpath(root, LOCAL_THEME).replace("\\", "/")
            for d in dirs:
                rd = (rel_dir + "/" + d).lstrip("./") if rel_dir != "." else d
                remote_mkdir_p(s, REMOTE_THEME + "/" + rd)
            for f in fnames:
                local = Path(root) / f
                rel = (rel_dir + "/" + f).lstrip("./") if rel_dir != "." else f
                files.append((local, REMOTE_THEME + "/" + rel))

        print(f"== Upload du theme : {len(files)} fichier(s) ==")
        uploaded = 0
        skipped = 0
        bytes_uploaded = 0
        for local, remote in files:
            try:
                did, sz = upload_file(s, local, remote)
                if did:
                    uploaded += 1
                    bytes_uploaded += sz
                    print(f"  + {remote[len(REMOTE_THEME)+1:]:<70} {sz:>10} bytes")
                else:
                    skipped += 1
            except Exception as exc:
                print(f"  ! ECHEC {remote} -> {exc}")
                raise

        dt = time.time() - t0
        mb = bytes_uploaded / (1024 * 1024)
        print(f"\n== {uploaded} upload(s), {skipped} skip(s), {mb:.2f} Mo en {dt:.1f}s")
    finally:
        s.close()
        t.close()


if __name__ == "__main__":
    main()
