import { Head } from '@inertiajs/react';

export type SeoData = {
    title: string;
    description?: string | null;
    image?: string | null;
    url: string;
    type?: string;
    canonical?: string;
    hreflang?: Record<string, string>;
};

export default function SeoHead({ seo }: { seo: SeoData }) {
    return (
        <Head>
            <title>{seo.title}</title>
            {seo.description && (
                <meta
                    name="description"
                    content={seo.description}
                />
            )}

            {/* Open Graph */}
            <meta property="og:title" content={seo.title} />
            {seo.description && (
                <meta
                    property="og:description"
                    content={seo.description}
                />
            )}
            <meta property="og:url" content={seo.url} />
            <meta
                property="og:type"
                content={seo.type ?? 'website'}
            />
            {seo.image && (
                <meta property="og:image" content={seo.image} />
            )}

            {/* Twitter Card */}
            <meta
                name="twitter:card"
                content="summary_large_image"
            />
            <meta name="twitter:title" content={seo.title} />
            {seo.description && (
                <meta
                    name="twitter:description"
                    content={seo.description}
                />
            )}
            {seo.image && (
                <meta name="twitter:image" content={seo.image} />
            )}

            {/* Canonical */}
            {seo.canonical && (
                <link rel="canonical" href={seo.canonical} />
            )}

            {/* Hreflang */}
            {seo.hreflang &&
                Object.entries(seo.hreflang).map(
                    ([lang, href]) => (
                        <link
                            key={lang}
                            rel="alternate"
                            hrefLang={lang}
                            href={href}
                        />
                    ),
                )}
        </Head>
    );
}
