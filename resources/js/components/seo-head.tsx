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

type Props = {
    seo: SeoData;
};

export default function SeoHead({ seo }: Props) {
    return (
        <Head>
            <title>{seo.title}</title>
            {seo.description && (
                <meta
                    head-key="description"
                    name="description"
                    content={seo.description}
                />
            )}
            <meta
                head-key="og:title"
                property="og:title"
                content={seo.title}
            />
            {seo.description && (
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={seo.description}
                />
            )}
            {seo.image && (
                <meta
                    head-key="og:image"
                    property="og:image"
                    content={seo.image}
                />
            )}
            <meta
                head-key="og:url"
                property="og:url"
                content={seo.url}
            />
            <meta
                head-key="og:type"
                property="og:type"
                content={seo.type ?? 'website'}
            />
            {seo.canonical && (
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={seo.canonical}
                />
            )}
        </Head>
    );
}
