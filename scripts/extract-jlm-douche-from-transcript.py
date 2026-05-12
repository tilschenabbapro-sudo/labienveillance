"""Extract jlmDouche JS + CSS from Cursor agent transcript."""
import json
from pathlib import Path

TRANSCRIPT = Path(
    r"C:\Users\tilsc\.cursor\projects\c-Users-tilsc-OneDrive-Documents-projects-cursor-labienveillance"
    r"\agent-transcripts\b70f883e-b28f-4596-a556-029f61149c2d\b70f883e-b28f-4596-a556-029f61149c2d.jsonl"
)
ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "wp-theme/labienveillance/assets/js"
OUT_JS = OUT_DIR / "_extracted_jlm_body.js"
OUT_CSS = ROOT / "wp-theme/labienveillance/assets/css/_extracted_jlm_douche.css"


def main() -> None:
    line677 = TRANSCRIPT.read_text(encoding="utf-8").splitlines()[676]
    text = json.loads(line677)["message"]["content"][0]["text"]
    cs = text.find("(function () {")
    if cs < 0:
        raise SystemExit("start not found")

    snippet = text[cs:]
    marker = "styleNode.textContent = `"
    si = snippet.find(marker)
    if si < 0:
        raise SystemExit("style assignment not found")
    sj = si + len(marker)
    bt = snippet.find("`;", sj)
    if bt < 0:
        raise SystemExit("closing backtick not found")

    css = snippet[sj:bt]
    before = snippet[:si]
    after = snippet[bt + 2 :]  # `;

    OUT_CSS.write_text(css, encoding="utf-8")

    reconstructed = (
        before
        + "\n  /* inlined styles déplacés vers assets/css/jlm-douche-app.css */\n\n"
        + after
    )
    OUT_JS.write_text(reconstructed, encoding="utf-8")

    print("css bytes", len(css.encode("utf-8")))
    print("after css first 600 chars:", after[:600])
    print("wrote", OUT_JS)
    print("wrote", OUT_CSS)


if __name__ == "__main__":
    main()
