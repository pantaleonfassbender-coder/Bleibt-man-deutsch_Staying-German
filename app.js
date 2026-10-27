/* Bleibt man deutsch? – Staying German? — ein zweisprachiger Quellenapparat. Vanilla JS, Hash-Routen.
   Jede Einheit hat ihr Original in `lang` und die Übersetzung im jeweils anderen Feld (de/en). */
"use strict";

const view = document.getElementById("view");
const D = { stations: null, plates: null, numbers: null, texts: {} };

/* ------------------------------------------------------------ language */
let ui = "de";
try { ui = localStorage.getItem("bmd_ui") || ""; } catch (e) { /* storage blocked */ }
if (ui !== "de" && ui !== "en") ui = /^de\b/i.test(navigator.language || "") ? "de" : "en";
let mode = null;
try { mode = localStorage.getItem("bmd_lang"); } catch (e) { /* storage blocked */ }
if (!["ui", "orig", "both"].includes(mode)) mode = "ui";

const T = {
  de: {
    title: "Bleibt man deutsch?", nav: { "": "Übersicht", stations: "Stationen", legends: "Legenden", numbers: "Zahlen", plates: "Tafeln", sources: "Quellen" },
    switchTo: "English", loading: "Wird geladen…", all: "← Alle Stationen", cite: "Zitieren als",
    modes: { ui: "Auf Deutsch", orig: "Original", both: "Original + Übersetzung" },
    tr: "Übersetzung", origOf: "Original", srcNote: "Quellen und Editionsnotiz", decision: "Die Entscheidung", chosen: "So entschied die Gemeinde",
    then: "Was folgte", legendsH: "Was die Quellen richtigstellen", open: "Offen", planned: "in Arbeit", station: "Station",
    stTag: "Neun Stationen", stH: "Neun Generationen, eine Frage",
    stLede: "Jede Station ist ein belegter Streit, in dem eine deutsche Gemeinde in Amerika entschied, wie viel Deutsch sie behält. Die Gemeinde wandert: von Germantown und Philadelphia über Hermann in Missouri nach Wisconsin und Nebraska.",
    fail: "Der Apparat konnte nicht geladen werden: "
  },
  en: {
    title: "Staying German?", nav: { "": "Overview", stations: "Stations", legends: "Legends", numbers: "Numbers", plates: "Plates", sources: "Sources" },
    switchTo: "Deutsch", loading: "Loading…", all: "← All stations", cite: "Cite as",
    modes: { ui: "In English", orig: "Original", both: "Original + translation" },
    tr: "Translation", origOf: "Original", srcNote: "Sources and editorial note", decision: "The decision", chosen: "What the community decided",
    then: "What followed", legendsH: "What the sources correct", open: "Open", planned: "in preparation", station: "Station",
    stTag: "Nine stations", stH: "Nine generations, one question",
    stLede: "Each station is a documented dispute in which a German community in America decided how much German to keep. The community moves: from Germantown and Philadelphia by way of Hermann, Missouri, to Wisconsin and Nebraska.",
    fail: "The apparatus could not be loaded: "
  }
};
const S = k => T[ui][k];
const LANGS = { de: { de: "Deutsch", en: "German" }, en: { de: "Englisch", en: "English" }, nl: { de: "Niederländisch", en: "Dutch" } };
const L = (o, k) => (o && ui === "en" && o[k + "_en"] != null) ? o[k + "_en"] : (o ? o[k] : "");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const lname = l => LANGS[l] ? LANGS[l][ui] : l;
const VERSION = "1.0.0";
const getJSON = url => fetch(url + "?v=" + VERSION).then(r => { if (!r.ok) throw new Error(url); return r.json(); });
const plateOf = id => ((D.plates && D.plates.plates) || []).find(p => p.id === id);

function setUI(lang) {
  ui = lang;
  try { localStorage.setItem("bmd_ui", ui); } catch (e) { /* storage blocked */ }
  applyUI();
  route();
}

