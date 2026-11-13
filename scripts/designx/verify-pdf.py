"""Validate the exported PDF independently of the browser's slide count."""
from pathlib import Path
import argparse
import json

from pypdf import PdfReader

root = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("path", nargs="?", type=Path, default=root / "output/pdf/Bower_DesignX_Buildings_That_Grow.pdf")
parser.add_argument("--expected-pages", type=int, default=16, help="Expected slide/page count (default: 16).")
args = parser.parse_args()
if args.expected_pages < 1:
    parser.error("--expected-pages must be a positive integer")
path = args.path
reader = PdfReader(path)
assert len(reader.pages) == args.expected_pages, f"Expected {args.expected_pages} PDF pages, found {len(reader.pages)}"

report = {"path": str(path.resolve()), "page_count": len(reader.pages), "pages": [], "links": []}
for number, page in enumerate(reader.pages, start=1):
    width, height = float(page.mediabox.width), float(page.mediabox.height)
    assert abs(width / height - 16 / 9) < 0.001, f"Page {number} is not 16:9 ({width} × {height})"
    text = page.extract_text() or ""
    assert len(text.strip()) > 10, f"Page {number} has no accessible presentation text"
    for unwanted in ["Previous slide", "Next slide", "Toggle fullscreen", "Print presentation"]:
        assert unwanted not in text, f"Page {number} contains a presentation control: {unwanted}"
    for annotation in page.get("/Annots", []):
        action = annotation.get_object().get("/A", {})
        if action.get("/URI"):
            report["links"].append(str(action["/URI"]))
    report["pages"].append({"page": number, "width_pt": width, "height_pt": height, "text_characters": len(text)})

assert any("bowerbuild.org/designx" in link for link in report["links"]), "PDF has no clickable link to the interactive presentation"
report_path = root / "qa-out/designx/pdf-check.json"
report_path.parent.mkdir(parents=True, exist_ok=True)
report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
print(f"Verified {len(reader.pages)} landscape 16:9 PDF pages with live text and an interactive-deck link: {path}")
