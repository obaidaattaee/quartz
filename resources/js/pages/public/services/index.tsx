import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Fragment, useId, useState } from 'react';
import type { ReactNode } from 'react';

import JsonLd from '@/components/json-ld';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import ServiceVisual from '@/components/services/service-visual';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import type { ServiceSlug } from '@/types/service';
import '@/components/services/services.css';

type ServiceSummary = {
    slug: ServiceSlug;
    title: string;
    subtitle: string | null;
    audience: string | null;
    deliverables: string[];
};

type Props = {
    services: ServiceSummary[];
    seo: SeoData;
};

const LEAD: ServiceSlug[] = ['development', 'automation'];
const SPECIALISMS: ServiceSlug[] = ['web-development', 'mobile-apps'];
const SUPPORTING: ServiceSlug[] = ['qa', 'cybersecurity'];

// Problem -> service guide. Copy lives in lang/{en,ar}.json under
// services.index.guide.{i}.*; only the target service is fixed here.
const GUIDE: ServiceSlug[] = [
    'automation',
    'development',
    'web-development',
    'mobile-apps',
    'qa',
    'cybersecurity',
];

// Illustrative project stages: when each discipline is active.
const PHASES = ['discover', 'build', 'release', 'run'] as const;

const GANTT: { key: string; from: number; to: number; soft?: boolean }[] = [
    { key: 'build', from: 0, to: 3 },
    { key: 'test', from: 1, to: 4, soft: true },
    { key: 'secure', from: 0, to: 4, soft: true },
    { key: 'automate', from: 1, to: 4 },
];

function Arrow({ size = 18 }: { size?: number }) {
    return <ArrowRight size={size} className="sv-flip" aria-hidden="true" />;
}

