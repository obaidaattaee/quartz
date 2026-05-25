import { useEffect, useState } from 'react';

import { useLocale } from '@/hooks/use-locale';
import { useRafTime } from '@/hooks/use-raf-time';

import { B } from './tokens';

const VIEWBOX = { x: -150, y: -200, w: 300, h: 400 };

type Orbit = {
    key: 'sdlc' | 'stlc' | 'sec';
    labelEn: string;
    labelAr: string;
    rx: number;
    ry: number;
    stagesEn: string[];
    stagesAr: string[];
    period: number; // seconds for one full active-cycle through all stages
    phaseOffset: number;
    /** Angle (clock-deg from 12 o'clock) at which to anchor the discipline name pill. */
    pillAngle: number;
};

const ORBITS: Orbit[] = [
    {
        key: 'sdlc',
        labelEn: 'SDLC',
        labelAr: 'تطوير',
        rx: 55,
        ry: 72,
        stagesEn: ['Plan', 'Design', 'Build', 'Test', 'Deploy'],
        stagesAr: ['خطة', 'تصميم', 'بناء', 'اختبار', 'نشر'],
        period: 11,
        phaseOffset: 0,
        pillAngle: 36,
    },
    {
        key: 'stlc',
        labelEn: 'STLC',
        labelAr: 'اختبار',
        rx: 92,
        ry: 118,
        stagesEn: ['Requirements', 'Plan', 'Cases', 'Execute', 'Report'],
        stagesAr: ['متطلبات', 'خطة', 'حالات', 'تنفيذ', 'تقرير'],
        period: 13,
        phaseOffset: 2.1,
        pillAngle: 324,
    },
    {
        key: 'sec',
        labelEn: 'SEC',
        labelAr: 'أمن',
        rx: 128,
        ry: 168,
        stagesEn: ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'],
        stagesAr: ['تحديد', 'حماية', 'كشف', 'استجابة', 'تعافي'],
        period: 15,
        phaseOffset: 4.4,
        pillAngle: 30,
    },
];

function pointOnEllipse(rx: number, ry: number, clockAngleDeg: number) {
    const rad = (clockAngleDeg * Math.PI) / 180;

    return { x: rx * Math.sin(rad), y: -ry * Math.cos(rad) };
}

function toContainerPct(svgX: number, svgY: number) {
    return {
        leftPct: ((svgX - VIEWBOX.x) / VIEWBOX.w) * 100,
        topPct: ((svgY - VIEWBOX.y) / VIEWBOX.h) * 100,
    };
}

function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(mq.matches);
        update();
        mq.addEventListener('change', update);

        return () => mq.removeEventListener('change', update);
    }, []);

    return reduced;
}

/**
 * Returns the index of the currently-active stage for an orbit, advancing
 * round-robin at `orbit.period / stages.length` seconds per stage.
 */
function activeStageIndex(t: number, orbit: Orbit, reduced: boolean): number {
    if (reduced) return 0;

    const perStage = orbit.period / orbit.stagesEn.length;
    const raw = (t + orbit.phaseOffset) / perStage;

    return Math.floor(raw) % orbit.stagesEn.length;
}

/**
 * For an active stage label that sits OUTSIDE the orbit at its dot position,
 * pick a CSS transform that aligns the label outward so it reads cleanly.
 */
function outwardTransform(svgX: number, svgY: number): string {
    // Tolerance band for "essentially on the vertical axis"
    const verticalBand = 18;

    if (Math.abs(svgX) < verticalBand) {
        return svgY < 0
            ? 'translate(-50%, -100%)'
            : 'translate(-50%, 0%)';
    }

    return svgX > 0
        ? 'translate(8%, -50%)'
        : 'translate(-108%, -50%)';
}

