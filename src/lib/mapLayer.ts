import { map } from '@windy/map';
import { FINISH, MULTIHULLS, START, classColor } from './boats';
import type { Boat, TrackPoint } from './data';
import { indexAt, positionAt } from './geo';

export type TrackMode = 'all' | '48h' | '12h' | 'none';
export type LabelMode = 'none' | 'leaders' | 'all';
export type ColorMode = 'boat' | 'class';

export interface RenderOpts {
    time: number;
    visible: Set<string>;
    selected: string | null;
    favorites: Set<string>;
    trackMode: TrackMode;
    labels: LabelMode;
    colorBy: ColorMode;
    leaders: Set<string>;
}

interface Item {
    line: L.Polyline;
    halo: L.Polyline;
    marker: L.Marker;
    iconKey: string;
    onMap: boolean;
}

// Silhouettes vues du dessus, étrave vers le haut, à l'échelle approximative des vrais bateaux
// (Ultim 32 m > IMOCA 18 m > Ocean Fifty 15 m > Class40 12 m).
const mirror = (d: string) => `<path d="${d}"/><path transform="matrix(-1 0 0 1 24 0)" d="${d}"/>`;
const MONO =
    '<path d="M12 1.5c3.2 4.6 4.6 9.6 4 15.4-.2 1.9-.6 3.5-1.1 5.1H9.1c-.5-1.6-.9-3.2-1.1-5.1-.6-5.8.8-10.8 4-15.4z"/>';
const MULTI =
    '<path d="M12 1.5c2 3.6 2.6 7.6 2.3 12.6-.1 2.6-.5 5.4-1 7.9h-2.6c-.5-2.5-.9-5.3-1-7.9C9.4 9.1 10 5.1 12 1.5z"/>' +
    mirror('M5.2 8.5c1.2 2.4 1.5 5.4 1.2 9.2-.1 1.4-.3 2.8-.6 4.3H4.4c-.3-1.5-.5-2.9-.6-4.3-.3-3.8 0-6.8 1.4-9.2z') +
    '<rect x="4.6" y="12.2" width="14.8" height="1.3" rx=".6"/>';
const SHAPES: Record<string, string> = {
    // Géant de 32 m : coque centrale effilée, longs flotteurs, deux bras de liaison
    Ultim:
        '<rect x="3" y="8.6" width="18" height="1.2" rx=".6"/><rect x="3" y="15.6" width="18" height="1.2" rx=".6"/>' +
        mirror('M3.5 5c.9 2.5 1.2 6 1.1 10-.1 2.5-.3 4.5-.6 6H3c-.3-1.5-.5-3.5-.6-6-.1-4 .2-7.5 1.1-10z') +
        '<path d="M12 1c1.3 3 1.8 7 1.7 12-.1 4-.5 7.5-.9 10h-1.6c-.4-2.5-.8-6-.9-10-.1-5 .4-9 1.7-12z"/>',
    // Trimaran compact de 15 m, presque aussi large que long
    'Ocean Fifty':
        '<rect x="4.5" y="10" width="15" height="1.2" rx=".6"/><rect x="4.5" y="15" width="15" height="1.2" rx=".6"/>' +
        mirror('M5 6.5c1 2 1.3 4.5 1.2 7-.1 2-.3 3.5-.6 5H4.4c-.3-1.5-.5-3-.6-5-.1-2.5.2-5 1.2-7z') +
        '<path d="M12 5c1.5 2.5 2 5.5 1.9 8.5-.1 2-.4 4-.8 5.5h-2.2c-.4-1.5-.7-3.5-.8-5.5-.1-3 .4-6 1.9-8.5z"/>',
    // Monocoque de 18 m à étrave ronde et large, foils déployés de chaque côté
    IMOCA:
        mirror('M7.6 9.2C5.5 9.6 4 10.4 3 11.6l.6.6c1-.9 2.4-1.5 3.9-1.7z') +
        '<path d="M12 3.5c3.2 1.1 4.6 4.5 4.6 8.5 0 3.5-.4 6.3-.9 8.5H8.3c-.5-2.2-.9-5-.9-8.5 0-4 1.4-7.4 4.6-8.5z"/>',
    // Monocoque de 12 m à étrave « scow » plate et carrée
    Class40:
        '<path d="M10 5.5h4c1.2 1 1.6 3.5 1.6 6 0 3-.3 5.3-.6 7H9c-.3-1.7-.6-4-.6-7 0-2.5.4-5 1.6-6z"/>',
    // Catamaran classique, coques fines reliées par deux bras
    'Vintage Multi':
        '<rect x="7" y="9" width="10" height="1.2" rx=".6"/><rect x="7" y="15" width="10" height="1.2" rx=".6"/>' +
        mirror('M7.5 4.5c1.3 2.5 1.7 5.5 1.6 8.5-.1 2.5-.4 4.7-.8 6.5H6.7c-.4-1.8-.7-4-.8-6.5-.1-3 .3-6 1.6-8.5z'),
    // Voilier classique étroit, étrave fine et arrière pointu
    'Vintage Mono':
        '<path d="M12 4.5c1.7 2.5 2.5 5.5 2.5 8.5 0 2.8-.8 5-2.5 6.5-1.7-1.5-2.5-3.7-2.5-6.5 0-3 .8-6 2.5-8.5z"/>',
};

const esc = (s: string) => s.replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);

