// Canvas renderer for the home page "world" section: 13 live products on a
// small isometric landscape, with four crews at work (build, connect, test,
// protect). It is framework-free on purpose: React owns the copy and
// controls, this module owns the frame loop and only touches the canvas
// plus a few absolutely positioned HTML tags inside `overlay`.

type Pt = [number, number];
type Team = 'dev' | 'auto' | 'qa' | 'sec';
type BuildingType = 'tower' | 'block' | 'stepped' | 'twin';

type Building = {
    x: number;
    y: number;
    h: number;
    type: BuildingType;
    id: number;
    faces: Pt[][];
};

type Palette = {
    ink: string;
    dim: string;
    line: string;
    lineStrong: string;
    accent: string;
    accentSoft: string;
    top: string;
    left: string;
    right: string;
    ground: string;
    groundSide: string;
    grid: string;
};

export type WorldStep = 'intro' | 'dev' | 'auto' | 'qa' | 'sec' | 'work';

export type WorldLabels = {
    product: (n: number) => string;
    select: string;
    newWing: (product: string, floor: number, of: number) => string;
    traceSteps: [string, string, string, string];
    blocked: string;
    blockedNote: string;
};

export type WorldOptions = {
    canvas: HTMLCanvasElement;
    stage: HTMLElement;
    overlay: HTMLElement;
    reduceMotion: boolean;
    labels: WorldLabels;
    onPick: (id: number) => void;
    onTrace: (hop: number) => void;
};

export type WorldHandle = {
    setStep: (step: WorldStep) => void;
    trace: () => void;
    securityExample: () => void;
    select: (id: number) => void;
    setPaused: (paused: boolean) => void;
    setLabels: (labels: WorldLabels) => void;
    destroy: () => void;
};

const GW = 28;
const GH = 24;
const TW = 40;
const TH = 20;
const ZH = 20;

function hash(x: number, y: number): number {
    let n = (x * 374761393 + y * 668265263) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);

    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

const BLOBS: Array<[number, number, number, number]> = [
    [6, 9, 4.8, 6.8],
    [4.5, 16, 2.6, 3.2],
    [13.5, 5.5, 3.6, 3.9],
    [14, 13.6, 3.6, 4.6],
    [21.5, 8.5, 5.4, 4.5],
    [24, 13, 2.4, 2.2],
    [21.5, 19, 3.6, 2.6],
];

const BUILDINGS: Building[] = (
    [
        [5, 7, 3.2, 'tower'],
        [7, 10, 1.6, 'block'],
        [5, 12, 3.8, 'stepped'],
        [7, 6, 1.5, 'twin'],
        [13, 5, 2.6, 'stepped'],
        [14, 7, 1.4, 'block'],
        [14, 12, 3.4, 'tower'],
        [13, 15, 1.8, 'twin'],
        [20, 8, 4.2, 'stepped'],
        [22, 10, 2.2, 'block'],
        [23, 7, 1.9, 'tower'],
        [21, 19, 2.2, 'stepped'],
        [22, 18, 1.4, 'block'],
    ] as Array<[number, number, number, BuildingType]>
).map(([x, y, h, type], id) => ({ x, y, h, type, id, faces: [] }));

// New wings added to existing products (not new products).
const SITES = [
    { x: 8, y: 10, h: 1.6, of: 1 },
    { x: 20, y: 9, h: 2.4, of: 8 },
];
const LINKS: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [0, 3],
    [4, 5],
    [6, 7],
    [8, 9],
    [9, 10],
    [11, 12],
    [1, 4],
    [6, 8],
];
const DOMES = [
    { x: 6, y: 9, r: 3.6 },
    { x: 14, y: 13.4, r: 2.6 },
    { x: 21.6, y: 8.6, r: 3.2 },
];
const ROUTES = [
    [0, 1, 2, 3],
    [4, 5],
    [6, 7],
    [8, 9, 10],
];
const TRACE_IDS = [3, 0, 4, 5];
const TRACE_HOPS: Array<[number, number]> = [
    [3, 0],
    [0, 4],
    [4, 5],
];
const FOCUS: Partial<Record<WorldStep, Team>> = {
    dev: 'dev',
    auto: 'auto',
    qa: 'qa',
    sec: 'sec',
};

const LAND: boolean[][] = (() => {
    const forced = new Set(
        [...BUILDINGS, ...SITES].map((b) => `${b.x},${b.y}`),
    );
    const rows: boolean[][] = [];

    for (let y = 0; y < GH; y++) {
        const row: boolean[] = [];

        for (let x = 0; x < GW; x++) {
            let on = forced.has(`${x},${y}`);

            for (const [bx, by, rx, ry] of BLOBS) {
                if (on) {
                    break;
                }

                const dx = (x - bx) / rx;
                const dy = (y - by) / ry;
                on = dx * dx + dy * dy < 1 - (hash(x, y) - 0.5) * 0.4;
            }

            row.push(on);
        }

        rows.push(row);
    }

    return rows;
})();

