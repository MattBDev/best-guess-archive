#!/usr/bin/env python3
"""Import show transcripts from the exported Google Docs .docx file.

The source document includes clue summaries and appendix tables around each
transcript. This importer keeps only the paragraphs under each episode's
"Show Transcript" heading and stops at the next table/appendix heading.

Doc structure per episode:
  [Title]    🎉 WEEKDAY, MONTH DAY, YEAR   ← authoritative date (may have emoji)
  [Heading1] WEEKDAY, MONTH DAY, YEAR      ← sometimes mis-typed; skipped in favour of Title
  ... clue/answer section ...
  [Heading1 or Heading3] Show Transcript   ← Heading3 used in early January 2026 episodes
  ... transcript lines ...
  [Title]    next episode                  ← terminates content
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET
from zipfile import ZipFile


NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
DATE_RE = re.compile(
    r"^(?:[\W_]+\s*)?(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+"
    r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+"
    r"\d{1,2},\s+\d{4}$",
    re.IGNORECASE,
)
SECTION_RE = re.compile(r"^\[(.+)\]$")
TIMESTAMP_RE = re.compile(r"^\[\d{1,2}:\d{2}(?::\d{2})?\]$")
SPEAKER_RE = re.compile(r"^([A-Z][A-Za-z .'\-]+):\s*(.+)$")
STOP_HEADINGS = {
    "Explanation Table",
    "Clue & Answer Results Table (Google Sheets Ready)",
    "Clue & Answer Results Table",
    "Results Table",
    "JSON",
    "JSON Data",
}
DATE_CORRECTIONS = {
    # The exported transcript doc has this MANICURE/COASTER episode misdated.
    "Wednesday, February 5, 2025": "Thursday, February 5, 2026",
}


def paragraph_text(paragraph: ET.Element) -> str:
    return "".join(node.text or "" for node in paragraph.findall(".//w:t", NS)).strip()


def paragraph_style(paragraph: ET.Element) -> str | None:
    style = paragraph.find("./w:pPr/w:pStyle", NS)
    if style is None:
        return None
    return style.attrib.get(f"{{{NS['w']}}}val")


def iter_paragraphs(docx_path: Path) -> list[dict[str, str | None]]:
    with ZipFile(docx_path) as archive:
        root = ET.fromstring(archive.read("word/document.xml"))

    paragraphs: list[dict[str, str | None]] = []
    for paragraph in root.findall(".//w:body/w:p", NS):
        text = paragraph_text(paragraph)
        if text:
            paragraphs.append({"style": paragraph_style(paragraph), "text": text})
    return paragraphs


def normalize_date(text: str) -> str:
    match = re.search(
        r"(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+"
        r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+"
        r"\d{1,2},\s+\d{4}",
        text,
        re.IGNORECASE,
    )
    if not match:
        return text.strip()
    parsed = datetime.strptime(match.group(0).title(), "%A, %B %d, %Y")
    normalized = parsed.strftime(f"%A, %B {parsed.day}, %Y")
    return DATE_CORRECTIONS.get(normalized, normalized)


def is_title_date(paragraph: dict[str, str | None]) -> bool:
    """Return True only for Title-style date headings (the authoritative date source)."""
    return paragraph["style"] == "Title" and bool(DATE_RE.match(normalize_date(str(paragraph["text"]))))


def is_any_date_heading(paragraph: dict[str, str | None]) -> bool:
    """Return True for Title or Heading1 date headings."""
    text = normalize_date(str(paragraph["text"]))
    return paragraph["style"] in {"Title", "Heading1"} and bool(DATE_RE.match(text))


def line_from_text(text: str) -> dict[str, str | None]:
    speaker_match = SPEAKER_RE.match(text)
    if speaker_match:
        return {"speaker": speaker_match.group(1), "text": speaker_match.group(2)}
    return {"speaker": None, "text": text}


def parse_transcripts(paragraphs: list[dict[str, str | None]]) -> list[dict[str, Any]]:
    transcripts: list[dict[str, Any]] = []
    i = 0
    while i < len(paragraphs):
        paragraph = paragraphs[i]

        # Only Title-style date headings start a new transcript.
        # Heading1 date headings are skipped here — they follow immediately after
        # the Title and can be mis-typed in the doc; the Title is authoritative.
        if not is_title_date(paragraph):
            i += 1
            continue

        date = normalize_date(str(paragraph["text"]))
        i += 1

        # Skip the Heading1 (or plain-text) date line that immediately follows
        # the Title. It may have a different (incorrect) date, so we ignore it.
        if i < len(paragraphs):
            nxt = paragraphs[i]
            nxt_date = normalize_date(str(nxt["text"]))
            if nxt["style"] in ("Heading1", None) and DATE_RE.match(nxt_date):
                i += 1

        # Scan forward for "Show Transcript" marker.
        # Later episodes use Heading1; early Jan 2026 use Heading3; Jan 13 uses plain None style.
        while i < len(paragraphs):
            para = paragraphs[i]
            if is_title_date(para):
                break  # next episode — no transcript found for this date
            if para["text"] == "Show Transcript":
                break
            i += 1

        if i >= len(paragraphs) or paragraphs[i]["text"] != "Show Transcript":
            continue

        i += 1
        sections: list[dict[str, Any]] = []
        current: dict[str, Any] | None = None

        while i < len(paragraphs):
            paragraph = paragraphs[i]
            text = str(paragraph["text"])

            if is_title_date(paragraph):
                break
            if paragraph["style"] in ("Heading1", "Heading3") and text in STOP_HEADINGS:
                break

            # Skip intro summary line (with or without leading curly/straight quote)
            stripped = text.lstrip('“‘”’"\'')
            if stripped.startswith("Here is the full transcript"):
                i += 1
                continue

            # Skip bare timestamp lines like [02:34] or [00:01:05]
            if TIMESTAMP_RE.match(text):
                i += 1
                continue

            section_match = SECTION_RE.match(text)
            if section_match:
                tag = section_match.group(1)
                # Skip timestamp-only section tags e.g. [02:34]
                if not TIMESTAMP_RE.match(text):
                    current = {"tag": tag, "lines": []}
                    sections.append(current)
                i += 1
                continue

            if current is None:
                current = {"tag": "Transcript", "lines": []}
                sections.append(current)
            current["lines"].append(line_from_text(text))
            i += 1

        if sections:
            transcripts.append({"date": date, "sections": sections})

    return transcripts


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: import_transcripts_from_docx.py SOURCE.docx data/transcripts.json", file=sys.stderr)
        return 2

    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    transcripts = parse_transcripts(iter_paragraphs(source))

    if not transcripts:
        print("No transcripts found.", file=sys.stderr)
        return 1

    destination.write_text(json.dumps(transcripts, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(transcripts)} transcripts to {destination}")
    print(f"First: {transcripts[0]['date']}")
    print(f"Last: {transcripts[-1]['date']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
