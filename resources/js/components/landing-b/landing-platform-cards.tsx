import { Link } from '@inertiajs/react';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { useLocale } from '@/hooks/use-locale';
import { useRafTime } from '@/hooks/use-raf-time';

import { B } from './tokens';

// ───────── Local palette: this section runs on warm cream ─────────
const C = {
    bg: '#f4ecdb',
    ink: '#1c1810',
    text: '#2a2418',
    sub: '#5a4f37',
    soft: '#7a6e52',
    accent: '#c8861a',
    accentDeep: '#b67318',
    accentMono: '#7a5314',
    cardBg: '#fffdf8',
    cardBorder: 'rgba(46,32,12,0.06)',
};

// ───────── Tone-keyed pill colors ─────────
type Tone = 'green' | 'amber' | 'red' | 'blue' | 'neutral';

const TONES: Record<Tone, { bg: string; fg: string; dot: string }> = {
    green: { bg: '#e7f1e3', fg: '#2f5d2b', dot: '#3f9a3a' },
    amber: { bg: '#fbecc8', fg: '#7a5314', dot: '#c8861a' },
    red: { bg: '#f6dcd6', fg: '#7b2e22', dot: '#c8462e' },
    blue: { bg: '#dde7f3', fg: '#21476f', dot: '#3a76b8' },
    neutral: { bg: '#ece6d8', fg: '#534a36', dot: '#8a7c5e' },
};

function Pill({ tone = 'green', children }: { tone?: Tone; children: ReactNode }) {
    const tk = TONES[tone];

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: tk.bg,
                color: tk.fg,
                fontSize: 11,
                fontWeight: 500,
                padding: '4px 9px',
                borderRadius: 999,
                fontFamily: B.sans,
                whiteSpace: 'nowrap',
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: tk.dot,
                }}
            />
            {children}
        </span>
    );
}

// ───────── Inline icons (no external deps) ─────────
const Icn = {
    shield: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    ),
    lock: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 018 0v3" />
        </svg>
    ),
    pulse: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 12h4l2-6 4 12 2-6h6" />
        </svg>
    ),
    mail: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 7 9-7" />
        </svg>
    ),
    flow: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="5" cy="6" r="2" />
            <circle cx="5" cy="18" r="2" />
            <circle cx="19" cy="12" r="2" />
            <path d="M7 6h6l4 6-4 6H7" />
        </svg>
    ),
    check: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12.5l3 3 5-6" />
        </svg>
    ),
    graph: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 19V5M4 19h16" />
            <path d="M7 15l4-5 3 3 5-7" />
        </svg>
    ),
    bell: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 9a6 6 0 0112 0v4l2 3H4l2-3V9z" />
            <path d="M10 19a2 2 0 004 0" />
        </svg>
    ),
};

// ───────── Sparkline ─────────
function Sparkline({
    data,
    color = '#c8861a',
    height = 28,
}: {
    data: number[];
    color?: string;
    height?: number;
}) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const w = 100;
    const pts = data
        .map((v, i) => {
            const x = (i / (data.length - 1)) * w;
            const y =
                height -
                ((v - min) / (max - min || 1)) * (height - 4) -
                2;

            return `${x},${y}`;
        })
        .join(' ');

    return (
        <svg
            viewBox={`0 0 ${w} ${height}`}
            preserveAspectRatio="none"
            style={{ width: '100%', height, display: 'block' }}
            aria-hidden
        >
            <polyline
                points={pts}
                fill="none"
                stroke={color}
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

// ───────── Floating card wrapper ─────────
type FloatingProps = {
    x: number;
    y: number;
    rot: number;
    w: number;
    h: number;
    delay?: number;
    depth?: number;
    t: number;
    reduced: boolean;
    children: ReactNode;
};

function FloatingCard({
    x,
    y,
    rot,
    w,
    h,
    delay = 0,
    depth = 1,
    t,
    reduced,
    children,
}: FloatingProps) {
    const bob = reduced ? 0 : Math.sin(t * 0.6 + delay) * 6 * depth;
    const wob = reduced ? 0 : Math.cos(t * 0.4 + delay * 1.3) * 1.2 * depth;

    return (
        <div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: w,
                height: h,
                transform: `translateY(${bob}px) rotate(${rot + wob}deg)`,
                transition: 'box-shadow 200ms',
                background: C.cardBg,
                borderRadius: 14,
                boxShadow: `0 1px 0 rgba(0,0,0,0.04), 0 ${10 + depth * 6}px ${24 + depth * 12}px -8px rgba(46,32,12,${0.12 + depth * 0.06}), 0 2px 4px rgba(46,32,12,0.06)`,
                border: `1px solid ${C.cardBorder}`,
                padding: 16,
                fontFamily: B.sans,
                color: C.text,
                willChange: 'transform',
            }}
        >
            {children}
        </div>
    );
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

