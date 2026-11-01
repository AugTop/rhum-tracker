import type { TrackPoint } from './data';

const R_NM = 3440.065;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export function distNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R_NM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function bearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const y = Math.sin(rad(lon2 - lon1)) * Math.cos(rad(lat2));
    const x =
        Math.cos(rad(lat1)) * Math.sin(rad(lat2)) -
        Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lon2 - lon1));
    return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** Index du dernier point dont t <= time (−1 si aucun). */
export function indexAt(track: TrackPoint[], time: number): number {
    let lo = 0;
    let hi = track.length - 1;
    if (hi < 0 || track[0][0] > time) return -1;
    while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (track[mid][0] <= time) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}

export interface Pos {
    lat: number;
    lon: number;
    dtf: number;
    heading: number;
    speed: number;
    idx: number;
}

/** Position interpolée à l'instant `time`. */
export function positionAt(track: TrackPoint[], time: number): Pos | null {
    const i = indexAt(track, time);
    if (i < 0) return null;
    const a = track[i];
    const b = track[i + 1];
    if (!b) {
        const p = track[i - 1];
        return {
            lat: a[1],
            lon: a[2],
            dtf: a[3],
            heading: p ? bearing(p[1], p[2], a[1], a[2]) : 0,
            speed: p ? segSpeed(p, a) : 0,
            idx: i,
        };
    }
    const f = (time - a[0]) / Math.max(1, b[0] - a[0]);
    return {
        lat: a[1] + (b[1] - a[1]) * f,
        lon: a[2] + (b[2] - a[2]) * f,
        dtf: a[3] + (b[3] - a[3]) * f,
        heading: bearing(a[1], a[2], b[1], b[2]),
        speed: segSpeed(a, b),
        idx: i,
    };
}

export function segSpeed(a: TrackPoint, b: TrackPoint): number {
    const h = (b[0] - a[0]) / 3600;
    return h > 0 ? distNm(a[1], a[2], b[1], b[2]) / h : 0;
}

/** Série vitesse (nœuds) lissée sur la trace : [t, kn][] */
export function speedSeries(track: TrackPoint[], until = Infinity): [number, number][] {
    const out: [number, number][] = [];
    for (let i = 1; i < track.length && track[i][0] <= until; i++) {
        const s = segSpeed(track[i - 1], track[i]);
        if (s < 60) out.push([track[i][0], s]);
    }
    return out;
}

/** Distance parcourue sur 24h glissantes jusqu'à `time`. */
export function dist24h(track: TrackPoint[], time: number): number {
    let d = 0;
    for (let i = 1; i < track.length; i++) {
        if (track[i][0] > time) break;
        if (track[i][0] < time - 86400) continue;
        d += distNm(track[i - 1][1], track[i - 1][2], track[i][1], track[i][2]);
    }
    return d;
}
