import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { IndustryGlyph } from '@/components/industries/industry-visual';
import JsonLd from '@/components/json-ld';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import type {
    IndustryDiscipline,
    IndustryIndexItem,
    IndustrySolution,
} from '@/types/industry';
import '@/components/industries/industries.css';

type Props = {
    industries: IndustryIndexItem[];
    disciplines: IndustryDiscipline[];
    seo: SeoData;
};

function Arrow({ size = 18 }: { size?: number }) {
    return <ArrowRight size={size} className="in-flip" aria-hidden="true" />;
}

export default function IndustriesIndex() {
    const { industries, disciplines, seo } = usePage<Props>().props;
    const { locale, t } = useLocale();
    const href = (slug: string) => `/${locale}/industries/${slug}`;
    const disciplineTitle = (d: IndustryDiscipline) =>
        d.title || t(`industries.services.${d.slug}`);
    const inDiscipline = (
        solutions: IndustrySolution[],
        d: IndustryDiscipline,
    ) => solutions.filter((s) => s.service && d.services.includes(s.service));

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: t('nav.industries'),
        itemListElement: industries.map((industry, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${origin}${href(industry.slug)}`,
            name: industry.title,
        })),
    };

    return (
        <>
            <SeoHead seo={seo} />
            <JsonLd data={schema} />

            <div className="in">
                {/* Hero */}
                <section
                    className="in-wrap in-hero-index in-reveal"
                    aria-labelledby="in-title"
                >
                    <h1 id="in-title" className="in-h1">
                        {t('industries.index.title')}
                    </h1>
                    <div>
                        <p className="in-lead">{t('industries.index.intro')}</p>
                        <div className="in-actions">
                            <a href="#sectors" className="in-btn">
                                {t('industries.index.pick')}
                                <Arrow />
                            </a>
                            <Link
                                href={`/${locale}/contact`}
                                className="in-link"
                            >
                                {t('industries.index.cta.button')}
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Sectors */}
                <section
                    id="sectors"
                    className="in-wrap in-section"
                    aria-labelledby="in-sectors"
                >
                    <div className="in-head">
                        <h2 id="in-sectors" className="in-h2">
                            {t('industries.index.sectors.title')}
                        </h2>
                        <p className="in-body">
                            {t('industries.index.sectors.sub')}
                        </p>
                    </div>

                    <ul className="in-rows">
                        {industries.map((industry) => (
                            <li key={industry.slug} className="in-row">
                                <div className="in-row-glyph">
                                    <IndustryGlyph slug={industry.slug} />
                                </div>
                                <div className="in-row-main">
                                    <h3 className="in-h3 in-row-title">
                                        <Link href={href(industry.slug)}>
                                            {industry.title}
                                        </Link>
                                    </h3>
                                    {industry.summary && (
                                        <p className="in-body">
                                            {industry.summary}
                                        </p>
                                    )}
                                    <span
                                        className="in-row-go"
                                        aria-hidden="true"
                                    >
                                        {t('industries.index.explore', {
                                            title: industry.title,
                                        })}
                                        <Arrow size={16} />
                                    </span>
                                </div>
                                <div className="in-row-side">
                                    {industry.solutions.length > 0 && (
                                        <div>
                                            <span className="in-label">
                                                {t('industries.index.builds')}
                                            </span>
                                            <ul className="in-ticks">
                                                {industry.solutions
                                                    .slice(0, 3)
                                                    .map((s, i) => (
                                                        <li
                                                            key={`${i}-${s.title}`}
                                                        >
                                                            {s.title}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}
                                    {industry.compliance.length > 0 && (
                                        <div>
                                            <span className="in-label">
                                                {t('industries.index.rules')}
                                            </span>
                                            <ul className="in-chips">
                                                {industry.compliance
                                                    .slice(0, 4)
                                                    .map((name, i) => (
                                                        <li
                                                            key={`${i}-${name}`}
                                                        >
                                                            {name}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <aside className="in-note" aria-labelledby="in-other">
                        <div>
                            <h3 id="in-other" className="in-h3">
                                {t('industries.index.other.title')}
                            </h3>
                            <p className="in-body">
                                {t('industries.index.other.text')}
                            </p>
                        </div>
                        <Link href={`/${locale}/contact`} className="in-link">
                            {t('industries.index.other.link')}
                            <Arrow size={16} />
                        </Link>
                    </aside>
                </section>

                {/* Disciplines across sectors */}
                {disciplines.length > 0 && industries.length > 0 && (
                    <section
                        className="in-wrap in-section"
                        aria-labelledby="in-matrix"
                    >
                        <div className="in-head">
                            <h2 id="in-matrix" className="in-h2">
                                {t('industries.index.matrix.title')}
                            </h2>
                            <p className="in-body">
                                {t('industries.index.matrix.sub')}
                            </p>
                        </div>
                        <div className="in-matrix-wrap">
                            <table className="in-matrix">
                                <caption>
                                    {t('industries.index.matrix.caption')}
                                </caption>
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            {t(
                                                'industries.index.matrix.sector',
                                            )}
                                        </th>
                                        {disciplines.map((d) => (
                                            <th key={d.slug} scope="col">
                                                <Link
                                                    href={`/${locale}/services/${d.slug}`}
                                                >
                                                    {disciplineTitle(d)}
                                                </Link>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {industries.map((industry) => (
                                        <tr key={industry.slug}>
                                            <th scope="row">
                                                <Link
                                                    href={href(industry.slug)}
                                                >
                                                    {industry.title}
                                                </Link>
                                            </th>
                                            {disciplines.map((d) => {
                                                const items = inDiscipline(
                                                    industry.solutions,
                                                    d,
                                                );

                                                return (
                                                    <td key={d.slug}>
                                                        <span
                                                            className="in-cell-label"
                                                            aria-hidden="true"
                                                        >
                                                            {disciplineTitle(d)}
                                                        </span>
                                                        {items.length > 0 ? (
                                                            <ul>
                                                                {items.map(
                                                                    (s, i) => (
                                                                        <li
                                                                            key={`${i}-${s.title}`}
                                                                        >
                                                                            {
                                                                                s.title
                                                                            }
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <span
                                                                className="in-dash"
                                                                aria-label={t(
                                                                    'industries.index.matrix.none',
                                                                )}
                                                            >
                                                                —
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Proof: the only two verified numbers */}
                <section
                    className="in-wrap in-section"
                    aria-labelledby="in-proof"
                >
                    <div className="in-head">
                        <h2 id="in-proof" className="in-h2">
                            {t('industries.index.proof.title')}
                        </h2>
                        <p className="in-body">
                            {t('industries.index.proof.sub')}
                        </p>
                    </div>
                    <div className="in-proof">
                        <div>
                            <span className="in-num">
                                <bdi>
                                    13<span className="in-accent">+</span>
                                </bdi>
                            </span>
                            <span className="in-body">
                                {t('industries.index.proof.products')}
                            </span>
                        </div>
                        <div>
                            <span className="in-num">
                                <bdi>
                                    500K<span className="in-accent">+</span>
                                </bdi>
                            </span>
                            <span className="in-body">
                                {t('industries.index.proof.users')}
                            </span>
                        </div>
                        <div>
                            <p className="in-body">
                                {t('industries.index.proof.note')}
                            </p>
                            <Link
                                href={`/${locale}/portfolio`}
                                className="in-link"
                            >
                                {t('industries.index.proof.link')}
                                <Arrow size={16} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section
                    className="in-wrap in-section"
                    aria-labelledby="in-cta"
                >
                    <div className="in-cta in-cta-simple">
                        <div className="in-cta-copy">
                            <h2 id="in-cta" className="in-h2">
                                {t('industries.index.cta.title')}
                            </h2>
                            <p className="in-lead">
                                {t('industries.index.cta.sub')}
                            </p>
                        </div>
                        <div>
                            <Link
                                href={`/${locale}/contact`}
                                className="in-btn"
                            >
                                {t('industries.index.cta.button')}
                                <Arrow />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

function IndustriesLayout({ children }: { children: ReactNode }) {
    const { t } = useLocale();

    return (
        <PublicLayout breadcrumbs={[{ title: t('nav.industries'), href: '' }]}>
            {children}
        </PublicLayout>
    );
}

IndustriesIndex.layout = (page: ReactNode) => (
    <IndustriesLayout>{page}</IndustriesLayout>
);
