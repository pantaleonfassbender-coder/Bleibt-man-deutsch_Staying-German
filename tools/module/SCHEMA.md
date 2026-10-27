# Modul-Dateien des Apparats „Mit englischer Zunge / English on the Tongue“

Jedes Modul ist eine Station des Spiels und eine JSON-Datei `apparat/module/<id>.json` (UTF-8, `json.load` muss sie lesen). Am besten erzeugt ein kleines Python-Skript `apparat/module/build-<id>.py` die Datei, damit lange Texte nicht von Hand escaped werden.

## Aufbau

```json
{
  "id": "germantown",
  "nr": 1,
  "zeit": "1683–1707",
  "ort": "Germantown, Pennsylvanien", "ort_en": "Germantown, Pennsylvania",
  "titel": "…", "titel_en": "…",
  "frage": "Die Entscheidung der Gemeinde, als Frage (ein Satz)", "frage_en": "…",
  "lede": "3–5 Sätze: worum es geht, was die Gemeinde wirklich entschied, was daraus folgte", "lede_en": "…",
  "hinweis": "Editorische Notiz: welche Drucke, wie gelesen, Bildzählung (z. B. IA-Blatt = Seite + 11), was ausgelassen ist", "hinweis_en": "…",
  "quellen": [
    {"key": "pastorius1700", "zitat": "Vollständige Angabe des gemeinfreien Drucks", "url": "https://archive.org/details/…", "sprache": "de"}
  ],
  "sections": [
    {
      "id": "stadt", "titel": "…", "titel_en": "…",
      "blurb": "1–3 Sätze zum Abschnitt", "blurb_en": "…",
      "units": [
        {
          "n": 1,
          "quelle": "pastorius1700", "pg": "S. 34–35", "bild": "IA umstndigegeogr00past, Blatt n50",
          "titel": "…", "titel_en": "…",
          "lang": "de",
          "de": "Originaltext, wenn lang=de; sonst deutsche Arbeitsübersetzung",
          "en": "Originaltext, wenn lang=en; sonst englische Arbeitsübersetzung",
          "note": "optional: Erläuterung, Einordnung, Widerspruch", "note_en": "…"
        }
      ]
    }
  ],
  "legenden": [
    {"behauptung": "…", "behauptung_en": "…", "befund": "was die Quellen zeigen", "befund_en": "…", "beleg": "Einheit [n] oder Quelle mit Seite"}
  ],
  "spiel": {
    "optionen": [
      {"text": "eine Option, die die Gemeinde wirklich hatte oder die in der Quelle verlangt/erwogen wird", "text_en": "…", "beleg": "Einheit [n]", "gewaehlt": true}
    ],
    "folgen": "was nach der Entscheidung belegt geschah (Daten!)", "folgen_en": "…"
  },
  "tafeln": [{"motiv": "…", "url": "Commons- oder Bibliotheksseite", "lizenz": "PD / …", "geprueft": true}],
  "offen": ["was nicht geprüft oder nicht gefunden wurde"]
}
```

## Regeln für die Texte

- **Am Seitenbild gelesen.** Jede Einheit ist am Scan des gemeinfreien Drucks geprüft, nicht nur an der OCR. Seitenbilder dürfen in den Arbeitsordner geladen werden (nicht veröffentlichen). In `bild` steht, welches Blatt gelesen wurde.
- **Schreibung des Drucks.** ſ wird als s gesetzt, Silbentrennung am Zeilenende aufgelöst, Kustoden weggelassen. Auslassungen stehen als […], unsichere Lesungen als [?], Unlesbares als [unleserlich] bzw. [illegible]. Fraktur ist sorgfältig zu lesen.
- **Umfang.** 8 bis 20 Einheiten je Modul, jede Einheit ein zusammenhängender Absatz oder Abschnitt (etwa 80–600 Wörter). Die Kernstelle für die Entscheidung ist immer vollständig.
- **Übersetzung.** Englische Originale bekommen eine deutsche Arbeitsübersetzung, deutsche Originale eine englische. Die Übersetzung ist genau, im Ton sachlich und nicht modernisierend. Gibt es eine gemeinfreie zeitgenössische Übersetzung (z. B. Myers 1912 für Pastorius, Eben 1898 für Mittelberger), wird sie benutzt und als solche genannt.
- **Quellensprache.** Abwertende Wörter der Quellen bleiben stehen und werden in `note` eingeordnet. Ausnahme: Das n-Wort wird als „n—“ gesetzt.
- **Getrennte Ebenen.** Was die Quelle sagt, steht in `de`/`en`. Was nur die spätere Literatur weiß, steht in `note`, mit Angabe.
- **Gemeinfrei.** Nur Drucke vor 1929, US-Regierungswerke und Autoren, die vor mehr als 70 Jahren gestorben sind. Moderne Literatur darf nur in `note` genannt werden, nicht abgedruckt; jede Angabe ist per Crossref oder Bibliothekskatalog geprüft.
- **Keine Umgehung.** Cloudflare, Turnstile, CAPTCHAs und Bezahlschranken werden nicht umgangen; gesperrte Quellen gehören nach `offen`.
- **Spiel.** `spiel.optionen` enthält 3–5 belegte Optionen, die tatsächlich gewählte mit `gewaehlt: true`. Gewalt, Verbrechen und Tote sind nie Optionen, sie stehen nur in `folgen`.
