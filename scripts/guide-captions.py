"""Generate public/guide/nkechinyere-welcome.vtt from WELCOME_SCRIPT in src/lib/candidate/guide.ts.

Timings assume a natural speaking pace (~2.6 words a second plus a short pause). After recording,
adjust the cue times to the real video if needed. Run: python3 scripts/guide-captions.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / "src/lib/candidate/guide.ts").read_text()
block = re.search(r"WELCOME_SCRIPT = \[(.*?)\];", src, re.S).group(1)
lines = re.findall(r'"((?:[^"\\]|\\.)*)"', block)

def stamp(t: float) -> str:
    m, s = divmod(t, 60)
    return f"00:{int(m):02d}:{s:06.3f}"

cues, t = [], 0.5
for line in lines:
    # Split long lines into caption-sized chunks at sentence or clause boundaries.
    parts = [p.strip() for p in re.split(r"(?<=[.:])\s+", line) if p.strip()]
    for part in parts:
        duration = len(part.split()) / 2.6 + 0.3
        cues.append((t, t + duration, part))
        t += duration + 0.15
    t += 0.4

out = ["WEBVTT", ""]
for i, (a, b, text) in enumerate(cues, 1):
    out += [str(i), f"{stamp(a)} --> {stamp(b)}", text, ""]
path = ROOT / "public/guide/nkechinyere-welcome.vtt"
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text("\n".join(out))
print(f"{len(cues)} cues, about {round(t)} seconds")
