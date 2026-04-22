import { Link } from '@inertiajs/react';

import { useLocale } from '@/hooks/use-locale';

import { B, monoStyle } from './tokens';

export type FeaturedCase = {
    id: number;
    slug: string;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    client_name: string | null;
    service_category: string | null;
    featured_image: { url: string; alt_text: string | null } | null;
} | null;

type Props = {
    featuredCase: FeaturedCase;
};

export default function LandingFeaturedCase({ featuredCase }: Props) {
    const { locale, isRTL } = useLocale();

    if (!featuredCase) return null;

    const title =
        locale === 'ar' ? featuredCase.title_ar : featuredCase.title_en;
    const description =
        locale === 'ar'
            ? featuredCase.description_ar
            : featuredCase.description_en;
    const arrow = isRTL ? '↖' : '↗';

    return (
        <section
            style={{
                padding: '80px 48px',
                background: B.bgElev,
                borderTop: `1px solid ${B.line}`,
                borderBottom: `1px solid ${B.line}`,
            }}
        >
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <div
                    style={{
                        ...monoStyle,
                        marginBottom: 32,
                    }}
                >
                    {isRTL
                        ? 'دراسة حالة مختارة'
                        : 'Featured case study'}
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 64,
                        alignItems: 'center',
                    }}
                    className="featured-grid"
                >
                    {featuredCase.featured_image ? (
                        <div
                            style={{
                                aspectRatio: '4 / 3',
                                background: B.bg,
                                border: `1px solid ${B.line}`,
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={featuredCase.featured_image.url}
                                alt={
                                    featuredCase.featured_image
                                        .alt_text ?? title
                                }
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    filter: 'grayscale(0.2) contrast(0.95)',
                                }}
                            />
                        </div>
                    ) : (
                        <div
                            style={{
                                aspectRatio: '4 / 3',
                                background: B.bg,
                                border: `1px solid ${B.line}`,
                            }}
                        />
                    )}
                    <div>
                        {featuredCase.service_category && (
                            <div style={monoStyle}>
                                {featuredCase.service_category}
                            </div>
                        )}
                        <h3
                            style={{
                                fontFamily: B.serif,
                                fontSize: 48,
                                lineHeight: 1.05,
                                fontWeight: 400,
                                letterSpacing: '-0.025em',
                                margin: '18px 0 20px',
                                textWrap:
                                    'balance' as React.CSSProperties['textWrap'],
                            }}
                        >
                            {title}
                        </h3>
                        <p
                            style={{
                                fontSize: 17,
                                lineHeight: 1.6,
                                color: B.dim,
                                margin: '0 0 28px',
                                textWrap:
                                    'pretty' as React.CSSProperties['textWrap'],
                            }}
                        >
                            {description}
                        </p>
                        {featuredCase.client_name && (
                            <div
                                style={{
                                    fontSize: 13,
                                    color: B.dim,
                                    marginBottom: 28,
                                    borderTop: `1px solid ${B.line}`,
                                    paddingTop: 16,
                                }}
                            >
                                {featuredCase.client_name}
                            </div>
                        )}
                        <Link
                            href={`/${locale}/portfolio/${featuredCase.slug}`}
                            style={{
                                display: 'inline-block',
                                background: B.accent,
                                color: B.bg,
                                padding: '14px 22px',
                                fontSize: 14,
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}
                        >
                            {isRTL
                                ? `اقرأ القصة الكاملة ${arrow}`
                                : `Read the full story ${arrow}`}
                        </Link>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .featured-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
                }
            `}</style>
        </section>
    );
}
