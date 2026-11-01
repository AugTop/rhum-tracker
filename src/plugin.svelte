<div class="plugin__mobile-header">{title}</div>

<section class="plugin__content rr">
    <!-- En-tête -->
    <header class="rr-head">
        <div class="rr-title" on:click={() => bcast.emit('rqstOpen', 'menu')}>
            <span class="rr-back">‹</span>
            <div>
                <div class="rr-kicker">13ᵉ édition · Saint-Malo → Pointe-à-Pitre</div>
                <h1>Route du Rhum <span>2026</span></h1>
            </div>
        </div>
        <div class="rr-meta">
            {#if isLive}
                <span class="rr-badge live"><i></i>DIRECT</span>
            {:else}
                <span class="rr-badge replay">REPLAY</span>
            {/if}
            <span class="rr-clock">{elapsed(tView)}</span>
            <button class="rr-icon" title="Actualiser" class:spin={loading} on:click={refresh}>⟳</button>
        </div>
    </header>

    {#if error && !snapshot}
        <div class="rr-empty">
            <b>Données indisponibles</b><br />{error}
            <button class="rr-btn" on:click={refresh}>Réessayer</button>
        </div>
    {:else if !snapshot}
        <div class="rr-empty"><span class="rr-loader"></span>Chargement de la flotte…</div>
    {:else}
        <div class="rr-sub">
            Rapport du {fmtDate(snapshot.reportDate)} · {snapshot.boats.length} bateaux
            {#if error}<span class="rr-warn" title={error}> · ⚠ mise à jour échouée</span>{/if}
        </div>

        <!-- Fiche bateau sélectionné -->
        {#if sel}
            {@const st = sel.state}
            {@const r = ranking.get(sel.id)}
            <article class="rr-card" style="--c:{sel.color}">
                <div class="rr-card-top">
                    <div class="rr-card-id">
                        <span class="rr-pill" style="--c:{classColor(sel.className)}">{sel.className}</span>
                        <h2>{sel.name}</h2>
                        <div class="rr-skipper">{sel.skipper || '—'} {#if sel.nat}<em>{sel.nat}</em>{/if}</div>
                    </div>
                    <div class="rr-rank">
                        {#if r?.rank}<b>{r.rank}</b><small>/{classCount(sel.className)}</small>{:else}<b>–</b>{/if}
                    </div>
                </div>

                <div class="rr-stats">
                    <div><small>Vitesse</small><b>{fx(selSpeed)}</b><i>nds</i></div>
                    <div><small>Cap</small><b>{Math.round(selHeading)}°</b><i>{cardinal(selHeading)}</i></div>
                    <div><small>Arrivée</small><b>{fx(r?.dtf, 0)}</b><i>mn</i></div>
                    <div><small>Écart leader</small><b>{r?.rank === 1 ? '—' : fx(r?.dtl, 1)}</b><i>{r?.rank === 1 ? 'en tête' : 'mn'}</i></div>
                    <div><small>24 h</small><b>{fx(selD24, 0)}</b><i>mn</i></div>
                    {#if isLive && st}
                        <div><small>VMG</small><b>{fx(st.vmg)}</b><i>nds</i></div>
                    {:else}
                        <div><small>Moy. 24 h</small><b>{fx(selD24 / 24)}</b><i>nds</i></div>
                    {/if}
                </div>

                {#if isLive && st}
                    <div class="rr-wx">
                        <div title="Vent">
                            <span class="rr-arrow" style="transform:rotate({st.windDir + 180}deg)">↑</span>
                            {fx(st.windSpeed, 0)}<small>/{fx(st.windGust, 0)} nds</small>
                        </div>
                        <div title="Vagues">
                            <span class="rr-arrow" style="transform:rotate({st.waveDir + 180}deg)">≈</span>
                            {fx(st.waveHeight)}<small> m</small>
                        </div>
                        <div title="Eau / air">🌡 {fx(st.tempWater, 0)}°<small> / {fx(st.tempAir, 0)}°</small></div>
                        <div title="Vitesse max 4 h">⚡ {fx(st.vitmax4)}<small> nds max 4h</small></div>
                    </div>
                {/if}

                <div class="rr-chart">
                    <div class="rr-chart-h">Vitesse <span>{fx(maxOf(selSpeeds))} nds max</span></div>
                    <Sparkline data={selSpeeds} color={sel.color} tMin={RACE_START} tMax={tNow} cursor={isLive ? null : tView} />
                </div>
                {#if sel.ranks.length > 1}
                    <div class="rr-chart">
                        <div class="rr-chart-h">Classement <span>meilleur : {Math.min(...sel.ranks.map(x => x[1]))}ᵉ</span></div>
                        <Sparkline data={sel.ranks.map(x => [x[0], x[1]])} color={classColor(sel.className)} invert tMin={RACE_START} tMax={tNow} cursor={isLive ? null : tView} />
                    </div>
                {/if}

                <div class="rr-card-actions">
                    <button class="rr-btn" class:on={follow} on:click={() => (follow = !follow)}>
                        {follow ? '◉ Suivi actif' : '◎ Suivre'}
                    </button>
                    <button class="rr-btn" on:click={() => centerOn(sel)}>⌖ Centrer</button>
                    <button class="rr-btn" class:on={favorites.has(sel.id)} on:click={() => toggleFav(sel.id)}>
                        {favorites.has(sel.id) ? '★' : '☆'}
                    </button>
                    <button class="rr-btn" on:click={() => select(null)}>✕</button>
                </div>
            </article>
        {/if}

        <!-- Onglets de classe -->
        <nav class="rr-tabs">
            <button class:on={tab === 'all'} on:click={() => (tab = 'all')}>Tous</button>
            {#each presentClasses as c}
                <button class:on={tab === c.name} style="--c:{c.color}" on:click={() => (tab = c.name)}>
                    <i></i>{c.name}<small>{classCount(c.name)}</small>
                </button>
            {/each}
            <button class:on={tab === 'fav'} on:click={() => (tab = 'fav')}>★<small>{favorites.size}</small></button>
        </nav>

        <div class="rr-tools">
            <input class="rr-search" placeholder="Bateau, skipper…" bind:value={query} />
            <button class="rr-btn" title="Voir les bateaux listés" on:click={fitVisible}>⤢</button>
            <button class="rr-btn" class:on={showSettings} title="Affichage" on:click={() => (showSettings = !showSettings)}>⚙</button>
        </div>

        {#if showSettings}
            <div class="rr-settings">
                <div class="rr-seg">
                    <span>Traces</span>
                    {#each [['all', 'Complètes'], ['48h', '48 h'], ['12h', '12 h'], ['none', 'Aucune']] as [v, l]}
                        <button class:on={trackMode === v} on:click={() => (trackMode = v)}>{l}</button>
                    {/each}
                </div>
                <div class="rr-seg">
                    <span>Couleurs</span>
                    <button class:on={colorBy === 'boat'} on:click={() => (colorBy = 'boat')}>Bateau</button>
                    <button class:on={colorBy === 'class'} on:click={() => (colorBy = 'class')}>Classe</button>
                </div>
                <div class="rr-seg">
                    <span>Noms</span>
                    <button class:on={labels === 'none'} on:click={() => (labels = 'none')}>Aucun</button>
                    <button class:on={labels === 'leaders'} on:click={() => (labels = 'leaders')}>Leaders</button>
                    <button class:on={labels === 'all'} on:click={() => (labels = 'all')}>Tous</button>
                </div>
                <div class="rr-seg">
                    <span>Carte</span>
                    <button class:on={mapScope === 'all'} on:click={() => (mapScope = 'all')}>Toute la flotte</button>
                    <button class:on={mapScope === 'tab'} on:click={() => (mapScope = 'tab')}>Onglet actif</button>
                </div>
            </div>
        {/if}

        <!-- Classement -->
        <ol class="rr-list">
            {#each rows as b (b.id)}
                {@const r = ranking.get(b.id)}
                <li class:sel={b.id === selected} class:out={!r?.rank} style="--c:{b.color}" on:click={() => select(b.id)}>
                    <span class="rr-pos">{r?.rank || statusLabel(b.state?.status)}</span>
                    <span class="rr-swatch"></span>
                    <span class="rr-who">
                        <b>{b.name}</b>
                        <small>{b.skipper}{#if tab === 'all' || tab === 'fav'}{(b.skipper ? ' · ' : '') + b.className}{/if}</small>
                    </span>
                    <span class="rr-num">
                        <b>{fx(r?.speed)}<i>nds</i></b>
                        <small>{r?.rank === 1 ? `${fx(r.dtf, 0)} mn` : r?.rank ? `+${fx(r.dtl, 1)}` : ''}</small>
                    </span>
                    <button class="rr-star" class:on={favorites.has(b.id)} on:click|stopPropagation={() => toggleFav(b.id)}>
                        {favorites.has(b.id) ? '★' : '☆'}
                    </button>
                </li>
            {:else}
                <li class="rr-none">Aucun bateau</li>
            {/each}
        </ol>

        <!-- Replay -->
        <footer class="rr-replay">
            <div class="rr-replay-row">
                <button class="rr-play" on:click={togglePlay} title={playing ? 'Pause' : 'Lecture'}>
                    {playing ? '❚❚' : '▶'}
                </button>
                <input
                    type="range"
                    min={RACE_START}
                    max={tNow}
                    step="60"
                    value={tView}
                    on:input={e => scrub(+e.currentTarget.value)}
                    style="--p:{((tView - RACE_START) / Math.max(1, tNow - RACE_START)) * 100}%"
                />
                <button class="rr-btn" class:on={isLive} on:click={goLive}>Direct</button>
            </div>
            <div class="rr-replay-row small">
                <span>{fmtDate(tView)}</span>
                <span class="rr-speeds">
                    {#each [1, 3, 6, 12] as s}
                        <button class:on={playSpeed === s} on:click={() => (playSpeed = s)}>×{s}h/s</button>
                    {/each}
                </span>
            </div>
            <div class="rr-src">
                Positions : tracker officiel (Geovoile){historyNote}
            </div>
        </footer>
    {/if}
</section>

<script lang="ts">
    import bcast from '@windy/broadcast';
    import { map } from '@windy/map';
    import { onDestroy, onMount } from 'svelte';

    import config from './pluginConfig';
    import Sparkline from './components/Sparkline.svelte';
    import { CLASSES, RACE_START, classColor } from './lib/boats';
    import {
        buildSnapshot,
        fetchLive,
        fetchRemoteHistory,
        liveToHistory,
        loadLocal,
        mergeHistory,
        saveLocal,
    } from './lib/data';
    import { dist24h, positionAt, speedSeries } from './lib/geo';
    import { RaceLayer } from './lib/mapLayer';

    import type { Boat, History, Snapshot } from './lib/data';
    import type { ColorMode, LabelMode, TrackMode } from './lib/mapLayer';

    const { title } = config;
    const REFRESH_MS = 10 * 60 * 1000;
    const LS_PREFS = 'rr2026-prefs-v1';

    // ---- État --------------------------------------------------------------
    let snapshot: Snapshot | null = null;
    let hist: History = loadLocal();
    let loading = false;
    let error = '';
    let remoteOk = false;

    let tab = 'all';
    let query = '';
    let selected: string | null = null;
    let follow = false;
    let showSettings = false;

    let favorites = new Set<string>();
    let trackMode: TrackMode = 'all';
    let colorBy: ColorMode = 'boat';
    let labels: LabelMode = 'leaders';
    let mapScope: 'all' | 'tab' = 'all';

    let time: number | null = null; // null = direct
    let playing = false;
    let playSpeed = 3; // heures de course par seconde

    let layer: RaceLayer | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let raf = 0;

    // ---- Préférences --------------------------------------------------------
    try {
        const p = JSON.parse(localStorage.getItem(LS_PREFS) || '{}');
        favorites = new Set(p.favorites ?? []);
        trackMode = p.trackMode ?? trackMode;
        colorBy = p.colorBy ?? colorBy;
        labels = p.labels ?? labels;
        mapScope = p.mapScope ?? mapScope;
    } catch {
        /* ignore */
    }
    $: try {
        localStorage.setItem(
            LS_PREFS,
            JSON.stringify({ favorites: [...favorites], trackMode, colorBy, labels, mapScope }),
        );
    } catch {
        /* ignore */
    }

    // ---- Dérivés ------------------------------------------------------------
    $: boats = snapshot?.boats ?? [];
    $: tNow = Math.max(
        snapshot?.reportDate ?? 0,
        ...boats.map(b => b.track[b.track.length - 1]?.[0] ?? 0),
        RACE_START + 60,
    );
    $: isLive = time === null;
    $: tView = time ?? tNow;
    $: presentClasses = CLASSES.filter(c => boats.some(b => b.className === c.name));

    interface Rank {
        rank: number;
        dtf: number;
        dtl: number;
        speed: number;
    }
    let ranking = new Map<string, Rank>();
    $: ranking = computeRanking(boats, tView, isLive);

    function computeRanking(list: Boat[], t: number, live: boolean): Map<string, Rank> {
        const out = new Map<string, Rank>();
        if (live) {
            for (const b of list) {
                const s = b.state;
                if (s) out.set(b.id, { rank: s.status === 'RAC' ? s.rank : 0, dtf: s.dtf, dtl: s.dtl, speed: s.speed });
            }
            return out;
        }
        const byClass = new Map<string, { b: Boat; dtf: number; speed: number }[]>();
        for (const b of list) {
            const p = positionAt(b.track, t);
            if (!p) continue;
            const arr = byClass.get(b.className) ?? [];
            arr.push({ b, dtf: p.dtf, speed: p.speed });
            byClass.set(b.className, arr);
        }
        byClass.forEach(arr => {
            arr.sort((x, y) => x.dtf - y.dtf);
            const lead = arr[0]?.dtf ?? 0;
            arr.forEach((x, i) => out.set(x.b.id, { rank: i + 1, dtf: x.dtf, dtl: x.dtf - lead, speed: x.speed }));
        });
        return out;
    }

    $: leaders = new Set([...ranking].filter(([, r]) => r.rank === 1).map(([id]) => id));

    $: rows = boats
        .filter(b => (tab === 'all' ? true : tab === 'fav' ? favorites.has(b.id) : b.className === tab))
        .filter(b => {
            const q = query.trim().toLowerCase();
            return !q || `${b.name} ${b.skipper} ${b.nat}`.toLowerCase().includes(q);
        })
        .sort((a, b) => {
            const ra = ranking.get(a.id);
            const rb = ranking.get(b.id);
            const ca = CLASSES.findIndex(c => c.name === a.className);
            const cb = CLASSES.findIndex(c => c.name === b.className);
            if (tab === 'all' || tab === 'fav') {
                // tri par classe (inconnues en dernier) puis rang
                if (ca !== cb) return (ca < 0 ? 99 : ca) - (cb < 0 ? 99 : cb);
            }
            return (ra?.rank || 999) - (rb?.rank || 999);
        });

    $: visible = new Set(
        boats
            .filter(b =>
                mapScope === 'all' ? true : tab === 'all' ? true : tab === 'fav' ? favorites.has(b.id) : b.className === tab,
            )
            .map(b => b.id),
    );

    $: sel = boats.find(b => b.id === selected) ?? null;
    $: selPos = sel ? positionAt(sel.track, tView) : null;
    $: selSpeed = sel ? (isLive && sel.state ? sel.state.speed : selPos?.speed ?? 0) : 0;
    $: selHeading = sel ? (isLive && sel.state ? sel.state.heading : selPos?.heading ?? 0) : 0;
    $: selSpeeds = sel ? speedSeries(sel.track) : [];
    $: selD24 = sel ? dist24h(sel.track, tView) : 0;

    $: historyNote = remoteOk ? ' · historique complet' : ' · historique accumulé localement';

    // ---- Rendu carte ----------------------------------------------------------
    $: if (layer && snapshot) {
        layer.render(boats, {
            time: tView,
            visible,
            selected,
            favorites,
            trackMode,
            labels,
            colorBy,
            leaders,
        });
    }
    $: if (follow && selPos) map.panTo([selPos.lat, selPos.lon], { animate: !playing });

    // ---- Données ------------------------------------------------------------
    async function refresh() {
        if (loading) return;
        loading = true;
        lastRefresh = Date.now();
        try {
            const [live, remote] = await Promise.all([fetchLive(), fetchRemoteHistory()]);
            remoteOk = !!remote;
            let h = hist;
            if (remote) h = mergeHistory(h, remote);
            h = mergeHistory(h, liveToHistory(live));
            hist = h;
            saveLocal(h);
            const first = !snapshot;
            snapshot = buildSnapshot(live, h);
            error = '';
            if (first) setTimeout(fitVisible, 50);
        } catch (e) {
            error = e instanceof Error ? e.message : String(e);
            console.warn('[Rhum]', e);
        } finally {
            loading = false;
        }
    }

    // ---- Actions ------------------------------------------------------------
    function select(id: string | null) {
        selected = selected === id ? null : id;
        if (!selected) follow = false;
        const b = boats.find(x => x.id === selected);
        if (b) centerOn(b);
    }

    function centerOn(b: Boat | null) {
        if (!b) return;
        const p = positionAt(b.track, tView);
        if (p) map.setView([p.lat, p.lon], Math.max(map.getZoom(), 6));
    }

    function fitVisible() {
        const pts = rows
            .map(b => positionAt(b.track, tView))
            .filter(Boolean)
            .map(p => [p!.lat, p!.lon] as [number, number]);
        if (!pts.length) return;
        map.fitBounds(new L.LatLngBounds(pts), { padding: [40, 40], maxZoom: 8 });
    }

    function toggleFav(id: string) {
        favorites.has(id) ? favorites.delete(id) : favorites.add(id);
        favorites = new Set(favorites);
    }

    function scrub(v: number) {
        time = v >= tNow - 60 ? null : v;
    }

    function goLive() {
        playing = false;
        time = null;
    }

    function togglePlay() {
        if (playing) {
            playing = false;
            return;
        }
        if (time === null || time >= tNow - 60) time = RACE_START;
        playing = true;
        let last = performance.now();
        let acc = 0;
        const step = (now: number) => {
            if (!playing) return;
            const dt = (now - last) / 1000;
            last = now;
            acc += dt;
            if (acc > 0.08) {
                // ~12 images/s pour ménager la carte
                const next = (time ?? RACE_START) + playSpeed * 3600 * acc;
                acc = 0;
                if (next >= tNow) {
                    goLive();
                    return;
                }
                time = next;
            }
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
    }

    // ---- Formatage ----------------------------------------------------------
    const fx = (v: number | undefined | null, d = 1) => (v === undefined || v === null || !isFinite(v) ? '–' : v.toFixed(d));
    const maxOf = (s: [number, number][]) => (s.length ? Math.max(...s.map(x => x[1])) : 0);
    const classCount = (c: string) => boats.filter(b => b.className === c).length;
    const DIRS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    const cardinal = (h: number) => DIRS[Math.round(((h % 360) + 360) % 360 / 22.5) % 16];
    const statusLabel = (s?: string) =>
        ({ ARV: '🏁', ABD: 'ABD', STM: 'ESC', DNS: 'DNS', DNF: 'DNF' } as Record<string, string>)[s ?? ''] ?? '–';

    function elapsed(t: number) {
        const s = Math.max(0, t - RACE_START);
        const d = Math.floor(s / 86400);
        const h = Math.floor((s % 86400) / 3600);
        const m = Math.floor((s % 3600) / 60);
        return `J+${d} ${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`;
    }
    const fmtDate = (t: number) =>
        new Date(t * 1000).toLocaleString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });

    // ---- Cycle de vie -------------------------------------------------------
    export const onopen = () => {
        if (snapshot) fitVisible();
    };

    // Les navigateurs ralentissent les timers des onglets en arrière-plan : on rattrape au retour
    let lastRefresh = 0;
    function onVisible() {
        if (document.visibilityState === 'visible' && Date.now() - lastRefresh > 60_000) refresh();
    }

    onMount(() => {
        layer = new RaceLayer(id => select(id));
        refresh();
        timer = setInterval(refresh, REFRESH_MS);
        document.addEventListener('visibilitychange', onVisible);
        window.addEventListener('online', refresh);
    });

    onDestroy(() => {
        playing = false;
        cancelAnimationFrame(raf);
        if (timer) clearInterval(timer);
        document.removeEventListener('visibilitychange', onVisible);
        window.removeEventListener('online', refresh);
        layer?.destroy();
        layer = null;
    });
</script>

<style lang="less">
    @bg: #0f1722;
    @card: #162131;
    @line: rgba(255, 255, 255, 0.08);
    @mute: #8a97a8;
    @acc: #2ee6a6;

    .rr {
        color: #e8edf3;
        font-size: 13px;
        padding-bottom: 8px;
        button {
            font: inherit;
            color: inherit;
            cursor: pointer;
        }
    }

    .rr-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 6px;
    }
    .rr-title {
        display: flex;
        gap: 6px;
        cursor: pointer;
        h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.02em;
            line-height: 1.1;
            span {
                background: linear-gradient(90deg, #2ee6a6, #3ea8ff);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }
        }
    }
    .rr-back {
        font-size: 22px;
        line-height: 1.6;
        color: @mute;
    }
    .rr-kicker {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: @mute;
    }
    .rr-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 3px;
    }
    .rr-badge {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.08em;
        padding: 2px 7px;
        border-radius: 20px;
        &.live {
            background: rgba(255, 77, 94, 0.15);
            color: #ff6b7a;
            i {
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #ff4d5e;
                margin-right: 5px;
                animation: rr-blink 1.4s infinite;
            }
        }
        &.replay {
            background: rgba(62, 168, 255, 0.15);
            color: #6dbdff;
        }
    }
    .rr-clock {
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        font-size: 12px;
    }
    .rr-icon {
        background: none;
        border: 0;
        font-size: 16px;
        padding: 0;
        &.spin {
            animation: rr-spin 1s linear infinite;
        }
    }
    .rr-sub {
        color: @mute;
        font-size: 11px;
        margin-bottom: 10px;
    }
    .rr-warn {
        color: #ffb020;
    }

    .rr-empty {
        padding: 30px 10px;
        text-align: center;
        color: @mute;
        .rr-btn {
            margin-top: 10px;
        }
    }
    .rr-loader {
        display: block;
        margin: 0 auto 10px;
        width: 22px;
        height: 22px;
        border: 2px solid @line;
        border-top-color: @acc;
        border-radius: 50%;
        animation: rr-spin 0.8s linear infinite;
    }

    .rr-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid @line;
        border-radius: 8px;
        padding: 5px 9px;
        font-size: 12px;
        white-space: nowrap;
        transition: background 0.15s;
        &:hover {
            background: rgba(255, 255, 255, 0.12);
        }
        &.on {
            background: rgba(46, 230, 166, 0.16);
            border-color: rgba(46, 230, 166, 0.5);
            color: @acc;
        }
    }

    /* Fiche */
    .rr-card {
        position: relative;
        background: linear-gradient(160deg, color-mix(in srgb, var(--c) 18%, @card), @card 55%);
        border: 1px solid color-mix(in srgb, var(--c) 35%, transparent);
        border-radius: 14px;
        padding: 12px;
        margin-bottom: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .rr-card-top {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        h2 {
            margin: 4px 0 1px;
            font-size: 16px;
            font-weight: 800;
            line-height: 1.15;
        }
    }
    .rr-skipper {
        color: #c3ccd8;
        em {
            font-style: normal;
            font-size: 10px;
            color: @mute;
            border: 1px solid @line;
            border-radius: 4px;
            padding: 0 4px;
            margin-left: 4px;
        }
    }
    .rr-pill {
        display: inline-block;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--c);
        background: color-mix(in srgb, var(--c) 15%, transparent);
        border-radius: 20px;
        padding: 1px 8px;
    }
    .rr-rank {
        text-align: right;
        b {
            font-size: 30px;
            font-weight: 900;
            line-height: 1;
        }
        small {
            color: @mute;
        }
    }
    .rr-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        margin: 10px 0 8px;
        div {
            background: rgba(0, 0, 0, 0.22);
            border-radius: 9px;
            padding: 6px 8px;
        }
        small {
            display: block;
            font-size: 10px;
            color: @mute;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        b {
            font-size: 17px;
            font-weight: 800;
            font-variant-numeric: tabular-nums;
        }
        i {
            font-style: normal;
            font-size: 10px;
            color: @mute;
            margin-left: 3px;
        }
    }
    .rr-wx {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px 10px;
        font-weight: 700;
        margin-bottom: 8px;
        small {
            font-weight: 400;
            color: @mute;
        }
    }
    .rr-arrow {
        display: inline-block;
        width: 14px;
        text-align: center;
        color: #6dbdff;
    }
    .rr-chart {
        margin-top: 6px;
    }
    .rr-chart-h {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: @mute;
        span {
            text-transform: none;
            letter-spacing: 0;
        }
    }
    .rr-card-actions {
        display: flex;
        gap: 6px;
        margin-top: 10px;
        .rr-btn:first-child {
            flex: 1;
        }
    }

    /* Onglets */
    .rr-tabs {
        display: flex;
        gap: 5px;
        overflow-x: auto;
        padding-bottom: 6px;
        scrollbar-width: none;
        button {
            --c: #9aa4b2;
            flex: none;
            display: flex;
            align-items: center;
            gap: 5px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid transparent;
            border-radius: 20px;
            padding: 4px 10px;
            font-size: 12px;
            i {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: var(--c);
            }
            small {
                color: @mute;
                font-size: 10px;
            }
            &.on {
                border-color: var(--c);
                background: color-mix(in srgb, var(--c) 16%, transparent);
            }
        }
    }
    .rr-tools {
        display: flex;
        gap: 6px;
        margin: 4px 0 8px;
    }
    .rr-search {
        flex: 1;
        min-width: 0;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid @line;
        border-radius: 8px;
        color: inherit;
        padding: 5px 9px;
        font-size: 12px;
        outline: none;
        &:focus {
            border-color: rgba(46, 230, 166, 0.5);
        }
    }
    .rr-settings {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid @line;
        border-radius: 10px;
        padding: 8px;
        margin-bottom: 8px;
        display: grid;
        gap: 6px;
    }
    .rr-seg {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
        span {
            width: 62px;
            font-size: 10px;
            text-transform: uppercase;
            color: @mute;
        }
        button {
            background: none;
            border: 1px solid @line;
            border-radius: 6px;
            padding: 2px 7px;
            font-size: 11px;
            &.on {
                background: #e8edf3;
                color: @bg;
                border-color: #e8edf3;
            }
        }
    }

    /* Liste */
    .rr-list {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
            display: grid;
            grid-template-columns: 24px 4px 1fr auto 18px;
            align-items: center;
            gap: 8px;
            padding: 6px 6px;
            border-radius: 9px;
            cursor: pointer;
            transition: background 0.12s;
            &:hover {
                background: rgba(255, 255, 255, 0.05);
            }
            &.sel {
                background: color-mix(in srgb, var(--c) 14%, transparent);
            }
            &.out {
                opacity: 0.5;
            }
            & + li {
                border-top: 1px solid rgba(255, 255, 255, 0.04);
            }
        }
    }
    .rr-none {
        color: @mute;
        justify-content: center;
        display: block !important;
        text-align: center;
    }
    .rr-pos {
        font-weight: 800;
        text-align: center;
        font-variant-numeric: tabular-nums;
        font-size: 12px;
    }
    .rr-swatch {
        width: 4px;
        height: 26px;
        border-radius: 2px;
        background: var(--c);
    }
    .rr-who {
        min-width: 0;
        b,
        small {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        b {
            font-weight: 700;
        }
        small {
            color: @mute;
            font-size: 11px;
        }
    }
    .rr-num {
        text-align: right;
        font-variant-numeric: tabular-nums;
        b {
            display: block;
            font-weight: 700;
        }
        i {
            font-style: normal;
            font-size: 9px;
            color: @mute;
            margin-left: 2px;
        }
        small {
            color: @mute;
            font-size: 11px;
        }
    }
    .rr-star {
        background: none;
        border: 0;
        padding: 0;
        color: @mute;
        font-size: 14px;
        &.on {
            color: #ffce21;
        }
    }

    /* Replay */
    .rr-replay {
        position: sticky;
        bottom: 0;
        margin-top: 10px;
        padding: 10px;
        background: rgba(15, 23, 34, 0.92);
        backdrop-filter: blur(6px);
        border: 1px solid @line;
        border-radius: 12px;
    }
    .rr-replay-row {
        display: flex;
        align-items: center;
        gap: 8px;
        &.small {
            margin-top: 6px;
            justify-content: space-between;
            font-size: 11px;
            color: #c3ccd8;
        }
        input[type='range'] {
            flex: 1;
            appearance: none;
            height: 4px;
            border-radius: 2px;
            background: linear-gradient(90deg, @acc var(--p), rgba(255, 255, 255, 0.15) var(--p));
            outline: none;
            &::-webkit-slider-thumb {
                appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #fff;
                box-shadow: 0 0 0 3px rgba(46, 230, 166, 0.35);
            }
            &::-moz-range-thumb {
                width: 14px;
                height: 14px;
                border: 0;
                border-radius: 50%;
                background: #fff;
            }
        }
    }
    .rr-play {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 0;
        background: @acc;
        color: @bg !important;
        font-size: 12px;
        font-weight: 900;
        flex: none;
    }
    .rr-speeds button {
        background: none;
        border: 0;
        padding: 0 3px;
        font-size: 11px;
        color: @mute;
        &.on {
            color: @acc;
            font-weight: 700;
        }
    }
    .rr-src {
        margin-top: 6px;
        font-size: 10px;
        color: @mute;
    }

    @keyframes rr-blink {
        50% {
            opacity: 0.25;
        }
    }
    @keyframes rr-spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* ---- Marqueurs carte (global) ---- */
    :global(.rr-boat-wrap) {
        background: none !important;
        border: 0 !important;
    }
    :global(.rr-boat-wrap.is-dim) {
        opacity: 0.4;
    }
    :global(.rr-boat) {
        position: relative;
        width: 24px;
        height: 24px;
        cursor: pointer;
    }
    :global(.rr-hull) {
        width: 24px;
        height: 24px;
        fill: var(--c);
        stroke: rgba(0, 0, 0, 0.75);
        stroke-width: 0.9;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
        transition: transform 0.4s;
    }
    :global(.rr-boat.is-sel .rr-hull) {
        stroke: #fff;
        stroke-width: 1.2;
        transform-origin: 50% 50%;
        scale: 1.35;
    }
    :global(.rr-pulse) {
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        border: 2px solid var(--c);
        animation: rr-pulse 1.8s ease-out infinite;
    }
    :global(.rr-label) {
        position: absolute;
        left: 22px;
        top: 3px;
        white-space: nowrap;
        font: 600 11px/1 system-ui, sans-serif;
        color: #fff;
        background: rgba(10, 16, 24, 0.78);
        border-left: 3px solid var(--c);
        padding: 3px 6px;
        border-radius: 3px;
        pointer-events: none;
    }
    :global(.rr-boat.is-sel .rr-label) {
        font-size: 12px;
        background: var(--c);
        color: #0b1118;
        border-left-color: #fff;
    }
    :global(.rr-mark-wrap) {
        background: none !important;
        border: 0 !important;
    }
    :global(.rr-mark) {
        position: relative;
    }
    :global(.rr-mark-dot) {
        display: block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid #0b1118;
        box-shadow: 0 0 0 2px #fff;
    }
    :global(.rr-mark-txt) {
        position: absolute;
        left: 20px;
        top: -1px;
        white-space: nowrap;
        font: 700 11px/1 system-ui, sans-serif;
        color: #fff;
        text-shadow: 0 1px 3px #000, 0 0 2px #000;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    @keyframes -global-rr-pulse {
        from {
            transform: scale(0.6);
            opacity: 0.9;
        }
        to {
            transform: scale(1.6);
            opacity: 0;
        }
    }
</style>