export default function EditorialStackDiagram() {
    const { isRTL } = useLocale();
    const reduced = usePrefersReducedMotion();
    const t = useRafTime(!reduced);

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            <svg
                viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
                width="100%"
                height="100%"
                style={{ display: 'block', overflow: 'visible' }}
                aria-hidden
            >
                {/* Orbit ellipses */}
                {ORBITS.map((o) => (
                    <ellipse
                        key={`ring-${o.key}`}
                        cx="0"
                        cy="0"
                        rx={o.rx}
                        ry={o.ry}
                        fill="none"
                        stroke={B.line}
                        strokeWidth="0.8"
                        strokeDasharray="2 6"
                    />
                ))}

                {/* Electron dots — 5 per orbit at fixed 72° positions */}
                {ORBITS.flatMap((o) => {
                    const activeIdx = activeStageIndex(t, o, reduced);

                    return o.stagesEn.map((_, i) => {
                        const angle = (i / o.stagesEn.length) * 360;
                        const p = pointOnEllipse(o.rx, o.ry, angle);
                        const isActive = i === activeIdx;

                        return (
                            <circle
                                key={`${o.key}-dot-${i}`}
                                cx={p.x}
                                cy={p.y}
                                r={isActive ? 3.6 : 1.8}
                                fill={isActive ? B.accent : B.cream}
                                opacity={isActive ? 1 : 0.35}
                                style={{
                                    transition:
                                        'r 220ms ease, fill 220ms ease, opacity 220ms ease',
                                }}
                            />
                        );
                    });
                })}

                {/* Faint radial connection from center to active dot of each orbit */}
                {!reduced &&
                    ORBITS.map((o) => {
                        const i = activeStageIndex(t, o, reduced);
                        const angle = (i / o.stagesEn.length) * 360;
                        const p = pointOnEllipse(o.rx, o.ry, angle);

                        return (
                            <line
                                key={`${o.key}-spoke`}
                                x1="0"
                                y1="0"
                                x2={p.x}
                                y2={p.y}
                                stroke={B.accent}
                                strokeWidth="0.6"
                                opacity="0.18"
                            />
                        );
                    })}
            </svg>

            {/* Center mark — the Quartz Q+dot brand icon */}
            <img
                src="/logo-icon.svg"
                alt=""
                aria-hidden
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: '14%',
                    aspectRatio: '1 / 1',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    objectFit: 'contain',
                }}
            />

            {/* Discipline name pills — one per orbit, anchored on the orbit ring */}
            {ORBITS.map((o) => {
                const p = pointOnEllipse(o.rx, o.ry, o.pillAngle);
                const { leftPct, topPct } = toContainerPct(p.x, p.y);

                return (
                    <div
                        key={`${o.key}-pill`}
                        style={{
                            position: 'absolute',
                            left: `${leftPct}%`,
                            top: `${topPct}%`,
                            transform: 'translate(-50%, -50%)',
                            padding: '3px 8px',
                            background: B.bg,
                            border: `1px solid ${B.lineStrong}`,
                            color: B.dim,
                            fontFamily: B.mono,
                            fontSize: 9.5,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            lineHeight: 1.2,
                        }}
                    >
                        {isRTL ? o.labelAr : o.labelEn}
                    </div>
                );
            })}

            {/* Active stage labels — one per orbit, floats near the active dot */}
            {ORBITS.map((o) => {
                const i = activeStageIndex(t, o, reduced);
                const angle = (i / o.stagesEn.length) * 360;
                const outer = pointOnEllipse(o.rx * 1.06, o.ry * 1.06, angle);
                const { leftPct, topPct } = toContainerPct(outer.x, outer.y);

                return (
                    <div
                        key={`${o.key}-active-label`}
                        style={{
                            position: 'absolute',
                            left: `${leftPct}%`,
                            top: `${topPct}%`,
                            transform: outwardTransform(outer.x, outer.y),
                            padding: '3px 7px',
                            background: B.bg,
                            border: `1px solid ${B.accent}`,
                            color: B.accent,
                            fontFamily: B.mono,
                            fontSize: 9.5,
                            letterSpacing: '0.08em',
                            whiteSpace: 'nowrap',
                            lineHeight: 1.2,
                            transition: 'opacity 220ms ease',
                            pointerEvents: 'none',
                        }}
                    >
                        {isRTL ? o.stagesAr[i] : o.stagesEn[i]}
                    </div>
                );
            })}
        </div>
    );
}