function iconHtml(b: Boat, color: string, heading: number, sel: boolean, fav: boolean, label: boolean) {
    const shape = SHAPES[b.className] ?? (MULTIHULLS.has(b.className) ? MULTI : MONO);
    const cls = ['rr-boat', sel && 'is-sel', fav && 'is-fav', label && 'has-label'].filter(Boolean).join(' ');
    return `<div class="${cls}" style="--c:${color}">
        ${sel ? '<span class="rr-pulse"></span>' : ''}
        <svg class="rr-hull" viewBox="0 0 24 24" style="transform:rotate(${Math.round(heading)}deg)">${shape}</svg>
        ${label ? `<span class="rr-label">${fav ? '★ ' : ''}${esc(b.name)}</span>` : ''}
    </div>`;
}

function slice(track: TrackPoint[], from: number, to: number): [number, number][] {
    const out: [number, number][] = [];
    const end = indexAt(track, to);
    for (let i = 0; i <= end; i++) {
        if (track[i][0] >= from) out.push([track[i][1], track[i][2]]);
    }
    const head = positionAt(track, to);
    if (head && end >= 0 && track[end][0] < to) out.push([head.lat, head.lon]);
    return out;
}

export class RaceLayer {
    private group = new L.LayerGroup();
    private items = new Map<string, Item>();
    private marks: L.Marker[] = [];

    constructor(private onSelect: (id: string) => void) {
        this.group.addTo(map);
        for (const p of [START, FINISH]) {
            const m = new L.Marker([p.lat, p.lon], {
                icon: new L.DivIcon({
                    className: 'rr-mark-wrap',
                    html: `<div class="rr-mark"><span class="rr-mark-dot"></span><span class="rr-mark-txt">${p.label}</span></div>`,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7],
                }),
                interactive: false,
            });
            m.addTo(this.group);
            this.marks.push(m);
        }
    }

    private item(b: Boat): Item {
        let it = this.items.get(b.id);
        if (it) return it;
        const halo = new L.Polyline([], { color: '#fff', weight: 7, opacity: 0, interactive: false });
        const line = new L.Polyline([], { color: b.color, weight: 1.6, opacity: 0.8 });
        const marker = new L.Marker([0, 0], {
            icon: new L.DivIcon({ className: 'rr-boat-wrap', html: '', iconSize: [24, 24], iconAnchor: [12, 12] }),
        });
        line.on('click', () => this.onSelect(b.id));
        marker.on('click', () => this.onSelect(b.id));
        it = { line, halo, marker, iconKey: '', onMap: false };
        this.items.set(b.id, it);
        return it;
    }

    render(boats: Boat[], o: RenderOpts): void {
        const span = { all: Infinity, '48h': 48 * 3600, '12h': 12 * 3600, none: 0 }[o.trackMode];
        const anySel = !!o.selected;

        for (const b of boats) {
            const it = this.item(b);
            const show = o.visible.has(b.id) || b.id === o.selected;
            const pos = show ? positionAt(b.track, o.time) : null;

            if (!pos) {
                if (it.onMap) {
                    this.group.removeLayer(it.line);
                    this.group.removeLayer(it.halo);
                    this.group.removeLayer(it.marker);
                    it.onMap = false;
                }
                continue;
            }
            if (!it.onMap) {
                it.halo.addTo(this.group);
                it.line.addTo(this.group);
                it.marker.addTo(this.group);
                it.onMap = true;
            }

            const sel = b.id === o.selected;
            const fav = o.favorites.has(b.id);
            const color = o.colorBy === 'class' ? classColor(b.className) : b.color;
            const showTrack = span > 0 || sel;
            const from = sel ? -Infinity : o.time - span;
            const pts = showTrack ? slice(b.track, from, o.time) : [];

            it.line.setLatLngs(pts);
            it.halo.setLatLngs(sel ? pts : []);
            it.line.setStyle({
                color,
                weight: sel ? 3.2 : fav ? 2.2 : 1.5,
                opacity: anySel && !sel ? 0.28 : 0.85,
            });
            it.halo.setStyle({ opacity: sel ? 0.25 : 0 });

            // En direct, on préfère le cap officiel ; en replay, le cap déduit de la trace.
            const live = b.state && o.time >= (b.track[b.track.length - 1]?.[0] ?? 0);
            const heading = live && b.state ? b.state.heading : pos.heading;
            const label = sel || fav || o.labels === 'all' || (o.labels === 'leaders' && o.leaders.has(b.id));

            it.marker.setLatLng([pos.lat, pos.lon]);
            const key = `${color}|${Math.round(heading / 3)}|${sel}|${fav}|${label}|${anySel && !sel}`;
            if (key !== it.iconKey) {
                it.iconKey = key;
                it.marker.setIcon(
                    new L.DivIcon({
                        className: `rr-boat-wrap${anySel && !sel ? ' is-dim' : ''}`,
                        html: iconHtml(b, color, heading, sel, fav, label),
                        iconSize: [24, 24],
                        iconAnchor: [12, 12],
                    }),
                );
                it.marker.setZIndexOffset(sel ? 10000 : fav ? 5000 : label ? 1000 : 0);
            }
        }
        if (o.selected) this.items.get(o.selected)?.line.bringToFront();
    }

    destroy(): void {
        this.group.clearLayers();
        map.removeLayer(this.group);
        this.items.clear();
    }
}
