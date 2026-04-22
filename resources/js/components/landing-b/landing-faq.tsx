import { useState } from 'react';

import { useLocale } from '@/hooks/use-locale';

import { useLandingData } from './data';
import SectionHead from './section-head';
import { B } from './tokens';

export default function LandingFaq() {
    const { faqs } = useLandingData();
    const { isRTL } = useLocale();
    const [open, setOpen] = useState(0);

    return (
        <section style={{ padding: '80px 48px' }}>
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <SectionHead
                    num={isRTL ? '٥.' : 'V.'}
                    kicker={isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
                    title={
                        isRTL ? (
                            <>
                                قبل أن{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    ترسل الطلب.
                                </em>
                            </>
                        ) : (
                            <>
                                Before you{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    send the brief.
                                </em>
                            </>
                        )
                    }
                    sub={
                        isRTL
                            ? 'الأسئلة التي يطرحها المشتريات والهندسة والأمن في الغالب. وإن لم يكن سؤالك هنا، فسنجيبه في مكالمة العرض.'
                            : 'The questions procurement, engineering and security almost always ask. If yours isn’t here, it’s in the demo call.'
                    }
                />
                <div>
                    {faqs.map((f, i) => {
                        const on = open === i;

                        return (
                            <div
                                key={f.q}
                                style={{
                                    borderTop:
                                        i === 0
                                            ? `1px solid ${B.line}`
                                            : 'none',
                                    borderBottom: `1px solid ${B.line}`,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(on ? -1 : i)
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '24px 0',
                                        background: 'transparent',
                                        border: 'none',
                                        color: B.cream,
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        display: 'grid',
                                        gridTemplateColumns:
                                            '60px 1fr 40px',
                                        gap: 20,
                                        alignItems: 'center',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: B.mono,
                                            fontSize: 12,
                                            color: B.accent,
                                        }}
                                    >
                                        0{i + 1}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: B.serif,
                                            fontSize: 24,
                                            fontWeight: 400,
                                            letterSpacing: '-0.01em',
                                        }}
                                    >
                                        {f.q}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 22,
                                            color: B.accent,
                                            transform: on
                                                ? 'rotate(45deg)'
                                                : 'none',
                                            transition:
                                                'transform 200ms',
                                            textAlign: 'right',
                                        }}
                                    >
                                        +
                                    </span>
                                </button>
                                <div
                                    style={{
                                        maxHeight: on ? 220 : 0,
                                        overflow: 'hidden',
                                        transition:
                                            'max-height 300ms ease',
                                    }}
                                >
                                    <p
                                        style={{
                                            padding: '0 0 28px 80px',
                                            fontSize: 16,
                                            color: B.dim,
                                            lineHeight: 1.65,
                                            margin: 0,
                                            maxWidth: 760,
                                        }}
                                    >
                                        {f.a}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
