// Collecte le rapport live (relais du tracker Geovoile) et accumule l'historique complet
// des traces et des classements dans data/history.json.
// Lancé toutes les 15 min par .github/workflows/collect.yml (Node 20+, aucune dépendance).
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const LIVE_URL = process.env.LIVE_URL || 'https://route-du-rhum-live.andamarco.workers.dev/live.json';
const OUT = new URL('../data/history.json', import.meta.url);
const RACE_START = Date.UTC(2026, 10, 1, 12, 2) / 1000;

const hist = await readFile(OUT, 'utf8')
    .then(JSON.parse)
    .catch(() => ({ updated: 0, tracks: {}, ranks: {} }));

const res = await fetch(`${LIVE_URL}?v=${Date.now()}`, {
    headers: { 'user-agent': 'rhum-tracker-collector (github action)' },
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const raw = await res.json();
const rep = raw?.reports;
const h = rep?.history?.[0];
if (!h?.lines?.length) {
    console.log('Rapport vide, rien à faire');
    process.exit(0);
}
const cols = rep.columns;
const ix = k => cols.indexOf(k);
const date = Date.parse(h.date) / 1000;

const merge = (a = [], b = []) => {
    const m = new Map(a.map(p => [p[0], p]));
    for (const p of b) m.set(p[0], p);
    return [...m.values()].filter(p => p[0] >= RACE_START - 3600).sort((x, y) => x[0] - y[0]);
};
const r5 = v => Math.round(v * 1e5) / 1e5;
const r1 = v => Math.round(v * 10) / 10;

let added = 0;
for (const line of h.lines) {
    const id = String(line[ix('boat')]);
    const track = (line[ix('track')] || [])
        .filter(p => Array.isArray(p) && p.length >= 3)
        .map(p => [p[0], r5(p[1]), r5(p[2]), r1(p[3] ?? 0)]);
    const before = hist.tracks[id]?.length ?? 0;
    hist.tracks[id] = merge(hist.tracks[id], track);
    added += hist.tracks[id].length - before;
    const rank = line[ix('rank')];
    if (rank) hist.ranks[id] = merge(hist.ranks[id], [[date, rank, r1(line[ix('dtl')] ?? 0)]]);
}

if (date <= hist.updated && !added) {
    console.log('Pas de nouveau rapport');
    process.exit(0);
}
hist.updated = Math.max(hist.updated, date);
await mkdir(new URL('../data/', import.meta.url), { recursive: true });
await writeFile(OUT, JSON.stringify(hist));
console.log(`Rapport ${h.date} : +${added} points, ${h.lines.length} bateaux`);
