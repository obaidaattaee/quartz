import { useLocale } from '@/hooks/use-locale';

import { useLandingData } from './data';
import { B, monoStyle } from './tokens';

export default function LandingLogos() {
    const { logos } = useLandingData();
    const { isRTL } = useLocale();
    return (
        <section
            style={{
                padding: '56px 0',
                borderTop: `1px solid ${B.line}`,
                borderBottom: `1px solid ${B.line}`,
                overflow: 'hidden',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <span style={monoStyle}>
                    {isRTL
                        ? 'يثق بنا مشغّلون يبنون منتجات حقيقية'
                        : 'Trusted by operators shipping real things'}
                </span>
            </div>
            <div
                className="q-marquee-track"
                style={{
                    display: 'flex',
                    gap: 72,
                    animation: 'q-marquee 50s linear infinite',
                    whiteSpace: 'nowrap',
                }}
            >
                {[...logos, ...logos].map((l, i) => (
                    <span
                        key={i}
                        style={{
                            fontFamily: B.serif,
                            fontSize: 28,
                            fontWeight: 500,
                            color: B.dim,
                            display: 'inline-block',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        {l}
                    </span>
                ))}
            </div>
        </section>
    );
}