function applyUI() {
  document.documentElement.lang = ui;
  document.title = S("title");
  document.querySelectorAll(".top nav a[data-k]").forEach(a => a.textContent = S("nav")[a.dataset.k]);
  const b = document.getElementById("uiBtn");
  b.textContent = S("switchTo");
  b.lang = ui === "de" ? "en" : "de";
}

async function boot() {
  applyUI();
  document.getElementById("uiBtn").onclick = () => setUI(ui === "de" ? "en" : "de");
  [D.stations, D.plates, D.numbers] = await Promise.all(["data/stations.json", "data/plates.json", "data/numbers.json"].map(getJSON));
  document.getElementById("navPlates").hidden = !(D.plates.plates || []).length;
  window.addEventListener("hashchange", route);
  route();
}

const text = async id => (D.texts[id] = D.texts[id] || await getJSON(`data/${id}.json`));
const shipped = () => D.stations.stations.filter(s => s.shipped);

function route() {
  const [page, ...args] = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean);
  document.querySelectorAll(".top nav a").forEach(a => {
    const t = a.getAttribute("href").replace(/^#\/?/, "");
    a.classList.toggle("on", (t || "") === (page === "station" ? "stations" : page || ""));
  });
  view.innerHTML = "";
  window.scrollTo(0, 0);
  const pages = { "": overview, stations, station, legends, numbers, plates, sources };
  (pages[page || ""] || overview)(args);
}

/* ------------------------------------------------------------ overview */
const OVERVIEW = {
  de: {
    tag: "1683–1923 · Germantown · Philadelphia · Hermann · Milwaukee · Nebraska",
    h: "Bleibt man deutsch?",
    lede: "Im Oktober 1683 legten Familien aus Krefeld bei Philadelphia eine Stadt an, Germantown, mit eigenem Gericht, aber „nach denen Englischen Gesetzen“. Zweihundertvierzig Jahre später, am 4. Juni 1923, entschied der Oberste Gerichtshof der Vereinigten Staaten, dass ein Lehrer in Nebraska Kindern Deutsch beibringen durfte. Dazwischen stellte jede Generation deutscher Gemeinden in Amerika dieselbe Frage neu: in der Stadt, an der Wahlurne, in der Kirche, in der Schule, in der Zeitung.",
    body: "Dieser Apparat folgt neun solchen Entscheidungen durch ihre Dokumente, in gemeinfreien Drucken, jedes Original neben einer Übersetzung: Pastorius und der Protest gegen den Menschenhandel von 1688, die Wahlen und Freischulen der 1750er Jahre, die Petition von 1794, aus der die Muhlenberg-Legende wurde, der Strafprozess um den englischen Gottesdienst 1816, die deutsche Stadt Hermann, die Plattform von San Antonio 1854, das Bennett-Gesetz von 1889, der Krieg 1917 und das Urteil Meyer v. Nebraska 1923.",
    q: [
      ["Was entschieden die Gemeinden?", "Jede Station zeigt, welche Wege offenstanden, welchen die Gemeinde wählte und was daraus wurde. Gewalt gegen Deutsche steht in den Quellen und wird genannt; sie ist keine Entscheidung der Gemeinde."],
      ["Was ist Legende?", "Englisch sei nur mit einer Stimme Mehrheit Amtssprache geworden; das Bennett-Gesetz habe Deutsch verboten; die Deutschen hätten Lincoln gewählt. Die Seite „Legenden“ stellt neben jede Behauptung, was die Dokumente zeigen."],
      ["Wie viele waren es?", "Rund 5,5 Millionen Einwanderer aus Deutschland zwischen 1820 und 1919, 2,8 Millionen Deutschgeborene 1890, 641 deutschsprachige Zeitungen 1880, 276 im Jahr 1920. Die Seite „Zahlen“ nennt die amtlichen Reihen und ihre Grenzen."],
      ["Lässt sich das spielen?", "Das Begleitspiel Mit englischer Zunge ist frei spielbar: Man führt den Vorstand der Gemeinde durch neun Generationen. Die Gesetze, Urteile und Einwanderungswellen stehen fest; die Entscheidungen bewegen, was die Gemeinde behält."]
    ],
    have: "Die Stationen", qs: "Die Fragen"
  },
  en: {
    tag: "1683–1923 · Germantown · Philadelphia · Hermann · Milwaukee · Nebraska",
    h: "Staying German?",
    lede: "In October 1683 families from Krefeld laid out a town near Philadelphia, Germantown, with its own court but, as its founder wrote, 'according to the English laws'. Two hundred and forty years later, on 4 June 1923, the Supreme Court of the United States decided that a teacher in Nebraska might teach children German. In between, every generation of German communities in America asked the same question anew: in the town, at the polls, in church, in school, in the newspaper.",
    body: "This apparatus follows nine such decisions through their documents, in public-domain prints, each original beside a translation: Pastorius and the protest against the traffic in men of 1688; the elections and charity schools of the 1750s; the petition of 1794 that became the Muhlenberg legend; the criminal trial over English services in 1816; the German town of Hermann; the San Antonio platform of 1854; the Bennett Law of 1889; the war in 1917; and the judgment in Meyer v. Nebraska in 1923.",
    q: [
      ["What did the communities decide?", "Each station shows which ways were open, which one the community took and what came of it. Violence against Germans is in the sources and is named; it was not the community's decision."],
      ["What is legend?", "That English became the official language by a single vote; that the Bennett Law banned German; that the Germans elected Lincoln. The Legends page sets beside each claim what the documents show."],
      ["How many were there?", "About 5.5 million immigrants from Germany between 1820 and 1919; 2.8 million German-born in 1890; 641 German-language newspapers in 1880, 276 in 1920. The Numbers page gives the official series and their limits."],
      ["Can it be played?", "The companion game English on the Tongue is free to play: you lead the community's board through nine generations. Laws, judgments and waves of immigration are fixed; the decisions move what the community keeps."]
    ],
    have: "The stations", qs: "The questions"
  }
};

