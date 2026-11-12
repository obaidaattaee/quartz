import { useState } from 'react';
import {
    siAnthropic,
    siContabo,
    siCpanel,
    siCypress,
    siDocker,
    siGithub,
    siGoogle,
    siJenkins,
    siN8n,
    siSelenium,
} from 'simple-icons';

import { useLocale } from '@/hooks/use-locale';
import { monoStyle } from './tokens';

type Partner = {
    name: string;
    // 'ms' draws Microsoft's four squares; 'none' shows the name only
    // (Amazon is not in Simple Icons and its mark should come from Amazon).
    mark?: 'ms' | 'none';
    // Brand colour shown on hover (omitted when it would vanish on the dark theme).
    brand?: string;
    // SVG path data on a 24x24 viewBox (Simple Icons convention).
    path?: string;
};

// Microsoft is not in Simple Icons, so its four-square mark is drawn below.
const PARTNERS: Partner[] = [
    { name: 'Microsoft', mark: 'ms' },
    { name: 'Google', path: siGoogle.path, brand: `#${siGoogle.hex}` },
    { name: 'Amazon', mark: 'none' },
    { name: 'Anthropic', path: siAnthropic.path },
    { name: 'GitHub', path: siGithub.path },
    { name: 'Docker', path: siDocker.path, brand: `#${siDocker.hex}` },
    { name: 'n8n', path: siN8n.path, brand: `#${siN8n.hex}` },
    { name: 'Jenkins', path: siJenkins.path, brand: `#${siJenkins.hex}` },
    { name: 'Cypress', path: siCypress.path, brand: `#${siCypress.hex}` },
    { name: 'Selenium', path: siSelenium.path, brand: `#${siSelenium.hex}` },
    { name: 'cPanel', path: siCpanel.path, brand: `#${siCpanel.hex}` },
    { name: 'Contabo', path: siContabo.path, brand: `#${siContabo.hex}` },
];

function Mark({ partner }: { partner: Partner }) {
    if (partner.mark === 'none') {
        return null;
    }

    return (
        <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            aria-hidden="true"
            focusable="false"
            style={{ flex: 'none' }}
        >
            {partner.path ? (
                <path d={partner.path} />
            ) : (
                <>
                    <rect
                        className="q-ms q-ms-r"
                        x="1"
                        y="1"
                        width="10.5"
                        height="10.5"
                    />
                    <rect
                        className="q-ms q-ms-g"
                        x="12.5"
                        y="1"
                        width="10.5"
                        height="10.5"
                    />
                    <rect
                        className="q-ms q-ms-b"
                        x="1"
                        y="12.5"
                        width="10.5"
                        height="10.5"
                    />
                    <rect
                        className="q-ms q-ms-y"
                        x="12.5"
                        y="12.5"
                        width="10.5"
                        height="10.5"
                    />
                </>
            )}
        </svg>
    );
}

function PartnerList({ copy }: { copy?: boolean }) {
    return (
        <ul className="q-partners-list" aria-hidden={copy || undefined}>
            {PARTNERS.map((p) => (
                <li
                    key={p.name}
                    title={copy ? undefined : p.name}
                    style={
                        p.brand
                            ? ({ '--brand': p.brand } as React.CSSProperties)
                            : undefined
                    }
                >
                    <Mark partner={p} />
                    <span>{p.name}</span>
                </li>
            ))}
        </ul>
    );
}

export default function LandingLogos() {
    const { isRTL } = useLocale();
    const [paused, setPaused] = useState(false);

    return (
        <section className="q-partners" aria-labelledby="q-tech-title">
            <h2 id="q-tech-title" style={monoStyle}>
                {isRTL ? 'التقنيات التي نستخدمها' : 'Technologies we use'}
            </h2>
            <div className={paused ? 'q-carousel is-paused' : 'q-carousel'}>
                <div className="q-carousel-track">
                    <PartnerList />
                    <PartnerList copy />
                </div>
            </div>
            <button
                type="button"
                className="q-carousel-toggle"
                aria-pressed={paused}
                onClick={() => setPaused((v) => !v)}
            >
                {paused
                    ? isRTL
                        ? 'تشغيل الحركة'
                        : 'Play'
                    : isRTL
                      ? 'إيقاف الحركة'
                      : 'Pause'}
            </button>

            <style>{`
                .q-partners { position: relative; padding: 48px 0; border-top: 1px solid var(--q-line); border-bottom: 1px solid var(--q-line); text-align: center; }
                .q-partners h2 { margin: 0 0 28px; font-weight: 400; }
                [dir='rtl'] .q-partners h2 { letter-spacing: 0; text-transform: none; font-family: var(--font-arabic-sans) !important; font-size: 13px !important; }
                .q-carousel {
                    overflow: hidden;
                    -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
                    mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
                }
                .q-carousel-track { display: flex; width: max-content; animation: q-marquee 45s linear infinite; }
                [dir='rtl'] .q-carousel-track { animation-direction: reverse; }
                .q-carousel:hover .q-carousel-track,
                .q-carousel:focus-within .q-carousel-track,
                .q-carousel.is-paused .q-carousel-track { animation-play-state: paused; }
                .q-partners-list { list-style: none; margin: 0; padding: 0 clamp(14px, 2vw, 26px); display: flex; flex-wrap: nowrap; align-items: center; gap: clamp(28px, 4vw, 52px); }
                .q-partners-list li { display: inline-flex; align-items: center; gap: 12px; white-space: nowrap; color: var(--q-dim); font-family: var(--font-sans); font-size: 20px; font-weight: 500; letter-spacing: -0.01em; transition: color 200ms ease; }
                .q-partners-list li:hover { color: var(--q-cream); }
                .q-partners-list li:hover svg { fill: var(--brand, currentColor); }
                .q-partners-list li svg { fill: currentColor; }
                .q-partners-list li svg, .q-ms { transition: fill 200ms ease; }
                .q-partners-list li:hover .q-ms-r { fill: #f25022; }
                .q-partners-list li:hover .q-ms-g { fill: #7fba00; }
                .q-partners-list li:hover .q-ms-b { fill: #00a4ef; }
                .q-partners-list li:hover .q-ms-y { fill: #ffb900; }
                .q-carousel-toggle { position: absolute; bottom: 10px; inset-inline-end: clamp(16px, 4vw, 48px); background: transparent; border: 1px solid var(--q-line); color: var(--q-dim); padding: 5px 9px; font: 500 11px/1 var(--font-mono-brand); cursor: pointer; }
                .q-carousel-toggle:hover { color: var(--q-cream); border-color: var(--q-line-strong); }
                .q-carousel-toggle:focus-visible { outline: 2px solid var(--q-accent); outline-offset: 2px; }
                @media (prefers-reduced-motion: reduce) {
                    .q-carousel { -webkit-mask-image: none; mask-image: none; padding: 0 16px; }
                    .q-carousel-track { animation: none; width: auto; justify-content: center; }
                    .q-carousel-track > .q-partners-list[aria-hidden] { display: none; }
                    .q-partners-list { flex-wrap: wrap; justify-content: center; row-gap: 22px; }
                    .q-carousel-toggle { display: none; }
                    .q-partners-list li, .q-partners-list li svg, .q-ms { transition: none; }
                }
            `}</style>
        </section>
    );
}
