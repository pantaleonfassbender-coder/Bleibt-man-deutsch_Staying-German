# Bleibt man deutsch? – Staying German?

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23708959.svg)](https://doi.org/10.5281/zenodo.23708959)

Ein zweisprachiger Quellenapparat: deutsche Gemeinden in Amerika, 1683–1923. Neun Stationen, an denen eine Gemeinde entschied, wie viel Deutsch sie behält – in der Stadt, an der Wahlurne, in der Kirche, in der Schule, in der Zeitung –, in gemeinfreien Drucken, jedes Original neben einer Übersetzung. Die Oberfläche lässt sich zwischen Deutsch und Englisch umschalten.

*A bilingual documentary apparatus: German communities in America, 1683–1923. Nine stations at which a community decided how much German to keep – in the town, at the polls, in church, in school, in the newspaper – in public-domain prints, each original beside a translation. The interface switches between German and English.*

**Stand:** Stufe 1, Version 1.0.0: neun Module mit 156 Einheiten, jede am Seitenbild gelesen, dazu Legenden, amtliche Zahlenreihen und 19 Bildtafeln.

- **1. Eine eigene Stadt nach englischem Recht** (1683–1707, Germantown, Pennsylvanien): 18 Einheiten. Pastorius, *Umständige Geographische Beschreibung* (1700) mit Myers (1912); Pennypacker, *The Settlement of Germantown* (1899); der Protest vom 18. April 1688.
- **2. Wen wählen, welche Schule?** (1739–1764, Pennsylvanien): 18 Einheiten. William Smith, *A Brief State of the Province of Pennsylvania* (1755); Weisers Aufrufe (PMHB 1899); Franklins *Observations* (Drucke 1755); Sauer in den Übersetzungen von 1754 und bei H. W. Smith (1879) und Weber (1905).
- **3. Ein gewisser Teil der Gesetze** (1794–1795, Kongress in Philadelphia; Augusta County, Virginia): 12 Einheiten. House Journal und Annals of Congress, 28. November 1794 bis 16. Februar 1795; 1 Stat. 443; Löher (1847); Seidensticker (PMHB 1889).
- **4. Mit Leib und Leben** (1804–1817, St. Michaelis und Zion, Philadelphia, Pennsylvanien): 20 Einheiten. *Trial of Frederick Eberle and others* (1817), Kurzschriftbericht; Sibole, *Centennial* (1906).
- **5. Eine deutsche Stadt mit Englisch als Fach** (1836–1849, Philadelphia und Hermann, Missouri): 20 Einheiten. W. G. Bek, *The German Settlement Society of Philadelphia and its Colony, Hermann, Missouri* (1907), mit der Charter von 1849.
- **6. Ein Uebel, aber Sache der Staaten** (1854–1856, San Antonio, Texas): 14 Einheiten. F. L. Olmsted, *A Journey through Texas* (1857); *San Antonio-Zeitung*, 20. Mai 1854.
- **7. Zwei Wörter im Gesetz: „in the English language“** (1889–1891 (Illinois bis 1893), Wisconsin (Milwaukee, Watertown, Manitowoc) und Illinois): 20 Einheiten. Laws of Wisconsin 1889 und 1891; Laws of Illinois 1889 und 1893; L. P. Kellogg (1918); Zeitungen aus Chronicling America.
- **8. Was entscheidet die Gemeinde selbst?** (1917–1918, New Ulm (Minnesota), Davenport und Germania/Lakota (Iowa), Monroe (Wisconsin)): 20 Einheiten. *New Ulm Review*, *New Ulm Post*, *Der tägliche Demokrat*, Iowa-Zeitungen 1917–1918; Report of the Minnesota Commission of Public Safety (1919); 40 Stat. 411.
- **9. Die verlängerte Mittagspause** (1919–1923, Hamilton County, Nebraska): 14 Einheiten. *Meyer v. Nebraska*, 262 U.S. 390, und *Bartels v. Iowa*, 262 U.S. 404 (1923); *Tägliche Omaha Tribüne* 1919; *Omaha Bee* 1922 und 1923.

**Nur Gemeinfreies.** Drucke vor 1929, Akten des Kongresses, Urteile des Obersten Gerichtshofs (Werke der US-Regierung) und Zeitungen aus Chronicling America. Moderne Darstellungen werden genannt, nicht abgedruckt. Das n-Wort ist in den Quellen als „n—“ gekürzt; sonst bleibt die Sprache der Quellen stehen und wird in den Anmerkungen eingeordnet.

**Begleitspiel:** *Mit englischer Zunge – English on the Tongue*, ein freies Spiel über neun Generationen: https://mit-englischer-zunge.netlify.app/ und https://leofassb.itch.io/mit-englischer-zunge (dort auch das Lesebuch).

## Aufbau

Statische Site ohne Build-Schritt: `index.html`, `app.js` (Hash-Routen, Sprachumschalter), `style.css`, `legal.html`; Daten in `data/` (`stations.json`, `numbers.json`, `plates.json`, je Station eine Datei); Tafeln in `assets/plates/`.

- `tools/module/build-<id>.py` enthält die Transkriptionen und Übersetzungen einer Station und schreibt `tools/module/<id>.json`; `tools/module/SCHEMA.md` beschreibt das Format, `tools/module/check-module.py` prüft es.
- `tools/build-site.py` baut `data/` aus den Modulen, `tools/get-plates.py` lädt die Tafeln und schreibt `data/plates.json`.

Jede Einheit trägt ihre Sprache im Feld `lang`; das Original steht im Feld dieser Sprache (`de` oder `en`), die Übersetzung im anderen.

Lokal: `python -m http.server` im Repository, dann `http://localhost:8000/`.

## Lizenzen

Code MIT; redaktionelle Texte CC BY 4.0; Editionen und Übersetzungen CC0 1.0. Siehe [LICENSES.md](LICENSES.md).

## Zitieren

Pantaleon Fassbender, *Bleibt man deutsch? – Staying German? Deutsche Gemeinden in Amerika 1683–1923. Ein zweisprachiger Quellenapparat* (2026), [doi:10.5281/zenodo.23708959](https://doi.org/10.5281/zenodo.23708959) (alle Versionen; Version 1.0.0: [doi:10.5281/zenodo.23708961](https://doi.org/10.5281/zenodo.23708961)). Für jede übernommene Stelle bitte auch die gedruckte Quelle zitieren.
