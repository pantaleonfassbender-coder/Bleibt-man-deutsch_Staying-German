"""Downloads the plates (public domain) into assets/plates/<id>.jpg (max 1600 px) and <id>_t.jpg (400 px), and writes
data/plates.json with titles, captions and credits. Commons files via the API (licence read from extmetadata and printed),
archive.org leaves, loc.gov newspaper pages via IIIF, and one page of the United States Reports rendered from the PDF.
Run:  python tools/get-plates.py            (python tools/get-plates.py --dry  lists only)"""
import io
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "plates"
OUT.mkdir(parents=True, exist_ok=True)
UA = {"User-Agent": "BleibtManDeutsch/1.0 (research apparatus; pantaleonfassbender@gmail.com)"}

C = "commons"
PLATES = [
    ("protest1688", "germantown", C, "The_1688_Germantown_Quaker_petition_against_slavery.jpg",
     "Der Protest vom 18. April 1688", "The protest of 18 April 1688",
     "Die Handschrift der vier Germantowner gegen den „traffick of mens-body“, beide Seiten.", "The manuscript of the four Germantown men against the 'traffick of mens-body', both sides."),
    ("germantown1688", "germantown", C, "Original_germantown_map_1688.jpg",
     "Germantown 1688", "Germantown in 1688", "Pastorius' Plan der Stadt mit den Hofstellen, nach Pennypacker 1899.", "Pastorius' plan of the town with its lots, after Pennypacker 1899."),
    ("sauerhaus", "wahl1755", C, "Appletons'_Sower_Christopher_-_1731_Germantown_house.jpg",
     "Sauers Haus in Germantown", "Sauer's house in Germantown", "Das 1731 erbaute Haus Christoph Sauers, Zeichnung aus Appletons' Cyclopaedia (1888).", "Christoph Sauer's house, built 1731, drawing from Appletons' Cyclopaedia (1888)."),
    ("sauerkalender", "wahl1755", C, "Almanac_Sauer.jpg",
     "Sauers Kalender", "Sauer's almanac", "Titelseite von Christoph Sauers Kalender, Germantown.", "Title page of Christoph Sauer's almanac, Germantown."),
    ("muhlenberg", "petition1795", C, "Frederick_Augustus_Conrad_Muhlenberg_by_Joseph_Wright,_1790,_oil_on_canvas_with_applied_wood_strip,_from_the_National_Portrait_Gallery_-_NPG-7400002A_2.jpg",
     "Frederick Augustus Conrad Muhlenberg", "Frederick Augustus Conrad Muhlenberg", "Bildnis von Joseph Wright, 1790. Muhlenberg war Sprecher des ersten Repräsentantenhauses; die Legende macht ihn zum Mann, der das Deutsche überstimmte.", "Portrait by Joseph Wright, 1790. Muhlenberg was Speaker of the first House of Representatives; the legend makes him the man who outvoted German."),
    ("annals1795", "petition1795", ("ia", "sim_united-states-congress-debates-and-proceedings_december-2-1793-march-3-1795_2", 542),
     "Annals of Congress, 13. Januar 1795", "Annals of Congress, 13 January 1795", "Die Seite mit der Abstimmung „ayes 41, noes 42“, einem Verfahrensantrag, bei dem von Deutsch nicht die Rede war.", "The page with the vote 'ayes 41, noes 42', a procedural motion in which German was not mentioned."),
    ("zion", "michaelis1816", C, "New_Lutheran_Church_Philadelphia_Birch's_Views_Plate_6.jpg",
     "Die Zionskirche in Philadelphia", "Zion Church, Philadelphia", "„New Lutheran Church, in Fourth Street“, Stich von William Birch & Son, 1799/1800.", "'New Lutheran Church, in Fourth Street', engraving by William Birch & Son, 1799/1800."),
    ("michaelis", "michaelis1816", C, "Old_Lutheran_Church_Birch's_Views_Plate_7.jpg",
     "Die Michaeliskirche in Philadelphia", "St. Michael's Church, Philadelphia", "„Old Lutheran Church, in Fifth Street“, Stich von William Birch & Son, 1800.", "'Old Lutheran Church, in Fifth Street', engraving by William Birch & Son, 1800."),
    ("hermann", "hermann1837", C, "Painting_of_Hermann,_Missouri.jpg",
     "Hermann, Missouri, um 1850", "Hermann, Missouri, about 1850", "Gemälde eines unbekannten Malers (Missouri History Museum).", "Painting by an unknown artist (Missouri History Museum)."),
    ("sazeitung", "sanantonio1854", C, "San_Antonio-Zeitung._(San_Antonio,_Tex.),_Vol._1,_No._47,_Ed._1_Saturday,_May_20,_1854_-_DPLA_-_6f0e089cf2a92c25560aa253be2cc5af_(page_2).jpg",
     "San Antonio Zeitung, 20. Mai 1854", "San Antonio Zeitung, 20 May 1854", "Seite 2 mit dem Bericht über die Convention vom 15. Mai und der Plattform.", "Page 2 with the report of the convention of 15 May and the platform."),
    ("douai", "sanantonio1854", C, "Adolph-Douai.jpg",
     "Adolf Douai", "Adolf Douai", "Der Redakteur der San Antonio Zeitung (1819–1888); Fotograf unbekannt.", "The editor of the San Antonio Zeitung (1819–1888); photographer unknown."),
    ("peck", "bennett1890", C, "George_W._Peck.jpg",
     "George W. Peck", "George W. Peck", "1890 mit den Stimmen der Gegner des Bennett-Gesetzes Bürgermeister von Milwaukee und Gouverneur; Gemälde von James Reeve Stuart.", "Elected mayor of Milwaukee and governor in 1890 with the votes of the Bennett Law's opponents; painting by James Reeve Stuart."),
    ("hoard", "bennett1890", C, "William_D._Hoard.jpg",
     "William Dempster Hoard", "William Dempster Hoard", "Der Gouverneur, der das Bennett-Gesetz verteidigte und 1890 verlor; Gemälde von James Reeve Stuart, 1891.", "The governor who defended the Bennett Law and lost in 1890; painting by James Reeve Stuart, 1891."),
    ("fritsche", "krieg1917", C, "Dr._L.A._Fritsche_LCCN2014716570.jpg",
     "Dr. L. A. Fritsche", "Dr. L. A. Fritsche", "Bürgermeister von New Ulm, am 1. Dezember 1917 vom Gouverneur abgesetzt (Bain News Service).", "Mayor of New Ulm, removed by the governor on 1 December 1917 (Bain News Service)."),
    ("harding", "krieg1917", C, "Babel_Proclamation_(1919).jpg",
     "Hardings Proklamation", "Harding's proclamation", "Letzte Seite der Ausfertigung mit Siegel, „Done at Des Moines, this twenty-third day of May, 1918“.", "Last page of the signed original with seal, 'Done at Des Moines, this twenty-third day of May, 1918'."),
    ("demokrat1918", "krieg1917", ("loc", "sn84027107/1918-09-07/ed-1", 1),
     "Der tägliche Demokrat, 7. September 1918", "Der tägliche Demokrat, 7 September 1918", "Die letzte Ausgabe: „An unsere Leser.“", "The last issue: 'An unsere Leser.'"),
    ("newulmpost", "krieg1917", ("loc", "sn85025556/1917-07-27/ed-1", 1),
     "New Ulm Post, 27. Juli 1917", "New Ulm Post, 27 July 1917", "Der Bericht über die Versammlung vom 25. Juli im Turnerpark.", "The report of the meeting of 25 July in Turner Park."),
    ("omahabee1923", "meyer1923", ("loc", "sn84024326/1923-06-05/ed-1", 1),
     "Omaha Morning Bee, 5. Juni 1923", "Omaha Morning Bee, 5 June 1923", "„Nebraska Language Law Held Invalid“.", "'Nebraska Language Law Held Invalid'."),
    ("usreports401", "meyer1923", ("pdf", "https://tile.loc.gov/storage-services/service/ll/usrep/usrep262/usrep262390/usrep262390.pdf", 401),
     "United States Reports, Bd. 262, S. 401", "United States Reports, vol. 262, p. 401", "Die Seite mit „those born with English on the tongue“.", "The page with 'those born with English on the tongue'."),
]


