import { Link, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import type { ReactNode } from 'react';

import JsonLd from '@/components/json-ld';
import ScrollReveal from '@/components/scroll-reveal';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import PublicLayout from '@/layouts/public-layout';
import type { BreadcrumbItem } from '@/types';
import type { LegalPageContent } from '@/types/legal';

type Props = {
    page: LegalPageContent;
    seo: SeoData;
};

export default function Legal() {
    const { locale, t } = useLocale();
    const { page, seo } = usePage<Props>().props;

    // Legal effective dates must be unambiguous, so the Arabic locale is
    // pinned to the Gregorian calendar with Latin digits rather than the
    // Hijri default `ar-SA` would otherwise apply.
    const formattedDate = page.effective_date
        ? new Date(page.effective_date).toLocaleDateString(
              locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' },
          )
        : null;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page.title,
        description: page.summary,
        url: seo.url,
        inLanguage: locale,
        ...(page.effective_date
            ? {
                  datePublished: page.effective_date,
                  dateModified: page.effective_date,
              }
            : {}),
        publisher: {
            '@type': 'Organization',
            name: 'Quartz Solutions',
        },
    };

    return (
        <>
            <SeoHead seo={seo} />
            <JsonLd data={schema} />

            {/* Hero */}
            <section className="border-b border-border/60 py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ScrollReveal variant="hero">
                        <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase rtl:tracking-normal rtl:normal-case">
                            {t('legal.eyebrow')}
                        </p>
                        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
                            {page.title}
                        </h1>
                        {page.summary && (
                            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                                {page.summary}
                            </p>
                        )}

                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            {formattedDate && (
                                <span>
                                    {t('legal.effective')}{' '}
                                    <time dateTime={page.effective_date ?? ''}>
                                        {formattedDate}
                                    </time>
                                </span>
                            )}
                            <span>
                                {t('legal.version')} {page.version}
                            </span>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-foreground print:hidden"
                            >
                                <Printer className="h-3.5 w-3.5" />
                                {t('legal.print')}
                            </button>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Table of contents + document body */}
            <section className="py-12 md:py-16">
                <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 lg:px-8">
                    <nav
                        aria-label={t('legal.contents')}
                        className="lg:sticky lg:top-24 lg:self-start print:hidden"
                    >
                        <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase rtl:tracking-normal rtl:normal-case">
                            {t('legal.contents')}
                        </p>
                        <ol className="mt-4 space-y-2 border-s border-border/60 ps-4 text-sm">
                            {page.sections.map((section, index) => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        className="block text-start text-muted-foreground transition-colors hover:text-accent"
                                    >
                                        <span className="tabular-nums">
                                            {index + 1}.
                                        </span>{' '}
                                        {section.heading}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <div className="max-w-3xl">
                        {page.sections.map((section, index) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className="scroll-mt-24 border-b border-border/40 py-8 first:pt-0 last:border-b-0"
                            >
                                <h2 className="text-xl font-semibold md:text-2xl">
                                    <span className="text-accent tabular-nums">
                                        {index + 1}.
                                    </span>{' '}
                                    {section.heading}
                                </h2>

                                {section.body.map((paragraph, i) => (
                                    <p
                                        key={i}
                                        className="mt-4 leading-relaxed text-muted-foreground"
                                    >
                                        {paragraph}
                                    </p>
                                ))}

                                {section.list.length > 0 && (
                                    <ul className="mt-4 list-disc space-y-2 ps-5 leading-relaxed text-muted-foreground marker:text-accent">
                                        {section.list.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="bg-muted/30 py-16 print:hidden">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold">
                            {t('legal.questions')}
                        </h2>
                        <Button size="lg" asChild className="mt-6">
                            <Link href={`/${locale}/contact`}>
                                {t('legal.contactUs')}
                            </Link>
                        </Button>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}

Legal.layout = (page: ReactNode) => {
    const pageProps = (page as { props?: unknown })?.props as
        | { locale?: string; page?: LegalPageContent }
        | undefined;
    const locale = pageProps?.locale ?? 'en';
    const document = pageProps?.page;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: document?.title ?? '',
            href: document ? `/${locale}/${document.slug}` : '',
        },
    ];

    return <PublicLayout breadcrumbs={breadcrumbs}>{page}</PublicLayout>;
};
