import { useState } from 'react';

import { useLocale } from '@/hooks/use-locale';

import { useLandingData } from './data';
import SectionHead from './section-head';
import { B, monoStyle } from './tokens';

export default function LandingProcess() {
    const { processSteps } = useLandingData();
    const { isRTL } = useLocale();
    const [active, setActive] = useState(0);

    if (processSteps.length === 0) return null;

    const current = processSteps[Math.min(active, processSteps.length - 1)];

    return (
        <section style={{ padding: '80px 48px' }}>
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <SectionHead
                    num={isRTL ? '٣.' : 'III.'}
                    kicker={isRTL ? 'المنهجية' : 'Method'}
                    title={
                        isRTL ? (
                            <>
                                خمس مراحل.{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    دون مفاجآت.
                                </em>
                            </>
                        ) : (
                            <>
                                Five stages.{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    Zero surprises.
                                </em>
                            </>
                        )
                    }
                    sub={
                        isRTL
                            ? 'إيقاع تشغيلي يمكن التنبؤ به — سواء كان الأمر بناءً جديداً أو تحصين بيئة قديمة.'
                            : 'A predictable operating rhythm — the same one whether it’s a greenfield platform or hardening a legacy estate.'
                    }
                />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.4fr',
                        gap: 64,
                        alignItems: 'start',
                    }}
                    className="process-grid"
                >
                    <div>
                        {processSteps.map((s, i) => {
                            const on = active === i;

                            return (
                                <button
                                    key={s.n}
                                    type="button"
                                    onMouseEnter={() => setActive(i)}
                                    onClick={() => setActive(i)}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '60px 1fr',
                                        gap: 16,
                                        alignItems: 'baseline',
                                        width: '100%',
                                        textAlign: 'left',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '20px 0',
                                        borderTop:
                                            i === 0
                                                ? `1px solid ${B.line}`
                                                : 'none',
                                        borderBottom: `1px solid ${B.line}`,
                                        color: 'inherit',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: B.mono,
                                            fontSize: 12,
                                            color: on
                                                ? B.accent
                                                : B.dim,
                                        }}
                                    >
                                        {s.n}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: B.serif,
                                            fontSize: 32,
                                            lineHeight: 1.1,
                                            fontWeight: 400,
                                            color: on
                                                ? B.cream
                                                : B.dim,
                                            transition: 'color 200ms',
                                            letterSpacing: '-0.01em',
                                        }}
                                    >
                                        {s.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <div
                        style={{
                            position: 'sticky',
                            top: 100,
                            padding: 40,
                            background: B.bgElev,
                            border: `1px solid ${B.line}`,
                            minHeight: 420,
                        }}
                    >
                        <div style={monoStyle}>
                            {isRTL ? 'المرحلة' : 'Stage'} {current.n}
                        </div>
                        <h3
                            style={{
                                fontFamily: B.serif,
                                fontSize: 56,
                                margin: '12px 0 20px',
                                lineHeight: 1,
                                fontWeight: 400,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {current.title}
                        </h3>
                        <p
                            style={{
                                fontSize: 17,
                                color: B.cream,
                                lineHeight: 1.6,
                                margin: 0,
                                maxWidth: 460,
                            }}
                        >
                            {current.body}
                        </p>
                        <div
                            style={{
                                marginTop: 32,
                                paddingTop: 24,
                                borderTop: `1px solid ${B.line}`,
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 24,
                            }}
                        >
                            <div>
                                <div style={monoStyle}>
                                    {isRTL
                                        ? 'المدة المعتادة'
                                        : 'Typical duration'}
                                </div>
                                <div
                                    style={{
                                        fontSize: 20,
                                        marginTop: 6,
                                    }}
                                >
                                    {current.duration}
                                </div>
                            </div>
                            <div>
                                <div style={monoStyle}>
                                    {isRTL ? 'المُخرَج' : 'Deliverable'}
                                </div>
                                <div
                                    style={{
                                        fontSize: 20,
                                        marginTop: 6,
                                    }}
                                >
                                    {current.deliverable}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .process-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
                    .process-grid > div:last-child { position: static !important; }
                }
            `}</style>
        </section>
    );
}
