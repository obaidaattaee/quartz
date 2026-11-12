import { useEffect, useRef } from 'react';

import { useLocale } from '@/hooks/use-locale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// One building on one plot, with all four teams at work:
// builders on the roof (development), integrators wiring systems in
// (automation), an inspector on a lift (QA) and a defender under the
// shield (security). Everything is drawn on a canvas; the four team
// labels are HTML so they stay readable and translatable.

type Pt = [number, number];
type Palette = {
    ink: string;
    dim: string;
    line: string;
    lineStrong: string;
    accent: string;
    top: string;
    left: string;
    right: string;
    window: string;
    ground: string;
};

const TW = 40;
const TH = 20;
const ZH = 17;
const PLOT = 7;
const FOOT: [number, number, number, number] = [2.3, 2.3, 4.7, 4.7];
const FLOOR = 0.75;
const BASE_FLOORS = 6;
const NEW_FLOORS = 3;
const FLOOR_MS = 2400;
const HOLD_MS = 3200;
const FADE_MS = 1400;
const CYCLE_MS = NEW_FLOORS * FLOOR_MS + HOLD_MS + FADE_MS;
const SERVER: Pt = [0.9, 5.2];
const DATABASE: Pt = [5.2, 0.9];
const DEFENDER: Pt = [5.6, 5.4];

function readPalette(el: HTMLElement): Palette {
    const s = getComputedStyle(el);
    const v = (name: string, fallback: string) =>
        s.getPropertyValue(name).trim() || fallback;

    return {
        ink: v('--q-cream', '#ece4d3'),
        dim: v('--q-dim', 'rgba(236,228,211,0.62)'),
        line: v('--q-line', 'rgba(236,228,211,0.12)'),
        lineStrong: v('--q-line-strong', 'rgba(236,228,211,0.22)'),
        accent: v('--q-accent', '#e8a84a'),
        top: v('--q-face-top', '#26221c'),
        left: v('--q-face-left', '#1b1814'),
        right: v('--q-face-right', '#14120f'),
        window: v('--q-window', 'rgba(232,168,74,0.75)'),
        ground: v('--q-ground', '#15130f'),
    };
}

function hash(x: number, y: number): number {
    let n = (x * 374761393 + y * 668265263) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);

    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

