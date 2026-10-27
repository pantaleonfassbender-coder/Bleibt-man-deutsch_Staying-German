"""Prüft die Modul-Dateien gegen apparat/SCHEMA.md.  python apparat/check-module.py"""
import json, re, sys
from pathlib import Path
MOD = Path(__file__).resolve().parent
need_top = ["id", "nr", "zeit", "ort", "ort_en", "titel", "titel_en", "frage", "frage_en", "lede", "lede_en", "hinweis", "hinweis_en", "quellen", "sections", "spiel"]
bad = 0
for f in sorted(MOD.glob("*.json")):
    m = json.loads(f.read_text(encoding="utf-8")); errs = []
    errs += [f"fehlt {k}" for k in need_top if not m.get(k)]
    keys = {q["key"] for q in m.get("quellen", [])}
    n = 0; words = 0
    for s in m.get("sections", []):
        for u in s.get("units", []):
            n += 1
            if u.get("lang") not in ("de", "en"): errs.append(f"[{u.get('n')}] lang")
            if not u.get("de") or not u.get("en"): errs.append(f"[{u.get('n')}] de/en leer")
            if u.get("quelle") not in keys: errs.append(f"[{u.get('n')}] quelle {u.get('quelle')}")
            if not u.get("bild"): errs.append(f"[{u.get('n')}] bild fehlt")
            txt = u.get("de", "") + u.get("en", "")
            if re.search(r"\bnigger", txt, re.I): errs.append(f"[{u.get('n')}] n-Wort ungekürzt")
            words += len(u.get(u.get("lang", "en"), "").split())
    ns = [u["n"] for s in m["sections"] for u in s["units"]]
    if len(ns) != len(set(ns)): errs.append("doppelte n")
    opts = m.get("spiel", {}).get("optionen", [])
    if not any(o.get("gewaehlt") for o in opts): errs.append("keine gewaehlt-Option")
    print(f"{m.get('nr'):>2} {m['id']:<18} {n:>3} Einheiten {words:>6} Wörter  {len(opts)} Optionen  {len(m.get('legenden', []))} Legenden  {'OK' if not errs else '; '.join(errs[:6])}")
    bad += bool(errs)
sys.exit(1 if bad else 0)