function chain(list) {
  return `<ol class="chain">${list.map(s => `<li class="${s.shipped ? "" : "planned"}"><a href="${s.shipped ? `#/station/${s.id}` : "#/stations"}">
    <div class="z"><b>${esc(s.zeit)}</b>${esc(L(s, "ort"))}</div>
    <div><h3>${s.nr}. ${esc(L(s, "titel"))}</h3><p class="fine">${esc(L(s, "frage"))}${s.shipped ? "" : ` · <i>${esc(S("planned"))}</i>`}</p></div></a></li>`).join("")}</ol>`;
}

function overview() {
  const O = OVERVIEW[ui];
  view.innerHTML = `
  <div class="hero one"><div>
    <span class="tag">${esc(O.tag)}</span><h1>${esc(O.h)}</h1>
    <p class="lede">${esc(O.lede)}</p><p class="readable">${esc(O.body)}</p></div></div>
  <h2>${esc(O.have)}</h2>${chain(D.stations.stations)}
  <h2>${esc(O.qs)}</h2>
  <div class="grid g2">${O.q.map(([h, p]) => `<div class="panel"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join("")}</div>`;
}

function stations() {
  view.innerHTML = `<span class="tag">${esc(S("stTag"))}</span><h1>${esc(S("stH"))}</h1><p class="lede">${esc(S("stLede"))}</p>${chain(D.stations.stations)}`;
}

/* ------------------------------------------------------------ one station */
function unitHTML(t, sec, u, hl) {
  const other = u.lang === "de" ? "en" : "de";
  const origTxt = u[u.lang], trTxt = u[other];
  const showOrig = mode === "orig" || mode === "both" || u.lang === ui;
  const showTr = (mode === "both" || (mode === "ui" && u.lang !== ui)) && trTxt;
  const cols = [];
  if (showOrig) cols.push(`<div class="${u.lang === ui ? "text" : "orig"}" lang="${esc(u.lang)}">${mode !== "orig" && u.lang !== ui ? `<span class="xl">${esc(S("origOf"))} · ${esc(lname(u.lang))}</span>` : ""}${esc(origTxt)}</div>`);
  if (showTr) cols.push(`<div class="text" lang="${esc(other)}"><span class="xl">${esc(S("tr"))}</span>${esc(trTxt)}</div>`);
  const src = (t.quellen || []).find(q => q.key === u.quelle);
  return `<div class="unit ${hl ? "hl" : ""}" id="u${u.n}">
    <div class="num"><a href="#/station/${t.id}/${sec.id}/${u.n}" title="${esc(S("cite"))} ${esc(L(t, "titel"))} [${u.n}]">[${u.n}]</a>
      ${u.pg ? `<span class="pg">${esc(u.pg)}</span>` : ""}</div>
    <div>${u.titel ? `<h4>${esc(L(u, "titel"))}</h4>` : ""}
      <div class="cols ${cols.length > 1 ? "" : "one"}">${cols.join("")}</div>
      ${src ? `<p class="fine">${esc(src.zitat)}${u.bild ? ` · ${esc(u.bild)}` : ""}</p>` : ""}</div>
    ${L(u, "note") ? `<div class="note">${esc(L(u, "note"))}</div>` : ""}</div>`;
}

async function station([id, secId, unitN]) {
  const st = shipped().find(s => s.id === id);
  if (!st) { location.hash = "#/stations"; return; }
  view.innerHTML = `<p class="fine">${esc(S("loading"))}</p>`;
  const t = await text(id);
  const sec = t.sections.find(s => s.id === secId) || t.sections[0];
  const sp = t.spiel || {};
  view.innerHTML = `
    <p class="fine"><a href="#/stations">${esc(S("all"))}</a></p>
    <span class="tag">${esc(S("station"))} ${t.nr} · ${esc(t.zeit)} · ${esc(L(t, "ort"))}</span>
    <h1>${esc(L(t, "titel"))}</h1>
    <p class="frage">${esc(L(t, "frage"))}</p>
    <p class="lede">${esc(L(t, "lede"))}</p>
    ${stPlates(id)}
    <nav class="toc">${t.sections.map(s => `<a href="#/station/${id}/${s.id}" class="${s.id === sec.id ? "on" : ""}">${esc(L(s, "titel"))}</a>`).join("")}</nav>
    <div class="panel readable"><h3>${esc(L(sec, "titel"))}</h3><p>${esc(L(sec, "blurb"))}</p></div>
    <div class="langbar" id="langbar">${["ui", "orig", "both"].map(k => `<button data-l="${k}" class="${k === mode ? "on" : ""}">${esc(S("modes")[k])}</button>`).join("")}</div>
    <div id="units">${sec.units.map(u => unitHTML(t, sec, u, String(u.n) === unitN)).join("")}</div>
    ${(sp.optionen || []).length ? `<div class="panel readable"><h3>${esc(S("decision"))}</h3><p>${esc(L(t, "frage"))}</p>
      <ul class="opt">${sp.optionen.map(o => `<li class="${o.gewaehlt ? "chosen" : ""}">${esc(L(o, "text"))}${o.gewaehlt ? `<span class="fine"><b>${esc(S("chosen"))}</b></span>` : ""}${o.beleg ? `<span class="fine">${esc(o.beleg)}</span>` : ""}</li>`).join("")}</ul>
      ${L(sp, "folgen") ? `<p><b>${esc(S("then"))}.</b> ${esc(L(sp, "folgen"))}</p>` : ""}</div>` : ""}
    ${(t.legenden || []).length ? `<div class="panel readable"><h3>${esc(S("legendsH"))}</h3>${t.legenden.map(legHTML).join("")}</div>` : ""}
    <div class="panel readable hinweis"><span class="tag">${esc(S("srcNote"))}</span><p>${esc(L(t, "hinweis"))}</p>
      <ul>${(t.quellen || []).map(q => `<li>${esc(q.zitat)}${q.url ? ` · <a href="${esc(q.url)}">${esc(q.url.replace(/^https?:\/\//, "").slice(0, 60))}</a>` : ""}</li>`).join("")}</ul>
      ${(t.offen || []).length ? `<p><b>${esc(S("open"))}.</b> ${t.offen.map(esc).join(" · ")}</p>` : ""}</div>`;
  view.querySelectorAll("#langbar button").forEach(b => b.onclick = () => {
    mode = b.dataset.l;
    try { localStorage.setItem("bmd_lang", mode); } catch (e) { /* storage blocked */ }
    route();
  });
  if (unitN) { const el = document.getElementById("u" + unitN); if (el) el.scrollIntoView({ block: "center" }); }
}

function stPlates(id) {
  const ps = ((D.plates && D.plates.plates) || []).filter(p => p.station === id);
  return ps.length ? `<div class="grid g4">${ps.map(p => `<figure class="plate card"><a href="assets/plates/${p.id}.jpg" target="_blank" rel="noopener"><img src="assets/plates/${p.id}_t.jpg" alt="${esc(L(p, "titel"))}"></a>
    <figcaption><b>${esc(L(p, "titel"))}</b><br>${esc(L(p, "caption"))}</figcaption></figure>`).join("")}</div>` : "";
}

const legHTML = l => `<div class="leg"><p class="claim">${esc(L(l, "behauptung"))}</p><p>${esc(L(l, "befund"))}</p>${l.beleg ? `<p class="fine">${esc(l.beleg)}</p>` : ""}</div>`;

/* ------------------------------------------------------------ legends, numbers, plates, sources */
async function legends() {
  view.innerHTML = `<span class="tag">${esc(S("nav").legends)}</span><h1>${esc(S("legendsH"))}</h1><div id="lg"><p class="fine">${esc(S("loading"))}</p></div>`;
  const docs = await Promise.all(shipped().map(s => text(s.id)));
  view.querySelector("#lg").innerHTML = docs.filter(t => (t.legenden || []).length).map(t => `
    <div class="panel readable"><span class="tag">${esc(S("station"))} ${t.nr} · ${esc(t.zeit)}</span>
    <h3><a href="#/station/${t.id}">${esc(L(t, "titel"))}</a></h3>${t.legenden.map(legHTML).join("")}</div>`).join("");
}

function numbers() {
  const N = D.numbers;
  view.innerHTML = `<span class="tag">${esc(S("nav").numbers)}</span><h1>${esc(L(N, "titel"))}</h1><p class="lede">${esc(L(N, "lede"))}</p>
    ${N.tables.map(tb => {
      const max = Math.max(...tb.rows.map(r => typeof r[1] === "number" ? r[1] : 0));
      return `<div class="panel"><h3>${esc(L(tb, "titel"))}</h3>
      <table class="num"><tr>${(ui === "en" ? tb.head_en : tb.head).map(h => `<th>${esc(h)}</th>`).join("")}<th></th></tr>
      ${tb.rows.map(r => `<tr><td>${esc(r[0])}</td><td class="r">${typeof r[1] === "number" ? r[1].toLocaleString(ui === "de" ? "de-DE" : "en-US") : esc(r[1])}</td>${r[2] != null ? `<td class="fine">${esc(ui === "en" && r[3] != null ? r[3] : r[2])}</td>` : "<td></td>"}<td>${typeof r[1] === "number" && max ? `<span class="bar" style="width:${Math.round(r[1] / max * 180)}px"></span>` : ""}</td></tr>`).join("")}</table>
      <p class="fine">${esc(L(tb, "quelle"))}</p></div>`;
    }).join("")}`;
}

function plates() {
  view.innerHTML = `<span class="tag">${esc(S("nav").plates)}</span><h1>${esc(L(D.plates, "titel"))}</h1><p class="lede">${esc(L(D.plates, "lede"))}</p>
    <div class="grid g4">${D.plates.plates.map(p => `<figure class="plate card"><a href="#" data-p="${p.id}"><img src="assets/plates/${p.id}_t.jpg" alt="${esc(L(p, "titel"))}"></a>
      <figcaption><b>${esc(L(p, "titel"))}</b><br>${esc(L(p, "caption"))}<br><i>${esc(p.credit)}</i> · <a href="${esc(p.source)}">${esc(ui === "de" ? "Quelle" : "Source")}</a></figcaption></figure>`).join("")}</div>`;
  view.querySelectorAll("[data-p]").forEach(a => a.onclick = e => {
    e.preventDefault();
    const p = plateOf(a.dataset.p);
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `<figure><img src="assets/plates/${p.id}.jpg" alt="${esc(L(p, "titel"))}"><figcaption class="cap"><b>${esc(L(p, "titel"))}.</b> ${esc(L(p, "caption"))}</figcaption></figure>`;
    lb.onclick = () => lb.remove();
    document.body.append(lb);
  });
}

const METHOD = {
  de: { tag: "Quellen, Methode, Grenzen", h: "Wie dieser Apparat gemacht ist", p: [
    ["Nur Gemeinfreies.", "Jeder Text stammt aus einem Druck vor 1929, aus Akten des Kongresses oder aus Urteilen des Obersten Gerichtshofs, die als Werke der US-Regierung gemeinfrei sind. Moderne Darstellungen werden genannt, nicht abgedruckt."],
    ["Die Seite ist maßgeblich.", "Jede Einheit ist am Seitenbild gelesen, nicht nur an der maschinellen Texterkennung. Schreibung und Zeichensetzung der Drucke bleiben erhalten; Auslassungen stehen als […], unsichere Lesungen als [?]."],
    ["Zwei Sprachen.", "Die Quellen sind deutsch oder englisch, je nachdem, wer schrieb. Jede Einheit steht in ihrer Sprache und daneben in einer Arbeitsübersetzung der Site (CC0). Wo es eine gemeinfreie Übersetzung der Zeit gibt, steht sie an ihrer Stelle und ist genannt."],
    ["Quellensprache.", "Die Texte sprechen über Indigene, Versklavte und Schwarze in den Worten ihrer Zeit. Diese Sprache bleibt stehen und wird in den Anmerkungen eingeordnet; nur das n-Wort ist als „n—“ gekürzt."],
    ["Gewalt.", "Ausschreitungen gegen Deutsche (Louisville 1855, Collinsville 1918) und Gewalt in Texas 1862 werden als Tatsachen genannt, nicht ausgemalt. Bilder von Toten zeigt der Apparat nicht."]
  ] },
  en: { tag: "Sources, method, limits", h: "How this apparatus is made", p: [
    ["Public domain only.", "Every text comes from a print before 1929, from the records of Congress or from opinions of the Supreme Court, which are works of the US government and in the public domain. Modern studies are named, not reprinted."],
    ["The page decides.", "Every unit is read against the page image, not only the machine text recognition. Spelling and punctuation of the prints are kept; omissions stand as […], doubtful readings as [?]."],
    ["Two languages.", "The sources are German or English, depending on who wrote. Every unit stands in its own language and beside it in a working translation by the site (CC0). Where a public-domain translation of the period exists, it stands in its place and is named."],
    ["The language of the sources.", "The texts speak of Indigenous people, the enslaved and Black Americans in the words of their time. That language is kept and placed in context in the notes; only the n-word is shortened to 'n—'."],
    ["Violence.", "Attacks on Germans (Louisville 1855, Collinsville 1918) and violence in Texas in 1862 are stated as facts, not dwelt on. The apparatus shows no images of the dead."]
  ] }
};

function sources() {
  const M = METHOD[ui];
  view.innerHTML = `<span class="tag">${esc(M.tag)}</span><h1>${esc(M.h)}</h1>
    <div class="readable">${M.p.map(([b, p]) => `<p><b>${esc(b)}</b> ${esc(p)}</p>`).join("")}</div><div id="srcs"></div>`;
  Promise.all(shipped().map(s => text(s.id))).then(docs => {
    view.querySelector("#srcs").innerHTML = docs.map(t => `<div class="panel readable"><b>${t.nr}. ${esc(L(t, "titel"))}</b>
      <ul class="fine">${(t.quellen || []).map(q => `<li>${esc(q.zitat)}</li>`).join("")}</ul></div>`).join("");
  });
}

boot().catch(e => { view.innerHTML = `<p>${esc(S("fail"))}${esc(e.message)}</p>`; });
