import { Link } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useLocale } from '@/hooks/use-locale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

import HeroBuilding from './hero-building';

// One pass through every service, ending back on the first one. The whole
// pass stays under five seconds so it never needs a pause control.
const STEP_MS = 1200;

export default function LandingHero() {
    const { locale, isRTL, t } = useLocale();
    const reduceMotion = useReducedMotion();
    const [active, setActive] = useState(0);
    const [previous, setPrevious] = useState(-1);
    const timer = useRef<number | null>(null);

    const words = isRTL
        ? ['برمجيات', 'أتمتة', 'جودة', 'حماية']
        : ['software', 'automation', 'quality', 'security'];

    const play = useCallback(() => {
        if (reduceMotion || timer.current !== null) {
            return;
        }

        let step = 0;
        timer.current = window.setInterval(() => {
            setPrevious(step % words.length);
            step += 1;
            setActive(step % words.length);

            if (step >= words.length) {
                window.clearInterval(timer.current ?? undefined);
                timer.current = null;
            }
        }, STEP_MS);
    }, [reduceMotion, words.length]);

    useEffect(() => {
        const start = window.setTimeout(play, 700);

        return () => {
            window.clearTimeout(start);

            if (timer.current !== null) {
                window.clearInterval(timer.current);
                timer.current = null;
            }
        };
    }, [play]);

    const fullTitle = isRTL
        ? 'نبني برمجيات وأتمتة وجودة وحماية تدوم.'
        : 'We build software, automation, quality and security that lasts.';

    return (
        <section className="q-hero">
            <div className="q-hero-grid">
                <div className="q-hero-copy">
                    <h1 className="q-hero-title" onMouseEnter={play}>
                        <span className="q-sr">{fullTitle}</span>
                        <span aria-hidden="true">
                            {isRTL ? 'نبني' : 'We build'}
                            <br />
                            <span className="q-hero-swap">
                                {words.map((w, i) => (
                                    <span
                                        key={w}
                                        className={
                                            i === active
                                                ? 'is-active'
                                                : i === previous
                                                  ? 'is-past'
                                                  : ''
                                        }
                                    >
                                        {w}
                                    </span>
                                ))}
                            </span>
                            <br />
                            {isRTL ? 'تدوم.' : 'that lasts.'}
                        </span>
                    </h1>
                    <p className="q-hero-sub">
                        {isRTL
                            ? 'برمجيات مخصّصة وأتمتة للأعمال التي تعتمد على أنظمتها، يختبرها ويؤمّنها الفريق نفسه.'
                            : 'Custom software and automation for businesses that depend on their systems. Tested and secured by the same team.'}
                    </p>
                    <div className="q-hero-ctas">
                        <Link
                            href={`/${locale}/contact`}
                            className="q-btn q-btn-primary"
                        >
                            {t('nav.ctaShort') || 'Book a Call'}{' '}
                            {isRTL ? '↖' : '↗'}
                        </Link>
                        <Link
                            href={`/${locale}/portfolio`}
                            className="q-btn q-btn-link"
                        >
                            {t('hero.secondaryCta') || 'See our work'}
                        </Link>
                    </div>
                </div>

                <div className="q-hero-visual">
                    <HeroBuilding />
                </div>
            </div>

            <style>{`
                .q-hero {
                    position: relative;
                    min-height: calc(100vh - var(--q-nav-h, 84px));
                    min-height: calc(100dvh - var(--q-nav-h, 84px));
                    display: flex;
                    align-items: center;
                    padding: clamp(32px, 5vh, 64px) clamp(16px, 4vw, 48px);
                }
                .q-hero-grid {
                    width: 100%;
                    max-width: 1240px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
                    gap: clamp(24px, 4vw, 64px);
                    align-items: center;
                }
                .q-sr {
                    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
                    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
                }
                .q-hero-title {
                    margin: 0;
                    font-family: var(--font-display);
                    font-weight: 400;
                    font-size: clamp(52px, 7.6vw, 112px);
                    line-height: 0.98;
                    letter-spacing: -0.04em;
                    color: var(--q-cream);
                }
                [dir='rtl'] .q-hero-title { letter-spacing: 0; line-height: 1.3; font-family: var(--font-arabic); }
                .q-hero-swap {
                    display: inline-grid;
                    overflow: hidden;
                    vertical-align: bottom;
                    padding-bottom: 0.1em;
                    color: var(--q-accent);
                    font-style: italic;
                    font-weight: 300;
                }
                [dir='rtl'] .q-hero-swap { font-style: normal; font-weight: 700; }
                .q-hero-swap > span {
                    grid-area: 1 / 1;
                    padding-inline-end: 0.08em;
                    transform: translateY(105%);
                    opacity: 0;
                    transition: transform 520ms cubic-bezier(.7, 0, .2, 1), opacity 320ms ease;
                }
                .q-hero-swap > span.is-active { transform: none; opacity: 1; }
                .q-hero-swap > span.is-past { transform: translateY(-105%); opacity: 0; }
                .q-hero-sub {
                    margin: 28px 0 0;
                    max-width: 34rem;
                    font-size: clamp(17px, 1.5vw, 21px);
                    line-height: 1.5;
                    color: var(--q-dim);
                }
                .q-hero-ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; margin-top: 40px; }
                .q-btn { font-size: 14px; font-weight: 500; text-decoration: none; white-space: nowrap; }
                .q-btn-primary {
                    display: inline-block; padding: 18px 28px;
                    background: var(--q-accent); color: var(--q-bg);
                    transition: transform 100ms ease, filter 150ms ease;
                }
                .q-btn-primary:hover { filter: brightness(1.06); }
                .q-btn-primary:active { transform: translateY(1px); }
                .q-btn-link {
                    color: var(--q-cream); text-decoration: underline;
                    text-underline-offset: 4px; text-decoration-color: var(--q-accent);
                }
                .q-btn:focus-visible { outline: 2px solid var(--q-accent); outline-offset: 3px; }
                .q-hero-visual { width: 100%; max-width: 620px; justify-self: end; }
                @media (max-width: 900px) {
                    .q-hero-grid { grid-template-columns: 1fr; }
                    .q-hero-visual { justify-self: center; max-width: 460px; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .q-hero-swap > span, .q-btn-primary { transition: none; }
                }
            `}</style>
        </section>
    );
}
