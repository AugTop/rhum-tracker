import { BOATS_BY_ID, CLASSES, RACE_START } from './boats';

// ---- Sources -------------------------------------------------------------
// Flux live (relais du tracker officiel Geovoile).
export const LIVE_URL = 'https://route-du-rhum-live.andamarco.workers.dev/live.json';
// Historique complet collecté par la GitHub Action du dépôt (voir collector/).
// Laisser vide = historique local uniquement.
export const HISTORY_URL = 'https://raw.githubusercontent.com/AugTop/rhum-tracker/main/data/history.json';

const LS_KEY = 'rr2026-history-v1';

// ---- Types ---------------------------------------------------------------
/** [unix s, lat, lon, dtf nm] */
export type TrackPoint = [number, number, number, number];
/** [unix s, rank, dtl nm] */
export type RankPoint = [number, number, number];

export interface History {
    updated: number;
    tracks: Record<string, TrackPoint[]>;
    ranks: Record<string, RankPoint[]>;
}

export interface BoatState {
    status: string;
    rank: number;
    dtf: number;
    dtl: number;
    heading: number;
    speed: number;
    vmg: number;
    vitmax4: number;
    dog: number;
    windDir: number;
    windSpeed: number;
    windGust: number;
    currentDir: number;
    currentSpeed: number;
    waveDir: number;
    waveHeight: number;
    tempAir: number;
    tempWater: number;
}

export interface Boat {
    id: string;
    name: string;
    skipper: string;
    className: string;
    color: string;
    nat: string;
    state: BoatState | null;
    track: TrackPoint[];
    ranks: RankPoint[];
}

export interface Snapshot {
    reportDate: number; // unix s
    state: string;
    boats: Boat[];
}

// ---- Parsing du rapport Geovoile -----------------------------------------
interface RawReport {
    reports?: {
        state?: string;
        columns?: string[];
        history?: { date: string; lines: unknown[][] }[];
    };
}

const num = (v: unknown): number => (typeof v === 'number' && isFinite(v) ? v : 0);

export function parseLive(raw: RawReport): {
    date: number;
    state: string;
    lines: { id: string; state: BoatState; track: TrackPoint[] }[];
} {
    const rep = raw?.reports;
    const cols = rep?.columns ?? [];
    const ix = (k: string) => cols.indexOf(k);
    const h = rep?.history?.[0];
    if (!h) throw new Error('Rapport vide');
    const g = (line: unknown[], k: string) => num(line[ix(k)]);

    const lines = h.lines.map(line => {
        const id = String(line[ix('boat')]);
        const state: BoatState = {
            status: String(line[ix('racestatus')] ?? ''),
            rank: g(line, 'rank'),
            dtf: g(line, 'dtf'),
            dtl: g(line, 'dtl'),
            heading: g(line, 'heading'),
            speed: g(line, 'speed'),
            vmg: g(line, 'vmg'),
            vitmax4: g(line, 'vitmax4'),
            dog: g(line, 'dog'),
            windDir: g(line, 'winddir'),
            windSpeed: g(line, 'windspeed') / 10,
            windGust: g(line, 'windgust') / 10,
            currentDir: g(line, 'currentdir'),
            currentSpeed: g(line, 'currentspeed') / 10,
            waveDir: g(line, 'wavedir'),
            waveHeight: g(line, 'waveheight') / 10,
            tempAir: g(line, 'tempair') / 10,
            tempWater: g(line, 'tempwater') / 10,
        };
        const trackRaw = (line[ix('track')] as unknown[][]) ?? [];
        const track = trackRaw
            .filter(p => Array.isArray(p) && p.length >= 3)
            .map(p => [num(p[0]), num(p[1]), num(p[2]), num(p[3])] as TrackPoint);
        return { id, state, track };
    });

    return { date: Date.parse(h.date) / 1000, state: rep?.state ?? '', lines };
}

/**
 * Les lignes Geovoile sont groupées par classe, rang 1..n dans chaque groupe.
 * On déduit la classe des bateaux inconnus à partir du groupe auquel ils appartiennent.
 */