function isLand(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < GW && y < GH && LAND[y][x];
}

function iso(x: number, y: number, z = 0): Pt {
    return [((x - y) * TW) / 2, ((x + y) * TH) / 2 - z * ZH];
}

const BOX = (() => {
    let minX = 1e9;
    let maxX = -1e9;
    let minY = 1e9;
    let maxY = -1e9;

    for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
            if (!LAND[y][x]) {
                continue;
            }

            for (const [cx, cy] of [
                [x, y],
                [x + 1, y],
                [x, y + 1],
                [x + 1, y + 1],
            ]) {
                const [sx, sy] = iso(cx, cy);
                minX = Math.min(minX, sx);
                maxX = Math.max(maxX, sx);
                minY = Math.min(minY, sy);
                maxY = Math.max(maxY, sy);
            }
        }
    }

    return { minX, maxX, minY: minY - 4.5 * ZH, maxY };
})();

type Cam = { cx: number; cy: number; z: number };

function camAt(x: number, y: number, z: number): Cam {
    const [cx, cy] = iso(x, y, 1);

    return { cx, cy, z };
}

const OVERVIEW: Cam = {
    cx: (BOX.minX + BOX.maxX) / 2,
    cy: (BOX.minY + BOX.maxY) / 2,
    z: 1,
};
const CAMS: Record<WorldStep, Cam> = {
    intro: OVERVIEW,
    work: { ...OVERVIEW, z: 0.96 },
    dev: camAt(8.2, 10.4, 2.1),
    auto: camAt(9.5, 6.5, 1.35),
    qa: camAt(6, 8.6, 1.75),
    sec: camAt(21.6, 8.6, 1.8),
};

function readPalette(el: HTMLElement): Palette {
    const s = getComputedStyle(el);
    const v = (n: string, f: string) => s.getPropertyValue(n).trim() || f;

    return {
        ink: v('--q-cream', '#ece4d3'),
        dim: v('--q-dim', 'rgba(236,228,211,0.62)'),
        line: v('--q-line', 'rgba(236,228,211,0.12)'),
        lineStrong: v('--q-line-strong', 'rgba(236,228,211,0.22)'),
        accent: v('--q-accent', '#e8a84a'),
        accentSoft: v('--q-accent-soft', 'rgba(232,168,74,0.12)'),
        top: v('--q-face-top', '#26221c'),
        left: v('--q-face-left', '#1b1814'),
        right: v('--q-face-right', '#14120f'),
        ground: v('--q-ground', '#15130f'),
        groundSide: v('--q-face-right', '#14120f'),
        grid: v('--q-line', 'rgba(236,228,211,0.12)'),
    };
}

