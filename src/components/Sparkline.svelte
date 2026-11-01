<svg class="spark" viewBox="0 0 {VW} {VH}" preserveAspectRatio="none">
    {#if path}
        <defs>
            <linearGradient id="g-{uid}" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stop-color={color} stop-opacity="0.35" />
                <stop offset="1" stop-color={color} stop-opacity="0" />
            </linearGradient>
        </defs>
        <path d="{path} L{VW},{VH} L0,{VH} Z" fill="url(#g-{uid})" />
        <path d={path} fill="none" stroke={color} stroke-width="1.6" vector-effect="non-scaling-stroke" />
        {#if cursorX !== null}
            <line x1={cursorX} x2={cursorX} y1="0" y2={VH} class="cursor" />
        {/if}
    {/if}
</svg>

<script lang="ts">
    /** Points [t, valeur] */
    export let data: [number, number][] = [];
    export let color = '#3ea8ff';
    /** Inverse l'axe Y (utile pour un rang : 1 en haut) */
    export let invert = false;
    export let tMin: number | null = null;
    export let tMax: number | null = null;
    export let cursor: number | null = null;

    const VW = 300;
    const VH = 46;
    const uid = Math.random().toString(36).slice(2, 8);

    let path = '';
    let cursorX: number | null = null;

    $: {
        path = '';
        cursorX = null;
        if (data.length > 1) {
            const t0 = tMin ?? data[0][0];
            const t1 = tMax ?? data[data.length - 1][0];
            let lo = Infinity;
            let hi = -Infinity;
            for (const [, v] of data) {
                lo = Math.min(lo, v);
                hi = Math.max(hi, v);
            }
            if (hi === lo) hi = lo + 1;
            const x = (t: number) => ((t - t0) / Math.max(1, t1 - t0)) * VW;
            const y = (v: number) => {
                const n = (v - lo) / (hi - lo);
                return 3 + (invert ? n : 1 - n) * (VH - 6);
            };
            path = data.map(([t, v], i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
            if (cursor !== null) cursorX = x(cursor);
        }
    }
</script>

<style>
    .spark {
        width: 100%;
        height: 46px;
        display: block;
    }
    .cursor {
        stroke: rgba(255, 255, 255, 0.55);
        stroke-width: 1;
        stroke-dasharray: 2 2;
        vector-effect: non-scaling-stroke;
    }
</style>