function inferClasses(lines: { id: string; state: BoatState }[]): Map<string, string> {
    const groups: string[][] = [];
    let prevRank = Infinity;
    for (const l of lines) {
        if (l.state.status !== 'RAC' || !l.state.rank) continue;
        if (l.state.rank <= prevRank && l.state.rank === 1) groups.push([]);
        if (!groups.length) groups.push([]);
        groups[groups.length - 1].push(l.id);
        prevRank = l.state.rank;
    }
    const out = new Map<string, string>();
    const used = new Set<string>();
    groups.forEach(ids => {
        const known = ids.map(id => BOATS_BY_ID.get(id)?.className).find(Boolean);
        if (known) {
            used.add(known);
            ids.forEach(id => out.set(id, known));
        }
    });
    // Groupes sans aucun bateau connu : on suit l'ordre officiel des classes
    groups.forEach((ids, gi) => {
        if (out.has(ids[0])) return;
        const cls = CLASSES[gi]?.name ?? CLASSES.find(c => !used.has(c.name))?.name ?? 'Autres';
        ids.forEach(id => out.set(id, cls));
    });
    return out;
}

// ---- Historique -----------------------------------------------------------
export function emptyHistory(): History {
    return { updated: 0, tracks: {}, ranks: {} };
}

function mergeSorted<T extends number[]>(a: T[] = [], b: T[] = []): T[] {
    if (!b.length) return a;
    const m = new Map<number, T>();
    for (const p of a) m.set(p[0], p);
    for (const p of b) m.set(p[0], p);
    return [...m.values()].filter(p => p[0] >= RACE_START - 3600).sort((x, y) => x[0] - y[0]);
}

export function mergeHistory(base: History, add: History): History {
    const out: History = { updated: Math.max(base.updated, add.updated), tracks: {}, ranks: {} };
    const ids = new Set([...Object.keys(base.tracks), ...Object.keys(add.tracks)]);
    ids.forEach(id => (out.tracks[id] = mergeSorted(base.tracks[id], add.tracks[id])));
    const rids = new Set([...Object.keys(base.ranks), ...Object.keys(add.ranks)]);
    rids.forEach(id => (out.ranks[id] = mergeSorted(base.ranks[id], add.ranks[id])));
    return out;
}

export function liveToHistory(live: ReturnType<typeof parseLive>): History {
    const h = emptyHistory();
    h.updated = live.date;
    for (const l of live.lines) {
        h.tracks[l.id] = l.track;
        if (l.state.rank) h.ranks[l.id] = [[live.date, l.state.rank, l.state.dtl]];
    }
    return h;
}

export function loadLocal(): History {
    try {
        const s = localStorage.getItem(LS_KEY);
        return s ? (JSON.parse(s) as History) : emptyHistory();
    } catch {
        return emptyHistory();
    }
}

export function saveLocal(h: History): void {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(h));
    } catch {
        /* quota / mode privé : tant pis */
    }
}

async function getJSON<T>(url: string): Promise<T> {
    const sep = url.includes('?') ? '&' : '?';
    const r = await fetch(`${url}${sep}v=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
    return r.json() as Promise<T>;
}

export async function fetchRemoteHistory(): Promise<History | null> {
    if (!HISTORY_URL || HISTORY_URL.includes('<user>')) return null;
    try {
        return await getJSON<History>(HISTORY_URL);
    } catch (e) {
        console.warn('[Rhum] historique distant indisponible', e);
        return null;
    }
}

export async function fetchLive() {
    return parseLive(await getJSON<RawReport>(LIVE_URL));
}

export function buildSnapshot(live: ReturnType<typeof parseLive>, hist: History): Snapshot {
    const classes = inferClasses(live.lines);
    const boats: Boat[] = live.lines.map(l => {
        const meta = BOATS_BY_ID.get(l.id);
        const className = meta?.className ?? classes.get(l.id) ?? 'Autres';
        return {
            id: l.id,
            name: meta?.name ?? `Bateau n°${l.id}`,
            skipper: meta?.skipper ?? '',
            className,
            color: meta?.color ?? '#cfd6e0',
            nat: meta?.nat ?? '',
            state: l.state,
            track: hist.tracks[l.id] ?? l.track,
            ranks: hist.ranks[l.id] ?? [],
        };
    });
    return { reportDate: live.date, state: live.state, boats };
}