export function createWorld(opts: WorldOptions): WorldHandle {
    const { canvas, stage, overlay, reduceMotion, onPick, onTrace } = opts;
    let labels = opts.labels;
    const maybeCtx = canvas.getContext('2d');

    if (!maybeCtx) {
        return {
            setStep: () => {},
            trace: () => {},
            securityExample: () => {},
            select: () => {},
            setPaused: () => {},
            setLabels: () => {},
            destroy: () => {},
        };
    }

    const ctx: CanvasRenderingContext2D = maybeCtx;
    let pal = readPalette(stage);
    let dpr = 1;
    let cw = 0;
    let ch = 0;
    let base = 1;
    const cam: Cam = { ...CAMS.intro };
    const camT: Cam = { ...CAMS.intro };

    let simT = 0;
    let step: WorldStep = 'intro';
    let focus: Team | null = null;
    let selected = -1;
    let hover = -1;
    let traceT0: number | null = null;
    let lastHop = -2;
    let attacks: Array<{
        d: (typeof DOMES)[number];
        t0: number;
        demo: boolean;
        from: [number, number, number];
    }> = [];
    let flashes: Array<{
        d: (typeof DOMES)[number];
        t: number;
        x: number;
        y: number;
        demo: boolean;
    }> = [];
    let nextAttack = 4000;
    let running = false;
    let paused = false;
    let visible = true;
    let last = 0;
    let raf = 0;
    let pending = false;

    const S = () => base * cam.z;
    const P = (x: number, y: number, z = 0): Pt => {
        const s = S();
        const [ix, iy] = iso(x, y, z);

        return [cw / 2 + (ix - cam.cx) * s, ch / 2 + 14 + (iy - cam.cy) * s];
    };
    const lw = (n: number) => n * Math.max(0.7, Math.min(1.6, S()));
    const A = (team: Team) => (focus && focus !== team ? 0.3 : 1);

    const poly = (pts: Pt[], fill?: string, stroke?: string, w = 1) => {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);

        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i][0], pts[i][1]);
        }

        ctx.closePath();

        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }

        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = w;
            ctx.stroke();
        }
    };
    const line = (a: Pt, b: Pt) => {
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
    };

    function setCam(c: Cam, snap = false) {
        camT.cx = c.cx;
        camT.cy = c.cy;
        camT.z = c.z;

        if (snap || reduceMotion) {
            cam.cx = c.cx;
            cam.cy = c.cy;
            cam.z = c.z;
        }
    }

    // Terrain ------------------------------------------------------------
    function drawTerrain() {
        const d = 0.18;

        for (let s = 0; s < GW + GH; s++) {
            for (let x = 0; x <= s; x++) {
                const y = s - x;

                if (!isLand(x, y)) {
                    continue;
                }

                const t: Pt[] = [
                    P(x, y),
                    P(x + 1, y),
                    P(x + 1, y + 1),
                    P(x, y + 1),
                ];

                if (!isLand(x + 1, y)) {
                    poly(
                        [t[1], t[2], P(x + 1, y + 1, -d), P(x + 1, y, -d)],
                        pal.groundSide,
                        pal.lineStrong,
                        0.6,
                    );
                }

                if (!isLand(x, y + 1)) {
                    poly(
                        [t[3], t[2], P(x + 1, y + 1, -d), P(x, y + 1, -d)],
                        pal.left,
                        pal.lineStrong,
                        0.6,
                    );
                }

                poly(t, pal.ground);
                ctx.strokeStyle = pal.line;
                ctx.lineWidth = 0.5;
                poly(t, undefined, pal.line, 0.5);
                ctx.strokeStyle = pal.lineStrong;
                ctx.lineWidth = 0.7;

                if (!isLand(x, y - 1)) {
                    line(t[0], t[1]);
                }

                if (!isLand(x - 1, y)) {
                    line(t[0], t[3]);
                }
            }
        }
    }

    // Buildings ----------------------------------------------------------
    function box(
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        z0: number,
        z1: number,
        faces?: Pt[][],
        edge?: string,
        w = 0.8,
    ) {
        const top: Pt[] = [
            P(x0, y0, z1),
            P(x1, y0, z1),
            P(x1, y1, z1),
            P(x0, y1, z1),
        ];
        const right: Pt[] = [
            P(x1, y0, z0),
            P(x1, y1, z0),
            P(x1, y1, z1),
            P(x1, y0, z1),
        ];
        const left: Pt[] = [
            P(x0, y1, z0),
            P(x1, y1, z0),
            P(x1, y1, z1),
            P(x0, y1, z1),
        ];
        const e = edge ?? pal.lineStrong;
        poly(right, pal.right, e, w);
        poly(left, pal.left, e, w);
        poly(top, pal.top, e, w);

        if (z1 - z0 > 0.7) {
            ctx.strokeStyle = pal.line;
            ctx.lineWidth = 0.5;

            for (let f = z0 + 0.5; f < z1 - 0.15; f += 0.5) {
                line(P(x0, y1, f), P(x1, y1, f));
                line(P(x1, y1, f), P(x1, y0, f));
            }
        }

        faces?.push(top, right, left);
    }

    function building(b: Building) {
        b.faces = [];
        const sel = b.id === selected || b.id === hover;
        const edge = sel ? pal.accent : undefined;
        const w = sel ? 1.6 : 0.8;
        const { x, y, h } = b;

        if (b.type === 'tower') {
            box(x + 0.2, y + 0.2, x + 0.8, y + 0.8, 0, h, b.faces, edge, w);
            box(
                x + 0.38,
                y + 0.38,
                x + 0.6,
                y + 0.6,
                h,
                h + 0.25,
                b.faces,
                edge,
                w,
            );
        } else if (b.type === 'block') {
            box(x + 0.1, y + 0.12, x + 0.9, y + 0.88, 0, h, b.faces, edge, w);
            box(
                x + 0.55,
                y + 0.2,
                x + 0.8,
                y + 0.45,
                h,
                h + 0.18,
                b.faces,
                edge,
                w,
            );
        } else if (b.type === 'stepped') {
            box(
                x + 0.12,
                y + 0.12,
                x + 0.88,
                y + 0.88,
                0,
                h * 0.55,
                b.faces,
                edge,
                w,
            );
            box(
                x + 0.28,
                y + 0.28,
                x + 0.72,
                y + 0.72,
                h * 0.55,
                h,
                b.faces,
                edge,
                w,
            );
        } else {
            box(x + 0.12, y + 0.18, x + 0.46, y + 0.82, 0, h, b.faces, edge, w);
            box(
                x + 0.54,
                y + 0.18,
                x + 0.88,
                y + 0.82,
                0,
                h * 0.78,
                b.faces,
                edge,
                w,
            );
        }
    }

    const topOf = (b: Building) =>
        P(b.x + 0.5, b.y + 0.5, b.h + (b.type === 'tower' ? 0.25 : 0));

    // Figures ------------------------------------------------------------
    function figure(
        x: number,
        y: number,
        team: Team,
        phase: number,
        tool?: 'helmet' | 'board' | 'shield',
    ) {
        const s = S();
        const p = P(x, y);
        const bob = reduceMotion
            ? 0
            : Math.sin(simT / 240 + phase * 6) * 0.5 * s;
        const fs = s * 1.3;
        ctx.globalAlpha = A(team);
        ctx.fillStyle = pal.accent;
        ctx.strokeStyle = pal.accent;
        ctx.beginPath();
        ctx.ellipse(
            p[0],
            p[1] - 3.2 * fs + bob,
            1.9 * fs,
            3 * fs,
            0,
            0,
            Math.PI * 2,
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p[0], p[1] - 7.6 * fs + bob, 1.7 * fs, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1.1;

        if (tool === 'helmet') {
            ctx.fillRect(p[0] - 2.3 * fs, p[1] - 9.1 * fs + bob, 4.6 * fs, fs);
        }

        if (tool === 'board') {
            ctx.strokeRect(
                p[0] + 2 * fs,
                p[1] - 6 * fs + bob,
                2.6 * fs,
                3.4 * fs,
            );
        }

        if (tool === 'shield') {
            ctx.beginPath();
            ctx.arc(p[0] + 2.4 * fs, p[1] - 4 * fs + bob, 2.8 * fs, -1.2, 1.2);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    }

    // Construction: a slab is lowered, then the floor appears ------------
    const BUILD = 7200;
    const FLOORS = 6;
    const HOLD = 5000;
    const FADE = 1600;
    const CYCLE = BUILD * 2 + HOLD + FADE;

    function siteState(i: number) {
        const t = reduceMotion ? BUILD * 2 + 100 : simT % CYCLE;
        const s = SITES[i];
        const per = BUILD / FLOORS;
        const local = t - i * BUILD;
        const floors = Math.max(0, Math.min(FLOORS, Math.floor(local / per)));
        const frac = local < 0 || floors >= FLOORS ? 0 : (local % per) / per;
        const fade =
            t > BUILD * 2 + HOLD ? 1 - (t - BUILD * 2 - HOLD) / FADE : 1;

        return {
            s,
            floors,
            frac,
            building: local >= 0 && floors < FLOORS,
            fade,
            h: (s.h * floors) / FLOORS,
        };
    }

    function drawSite(i: number) {
        const st = siteState(i);
        const s = st.s;
        const a = A('dev');
        const x0 = s.x + 0.14;
        const x1 = s.x + 0.86;
        const y0 = s.y + 0.14;
        const y1 = s.y + 0.86;
        ctx.globalAlpha = 0.6 * a;
        ctx.setLineDash([3, 3]);
        poly(
            [P(x0, y0, s.h), P(x1, y0, s.h), P(x1, y1, s.h), P(x0, y1, s.h)],
            undefined,
            pal.accent,
            0.8,
        );
        ctx.strokeStyle = pal.accent;
        line(P(x1, y1), P(x1, y1, s.h));
        line(P(x0, y1), P(x0, y1, s.h));
        line(P(x1, y0), P(x1, y0, s.h));
        ctx.setLineDash([]);

        if (st.h > 0) {
            ctx.globalAlpha = a * st.fade;
            box(x0, y0, x1, y1, 0, st.h);
        }

        ctx.globalAlpha = a;
        const mx = s.x + 1.08;
        const my = s.y + 0.12;
        const mh = s.h + 1.3;
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = lw(1.1);
        line(P(mx, my), P(mx, my, mh));
        line(P(mx + 0.14, my), P(mx + 0.14, my, mh));

        for (let z = 0.4; z < mh; z += 0.45) {
            line(P(mx, my, z), P(mx + 0.14, my, z + 0.4));
        }

        const jx = s.x + 0.5;
        const jy = s.y + 0.5;
        line(P(mx, my, mh), P(jx - 0.2, jy, mh));
        line(P(mx, my, mh), P(mx + 0.45, my - 0.25, mh));
        const hookTop = mh - 0.1;
        const target = st.h + 0.05;
        const hz = st.building
            ? hookTop - (hookTop - target) * Math.min(1, st.frac / 0.7)
            : hookTop;
        ctx.lineWidth = 0.6;
        line(P(jx - 0.2, jy, mh), P(jx - 0.2, jy, hz + 0.08));

        if (st.building) {
            box(
                x0 + 0.06,
                y0 + 0.06,
                x1 - 0.06,
                y1 - 0.06,
                hz,
                hz + 0.08,
                undefined,
                pal.accent,
                1,
            );
        }

        ctx.globalAlpha = 1;
        figure(s.x + 0.05, s.y + 1.1, 'dev', i, 'helmet');
        figure(s.x + 0.8, s.y + 1.2, 'dev', i + 0.5, 'helmet');
    }

    // QA: an inspector arrives, then the check appears --------------------
    function qaPos(r: number[], i: number) {
        const leg = 2800;
        const total = r.length * leg;
        const local = reduceMotion ? leg * 0.85 : (simT + i * 700) % total;
        const li = Math.floor(local / leg);
        const f = (local % leg) / leg;
        const a = BUILDINGS[r[li]];
        const b = BUILDINGS[r[(li + 1) % r.length]];
        const w = Math.min(1, f / 0.7);
        const e = w * w * (3 - 2 * w);

        return {
            x: a.x + 1.1 + (b.x - a.x) * e,
            y: a.y + 1.05 + (b.y - a.y) * e,
            at: r[(li + 1) % r.length],
            age: f >= 0.7 ? (f - 0.7) * leg : -1,
        };
    }

    function badge(p: Pt, age: number, team: Team) {
        if (age < 0 || age > 900) {
            return;
        }

        const a = age < 150 ? age / 150 : age > 700 ? (900 - age) / 200 : 1;
        const s = S();
        const y = p[1] - (11 + age / 160) * s;
        const r = 5.4 * Math.max(0.8, s);
        ctx.globalAlpha = a * A(team);
        ctx.fillStyle = pal.top;
        ctx.beginPath();
        ctx.arc(p[0], y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p[0] - r * 0.45, y);
        ctx.lineTo(p[0] - r * 0.1, y + r * 0.38);
        ctx.lineTo(p[0] + r * 0.5, y - r * 0.38);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    // Automation: plug in, draw the link, light travels ------------------
    const arc = (a: Building, b: Building): Pt[] => {
        const pa = topOf(a);
        const pb = topOf(b);
        const d = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);

        return [pa, [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2 - d * 0.3], pb];
    };
    const bz = (q: Pt[], t: number): Pt => {
        const u = 1 - t;

        return [
            u * u * q[0][0] + 2 * u * t * q[1][0] + t * t * q[2][0],
            u * u * q[0][1] + 2 * u * t * q[1][1] + t * t * q[2][1],
        ];
    };
    const strokeArc = (q: Pt[], from: number, to: number) => {
        ctx.beginPath();
        const p0 = bz(q, from);
        ctx.moveTo(p0[0], p0[1]);

        for (let i = 1; i <= 20; i++) {
            const p = bz(q, from + ((to - from) * i) / 20);
            ctx.lineTo(p[0], p[1]);
        }

        ctx.stroke();
    };
    const light = (q: Pt[], t: number, len: number) => {
        const from = Math.max(0, t - len);
        const to = Math.min(1, t);

        if (to <= from) {
            return;
        }

        ctx.strokeStyle = pal.accentSoft;
        ctx.lineWidth = lw(5);
        strokeArc(q, from, to);
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = lw(1.8);
        strokeArc(q, from, to);
        const p = bz(q, to);
        ctx.fillStyle = pal.accent;
        ctx.beginPath();
        ctx.arc(p[0], p[1], lw(2.4), 0, Math.PI * 2);
        ctx.fill();
    };

    const INT = 4200;

    function pulse(p: Pt, k: number) {
        const s = S();
        ctx.globalAlpha = (1 - k) * A('auto');
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(
            p[0],
            p[1],
            (4 + k * 12) * s,
            (2 + k * 6) * s,
            0,
            0,
            Math.PI * 2,
        );
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    function drawLinks() {
        const active = reduceMotion ? 1 : Math.floor(simT / INT) % LINKS.length;
        const at = reduceMotion ? 0.8 : (simT % INT) / INT;
        const tracing = traceT0 !== null;

        LINKS.forEach(([ai, bi], i) => {
            const q = arc(BUILDINGS[ai], BUILDINGS[bi]);
            const a = A('auto');
            const isActive = i === active && !tracing;
            ctx.globalAlpha = a * 0.5;
            ctx.strokeStyle = pal.accent;
            ctx.lineWidth = lw(0.9);
            ctx.setLineDash([4, 4]);

            if (!isActive) {
                strokeArc(q, 0, 1);
            } else if (at > 0.15) {
                strokeArc(q, 0, Math.min(1, (at - 0.15) / 0.35));
            }

            ctx.setLineDash([]);
            ctx.globalAlpha = a;

            if (isActive && at > 0.5) {
                light(q, (at - 0.5) / 0.4, 0.22);
            }
        });

        if (!tracing) {
            const [ai, bi] = LINKS[active];
            const qa = BUILDINGS[ai];
            const qb = BUILDINGS[bi];

            if (at < 0.9) {
                figure(qa.x + 1.05, qa.y + 0.35, 'auto', 1, 'board');
                figure(qb.x + 1.05, qb.y + 0.35, 'auto', 2, 'board');
            }

            if (at > 0.08 && at < 0.2) {
                const k = (at - 0.08) / 0.12;
                pulse(topOf(qa), k);
                pulse(topOf(qb), k);
            }
        }
    }

    // Trace a workflow (visitor-triggered) -------------------------------
    const HOP = 1500;

    function traceState() {
        if (traceT0 === null) {
            return null;
        }

        const t = reduceMotion ? 1e9 : simT - traceT0;
        const hop = Math.min(TRACE_HOPS.length, Math.floor(t / HOP));

        return { t, hop, f: hop < TRACE_HOPS.length ? (t % HOP) / HOP : 1 };
    }

    function drawTrace() {
        const st = traceState();

        if (!st) {
            return;
        }

        TRACE_HOPS.forEach(([ai, bi], i) => {
            const q = arc(BUILDINGS[ai], BUILDINGS[bi]);
            ctx.strokeStyle = pal.accent;
            ctx.lineWidth = lw(1.8);

            if (i < st.hop) {
                strokeArc(q, 0, 1);
            } else if (i === st.hop) {
                strokeArc(q, 0, st.f);
                light(q, st.f, 0.25);
            }
        });

        if (st.hop !== lastHop) {
            lastHop = st.hop;
            onTrace(st.hop);
        }

        if (!reduceMotion && st.t > TRACE_HOPS.length * HOP + 3500) {
            clearTrace();
        }
    }

    function clearTrace() {
        traceT0 = null;
        lastHop = -2;
        onTrace(-1);
    }

    // Security ------------------------------------------------------------
    function domeGeo(d: (typeof DOMES)[number]) {
        const c = P(d.x, d.y);
        const s = S();
        const rx = d.r * Math.SQRT2 * (TW / 2) * s;
        const ry = d.r * Math.SQRT2 * (TH / 2) * s;

        return { c, rx, ry, h: ry * 1.25 + 1.6 * ZH * s };
    }

    function drawDome(d: (typeof DOMES)[number], topPart: boolean) {
        const g = domeGeo(d);
        const a = A('sec');
        const fl = flashes.reduce(
            (m, f) => (f.d === d ? Math.max(m, 1 - (simT - f.t) / 800) : m),
            0,
        );
        ctx.globalAlpha = a * (0.28 + Math.max(0, fl) * 0.6);
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = lw(0.8);

        if (!topPart) {
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.ellipse(g.c[0], g.c[1], g.rx, g.ry, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        } else {
            ctx.beginPath();
            ctx.ellipse(g.c[0], g.c[1], g.rx, g.h, 0, Math.PI, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = a * (0.12 + Math.max(0, fl) * 0.4);
            ctx.beginPath();
            ctx.ellipse(
                g.c[0],
                g.c[1],
                g.rx * 0.5,
                g.h,
                0,
                Math.PI,
                Math.PI * 2,
            );
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    }

    function launch(d: (typeof DOMES)[number], demo: boolean) {
        const ang = (hash(Math.floor(simT), 3) * 0.8 + 0.1) * Math.PI;
        const dir: Pt = [Math.cos(ang), -Math.sin(ang) * 0.4 - 0.6];
        attacks.push({
            d,
            t0: simT,
            demo,
            from: [d.x + dir[0] * 12, d.y + dir[1] * 12, 7],
        });
    }

    function drawAttacks() {
        if (!reduceMotion && traceT0 === null && simT > nextAttack) {
            launch(
                DOMES[
                    Math.floor(hash(Math.floor(simT / 1000), 9) * DOMES.length)
                ],
                false,
            );
            nextAttack = simT + 8500 + hash(simT | 0, 4) * 3000;
        }

        attacks = attacks.filter((k) => {
            const p = (simT - k.t0) / 1300;
            const g = domeGeo(k.d);
            const s0 = P(k.from[0], k.from[1], k.from[2]);
            const ang = Math.atan2(
                s0[1] - (g.c[1] - g.h * 0.6),
                s0[0] - g.c[0],
            );
            const hit: Pt = [
                g.c[0] + Math.cos(ang) * g.rx * 0.95,
                Math.min(g.c[1], g.c[1] + Math.sin(ang) * g.h * 0.95),
            ];

            if (p >= 1) {
                flashes.push({
                    d: k.d,
                    t: simT,
                    x: hit[0],
                    y: hit[1],
                    demo: k.demo,
                });

                return false;
            }

            const tp = Math.max(0, p - 0.12);
            ctx.globalAlpha = A('sec');
            ctx.strokeStyle = pal.ink;
            ctx.lineWidth = lw(1.4);
            line(
                [s0[0] + (hit[0] - s0[0]) * tp, s0[1] + (hit[1] - s0[1]) * tp],
                [s0[0] + (hit[0] - s0[0]) * p, s0[1] + (hit[1] - s0[1]) * p],
            );
            ctx.fillStyle = pal.ink;
            ctx.beginPath();
            ctx.arc(
                s0[0] + (hit[0] - s0[0]) * p,
                s0[1] + (hit[1] - s0[1]) * p,
                lw(2),
                0,
                Math.PI * 2,
            );
            ctx.fill();
            ctx.globalAlpha = 1;

            return true;
        });

        flashes = flashes.filter((f) => {
            const k = (simT - f.t) / 800;

            if (k < 1) {
                ctx.globalAlpha = (1 - k) * A('sec');
                ctx.strokeStyle = pal.accent;
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.arc(f.x, f.y, (3 + k * 16) * S(), 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            return f.demo ? k < 4.5 : k < 1;
        });
    }

    function defenders() {
        DOMES.forEach((d, i) => {
            const g = domeGeo(d);
            const bx = d.x - 0.3;
            const by = d.y + d.r * 0.55;
            const p = P(bx + 0.4, by + 0.2);
            const hot = flashes.some((f) => f.d === d && simT - f.t < 800);

            if (hot) {
                ctx.globalAlpha = A('sec') * 0.6;
                ctx.strokeStyle = pal.accent;
                ctx.lineWidth = 0.8;
                ctx.setLineDash([2, 3]);
                line([p[0], p[1] - 6 * S()], [g.c[0], g.c[1] - g.h]);
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
            }

            figure(bx + 0.4, by + 0.2, 'sec', i * 2, 'shield');
        });
    }

    // HTML tags ------------------------------------------------------------
    const tags: Record<string, HTMLDivElement> = {};

    function tag(id: string, text: string, sub?: string): HTMLDivElement {
        let el = tags[id];

        if (!el) {
            el = document.createElement('div');
            el.className = 'q-world-tag';
            overlay.appendChild(el);
            tags[id] = el;
        }

        const html = sub ? `${text}<small>${sub}</small>` : text;

        if (el.dataset.html !== html) {
            el.dataset.html = html;
            el.textContent = text;

            if (sub) {
                const small = document.createElement('small');
                small.textContent = sub;
                el.appendChild(small);
            }
        }

        return el;
    }

    function place(el: HTMLDivElement, p: Pt, show: boolean) {
        el.style.transform = `translate(${Math.round(p[0])}px, ${Math.round(p[1] - 8)}px) translate(-50%, -100%)`;
        el.classList.toggle('is-on', show);
    }

    function updateTags() {
        const st = traceState();
        TRACE_IDS.forEach((id, i) =>
            place(
                tag(`tr${i}`, labels.traceSteps[i]),
                topOf(BUILDINGS[id]),
                !!st && i <= st.hop,
            ),
        );

        const demo = flashes.find((f) => f.demo);
        const g = domeGeo(DOMES[2]);
        place(
            tag('sec', labels.blocked, labels.blockedNote),
            demo ? [demo.x, demo.y] : [g.c[0], g.c[1] - g.h],
            !!demo,
        );

        const hb = hover >= 0 ? BUILDINGS[hover] : null;
        place(
            tag('hover', hb ? labels.product(hb.id + 1) : '', labels.select),
            hb ? topOf(hb) : [0, 0],
            !!hb && selected !== hover,
        );

        const ss = siteState(0);
        const floor = Math.min(FLOORS, ss.floors + (ss.building ? 1 : 0));
        place(
            tag(
                'site',
                labels.newWing(labels.product(SITES[0].of + 1), floor, FLOORS),
            ),
            P(SITES[0].x + 0.5, SITES[0].y + 0.5, SITES[0].h + 1.6),
            step === 'dev',
        );
    }

    // Frame --------------------------------------------------------------
    function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, cw, ch);
        ctx.fillStyle = pal.grid;
        const g = 22 * Math.max(0.6, S());
        const offx = (((cw / 2 - cam.cx * S()) % g) + g) % g;
        const offy = (((ch / 2 - cam.cy * S()) % g) + g) % g;

        for (let x = offx; x < cw; x += g) {
            for (let y = offy; y < ch; y += g) {
                ctx.fillRect(x, y, 1, 1);
            }
        }

        drawTerrain();
        DOMES.forEach((d) => drawDome(d, false));

        const objs: Array<{ d: number; f: () => void }> = [];
        BUILDINGS.forEach((b) =>
            objs.push({ d: b.x + b.y, f: () => building(b) }),
        );
        SITES.forEach((s, i) =>
            objs.push({ d: s.x + s.y + 0.2, f: () => drawSite(i) }),
        );
        ROUTES.forEach((r, i) => {
            const q = qaPos(r, i);
            objs.push({
                d: q.x + q.y,
                f: () => figure(q.x, q.y, 'qa', i + 3, 'board'),
            });
        });
        objs.sort((a, b) => a.d - b.d).forEach((o) => o.f());

        defenders();
        drawLinks();
        drawTrace();
        ROUTES.forEach((r, i) => {
            const q = qaPos(r, i);
            badge(topOf(BUILDINGS[q.at]), q.age, 'qa');
        });
        DOMES.forEach((d) => drawDome(d, true));
        drawAttacks();
        updateTags();
    }

    function frame(now: number) {
        const dt = Math.min(64, now - (last || now));
        last = now;
        simT += dt;
        const k = 1 - Math.pow(0.002, dt / 1000);
        cam.cx += (camT.cx - cam.cx) * k;
        cam.cy += (camT.cy - cam.cy) * k;
        cam.z += (camT.z - cam.z) * k;
        draw();
        raf = requestAnimationFrame(frame);
    }

    function requestDraw() {
        if (running || pending) {
            return;
        }

        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            cam.cx = camT.cx;
            cam.cy = camT.cy;
            cam.z = camT.z;
            draw();
        });
    }

    function sync() {
        const should = !reduceMotion && !paused && visible && !document.hidden;

        if (should && !running) {
            running = true;
            last = 0;
            raf = requestAnimationFrame(frame);
        } else if (!should && running) {
            running = false;
            cancelAnimationFrame(raf);
        }

        if (!running) {
            requestDraw();
        }
    }

    function resize() {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        cw = stage.clientWidth;
        ch = stage.clientHeight;
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
        base = Math.min(
            (cw - 40) / (BOX.maxX - BOX.minX),
            (ch - 70) / (BOX.maxY - BOX.minY),
        );
        requestDraw();
    }

    // Picking --------------------------------------------------------------
    function inside(pt: Pt, poly2: Pt[]) {
        let c = false;

        for (let i = 0, j = poly2.length - 1; i < poly2.length; j = i++) {
            const [xi, yi] = poly2[i];
            const [xj, yj] = poly2[j];

            if (
                yi > pt[1] !== yj > pt[1] &&
                pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi
            ) {
                c = !c;
            }
        }

        return c;
    }

    function pick(e: MouseEvent): number {
        const r = canvas.getBoundingClientRect();
        const pt: Pt = [e.clientX - r.left, e.clientY - r.top];
        const order = [...BUILDINGS].sort((a, b) => b.x + b.y - (a.x + a.y));

        for (const b of order) {
            if (b.faces.some((f) => inside(pt, f))) {
                return b.id;
            }
        }

        return -1;
    }

    const onMove = (e: MouseEvent) => {
        const h = pick(e);

        if (h !== hover) {
            hover = h;
            canvas.style.cursor = h >= 0 ? 'pointer' : 'default';
            requestDraw();
        }
    };
    const onLeave = () => {
        hover = -1;
        requestDraw();
    };
    const onClick = (e: MouseEvent) => {
        const h = pick(e);

        if (h >= 0) {
            onPick(h);
        }
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    // Observers ------------------------------------------------------------
    const io = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        sync();
    });
    io.observe(stage);
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    const mo = new MutationObserver(() => {
        pal = readPalette(stage);
        requestDraw();
    });
    mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-public-theme', 'class'],
    });
    document.addEventListener('visibilitychange', sync);

    resize();
    sync();

    return {
        setStep(next) {
            if (next === step) {
                return;
            }

            step = next;
            focus = FOCUS[next] ?? null;

            if (next !== 'auto' && traceT0 !== null) {
                clearTrace();
            }

            if (next !== 'sec') {
                flashes = flashes.filter((f) => !f.demo);
            }

            if (selected < 0) {
                setCam(CAMS[next]);
            }

            requestDraw();
        },
        trace() {
            traceT0 = simT;
            lastHop = -2;
            setCam(CAMS.auto);
            requestDraw();
        },
        securityExample() {
            flashes = flashes.filter((f) => !f.demo);
            setCam(CAMS.sec);

            if (reduceMotion) {
                const g = domeGeo(DOMES[2]);
                flashes.push({
                    d: DOMES[2],
                    t: simT,
                    x: g.c[0],
                    y: g.c[1] - g.h,
                    demo: true,
                });
            } else {
                launch(DOMES[2], true);
            }

            requestDraw();
        },
        select(id) {
            selected = id;

            if (id >= 0) {
                const b = BUILDINGS[id];
                setCam(camAt(b.x + 0.5, b.y + 0.5, 2));
            } else {
                setCam(CAMS[step]);
            }

            requestDraw();
        },
        setPaused(p) {
            paused = p;
            sync();
        },
        setLabels(next) {
            labels = next;
            requestDraw();
        },
        destroy() {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            mo.disconnect();
            document.removeEventListener('visibilitychange', sync);
            canvas.removeEventListener('mousemove', onMove);
            canvas.removeEventListener('mouseleave', onLeave);
            canvas.removeEventListener('click', onClick);
            Object.values(tags).forEach((el) => el.remove());
        },
    };
}

export const WORLD_PRODUCT_COUNT = BUILDINGS.length;
