"""99 - Cleanup final apres go-live."""
from __future__ import annotations

import json
import stat
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import CREDS_FILE, ROOT, sftp_connect, wp_get, wp_post


def main() -> None:
    # 1. Supprimer les snippets LBV (deja desactives)
    print("== 1. Suppression des snippets LBV (deja desactives) ==")
    st, snippets = wp_get("/code-snippets/v1/snippets")
    if isinstance(snippets, list):
        for sp in snippets:
            name = sp.get("name") or ""
            if name.startswith("LBV "):
                from urllib import request
                # Pas d'endpoint DELETE direct dans la liste, on POST sur /snippets/{id}/deactivate puis DELETE
                from _env import wp_request
                st, body = wp_request("DELETE", f"/code-snippets/v1/snippets/{sp['id']}")
                print(f"  Delete #{sp['id']} '{name[:40]}' -> HTTP {st}")

    # 2. Verifier qu'il ne reste pas de mu-plugins one-shot LBV
    print("\n== 2. Inventaire mu-plugins distants ==")
    t, s = sftp_connect()
    try:
        path = "clickandbuilds/laseptieme/wp-content/mu-plugins"
        for e in sorted(s.listdir_attr(path), key=lambda x: x.filename):
            print(f"  {e.filename:<50} {e.st_size:>6} bytes")
        # Supprimer les eventuels one-shots
        for fname in ("lbv-redirection-install.php", "lbv-yoast-config.php"):
            full = path + "/" + fname
            try:
                s.stat(full)
                s.remove(full)
                print(f"  Supprime : {fname}")
            except IOError:
                pass
    finally:
        s.close(); t.close()

    # 3. Verifier sauvegardes locales
    print("\n== 3. Sauvegardes locales ==")
    snap_dir = ROOT / "dist" / "snapshots"
    if snap_dir.is_dir():
        for f in sorted(snap_dir.iterdir()):
            print(f"  {f.name:<50} {f.stat().st_size:>8} bytes")

    # 4. Sanity check final
    print("\n== 4. Sanity check final ==")
    import urllib.request
    for path in ("/", "/contact/", "/wp-admin/", "/wp-json/wp/v2/pages?per_page=2"):
        try:
            req = urllib.request.Request(f"https://labienveillance.fr{path}", method="HEAD", headers={"Cache-Control": "no-cache"})
            with urllib.request.urlopen(req, timeout=10) as r:
                print(f"  HTTP {r.status:<5} {path}")
        except Exception as e:
            try:
                code = getattr(e, "code", "?")
                print(f"  HTTP {code:<5} {path}")
            except Exception:
                print(f"  ERR : {path} | {e}")

    # 5. Rapport credentials
    print("\n== 5. Securite credentials ==")
    print(f"  Fichier local creds : {CREDS_FILE}")
    print(f"  Le fichier existe   : {CREDS_FILE.is_file()}")
    print()
    print("  RAPPELS DE SECURITE A FAIRE :")
    print("  -----------------------------")
    print("  1) Cote WordPress : revoquer le App Password 'pjpe XHeL ZD4s ...'")
    print("     -> /wp-admin/profile.php section 'Mots de passe d'application'")
    print("  2) Cote IONOS : changer le mot de passe SFTP utilisateur 'u117785475'")
    print("     -> Espace client IONOS > Hosting > Acces FTP/SSH")
    print("     (ce mdp etait aussi en dur dans l'ancien JS du configurateur)")
    print("  3) Supprimer le fichier local : " + str(CREDS_FILE))
    print("     (ou simplement le vider apres confirmation client)")


if __name__ == "__main__":
    main()