const MONO: CSSProperties = {
    fontFamily: B.mono,
    fontSize: 12,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
};

export default function LandingPlatformCards() {
    const { locale, isRTL } = useLocale();
    const reduced = usePrefersReducedMotion();
    const t = useRafTime(!reduced);

    return (
        <section
            style={{
                background: C.bg,
                color: C.text,
                padding: '120px 48px 140px',
                position: 'relative',
                overflow: 'hidden',
                borderTop: `1px solid ${B.line}`,
            }}
        >
            {/* Soft warm radial wash */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background:
                        'radial-gradient(circle at 78% 38%, rgba(232,168,74,0.22), transparent 55%), radial-gradient(circle at 18% 80%, rgba(220,150,80,0.10), transparent 50%)',
                }}
            />

            <div
                style={{
                    maxWidth: 1240,
                    margin: '0 auto',
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 32,
                    alignItems: 'center',
                    minHeight: 620,
                }}
                className="platform-cards-grid"
            >
                {/* Copy column */}
                <div>
                    <div style={{ ...MONO, color: C.accentMono }}>
                        <span style={{ color: C.accent }}>●</span>
                        &nbsp;&nbsp;
                        {isRTL ? 'المنصّة' : 'The platform'}
                    </div>
                    <h2
                        style={{
                            fontFamily: B.serif,
                            fontSize: 96,
                            lineHeight: 0.94,
                            fontWeight: 400,
                            letterSpacing: '-0.035em',
                            margin: '24px 0 28px',
                            textWrap: 'balance' as CSSProperties['textWrap'],
                            color: C.ink,
                        }}
                        className="platform-cards-title"
                    >
                        {isRTL ? 'الأمن والتشغيل،' : (
                            <>
                                Security &amp; ops,
                            </>
                        )}
                        <br />
                        <em
                            style={{
                                fontStyle: 'italic',
                                color: C.accentDeep,
                                fontWeight: 400,
                            }}
                        >
                            {isRTL ? 'بكل بساطة.' : 'the easy way.'}
                        </em>
                    </h2>
                    <p
                        style={{
                            fontSize: 20,
                            lineHeight: 1.5,
                            color: C.sub,
                            maxWidth: 540,
                            margin: 0,
                            textWrap: 'pretty' as CSSProperties['textWrap'],
                        }}
                    >
                        {isRTL
                            ? 'منصّة واحدة لكل ما يقف وراء عملك — وقت التشغيل، التدقيق، الإصدارات، محاكاة التصيّد، والمخاطر البشرية، في لوحة موحّدة. نحن نبنيها ونشغّلها، وأنت تواصل الإطلاق.'
                            : 'One platform for the systems behind your business — uptime, audits, releases, phishing simulations and human-risk all in a single pane of glass. We build it, we run it, you keep shipping.'}
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: 14,
                            marginTop: 36,
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Link
                            href={`/${locale}/contact`}
                            style={{
                                background: C.ink,
                                color: C.bg,
                                border: 'none',
                                padding: '16px 26px',
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer',
                                borderRadius: 999,
                                fontFamily: B.sans,
                                textDecoration: 'none',
                                display: 'inline-block',
                                transition: 'background 180ms ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = C.accentDeep;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = C.ink;
                            }}
                        >
                            {isRTL
                                ? 'احجز استشارة مجانية ↖'
                                : 'Schedule a free consultation ↗'}
                        </Link>
                        <Link
                            href={`/${locale}/portfolio`}
                            style={{
                                color: C.ink,
                                fontSize: 14,
                                textDecoration: 'underline',
                                textUnderlineOffset: 4,
                                textDecorationColor: C.accent,
                                textDecorationThickness: '1.5px',
                            }}
                        >
                            {isRTL ? 'شاهد المنصّة' : 'See the platform'}
                        </Link>
                    </div>

                    <div
                        style={{
                            marginTop: 56,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 24,
                            maxWidth: 520,
                        }}
                    >
                        {[
                            {
                                v: isRTL ? '٥٠ ولاية' : '50 states',
                                k: isRTL
                                    ? 'تغطية تشغيلية'
                                    : 'of operating coverage',
                            },
                            {
                                v: '99.98%',
                                k: isRTL
                                    ? 'وقت تشغيل عبر الحزم المُشغّلة'
                                    : 'uptime on operated stacks',
                            },
                            {
                                v: '5000+',
                                k: isRTL
                                    ? 'قواعد ومراقبات نشطة'
                                    : 'monitored rules & checks',
                            },
                        ].map((s) => (
                            <div key={s.k}>
                                <div
                                    style={{
                                        fontFamily: B.serif,
                                        fontSize: 30,
                                        lineHeight: 1,
                                        fontWeight: 500,
                                        color: C.ink,
                                    }}
                                >
                                    {s.v}
                                </div>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: C.sub,
                                        marginTop: 8,
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {s.k}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating cards stage */}
                <div
                    style={{ position: 'relative', height: 620 }}
                    className="platform-cards-stage"
                >
                    {/* 1 — Quartz BO uptime (largest, sits behind) */}
                    <FloatingCard t={t} reduced={reduced} x={40} y={130} w={340} h={260} rot={-4} delay={0} depth={0.4}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: C.ink,
                                        color: C.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {Icn.pulse}
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>Quartz BO</div>
                                    <div style={{ fontSize: 11, color: C.soft }}>
                                        {isRTL ? 'تشغيل مباشر · آخر 24س' : 'Live ops · last 24h'}
                                    </div>
                                </div>
                            </div>
                            <Pill tone="green">{isRTL ? 'سليم' : 'Healthy'}</Pill>
                        </div>
                        <div
                            style={{
                                marginTop: 18,
                                fontFamily: B.serif,
                                fontSize: 38,
                                lineHeight: 1,
                                color: C.ink,
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            99.98
                            <span style={{ fontSize: 22, color: C.soft }}>%</span>
                        </div>
                        <div style={{ fontSize: 11, color: C.soft, marginTop: 4 }}>
                            {isRTL ? 'وقت التشغيل، 30 يوم متجدّد' : 'uptime, rolling 30d'}
                        </div>
                        <div style={{ marginTop: 14, color: C.accent }}>
                            <Sparkline color={C.accent} data={[6, 7, 8, 7, 9, 10, 9, 11, 12, 10, 13, 14, 13, 15, 16, 18, 17, 19, 18, 20]} height={36} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: C.soft }}>
                            <span>00:00</span>
                            <span>{isRTL ? 'الآن' : 'now'}</span>
                        </div>
                    </FloatingCard>

                    {/* 2 — SOC 2 audit */}
                    <FloatingCard t={t} reduced={reduced} x={310} y={40} w={250} h={150} rot={3} delay={1.1} depth={1.0}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ color: TONES.green.dot }}>{Icn.shield}</div>
                            <Pill tone="green">{isRTL ? 'مكتمل' : 'Complete'}</Pill>
                        </div>
                        <div style={{ ...MONO, fontSize: 11, color: C.soft, marginTop: 16, letterSpacing: '0.1em' }}>
                            {isRTL ? 'تدقيق أمني' : 'SECURITY AUDIT'}
                        </div>
                        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 4, lineHeight: 1.2 }}>SOC 2 Type II</div>
                        <div style={{ fontSize: 12, color: C.soft, marginTop: 6 }}>
                            {isRTL ? '0 استثناءات · تم التوقيع 14/04' : '0 exceptions · signed 04/14'}
                        </div>
                    </FloatingCard>

                    {/* 3 — Phishing sim */}
                    <FloatingCard t={t} reduced={reduced} x={380} y={210} w={230} h={130} rot={-2} delay={2.3} depth={1.3}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ color: TONES.blue.dot }}>{Icn.mail}</div>
                            <Pill tone="blue">Quartz Cyber</Pill>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 14 }}>
                            {isRTL ? 'محاكاة تصيّد — Acme' : 'Phishing sim — Acme'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                            <span style={{ fontFamily: B.serif, fontSize: 26, color: C.ink }}>−63%</span>
                            <span style={{ fontSize: 11, color: C.soft }}>{isRTL ? 'نقرات' : 'click-through'}</span>
                        </div>
                    </FloatingCard>

                    {/* 4 — Notification toast */}
                    <FloatingCard t={t} reduced={reduced} x={10} y={50} w={240} h={86} rot={-6} delay={0.6} depth={1.5}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    background: TONES.amber.bg,
                                    color: TONES.amber.dot,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                {Icn.bell}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600 }}>
                                    {isRTL ? 'بريد جديد · هيئة الزكاة' : 'New mail · State of Texas'}
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: C.soft,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {isRTL ? 'إشعار 0034: تسجيل ضريبي' : 'Notice 0034: payroll registration'}
                                </div>
                            </div>
                        </div>
                    </FloatingCard>

                    {/* 5 — Release shipped */}
                    <FloatingCard t={t} reduced={reduced} x={420} y={400} w={210} h={120} rot={4} delay={1.8} depth={1.1}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ color: TONES.green.dot }}>{Icn.check}</div>
                            <Pill tone="green">{isRTL ? 'تم الإطلاق' : 'Shipped'}</Pill>
                        </div>
                        <div style={{ ...MONO, fontSize: 11, color: C.soft, marginTop: 14, letterSpacing: '0.1em' }}>
                            {isRTL ? 'مراجعة إصدار' : 'RELEASE QA'}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>v4.18.0 · Northwind</div>
                    </FloatingCard>

                    {/* 6 — Pentest */}
                    <FloatingCard t={t} reduced={reduced} x={90} y={420} w={250} h={170} rot={-3} delay={2.6} depth={0.9}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ color: C.ink }}>{Icn.lock}</div>
                            <Pill tone="amber">{isRTL ? 'قيد المراجعة' : 'In review'}</Pill>
                        </div>
                        <div style={{ ...MONO, fontSize: 11, color: C.soft, marginTop: 16, letterSpacing: '0.1em' }}>
                            {isRTL ? 'اختبار اختراق · ر1' : 'PENTEST · Q1'}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>
                            {isRTL ? 'خارجي، صندوق أسود' : 'External, black-box'}
                        </div>
                        <div style={{ display: 'flex', gap: 14, marginTop: 12 }}>
                            <div>
                                <div style={{ fontFamily: B.serif, fontSize: 22, lineHeight: 1 }}>0</div>
                                <div style={{ fontSize: 10, color: C.soft }}>{isRTL ? 'حرج' : 'critical'}</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: B.serif, fontSize: 22, lineHeight: 1 }}>3</div>
                                <div style={{ fontSize: 10, color: C.soft }}>{isRTL ? 'متوسط' : 'medium'}</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: B.serif, fontSize: 22, lineHeight: 1 }}>8</div>
                                <div style={{ fontSize: 10, color: C.soft }}>{isRTL ? 'إخباري' : 'info'}</div>
                            </div>
                        </div>
                    </FloatingCard>

                    {/* 7 — Automation card */}
                    <FloatingCard t={t} reduced={reduced} x={250} y={300} w={200} h={104} rot={2} delay={3.2} depth={1.4}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ color: TONES.blue.dot }}>{Icn.flow}</div>
                            <Pill tone="neutral">{isRTL ? 'أتمتة' : 'Automation'}</Pill>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 10 }}>
                            {isRTL ? 'استخراج الفواتير' : 'Invoice OCR'}
                        </div>
                        <div style={{ fontSize: 11, color: C.soft, marginTop: 2 }}>
                            {isRTL ? '2,142 ساعة موفّرة / شهر' : '2,142 hrs saved / mo'}
                        </div>
                    </FloatingCard>

                    {/* 8 — P95 latency KPI */}
                    <FloatingCard t={t} reduced={reduced} x={560} y={70} w={120} h={96} rot={6} delay={0.3} depth={1.7}>
                        <div style={{ ...MONO, fontSize: 10, color: C.soft, letterSpacing: '0.1em' }}>
                            P95 {isRTL ? 'الاستجابة' : 'LATENCY'}
                        </div>
                        <div style={{ fontFamily: B.serif, fontSize: 28, marginTop: 8, lineHeight: 1, color: C.ink }}>
                            142
                            <span style={{ fontSize: 14, color: C.soft }}>ms</span>
                        </div>
                        <div style={{ marginTop: 6, color: TONES.green.dot }}>
                            <Sparkline color={TONES.green.dot} data={[4, 5, 4, 6, 5, 4, 5, 3, 4, 5, 4, 3, 4]} height={22} />
                        </div>
                    </FloatingCard>

                    {/* 9 — 12 services / all green */}
                    <FloatingCard t={t} reduced={reduced} x={580} y={300} w={130} h={80} rot={-5} delay={4.0} depth={1.6}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div
                                style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 6,
                                    background: TONES.blue.bg,
                                    color: TONES.blue.fg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                {Icn.graph}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 11, fontWeight: 600 }}>
                                    {isRTL ? '12 خدمة' : '12 services'}
                                </div>
                                <div style={{ fontSize: 10, color: C.soft }}>
                                    {isRTL ? 'كلها سليمة' : 'all green'}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
                            {Array.from({ length: 12 }).map((_, i) => (
                                <span
                                    key={i}
                                    style={{
                                        width: 6,
                                        height: 14,
                                        background: TONES.green.dot,
                                        borderRadius: 1,
                                        opacity: 0.5 + (i / 12) * 0.5,
                                    }}
                                />
                            ))}
                        </div>
                    </FloatingCard>
                </div>
            </div>

            <style>{`
                @media (max-width: 1080px) {
                    .platform-cards-title { font-size: 72px !important; }
                }
                @media (max-width: 900px) {
                    .platform-cards-grid {
                        grid-template-columns: 1fr !important;
                        gap: 48px !important;
                    }
                    .platform-cards-title { font-size: 56px !important; }
                    .platform-cards-stage { height: 540px !important; }
                }
                @media (max-width: 640px) {
                    .platform-cards-title { font-size: 44px !important; }
                    .platform-cards-stage { height: 480px !important; }
                }
            `}</style>
        </section>
    );
}
