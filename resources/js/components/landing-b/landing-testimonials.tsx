import { useLocale } from '@/hooks/use-locale';
import SectionHead from './section-head';
import { B, monoStyle } from './tokens';

type Testimonial = {
    id: number;
    quote_en: string;
    quote_ar: string;
    author_name_en: string;
    author_name_ar: string;
    author_title_en: string;
    author_title_ar: string;
    company_en: string;
    company_ar: string;
};

type Props = {
    testimonials: Testimonial[];
};

export default function LandingTestimonials({ testimonials }: Props) {
    const { isRTL } = useLocale();

    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const shown = testimonials.slice(0, 3);

    return (
        <section className="q-sec">
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <SectionHead
                    kicker={isRTL ? 'شهادات' : 'In their words'}
                    title={
                        isRTL ? (
                            <>
                                العملاء يتحدّثون{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    بالأرقام.
                                </em>
                            </>
                        ) : (
                            <>
                                Operators, investors and engineers{' '}
                                <em
                                    style={{
                                        color: B.accent,
                                        fontWeight: 300,
                                    }}
                                >
                                    on record.
                                </em>
                            </>
                        )
                    }
                    sub={
                        isRTL
                            ? 'لا شعارات، فقط ملاحظات من الذين شحنوا معنا في الإنتاج.'
                            : 'Not marketing blurbs — notes from people who shipped production with us.'
                    }
                />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: 0,
                        borderTop: `1px solid ${B.line}`,
                    }}
                >
                    {shown.map((t, i) => {
                        const quote = isRTL ? t.quote_ar : t.quote_en;
                        const name = isRTL
                            ? t.author_name_ar
                            : t.author_name_en;
                        const role = isRTL
                            ? t.author_title_ar
                            : t.author_title_en;
                        const company = isRTL ? t.company_ar : t.company_en;

                        return (
                            <figure
                                key={t.id}
                                style={{
                                    padding: '40px 32px',
                                    borderInlineEnd:
                                        i < shown.length - 1
                                            ? `1px solid ${B.line}`
                                            : 'none',
                                    borderBottom: `1px solid ${B.line}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 24,
                                    margin: 0,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 56,
                                        lineHeight: 0.3,
                                        color: B.accent,
                                        fontFamily: B.serif,
                                        height: 20,
                                    }}
                                    aria-hidden
                                >
                                    {isRTL ? '”' : '“'}
                                </div>
                                <blockquote
                                    style={{
                                        fontFamily: B.serif,
                                        fontSize: 22,
                                        lineHeight: 1.4,
                                        fontWeight: 400,
                                        letterSpacing: '-0.01em',
                                        margin: 0,
                                        color: B.cream,
                                        flex: 1,
                                    }}
                                >
                                    {quote}
                                </blockquote>
                                <figcaption
                                    style={{
                                        borderTop: `1px solid ${B.line}`,
                                        paddingTop: 16,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: B.cream,
                                        }}
                                    >
                                        {name}
                                    </div>
                                    <div
                                        style={{
                                            ...monoStyle,
                                            marginTop: 6,
                                        }}
                                    >
                                        {role}
                                        {company ? ` · ${company}` : ''}
                                    </div>
                                </figcaption>
                            </figure>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
