import { useState } from 'react';

import { useLocale } from '@/hooks/use-locale';
import { useLandingData } from './data';
import SectionHead from './section-head';
import { B } from './tokens';

export default function LandingFaq() {
    const { faqs } = useLandingData();
    const { isRTL } = useLocale();
    const [open, setOpen] = useState(0);

    if (faqs.length === 0) {
        return null;
    }

    return (
        <section className="q-sec">
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <SectionHead
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
                                    aria-expanded={on}
                                    className="faq-q"
                                    onClick={() => setOpen(on ? -1 : i)}
                                    style={{
                                        width: '100%',
                                        padding: '24px 0',
                                        background: 'transparent',
                                        border: 'none',
                                        color: B.cream,
                                        textAlign: 'start',
                                        cursor: 'pointer',
                                        display: 'grid',
                                        gridTemplateColumns: '60px 1fr 40px',
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
                                            transition: 'transform 200ms',
                                            textAlign: 'end',
                                        }}
                                    >
                                        +
                                    </span>
                                </button>
                                <div
                                    style={{
                                        maxHeight: on ? 600 : 0,
                                        overflow: 'hidden',
                                        transition: 'max-height 300ms ease',
                                    }}
                                >
                                    <p
                                        className="faq-a"
                                        style={{
                                            paddingBlock: '0 28px',
                                            paddingInlineStart: 80,
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
            <style>{`
                @media (max-width: 640px) {
                    .faq-q { grid-template-columns: 32px 1fr 24px !important; gap: 12px !important; }
                    .faq-q > span:nth-child(2) { font-size: 19px !important; }
                    .faq-a { padding-inline-start: 44px !important; }
                }
            `}</style>
        </section>
    );
}
