"""01 - Localiser l'installation WP et lire le .htaccess."""
from __future__ import annotations

import stat
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import sftp_connect


def main() -> None:
    t, s = sftp_connect()
    try:
        print("== clickandbuilds/ ==")
        for e in sorted(s.listdir_attr("clickandbuilds"), key=lambda x: x.filename):
            print("  ", e.filename, "(dir)" if stat.S_ISDIR(e.st_mode) else "")

        candidates = [
            e.filename for e in s.listdir_attr("clickandbuilds")
            if stat.S_ISDIR(e.st_mode)
        ]
        for c in candidates:
            path = "clickandbuilds/" + c
            entries = [e.filename for e in s.listdir_attr(path)]
            is_wp = "wp-config.php" in entries and "wp-content" in entries
            print(f"\n== {path}{' [WORDPRESS]' if is_wp else ''} ==")
            for f in sorted(entries)[:30]:
                print("  ", f)
            if is_wp:
                try:
                    with s.open(path + "/.htaccess", "r") as f:
                        ht = f.read().decode("utf-8", errors="replace")
                    print(f"\n== .htaccess ({len(ht)} bytes) ==")
                    print(ht)
                except Exception as ex:
                    print("  .htaccess :", ex)
    finally:
        s.close()
        t.close()


if __name__ == "__main__":
    main()