def get(url):
    req = urllib.request.Request(url, headers=UA)
    for k in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001
            if k == 3:
                raise
            print("  retry", url[:80], e)
            time.sleep(5 * (k + 1))


def commons(fname):
    q = urllib.parse.urlencode({"action": "query", "titles": "File:" + fname, "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 1600, "format": "json"})
    d = json.loads(get("https://commons.wikimedia.org/w/api.php?" + q))
    page = next(iter(d["query"]["pages"].values()))
    ii = page["imageinfo"][0]
    md = ii.get("extmetadata", {})
    lic = md.get("LicenseShortName", {}).get("value", "?")
    return ii.get("thumburl") or ii["url"], lic, ii["descriptionurl"]


def loc(path, sp):
    d = json.loads(get(f"https://www.loc.gov/resource/{path}/?sp={sp}&fo=json"))
    info = next(x["info"] for x in d["page"] if x.get("info"))   # the page's own IIIF service (not the item's first page)
    return info.replace("/info.json", "") + "/full/1600,/0/default.jpg", f"https://www.loc.gov/resource/{path}/?sp={sp}"


def save(pid, data):
    im = Image.open(io.BytesIO(data)).convert("RGB")
    im.thumbnail((1600, 1600))
    im.save(OUT / f"{pid}.jpg", quality=86)
    t = im.copy(); t.thumbnail((400, 400)); t.save(OUT / f"{pid}_t.jpg", quality=82)
    return im.size


def main(dry=False):
    out = []
    for pid, station, kind, *rest in PLATES:
        if kind == C:
            fname, titel, titel_en, cap, cap_en = rest
            url, lic, page = commons(fname)
            source, credit = page, f"Wikimedia Commons, {lic}"
        else:
            titel, titel_en, cap, cap_en = rest
            k = kind[0]
            if k == "ia":
                url = f"https://archive.org/download/{kind[1]}/page/n{kind[2]}_w1600.jpg"
                source, credit, lic = f"https://archive.org/details/{kind[1]}/page/n{kind[2]}", "Internet Archive, public domain (US government work)", "PD"
            elif k == "loc":
                url, source = loc(kind[1], kind[2])
                credit, lic = "Library of Congress, Chronicling America; printed before 1929, public domain", "PD"
            else:
                url, source, credit, lic = kind[1], kind[1], "United States Reports, vol. 262 (1923), US government work, public domain", "PD"
        print(f"{pid:14} {lic:28} {url[:90]}")
        if dry:
            continue
        if (OUT / f"{pid}.jpg").exists():
            im = Image.open(OUT / f"{pid}.jpg")
            out.append(dict(id=pid, station=station, titel=titel, titel_en=titel_en, caption=cap, caption_en=cap_en, source=source, credit=credit, w=im.size[0], h=im.size[1]))
            continue
        if kind != C and kind[0] == "pdf":
            import pymupdf
            doc = pymupdf.open(stream=get(url), filetype="pdf")
            idx = next(i for i in range(len(doc)) if "English on the tongue" in " ".join(doc[i].get_text().split()))
            data = doc[idx].get_pixmap(dpi=150).tobytes("jpg")
        else:
            data = get(url)
        w, h = save(pid, data)
        out.append(dict(id=pid, station=station, titel=titel, titel_en=titel_en, caption=cap, caption_en=cap_en, source=source, credit=credit, w=w, h=h))
        time.sleep(1.5)
    if not dry:
        pj = ROOT / "data" / "plates.json"
        pj.write_text(json.dumps({"titel": "Tafeln", "titel_en": "Plates",
                                  "lede": "Neunzehn gemeinfreie Bilder zu den neun Stationen: Handschriften, Stiche, Bildnisse, Zeitungsseiten und Seiten amtlicher Drucke. Jede Tafel nennt ihre Quelle.",
                                  "lede_en": "Nineteen public-domain images for the nine stations: manuscripts, engravings, portraits, newspaper pages and pages of official prints. Each plate names its source.",
                                  "plates": out}, ensure_ascii=False, indent=1), encoding="utf-8")
        print(len(out), "plates written")


if __name__ == "__main__":
    main("--dry" in sys.argv)