// Buttons and the one open panel are siblings in a single grid, so the
// panel can sit in its own column on desktop and directly under its
// question on phones.
function Guide({
    bySlug,
}: {
    bySlug: (s: ServiceSlug) => ServiceSummary | undefined;
}) {
    const { locale, t } = useLocale();
    const [active, setActive] = useState(0);
    const baseId = useId();
    const panelId = `${baseId}-panel`;

    return (
        <div
            className="sv-guide"
            role="group"
            aria-label={t('services.index.guide.label')}
        >
            {GUIDE.map((slug, i) => {
                const service = bySlug(slug);
                const isActive = active === i;

                return (
                    <Fragment key={slug}>
                        <button
                            type="button"
                            className="sv-guide-btn"
                            aria-expanded={isActive}
                            aria-controls={isActive ? panelId : undefined}
                            onClick={() => setActive(i)}
                        >
                            <span>
                                {t(`services.index.guide.${i}.problem`)}
                            </span>
                            <Arrow />
                        </button>
                        {isActive && service && (
                            <div
                                id={panelId}
                                className="sv-guide-panel"
                                aria-live="polite"
                            >
                                <div>
                                    <span className="sv-label">
                                        {t('services.index.guide.suggest')}
                                    </span>
                                    <p
                                        className="sv-h3"
                                        style={{ margin: '6px 0 0' }}
                                    >
                                        {service.title}
                                    </p>
                                </div>
                                <dl>
                                    <div>
                                        <dt className="sv-label">
                                            {t('services.index.guide.why')}
                                        </dt>
                                        <dd>
                                            {t(`services.index.guide.${i}.why`)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="sv-label">
                                            {t('services.index.guide.start')}
                                        </dt>
                                        <dd>
                                            {t(
                                                `services.index.guide.${i}.start`,
                                            )}
                                        </dd>
                                    </div>
                                </dl>
                                <Link
                                    href={`/${locale}/services/${slug}`}
                                    className="sv-link"
                                >
                                    {t('services.index.guide.link', {
                                        title: service.title,
                                    })}
                                    <Arrow size={16} />
                                </Link>
                            </div>
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
}

export default function ServicesIndex() {
    const { services, seo } = usePage<Props>().props;
    const { locale, t } = useLocale();
    const bySlug = (slug: ServiceSlug) => services.find((s) => s.slug === slug);
    const href = (slug: string) => `/${locale}/services/${slug}`;
    const pick = (slugs: ServiceSlug[]) =>
        slugs.map(bySlug).filter(Boolean) as ServiceSummary[];

    const lead = pick(LEAD);
    const specialisms = pick(SPECIALISMS);
    const supporting = pick(SUPPORTING);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: t('nav.services'),
        itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${origin}${href(s.slug)}`,
            name: s.title,
        })),
    };

    return (
        <>
            <SeoHead seo={seo} />
            <JsonLd data={schema} />

            <div className="sv">
                {/* Hero */}
                <section className="sv-wrap sv-hero" aria-labelledby="sv-title">
                    <div className="sv-hero-copy">
                        <h1 id="sv-title" className="sv-h1 is-long">
                            {t('services.index.title')}
                        </h1>
                        <p className="sv-lead">{t('services.index.intro')}</p>
                        <div className="sv-actions">
                            <a href="#guide" className="sv-btn">
                                {t('services.index.findCta')}
                                <Arrow />
                            </a>
                            <Link
                                href={`/${locale}/contact`}
                                className="sv-link"
                            >
                                {t('nav.ctaShort')}
                            </Link>
                        </div>
                    </div>
                    <ServiceVisual
                        kind="system"
                        label={t('services.index.combine.title')}
                    />
                </section>

                {/* Problem -> service guide */}
                <section
                    id="guide"
                    className="sv-wrap sv-section"
                    aria-labelledby="sv-guide"
                >
                    <div className="sv-head">
                        <h2 id="sv-guide" className="sv-h2">
                            {t('services.index.guide.title')}
                        </h2>
                        <p className="sv-body">
                            {t('services.index.guide.sub')}
                        </p>
                    </div>
                    <Guide bySlug={bySlug} />
                </section>

                {/* The four disciplines */}
                <section
                    className="sv-wrap sv-section"
                    aria-labelledby="sv-disciplines"
                >
                    <div className="sv-head">
                        <h2 id="sv-disciplines" className="sv-h2">
                            {t('services.index.disciplines.title')}
                        </h2>
                        <p className="sv-body">
                            {t('services.index.disciplines.sub')}
                        </p>
                    </div>

                    <div className="sv-lead-grid">
                        {lead.map((s) => (
                            <article key={s.slug} className="sv-disc">
                                <span className="sv-label sv-accent">
                                    {t('services.index.lead')}
                                </span>
                                <h3 className="sv-h3">{s.title}</h3>
                                {s.subtitle && (
                                    <p className="sv-body">{s.subtitle}</p>
                                )}
                                {s.audience && (
                                    <div className="sv-disc-for">
                                        <span className="sv-label">
                                            {t('services.index.for')}
                                        </span>
                                        <p>{s.audience}</p>
                                    </div>
                                )}
                                {s.deliverables.length > 0 && (
                                    <div>
                                        <span
                                            className="sv-label"
                                            style={{ marginBlockEnd: 8 }}
                                        >
                                            {t('services.index.includes')}
                                        </span>
                                        <ul className="sv-ticks">
                                            {s.deliverables
                                                .slice(0, 4)
                                                .map((d, i) => (
                                                    <li key={`${i}-${d}`}>
                                                        {d}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}
                                {s.slug === 'development' &&
                                    specialisms.length > 0 && (
                                        <div>
                                            <span
                                                className="sv-label"
                                                style={{ marginBlockEnd: 8 }}
                                            >
                                                {t(
                                                    'services.index.specialisms',
                                                )}
                                            </span>
                                            <div className="sv-spec">
                                                {specialisms.map((sp) => (
                                                    <Link
                                                        key={sp.slug}
                                                        href={href(sp.slug)}
                                                    >
                                                        {sp.title}
                                                        {sp.subtitle && (
                                                            <span>
                                                                {shorten(
                                                                    sp.subtitle,
                                                                )}
                                                            </span>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                <Link href={href(s.slug)} className="sv-link">
                                    {t('services.index.explore', {
                                        title: s.title,
                                    })}
                                    <Arrow size={16} />
                                </Link>
                            </article>
                        ))}
                    </div>

                    <div className="sv-support-grid">
                        {supporting.map((s) => (
                            <Link
                                key={s.slug}
                                href={href(s.slug)}
                                className="sv-support"
                            >
                                <div>
                                    <span className="sv-label">
                                        {t('services.index.supporting')}
                                    </span>
                                    <h3 className="sv-h3">{s.title}</h3>
                                    {s.subtitle && (
                                        <p className="sv-body">{s.subtitle}</p>
                                    )}
                                </div>
                                <Arrow size={22} />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* How they combine */}
                <section
                    className="sv-wrap sv-section"
                    aria-labelledby="sv-combine"
                >
                    <div className="sv-head">
                        <h2 id="sv-combine" className="sv-h2">
                            {t('services.index.combine.title')}
                        </h2>
                        <p className="sv-body">
                            {t('services.index.combine.sub')}
                        </p>
                    </div>
                    <div className="sv-combine">
                        <ul className="sv-points">
                            {[0, 1, 2].map((i) => (
                                <li key={i}>
                                    {t(`services.index.combine.${i}`)}
                                </li>
                            ))}
                        </ul>
                        <figure className="sv-gantt">
                            {GANTT.map((row) => (
                                <div key={row.key} className="sv-gantt-row">
                                    <span>
                                        {t(`services.index.combine.${row.key}`)}
                                    </span>
                                    <span className="sv-gantt-track">
                                        <span
                                            className={cn(
                                                'sv-gantt-bar',
                                                row.soft && 'is-soft',
                                            )}
                                            style={{
                                                insetInlineStart: `${(row.from / PHASES.length) * 100}%`,
                                                insetInlineEnd: `${100 - (row.to / PHASES.length) * 100}%`,
                                            }}
                                        />
                                    </span>
                                </div>
                            ))}
                            <div className="sv-gantt-axis">
                                <span />
                                <span>
                                    {PHASES.map((phase) => (
                                        <span key={phase}>
                                            {t(
                                                `services.index.combine.phase.${phase}`,
                                            )}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            <figcaption>
                                {t('services.page.illustrative')}
                            </figcaption>
                        </figure>
                    </div>
                </section>

                {/* Shared process */}
                <section
                    className="sv-wrap sv-section"
                    aria-labelledby="sv-process"
                >
                    <div className="sv-head">
                        <h2 id="sv-process" className="sv-h2">
                            {t('services.index.process.title')}
                        </h2>
                        <p className="sv-body">
                            {t('services.index.process.sub')}
                        </p>
                    </div>
                    <ol className="sv-steps">
                        {[0, 1, 2, 3].map((i) => (
                            <li key={i} className="sv-step">
                                <span className="sv-step-dur">
                                    {t(`services.index.process.${i}.duration`)}
                                </span>
                                <h3>
                                    {t(`services.index.process.${i}.title`)}
                                </h3>
                                <p className="sv-body">
                                    {t(`services.index.process.${i}.text`)}
                                </p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Proof: the only two verified numbers */}
                <section
                    className="sv-wrap sv-section"
                    aria-labelledby="sv-proof"
                >
                    <div className="sv-head">
                        <h2 id="sv-proof" className="sv-h2">
                            {t('services.index.proof.title')}
                        </h2>
                        <p className="sv-body">
                            {t('services.index.proof.sub')}
                        </p>
                    </div>
                    <div className="sv-proof">
                        <div>
                            <span className="sv-num">
                                <bdi>
                                    13<span className="sv-accent">+</span>
                                </bdi>
                            </span>
                            <span className="sv-body">
                                {t('services.index.proof.products')}
                            </span>
                        </div>
                        <div>
                            <span className="sv-num">
                                <bdi>
                                    500K<span className="sv-accent">+</span>
                                </bdi>
                            </span>
                            <span className="sv-body">
                                {t('services.index.proof.users')}
                            </span>
                        </div>
                        <div>
                            <Link
                                href={`/${locale}/portfolio`}
                                className="sv-link"
                            >
                                {t('services.index.proof.link')}
                                <Arrow size={16} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section
                    className="sv-wrap sv-section"
                    aria-labelledby="sv-cta"
                >
                    <div className="sv-cta">
                        <div className="sv-cta-copy">
                            <h2 id="sv-cta" className="sv-h2">
                                {t('services.index.cta.title')}
                            </h2>
                            <p className="sv-lead">
                                {t('services.index.cta.sub')}
                            </p>
                        </div>
                        <div className="sv-cta-side">
                            <Link
                                href={`/${locale}/contact`}
                                className="sv-btn"
                            >
                                {t('services.index.cta.button')}
                                <Arrow />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

// First clause of a subtitle, for the compact specialism links.
function shorten(text: string): string {
    const cut = text.split(/[,،]/)[0];

    return cut.length < text.length ? cut : text;
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
