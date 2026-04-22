import { useRafTime } from '@/hooks/use-raf-time';

type Props = {
    accent?: string;
};

export default function EditorialCrystal({ accent = '#e8a84a' }: Props) {
    const t = useRafTime();
    const rot = t * 12;

    const facets = [
        {
            pts: '0,-160 120,-90 120,90 0,160 -120,90 -120,-90',
            fill: 'rgba(232,168,74,0.04)',
            stroke: 'rgba(232,228,214,0.55)',
        },
        {
            pts: '0,-160 70,-110 70,110 0,160 -70,110 -70,-110',
            fill: 'rgba(232,168,74,0.06)',
            stroke: 'rgba(232,228,214,0.35)',
        },
        {
            pts: '0,-160 30,-130 30,130 0,160 -30,130 -30,-130',
            fill: 'rgba(232,168,74,0.08)',
            stroke: 'rgba(232,228,214,0.25)',
        },
    ];

    return (
        <svg
            viewBox="-220 -220 440 440"
            width="100%"
            height="100%"
            style={{ display: 'block' }}
            aria-hidden
        >
            <g
                style={{
                    transform: `rotate(${rot}deg)`,
                    transformOrigin: 'center',
                }}
            >
                {facets.map((f, i) => (
                    <polygon
                        key={i}
                        points={f.pts}
                        fill={f.fill}
                        stroke={f.stroke}
                        strokeWidth="0.8"
                    />
                ))}
                <line
                    x1="0"
                    y1="-160"
                    x2="0"
                    y2="160"
                    stroke="rgba(232,228,214,0.3)"
                    strokeWidth="0.6"
                />
                <line
                    x1="-120"
                    y1="-90"
                    x2="120"
                    y2="90"
                    stroke="rgba(232,228,214,0.2)"
                    strokeWidth="0.6"
                />
                <line
                    x1="-120"
                    y1="90"
                    x2="120"
                    y2="-90"
                    stroke="rgba(232,228,214,0.2)"
                    strokeWidth="0.6"
                />
            </g>
            <g
                style={{
                    transform: `rotate(${-rot * 0.5}deg)`,
                    transformOrigin: 'center',
                }}
            >
                <circle
                    r="180"
                    fill="none"
                    stroke="rgba(232,168,74,0.18)"
                    strokeDasharray="1 6"
                />
            </g>
            <circle r="3" fill={accent} />
        </svg>
    );
}