export default function HeroBuilding() {
    const { isRTL } = useLocale();
    const reduceMotion = useReducedMotion();
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});

    const labels = isRTL
        ? { build: 'بناء', test: 'اختبار', connect: 'ربط', protect: 'حماية' }
        : {
              build: 'Build',
              test: 'Test',
              connect: 'Connect',
              protect: 'Protect',
          };

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!wrap || !canvas || !ctx) {
            return;
        }

        let pal = readPalette(wrap);
        let dpr = 1;
        let cw = 0;
        let ch = 0;
        let scale = 1;
        let ox = 0;
        let oy = 0;
        let simT = 0;
        let last = 0;
        let raf = 0;
        let running = false;
        let visible = true;
        let nextAttack = 3000;
        let attack: { t0: number; side: number } | null = null;
        let flashAt = -1e9;

        const P = (x: number, y: number, z = 0): Pt => [
            ox + (((x - y) * TW) / 2) * scale,
            oy + (((x + y) * TH) / 2) * scale - z * ZH * scale,
        ];

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

        const box = (
            x0: number,
            y0: number,
            x1: number,
            y1: number,
            z0: number,
            z1: number,
            alpha = 1,
        ) => {
            ctx.globalAlpha = alpha;
            poly(
                [P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)],
                pal.right,
                pal.lineStrong,
                0.8,
            );
            poly(
                [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)],
                pal.left,
                pal.lineStrong,
                0.8,
            );
            poly(
                [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)],
                pal.top,
                pal.lineStrong,
                0.8,
            );
            ctx.globalAlpha = 1;
        };

        const figure = (
            x: number,
            y: number,
            z: number,
            phase: number,
            tool?: 'shield' | 'board',
        ) => {
            const p = P(x, y, z);
            const s = scale * 1.25;
            const bob = reduceMotion
                ? 0
                : Math.sin(simT / 260 + phase * 5) * 0.5 * s;
            ctx.fillStyle = pal.accent;
            ctx.beginPath();
            ctx.ellipse(
                p[0],
                p[1] - 3.2 * s + bob,
                1.9 * s,
                3 * s,
                0,
                0,
                Math.PI * 2,
            );
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p[0], p[1] - 7.6 * s + bob, 1.7 * s, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = pal.accent;
            ctx.lineWidth = 1.1;

            if (tool === 'shield') {
                ctx.beginPath();
                ctx.arc(p[0] + 2.6 * s, p[1] - 4 * s + bob, 3 * s, -1.2, 1.2);
                ctx.stroke();
            }

            if (tool === 'board') {
                ctx.strokeRect(
                    p[0] + 2 * s,
                    p[1] - 6 * s + bob,
                    2.6 * s,
                    3.4 * s,
                );
            }
        };

        const place = (key: string, p: Pt) => {
            const el = labelRefs.current[key];

            if (el) {
                el.style.transform = `translate(${Math.round(p[0])}px, ${Math.round(p[1])}px)`;
            }
        };

        const resize = () => {
            dpr = Math.min(2, window.devicePixelRatio || 1);
            cw = wrap.clientWidth;
            ch = wrap.clientHeight;
            canvas.width = Math.round(cw * dpr);
            canvas.height = Math.round(ch * dpr);
            // Fit the plot plus the tallest building and crane.
            const worldW = PLOT * TW;
            const worldH =
                PLOT * TH + (FLOOR * (BASE_FLOORS + NEW_FLOORS) + 2.4) * ZH;
            scale = Math.min((cw - 24) / worldW, (ch - 24) / worldH);
            ox = cw / 2;
            oy =
                (ch - worldH * scale) / 2 +
                (FLOOR * (BASE_FLOORS + NEW_FLOORS) + 2.4) * ZH * scale;
            draw();
        };

        const draw = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, cw, ch);

            const t = reduceMotion
                ? NEW_FLOORS * FLOOR_MS - FLOOR_MS * 0.4
                : simT % CYCLE_MS;
            const building = t < NEW_FLOORS * FLOOR_MS;
            const built = Math.min(NEW_FLOORS, Math.floor(t / FLOOR_MS));
            const frac = building ? (t % FLOOR_MS) / FLOOR_MS : 0;
            const fade =
                t > NEW_FLOORS * FLOOR_MS + HOLD_MS
                    ? 1 - (t - NEW_FLOORS * FLOOR_MS - HOLD_MS) / FADE_MS
                    : 1;
            const [x0, y0, x1, y1] = FOOT;

            // Plot
            const d = 0.25;
            poly(
                [
                    P(PLOT, 0, 0),
                    P(PLOT, PLOT, 0),
                    P(PLOT, PLOT, -d),
                    P(PLOT, 0, -d),
                ],
                pal.right,
                pal.lineStrong,
                0.8,
            );
            poly(
                [
                    P(0, PLOT, 0),
                    P(PLOT, PLOT, 0),
                    P(PLOT, PLOT, -d),
                    P(0, PLOT, -d),
                ],
                pal.left,
                pal.lineStrong,
                0.8,
            );
            poly(
                [P(0, 0, 0), P(PLOT, 0, 0), P(PLOT, PLOT, 0), P(0, PLOT, 0)],
                pal.ground,
                pal.lineStrong,
                0.8,
            );
            ctx.strokeStyle = pal.line;
            ctx.lineWidth = 0.6;

            for (let i = 1; i < PLOT; i++) {
                line(P(i, 0, 0), P(i, PLOT, 0));
                line(P(0, i, 0), P(PLOT, i, 0));
            }

            // Shield dome, ground ring (behind everything standing on the plot)
            const c = P(PLOT / 2, PLOT / 2, 0);
            const rx = (PLOT / 2) * Math.SQRT2 * (TW / 2) * scale * 0.98;
            const ry = (PLOT / 2) * Math.SQRT2 * (TH / 2) * scale * 0.98;
            const domeH =
                ry + (FLOOR * (BASE_FLOORS + NEW_FLOORS) + 1.9) * ZH * scale;
            const flash = Math.max(0, 1 - (simT - flashAt) / 900);
            ctx.strokeStyle = pal.accent;
            ctx.globalAlpha = 0.25 + flash * 0.5;
            ctx.setLineDash([3, 5]);
            ctx.beginPath();
            ctx.ellipse(c[0], c[1], rx, ry, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;

            // Automation: two systems on the ground, wired into the building
            const srv = SERVER;
            box(
                srv[0] - 0.35,
                srv[1] - 0.35,
                srv[0] + 0.35,
                srv[1] + 0.35,
                0,
                1.1,
            );
            ctx.strokeStyle = pal.accent;
            ctx.lineWidth = 0.8;

            for (let z = 0.3; z < 1.1; z += 0.28) {
                line(
                    P(srv[0] - 0.2, srv[1] + 0.35, z),
                    P(srv[0] + 0.25, srv[1] + 0.35, z),
                );
            }

            const db = DATABASE;
            const dbC = P(db[0], db[1], 0);
            const dbR = 0.42 * Math.SQRT2 * (TW / 2) * scale;
            const dbRy = dbR / 2;
            const dbH = 1.1 * ZH * scale;
            ctx.fillStyle = pal.left;
            ctx.strokeStyle = pal.lineStrong;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.ellipse(dbC[0], dbC[1], dbR, dbRy, 0, 0, Math.PI);
            ctx.lineTo(dbC[0] - dbR, dbC[1] - dbH);
            ctx.ellipse(dbC[0], dbC[1] - dbH, dbR, dbRy, 0, Math.PI, 0, true);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = pal.top;
            ctx.beginPath();
            ctx.ellipse(dbC[0], dbC[1] - dbH, dbR, dbRy, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = pal.accent;
            ctx.beginPath();
            ctx.ellipse(dbC[0], dbC[1] - dbH * 0.5, dbR, dbRy, 0, 0, Math.PI);
            ctx.stroke();

            const wires: Array<[Pt, Pt]> = [
                [P(srv[0], srv[1], 1.1), P(x0, (y0 + y1) / 2 + 0.4, 2.2)],
                [P(db[0], db[1], 1.1), P((x0 + x1) / 2 + 0.4, y0, 2.6)],
            ];
            const curve = (a: Pt, b: Pt): Pt[] => {
                const mid: Pt = [
                    (a[0] + b[0]) / 2,
                    Math.min(a[1], b[1]) - 26 * scale,
                ];

                return [a, mid, b];
            };
            const bez = (q: Pt[], k: number): Pt => {
                const u = 1 - k;

                return [
                    u * u * q[0][0] + 2 * u * k * q[1][0] + k * k * q[2][0],
                    u * u * q[0][1] + 2 * u * k * q[1][1] + k * k * q[2][1],
                ];
            };
            wires.forEach((w, i) => {
                const q = curve(w[0], w[1]);
                ctx.strokeStyle = pal.accent;
                ctx.globalAlpha = 0.55;
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(q[0][0], q[0][1]);
                ctx.quadraticCurveTo(q[1][0], q[1][1], q[2][0], q[2][1]);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;

                for (let k = 0; k < 2; k++) {
                    const prog = reduceMotion
                        ? 0.35 + k * 0.4
                        : (simT / 1700 + k * 0.5 + i * 0.25) % 1;
                    const p = bez(q, i === 0 ? prog : 1 - prog);
                    ctx.fillStyle = pal.accent;
                    ctx.beginPath();
                    ctx.arc(
                        p[0],
                        p[1],
                        2.2 * Math.max(0.8, scale),
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                }
            });
            figure(srv[0] + 0.75, srv[1] + 0.2, 0, 1, 'board');
            figure(db[0] + 0.25, db[1] + 0.8, 0, 2, 'board');

            // Building: finished floors, then the new floors being added
            const floorsDone = BASE_FLOORS + built;

            for (let f = 0; f < floorsDone; f++) {
                const isNew = f >= BASE_FLOORS;
                box(
                    x0,
                    y0,
                    x1,
                    y1,
                    f * FLOOR,
                    (f + 1) * FLOOR,
                    isNew ? fade : 1,
                );

                // Lit windows on both visible faces
                ctx.fillStyle = pal.window;

                for (let w = 0; w < 4; w++) {
                    const on =
                        hash(f * 7 + w, Math.floor(simT / 3000) + w) > 0.35;

                    if (!on) {
                        continue;
                    }

                    ctx.globalAlpha = (isNew ? fade : 1) * 0.9;
                    const u = x0 + 0.25 + w * 0.55;
                    const zb = f * FLOOR + 0.22;
                    poly(
                        [
                            P(u, y1, zb),
                            P(u + 0.3, y1, zb),
                            P(u + 0.3, y1, zb + 0.32),
                            P(u, y1, zb + 0.32),
                        ],
                        pal.window,
                    );
                    const v = y0 + 0.25 + w * 0.55;
                    ctx.globalAlpha = (isNew ? fade : 1) * 0.6;
                    poly(
                        [
                            P(x1, v, zb),
                            P(x1, v + 0.3, zb),
                            P(x1, v + 0.3, zb + 0.32),
                            P(x1, v, zb + 0.32),
                        ],
                        pal.window,
                    );
                }

                ctx.globalAlpha = 1;
            }

            const roof = floorsDone * FLOOR;

            // Ghost outline of the finished height
            const fullTop = (BASE_FLOORS + NEW_FLOORS) * FLOOR;

            if (built < NEW_FLOORS) {
                ctx.strokeStyle = pal.accent;
                ctx.globalAlpha = 0.45;
                ctx.setLineDash([3, 3]);
                ctx.lineWidth = 0.8;
                poly(
                    [
                        P(x0, y0, fullTop),
                        P(x1, y0, fullTop),
                        P(x1, y1, fullTop),
                        P(x0, y1, fullTop),
                    ],
                    undefined,
                    pal.accent,
                    0.8,
                );
                line(P(x1, y1, roof), P(x1, y1, fullTop));
                line(P(x0, y1, roof), P(x0, y1, fullTop));
                line(P(x1, y0, roof), P(x1, y0, fullTop));
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
            }

            // Crane on the roof: mast, jib, and a slab lowered onto the top
            const mast: Pt = [x0 + 0.35, y0 + 0.35];
            const craneTop = fullTop + 1.6;
            ctx.strokeStyle = pal.accent;
            ctx.lineWidth = 1.3;
            line(P(mast[0], mast[1], roof), P(mast[0], mast[1], craneTop));
            line(
                P(mast[0] + 0.16, mast[1], roof),
                P(mast[0] + 0.16, mast[1], craneTop),
            );
            ctx.lineWidth = 0.7;

            for (let z = roof + 0.3; z < craneTop - 0.1; z += 0.4) {
                line(
                    P(mast[0], mast[1], z),
                    P(mast[0] + 0.16, mast[1], z + 0.36),
                );
            }

            const hook: Pt = [(x0 + x1) / 2 + 0.2, (y0 + y1) / 2 + 0.2];
            ctx.lineWidth = 1.3;
            line(
                P(mast[0], mast[1], craneTop),
                P(hook[0] + 0.3, hook[1] + 0.3, craneTop),
            );
            line(
                P(mast[0], mast[1], craneTop),
                P(mast[0] - 0.6, mast[1] - 0.6, craneTop),
            );
            const hz = building
                ? craneTop -
                  0.15 -
                  (craneTop - 0.15 - roof - 0.05) * Math.min(1, frac / 0.7)
                : craneTop - 0.15;
            ctx.lineWidth = 0.7;
            line(P(hook[0], hook[1], craneTop), P(hook[0], hook[1], hz + 0.1));

            if (building) {
                box(x0 + 0.08, y0 + 0.08, x1 - 0.08, y1 - 0.08, hz, hz + 0.1);
            }

            figure(x1 - 0.35, y1 - 0.2, roof, 0);
            figure(x0 + 0.7, y1 - 0.25, roof, 0.5);

            // QA: a lift on the right face stops at a floor, then a check appears
            const stops = [1, 3, 5, 2, 4];
            const stopMs = 1900;
            const si = reduceMotion
                ? 2
                : Math.floor(simT / stopMs) % stops.length;
            const sp = reduceMotion ? 0.9 : (simT % stopMs) / stopMs;
            const from = stops[(si + stops.length - 1) % stops.length];
            const to = stops[si];
            const move = Math.min(1, sp / 0.45);
            const ease = move * move * (3 - 2 * move);
            const liftZ = (from + (to - from) * ease) * FLOOR;
            const ly = y0 + 0.6;
            ctx.strokeStyle = pal.lineStrong;
            ctx.lineWidth = 0.8;
            line(P(x1 + 0.12, ly - 0.2, 0), P(x1 + 0.12, ly - 0.2, fullTop));
            line(P(x1 + 0.12, ly + 0.5, 0), P(x1 + 0.12, ly + 0.5, fullTop));
            box(x1 + 0.08, ly - 0.2, x1 + 0.55, ly + 0.5, liftZ, liftZ + 0.12);
            figure(x1 + 0.32, ly + 0.15, liftZ + 0.12, 3, 'board');

            if (sp > 0.5) {
                const age = (sp - 0.5) / 0.5;
                const p = P(x1, ly + 1.1, to * FLOOR + FLOOR * 0.5);
                const r = 5.5 * Math.max(0.8, scale);
                ctx.globalAlpha =
                    age < 0.15 ? age / 0.15 : age > 0.8 ? (1 - age) / 0.2 : 1;
                ctx.fillStyle = pal.top;
                ctx.beginPath();
                ctx.arc(p[0] + 10 * scale, p[1], r, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = pal.accent;
                ctx.lineWidth = 1.3;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(p[0] + 10 * scale - r * 0.45, p[1]);
                ctx.lineTo(p[0] + 10 * scale - r * 0.1, p[1] + r * 0.38);
                ctx.lineTo(p[0] + 10 * scale + r * 0.5, p[1] - r * 0.38);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            // Security: dome shell, occasional attack, defender at the front
            ctx.strokeStyle = pal.accent;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.28 + flash * 0.55;
            ctx.beginPath();
            ctx.ellipse(c[0], c[1], rx, domeH, 0, Math.PI, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.12 + flash * 0.3;
            ctx.beginPath();
            ctx.ellipse(c[0], c[1], rx * 0.5, domeH, 0, Math.PI, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;

            if (!reduceMotion && !attack && simT > nextAttack) {
                attack = {
                    t0: simT,
                    side: hash(Math.floor(simT), 3) > 0.5 ? 1 : -1,
                };
            }

            const hitAngle = attack ? (attack.side > 0 ? -0.55 : -2.6) : -0.55;
            const hit: Pt = [
                c[0] + Math.cos(hitAngle) * rx * 0.97,
                c[1] + Math.sin(hitAngle) * domeH * 0.97,
            ];

            if (attack) {
                const k = (simT - attack.t0) / 1100;
                const start: Pt = [attack.side > 0 ? cw + 10 : -10, ch * 0.05];

                if (k >= 1) {
                    flashAt = simT;
                    attack = null;
                    nextAttack = simT + 5200 + hash(Math.floor(simT), 5) * 2600;
                } else {
                    const tail = Math.max(0, k - 0.15);
                    ctx.strokeStyle = pal.ink;
                    ctx.lineWidth = 1.4;
                    line(
                        [
                            start[0] + (hit[0] - start[0]) * tail,
                            start[1] + (hit[1] - start[1]) * tail,
                        ],
                        [
                            start[0] + (hit[0] - start[0]) * k,
                            start[1] + (hit[1] - start[1]) * k,
                        ],
                    );
                    ctx.fillStyle = pal.ink;
                    ctx.beginPath();
                    ctx.arc(
                        start[0] + (hit[0] - start[0]) * k,
                        start[1] + (hit[1] - start[1]) * k,
                        2.2,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                }
            }

            if (flash > 0 || reduceMotion) {
                const k = reduceMotion ? 0.3 : 1 - flash;
                ctx.globalAlpha = reduceMotion ? 0.7 : flash;
                ctx.strokeStyle = pal.accent;
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.arc(hit[0], hit[1], (4 + k * 16) * scale, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            figure(DEFENDER[0], DEFENDER[1], 0, 4, 'shield');

            // Team labels
            place('build', P(mast[0], mast[1], craneTop + 0.5));
            place('test', P(x1 + 0.9, ly + 0.15, liftZ + 0.9));
            place('connect', P(srv[0], srv[1], 1.9));
            place('protect', P(DEFENDER[0] + 0.2, DEFENDER[1] + 0.6, -0.9));
        };

        const frame = (now: number) => {
            const dt = Math.min(64, now - (last || now));
            last = now;
            simT += dt;
            draw();
            raf = requestAnimationFrame(frame);
        };

        const sync = () => {
            const should = !reduceMotion && visible && !document.hidden;

            if (should && !running) {
                running = true;
                last = 0;
                raf = requestAnimationFrame(frame);
            } else if (!should && running) {
                running = false;
                cancelAnimationFrame(raf);
            }
        };

        const io = new IntersectionObserver((entries) => {
            visible = entries[0]?.isIntersecting ?? true;
            sync();
        });
        io.observe(wrap);

        const ro = new ResizeObserver(resize);
        ro.observe(wrap);

        // Repaint with the new palette when the public theme changes.
        const mo = new MutationObserver(() => {
            pal = readPalette(wrap);
            draw();
        });
        mo.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-public-theme', 'class'],
        });

        document.addEventListener('visibilitychange', sync);
        resize();
        sync();

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            mo.disconnect();
            document.removeEventListener('visibilitychange', sync);
        };
    }, [reduceMotion]);

    return (
        <div ref={wrapRef} className="q-hb">
            <canvas
                ref={canvasRef}
                role="img"
                aria-label={
                    isRTL
                        ? 'رسم متحرك لمبنى واحد يعمل عليه فريق البناء وفريق الربط وفريق الاختبار وفريق الحماية'
                        : 'Animated building with four teams at work: builders add floors, integrators connect systems, an inspector tests each floor and a defender protects it'
                }
            />
            {(Object.keys(labels) as Array<keyof typeof labels>).map((k) => (
                <span
                    key={k}
                    ref={(el) => {
                        labelRefs.current[k] = el;
                    }}
                    className="q-hb-label"
                    aria-hidden="true"
                >
                    {labels[k]}
                </span>
            ))}
            <style>{`
                .q-hb { position: relative; width: 100%; aspect-ratio: 1 / 1; max-height: 640px; }
                .q-hb canvas { display: block; width: 100%; height: 100%; }
                .q-hb-label {
                    position: absolute; left: 0; top: 0; pointer-events: none;
                    margin: -10px 0 0 -4px; white-space: nowrap;
                    font: 500 10.5px/1 var(--font-mono-brand, ui-monospace, monospace);
                    letter-spacing: .14em; text-transform: uppercase;
                    color: var(--q-cream); background: var(--q-bg);
                    border: 1px solid var(--q-line-strong); padding: 5px 7px;
                }
                [dir='rtl'] .q-hb-label { letter-spacing: 0; text-transform: none; font-family: var(--font-arabic, sans-serif); }
            `}</style>
        </div>
    );
}
