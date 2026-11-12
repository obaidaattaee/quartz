import { Head, Link } from '@inertiajs/react';
import type { CSSProperties } from 'react';

import QuartzMark from '@/components/landing-b/quartz-mark';
import { B } from '@/components/landing-b/tokens';
import { useLocale } from '@/hooks/use-locale';

export default function NotFound() {
    const { locale, isRTL, t } = useLocale();

    // Tracked uppercase mono breaks Arabic letter joining.
    const eyebrowStyle: CSSProperties = isRTL
        ? {
              fontFamily: 'var(--font-arabic-sans)',
              fontSize: 14,
              letterSpacing: 'normal',
          }
        : {
              fontFamily: B.mono,
              fontSize: 12,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
          };

    const headingFont = isRTL ? 'var(--font-arabic-sans)' : B.serif;

    return (
        <>
            <Head>
                <title>{`${t('error.404.title')} | Quartz`}</title>
                <meta name="description" content={t('error.404.description')} />
                <meta name="robots" content="noindex" />
            </Head>
            <div
                className="public-theme relative flex min-h-screen flex-col overflow-hidden"
                style={{ background: B.bg, color: B.cream, fontFamily: B.sans }}
            >
                <header className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-8 sm:px-10">
                    <Link
                        href={`/${locale}`}
                        className="inline-flex items-center gap-3"
                        style={{ color: B.cream, textDecoration: 'none' }}
                    >
                        <QuartzMark size={22} color={B.accent} />
                        <span
                            style={{
                                fontFamily: B.serif,
                                fontSize: 20,
                                fontWeight: 500,
                            }}
                        >
                            {isRTL ? 'كوارتز' : 'Quartz'}
                        </span>
                    </Link>
                </header>

                {/* Oversized faint numerals as a backdrop */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
                >
                    <span
                        dir="ltr"
                        style={{
                            fontFamily: B.serif,
                            fontSize: 'clamp(180px, 34vw, 420px)',
                            fontWeight: 500,
                            lineHeight: 1,
                            color: 'transparent',
                            WebkitTextStroke: `1px var(--q-line-strong)`,
                            opacity: 0.6,
                        }}
                    >
                        404
                    </span>
                </div>

                <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
                    <p style={{ ...eyebrowStyle, color: B.accent }}>
                        {t('error.404.eyebrow')}
                    </p>
                    <h1
                        className="mt-5"
                        style={{
                            fontFamily: headingFont,
                            fontSize: 'clamp(36px, 6vw, 64px)',
                            fontWeight: isRTL ? 700 : 400,
                            lineHeight: isRTL ? 1.35 : 1.05,
                            letterSpacing: isRTL ? 'normal' : '-0.02em',
                            color: B.cream,
                        }}
                    >
                        {t('error.404.title')}
                    </h1>
                    <p
                        className="mt-5 max-w-xl"
                        style={{ color: B.dim, fontSize: 17, lineHeight: 1.6 }}
                    >
                        {t('error.404.description')}
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href={`/${locale}`}
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
                            style={{
                                background: B.accent,
                                color: B.bg,
                                textDecoration: 'none',
                            }}
                        >
                            {t('error.404.backHome')}
                            <span aria-hidden="true">{isRTL ? '←' : '→'}</span>
                        </Link>
                        <Link
                            href={`/${locale}/contact`}
                            className="inline-flex items-center px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                            style={{
                                border: `1px solid ${B.lineStrong}`,
                                color: B.cream,
                                textDecoration: 'none',
                            }}
                        >
                            {t('error.404.contact')}
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}
