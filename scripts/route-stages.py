"""Regenerate src/config/route-stages.ts from STRUCTURE/BUILD_GUIDE/ROUTES.md.

Run from the repo root:  python3 scripts/route-stages.py
Keep STAGES in sync with STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / "STRUCTURE/BUILD_GUIDE/ROUTES.md").read_text()
sections = re.findall(r"^## ([^\n]+)\n(?:[^`#][^\n]*\n|\n)*```txt\n(.*?)```", src, re.S | re.M)
routes = {name: [l.strip() for l in body.splitlines() if l.strip()] for name, body in sections}
core = routes["Candidate Core"]

STAGES = [
    ("U0", "Foundation", routes["Shared Utility"]),
    ("U1", "Public & marketing", [r for r in routes["Public"] if r != "/s/[handle]"]),
    ("U2", "Auth (mocked)", routes["Auth"] + ["/billing/checkout"]),
    ("U3", "Candidate core", [r for r in core if r == "/dashboard" or r.startswith(("/onboarding", "/profile", "/settings"))]),
    ("U5", "Candidate tools", routes["AI CV And PersonalityAI CV"] + [r for r in core if r.startswith("/signia")]
        + ["/s/[handle]", "/applications/insights", "/messages", "/messages/[threadId]", "/notifications", "/billing"]),
    ("U6", "02 Universities", routes["Universities"] + ["/saved", "/applications", "/applications/[applicationId]", "/applications/drafts"]),
    ("U7", "03 Scholarships", routes["Scholarships"]),
    ("U8", "Provider portals", routes["Provider Portals"]),
    ("U9", "09 AI Apply Agent", routes["AI Apply Agent"]),
    ("U10", "10 Apply For Me", routes["Apply For Me"]),
    ("U11", "11 Discovery Engine", routes["Discovery Engine Admin"]),
    ("U12", "12 Relocation", routes["Relocation"]),
    ("U13", "Relocation operations", routes["Relocation Operations"]),
    ("U14", "13 Migration Agencies", routes["Migration Agencies"]),
    ("U15", "14 Jobs — candidate (Pro)", routes["Jobs"]),
    ("U16", "Employers", routes["Employers"]),
    ("U17", "Admin", routes["Admin"]),
]

assigned = [r for _, _, rs in STAGES for r in rs]
every = [r for rs in routes.values() for r in rs]
missing = sorted(set(every) - set(assigned))
duplicates = sorted({r for r in assigned if assigned.count(r) > 1})
assert not missing, f"Routes without a stage: {missing}"
assert not duplicates, f"Routes in more than one stage: {duplicates}"

lines = [
    "// Generated from STRUCTURE/BUILD_GUIDE/ROUTES.md by scripts/route-stages.py — do not edit by hand.",
    "",
    "export const ROUTE_STAGES: Record<string, string> = {",
]
lines += [f'  "{r}": "{code} · {label}",' for code, label, rs in STAGES for r in rs]
lines += ["};", ""]
(ROOT / "src/config/route-stages.ts").write_text("\n".join(lines))
print(f"{len(assigned)} routes across {len(STAGES)} stages")
