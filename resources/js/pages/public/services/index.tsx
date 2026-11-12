import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';

type ServiceSummary = {
    slug: string;
    title: string;
    subtitle: string;
    deliverables: string[];
};

type Props = {
    services: ServiceSummary[];
    seo: SeoData;
};

const LEAD = ['development', 'automation'];
const SPECIALISMS = ['web-development', 'mobile-apps'];
const SUPPORTING = ['qa', 'cybersecurity'];

export default function ServicesIndex() {
    const { services, seo } = usePage<Props>().props;
    const { locale, isRTL, t } = useLocale();
    const arrow = isRTL ? '←' : '→';
    const bySlug = (slug: string) => services.find((s) => s.slug === slug);
    const href = (slug: string) => `/${locale}/services/${slug}`;

    const lead = LEAD.map(bySlug).filter(Boolean) as ServiceSummary[];
    const specialisms = SPECIALISMS.map(bySlug).filter(
        Boolean,
    ) as ServiceSummary[];
    const supporting = SUPPORTING.map(bySlug).filter(
        Boolean,
    ) as ServiceSummary[];

    return (
        <>
            <SeoHead seo={seo} />

            <div className="q-svc">
                <header className="q-svc-head">
                    <h1>
                        {isRTL ? (
                            <>
                                ما <em>نقدّمه</em>.
                            </>
                        ) : (
                            <>
                                What we <em>do</em>.
                            </>
                        )}
                    </h1>
                    <p>
                        {isRTL
                            ? 'نبني البرمجيات ونؤتمت العمليات التي تعتمد عليها أعمالك، ثم نختبرها ونؤمّنها بالفريق نفسه.'
                            : 'We build the software and automate the work your business depends on, then test and secure it with the same team.'}
                    </p>
                </header>

                <section
                    className="q-svc-lead"
                    aria-label={isRTL ? 'الخدمات الرئيسية' : 'Lead services'}
                >
                    {lead.map((s, i) => (
                        <article key={s.slug} className="q-lead-card">
                            <span className="q-num">0{i + 1}</span>
                            <h2>
                                <Link href={href(s.slug)}>{s.title}</Link>
                            </h2>
                            <p className="q-sub">{s.subtitle}</p>
                            <ul className="q-deliver">
                                {s.deliverables.slice(0, 4).map((d) => (
                                    <li key={d}>{d}</li>
                                ))}
                            </ul>

                            {s.slug === 'development' &&
                                specialisms.length > 0 && (
                                    <div className="q-spec">
                                        <span className="q-spec-label">
                                            {isRTL ? 'تخصّصات' : 'Specialisms'}
                                        </span>
                                        <div className="q-spec-links">
                                            {specialisms.map((sp) => (
                                                <Link
                                                    key={sp.slug}
                                                    href={href(sp.slug)}
                                                >
                                                    {sp.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            <Link
                                href={href(s.slug)}
                                className="q-explore"
                                aria-hidden="true"
                                tabIndex={-1}
                            >
                                {isRTL
                                    ? 'استكشف الخدمة'
                                    : 'Explore the service'}{' '}
                                <span className="q-arrow">{arrow}</span>
                            </Link>
                        </article>
                    ))}
                </section>

                <section
                    className="q-svc-support"
                    aria-label={
                        isRTL ? 'الخدمات المساندة' : 'Supporting services'
                    }
                >
                    {supporting.map((s, i) => (
                        <Link
                            key={s.slug}
                            href={href(s.slug)}
                            className="q-support-row"
                        >
                            <span className="q-num">0{i + 3}</span>
                            <span className="q-support-main">
                                <span className="q-support-title">
                                    {s.title}
                                </span>
                                <span className="q-sub">{s.subtitle}</span>
                            </span>
                            <span className="q-chips">
                                {s.deliverables.slice(0, 3).map((d) => (
                                    <span key={d}>{d}</span>
                                ))}
                            </span>
                            <span className="q-arrow" aria-hidden="true">
                                {arrow}
                            </span>
                        </Link>
                    ))}
                </section>

                <section className="q-svc-cta">
                    <h2>
                        {isRTL
                            ? 'لست متأكداً من أين تبدأ؟'
                            : 'Not sure where to start?'}
                    </h2>
                    <p>
                        {isRTL
                            ? 'أخبرنا بما تبنيه أو تريد أتمتته، وسنقترح الخطوة الأولى.'
                            : 'Tell us what you are building or trying to automate, and we will suggest the first step.'}
                    </p>
                    <Link href={`/${locale}/contact`} className="q-cta-btn">
                        {t('nav.ctaShort') || 'Book a Call'} {isRTL ? '↖' : '↗'}
                    </Link>
                </section>
            </div>

            <style>{`
                .q-svc { max-width: 1240px; margin: 0 auto; padding: clamp(40px, 7vw, 96px) clamp(16px, 4vw, 48px) clamp(64px, 9vw, 120px); }
                .q-svc-head { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 24px 64px; align-items: end; padding-bottom: clamp(32px, 5vw, 56px); border-bottom: 1px solid var(--q-line); }
                .q-svc-head h1 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(48px, 7vw, 104px); line-height: 0.98; letter-spacing: -0.04em; color: var(--q-cream); }
                .q-svc-head h1 em { font-style: italic; font-weight: 300; color: var(--q-accent); }
                .q-svc-head p { margin: 0; max-width: 32rem; font-size: clamp(17px, 1.5vw, 20px); line-height: 1.55; color: var(--q-dim); }
                [dir='rtl'] .q-svc-head h1 { letter-spacing: 0; line-height: 1.3; font-family: var(--font-arabic); }
                [dir='rtl'] .q-svc-head h1 em { font-style: normal; font-weight: 700; }

                .q-num { font: 500 12px/1 var(--font-mono-brand); letter-spacing: .14em; color: var(--q-accent); }

                .q-svc-lead { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--q-line); border: 1px solid var(--q-line); margin-top: clamp(32px, 5vw, 56px); }
                .q-lead-card { position: relative; display: flex; flex-direction: column; gap: 18px; padding: clamp(24px, 3.4vw, 44px); background: var(--q-bg); transition: background-color 200ms ease; }
                .q-lead-card:hover { background: var(--q-bg-elev); }
                .q-lead-card h2 { margin: 6px 0 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(32px, 3.4vw, 48px); line-height: 1.05; letter-spacing: -0.03em; }
                [dir='rtl'] .q-lead-card h2 { letter-spacing: 0; font-family: var(--font-arabic); font-weight: 700; }
                .q-lead-card h2 a { color: var(--q-cream); text-decoration: none; }
                .q-lead-card h2 a::after { content: ''; position: absolute; inset: 0; }
                .q-lead-card h2 a:focus-visible { outline: none; }
                .q-lead-card:focus-within { outline: 2px solid var(--q-accent); outline-offset: -2px; }
                .q-sub { color: var(--q-dim); font-size: 16px; line-height: 1.55; margin: 0; max-width: 36rem; }
                .q-deliver { list-style: none; margin: 4px 0 0; padding: 0; border-top: 1px solid var(--q-line); }
                .q-deliver li { display: flex; gap: 12px; align-items: baseline; padding: 12px 0; border-bottom: 1px solid var(--q-line); font-size: 15px; color: var(--q-cream); }
                .q-deliver li::before { content: ''; flex: none; width: 6px; height: 6px; background: var(--q-accent); transform: translateY(-2px); }
                .q-spec { position: relative; z-index: 1; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; }
                .q-spec-label { font: 500 11px/1 var(--font-mono-brand); letter-spacing: .14em; text-transform: uppercase; color: var(--q-dim); }
                [dir='rtl'] .q-spec-label { font: 500 13px/1.4 var(--font-arabic-sans); letter-spacing: normal; text-transform: none; }
                .q-spec-links { display: flex; flex-wrap: wrap; gap: 8px; }
                .q-spec-links a { font-size: 14px; color: var(--q-cream); text-decoration: none; border: 1px solid var(--q-line-strong); padding: 8px 12px; transition: border-color 150ms ease, color 150ms ease; }
                .q-spec-links a:hover, .q-spec-links a:focus-visible { border-color: var(--q-accent); color: var(--q-accent); outline: none; }
                .q-explore { margin-top: auto; padding-top: 8px; font-size: 14px; font-weight: 500; color: var(--q-cream); text-decoration: underline; text-underline-offset: 4px; text-decoration-color: var(--q-accent); }
                .q-arrow { display: inline-block; color: var(--q-accent); transition: transform 180ms ease; }
                .q-lead-card:hover .q-arrow, .q-support-row:hover .q-arrow { transform: translateX(4px); }
                [dir='rtl'] .q-lead-card:hover .q-arrow, [dir='rtl'] .q-support-row:hover .q-arrow { transform: translateX(-4px); }

                .q-svc-support { margin-top: clamp(32px, 5vw, 56px); border-top: 1px solid var(--q-line); }
                .q-support-row { display: grid; grid-template-columns: 56px minmax(0, 1.3fr) minmax(0, 1fr) 32px; gap: 24px; align-items: center; padding: clamp(20px, 2.6vw, 32px) 8px; border-bottom: 1px solid var(--q-line); color: inherit; text-decoration: none; transition: background-color 200ms ease, padding 200ms ease; }
                .q-support-row:hover, .q-support-row:focus-visible { background: var(--q-bg-elev); padding-inline-start: 16px; outline: none; }
                .q-support-main { display: grid; gap: 6px; }
                .q-support-title { font-family: var(--font-display); font-size: clamp(24px, 2.4vw, 32px); line-height: 1.1; letter-spacing: -0.02em; color: var(--q-cream); }
                [dir='rtl'] .q-support-title { letter-spacing: 0; font-family: var(--font-arabic); font-weight: 700; }
                .q-chips { display: flex; flex-wrap: wrap; gap: 6px; }
                .q-chips span { font-size: 13px; color: var(--q-dim); border: 1px solid var(--q-line); padding: 6px 10px; }
                .q-support-row .q-arrow { font-size: 20px; justify-self: end; }

                .q-svc-cta { margin-top: clamp(48px, 7vw, 96px); padding: clamp(28px, 4vw, 56px); border: 1px solid var(--q-line); background: var(--q-bg-elev); display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px 32px; align-items: center; }
                .q-svc-cta h2 { margin: 0; grid-column: 1; font-family: var(--font-display); font-weight: 400; font-size: clamp(28px, 3vw, 40px); letter-spacing: -0.02em; color: var(--q-cream); }
                [dir='rtl'] .q-svc-cta h2 { letter-spacing: 0; font-family: var(--font-arabic); font-weight: 700; }
                .q-svc-cta p { margin: 0; grid-column: 1; color: var(--q-dim); max-width: 36rem; }
                .q-cta-btn { grid-column: 2; grid-row: 1 / span 2; background: var(--q-accent); color: var(--q-bg); padding: 18px 28px; font-size: 14px; font-weight: 500; text-decoration: none; white-space: nowrap; }
                .q-cta-btn:focus-visible { outline: 2px solid var(--q-cream); outline-offset: 3px; }

                @media (max-width: 900px) {
                    .q-svc-head { grid-template-columns: 1fr; }
                    .q-svc-lead { grid-template-columns: 1fr; }
                    .q-support-row { grid-template-columns: 40px minmax(0, 1fr) 24px; }
                    .q-chips { grid-column: 2; }
                    .q-support-row .q-arrow { grid-row: 1; grid-column: 3; }
                    .q-svc-cta { grid-template-columns: 1fr; }
                    .q-cta-btn { grid-column: 1; grid-row: auto; justify-self: start; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .q-lead-card, .q-arrow, .q-support-row, .q-spec-links a { transition: none; }
                }
            `}</style>
        </>
    );
}

function ServicesLayout({ children }: { children: ReactNode }) {
    const { t } = useLocale();

    return (
        <PublicLayout
            breadcrumbs={[{ title: t('nav.services') || 'Services', href: '' }]}
        >
            {children}
        </PublicLayout>
    );
}

ServicesIndex.layout = (page: ReactNode) => (
    <ServicesLayout>{page}</ServicesLayout>
);
