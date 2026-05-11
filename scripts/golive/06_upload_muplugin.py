"""06 - Deposer le mu-plugin de config dans wp-content/mu-plugins/."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import ROOT, sftp_connect

LOCAL_MU = ROOT / "migration-wp" / "mu-plugin-labienveillance-config.php"
REMOTE_DIR = "clickandbuilds/laseptieme/wp-content/mu-plugins"
REMOTE_FILE = REMOTE_DIR + "/labienveillance-config.php"


def main() -> None:
    if not LOCAL_MU.is_file():
        print(f"!! Source introuvable : {LOCAL_MU}")
        sys.exit(1)
    size_local = LOCAL_MU.stat().st_size

    t, s = sftp_connect()
    try:
        # Creer mu-plugins/ si absent
        try:
            s.stat(REMOTE_DIR)
            print(f"== {REMOTE_DIR}/ existe deja")
        except IOError:
            s.mkdir(REMOTE_DIR)
            print(f"== Cree : {REMOTE_DIR}/")

        # Lister le contenu
        existing = sorted(e.filename for e in s.listdir_attr(REMOTE_DIR))
        print(f"== Contenu avant : {existing or '(vide)'}")

        # Sauvegarde si existe deja
        try:
            s.stat(REMOTE_FILE)
            from datetime import datetime
            backup = REMOTE_FILE + f".lbv-backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
            # Copy: lire + ecrire
            with s.open(REMOTE_FILE, "r") as fr, s.open(backup, "w") as fw:
                fw.write(fr.read())
            print(f"== Backup existant -> {backup}")
        except IOError:
            pass

        # Upload
        s.put(str(LOCAL_MU), REMOTE_FILE)
        ra = s.stat(REMOTE_FILE)
        print(f"== Upload : {REMOTE_FILE} ({ra.st_size} bytes, local={size_local})")
        assert ra.st_size == size_local, "Taille incoherente"

        existing = sorted(e.filename for e in s.listdir_attr(REMOTE_DIR))
        print(f"== Contenu apres : {existing}")
    finally:
        s.close()
        t.close()


if __name__ == "__main__":
    main()
