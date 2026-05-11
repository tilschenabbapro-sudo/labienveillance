"""Petit helper partage par tous les scripts go-live.

Charge les identifiants depuis (par ordre) :
  - variable d'environnement ``LBV_CREDS_FILE`` (chemin absolu vers un .env),
  - ``<racine-du-depot>/dist/.creds.env``,
  - ``<racine-du-depot>/.creds.env``

Fichier local uniquement — ne jamais committer les mots de passe.
"""

from __future__ import annotations

import base64
import json
import os
import socket
import sys
import time
from pathlib import Path
from typing import Any
from urllib import error, parse, request

ROOT = Path(__file__).resolve().parent.parent.parent

# Ordre de recherche : variable d'environnement, puis dist/, puis racine du dépôt (gitignore).
_CANDIDATE_CREDS_FILES = [
    Path(os.environ["LBV_CREDS_FILE"])
    if os.environ.get("LBV_CREDS_FILE")
    else None,
    ROOT / "dist" / ".creds.env",
    ROOT / ".creds.env",
]
_CANDIDATE_CREDS_FILES = [p for p in _CANDIDATE_CREDS_FILES if p is not None]


def _resolve_creds_file() -> Path | None:
    for p in _CANDIDATE_CREDS_FILES:
        if p.is_file():
            return p
    return None


CREDS_FILE = _resolve_creds_file() or (_CANDIDATE_CREDS_FILES[1])


def load_creds() -> dict[str, str]:
    path = _resolve_creds_file()
    if path is None:
        tried = "\n  ".join(str(p) for p in _CANDIDATE_CREDS_FILES)
        print(
            "!! Aucun fichier credentials trouvé. Essayez (par ordre) :\n  "
            + tried
            + "\n  Ou définissez LBV_CREDS_FILE=chemin/vers/.creds.env",
            file=sys.stderr,
        )
        sys.exit(1)
    creds: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        creds[k.strip()] = v.strip()
    return creds


CREDS = load_creds()


# ---- WP REST helpers --------------------------------------------------------

def _wp_auth_header() -> dict[str, str]:
    pair = f"{CREDS['WP_USER']}:{CREDS['WP_APP_PASS']}"
    token = base64.b64encode(pair.encode("utf-8")).decode("ascii")
    return {"Authorization": f"Basic {token}"}


def wp_url(route: str, params: dict[str, str] | None = None) -> str:
    base = CREDS["WP_URL"].rstrip("/")
    qs = {"rest_route": route}
    if params:
        qs.update(params)
    return f"{base}/index.php?" + parse.urlencode(qs)


def wp_request(
    method: str,
    route: str,
    params: dict[str, str] | None = None,
    body: Any | None = None,
    extra_headers: dict[str, str] | None = None,
    timeout: int = 30,
    expect_json: bool = True,
):
    url = wp_url(route, params)
    headers = {
        "Accept": "application/json",
        "User-Agent": "Labienveillance-GoLive/1.0",
        **_wp_auth_header(),
    }
    if extra_headers:
        headers.update(extra_headers)
    data: bytes | None = None
    if body is not None:
        if isinstance(body, (dict, list)):
            data = json.dumps(body).encode("utf-8")
            headers.setdefault("Content-Type", "application/json")
        elif isinstance(body, str):
            data = body.encode("utf-8")
        else:
            data = body
    req = request.Request(url, method=method.upper(), headers=headers, data=data)
    try:
        with request.urlopen(req, timeout=timeout) as resp:
            payload = resp.read()
            ctype = resp.headers.get("Content-Type", "")
            if expect_json and "application/json" in ctype:
                return resp.status, json.loads(payload.decode("utf-8"))
            return resp.status, payload.decode("utf-8", errors="replace") if payload else ""
    except error.HTTPError as exc:
        body_txt = exc.read().decode("utf-8", errors="replace")
        try:
            return exc.code, json.loads(body_txt)
        except Exception:
            return exc.code, body_txt
    except (error.URLError, socket.timeout) as exc:
        return 0, str(exc)


def wp_get(route: str, params: dict[str, str] | None = None, **kw):
    return wp_request("GET", route, params=params, **kw)


def wp_post(route: str, body: Any | None = None, params: dict[str, str] | None = None, **kw):
    return wp_request("POST", route, params=params, body=body, **kw)


def wp_put(route: str, body: Any | None = None, params: dict[str, str] | None = None, **kw):
    return wp_request("PUT", route, params=params, body=body, **kw)


# ---- SFTP helpers -----------------------------------------------------------

def sftp_connect():
    import paramiko
    t = paramiko.Transport((CREDS["IONOS_HOST"], 22))
    t.connect(username=CREDS["IONOS_USER"], password=CREDS["IONOS_PASS"])
    return t, paramiko.SFTPClient.from_transport(t)


if __name__ == "__main__":
    print("CREDS loaded :", sorted(CREDS.keys()))
    print("WP URL :", CREDS["WP_URL"])
